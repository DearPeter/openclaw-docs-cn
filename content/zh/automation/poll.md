# Polls - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Polls
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
Polls
Supported 频道
命令行界面
网关 RPC
频道 differences
智能体 工具 (消息)
​
Polls
​
Supported 频道
WhatsApp (网页 频道)
Discord
MS Teams (Adaptive Cards)
​
命令行界面
Copy
# WhatsApp
OpenClaw
消息
poll
--target
+15555550123
\
--poll-question
"Lunch today?"
--poll-option
"Yes"
--poll-option
"No"
--poll-option
"Maybe"
OpenClaw
消息
poll
--target
[email protected]
\
--poll-question
"Meeting time?"
--poll-option
"10am"
--poll-option
"2pm"
--poll-option
"4pm"
--poll-multi
# Discord
OpenClaw
消息
poll
--频道
Discord
--target
频道:123456789
\
--poll-question
"Snack?"
--poll-option
"Pizza"
--poll-option
"Sushi"
OpenClaw
消息
poll
--频道
Discord
--target
频道:123456789
\
--poll-question
"Plan?"
--poll-option
"A"
--poll-option
"B"
--poll-duration-hours
48
# MS Teams
OpenClaw
消息
poll
--频道
msteams
--target
conversation:19:
[email protected]
\
--poll-question
"Lunch?"
--poll-option
"Pizza"
--poll-option
"Sushi"
Options:
--频道
:
WhatsApp
(default),
Discord
, or
msteams
--poll-multi
: allow selecting multiple options
--poll-duration-hours
: Discord-only (defaults到24 when omitted)
​
网关 RPC
Method:
poll
Params:
to
(string, required)
question
(string, required)
options
(string[], required)
maxSelections
(number, optional)
durationHours
(number, optional)
频道
(string, optional, default:
WhatsApp
)
idempotencyKey
(string, required)
​
频道 differences
WhatsApp: 2-12 options,
maxSelections
must be within option count, ignores
durationHours
.
Discord: 2-10 options,
durationHours
clamped到1-768 hours (default 24).
maxSelections > 1
enables multi-select; Discord does not support a strict selection count.
MS Teams: Adaptive Card polls (OpenClaw-managed). No native poll API;
durationHours
is ignored.
​
智能体 工具 (消息)
Use the
消息
工具 with
poll
action (
to
,
pollQuestion
,
pollOption
, optional
pollMulti
,
pollDurationHours
,
频道
).
Note: Discord has no “pick exactly N” mode;
pollMulti
maps到multi-select.
Teams polls are rendered as Adaptive Cards与require the 网关到stay online
to record votes in
~/.OpenClaw/msteams-polls.JSON
.
Gmail PubSub
Auth Monitoring
I
[查看英文原版](https://docs.OpenClaw.ai/automation/poll)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*