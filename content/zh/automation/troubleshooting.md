# Automation Troubleshooting - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Automation Troubleshooting
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
Automation troubleshooting
Command ladder
Cron not firing
Cron fired but no delivery
Heartbeat suppressed或skipped
Timezone与activeHours gotchas
​
Automation troubleshooting
Use这page为scheduler与delivery issues (
cron
+
heartbeat
).
​
Command ladder
Copy
OpenClaw
status
OpenClaw
网关
status
OpenClaw
logs
--follow
OpenClaw
doctor
OpenClaw
频道
status
--probe
Then run automation checks:
Copy
OpenClaw
cron
status
OpenClaw
cron
list
OpenClaw
system
heartbeat
last
​
Cron not firing
Copy
OpenClaw
cron
status
OpenClaw
cron
list
OpenClaw
cron
runs
--id
<
jobI
d
>
--limit
20
OpenClaw
logs
--follow
Good output looks like:
cron status
reports enabled与a future
nextWakeAtMs
.
Job is enabled与has a valid schedule/timezone.
cron runs
shows
ok
or explicit skip reason.
Common signatures:
cron: scheduler disabled; jobs will not run automatically
→ cron disabled在config/env.
cron: timer tick failed
→ scheduler tick crashed; inspect surrounding stack/log 上下文.
reason: not-due
in run output → manual run called without
--force
and job not due yet.
​
Cron fired but no delivery
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
20
OpenClaw
cron
list
OpenClaw
频道
status
--probe
OpenClaw
logs
--follow
Good output looks like:
Run status is
ok
.
Delivery mode/target are set为isolated jobs.
频道 probe reports target 频道 connected.
Common signatures:
Run succeeded but delivery mode is
none
→ no external 消息 is expected.
Delivery target missing/invalid (
频道
/
to
) → run may succeed internally but skip outbound.
频道 auth errors (
unauthorized
,
missing_scope
,
Forbidden
) → delivery blocked通过channel credentials/permissions.
​
Heartbeat suppressed或skipped
Copy
OpenClaw
system
heartbeat
last
OpenClaw
logs
--follow
OpenClaw
config
get
智能体.defaults.heartbeat
OpenClaw
频道
status
--probe
Good output looks like:
Heartbeat enabled使用non-zero interval.
Last heartbeat result is
ran
(or skip reason is understood).
Common signatures:
heartbeat skipped
with
reason=quiet-hours
→ outside
activeHours
.
requests-in-flight
→ main lane busy; heartbeat deferred.
empty-heartbeat-file
→
HEARTBEAT.md
exists but has no actionable content.
alerts-disabled
→ visibility settings suppress outbound heartbeat messages.
​
Timezone与activeHours gotchas
Copy
OpenClaw
config
get
智能体.defaults.heartbeat.activeHours
OpenClaw
config
get
智能体.defaults.heartbeat.activeHours.timezone
OpenClaw
config
get
智能体.defaults.userTimezone
||
echo
"智能体.defaults.userTimezone not set"
OpenClaw
cron
list
OpenClaw
logs
--follow
Quick rules:
Config path not found: 智能体.defaults.userTimezone
means the key is unset; heartbeat falls back到host timezone (or
activeHours.timezone
if set).
Cron without
--tz
uses 网关 host timezone.
Heartbeat
activeHours
uses configured timezone resolution (
user
,
local
,或explicit IANA tz).
ISO timestamps without timezone are treated as UTC为cron
at
schedules.
Common signatures:
Jobs run在the wrong wall-clock time after host timezone changes.
Heartbeat always skipped during your daytime because
activeHours.timezone
is wrong.
Related:
/automation/cron-jobs
/网关/heartbeat
/automation/cron-vs-heartbeat
/concepts/timezone
Cron vs Heartbeat
Webhooks
I
[查看英文原版](https://docs.OpenClaw.ai/automation/troubleshooting)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*