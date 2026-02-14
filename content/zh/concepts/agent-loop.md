# Agent Loop - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
基础概念
Agent循环
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
Agent循环 (OpenClaw)
Entry points
How it works (high-level)
Queueing + concurrency
会话 + 工作空间 preparation
提示词 assembly + system 提示词
Hook points (where you can intercept)
Internal hooks (网关 hooks)
Plugin hooks (智能体 + 网关 lifecycle)
流式传输 + partial replies
工具 execution + messaging 工具
Reply shaping + suppression
压缩 + retries
Event streams (today)
Chat 频道 handling
Timeouts
Where things can end early
​
Agent循环 (OpenClaw)
An agentic loop is the full “real” run的an 智能体: intake → 上下文 assembly → 模型 inference →
工具 execution → 流式传输 replies → persistence. It’s the authoritative path那turns a 消息
into actions与a final reply, while keeping 会话 state consistent.
In OpenClaw, a loop is a single, serialized run per 会话那emits lifecycle与stream events
as the 模型 thinks, calls 工具,与streams output. This doc explains how那authentic loop is
wired end-to-end.
​
Entry points
网关 RPC:
智能体
and
智能体.wait
.
命令行界面:
智能体
command.
​
How it works (high-level)
智能体
RPC validates params, resolves 会话 (sessionKey/sessionId), persists 会话 metadata, returns
{ runId, acceptedAt }
immediately.
agentCommand
runs the 智能体:
resolves 模型 + thinking/verbose defaults
loads 技能 snapshot
calls
runEmbeddedPiAgent
(pi-智能体-core 运行时)
emits
lifecycle end/error
if the embedded loop does not emit one
runEmbeddedPiAgent
:
serializes runs via per-会话 + global queues
resolves 模型 + auth profile与builds the pi 会话
subscribes到pi events与streams assistant/工具 deltas
enforces timeout -> aborts run if exceeded
returns payloads + usage metadata
subscribeEmbeddedPi会话
bridges pi-智能体-core events到OpenClaw
智能体
stream:
工具 events =>
stream: "工具"
assistant deltas =>
stream: "assistant"
lifecycle events =>
stream: "lifecycle"
(
phase: "start" | "end" | "error"
)
智能体.wait
uses
waitForAgentJob
:
waits for
lifecycle end/error
for
runId
returns
{ status: ok|error|timeout, startedAt, endedAt, error? }
​
Queueing + concurrency
Runs are serialized per 会话 key (会话 lane)与optionally through a global lane.
This prevents 工具/会话 races与keeps 会话 history consistent.
Messaging 频道 can choose 队列 modes (collect/steer/followup)那feed这lane system.
See
命令队列
.
​
会话 + 工作空间 preparation
工作空间 is resolved与created; sandboxed runs may redirect到a sandbox 工作空间 root.
技能 are loaded (or reused从a snapshot)与injected into env与prompt.
引导/上下文 files are resolved与injected into the system 提示词 report.
A 会话 write lock is acquired;
会话Manager
is opened与prepared before 流式传输.
​
提示词 assembly + system 提示词
System 提示词 is built从OpenClaw’s base 提示词, 技能 提示词, 引导 上下文,与per-run overrides.
模型-specific limits与compaction reserve tokens are enforced.
See
System 提示词
for what the 模型 sees.
​
Hook points (where you can intercept)
OpenClaw has two hook systems:
Internal hooks
(网关 hooks): event-driven scripts为commands与lifecycle events.
Plugin hooks
: extension points inside the 智能体/工具 lifecycle与网关 pipeline.
​
Internal hooks (网关 hooks)
智能体:引导
: runs while building 引导 files before the system 提示词 is finalized.
Use this到add/remove 引导 上下文 files.
Command hooks
:
/new
,
/reset
,
/stop
,与other command events (see Hooks doc).
See
Hooks
for 设置与examples.
​
Plugin hooks (智能体 + 网关 lifecycle)
These run inside the 智能体 loop或网关 pipeline:
before_agent_start
: inject 上下文或override system 提示词 before the run starts.
agent_end
: inspect the final 消息 list与run metadata after completion.
before_compaction
/
after_compaction
: observe或annotate 压缩 cycles.
before_tool_call
/
after_tool_call
: intercept 工具 params/results.
tool_result_persist
: synchronously transform 工具 results before they are written到the 会话 transcript.
message_received
/
message_sending
/
message_sent
: inbound + outbound 消息 hooks.
session_start
/
session_end
: 会话 lifecycle boundaries.
gateway_start
/
gateway_stop
: 网关 lifecycle events.
See
Plugins
for the hook API与registration details.
​
流式传输 + partial replies
Assistant deltas are streamed从pi-智能体-core与emitted as
assistant
events.
Block 流式传输 can emit partial replies either on
text_end
or
message_end
.
Reasoning 流式传输 can be emitted as a separate stream或as block replies.
See
流式传输
for 分块与block reply behavior.
​
工具 execution + messaging 工具
工具 start/update/end events are emitted在the
工具
stream.
工具 results are sanitized为size与image payloads before logging/emitting.
Messaging 工具 sends are tracked到suppress duplicate assistant confirmations.
​
Reply shaping + suppression
Final payloads are assembled from:
assistant text (and optional reasoning)
inline 工具 summaries (when verbose + allowed)
assistant error text when the 模型 errors
NO_REPLY
is treated as a silent token与filtered从outgoing payloads.
Messaging 工具 duplicates are removed从the final payload list.
If no renderable payloads remain与a 工具 errored, a fallback 工具 error reply is emitted
(unless a messaging 工具 already sent a user-visible reply).
​
压缩 + retries
Auto-压缩 emits
压缩
stream events与can trigger a 重试.
On 重试, in-记忆 buffers与tool summaries are reset到avoid duplicate output.
See
压缩
for the 压缩 pipeline.
​
Event streams (today)
lifecycle
: emitted by
subscribeEmbeddedPi会话
(and as a fallback by
agentCommand
)
assistant
: streamed deltas从pi-智能体-core
工具
: streamed 工具 events从pi-智能体-core
​
Chat 频道 handling
Assistant deltas are buffered into chat
delta
messages.
A chat
final
is emitted on
lifecycle end/error
.
​
Timeouts
智能体.wait
default: 30s (just the wait).
timeoutMs
param overrides.
Agent运行时:
智能体.defaults.timeoutSeconds
default 600s; enforced in
runEmbeddedPiAgent
abort timer.
​
Where things can end early
智能体 timeout (abort)
AbortSignal (cancel)
网关 disconnect或RPC timeout
智能体.wait
timeout (wait-only, does not stop 智能体)
Agent运行时
系统提示
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/智能体-loop)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*