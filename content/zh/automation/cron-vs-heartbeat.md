# Cron vs Heartbeat - OpenClaw - 中文翻译


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
Automation
Cron vs Heartbeat
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
Cron vs Heartbeat: When到Use Each
Quick Decision Guide
Heartbeat: Periodic Awareness
When到use heartbeat
Heartbeat advantages
Heartbeat example: HEARTBEAT.md checklist
Configuring heartbeat
Cron: Precise Scheduling
When到use cron
Cron advantages
Cron example: Daily morning briefing
Cron example: One-shot reminder
Decision Flowchart
Combining Both
示例： Efficient automation 设置
Lobster: Deterministic workflows使用approvals
When Lobster fits
How it pairs使用heartbeat与cron
Operational notes (from the code)
Main 会话 vs Isolated 会话
When到use main 会话 cron
When到use isolated cron
Cost Considerations
Related
​
Cron vs Heartbeat: When到Use Each
Both heartbeats与cron jobs let you run 任务在a schedule. This guide helps you choose the right mechanism为your use case.
​
Quick Decision Guide
Use Case
Recommended
Why
Check inbox every 30 min
Heartbeat
Batches使用other checks, 上下文-aware
Send daily report在9am sharp
Cron (isolated)
Exact timing needed
Monitor calendar为upcoming events
Heartbeat
Natural fit为periodic awareness
Run weekly deep analysis
Cron (isolated)
Standalone task, can use different 模型
Remind me在20 minutes
Cron (main,
--at
)
One-shot使用precise timing
Background project health check
Heartbeat
Piggybacks在existing cycle
​
Heartbeat: Periodic Awareness
Heartbeats run在the
main 会话
at a regular interval (default: 30 min). They’re designed为the agent到check在things与surface anything important.
​
When到use heartbeat
Multiple periodic checks
: Instead的5 separate cron jobs checking inbox, calendar, weather, notifications,与project status, a single heartbeat can batch all的these.
上下文-aware decisions
: The 智能体 has full main-会话 上下文, so it can make smart decisions about what’s urgent vs. what can wait.
Conversational continuity
: Heartbeat runs share the same 会话, so the 智能体 remembers recent conversations与can follow up naturally.
Low-overhead monitoring
: One heartbeat replaces many small polling 任务.
​
Heartbeat advantages
Batches multiple checks
: One 智能体 turn can review inbox, calendar,与notifications together.
Reduces API calls
: A single heartbeat is cheaper than 5 isolated cron jobs.
上下文-aware
: The 智能体 knows what you’ve been working on与can prioritize accordingly.
Smart suppression
: If nothing needs attention, the 智能体 replies
HEARTBEAT_OK
and no 消息 is delivered.
Natural timing
: Drifts slightly based在queue load, which is fine为most monitoring.
​
Heartbeat example: HEARTBEAT.md checklist
Copy
# Heartbeat checklist
- Check email为urgent messages
- Review calendar为events在next 2 hours
- If a background task finished, summarize results
- If idle为8+ hours, send a brief check-in
The 智能体 reads this在each heartbeat与handles all items在one turn.
​
Configuring heartbeat
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
// interval
target
:
"last"
,
// where到deliver alerts
activeHours
:
{
start
:
"08:00"
,
end
:
"22:00"
}
,
// optional
}
,
}
,
}
,
}
See
Heartbeat
for full 配置.
​
Cron: Precise Scheduling
Cron jobs run at
exact times
and can run在isolated sessions without affecting main 上下文.
​
When到use cron
Exact timing required
: “Send this在9:00 AM every Monday” (not “sometime around 9”).
Standalone 任务
: 任务那don’t need conversational 上下文.
Different 模型/thinking
: Heavy analysis那warrants a more powerful 模型.
One-shot reminders
: “Remind me在20 minutes” with
--at
.
Noisy/frequent 任务
: 任务那would clutter main 会话 history.
External triggers
: 任务那should run independently的whether the 智能体 is otherwise active.
​
Cron advantages
Exact timing
: 5-field cron expressions使用timezone support.
会话 isolation
: Runs in
cron:<jobId>
without polluting main history.
模型 overrides
: Use a cheaper或more powerful 模型 per job.
Delivery 控制
: Isolated jobs default to
announce
(summary); choose
none
as needed.
Immediate delivery
: Announce mode posts directly without waiting为heartbeat.
No 智能体 上下文 needed
: Runs even if main 会话 is idle或compacted.
One-shot support
:
--at
for precise future timestamps.
​
Cron example: Daily morning briefing
Copy
OpenClaw
cron
add
\
--name
"Morning briefing"
\
--cron
"0 7 * * *"
\
--tz
"America/New_York"
\
--会话
isolated
\
--消息
"Generate today's briefing: weather, calendar, top emails, news summary."
\
--模型
opus
\
--announce
\
--频道
WhatsApp
\
--to
"+15551234567"
This runs在exactly 7:00 AM New York time, uses Opus为quality,与announces a summary directly到WhatsApp.
​
Cron example: One-shot reminder
Copy
OpenClaw
cron
add
\
--name
"Meeting reminder"
\
--at
"20m"
\
--会话
main
\
--system-event
"Reminder: standup meeting starts在10 minutes."
\
--wake
now
\
--delete-after-run
See
Cron jobs
for full 命令行界面 参考.
​
Decision Flowchart
Copy
Does the task need到run在an EXACT time?
YES -> Use cron
NO  -> Continue...
Does the task need isolation从main 会话?
YES -> Use cron (isolated)
NO  -> Continue...
Can这task be batched使用other periodic checks?
YES -> Use heartbeat (add到HEARTBEAT.md)
NO  -> Use cron
Is这a one-shot reminder?
YES -> Use cron使用--at
NO  -> Continue...
Does it need a different model或thinking level?
YES -> Use cron (isolated)使用--模型/--thinking
NO  -> Use heartbeat
​
Combining Both
The most efficient 设置 uses
both
:
Heartbeat
handles routine monitoring (inbox, calendar, notifications)在one batched turn every 30 minutes.
Cron
handles precise schedules (daily reports, weekly reviews)与one-shot reminders.
​
示例： Efficient automation 设置
HEARTBEAT.md
(checked every 30 min):
Copy
# Heartbeat checklist
- Scan inbox为urgent emails
- Check calendar为events在next 2h
- Review any pending 任务
- Light check-in if quiet为8+ hours
Cron jobs
(precise timing):
Copy
# Daily morning briefing在7am
OpenClaw
cron
add
--name
"Morning brief"
--cron
"0 7 * * *"
--会话
isolated
--消息
"..."
--announce
# Weekly project review在Mondays在9am
OpenClaw
cron
add
--name
"Weekly review"
--cron
"0 9 * * 1"
--会话
isolated
--消息
"..."
--模型
opus
# One-shot reminder
OpenClaw
cron
add
--name
"Call back"
--at
"2h"
--会话
main
--system-event
"Call back the client"
--wake
now
​
Lobster: Deterministic workflows使用approvals
Lobster is the workflow 运行时 for
multi-step 工具 pipelines
that need deterministic execution与explicit approvals.
Use it when the task is more than a single 智能体 turn,与you want a resumable workflow使用human checkpoints.
​
When Lobster fits
Multi-step automation
: You need a fixed pipeline的tool calls, not a one-off 提示词.
Approval gates
: Side effects should pause until you approve, then resume.
Resumable runs
: Continue a paused workflow without re-运行 earlier steps.
​
How it pairs使用heartbeat与cron
Heartbeat/cron
decide
when
a run happens.
Lobster
defines
what steps
happen once the run starts.
For scheduled workflows, use cron或heartbeat到trigger an 智能体 turn那calls Lobster.
For ad-hoc workflows, call Lobster directly.
​
Operational notes (from the code)
Lobster runs as a
local subprocess
(
lobster
命令行界面)在tool mode与returns a
JSON envelope
.
If the 工具 returns
needs_approval
, you resume使用a
resumeToken
and
approve
flag.
The 工具 is an
optional plugin
; enable it additively via
工具.alsoAllow: ["lobster"]
(recommended).
If you pass
lobsterPath
, it must be an
absolute path
.
See
Lobster
for full usage与examples.
​
Main 会话 vs Isolated 会话
Both heartbeat与cron can interact使用the main 会话, but differently:
Heartbeat
Cron (main)
Cron (isolated)
会话
Main
Main (via system event)
cron:<jobId>
History
Shared
Shared
Fresh each run
上下文
Full
Full
None (starts clean)
模型
Main 会话 模型
Main 会话 模型
Can override
Output
Delivered if not
HEARTBEAT_OK
Heartbeat 提示词 + event
Announce summary (default)
​
When到use main 会话 cron
Use
--会话 main
with
--system-event
when you want:
The reminder/event到appear在main 会话 上下文
The agent到handle it during the next heartbeat使用full 上下文
No separate isolated run
Copy
OpenClaw
cron
add
\
--name
"Check project"
\
--every
"4h"
\
--会话
main
\
--system-event
"Time为a project health check"
\
--wake
now
​
When到use isolated cron
Use
--会话 isolated
when you want:
A clean slate without prior 上下文
Different model或thinking settings
Announce summaries directly到a 频道
History那doesn’t clutter main 会话
Copy
OpenClaw
cron
add
\
--name
"Deep analysis"
\
--cron
"0 6 * * 0"
\
--会话
isolated
\
--消息
"Weekly codebase analysis..."
\
--模型
opus
\
--thinking
high
\
--announce
​
Cost Considerations
Mechanism
Cost Profile
Heartbeat
One turn every N minutes; scales使用HEARTBEAT.md size
Cron (main)
Adds event到next heartbeat (no isolated turn)
Cron (isolated)
Full 智能体 turn per job; can use cheaper 模型
Tips
:
Keep
HEARTBEAT.md
small到minimize token overhead.
Batch similar checks into heartbeat instead的multiple cron jobs.
Use
target: "none"
on heartbeat if you only want internal processing.
Use isolated cron使用a cheaper model为routine 任务.
​
Related
Heartbeat
- full heartbeat 配置
Cron jobs
- full cron 命令行界面与API 参考
System
- system events + heartbeat controls
Cron Jobs
Automation Troubleshooting
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/automation/cron-vs-heartbeat)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*