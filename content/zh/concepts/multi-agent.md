# Multi-Agent Routing - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
多Agent
多Agent路由
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
基础概念
网关架构
Agent运行时
Agent循环
系统提示
上下文
Agent工作空间
OAuth
引导启动
引导启动
会话与记忆
会话管理
会话
会话修剪
会话 工具
记忆
压缩
多Agent
多Agent路由
在线状态
消息与传递
消息
流式传输与分块
重试策略
命令队列
本页内容
多Agent路由
What is “one 智能体”?
Paths (quick map)
Single-智能体 mode (default)
智能体 helper
Multiple 智能体 = multiple people, multiple personalities
One WhatsApp number, multiple people (DM split)
Routing rules (how messages pick an 智能体)
Multiple accounts / phone numbers
概念
示例： two WhatsApps → two 智能体
示例： WhatsApp daily chat + Telegram deep work
示例： same 频道, one peer到Opus
Family 智能体 bound到a WhatsApp group
Per-智能体 Sandbox与Tool 配置
​
多Agent路由
Goal: multiple
isolated
智能体 (separate 工作空间 +
agentDir
+ sessions), plus multiple 频道 accounts (e.g. two WhatsApps)在one 运行 网关. Inbound is routed到an 智能体 via bindings.
​
What is “one 智能体”?
An
智能体
is a fully scoped brain使用its own:
工作空间
(files, 智能体.md/SOUL.md/USER.md, local notes, persona rules).
State directory
(
agentDir
)为auth profiles, 模型 registry,与per-智能体 config.
会话 store
(chat history + routing state) under
~/.OpenClaw/智能体/<agentId>/sessions
.
Auth profiles are
per-智能体
. Each 智能体 reads从its own:
Copy
~/.OpenClaw/智能体/<agentId>/智能体/auth-profiles.JSON
Main 智能体 credentials are
not
shared automatically. Never reuse
agentDir
across 智能体 (it causes auth/会话 collisions). If you want到share creds,
copy
auth-profiles.JSON
into the other 智能体’s
agentDir
.
技能 are per-智能体 via each 工作空间’s
技能/
folder,使用shared 技能
available from
~/.OpenClaw/技能
. See
技能: per-智能体 vs shared
.
The 网关 can host
one 智能体
(default) or
many 智能体
side-by-side.
工作空间 note:
each 智能体’s 工作空间 is the
default cwd
, not a hard
sandbox. Relative paths resolve inside the 工作空间, but absolute paths can
reach other host locations unless sandboxing is enabled. See
Sandboxing
.
​
Paths (quick map)
Config:
~/.OpenClaw/OpenClaw.JSON
(or
OPENCLAW_CONFIG_PATH
)
State dir:
~/.OpenClaw
(or
OPENCLAW_STATE_DIR
)
工作空间:
~/.OpenClaw/工作空间
(or
~/.OpenClaw/工作空间-<agentId>
)
智能体 dir:
~/.OpenClaw/智能体/<agentId>/智能体
(or
智能体.list[].agentDir
)
会话:
~/.OpenClaw/智能体/<agentId>/sessions
​
Single-智能体 mode (default)
If you do nothing, OpenClaw runs a single 智能体:
agentId
defaults to
main
.
会话 are keyed as
智能体:main:<mainKey>
.
工作空间 defaults to
~/.OpenClaw/工作空间
(or
~/.OpenClaw/工作空间-<profile>
when
OPENCLAW_PROFILE
is set).
State defaults to
~/.OpenClaw/智能体/main/智能体
.
​
智能体 helper
Use the 智能体 向导到add a new isolated 智能体:
Copy
OpenClaw
智能体
add
work
Then add
bindings
(or let the 向导 do it)到route inbound messages.
Verify with:
Copy
OpenClaw
智能体
list
--bindings
​
Multiple 智能体 = multiple people, multiple personalities
With
multiple 智能体
, each
agentId
becomes a
fully isolated persona
:
Different phone numbers/accounts
(per 频道
accountId
).
Different personalities
(per-智能体 工作空间 files like
智能体.md
and
SOUL.md
).
Separate auth + sessions
(no cross-talk unless explicitly enabled).
This lets
multiple people
share one 网关 server while keeping their AI “brains”与data isolated.
​
One WhatsApp number, multiple people (DM split)
You can route
different WhatsApp DMs
to different 智能体 while staying on
one WhatsApp account
. Match在sender E.164 (like
+15551234567
) with
peer.kind: "direct"
. Replies still come从the same WhatsApp number (no per‑智能体 sender identity).
Important detail: direct chats collapse到the 智能体’s
main 会话 key
, so true isolation requires
one 智能体 per person
.
示例：
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
"alex"
,
工作空间
:
"~/.OpenClaw/工作空间-alex"
}
,
{
id
:
"mia"
,
工作空间
:
"~/.OpenClaw/工作空间-mia"
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
"alex"
,
match
:
{
频道
:
"WhatsApp"
,
peer
:
{
kind
:
"direct"
,
id
:
"+15551230001"
} }
,
}
,
{
agentId
:
"mia"
,
match
:
{
频道
:
"WhatsApp"
,
peer
:
{
kind
:
"direct"
,
id
:
"+15551230002"
} }
,
}
,
]
,
频道
:
{
WhatsApp
:
{
dmPolicy
:
"allowlist"
,
allowFrom
:
[
"+15551230001"
,
"+15551230002"
]
,
}
,
}
,
}
Notes:
DM access 控制 is
global per WhatsApp account
(pairing/allowlist), not per 智能体.
For shared groups, bind the group到one agent或use
Broadcast groups
.
​
Routing rules (how messages pick an 智能体)
Bindings are
deterministic
and
most-specific wins
:
peer
match (exact DM/group/频道 id)
parentPeer
match (thread inheritance)
guildId + roles
(Discord role routing)
guildId
(Discord)
teamId
(Slack)
accountId
match为a 频道
频道-level match (
accountId: "*"
)
fallback到default 智能体 (
智能体.list[].default
, else first list entry, default:
main
)
If a binding sets multiple match fields (for example
peer
+
guildId
), all specified fields are required (
AND
semantics).
​
Multiple accounts / phone numbers
频道那support
multiple accounts
(e.g. WhatsApp) use
accountId
to identify
each 登录. Each
accountId
can be routed到a different 智能体, so one server can host
multiple phone numbers without mixing sessions.
​
概念
agentId
: one “brain” (工作空间, per-智能体 auth, per-智能体 会话 store).
accountId
: one 频道 account instance (e.g. WhatsApp account
"personal"
vs
"biz"
).
binding
: routes inbound messages到an
agentId
by
(频道, accountId, peer)
and optionally guild/team ids.
Direct chats collapse to
智能体:<agentId>:<mainKey>
(per-智能体 “main”;
会话.mainKey
).
​
示例： two WhatsApps → two 智能体
~/.OpenClaw/OpenClaw.JSON
(JSON5):
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
name
:
"Home"
,
工作空间
:
"~/.OpenClaw/工作空间-home"
,
agentDir
:
"~/.OpenClaw/智能体/home/智能体"
,
}
,
{
id
:
"work"
,
name
:
"Work"
,
工作空间
:
"~/.OpenClaw/工作空间-work"
,
agentDir
:
"~/.OpenClaw/智能体/work/智能体"
,
}
,
]
,
}
,
// Deterministic routing: first match wins (most-specific first).
bindings
:
[
{ agentId
:
"home"
,
match
:
{ 频道
:
"WhatsApp"
,
accountId
:
"personal"
} }
,
{ agentId
:
"work"
,
match
:
{ 频道
:
"WhatsApp"
,
accountId
:
"biz"
} }
,
// Optional per-peer override (example: send a specific group到work 智能体).
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
"personal"
,
peer
:
{ kind
:
"group"
,
id
:
"
[email protected]
"
}
,
}
,
}
,
]
,
// Off通过default: 智能体-to-智能体 messaging must be explicitly enabled + allowlisted.
工具
:
{
agentToAgent
:
{
enabled
:
false
,
allow
:
[
"home"
,
"work"
]
,
}
,
}
,
频道
:
{
WhatsApp
:
{
accounts
:
{
personal
:
{
// Optional override. Default: ~/.OpenClaw/credentials/WhatsApp/personal
// authDir: "~/.OpenClaw/credentials/WhatsApp/personal",
}
,
biz
:
{
// Optional override. Default: ~/.OpenClaw/credentials/WhatsApp/biz
// authDir: "~/.OpenClaw/credentials/WhatsApp/biz",
}
,
}
,
}
,
}
,
}
​
示例： WhatsApp daily chat + Telegram deep work
Split通过channel: route WhatsApp到a fast everyday agent与Telegram到an Opus 智能体.
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
"chat"
,
name
:
"Everyday"
,
工作空间
:
"~/.OpenClaw/工作空间-chat"
,
模型
:
"anthropic/claude-sonnet-4-5"
,
}
,
{
id
:
"opus"
,
name
:
"Deep Work"
,
工作空间
:
"~/.OpenClaw/工作空间-opus"
,
模型
:
"anthropic/claude-opus-4-6"
,
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
"chat"
,
match
:
{
频道
:
"WhatsApp"
} }
,
{
agentId
:
"opus"
,
match
:
{
频道
:
"Telegram"
} }
,
]
,
}
Notes:
If you have multiple accounts为a 频道, add
accountId
to the binding (for example
{ 频道: "WhatsApp", accountId: "personal" }
).
To route a single DM/group到Opus while keeping the rest在chat, add a
match.peer
binding为that peer; peer matches always win over 频道-wide rules.
​
示例： same 频道, one peer到Opus
Keep WhatsApp在the fast 智能体, but route one DM到Opus:
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
"chat"
,
name
:
"Everyday"
,
工作空间
:
"~/.OpenClaw/工作空间-chat"
,
模型
:
"anthropic/claude-sonnet-4-5"
,
}
,
{
id
:
"opus"
,
name
:
"Deep Work"
,
工作空间
:
"~/.OpenClaw/工作空间-opus"
,
模型
:
"anthropic/claude-opus-4-6"
,
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
"opus"
,
match
:
{
频道
:
"WhatsApp"
,
peer
:
{
kind
:
"direct"
,
id
:
"+15551234567"
} }
,
}
,
{
agentId
:
"chat"
,
match
:
{
频道
:
"WhatsApp"
} }
,
]
,
}
Peer bindings always win, so keep them above the 频道-wide rule.
​
Family 智能体 bound到a WhatsApp group
Bind a dedicated family agent到a single WhatsApp group,使用mention gating
and a tighter 工具 policy:
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
"family"
,
name
:
"Family"
,
工作空间
:
"~/.OpenClaw/工作空间-family"
,
identity
:
{
name
:
"Family Bot"
}
,
groupChat
:
{
mentionPatterns
:
[
"@family"
,
"@familybot"
,
"@Family Bot"
]
,
}
,
sandbox
:
{
mode
:
"all"
,
scope
:
"智能体"
,
}
,
工具
:
{
allow
:
[
"执行"
,
"read"
,
"sessions_list"
,
"sessions_history"
,
"sessions_send"
,
"sessions_spawn"
,
"session_status"
,
]
,
deny
:
[
"write"
,
"edit"
,
"apply_patch"
,
"浏览器"
,
"画布"
,
"节点"
,
"cron"
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
bindings
:
[
{
agentId
:
"family"
,
match
:
{
频道
:
"WhatsApp"
,
peer
:
{
kind
:
"group"
,
id
:
"
[email protected]
"
}
,
}
,
}
,
]
,
}
Notes:
工具 allow/deny lists are
工具
, not 技能. If a skill needs到run a
binary, ensure
执行
is allowed与the binary exists在the sandbox.
For stricter gating, set
智能体.list[].groupChat.mentionPatterns
and keep
group allowlists enabled为the 频道.
​
Per-智能体 Sandbox与Tool 配置
Starting使用v2026.1.6, each 智能体 can have its own sandbox与tool restrictions:
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
"personal"
,
工作空间
:
"~/.OpenClaw/工作空间-personal"
,
sandbox
:
{
mode
:
"off"
,
// No sandbox为personal 智能体
}
,
// No 工具 restrictions - all 工具 available
}
,
{
id
:
"family"
,
工作空间
:
"~/.OpenClaw/工作空间-family"
,
sandbox
:
{
mode
:
"all"
,
// Always sandboxed
scope
:
"智能体"
,
// One container per 智能体
docker
:
{
// Optional one-time 设置 after container creation
setupCommand
:
"apt-get update && apt-get 安装 -y git curl"
,
}
,
}
,
工具
:
{
allow
:
[
"read"
]
,
// Only read 工具
deny
:
[
"执行"
,
"write"
,
"edit"
,
"apply_patch"
]
,
// Deny others
}
,
}
,
]
,
}
,
}
Note:
setupCommand
lives under
sandbox.docker
and runs once在container creation.
Per-智能体
sandbox.docker.*
overrides are ignored when the resolved scope is
"shared"
.
Benefits:
Security isolation
: Restrict 工具为untrusted 智能体
Resource 控制
: Sandbox specific 智能体 while keeping others在host
Flexible policies
: Different permissions per 智能体
Note:
工具.elevated
is
global
and sender-based; it is not configurable per 智能体.
If you need per-智能体 boundaries, use
智能体.list[].工具
to deny
执行
.
For group targeting, use
智能体.list[].groupChat.mentionPatterns
so @mentions map cleanly到the intended 智能体.
See
Multi-智能体 Sandbox & 工具
for detailed examples.
压缩
在线状态
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/multi-智能体)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*