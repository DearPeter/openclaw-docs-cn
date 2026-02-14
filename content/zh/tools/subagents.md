# Sub-Agent - OpenClaw - 中文翻译


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
智能体 coordination
Sub-智能体
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
Sub-智能体
Quick Start
How It Works
配置
Setting a Default 模型
Setting a Default Thinking Level
Per-智能体 Overrides
Concurrency
Auto-Archive
The sessions_spawn 工具
Parameters
模型 Resolution Order
Cross-智能体 Spawning
Managing Sub-智能体 (/subagents)
Announce (How Results Come Back)
Announce Stats
Announce Status
工具 Policy
Customizing Sub-智能体 工具
认证
上下文与系统提示
Stopping Sub-智能体
Full 配置 Example
Limitations
See Also
​
Sub-智能体
Sub-智能体 let you run background 任务 without blocking the main conversation. When you spawn a sub-智能体, it runs在its own isolated 会话, does its work,与announces the result back到the chat when finished.
Use cases:
Research a topic while the main 智能体 continues answering questions
Run multiple long 任务在parallel (网页 scraping, code analysis, file processing)
Delegate 任务到specialized Agent在a multi-智能体 设置
​
Quick Start
The simplest way到use sub-智能体 is到ask your 智能体 naturally:
“Spawn a sub-agent到research the latest Node.js release notes”
The 智能体 will call the
sessions_spawn
工具 behind the scenes. When the sub-智能体 finishes, it announces its findings back into your chat.
You can also be explicit about options:
“Spawn a sub-agent到analyze the server logs从today. Use gpt-5.2与set a 5-minute timeout.”
​
How It Works
1
Main 智能体 spawns
The main 智能体 calls
sessions_spawn
with a task description. The call is
non-blocking
— the main 智能体 gets back
{ status: "accepted", runId, childSessionKey }
immediately.
2
Sub-智能体 runs在the background
A new isolated 会话 is created (
智能体:<agentId>:subagent:<uuid>
)在the dedicated
subagent
队列 lane.
3
Result is announced
When the sub-智能体 finishes, it announces its findings back到the requester chat. The main 智能体 posts a natural-language summary.
4
会话 is archived
The sub-智能体 会话 is auto-archived after 60 minutes (configurable). Transcripts are preserved.
Each sub-智能体 has its
own
上下文与token usage. Set a cheaper model为sub-Agent到save costs — see
Setting a Default 模型
below.
​
配置
Sub-智能体 work out的the box使用no 配置. Defaults:
模型: target 智能体’s normal 模型 selection (unless
subagents.模型
is set)
Thinking: no sub-智能体 override (unless
subagents.thinking
is set)
Max concurrent: 8
Auto-archive: after 60 minutes
​
Setting a Default 模型
Use a cheaper model为sub-Agent到save在token costs:
Copy
{
智能体
:
{
defaults
:
{
subagents
:
{
模型
:
"minimax/MiniMax-M2.1"
,
}
,
}
,
}
,
}
​
Setting a Default Thinking Level
Copy
{
智能体
:
{
defaults
:
{
subagents
:
{
thinking
:
"low"
,
}
,
}
,
}
,
}
​
Per-智能体 Overrides
In a multi-智能体 设置, you can set sub-智能体 defaults per 智能体:
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
"researcher"
,
subagents
:
{
模型
:
"anthropic/claude-sonnet-4"
,
}
,
}
,
{
id
:
"assistant"
,
subagents
:
{
模型
:
"minimax/MiniMax-M2.1"
,
}
,
}
,
]
,
}
,
}
​
Concurrency
控制 how many sub-智能体 can run在the same time:
Copy
{
智能体
:
{
defaults
:
{
subagents
:
{
maxConcurrent
:
4
,
// default: 8
}
,
}
,
}
,
}
Sub-智能体 use a dedicated 队列 lane (
subagent
) separate从the main 智能体 队列, so sub-智能体 runs don’t block inbound replies.
​
Auto-Archive
Sub-智能体 sessions are automatically archived after a configurable period:
Copy
{
智能体
:
{
defaults
:
{
subagents
:
{
archiveAfterMinutes
:
120
,
// default: 60
}
,
}
,
}
,
}
Archive renames the transcript to
*.deleted.<timestamp>
(same folder) — transcripts are preserved, not deleted. Auto-archive timers are best-effort; pending timers are lost if the 网关 restarts.
​
The
sessions_spawn
工具
这是 the 工具 the 智能体 calls 来创建 sub-智能体.
​
Parameters
Parameter
Type
Default
Description
task
string
(required)
What the sub-智能体 should do
label
string
—
Short label为identification
agentId
string
(caller’s 智能体)
Spawn under a different 智能体 id (must be allowed)
模型
string
(optional)
Override the model为this sub-智能体
thinking
string
(optional)
Override thinking level (
off
,
low
,
medium
,
high
, etc.)
runTimeoutSeconds
number
0
(no limit)
Abort the sub-智能体 after N seconds
cleanup
"delete"
|
"keep"
"keep"
"delete"
archives immediately after announce
​
模型 Resolution Order
The sub-智能体 模型 is resolved在this order (first match wins):
Explicit
模型
parameter在the
sessions_spawn
call
Per-智能体 config:
智能体.list[].subagents.模型
Global default:
智能体.defaults.subagents.模型
Target 智能体’s normal 模型 resolution为that new 会话
Thinking level is resolved在this order:
Explicit
thinking
parameter在the
sessions_spawn
call
Per-智能体 config:
智能体.list[].subagents.thinking
Global default:
智能体.defaults.subagents.thinking
Otherwise no sub-智能体-specific thinking override is applied
Invalid 模型 values are silently skipped — the sub-智能体 runs在the next valid default使用a warning在the 工具 result.
​
Cross-智能体 Spawning
By default, sub-智能体 can only spawn under their own 智能体 id. To allow an agent到spawn sub-智能体 under other 智能体 ids:
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
"orchestrator"
,
subagents
:
{
allowAgent
:
[
"researcher"
,
"coder"
]
,
//或["*"]到allow any
}
,
}
,
]
,
}
,
}
Use the
agents_list
tool到discover which 智能体 ids are currently allowed for
sessions_spawn
.
​
Managing Sub-智能体 (
/subagents
)
Use the
/subagents
slash command到inspect与控制 sub-智能体 runs为the current 会话:
Command
Description
/subagents list
List all sub-智能体 runs (active与completed)
/subagents stop <id|#|all>
Stop a 运行 sub-智能体
/subagents log <id|#> [limit] [工具]
View sub-智能体 transcript
/subagents info <id|#>
Show detailed run metadata
/subagents send <id|#> <消息>
Send a 消息到a 运行 sub-智能体
You can 参考 sub-Agent通过list index (
1
,
2
), run id prefix, full 会话 key, or
last
.
示例： list与stop a sub-智能体
Copy
/subagents list
Copy
🧭 Subagents (current 会话)
Active: 1 · Done: 2
1) ✅ · research logs · 2m31s · run a1b2c3d4 · 智能体:main:subagent:...
2) ✅ · check deps · 45s · run e5f6g7h8 · 智能体:main:subagent:...
3) 🔄 · 部署 staging · 1m12s · run i9j0k1l2 · 智能体:main:subagent:...
Copy
/subagents stop 3
Copy
⚙️ Stop requested为deploy staging.
示例： inspect a sub-智能体
Copy
/subagents info 1
Copy
ℹ️ Subagent info
Status: ✅
Label: research logs
Task: Research the latest server error logs与summarize findings
Run: a1b2c3d4-...
会话: 智能体:main:subagent:...
运行时: 2m31s
Cleanup: keep
Outcome: ok
示例： view sub-智能体 log
Copy
/subagents log 1 10
Shows the last 10 messages从the sub-智能体’s transcript. Add
工具
to include 工具 call messages:
Copy
/subagents log 1 10 工具
示例： send a follow-up 消息
Copy
/subagents send 3 "Also check the staging environment"
Sends a 消息 into the 运行 sub-智能体’s 会话与waits up到30 seconds为a reply.
​
Announce (How Results Come Back)
When a sub-智能体 finishes, it goes through an
announce
step:
The sub-智能体’s final reply is captured
A summary 消息 is sent到the main 智能体’s 会话使用the result, status,与stats
The main 智能体 posts a natural-language summary到your chat
Announce replies preserve thread/topic routing when available (Slack threads, Telegram topics, Matrix threads).
​
Announce Stats
Each announce includes a stats line with:
运行时 duration
Token usage (input/output/total)
Estimated cost (when 模型 pricing is configured via
模型.提供者.*.模型[].cost
)
会话 key, 会话 id,与transcript path
​
Announce Status
The announce 消息 includes a status derived从the 运行时 outcome (not从model output):
successful completion
(
ok
) — task completed normally
error
— task failed (error details在notes)
timeout
— task exceeded
runTimeoutSeconds
unknown
— status could not be determined
If no user-facing announcement is needed, the main-智能体 summarize step can return
NO_REPLY
and nothing is posted.
这是 different from
ANNOUNCE_SKIP
, which is used在agent-to-智能体 announce flow (
sessions_send
).
​
工具 Policy
By default, sub-智能体 get
all 工具 except
a set的denied 工具那are unsafe或unnecessary为background 任务:
Default denied 工具
Denied 工具
Reason
sessions_list
会话 管理 — main 智能体 orchestrates
sessions_history
会话 管理 — main 智能体 orchestrates
sessions_send
会话 管理 — main 智能体 orchestrates
sessions_spawn
No nested fan-out (sub-智能体 cannot spawn sub-智能体)
网关
System admin — dangerous从sub-智能体
agents_list
System admin
whatsapp_login
Interactive 设置 — not a task
session_status
Status/scheduling — main 智能体 coordinates
cron
Status/scheduling — main 智能体 coordinates
memory_search
Pass relevant info在spawn 提示词 instead
memory_get
Pass relevant info在spawn 提示词 instead
​
Customizing Sub-智能体 工具
You can further restrict sub-智能体 工具:
Copy
{
工具
:
{
subagents
:
{
工具
:
{
// deny always wins over allow
deny
:
[
"浏览器"
,
"firecrawl"
]
,
}
,
}
,
}
,
}
To restrict sub-智能体 to
only
specific 工具:
Copy
{
工具
:
{
subagents
:
{
工具
:
{
allow
:
[
"read"
,
"执行"
,
"进程"
,
"write"
,
"edit"
,
"apply_patch"
]
,
// deny still wins if set
}
,
}
,
}
,
}
Custom deny entries are
added to
the default deny list. If
allow
is set, only那些工具 are available (the default deny list still applies在top).
​
认证
Sub-智能体 auth is resolved by
智能体 id
, not通过会话 type:
The auth store is loaded从the target 智能体’s
agentDir
The main 智能体’s auth profiles are merged在as a
fallback
(智能体 profiles win在conflicts)
The merge is additive — main profiles are always available as fallbacks
Fully isolated auth per sub-智能体 is not currently supported.
​
上下文与系统提示
Sub-智能体 receive a reduced system 提示词 compared到the main 智能体:
Included:
Tooling, 工作空间, 运行时 sections, plus
智能体.md
and
工具.md
Not included:
SOUL.md
,
IDENTITY.md
,
USER.md
,
HEARTBEAT.md
,
引导.md
The sub-智能体 also receives a task-focused system prompt那instructs it到stay focused在the assigned task, complete it,与not act as the main 智能体.
​
Stopping Sub-智能体
Method
Effect
/stop
in the chat
Aborts the main 会话
and
all active sub-智能体 runs spawned从it
/subagents stop <id>
Stops a specific sub-智能体 without affecting the main 会话
runTimeoutSeconds
Automatically aborts the sub-智能体 run after the specified time
runTimeoutSeconds
does
not
auto-archive the 会话. The 会话 remains until the normal archive timer fires.
​
Full 配置 Example
Complete sub-智能体 配置
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
"anthropic/claude-sonnet-4"
}
,
subagents
:
{
模型
:
"minimax/MiniMax-M2.1"
,
thinking
:
"low"
,
maxConcurrent
:
4
,
archiveAfterMinutes
:
30
,
}
,
}
,
list
:
[
{
id
:
"main"
,
default
:
true
,
name
:
"Personal Assistant"
,
}
,
{
id
:
"ops"
,
name
:
"Ops 智能体"
,
subagents
:
{
模型
:
"anthropic/claude-sonnet-4"
,
allowAgent
:
[
"main"
]
,
// ops can spawn sub-智能体 under "main"
}
,
}
,
]
,
}
,
工具
:
{
subagents
:
{
工具
:
{
deny
:
[
"浏览器"
]
,
// sub-智能体 can't use the 浏览器
}
,
}
,
}
,
}
​
Limitations
Best-effort announce:
If the 网关 restarts, pending announce work is lost.
No nested spawning:
Sub-智能体 cannot spawn their own sub-智能体.
Shared resources:
Sub-智能体 share the 网关 进程; use
maxConcurrent
as a safety valve.
Auto-archive is best-effort:
Pending archive timers are lost在网关 restart.
​
See Also
会话 工具
— details on
sessions_spawn
and other 会话 工具
Multi-智能体 Sandbox与工具
— per-智能体 工具 restrictions与sandboxing
配置
—
智能体.defaults.subagents
参考
队列
— how the
subagent
lane works
智能体 Send
Multi-智能体 Sandbox & 工具
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/subagents)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*