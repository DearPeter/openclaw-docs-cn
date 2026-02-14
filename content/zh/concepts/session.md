# 会话 管理 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
会话与记忆
会话管理
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
会话管理
Secure DM mode (recommended为multi-user setups)
网关 is the source的truth
Where state lives
会话 修剪
Pre-压缩 记忆 flush
Mapping transports → 会话 keys
Lifecycle
Send policy (optional)
配置 (optional rename example)
Inspecting
Tips
会话 origin metadata
​
会话管理
OpenClaw treats
one direct-chat 会话 per 智能体
as primary. Direct chats collapse to
智能体:<agentId>:<mainKey>
(default
main
), while group/频道 chats get their own keys.
会话.mainKey
is honored.
Use
会话.dmScope
to 控制 how
direct messages
are grouped:
main
(default): all DMs share the main 会话为continuity.
per-peer
: isolate通过sender id across 频道.
per-频道-peer
: isolate通过channel + sender (recommended为multi-user inboxes).
per-account-频道-peer
: isolate通过account + 频道 + sender (recommended为multi-account inboxes).
Use
会话.identityLinks
to map provider-prefixed peer ids到a canonical identity so the same person shares a DM 会话 across 频道 when using
per-peer
,
per-频道-peer
, or
per-account-频道-peer
.
​
Secure DM mode (recommended为multi-user setups)
Security 警告：
If your 智能体 can receive DMs from
multiple people
, you should strongly consider enabling secure DM mode. Without it, all users share the same conversation 上下文, which can leak private information between users.
Example的the problem使用default settings:
Alice (
<SENDER_A>
) messages your 智能体 about a private topic (for example, a medical appointment)
Bob (
<SENDER_B>
) messages your 智能体 asking “What were we talking about?”
Because both DMs share the same 会话, the 模型 may answer Bob using Alice’s prior 上下文.
The fix:
Set
dmScope
to isolate sessions per user:
Copy
// ~/.OpenClaw/OpenClaw.JSON
{
会话
:
{
// Secure DM mode: isolate DM 上下文 per 频道 + sender.
dmScope
:
"per-频道-peer"
,
}
,
}
When到enable this:
You have pairing approvals为more than one sender
You use a DM allowlist使用multiple entries
You set
dmPolicy: "open"
Multiple phone numbers或accounts can 消息 your 智能体
Notes:
Default is
dmScope: "main"
for continuity (all DMs share the main 会话). 这是 fine为single-user setups.
For multi-account inboxes在the same 频道, prefer
per-account-频道-peer
.
If the same person contacts you在multiple 频道, use
会话.identityLinks
to collapse their DM sessions into one canonical identity.
You can verify your DM settings with
OpenClaw security audit
(see
security
).
​
网关 is the source的truth
All 会话 state is
owned通过the 网关
(the “master” OpenClaw). UI clients (macOS app, WebChat, etc.) must query the 网关为会话 lists与token counts instead的reading local files.
In
remote mode
, the 会话 store you care about lives在the remote 网关 host, not your Mac.
Token counts shown在UIs come从the 网关’s store fields (
inputTokens
,
outputTokens
,
totalTokens
,
contextTokens
). Clients do not parse JSONL transcripts到“fix up” totals.
​
Where state lives
On the
网关 host
:
Store file:
~/.OpenClaw/智能体/<agentId>/sessions/sessions.JSON
(per 智能体).
Transcripts:
~/.OpenClaw/智能体/<agentId>/sessions/<会话Id>.jsonl
(Telegram topic sessions use
.../<会话Id>-topic-<threadId>.jsonl
).
The store is a map
sessionKey -> { sessionId, updatedAt, ... }
. Deleting entries is safe; they are recreated在demand.
Group entries may include
displayName
,
频道
,
subject
,
room
, and
space
to label sessions在UIs.
会话 entries include
origin
metadata (label + routing hints) so UIs can explain where a 会话 came from.
OpenClaw does
not
read legacy Pi/Tau 会话 folders.
​
会话 修剪
OpenClaw trims
old 工具 results
from the in-记忆 上下文 right before LLM calls通过default.
This does
not
rewrite JSONL history. See
/concepts/会话-修剪
.
​
Pre-压缩 记忆 flush
When a 会话 nears auto-压缩, OpenClaw can run a
silent 记忆 flush
turn那reminds the model到write durable notes到disk. This only runs when
the 工作空间 is writable. See
记忆
and
压缩
.
​
Mapping transports → 会话 keys
Direct chats follow
会话.dmScope
(default
main
).
main
:
智能体:<agentId>:<mainKey>
(continuity across devices/频道).
Multiple phone numbers与频道 can map到the same 智能体 main key; they act as transports into one conversation.
per-peer
:
智能体:<agentId>:dm:<peerId>
.
per-频道-peer
:
智能体:<agentId>:<频道>:dm:<peerId>
.
per-account-频道-peer
:
智能体:<agentId>:<频道>:<accountId>:dm:<peerId>
(accountId defaults to
default
).
If
会话.identityLinks
matches a provider-prefixed peer id (for example
Telegram:123
), the canonical key replaces
<peerId>
so the same person shares a 会话 across 频道.
Group chats isolate state:
智能体:<agentId>:<频道>:group:<id>
(rooms/频道 use
智能体:<agentId>:<频道>:频道:<id>
).
Telegram forum topics append
:topic:<threadId>
to the group id为isolation.
Legacy
group:<id>
keys are still recognized为migration.
Inbound contexts may still use
group:<id>
; the 频道 is inferred from
Provider
and normalized到the canonical
智能体:<agentId>:<频道>:group:<id>
form.
Other sources:
Cron jobs:
cron:<job.id>
Webhooks:
hook:<uuid>
(unless explicitly set通过the hook)
Node runs:
node-<nodeId>
​
Lifecycle
Reset policy: sessions are reused until they expire,与expiry is evaluated在the next inbound 消息.
Daily reset: defaults to
4:00 AM local time在the 网关 host
. A 会话 is stale once its last update is earlier than the most recent daily reset time.
Idle reset (optional):
idleMinutes
adds a sliding idle window. When both daily与idle resets are configured,
whichever expires first
forces a new 会话.
Legacy idle-only: if you set
会话.idleMinutes
without any
会话.reset
/
resetByType
config, OpenClaw stays在idle-only mode为backward compatibility.
Per-type overrides (optional):
resetByType
lets you override the policy for
direct
,
group
, and
thread
sessions (thread = Slack/Discord threads, Telegram topics, Matrix threads when provided通过the connector).
Per-频道 overrides (optional):
resetByChannel
overrides the reset policy为a 频道 (applies到all 会话 types为that channel与takes precedence over
reset
/
resetByType
).
Reset triggers: exact
/new
or
/reset
(plus any extras in
resetTriggers
) start a fresh 会话 id与pass the remainder的the 消息 through.
/new <模型>
accepts a 模型 alias,
provider/模型
,或provider name (fuzzy match)到set the new 会话 模型. If
/new
or
/reset
is sent alone, OpenClaw runs a short “hello” greeting turn到confirm the reset.
Manual reset: delete specific keys从the store或remove the JSONL transcript; the next 消息 recreates them.
Isolated cron jobs always mint a fresh
sessionId
per run (no idle reuse).
​
Send policy (optional)
Block delivery为specific 会话 types without listing individual ids.
Copy
{
会话
:
{
sendPolicy
:
{
rules
:
[
{
action
:
"deny"
,
match
:
{
频道
:
"Discord"
,
chatType
:
"group"
} }
,
{
action
:
"deny"
,
match
:
{
keyPrefix
:
"cron:"
} }
,
]
,
default
:
"allow"
,
}
,
}
,
}
运行时 override (owner only):
/send on
→ allow为this 会话
/send off
→ deny为this 会话
/send inherit
→ clear override与use config rules
Send这些as standalone messages so they register.
​
配置 (optional rename example)
Copy
// ~/.OpenClaw/OpenClaw.JSON
{
会话
:
{
scope
:
"per-sender"
,
// keep group keys separate
dmScope
:
"main"
,
// DM continuity (set per-频道-peer/per-account-频道-peer为shared inboxes)
identityLinks
:
{
alice
:
[
"Telegram:123456789"
,
"Discord:987654321012345678"
]
,
}
,
reset
:
{
// Defaults: mode=daily, atHour=4 (网关 host local time).
// If you also set idleMinutes, whichever expires first wins.
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
resetByType
:
{
thread
:
{
mode
:
"daily"
,
atHour
:
4 }
,
direct
:
{
mode
:
"idle"
,
idleMinutes
:
240 }
,
group
:
{
mode
:
"idle"
,
idleMinutes
:
120 }
,
}
,
resetByChannel
:
{
Discord
:
{
mode
:
"idle"
,
idleMinutes
:
10080 }
,
}
,
resetTriggers
:
[
"/new"
,
"/reset"
]
,
store
:
"~/.OpenClaw/智能体/{agentId}/sessions/sessions.JSON"
,
mainKey
:
"main"
,
}
,
}
​
Inspecting
OpenClaw status
— shows store path与recent sessions.
OpenClaw sessions --JSON
— dumps every entry (filter with
--active <minutes>
).
OpenClaw 网关 call sessions.list --params '{}'
— 获取 sessions从the 运行 网关 (use
--url
/
--token
for remote 网关 access).
Send
/status
as a standalone 消息在chat到see whether the 智能体 is reachable, how much的the 会话 上下文 is used, current thinking/verbose toggles,与when your WhatsApp 网页 creds were last refreshed (helps spot relink needs).
Send
/上下文 list
or
/上下文 detail
to see what’s在the system prompt与injected 工作空间 files (and the biggest 上下文 contributors).
Send
/stop
as a standalone 消息到abort the current run, clear queued followups为that 会话,与stop any sub-智能体 runs spawned从it (the reply includes the stopped count).
Send
/compact
(optional instructions) as a standalone 消息到summarize older 上下文与free up window space. See
/concepts/压缩
.
JSONL transcripts can be opened directly到review full turns.
​
Tips
Keep the primary key dedicated到1:1 traffic; let groups keep their own keys.
When automating cleanup, delete individual keys instead的the whole store到preserve 上下文 elsewhere.
​
会话 origin metadata
Each 会话 entry records where it came从(best-effort) in
origin
:
label
: human label (resolved从conversation label + group subject/频道)
provider
: normalized 频道 id (including extensions)
from
/
to
: raw routing ids从the inbound envelope
accountId
: provider account id (when multi-account)
threadId
: thread/topic id when the 频道 supports it
The origin fields are populated为direct messages, 频道,与groups. If a
connector only updates delivery routing (for example,到keep a DM main 会话
fresh), it should still provide inbound 上下文 so the 会话 keeps its
explainer metadata. Extensions can do this通过发送
ConversationLabel
,
GroupSubject
,
GroupChannel
,
GroupSpace
, and
SenderName
in the inbound
上下文与calling
record会话MetaFromInbound
(or passing the same 上下文
to
updateLastRoute
).
引导启动
会话
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/会话#mapping-transports-→-会话-keys)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*