# Camera Capture - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Media与devices
Camera Capture
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
Camera capture (智能体)
iOS node
User setting (default on)
Commands (via 网关 node.invoke)
Foreground requirement
命令行界面 helper (temp files + MEDIA)
Android node
Android user setting (default on)
Permissions
Android foreground requirement
Payload guard
macOS app
User setting (default off)
命令行界面 helper (node invoke)
Safety + practical limits
macOS screen video (OS-level)
​
Camera capture (智能体)
OpenClaw supports
camera capture
for 智能体 workflows:
iOS node
(paired via 网关): capture a
photo
(
jpg
) or
short video clip
(
mp4
,使用optional audio) via
node.invoke
.
Android node
(paired via 网关): capture a
photo
(
jpg
) or
short video clip
(
mp4
,使用optional audio) via
node.invoke
.
macOS app
(node via 网关): capture a
photo
(
jpg
) or
short video clip
(
mp4
,使用optional audio) via
node.invoke
.
All camera access is gated behind
user-controlled settings
.
​
iOS node
​
User setting (default on)
iOS Settings tab →
Camera
→
Allow Camera
(
camera.enabled
)
Default:
on
(missing key is treated as enabled).
When off:
camera.*
commands return
CAMERA_DISABLED
.
​
Commands (via 网关
node.invoke
)
camera.list
Response payload:
devices
: array of
{ id, name, position, deviceType }
camera.snap
Params:
facing
:
front|back
(default:
front
)
maxWidth
: number (optional; default
1600
on the iOS node)
quality
:
0..1
(optional; default
0.9
)
format
: currently
jpg
delayMs
: number (optional; default
0
)
deviceId
: string (optional; from
camera.list
)
Response payload:
format: "jpg"
base64: "<...>"
width
,
height
Payload guard: photos are recompressed到keep the base64 payload under 5 MB.
camera.clip
Params:
facing
:
front|back
(default:
front
)
durationMs
: number (default
3000
, clamped到a max of
60000
)
includeAudio
: boolean (default
true
)
format
: currently
mp4
deviceId
: string (optional; from
camera.list
)
Response payload:
format: "mp4"
base64: "<...>"
durationMs
hasAudio
​
Foreground requirement
Like
画布.*
, the iOS node only allows
camera.*
commands在the
foreground
. Background invocations return
NODE_BACKGROUND_UNAVAILABLE
.
​
命令行界面 helper (temp files + MEDIA)
The easiest way到get attachments is via the 命令行界面 helper, which writes decoded media到a temp file与prints
MEDIA:<path>
.
Examples:
Copy
OpenClaw
节点
camera
snap
--node
<
i
d
>
# default: both front + back (2 MEDIA lines)
OpenClaw
节点
camera
snap
--node
<
i
d
>
--facing
front
OpenClaw
节点
camera
clip
--node
<
i
d
>
--duration
3000
OpenClaw
节点
camera
clip
--node
<
i
d
>
--no-audio
Notes:
节点 camera snap
defaults to
both
facings到give the 智能体 both views.
Output files are temporary (in the OS temp directory) unless you 构建 your own wrapper.
​
Android node
​
Android user setting (default on)
Android Settings sheet →
Camera
→
Allow Camera
(
camera.enabled
)
Default:
on
(missing key is treated as enabled).
When off:
camera.*
commands return
CAMERA_DISABLED
.
​
Permissions
Android requires 运行时 permissions:
CAMERA
for both
camera.snap
and
camera.clip
.
RECORD_AUDIO
for
camera.clip
when
includeAudio=true
.
If permissions are missing, the app will 提示词 when possible; if denied,
camera.*
requests fail使用a
*_PERMISSION_REQUIRED
error.
​
Android foreground requirement
Like
画布.*
, the Android node only allows
camera.*
commands在the
foreground
. Background invocations return
NODE_BACKGROUND_UNAVAILABLE
.
​
Payload guard
Photos are recompressed到keep the base64 payload under 5 MB.
​
macOS app
​
User setting (default off)
The macOS companion app exposes a checkbox:
Settings → General → Allow Camera
(
OpenClaw.cameraEnabled
)
Default:
off
When off: camera requests return “Camera disabled通过user”.
​
命令行界面 helper (node invoke)
Use the main
OpenClaw
命令行界面到invoke camera commands在the macOS node.
Examples:
Copy
OpenClaw
节点
camera
list
--node
<
i
d
>
# list camera ids
OpenClaw
节点
camera
snap
--node
<
i
d
>
# prints MEDIA:<path>
OpenClaw
节点
camera
snap
--node
<
i
d
>
--max-width
1280
OpenClaw
节点
camera
snap
--node
<
i
d
>
--delay-ms
2000
OpenClaw
节点
camera
snap
--node
<
i
d
>
--device-id
<
i
d
>
OpenClaw
节点
camera
clip
--node
<
i
d
>
--duration
10s
# prints MEDIA:<path>
OpenClaw
节点
camera
clip
--node
<
i
d
>
--duration-ms
3000
# prints MEDIA:<path> (legacy flag)
OpenClaw
节点
camera
clip
--node
<
i
d
>
--device-id
<
i
d
>
OpenClaw
节点
camera
clip
--node
<
i
d
>
--no-audio
Notes:
OpenClaw 节点 camera snap
defaults to
maxWidth=1600
unless overridden.
On macOS,
camera.snap
waits
delayMs
(default 2000ms) after warm-up/exposure settle before capturing.
Photo payloads are recompressed到keep base64 under 5 MB.
​
Safety + practical limits
Camera与microphone access trigger the usual OS permission prompts (and require usage strings在Info.plist).
Video clips are capped (currently
<= 60s
)到avoid oversized node payloads (base64 overhead + 消息 limits).
​
macOS screen video (OS-level)
For
screen
video (not camera), use the macOS companion:
Copy
OpenClaw
节点
screen
record
--node
<
i
d
>
--duration
10s
--fps
15
# prints MEDIA:<path>
Notes:
Requires macOS
Screen Recording
permission (TCC).
Audio与Voice Notes
Talk Mode
I
[查看英文原版](https://docs.OpenClaw.ai/节点/camera)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*