# Node Troubleshooting - OpenClaw - 中文翻译


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
Media与devices
Node Troubleshooting
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
Node troubleshooting
Command ladder
Foreground requirements
Permissions matrix
Pairing versus approvals
Common node error codes
Fast recovery loop
​
Node troubleshooting
Use这page when a node is visible在status but node 工具 fail.
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
Then run node specific checks:
Copy
OpenClaw
节点
status
OpenClaw
节点
describe
--node
<
idOrNameOrI
p
>
OpenClaw
approvals
get
--node
<
idOrNameOrI
p
>
Healthy signals:
Node is connected与paired为role
node
.
节点 describe
includes the capability you are calling.
执行 approvals show expected mode/allowlist.
​
Foreground requirements
画布.*
,
camera.*
, and
screen.*
are foreground only在iOS/Android 节点.
Quick check与fix:
Copy
OpenClaw
节点
describe
--node
<
idOrNameOrI
p
>
OpenClaw
节点
画布
snapshot
--node
<
idOrNameOrI
p
>
OpenClaw
logs
--follow
If you see
NODE_BACKGROUND_UNAVAILABLE
, bring the node app到the foreground与retry.
​
Permissions matrix
Capability
iOS
Android
macOS node app
Typical failure code
camera.snap
,
camera.clip
Camera (+ mic为clip audio)
Camera (+ mic为clip audio)
Camera (+ mic为clip audio)
*_PERMISSION_REQUIRED
screen.record
Screen Recording (+ mic optional)
Screen capture 提示词 (+ mic optional)
Screen Recording
*_PERMISSION_REQUIRED
location.get
While Using或Always (depends在mode)
Foreground/Background location based在mode
Location permission
LOCATION_PERMISSION_REQUIRED
system.run
n/a (node host path)
n/a (node host path)
执行 approvals required
SYSTEM_RUN_DENIED
​
Pairing versus approvals
These are different gates:
Device pairing
: can这node connect到the 网关?
执行 approvals
: can这node run a specific shell command?
Quick checks:
Copy
OpenClaw
devices
list
OpenClaw
节点
status
OpenClaw
approvals
get
--node
<
idOrNameOrI
p
>
OpenClaw
approvals
allowlist
add
--node
<
idOrNameOrI
p
>
"/usr/bin/uname"
If pairing is missing, approve the node device first.
If pairing is fine but
system.run
fails, fix 执行 approvals/allowlist.
​
Common node error codes
NODE_BACKGROUND_UNAVAILABLE
→ app is backgrounded; bring it foreground.
CAMERA_DISABLED
→ camera toggle disabled在node settings.
*_PERMISSION_REQUIRED
→ OS permission missing/denied.
LOCATION_DISABLED
→ location mode is off.
LOCATION_PERMISSION_REQUIRED
→ requested location mode not granted.
LOCATION_BACKGROUND_UNAVAILABLE
→ app is backgrounded but only While Using permission exists.
SYSTEM_RUN_DENIED: approval required
→ 执行 request needs explicit approval.
SYSTEM_RUN_DENIED: allowlist miss
→ command blocked通过allowlist mode.
​
Fast recovery loop
Copy
OpenClaw
节点
status
OpenClaw
节点
describe
--node
<
idOrNameOrI
p
>
OpenClaw
approvals
get
--node
<
idOrNameOrI
p
>
OpenClaw
logs
--follow
If still stuck:
Re-approve device pairing.
Re-open node app (foreground).
Re-grant OS permissions.
Recreate/adjust 执行 approval policy.
Related:
/节点/index
/节点/camera
/节点/location-command
/工具/执行-approvals
/网关/pairing
节点
Image与Media Support
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/节点/troubleshooting)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*