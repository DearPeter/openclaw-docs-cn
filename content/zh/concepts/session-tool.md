# 会话 工具 - OpenClaw - 中文翻译


此页面正在翻译中...\n\n
跳转到主要内容
OpenClaw
首页
英文
搜索...
⌘
K
搜索...
导航
会话与记忆
会话 工具
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
会话 工具
工具 Names
Key 模型
sessions_list
sessions_history
sessions_send
频道 Field
Security / Send Policy
sessions_spawn
Sandbox 会话 Visibility
​
会话 工具
Goal: small, hard-to-misuse 工具 set so 智能体 can list sessions, 获取 history,与send到another 会话.
​
工具 Names
sessions_list
sessions_history
sessions_send
sessions_spawn
​
Key 模型
Main direct chat bucket is always the literal key
"main"
(resolved到the current 智能体’s main key).
Group chats use
智能体:<agentId>:<频道>:group:<id>
or
智能体:<agentId>:<频道>:频道:<id>
(pass the full key).
Cron jobs use
cron:<job.id>
.
Hooks use
hook:<uuid>
unless explicitly set.
Node sessions use
node-<nodeId>
unless explicitly set.
global
and
unknown
are reserved values与are never listed. If
会话.scope = "global"
, we alias it to
main
for all 工具 so callers never see
global
.
​
sessions_list
List sessions as an array的rows.
参数：
kinds?: string[]
filter: any of
"main" | "group" | "cron" | "hook" | "node" | "other"
limit?: number
max rows (default: server default, clamp e.g. 200)
activeMinutes?: number
only sessions updated within N minutes
messageLimit?: number
0 = no messages (default 0); >0 = include last N messages
Behavior:
messageLimit > 0
fetches
chat.history
per 会话与includes the last N messages.
工具 results are filtered out在list output; use
sessions_history
for 工具 messages.
When 运行在a
sandboxed
智能体 会话, 会话 工具 default to
spawned-only visibility
(see below).
Row shape (JSON):
key
: 会话 key (string)
kind
:
main | group | cron | hook | node | other
频道
:
WhatsApp | Telegram | Discord | signal | imessage | webchat | internal | unknown
displayName
(group display label if available)
updatedAt
(ms)
sessionId
模型
,
contextTokens
,
totalTokens
thinkingLevel
,
verboseLevel
,
systemSent
,
abortedLastRun
sendPolicy
(会话 override if set)
lastChannel
,
lastTo
delivery上下文
(normalized
{ 频道, to, accountId }
when available)
transcriptPath
(best-effort path derived从store dir + sessionId)
messages?
(only when
messageLimit > 0
)
​
sessions_history
获取 transcript为one 会话.
参数：
sessionKey
(required; accepts 会话 key or
sessionId
from
sessions_list
)
limit?: number
max messages (server clamps)
include工具?: boolean
(default false)
Behavior:
include工具=false
filters
role: "toolResult"
messages.
Returns messages array在the raw transcript format.
When given a
sessionId
, OpenClaw resolves it到the corresponding 会话 key (missing ids error).
​
sessions_send
Send a 消息 into another 会话.
参数：
sessionKey
(required; accepts 会话 key or
sessionId
from
sessions_list
)
消息
(required)
timeoutSeconds?: number
(default >0; 0 = fire-and-forget)
Behavior:
timeoutSeconds = 0
: enqueue与return
{ runId, status: "accepted" }
.
timeoutSeconds > 0
: wait up到N seconds为completion, then return
{ runId, status: "ok", reply }
.
If wait times out:
{ runId, status: "timeout", error }
. Run continues; call
sessions_history
later.
If the run fails:
{ runId, status: "error", error }
.
Announce delivery runs after the primary run completes与is best-effort;
status: "ok"
does not guarantee the announce was delivered.
Waits via 网关
智能体.wait
(server-side) so reconnects don’t drop the wait.
智能体-to-智能体 消息 上下文 is injected为the primary run.
Inter-会话 messages are persisted with
消息.provenance.kind = "inter_session"
so transcript readers can distinguish routed 智能体 instructions从external user input.
After the primary run completes, OpenClaw runs a
reply-back loop
:
Round 2+ alternates between requester与target 智能体.
Reply exactly
REPLY_SKIP
to stop the ping‑pong.
Max turns is
会话.agentToAgent.maxPingPongTurns
(0–5, default 5).
Once the loop ends, OpenClaw runs the
智能体‑to‑智能体 announce step
(target 智能体 only):
Reply exactly
ANNOUNCE_SKIP
to stay silent.
Any other reply is sent到the target 频道.
Announce step includes the original request + round‑1 reply + latest ping‑pong reply.
​
频道 Field
For groups,
频道
is the 频道 recorded在the 会话 entry.
For direct chats,
频道
maps from
lastChannel
.
For cron/hook/node,
频道
is
internal
.
If missing,
频道
is
unknown
.
​
Security / Send Policy
Policy-based blocking通过channel/chat type (not per 会话 id).
Copy
{
"会话"
:
{
"sendPolicy"
:
{
"rules"
:
[
{
"match"
:
{
"频道"
:
"Discord"
,
"chatType"
:
"group"
}
,
"action"
:
"deny"
}
]
,
"default"
:
"allow"
}
}
}
运行时 override (per 会话 entry):
sendPolicy: "allow" | "deny"
(unset = inherit config)
Settable via
sessions.patch
or owner-only
/send on|off|inherit
(standalone 消息).
Enforcement points:
chat.send
/
智能体
(网关)
auto-reply delivery logic
​
sessions_spawn
Spawn a sub-智能体 run在an isolated 会话与announce the result back到the requester chat 频道.
参数：
task
(required)
label?
(optional; used为logs/UI)
agentId?
(optional; spawn under another 智能体 id if allowed)
模型?
(optional; overrides the sub-智能体 模型; invalid values error)
runTimeoutSeconds?
(default 0; when set, aborts the sub-智能体 run after N seconds)
cleanup?
(
delete|keep
, default
keep
)
Allowlist:
智能体.list[].subagents.allowAgent
: list的agent ids allowed via
agentId
(
["*"]
to allow any). Default: only the requester 智能体.
Discovery:
Use
agents_list
to discover which 智能体 ids are allowed for
sessions_spawn
.
Behavior:
Starts a new
智能体:<agentId>:subagent:<uuid>
会话 with
deliver: false
.
Sub-智能体 default到the full 工具 set
minus 会话 工具
(configurable via
工具.subagents.工具
).
Sub-智能体 are not allowed到call
sessions_spawn
(no sub-智能体 → sub-智能体 spawning).
Always non-blocking: returns
{ status: "accepted", runId, childSessionKey }
immediately.
After completion, OpenClaw runs a sub-智能体
announce step
and posts the result到the requester chat 频道.
Reply exactly
ANNOUNCE_SKIP
during the announce step到stay silent.
Announce replies are normalized to
Status
/
Result
/
Notes
;
Status
comes从runtime outcome (not 模型 text).
Sub-智能体 sessions are auto-archived after
智能体.defaults.subagents.archiveAfterMinutes
(default: 60).
Announce replies include a stats line (运行时, tokens, sessionKey/sessionId, transcript path,与optional cost).
​
Sandbox 会话 Visibility
Sandboxed sessions can use 会话 工具, but通过default they only see sessions they spawned via
sessions_spawn
.
Config:
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
// default: "spawned"
session工具Visibility
:
"spawned"
,
//或"all"
}
,
}
,
}
,
}
会话修剪
记忆
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/会话-工具)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*