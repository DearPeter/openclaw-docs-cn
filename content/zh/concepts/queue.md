# Command Queue - OpenClaw - 中文翻译


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
消息与传递
命令队列
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
命令队列 (2026-01-16)
Why
How it works
队列 modes (per 频道)
队列 options
Per-会话 overrides
Scope与guarantees
Troubleshooting
​
命令队列 (2026-01-16)
We serialize inbound auto-reply runs (all 频道) through a tiny in-进程 queue到prevent multiple 智能体 runs从colliding, while still allowing safe parallelism across sessions.
​
Why
Auto-reply runs can be expensive (LLM calls)与can collide when multiple inbound messages arrive close together.
Serializing avoids competing为shared resources (会话 files, logs, 命令行界面 stdin)与reduces the chance的upstream rate limits.
​
How it works
A lane-aware FIFO 队列 drains each lane使用a configurable concurrency cap (default 1为unconfigured lanes; main defaults到4, subagent到8).
runEmbeddedPiAgent
enqueues by
会话 key
(lane
会话:<key>
)到guarantee only one active run per 会话.
Each 会话 run is then queued into a
global lane
(
main
by default) so overall parallelism is capped by
智能体.defaults.maxConcurrent
.
When verbose logging is enabled, queued runs emit a short notice if they waited more than ~2s before starting.
Typing indicators still fire immediately在enqueue (when supported通过the 频道) so user experience is unchanged while we wait our turn.
​
队列 modes (per 频道)
Inbound messages can steer the current run, wait为a followup turn,或do both:
steer
: inject immediately into the current run (cancels pending 工具 calls after the next 工具 boundary). If not 流式传输, falls back到followup.
followup
: enqueue为the next 智能体 turn after the current run ends.
collect
: coalesce all queued messages into a
single
followup turn (default). If messages target different 频道/threads, they drain individually到preserve routing.
steer-backlog
(aka
steer+backlog
): steer now
and
preserve the 消息为a followup turn.
interrupt
(legacy): abort the active run为that 会话, then run the newest 消息.
队列
(legacy alias): same as
steer
.
Steer-backlog means you can get a followup response after the steered run, so
流式传输 surfaces can look like duplicates. Prefer
collect
/
steer
if you want
one response per inbound 消息.
Send
/队列 collect
as a standalone command (per-会话)或set
messages.队列.byChannel.Discord: "collect"
.
Defaults (when unset在config):
All surfaces →
collect
配置 globally或per 频道 via
messages.队列
:
Copy
{
messages
:
{
队列
:
{
mode
:
"collect"
,
debounceMs
:
1000
,
cap
:
20
,
drop
:
"summarize"
,
byChannel
:
{
Discord
:
"collect"
}
,
}
,
}
,
}
​
队列 options
Options apply to
followup
,
collect
, and
steer-backlog
(and to
steer
when it falls back到followup):
debounceMs
: wait为quiet before starting a followup turn (prevents “continue, continue”).
cap
: max queued messages per 会话.
drop
: overflow policy (
old
,
new
,
summarize
).
Summarize keeps a short bullet list的dropped messages与injects it as a synthetic followup 提示词.
Defaults:
debounceMs: 1000
,
cap: 20
,
drop: summarize
.
​
Per-会话 overrides
Send
/队列 <mode>
as a standalone command到store the mode为the current 会话.
Options can be combined:
/队列 collect debounce:2s cap:25 drop:summarize
/队列 default
or
/队列 reset
clears the 会话 override.
​
Scope与guarantees
Applies到auto-reply 智能体 runs across all inbound 频道那use the 网关 reply pipeline (WhatsApp 网页, Telegram, Slack, Discord, Signal, iMessage, webchat, etc.).
Default lane (
main
) is 进程-wide为inbound + main heartbeats; set
智能体.defaults.maxConcurrent
to allow multiple sessions在parallel.
Additional lanes may exist (e.g.
cron
,
subagent
) so background jobs can run在parallel without blocking inbound replies.
Per-会话 lanes guarantee那only one 智能体 run touches a given 会话在a time.
No external dependencies或background worker threads; pure TypeScript + promises.
​
Troubleshooting
If commands seem stuck, enable verbose logs与look为“queued为…ms” lines到confirm the 队列 is draining.
If you need 队列 depth, enable verbose logs与watch为queue timing lines.
重试策略
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/队列)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*