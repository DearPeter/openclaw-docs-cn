# 会话 管理 Deep Dive - OpenClaw - 中文翻译


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
压缩 internals
会话管理 Deep Dive
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
帮助
帮助
Troubleshooting
FAQ
Community
OpenClaw Lore
Environment与debugging
Environment Variables
Debugging
Testing
Scripts
Node 运行时
Node.js
压缩 internals
会话管理 Deep Dive
Developer 设置
设置
Contributing
Submitting a PR
Submitting an Issue
CI Pipeline
Docs meta
Docs 中心
Docs directory
本页内容
会话管理 & 压缩 (Deep Dive)
Source的truth: the 网关
Two persistence layers
On-disk locations
会话 keys (sessionKey)
会话 ids (sessionId)
会话 store schema (sessions.JSON)
Transcript structure (*.jsonl)
上下文 windows vs tracked tokens
压缩: what it is
When auto-压缩 happens (Pi 运行时)
压缩 settings (reserveTokens, keepRecentTokens)
User-visible surfaces
Silent housekeeping (NO_REPLY)
Pre-压缩 “记忆 flush” (implemented)
Troubleshooting checklist
​
会话管理 & 压缩 (Deep Dive)
This document explains how OpenClaw manages sessions end-to-end:
会话 routing
(how inbound messages map到a
sessionKey
)
会话 store
(
sessions.JSON
)与what it tracks
Transcript persistence
(
*.jsonl
)与its structure
Transcript hygiene
(provider-specific fixups before runs)
上下文 limits
(上下文 window vs tracked tokens)
压缩
(manual + auto-压缩)与where到hook pre-压缩 work
Silent housekeeping
(e.g. 记忆 writes那shouldn’t produce user-visible output)
If you want a higher-level 概述 first, start with:
/concepts/会话
/concepts/压缩
/concepts/会话-修剪
/参考/transcript-hygiene
​
Source的truth: the 网关
OpenClaw is designed around a single
网关 进程
that owns 会话 state.
UIs (macOS app, 网页 控制 UI, TUI) should query the 网关为会话 lists与token counts.
In remote mode, 会话 files are在the remote host; “checking your local Mac files” won’t reflect what the 网关 is using.
​
Two persistence layers
OpenClaw persists sessions在two layers:
会话 store (
sessions.JSON
)
Key/value map:
sessionKey -> SessionEntry
Small, mutable, safe到edit (or delete entries)
Tracks 会话 metadata (current 会话 id, last activity, toggles, token counters, etc.)
Transcript (
<sessionId>.jsonl
)
Append-only transcript使用tree structure (entries have
id
+
parentId
)
Stores the actual conversation + 工具 calls + 压缩 summaries
Used到rebuild the 模型 上下文为future turns
​
On-disk locations
Per 智能体,在the 网关 host:
Store:
~/.OpenClaw/智能体/<agentId>/sessions/sessions.JSON
Transcripts:
~/.OpenClaw/智能体/<agentId>/sessions/<sessionId>.jsonl
Telegram topic sessions:
.../<sessionId>-topic-<threadId>.jsonl
OpenClaw resolves这些via
src/config/sessions.ts
.
​
会话 keys (
sessionKey
)
A
sessionKey
identifies
which conversation bucket
you’re在(routing + isolation).
Common patterns:
Main/direct chat (per 智能体):
智能体:<agentId>:<mainKey>
(default
main
)
Group:
智能体:<agentId>:<频道>:group:<id>
Room/频道 (Discord/Slack):
智能体:<agentId>:<频道>:频道:<id>
or
...:room:<id>
Cron:
cron:<job.id>
Webhook:
hook:<uuid>
(unless overridden)
The canonical rules are documented at
/concepts/会话
.
​
会话 ids (
sessionId
)
Each
sessionKey
points在a current
sessionId
(the transcript file那continues the conversation).
Rules的thumb:
Reset
(
/new
,
/reset
) creates a new
sessionId
for that
sessionKey
.
Daily reset
(default 4:00 AM local time在the 网关 host) creates a new
sessionId
on the next 消息 after the reset boundary.
Idle expiry
(
会话.reset.idleMinutes
or legacy
会话.idleMinutes
) creates a new
sessionId
when a 消息 arrives after the idle window. When daily + idle are both configured, whichever expires first wins.
Implementation detail: the decision happens in
initSessionState()
in
src/auto-reply/reply/会话.ts
.
​
会话 store schema (
sessions.JSON
)
The store’s value type is
SessionEntry
in
src/config/sessions.ts
.
Key fields (not exhaustive):
sessionId
: current transcript id (filename is derived从this unless
sessionFile
is set)
updatedAt
: last activity timestamp
sessionFile
: optional explicit transcript path override
chatType
:
direct | group | room
(helps UIs与send policy)
provider
,
subject
,
room
,
space
,
displayName
: metadata为group/频道 labeling
Toggles:
thinkingLevel
,
verboseLevel
,
reasoningLevel
,
elevatedLevel
sendPolicy
(per-会话 override)
模型 selection:
providerOverride
,
modelOverride
,
authProfileOverride
Token counters (best-effort / provider-dependent):
inputTokens
,
outputTokens
,
totalTokens
,
contextTokens
compactionCount
: how often auto-压缩 completed为this 会话 key
memoryFlushAt
: timestamp为the last pre-压缩 记忆 flush
memoryFlush压缩Count
: 压缩 count when the last flush ran
The store is safe到edit, but the 网关 is the authority: it may rewrite或rehydrate entries as sessions run.
​
Transcript structure (
*.jsonl
)
Transcripts are managed by
@mariozechner/pi-coding-智能体
’s
SessionManager
.
The file is JSONL:
First line: 会话 header (
type: "会话"
, includes
id
,
cwd
,
timestamp
, optional
parentSession
)
Then: 会话 entries with
id
+
parentId
(tree)
Notable entry types:
消息
: user/assistant/toolResult messages
custom_message
: extension-injected messages that
do
enter 模型 上下文 (can be hidden从UI)
custom
: extension state那does
not
enter 模型 上下文
压缩
: persisted 压缩 summary with
firstKeptEntryId
and
tokensBefore
branch_summary
: persisted summary when navigating a tree branch
OpenClaw intentionally does
not
“fix up” transcripts; the 网关 uses
SessionManager
to read/write them.
​
上下文 windows vs tracked tokens
Two different concepts matter:
模型 上下文 window
: hard cap per 模型 (tokens visible到the 模型)
会话 store counters
: rolling stats written into
sessions.JSON
(used为/status与dashboards)
If you’re tuning limits:
The 上下文 window comes从the 模型 catalog (and can be overridden via config).
contextTokens
in the store is a 运行时 estimate/reporting value; don’t treat it as a strict guarantee.
For more, see
/token-use
.
​
压缩: what it is
压缩 summarizes older conversation into a persisted
压缩
entry在the transcript与keeps recent messages intact.
After 压缩, future turns see:
The 压缩 summary
消息 after
firstKeptEntryId
压缩 is
persistent
(unlike 会话 修剪). See
/concepts/会话-修剪
.
​
When auto-压缩 happens (Pi 运行时)
In the embedded Pi 智能体, auto-压缩 triggers在two cases:
Overflow recovery
: the 模型 returns a 上下文 overflow error → compact → 重试.
Threshold maintenance
: after a successful turn, when:
contextTokens > contextWindow - reserveTokens
Where:
contextWindow
is the 模型’s 上下文 window
reserveTokens
is headroom reserved为prompts + the next 模型 output
These are Pi 运行时 semantics (OpenClaw consumes the events, but Pi decides when到compact).
​
压缩 settings (
reserveTokens
,
keepRecentTokens
)
Pi’s 压缩 settings live在Pi settings:
Copy
{
压缩
:
{
enabled
:
true
,
reserveTokens
:
16384
,
keepRecentTokens
:
20000
,
}
,
}
OpenClaw also enforces a safety floor为embedded runs:
If
压缩.reserveTokens < reserveTokensFloor
, OpenClaw bumps it.
Default floor is
20000
tokens.
Set
智能体.defaults.压缩.reserveTokensFloor: 0
to disable the floor.
If it’s already higher, OpenClaw leaves it alone.
Why: leave enough headroom为multi-turn “housekeeping” (like 记忆 writes) before 压缩 becomes unavoidable.
Implementation:
ensurePi压缩ReserveTokens()
in
src/智能体/pi-settings.ts
(called from
src/智能体/pi-embedded-runner.ts
).
​
User-visible surfaces
You can observe compaction与会话 state via:
/status
(in any chat 会话)
OpenClaw status
(命令行界面)
OpenClaw sessions
/
sessions --JSON
Verbose mode:
🧹 Auto-压缩 complete
+ 压缩 count
​
Silent housekeeping (
NO_REPLY
)
OpenClaw supports “silent” turns为background 任务 where the user should not see intermediate output.
Convention:
The assistant starts its output with
NO_REPLY
to indicate “do not deliver a reply到the user”.
OpenClaw strips/suppresses this在the delivery layer.
As of
2026.1.10
, OpenClaw also suppresses
draft/typing 流式传输
when a partial chunk begins with
NO_REPLY
, so silent operations don’t leak partial output mid-turn.
​
Pre-压缩 “记忆 flush” (implemented)
Goal: before auto-压缩 happens, run a silent agentic turn那writes durable
state到disk (e.g.
记忆/YYYY-MM-DD.md
in the 智能体 工作空间) so 压缩 can’t
erase critical 上下文.
OpenClaw uses the
pre-threshold flush
approach:
Monitor 会话 上下文 usage.
When it crosses a “soft threshold” (below Pi’s 压缩 threshold), run a silent
“write 记忆 now” directive到the 智能体.
Use
NO_REPLY
so the user sees nothing.
Config (
智能体.defaults.压缩.memoryFlush
):
enabled
(default:
true
)
softThresholdTokens
(default:
4000
)
提示词
(user 消息为the flush turn)
systemPrompt
(extra system 提示词 appended为the flush turn)
Notes:
The default 提示词/system 提示词 include a
NO_REPLY
hint到suppress delivery.
The flush runs once per 压缩 cycle (tracked in
sessions.JSON
).
The flush runs only为embedded Pi sessions (命令行界面 backends skip it).
The flush is skipped when the 会话 工作空间 is read-only (
workspaceAccess: "ro"
or
"none"
).
See
记忆
for the 工作空间 file layout与write patterns.
Pi also exposes a
session_before_compact
hook在the extension API, but OpenClaw’s
flush logic lives在the 网关 side today.
​
Troubleshooting checklist
会话 key wrong? Start with
/concepts/会话
and confirm the
sessionKey
in
/status
.
Store vs transcript mismatch? Confirm the 网关 host与the store path from
OpenClaw status
.
压缩 spam? Check:
模型 上下文 window (too small)
压缩 settings (
reserveTokens
too high为the 模型 window can cause earlier 压缩)
工具-result bloat: enable/tune 会话 修剪
Silent turns leaking? Confirm the reply starts with
NO_REPLY
(exact token)与you’re在a build那includes the 流式传输 suppression fix.
Node.js
设置
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/参考/会话-管理-压缩)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*