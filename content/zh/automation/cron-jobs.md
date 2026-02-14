# Cron Jobs - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Cron Jobs
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
Cron jobs (网关 scheduler)
TL;DR
Quick start (actionable)
工具-call equivalents (网关 cron 工具)
Where cron jobs are stored
Beginner-friendly 概述
概念
Jobs
Schedules
Main vs isolated execution
Main 会话 jobs (system events)
Isolated jobs (dedicated cron sessions)
Payload shapes (what runs)
Announce delivery flow
Model与thinking overrides
Delivery (频道 + target)
Telegram delivery targets (topics / forum threads)
JSON schema为tool calls
cron.add params
cron.update params
cron.run与cron.remove params
Storage & history
配置
命令行界面 快速开始
网关 API surface
Troubleshooting
“Nothing runs”
A recurring job keeps delaying after failures
Telegram delivers到the wrong place
​
Cron jobs (网关 scheduler)
Cron vs Heartbeat?
See
Cron vs Heartbeat
for guidance在when到use each.
Cron is the 网关’s built-in scheduler. It persists jobs, wakes the 智能体 at
the right time,与can optionally deliver output back到a chat.
If you want
“run这every morning”
or
“poke the agent在20 minutes”
,
cron is the mechanism.
Troubleshooting:
/automation/troubleshooting
​
TL;DR
Cron runs
inside the 网关
(not inside the 模型).
Jobs persist under
~/.OpenClaw/cron/
so restarts don’t lose schedules.
Two execution styles:
Main 会话
: enqueue a system event, then run在the next heartbeat.
Isolated
: run a dedicated 智能体 turn in
cron:<jobId>
,使用delivery (announce通过default或none).
Wakeups are first-class: a job can request “wake now” vs “next heartbeat”.
​
Quick start (actionable)
Create a one-shot reminder, verify it exists,与run it immediately:
Copy
OpenClaw
cron
add
\
--name
"Reminder"
\
--at
"2026-02-01T16:00:00Z"
\
--会话
main
\
--system-event
"Reminder: check the cron docs draft"
\
--wake
now
\
--delete-after-run
OpenClaw
cron
list
OpenClaw
cron
run
<
job-i
d
>
OpenClaw
cron
runs
--id
<
job-i
d
>
Schedule a recurring isolated job使用delivery:
Copy
OpenClaw
cron
add
\
--name
"Morning brief"
\
--cron
"0 7 * * *"
\
--tz
"America/Los_Angeles"
\
--会话
isolated
\
--消息
"Summarize overnight updates."
\
--announce
\
--频道
Slack
\
--to
"频道:C1234567890"
​
工具-call equivalents (网关 cron 工具)
For the canonical JSON shapes与examples, see
JSON schema为tool calls
.
​
Where cron jobs are stored
Cron jobs are persisted在the 网关 host at
~/.OpenClaw/cron/jobs.JSON
by default.
The 网关 loads the file into 记忆与writes it back在changes, so manual edits
are only safe when the 网关 is stopped. Prefer
OpenClaw cron add/edit
or the cron
工具 call API为changes.
​
Beginner-friendly 概述
Think的a cron job as:
when
to run +
what
to do.
Choose a schedule
One-shot reminder →
schedule.kind = "at"
(命令行界面:
--at
)
Repeating job →
schedule.kind = "every"
or
schedule.kind = "cron"
If your ISO timestamp omits a timezone, it is treated as
UTC
.
Choose where it runs
sessionTarget: "main"
→ run during the next heartbeat使用main 上下文.
sessionTarget: "isolated"
→ run a dedicated 智能体 turn in
cron:<jobId>
.
Choose the payload
Main 会话 →
payload.kind = "systemEvent"
Isolated 会话 →
payload.kind = "agentTurn"
Optional: one-shot jobs (
schedule.kind = "at"
) delete after success通过default. Set
deleteAfterRun: false
to keep them (they will disable after success).
​
概念
​
Jobs
A cron job is a stored record with:
a
schedule
(when it should run),
a
payload
(what it should do),
optional
delivery mode
(announce或none).
optional
智能体 binding
(
agentId
): run the job under a specific 智能体; if
missing或unknown, the 网关 falls back到the default 智能体.
Jobs are identified通过a stable
jobId
(used通过命令行界面/网关 APIs).
In 智能体 工具 calls,
jobId
is canonical; legacy
id
is accepted为compatibility.
One-shot jobs auto-delete after success通过default; set
deleteAfterRun: false
to keep them.
​
Schedules
Cron supports three schedule kinds:
at
: one-shot timestamp via
schedule.at
(ISO 8601).
every
: fixed interval (ms).
cron
: 5-field cron expression使用optional IANA timezone.
Cron expressions use
croner
. If a timezone is omitted, the 网关 host’s
local timezone is used.
​
Main vs isolated execution
​
Main 会话 jobs (system events)
Main jobs enqueue a system event与optionally wake the heartbeat runner.
They must use
payload.kind = "systemEvent"
.
wakeMode: "now"
(default): event triggers an immediate heartbeat run.
wakeMode: "next-heartbeat"
: event waits为the next scheduled heartbeat.
这是 the best fit when you want the normal heartbeat 提示词 + main-会话 上下文.
See
Heartbeat
.
​
Isolated jobs (dedicated cron sessions)
Isolated jobs run a dedicated 智能体 turn在会话
cron:<jobId>
.
Key behaviors:
提示词 is prefixed with
[cron:<jobId> <job name>]
for traceability.
Each run starts a
fresh 会话 id
(no prior conversation carry-over).
Default behavior: if
delivery
is omitted, isolated jobs announce a summary (
delivery.mode = "announce"
).
delivery.mode
(isolated-only) chooses what happens:
announce
: deliver a summary到the target channel与post a brief summary到the main 会话.
none
: internal only (no delivery, no main-会话 summary).
wakeMode
controls when the main-会话 summary posts:
now
: immediate heartbeat.
next-heartbeat
: waits为the next scheduled heartbeat.
Use isolated jobs为noisy, frequent,或“background chores”那shouldn’t spam
your main chat history.
​
Payload shapes (what runs)
Two payload kinds are supported:
systemEvent
: main-会话 only, routed through the heartbeat 提示词.
agentTurn
: isolated-会话 only, runs a dedicated 智能体 turn.
Common
agentTurn
fields:
消息
: required text 提示词.
模型
/
thinking
: optional overrides (see below).
timeoutSeconds
: optional timeout override.
Delivery config (isolated jobs only):
delivery.mode
:
none
|
announce
.
delivery.频道
:
last
or a specific 频道.
delivery.to
: 频道-specific target (phone/chat/频道 id).
delivery.bestEffort
: avoid failing the job if announce delivery fails.
Announce delivery suppresses messaging 工具 sends为the run; use
delivery.频道
/
delivery.to
to target the chat instead. When
delivery.mode = "none"
, no summary is posted到the main 会话.
If
delivery
is omitted为isolated jobs, OpenClaw defaults to
announce
.
​
Announce delivery flow
When
delivery.mode = "announce"
, cron delivers directly via the outbound 频道 adapters.
The main 智能体 is not spun up到craft或forward the 消息.
Behavior details:
Content: delivery uses the isolated run’s outbound payloads (text/media)使用normal 分块 and
频道 formatting.
Heartbeat-only responses (
HEARTBEAT_OK
with no real content) are not delivered.
If the isolated run already sent a 消息到the same target via the 消息 工具, delivery is
skipped到avoid duplicates.
Missing或invalid delivery targets fail the job unless
delivery.bestEffort = true
.
A short summary is posted到the main 会话 only when
delivery.mode = "announce"
.
The main-会话 summary respects
wakeMode
:
now
triggers an immediate heartbeat and
next-heartbeat
waits为the next scheduled heartbeat.
​
Model与thinking overrides
Isolated jobs (
agentTurn
) can override the model与thinking level:
模型
: Provider/模型 string (e.g.,
anthropic/claude-sonnet-4-20250514
)或alias (e.g.,
opus
)
thinking
: Thinking level (
off
,
minimal
,
low
,
medium
,
high
,
xhigh
; GPT-5.2 + Codex 模型 only)
Note: You can set
模型
on main-会话 jobs too, but it changes the shared main
会话 模型. We recommend 模型 overrides only为isolated jobs到avoid
unexpected 上下文 shifts.
Resolution priority:
Job payload override (highest)
Hook-specific defaults (e.g.,
hooks.gmail.模型
)
智能体 config default
​
Delivery (频道 + target)
Isolated jobs can deliver output到a 频道 via the top-level
delivery
config:
delivery.mode
:
announce
(deliver a summary) or
none
.
delivery.频道
:
WhatsApp
/
Telegram
/
Discord
/
Slack
/
mattermost
(plugin) /
signal
/
imessage
/
last
.
delivery.to
: 频道-specific recipient target.
Delivery config is only valid为isolated jobs (
sessionTarget: "isolated"
).
If
delivery.频道
or
delivery.to
is omitted, cron can fall back到the main 会话’s
“last route” (the last place the 智能体 replied).
Target format reminders:
Slack/Discord/Mattermost (plugin) targets should use explicit prefixes (e.g.
频道:<id>
,
user:<id>
)到avoid ambiguity.
Telegram topics should use the
:topic:
form (see below).
​
Telegram delivery targets (topics / forum threads)
Telegram supports forum topics via
message_thread_id
. For cron delivery, you can encode
the topic/thread into the
to
field:
-1001234567890
(chat id only)
-1001234567890:topic:123
(preferred: explicit topic marker)
-1001234567890:123
(shorthand: numeric suffix)
Prefixed targets like
Telegram:...
/
Telegram:group:...
are also accepted:
Telegram:group:-1001234567890:topic:123
​
JSON schema为tool calls
Use这些shapes when calling 网关
cron.*
工具 directly (智能体 工具 calls或RPC).
命令行界面 flags accept human durations like
20m
, but 工具 calls should use an ISO 8601 string
for
schedule.at
and milliseconds for
schedule.everyMs
.
​
cron.add params
One-shot, main 会话 job (system event):
Copy
{
"name"
:
"Reminder"
,
"schedule"
:
{
"kind"
:
"at"
,
"at"
:
"2026-02-01T16:00:00Z"
}
,
"sessionTarget"
:
"main"
,
"wakeMode"
:
"now"
,
"payload"
:
{
"kind"
:
"systemEvent"
,
"text"
:
"Reminder text"
}
,
"deleteAfterRun"
:
true
}
Recurring, isolated job使用delivery:
Copy
{
"name"
:
"Morning brief"
,
"schedule"
:
{
"kind"
:
"cron"
,
"expr"
:
"0 7 * * *"
,
"tz"
:
"America/Los_Angeles"
}
,
"sessionTarget"
:
"isolated"
,
"wakeMode"
:
"next-heartbeat"
,
"payload"
:
{
"kind"
:
"agentTurn"
,
"消息"
:
"Summarize overnight updates."
}
,
"delivery"
:
{
"mode"
:
"announce"
,
"频道"
:
"Slack"
,
"to"
:
"频道:C1234567890"
,
"bestEffort"
:
true
}
}
Notes:
schedule.kind
:
at
(
at
),
every
(
everyMs
), or
cron
(
expr
, optional
tz
).
schedule.at
accepts ISO 8601 (timezone optional; treated as UTC when omitted).
everyMs
is milliseconds.
sessionTarget
must be
"main"
or
"isolated"
and must match
payload.kind
.
Optional fields:
agentId
,
description
,
enabled
,
deleteAfterRun
(defaults到true for
at
),
delivery
.
wakeMode
defaults to
"now"
when omitted.
​
cron.update params
Copy
{
"jobId"
:
"job-123"
,
"patch"
:
{
"enabled"
:
false
,
"schedule"
:
{
"kind"
:
"every"
,
"everyMs"
:
3600000
}
}
}
Notes:
jobId
is canonical;
id
is accepted为compatibility.
Use
agentId: null
in the patch到clear an 智能体 binding.
​
cron.run与cron.remove params
Copy
{
"jobId"
:
"job-123"
,
"mode"
:
"force"
}
Copy
{
"jobId"
:
"job-123"
}
​
Storage & history
Job store:
~/.OpenClaw/cron/jobs.JSON
(网关-managed JSON).
Run history:
~/.OpenClaw/cron/runs/<jobId>.jsonl
(JSONL, auto-pruned).
Override store path:
cron.store
in config.
​
配置
Copy
{
cron
:
{
enabled
:
true
,
// default true
store
:
"~/.OpenClaw/cron/jobs.JSON"
,
maxConcurrentRuns
:
1
,
// default 1
}
,
}
Disable cron entirely:
cron.enabled: false
(config)
OPENCLAW_SKIP_CRON=1
(env)
​
命令行界面 快速开始
One-shot reminder (UTC ISO, auto-delete after success):
Copy
OpenClaw
cron
add
\
--name
"Send reminder"
\
--at
"2026-01-12T18:00:00Z"
\
--会话
main
\
--system-event
"Reminder: submit expense report."
\
--wake
now
\
--delete-after-run
One-shot reminder (main 会话, wake immediately):
Copy
OpenClaw
cron
add
\
--name
"Calendar check"
\
--at
"20m"
\
--会话
main
\
--system-event
"Next heartbeat: check calendar."
\
--wake
now
Recurring isolated job (announce到WhatsApp):
Copy
OpenClaw
cron
add
\
--name
"Morning status"
\
--cron
"0 7 * * *"
\
--tz
"America/Los_Angeles"
\
--会话
isolated
\
--消息
"Summarize inbox + calendar为today."
\
--announce
\
--频道
WhatsApp
\
--to
"+15551234567"
Recurring isolated job (deliver到a Telegram topic):
Copy
OpenClaw
cron
add
\
--name
"Nightly summary (topic)"
\
--cron
"0 22 * * *"
\
--tz
"America/Los_Angeles"
\
--会话
isolated
\
--消息
"Summarize today; send到the nightly topic."
\
--announce
\
--频道
Telegram
\
--to
"-1001234567890:topic:123"
Isolated job使用model与thinking override:
Copy
OpenClaw
cron
add
\
--name
"Deep analysis"
\
--cron
"0 6 * * 1"
\
--tz
"America/Los_Angeles"
\
--会话
isolated
\
--消息
"Weekly deep analysis的project progress."
\
--模型
"opus"
\
--thinking
high
\
--announce
\
--频道
WhatsApp
\
--to
"+15551234567"
智能体 selection (multi-智能体 setups):
Copy
# Pin a job到agent "ops" (falls back到default if那agent is missing)
OpenClaw
cron
add
--name
"Ops sweep"
--cron
"0 6 * * *"
--会话
isolated
--消息
"Check ops 队列"
--智能体
ops
# Switch或clear the agent在an existing job
OpenClaw
cron
edit
<
jobI
d
>
--智能体
ops
OpenClaw
cron
edit
<
jobI
d
>
--clear-智能体
Manual run (force is the default, use
--due
to only run when due):
Copy
OpenClaw
cron
run
<
jobI
d
>
OpenClaw
cron
run
<
jobI
d
>
--due
Edit an existing job (patch fields):
Copy
OpenClaw
cron
edit
<
jobI
d
>
\
--消息
"Updated 提示词"
\
--模型
"opus"
\
--thinking
low
Run history:
Copy
OpenClaw
cron
runs
--id
<
jobI
d
>
--limit
50
Immediate system event without creating a job:
Copy
OpenClaw
system
event
--mode
now
--text
"Next heartbeat: check battery."
​
网关 API surface
cron.list
,
cron.status
,
cron.add
,
cron.update
,
cron.remove
cron.run
(force或due),
cron.runs
For immediate system events without a job, use
OpenClaw system event
.
​
Troubleshooting
​
“Nothing runs”
Check cron is enabled:
cron.enabled
and
OPENCLAW_SKIP_CRON
.
Check the 网关 is 运行 continuously (cron runs inside the 网关 进程).
For
cron
schedules: confirm timezone (
--tz
) vs the host timezone.
​
A recurring job keeps delaying after failures
OpenClaw applies exponential 重试 backoff为recurring jobs after consecutive errors:
30s, 1m, 5m, 15m, then 60m between retries.
Backoff resets automatically after the next successful run.
One-shot (
at
) jobs disable after a terminal run (
ok
,
error
, or
skipped
)与do not 重试.
​
Telegram delivers到the wrong place
For forum topics, use
-100…:topic:<id>
so it’s explicit与unambiguous.
If you see
Telegram:...
prefixes在logs或stored “last route” targets, that’s normal;
cron delivery accepts them与still parses topic IDs correctly.
Hooks
Cron vs Heartbeat
I
[查看英文原版](https://docs.OpenClaw.ai/automation/cron-jobs)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*