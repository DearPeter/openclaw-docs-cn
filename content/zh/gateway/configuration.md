# 配置 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
配置与operations
配置
开始使用
安装
频道
智能体
工具
模型
平台
网关与运维
参考
帮助
网关
网关 Runbook
配置与operations
配置
配置 参考
配置 Examples
认证
Health Checks
Heartbeat
Doctor
Logging
网关 Lock
Background 执行与进程 工具
Multiple 网关s
Troubleshooting
Security与sandboxing
Protocols与APIs
Networking与discovery
Remote access
Remote Access
Remote 网关 设置
Tailscale
Security
Formal Verification (Security 模型)
网页 interfaces
网页
控制 UI
Dashboard
WebChat
TUI
本页内容
配置
Minimal config
Editing config
Strict validation
Common 任务
Config hot reload
Reload modes
What hot-applies vs what needs a restart
Config RPC (programmatic updates)
Environment variables
Full 参考
​
配置
OpenClaw reads an optional
JSON5
config from
~/.OpenClaw/OpenClaw.JSON
.
If the file is missing, OpenClaw uses safe defaults. Common reasons到add a config:
Connect 频道与控制 who can 消息 the bot
Set 模型, 工具, sandboxing,或automation (cron, hooks)
Tune sessions, media, networking,或UI
See the
full 参考
for every available field.
New到配置?
Start with
OpenClaw onboard
for interactive 设置,或check out the
配置 Examples
guide为complete copy-paste configs.
​
Minimal config
Copy
// ~/.OpenClaw/OpenClaw.JSON
{
智能体
:
{
defaults
:
{
工作空间
:
"~/.OpenClaw/工作空间"
} }
,
频道
:
{
WhatsApp
:
{
allowFrom
:
[
"+15555550123"
] } }
,
}
​
Editing config
Interactive 向导
命令行界面 (one-liners)
控制 UI
Direct edit
Copy
OpenClaw
onboard
# full 设置 向导
OpenClaw
配置
# config 向导
Copy
OpenClaw
config
get
智能体.defaults.工作空间
OpenClaw
config
set
智能体.defaults.heartbeat.every
"2h"
OpenClaw
config
unset
工具.网页.搜索.apiKey
Open
http://127.0.0.1:18789
and use the
Config
tab.
The 控制 UI renders a form从the config schema,使用a
Raw JSON
editor as an escape hatch.
Edit
~/.OpenClaw/OpenClaw.JSON
directly. The 网关 watches the file与applies changes automatically (see
hot reload
).
​
Strict validation
OpenClaw only accepts configurations那fully match the schema. Unknown keys, malformed types,或invalid values cause the 网关 to
refuse到start
. The only root-level exception is
$schema
(string), so editors can attach JSON Schema metadata.
When validation fails:
The 网关 does not boot
Only diagnostic commands work (
OpenClaw doctor
,
OpenClaw logs
,
OpenClaw health
,
OpenClaw status
)
Run
OpenClaw doctor
to see exact issues
Run
OpenClaw doctor --fix
(or
--yes
)到apply repairs
​
Common 任务
Set up a 频道 (WhatsApp, Telegram, Discord, etc.)
Each 频道 has its own config section under
频道.<provider>
. See the dedicated 频道 page为设置 steps:
WhatsApp
—
频道.WhatsApp
Telegram
—
频道.Telegram
Discord
—
频道.Discord
Slack
—
频道.Slack
Signal
—
频道.signal
iMessage
—
频道.imessage
Google Chat
—
频道.googlechat
Mattermost
—
频道.mattermost
MS Teams
—
频道.msteams
All 频道 share the same DM policy pattern:
Copy
{
频道
:
{
Telegram
:
{
enabled
:
true
,
botToken
:
"123:abc"
,
dmPolicy
:
"pairing"
,
// pairing | allowlist | open | disabled
allowFrom
:
[
"tg:123"
]
,
// only为allowlist/open
}
,
}
,
}
Choose与configure 模型
Set the primary model与optional fallbacks:
Copy
{
智能体
:
{
defaults
:
{
模型
:
{
primary
:
"anthropic/claude-sonnet-4-5"
,
fallbacks
:
[
"openai/gpt-5.2"
]
,
}
,
模型
:
{
"anthropic/claude-sonnet-4-5"
:
{
alias
:
"Sonnet"
}
,
"openai/gpt-5.2"
:
{
alias
:
"GPT"
}
,
}
,
}
,
}
,
}
智能体.defaults.模型
defines the 模型 catalog与acts as the allowlist for
/模型
.
模型引用 use
provider/模型
format (e.g.
anthropic/claude-opus-4-6
).
See
模型 命令行界面
for switching 模型在chat and
模型 Failover
for auth rotation与fallback behavior.
For custom/self-hosted 提供者, see
Custom 提供者
in the 参考.
控制 who can 消息 the bot
DM access is controlled per 频道 via
dmPolicy
:
"pairing"
(default): unknown senders get a one-time pairing code到approve
"allowlist"
: only senders in
allowFrom
(or the paired allow store)
"open"
: allow all inbound DMs (requires
allowFrom: ["*"]
)
"disabled"
: ignore all DMs
For groups, use
groupPolicy
+
groupAllowFrom
or 频道-specific allowlists.
See the
full 参考
for per-频道 details.
Set up group chat mention gating
Group messages default to
require mention
. 配置 patterns per 智能体:
Copy
{
智能体
:
{
list
:
[
{
id
:
"main"
,
groupChat
:
{
mentionPatterns
:
[
"@OpenClaw"
,
"OpenClaw"
]
,
}
,
}
,
]
,
}
,
频道
:
{
WhatsApp
:
{
groups
:
{
"*"
:
{
requireMention
:
true
} }
,
}
,
}
,
}
Metadata mentions
: native @-mentions (WhatsApp tap-to-mention, Telegram @bot, etc.)
Text patterns
: regex patterns in
mentionPatterns
See
full 参考
for per-频道 overrides与self-chat mode.
配置 sessions与resets
会话 控制 conversation continuity与isolation:
Copy
{
会话
:
{
dmScope
:
"per-频道-peer"
,
// recommended为multi-user
reset
:
{
mode
:
"daily"
,
atHour
:
4
,
idleMinutes
:
120
,
}
,
}
,
}
dmScope
:
main
(shared) |
per-peer
|
per-频道-peer
|
per-account-频道-peer
See
会话管理
for scoping, identity links,与send policy.
See
full 参考
for all fields.
Enable sandboxing
Run 智能体 sessions在isolated Docker containers:
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
mode
:
"non-main"
,
// off | non-main | all
scope
:
"智能体"
,
// 会话 | 智能体 | shared
}
,
}
,
}
,
}
构建 the image first:
scripts/sandbox-设置.sh
See
Sandboxing
for the full guide and
full 参考
for all options.
Set up heartbeat (periodic check-ins)
Copy
{
智能体
:
{
defaults
:
{
heartbeat
:
{
every
:
"30m"
,
target
:
"last"
,
}
,
}
,
}
,
}
every
: duration string (
30m
,
2h
). Set
0m
to disable.
target
:
last
|
WhatsApp
|
Telegram
|
Discord
|
none
See
Heartbeat
for the full guide.
配置 cron jobs
Copy
{
cron
:
{
enabled
:
true
,
maxConcurrentRuns
:
2
,
sessionRetention
:
"24h"
,
}
,
}
See
Cron jobs
for the feature 概述与命令行界面 examples.
Set up webhooks (hooks)
Enable HTTP webhook endpoints在the 网关:
Copy
{
hooks
:
{
enabled
:
true
,
token
:
"shared-secret"
,
path
:
"/hooks"
,
default会话Key
:
"hook:ingress"
,
allowRequest会话Key
:
false
,
allowed会话KeyPrefixes
:
[
"hook:"
]
,
mappings
:
[
{
match
:
{
path
:
"gmail"
}
,
action
:
"智能体"
,
agentId
:
"main"
,
deliver
:
true
,
}
,
]
,
}
,
}
See
full 参考
for all mapping options与Gmail 集成.
配置 multi-智能体 routing
Run multiple isolated Agent使用separate workspaces与sessions:
Copy
{
智能体
:
{
list
:
[
{
id
:
"home"
,
default
:
true
,
工作空间
:
"~/.OpenClaw/工作空间-home"
}
,
{
id
:
"work"
,
工作空间
:
"~/.OpenClaw/工作空间-work"
}
,
]
,
}
,
bindings
:
[
{
agentId
:
"home"
,
match
:
{
频道
:
"WhatsApp"
,
accountId
:
"personal"
} }
,
{
agentId
:
"work"
,
match
:
{
频道
:
"WhatsApp"
,
accountId
:
"biz"
} }
,
]
,
}
See
Multi-智能体
and
full 参考
for binding rules与per-智能体 access profiles.
Split config into multiple files ($include)
Use
$include
to organize large configs:
Copy
// ~/.OpenClaw/OpenClaw.JSON
{
网关
:
{
port
:
18789 }
,
智能体
:
{ $
include
:
"./智能体.json5"
}
,
broadcast
:
{
$
include
:
[
"./clients/a.json5"
,
"./clients/b.json5"
]
,
}
,
}
Single file
: replaces the containing object
Array的files
: deep-merged在order (later wins)
Sibling keys
: merged after includes (override included values)
Nested includes
: supported up到10 levels deep
Relative paths
: resolved relative到the including file
Error handling
: clear errors为missing files, parse errors,与circular includes
​
Config hot reload
The 网关 watches
~/.OpenClaw/OpenClaw.JSON
and applies changes automatically — no manual restart needed为most settings.
​
Reload modes
Mode
Behavior
hybrid
(default)
Hot-applies safe changes instantly. Automatically restarts为critical ones.
hot
Hot-applies safe changes only. Logs a warning when a restart is needed — you handle it.
restart
Restarts the 网关在any config change, safe或not.
off
Disables file watching. Changes take effect在the next manual restart.
Copy
{
网关
:
{
reload
:
{
mode
:
"hybrid"
,
debounceMs
:
300 }
,
}
,
}
​
What hot-applies vs what needs a restart
Most fields hot-apply without downtime. In
hybrid
mode, restart-required changes are handled automatically.
Category
Fields
Restart needed?
频道
频道.*
,
网页
(WhatsApp) — all built-in与extension 频道
No
智能体 & 模型
智能体
,
智能体
,
模型
,
routing
No
Automation
hooks
,
cron
,
智能体.heartbeat
No
会话 & messages
会话
,
messages
No
工具 & media
工具
,
浏览器
,
技能
,
audio
,
talk
No
UI & misc
ui
,
logging
,
identity
,
bindings
No
网关 server
网关.*
(port, bind, auth, tailscale, TLS, HTTP)
Yes
Infrastructure
discovery
,
canvasHost
,
plugins
Yes
网关.reload
and
网关.remote
are exceptions — changing them does
not
trigger a restart.
​
Config RPC (programmatic updates)
config.apply (full replace)
Validates + writes the full config与restarts the 网关在one step.
config.apply
replaces the
entire config
. Use
config.patch
for partial updates, or
OpenClaw config set
for single keys.
Params:
raw
(string) — JSON5 payload为the entire config
baseHash
(optional) — config hash from
config.get
(required when config exists)
sessionKey
(optional) — 会话 key为the post-restart wake-up ping
note
(optional) — note为the restart sentinel
restartDelayMs
(optional) — delay before restart (default 2000)
Copy
OpenClaw
网关
call
config.get
--params
'{}'
# capture payload.hash
OpenClaw
网关
call
config.apply
--params
'{
"raw": "{ 智能体: { defaults: { 工作空间: \"~/.OpenClaw/工作空间\" } } }",
"baseHash": "<hash>",
"sessionKey": "智能体:main:WhatsApp:dm:+15555550123"
}'
config.patch (partial update)
Merges a partial update into the existing config (JSON merge patch semantics):
Objects merge recursively
null
deletes a key
Arrays replace
Params:
raw
(string) — JSON5使用just the keys到change
baseHash
(required) — config hash from
config.get
sessionKey
,
note
,
restartDelayMs
— same as
config.apply
Copy
OpenClaw
网关
call
config.patch
--params
'{
"raw": "{ 频道: { Telegram: { groups: { \"*\": { requireMention: false } } } } }",
"baseHash": "<hash>"
}'
​
Environment variables
OpenClaw reads env vars从the parent 进程 plus:
.env
from the current 工作目录 (if present)
~/.OpenClaw/.env
(global fallback)
Neither file overrides existing env vars. You can also set inline env vars在config:
Copy
{
env
:
{
OPENROUTER_API_KEY
:
"sk-or-..."
,
vars
:
{
GROQ_API_KEY
:
"gsk-..."
}
,
}
,
}
Shell env import (optional)
If enabled与expected keys aren’t set, OpenClaw runs your 登录 shell与imports only the missing keys:
Copy
{
env
:
{
shellEnv
:
{
enabled
:
true
,
timeoutMs
:
15000 }
,
}
,
}
Env var equivalent:
OPENCLAW_LOAD_SHELL_ENV=1
Env var substitution在config values
参考 env vars在any config string value with
${VAR_NAME}
:
Copy
{
网关
:
{
auth
:
{
token
:
"${OPENCLAW_GATEWAY_TOKEN}"
} }
,
模型
:
{
提供者
:
{
custom
:
{
apiKey
:
"${CUSTOM_API_KEY}"
} } }
,
}
Rules:
Only uppercase names matched:
[A-Z_][A-Z0-9_]*
Missing/empty vars throw an error在load time
Escape with
$${VAR}
for literal output
Works inside
$include
files
Inline substitution:
"${BASE}/v1"
→
"https://api.example.com/v1"
See
Environment
for full precedence与sources.
​
Full 参考
For the complete field-by-field 参考, see
配置 参考
.
Related:
配置 Examples
·
配置 参考
·
Doctor
网关 Runbook
配置 参考
I
[查看英文原版](https://docs.OpenClaw.ai/网关/配置#会话)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*