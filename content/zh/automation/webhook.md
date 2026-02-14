# Webhooks - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Webhooks
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
概述
工具
内置工具
Lobster
LLM任务
执行 工具
网页 工具
apply_patch 工具
Elevated Mode
Thinking Levels
Reactions
浏览器
浏览器 (OpenClaw-managed)
浏览器 登录
Chrome Extension
浏览器 Troubleshooting
智能体 coordination
智能体 Send
Sub-智能体
Multi-智能体 Sandbox & 工具
技能
Slash Commands
技能
技能 Config
ClawHub
Plugins
Extensions
Voice Call Plugin
Zalo Personal Plugin
Automation
Hooks
Cron Jobs
Cron vs Heartbeat
Automation Troubleshooting
Webhooks
Gmail PubSub
Polls
Auth Monitoring
Media与devices
节点
Node Troubleshooting
Image与Media Support
Audio与Voice Notes
Camera Capture
Talk Mode
Voice Wake
Location Command
本页内容
Webhooks
Enable
Auth
Endpoints
POST /hooks/wake
POST /hooks/智能体
会话 key policy (breaking change)
POST /hooks/<name> (mapped)
Responses
Examples
Use a different 模型
Security
​
Webhooks
网关 can expose a small HTTP webhook endpoint为external triggers.
​
Enable
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
// Optional: restrict explicit `agentId` routing到this allowlist.
// Omit或include "*"到allow any 智能体.
// Set []到deny all explicit `agentId` routing.
allowedAgentIds
:
[
"hooks"
,
"main"
]
,
}
,
}
Notes:
hooks.token
is required when
hooks.enabled=true
.
hooks.path
defaults to
/hooks
.
​
Auth
Every request must include the hook token. Prefer headers:
授权: Bearer <token>
(recommended)
x-OpenClaw-token: <token>
Query-string tokens are rejected (
?token=...
returns
400
).
​
Endpoints
​
POST /hooks/wake
Payload:
Copy
{
"text"
:
"System line"
,
"mode"
:
"now"
}
text
required
(string): The description的the event (e.g., “New email received”).
mode
optional (
now
|
next-heartbeat
): Whether到trigger an immediate heartbeat (default
now
)或wait为the next periodic check.
Effect:
Enqueues a system event为the
main
会话
If
mode=now
, triggers an immediate heartbeat
​
POST /hooks/智能体
Payload:
Copy
{
"消息"
:
"Run this"
,
"name"
:
"Email"
,
"agentId"
:
"hooks"
,
"sessionKey"
:
"hook:email:msg-123"
,
"wakeMode"
:
"now"
,
"deliver"
:
true
,
"频道"
:
"last"
,
"to"
:
"+15551234567"
,
"模型"
:
"openai/gpt-5.2-mini"
,
"thinking"
:
"low"
,
"timeoutSeconds"
:
120
}
消息
required
(string): The prompt或消息为the agent到进程.
name
optional (string): Human-readable name为the hook (e.g., “GitHub”), used as a prefix在会话 summaries.
agentId
optional (string): Route这hook到a specific 智能体. Unknown IDs fall back到the default 智能体. When set, the hook runs using the resolved 智能体’s 工作空间与配置.
sessionKey
optional (string): The key used到identify the 智能体’s 会话. By default这field is rejected unless
hooks.allowRequest会话Key=true
.
wakeMode
optional (
now
|
next-heartbeat
): Whether到trigger an immediate heartbeat (default
now
)或wait为the next periodic check.
deliver
optional (boolean): If
true
, the 智能体’s response will be sent到the messaging 频道. Defaults to
true
. Responses那are only heartbeat acknowledgments are automatically skipped.
频道
optional (string): The messaging channel为delivery. One of:
last
,
WhatsApp
,
Telegram
,
Discord
,
Slack
,
mattermost
(plugin),
signal
,
imessage
,
msteams
. Defaults to
last
.
to
optional (string): The recipient identifier为the 频道 (e.g., phone number为WhatsApp/Signal, chat ID为Telegram, 频道 ID为Discord/Slack/Mattermost (plugin), conversation ID为MS Teams). Defaults到the last recipient在the main 会话.
模型
optional (string): 模型 override (e.g.,
anthropic/claude-3-5-sonnet
or an alias). Must be在the allowed 模型 list if restricted.
thinking
optional (string): Thinking level override (e.g.,
low
,
medium
,
high
).
timeoutSeconds
optional (number): Maximum duration为the 智能体 run在seconds.
Effect:
Runs an
isolated
智能体 turn (own 会话 key)
Always posts a summary into the
main
会话
If
wakeMode=now
, triggers an immediate heartbeat
​
会话 key policy (breaking change)
/hooks/智能体
payload
sessionKey
overrides are disabled通过default.
Recommended: set a fixed
hooks.default会话Key
and keep request overrides off.
Optional: allow request overrides only when needed,与restrict prefixes.
Recommended config:
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
"${OPENCLAW_HOOKS_TOKEN}"
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
}
,
}
Compatibility config (legacy behavior):
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
"${OPENCLAW_HOOKS_TOKEN}"
,
allowRequest会话Key
:
true
,
allowed会话KeyPrefixes
:
[
"hook:"
]
,
// strongly recommended
}
,
}
​
POST /hooks/<name>
(mapped)
Custom hook names are resolved via
hooks.mappings
(see 配置). A mapping can
turn arbitrary payloads into
wake
or
智能体
actions,使用optional templates or
code transforms.
Mapping options (summary):
hooks.presets: ["gmail"]
enables the built-in Gmail mapping.
hooks.mappings
lets you define
match
,
action
,与templates在config.
hooks.transformsDir
+
transform.module
loads a JS/TS module为custom logic.
Use
match.source
to keep a generic ingest endpoint (payload-driven routing).
TS transforms require a TS loader (e.g.
bun
or
tsx
)或precompiled
.js
at 运行时.
Set
deliver: true
+
频道
/
to
on mappings到route replies到a chat surface
(
频道
defaults to
last
and falls back到WhatsApp).
agentId
routes the hook到a specific 智能体; unknown IDs fall back到the default 智能体.
hooks.allowedAgentIds
restricts explicit
agentId
routing. Omit it (or include
*
)到allow any 智能体. Set
[]
to deny explicit
agentId
routing.
hooks.default会话Key
sets the default 会话为hook 智能体 runs when no explicit key is provided.
hooks.allowRequest会话Key
controls whether
/hooks/智能体
payloads may set
sessionKey
(default:
false
).
hooks.allowed会话KeyPrefixes
optionally restricts explicit
sessionKey
values从request payloads与mappings.
allowUnsafeExternalContent: true
disables the external content safety wrapper为that hook
(dangerous; only为trusted internal sources).
OpenClaw webhooks gmail 设置
writes
hooks.gmail
config for
OpenClaw webhooks gmail run
.
See
Gmail Pub/Sub
for the full Gmail watch flow.
​
Responses
200
for
/hooks/wake
202
for
/hooks/智能体
(async run started)
401
on auth failure
429
after repeated auth failures从the same client (check
重试-After
)
400
on invalid payload
413
on oversized payloads
​
Examples
Copy
curl
-X
POST
http://127.0.0.1:18789/hooks/wake
\
-H
'授权: Bearer SECRET'
\
-H
'Content-Type: 应用/JSON'
\
-d
'{"text":"New email received","mode":"now"}'
Copy
curl
-X
POST
http://127.0.0.1:18789/hooks/智能体
\
-H
'x-OpenClaw-token: SECRET'
\
-H
'Content-Type: 应用/JSON'
\
-d
'{"消息":"Summarize inbox","name":"Email","wakeMode":"next-heartbeat"}'
​
Use a different 模型
Add
模型
to the 智能体 payload (or mapping)到override the model为that run:
Copy
curl
-X
POST
http://127.0.0.1:18789/hooks/智能体
\
-H
'x-OpenClaw-token: SECRET'
\
-H
'Content-Type: 应用/JSON'
\
-d
'{"消息":"Summarize inbox","name":"Email","模型":"openai/gpt-5.2-mini"}'
If you enforce
智能体.defaults.模型
, make sure the override 模型 is included there.
Copy
curl
-X
POST
http://127.0.0.1:18789/hooks/gmail
\
-H
'授权: Bearer SECRET'
\
-H
'Content-Type: 应用/JSON'
\
-d
'{"source":"gmail","messages":[{"from":"Ada","subject":"Hello","snippet":"Hi"}]}'
​
Security
Keep hook endpoints behind loopback, tailnet,或trusted reverse proxy.
Use a dedicated hook token; do not reuse 网关 auth tokens.
Repeated auth failures are rate-limited per client address到slow brute-force attempts.
If you use multi-智能体 routing, set
hooks.allowedAgentIds
to limit explicit
agentId
selection.
Keep
hooks.allowRequest会话Key=false
unless you require caller-selected sessions.
If you enable request
sessionKey
, restrict
hooks.allowed会话KeyPrefixes
(for example,
["hook:"]
).
Avoid including sensitive raw payloads在webhook logs.
Hook payloads are treated as untrusted与wrapped使用safety boundaries通过default.
If you must disable this为a specific hook, set
allowUnsafeExternalContent: true
in那hook’s mapping (dangerous).
Automation Troubleshooting
Gmail PubSub
I
[查看英文原版](https://docs.OpenClaw.ai/automation/webhook)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*