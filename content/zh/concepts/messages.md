# Messages - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
消息与传递
消息
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
消息
消息 flow (high level)
Inbound dedupe
Inbound debouncing
会话与devices
Inbound bodies与history 上下文
Queueing与followups
流式传输, 分块,与batching
Reasoning visibility与tokens
Prefixes, threading,与replies
​
消息
This page ties together how OpenClaw handles inbound messages, sessions, queueing,
流式传输,与reasoning visibility.
​
消息 flow (high level)
Copy
Inbound 消息
-> routing/bindings -> 会话 key
-> 队列 (if a run is active)
-> 智能体 run (流式传输 + 工具)
-> outbound replies (频道 limits + 分块)
Key knobs live在配置:
messages.*
for prefixes, queueing,与group behavior.
智能体.defaults.*
for block 流式传输与分块 defaults.
频道 overrides (
频道.WhatsApp.*
,
频道.Telegram.*
, etc.)为caps与流式传输 toggles.
See
配置
for full schema.
​
Inbound dedupe
频道 can redeliver the same 消息 after reconnects. OpenClaw keeps a
short-lived cache keyed通过channel/account/peer/会话/消息 id so duplicate
deliveries do not trigger another 智能体 run.
​
Inbound debouncing
Rapid consecutive messages从the
same sender
can be batched into a single
智能体 turn via
messages.inbound
. Debouncing is scoped per 频道 + conversation
and uses the most recent 消息为reply threading/IDs.
Config (global default + per-频道 overrides):
Copy
{
messages
:
{
inbound
:
{
debounceMs
:
2000
,
byChannel
:
{
WhatsApp
:
5000
,
Slack
:
1500
,
Discord
:
1500
,
}
,
}
,
}
,
}
Notes:
Debounce applies to
text-only
messages; media/attachments flush immediately.
控制 commands bypass debouncing so they remain standalone.
​
会话与devices
会话 are owned通过the 网关, not通过clients.
Direct chats collapse into the 智能体 main 会话 key.
Groups/频道 get their own 会话 keys.
The 会话 store与transcripts live在the 网关 host.
Multiple devices/频道 can map到the same 会话, but history is not fully
synced back到every client. Recommendation: use one primary device为long
conversations到avoid divergent 上下文. The 控制 UI与TUI always show the
网关-backed 会话 transcript, so they are the source的truth.
Details:
会话 管理
.
​
Inbound bodies与history 上下文
OpenClaw separates the
提示词 body
from the
command body
:
Body
: 提示词 text sent到the 智能体. This may include 频道 envelopes and
optional history wrappers.
CommandBody
: raw user text为directive/command parsing.
RawBody
: legacy alias for
CommandBody
(kept为compatibility).
When a 频道 supplies history, it uses a shared wrapper:
[Chat messages since your last reply -为上下文]
[Current 消息 - respond到this]
For
non-direct chats
(groups/频道/rooms), the
current 消息 body
is prefixed使用the
sender label (same style used为history entries). This keeps real-time与queued/history
messages consistent在the 智能体 提示词.
History buffers are
pending-only
: they include group messages那did
not
trigger a run (for example, mention-gated messages) and
exclude
messages
already在the 会话 transcript.
Directive stripping only applies到the
current 消息
section so history
remains intact. 频道那wrap history should set
CommandBody
(or
RawBody
)到the original 消息 text与keep
Body
as the combined 提示词.
History buffers are configurable via
messages.groupChat.historyLimit
(global
default)与per-频道 overrides like
频道.Slack.historyLimit
or
频道.Telegram.accounts.<id>.historyLimit
(set
0
to disable).
​
Queueing与followups
If a run is already active, inbound messages can be queued, steered into the
current run,或collected为a followup turn.
配置 via
messages.队列
(and
messages.队列.byChannel
).
Modes:
interrupt
,
steer
,
followup
,
collect
, plus backlog variants.
Details:
Queueing
.
​
流式传输, 分块,与batching
Block 流式传输 sends partial replies as the 模型 produces text blocks.
分块 respects 频道 text limits与avoids splitting fenced code.
Key settings:
智能体.defaults.blockStreamingDefault
(
on|off
, default off)
智能体.defaults.blockStreamingBreak
(
text_end|message_end
)
智能体.defaults.blockStreamingChunk
(
minChars|maxChars|breakPreference
)
智能体.defaults.blockStreamingCoalesce
(idle-based batching)
智能体.defaults.humanDelay
(human-like pause between block replies)
频道 overrides:
*.blockStreaming
and
*.blockStreamingCoalesce
(non-Telegram 频道 require explicit
*.blockStreaming: true
)
Details:
流式传输 + 分块
.
​
Reasoning visibility与tokens
OpenClaw can expose或hide 模型 reasoning:
/reasoning on|off|stream
controls visibility.
Reasoning content still counts toward token usage when produced通过the 模型.
Telegram supports reasoning stream into the draft bubble.
Details:
Thinking + reasoning directives
and
Token use
.
​
Prefixes, threading,与replies
Outbound 消息 formatting is centralized in
messages
:
messages.responsePrefix
,
频道.<频道>.responsePrefix
, and
频道.<频道>.accounts.<id>.responsePrefix
(outbound prefix cascade), plus
频道.WhatsApp.messagePrefix
(WhatsApp inbound prefix)
Reply threading via
replyToMode
and per-频道 defaults
Details:
配置
and 频道 docs.
在线状态
流式传输与分块
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/messages)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*