# 节点 - OpenClaw - 中文翻译


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
节点
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
节点
Pairing + status
Remote node host (system.run)
What runs where
Start a node host (foreground)
Remote 网关 via SSH tunnel (loopback bind)
Start a node host (service)
Pair + name
Allowlist the commands
Point 执行在the node
Invoking commands
Screenshots (画布 snapshots)
画布 controls
A2UI (画布)
Photos + videos (node camera)
Screen recordings (节点)
Location (节点)
SMS (Android 节点)
System commands (node host / mac node)
执行 node binding
Permissions map
Headless node host (cross-platform)
Mac node mode
​
节点
A
node
is a companion device (macOS/iOS/Android/headless)那connects到the 网关
WebSocket
(same port as operators) with
role: "node"
and exposes a command surface (e.g.
画布.*
,
camera.*
,
system.*
) via
node.invoke
. Protocol details:
网关 protocol
.
Legacy transport:
Bridge protocol
(TCP JSONL; deprecated/removed为current 节点).
macOS can also run in
node mode
: the menubar app connects到the 网关’s WS server与exposes its local 画布/camera commands as a node (so
OpenClaw 节点 …
works against这Mac).
Notes:
节点 are
peripherals
, not gateways. They don’t run the 网关 service.
Telegram/WhatsApp/etc. messages land在the
网关
, not在节点.
Troubleshooting runbook:
/节点/troubleshooting
​
Pairing + status
WS 节点 use device pairing.
节点 present a device identity during
connect
; the 网关
creates a device pairing request for
role: node
. Approve via the devices 命令行界面 (or UI).
Quick 命令行界面:
Copy
OpenClaw
devices
list
OpenClaw
devices
approve
<
requestI
d
>
OpenClaw
devices
reject
<
requestI
d
>
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
Notes:
节点 status
marks a node as
paired
when its device pairing role includes
node
.
node.pair.*
(命令行界面:
OpenClaw 节点 pending/approve/reject
) is a separate 网关-owned
node pairing store; it does
not
gate the WS
connect
handshake.
​
Remote node host (system.run)
Use a
node host
when your 网关 runs在one machine与you want commands
to execute在another. The 模型 still talks到the
网关
; the 网关
forwards
执行
calls到the
node host
when
host=node
is selected.
​
What runs where
网关 host
: receives messages, runs the 模型, routes 工具 calls.
Node host
: executes
system.run
/
system.which
on the node machine.
Approvals
: enforced在the node host via
~/.OpenClaw/执行-approvals.JSON
.
​
Start a node host (foreground)
On the node machine:
Copy
OpenClaw
node
run
--host
<
网关-hos
t
>
--port
18789
--display-name
"构建 Node"
​
Remote 网关 via SSH tunnel (loopback bind)
If the 网关 binds到loopback (
网关.bind=loopback
, default在local mode),
remote node hosts cannot connect directly. Create an SSH tunnel与point the
node host在the local end的the tunnel.
Example (node host -> 网关 host):
Copy
# Terminal A (keep 运行): forward local 18790 -> 网关 127.0.0.1:18789
ssh
-N
-L
18790:127.0.0.1:18789
user@网关-host
# Terminal B: export the 网关 token与connect through the tunnel
export
OPENCLAW_GATEWAY_TOKEN
=
"<网关-token>"
OpenClaw
node
run
--host
127.0.0.1
--port
18790
--display-name
"构建 Node"
Notes:
The token is
网关.auth.token
from the 网关 config (
~/.OpenClaw/OpenClaw.JSON
on the 网关 host).
OpenClaw node run
reads
OPENCLAW_GATEWAY_TOKEN
for auth.
​
Start a node host (service)
Copy
OpenClaw
node
安装
--host
<
网关-hos
t
>
--port
18789
--display-name
"构建 Node"
OpenClaw
node
restart
​
Pair + name
On the 网关 host:
Copy
OpenClaw
节点
pending
OpenClaw
节点
approve
<
requestI
d
>
OpenClaw
节点
list
Naming options:
--display-name
on
OpenClaw node run
/
OpenClaw node 安装
(persists in
~/.OpenClaw/node.JSON
on the node).
OpenClaw 节点 rename --node <id|name|ip> --name "构建 Node"
(网关 override).
​
Allowlist the commands
执行 approvals are
per node host
. Add allowlist entries从the 网关:
Copy
OpenClaw
approvals
allowlist
add
--node
<
id
|
name
|
ip
>
"/usr/bin/uname"
OpenClaw
approvals
allowlist
add
--node
<
id
|
name
|
ip
>
"/usr/bin/sw_vers"
Approvals live在the node host at
~/.OpenClaw/执行-approvals.JSON
.
​
Point 执行在the node
配置 defaults (网关 config):
Copy
OpenClaw
config
set
工具.执行.host
node
OpenClaw
config
set
工具.执行.security
allowlist
OpenClaw
config
set
工具.执行.node
"<id-or-name>"
Or per 会话:
Copy
/执行 host=node security=allowlist node=<id-or-name>
Once set, any
执行
call with
host=node
runs在the node host (subject到the
node allowlist/approvals).
Related:
Node host 命令行界面
执行 工具
执行 approvals
​
Invoking commands
Low-level (raw RPC):
Copy
OpenClaw
节点
invoke
--node
<
idOrNameOrI
p
>
--command
画布.eval
--params
'{"javaScript":"location.href"}'
Higher-level helpers exist为the common “give the 智能体 a MEDIA attachment” workflows.
​
Screenshots (画布 snapshots)
If the node is showing the 画布 (WebView),
画布.snapshot
returns
{ format, base64 }
.
命令行界面 helper (writes到a temp file与prints
MEDIA:<path>
):
Copy
OpenClaw
节点
画布
snapshot
--node
<
idOrNameOrI
p
>
--format
png
OpenClaw
节点
画布
snapshot
--node
<
idOrNameOrI
p
>
--format
jpg
--max-width
1200
--quality
0.9
​
画布 controls
Copy
OpenClaw
节点
画布
present
--node
<
idOrNameOrI
p
>
--target
https://example.com
OpenClaw
节点
画布
hide
--node
<
idOrNameOrI
p
>
OpenClaw
节点
画布
navigate
https://example.com
--node
<
idOrNameOrI
p
>
OpenClaw
节点
画布
eval
--node
<
idOrNameOrI
p
>
--js
"document.title"
Notes:
画布 present
accepts URLs或local file paths (
--target
), plus optional
--x/--y/--width/--height
for positioning.
画布 eval
accepts inline JS (
--js
)或a positional arg.
​
A2UI (画布)
Copy
OpenClaw
节点
画布
a2ui
push
--node
<
idOrNameOrI
p
>
--text
"Hello"
OpenClaw
节点
画布
a2ui
push
--node
<
idOrNameOrI
p
>
--jsonl
./payload.jsonl
OpenClaw
节点
画布
a2ui
reset
--node
<
idOrNameOrI
p
>
Notes:
Only A2UI v0.8 JSONL is supported (v0.9/createSurface is rejected).
​
Photos + videos (node camera)
Photos (
jpg
):
Copy
OpenClaw
节点
camera
list
--node
<
idOrNameOrI
p
>
OpenClaw
节点
camera
snap
--node
<
idOrNameOrI
p
>
# default: both facings (2 MEDIA lines)
OpenClaw
节点
camera
snap
--node
<
idOrNameOrI
p
>
--facing
front
Video clips (
mp4
):
Copy
OpenClaw
节点
camera
clip
--node
<
idOrNameOrI
p
>
--duration
10s
OpenClaw
节点
camera
clip
--node
<
idOrNameOrI
p
>
--duration
3000
--no-audio
Notes:
The node must be
foregrounded
for
画布.*
and
camera.*
(background calls return
NODE_BACKGROUND_UNAVAILABLE
).
Clip duration is clamped (currently
<= 60s
)到avoid oversized base64 payloads.
Android will 提示词 for
CAMERA
/
RECORD_AUDIO
permissions when possible; denied permissions fail with
*_PERMISSION_REQUIRED
.
​
Screen recordings (节点)
节点 expose
screen.record
(mp4). 示例：
Copy
OpenClaw
节点
screen
record
--node
<
idOrNameOrI
p
>
--duration
10s
--fps
10
OpenClaw
节点
screen
record
--node
<
idOrNameOrI
p
>
--duration
10s
--fps
10
--no-audio
Notes:
screen.record
requires the node app到be foregrounded.
Android will show the system screen-capture 提示词 before recording.
Screen recordings are clamped to
<= 60s
.
--no-audio
disables microphone capture (supported在iOS/Android; macOS uses system capture audio).
Use
--screen <index>
to select a display when multiple screens are available.
​
Location (节点)
节点 expose
location.get
when Location is enabled在settings.
命令行界面 helper:
Copy
OpenClaw
节点
location
get
--node
<
idOrNameOrI
p
>
OpenClaw
节点
location
get
--node
<
idOrNameOrI
p
>
--accuracy
precise
--max-age
15000
--location-timeout
10000
Notes:
Location is
off通过default
.
“Always” requires system permission; background 获取 is best-effort.
The response includes lat/lon, accuracy (meters),与timestamp.
​
SMS (Android 节点)
Android 节点 can expose
sms.send
when the user grants
SMS
permission与the device supports telephony.
Low-level invoke:
Copy
OpenClaw
节点
invoke
--node
<
idOrNameOrI
p
>
--command
sms.send
--params
'{"to":"+15555550123","消息":"Hello从OpenClaw"}'
Notes:
The permission 提示词 must be accepted在the Android device before the capability is advertised.
Wi-Fi-only devices without telephony will not advertise
sms.send
.
​
System commands (node host / mac node)
The macOS node exposes
system.run
,
system.notify
, and
system.execApprovals.get/set
.
The headless node host exposes
system.run
,
system.which
, and
system.execApprovals.get/set
.
Examples:
Copy
OpenClaw
节点
run
--node
<
idOrNameOrI
p
>
--
echo
"Hello从mac node"
OpenClaw
节点
notify
--node
<
idOrNameOrI
p
>
--title
"Ping"
--body
"网关 ready"
Notes:
system.run
returns stdout/stderr/exit code在the payload.
system.notify
respects notification permission state在the macOS app.
system.run
supports
--cwd
,
--env KEY=VAL
,
--command-timeout
, and
--needs-screen-recording
.
system.notify
supports
--priority <passive|active|timeSensitive>
and
--delivery <system|overlay|auto>
.
macOS 节点 drop
PATH
overrides; headless node hosts only accept
PATH
when it prepends the node host PATH.
On macOS node mode,
system.run
is gated通过执行 approvals在the macOS app (Settings → 执行 approvals).
Ask/allowlist/full behave the same as the headless node host; denied prompts return
SYSTEM_RUN_DENIED
.
On headless node host,
system.run
is gated通过执行 approvals (
~/.OpenClaw/执行-approvals.JSON
).
​
执行 node binding
When multiple 节点 are available, you can bind 执行到a specific node.
This sets the default node for
执行 host=node
(and can be overridden per 智能体).
Global default:
Copy
OpenClaw
config
set
工具.执行.node
"node-id-or-name"
Per-智能体 override:
Copy
OpenClaw
config
get
智能体.list
OpenClaw
config
set
智能体.list[0].工具.执行.node
"node-id-or-name"
Unset到allow any node:
Copy
OpenClaw
config
unset
工具.执行.node
OpenClaw
config
unset
智能体.list[0].工具.执行.node
​
Permissions map
节点 may include a
permissions
map in
node.list
/
node.describe
, keyed通过permission name (e.g.
screenRecording
,
accessibility
)使用boolean values (
true
= granted).
​
Headless node host (cross-platform)
OpenClaw can run a
headless node host
(no UI)那connects到the 网关
WebSocket与exposes
system.run
/
system.which
. 这是 useful在Linux/Windows
or为运行 a minimal node alongside a server.
Start it:
Copy
OpenClaw
node
run
--host
<
网关-hos
t
>
--port
18789
Notes:
Pairing is still required (the 网关 will show a node approval 提示词).
The node host stores its node id, token, display name,与网关 connection info in
~/.OpenClaw/node.JSON
.
执行 approvals are enforced locally via
~/.OpenClaw/执行-approvals.JSON
(see
执行 approvals
).
On macOS, the headless node host prefers the companion app 执行 host when reachable与falls
back到local execution if the app is unavailable. Set
OPENCLAW_NODE_EXEC_HOST=app
to require
the app, or
OPENCLAW_NODE_EXEC_FALLBACK=0
to disable fallback.
Add
--tls
/
--tls-fingerprint
when the 网关 WS uses TLS.
​
Mac node mode
The macOS menubar app connects到the 网关 WS server as a node (so
OpenClaw 节点 …
works against这Mac).
In remote mode, the app opens an SSH tunnel为the 网关 port与connects to
localhost
.
Auth Monitoring
Node Troubleshooting
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/节点)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*