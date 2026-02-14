# Location Command - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Media与devices
Location Command
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
Location command (节点)
TL;DR
Why a selector (not just a switch)
Settings 模型
Permissions mapping (node.permissions)
Command: location.get
Background behavior (future)
模型/tooling 集成
UX copy (suggested)
​
Location command (节点)
​
TL;DR
location.get
is a node command (via
node.invoke
).
Off通过default.
Settings use a selector: Off / While Using / Always.
Separate toggle: Precise Location.
​
Why a selector (not just a switch)
OS permissions are multi-level. We can expose a selector in-app, but the OS still decides the actual grant.
iOS/macOS: user can choose
While Using
or
Always
in system prompts/Settings. App can request upgrade, but OS may require Settings.
Android: background location is a separate permission;在Android 10+ it often requires a Settings flow.
Precise location is a separate grant (iOS 14+ “Precise”, Android “fine” vs “coarse”).
Selector在UI drives our requested mode; actual grant lives在OS settings.
​
Settings 模型
Per node device:
location.enabledMode
:
off | whileUsing | always
location.preciseEnabled
: bool
UI behavior:
Selecting
whileUsing
requests foreground permission.
Selecting
always
first ensures
whileUsing
, then requests background (or sends user到Settings if required).
If OS denies requested level, revert到the highest granted level与show status.
​
Permissions mapping (node.permissions)
Optional. macOS node reports
location
via the permissions map; iOS/Android may omit it.
​
Command:
location.get
Called via
node.invoke
.
Params (suggested):
Copy
{
"timeoutMs"
:
10000
,
"maxAgeMs"
:
15000
,
"desiredAccuracy"
:
"coarse|balanced|precise"
}
Response payload:
Copy
{
"lat"
:
48.20849
,
"lon"
:
16.37208
,
"accuracyMeters"
:
12.5
,
"altitudeMeters"
:
182.0
,
"speedMps"
:
0.0
,
"headingDeg"
:
270.0
,
"timestamp"
:
"2026-01-03T12:34:56.000Z"
,
"isPrecise"
:
true
,
"source"
:
"gps|wifi|cell|unknown"
}
Errors (stable codes):
LOCATION_DISABLED
: selector is off.
LOCATION_PERMISSION_REQUIRED
: permission missing为requested mode.
LOCATION_BACKGROUND_UNAVAILABLE
: app is backgrounded but only While Using allowed.
LOCATION_TIMEOUT
: no fix在time.
LOCATION_UNAVAILABLE
: system failure / no 提供者.
​
Background behavior (future)
Goal: 模型 can request location even when node is backgrounded, but only when:
User selected
Always
.
OS grants background location.
App is allowed到run在background为location (iOS background mode / Android foreground service或special allowance).
Push-triggered flow (future):
网关 sends a push到the node (silent push或FCM data).
Node wakes briefly与requests location从the device.
Node forwards payload到网关.
Notes:
iOS: Always permission + background location mode required. Silent push may be throttled; expect intermittent failures.
Android: background location may require a foreground service; otherwise, expect denial.
​
模型/tooling 集成
工具 surface:
节点
工具 adds
location_get
action (node required).
命令行界面:
OpenClaw 节点 location get --node <id>
.
智能体 guidelines: only call when user enabled location与understands the scope.
​
UX copy (suggested)
Off: “Location sharing is disabled.”
While Using: “Only when OpenClaw is open.”
Always: “Allow background location. Requires system permission.”
Precise: “Use precise GPS location. Toggle off到share approximate location.”
Voice Wake
I
[查看英文原版](https://docs.OpenClaw.ai/节点/location-command)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*