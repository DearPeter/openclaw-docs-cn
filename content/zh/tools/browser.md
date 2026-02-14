# 浏览器 (OpenClaw-managed) - OpenClaw - 中文翻译


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
浏览器
浏览器 (OpenClaw-managed)
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
浏览器 (OpenClaw-managed)
What you get
Quick start
Profiles: OpenClaw vs chrome
配置
Use Brave (or another Chromium-based 浏览器)
Local vs remote 控制
Node 浏览器 proxy (zero-config default)
Browserless (hosted remote CDP)
Security
Profiles (multi-浏览器)
Chrome extension relay (use your existing Chrome)
Sandboxed sessions
设置
Isolation guarantees
浏览器 selection
控制 API (optional)
Playwright requirement
Docker Playwright 安装
How it works (internal)
命令行界面 quick 参考
Snapshots与refs
Wait power-ups
调试 workflows
JSON output
State与environment knobs
Security & privacy
Troubleshooting
智能体 工具 + how 控制 works
​
浏览器 (OpenClaw-managed)
OpenClaw can run a
dedicated Chrome/Brave/Edge/Chromium profile
that the 智能体 controls.
It is isolated从your personal 浏览器与is managed through a small local
控制 service inside the 网关 (loopback only).
Beginner view:
Think的it as a
separate, 智能体-only 浏览器
.
The
OpenClaw
profile does
not
touch your personal 浏览器 profile.
The 智能体 can
open tabs, read pages, click,与type
in a safe lane.
The default
chrome
profile uses the
system default Chromium 浏览器
via the
extension relay; switch to
OpenClaw
for the isolated managed 浏览器.
​
What you get
A separate 浏览器 profile named
OpenClaw
(orange accent通过default).
Deterministic tab 控制 (list/open/focus/close).
智能体 actions (click/type/drag/select), snapshots, screenshots, PDFs.
Optional multi-profile support (
OpenClaw
,
work
,
remote
, …).
This 浏览器 is
not
your daily driver. It is a safe, isolated surface for
智能体 automation与verification.
​
Quick start
Copy
OpenClaw
浏览器
--浏览器-profile
OpenClaw
status
OpenClaw
浏览器
--浏览器-profile
OpenClaw
start
OpenClaw
浏览器
--浏览器-profile
OpenClaw
open
https://example.com
OpenClaw
浏览器
--浏览器-profile
OpenClaw
snapshot
If you get “浏览器 disabled”, enable it在config (see below)与restart the
网关.
​
Profiles:
OpenClaw
vs
chrome
OpenClaw
: managed, isolated 浏览器 (no extension required).
chrome
: extension relay到your
system 浏览器
(requires the OpenClaw
extension到be attached到a tab).
Set
浏览器.defaultProfile: "OpenClaw"
if you want managed mode通过default.
​
配置
浏览器 settings live in
~/.OpenClaw/OpenClaw.JSON
.
Copy
{
浏览器
:
{
enabled
:
true
,
// default: true
// cdpUrl: "http://127.0.0.1:18792",
// legacy single-profile override
remoteCdpTimeoutMs
:
1500
,
// remote CDP HTTP timeout (ms)
remoteCdpHandshakeTimeoutMs
:
3000
,
// remote CDP WebSocket handshake timeout (ms)
defaultProfile
:
"chrome"
,
color
:
"#FF4500"
,
headless
:
false
,
noSandbox
:
false
,
attachOnly
:
false
,
executablePath
:
"/Applications/Brave 浏览器.app/Contents/MacOS/Brave 浏览器"
,
profiles
:
{
OpenClaw
:
{
cdpPort
:
18800
,
color
:
"#FF4500"
}
,
work
:
{
cdpPort
:
18801
,
color
:
"#0066CC"
}
,
remote
:
{
cdpUrl
:
"http://10.0.0.42:9222"
,
color
:
"#00AA00"
}
,
}
,
}
,
}
Notes:
The 浏览器 控制 service binds到loopback在a port derived from
网关.port
(default:
18791
, which is 网关 + 2). The relay uses the next port (
18792
).
If you override the 网关 port (
网关.port
or
OPENCLAW_GATEWAY_PORT
),
the derived 浏览器 ports shift到stay在the same “family”.
cdpUrl
defaults到the relay port when unset.
remoteCdpTimeoutMs
applies到remote (non-loopback) CDP reachability checks.
remoteCdpHandshakeTimeoutMs
applies到remote CDP WebSocket reachability checks.
attachOnly: true
means “never launch a local 浏览器; only attach if it is already 运行.”
color
+ per-profile
color
tint the 浏览器 UI so you can see which profile is active.
Default profile is
chrome
(extension relay). Use
defaultProfile: "OpenClaw"
for the managed 浏览器.
Auto-detect order: system default 浏览器 if Chromium-based; otherwise Chrome → Brave → Edge → Chromium → Chrome Canary.
Local
OpenClaw
profiles auto-assign
cdpPort
/
cdpUrl
— set那些only为remote CDP.
​
Use Brave (or another Chromium-based 浏览器)
If your
system default
浏览器 is Chromium-based (Chrome/Brave/Edge/etc),
OpenClaw uses it automatically. Set
浏览器.executablePath
to override
auto-detection:
命令行界面 example:
Copy
OpenClaw
config
set
浏览器.executablePath
"/usr/bin/google-chrome"
Copy
// macOS
{
浏览器
:
{
executablePath
:
"/Applications/Brave 浏览器.app/Contents/MacOS/Brave 浏览器"
}
}
// Windows
{
浏览器
:
{
executablePath
:
"C:\\Program Files\\BraveSoftware\\Brave-浏览器\\应用\\brave.exe"
}
}
// Linux
{
浏览器
:
{
executablePath
:
"/usr/bin/brave-浏览器"
}
}
​
Local vs remote 控制
Local 控制 (default):
the 网关 starts the loopback 控制 service与can launch a local 浏览器.
Remote 控制 (node host):
run a node host在the machine那has the 浏览器; the 网关 proxies 浏览器 actions到it.
Remote CDP:
set
浏览器.profiles.<name>.cdpUrl
(or
浏览器.cdpUrl
) to
attach到a remote Chromium-based 浏览器. In这case, OpenClaw will not launch a local 浏览器.
Remote CDP URLs can include auth:
Query tokens (e.g.,
https://provider.example?token=<token>
)
HTTP Basic auth (e.g.,
https://user:
[email protected]
)
OpenClaw preserves the auth when calling
/JSON/*
endpoints与when connecting
to the CDP WebSocket. Prefer environment variables或secrets managers for
tokens instead的committing them到config files.
​
Node 浏览器 proxy (zero-config default)
If you run a
node host
on the machine那has your 浏览器, OpenClaw can
auto-route 浏览器 工具 calls到that node without any extra 浏览器 config.
这是 the default path为remote gateways.
Notes:
The node host exposes its local 浏览器 控制 server via a
proxy command
.
Profiles come从the node’s own
浏览器.profiles
config (same as local).
Disable if you don’t want it:
On the node:
nodeHost.browserProxy.enabled=false
On the 网关:
网关.节点.浏览器.mode="off"
​
Browserless (hosted remote CDP)
Browserless
is a hosted Chromium service那exposes
CDP endpoints over HTTPS. You can point a OpenClaw 浏览器 profile在a
Browserless region endpoint与authenticate使用your API key.
示例：
Copy
{
浏览器
:
{
enabled
:
true
,
defaultProfile
:
"browserless"
,
remoteCdpTimeoutMs
:
2000
,
remoteCdpHandshakeTimeoutMs
:
4000
,
profiles
:
{
browserless
:
{
cdpUrl
:
"https://production-sfo.browserless.io?token=<BROWSERLESS_API_KEY>"
,
color
:
"#00AA00"
,
}
,
}
,
}
,
}
Notes:
Replace
<BROWSERLESS_API_KEY>
with your real Browserless token.
Choose the region endpoint那matches your Browserless account (see their docs).
​
Security
Key ideas:
浏览器 控制 is loopback-only; access flows through the 网关’s auth或node pairing.
If 浏览器 控制 is enabled与no auth is configured, OpenClaw auto-generates
网关.auth.token
on startup与persists it到config.
Keep the 网关与any node hosts在a private network (Tailscale); avoid public exposure.
Treat remote CDP URLs/tokens as secrets; prefer env vars或a secrets manager.
Remote CDP tips:
Prefer HTTPS endpoints与short-lived tokens where possible.
Avoid embedding long-lived tokens directly在config files.
​
Profiles (multi-浏览器)
OpenClaw supports multiple named profiles (routing configs). Profiles can be:
OpenClaw-managed
: a dedicated Chromium-based 浏览器 instance使用its own user data directory + CDP port
remote
: an explicit CDP URL (Chromium-based 浏览器 运行 elsewhere)
extension relay
: your existing Chrome tab(s) via the local relay + Chrome extension
Defaults:
The
OpenClaw
profile is auto-created if missing.
The
chrome
profile is built-in为the Chrome extension relay (points at
http://127.0.0.1:18792
by default).
Local CDP ports allocate from
18800–18899
by default.
Deleting a profile moves its local data directory到Trash.
All 控制 endpoints accept
?profile=<name>
; the 命令行界面 uses
--浏览器-profile
.
​
Chrome extension relay (use your existing Chrome)
OpenClaw can also drive
your existing Chrome tabs
(no separate “OpenClaw” Chrome instance) via a local CDP relay + a Chrome extension.
Full guide:
Chrome extension
Flow:
The 网关 runs locally (same machine)或a node host runs在the 浏览器 machine.
A local
relay server
listens在a loopback
cdpUrl
(default:
http://127.0.0.1:18792
).
You click the
OpenClaw 浏览器 Relay
extension icon在a tab到attach (it does not auto-attach).
The 智能体 controls那tab via the normal
浏览器
工具,通过selecting the right profile.
If the 网关 runs elsewhere, run a node host在the 浏览器 machine so the 网关 can proxy 浏览器 actions.
​
Sandboxed sessions
If the 智能体 会话 is sandboxed, the
浏览器
工具 may default to
target="sandbox"
(sandbox 浏览器).
Chrome extension relay takeover requires host 浏览器 控制, so either:
run the 会话 unsandboxed, or
set
智能体.defaults.sandbox.浏览器.allowHostControl: true
and use
target="host"
when calling the 工具.
​
设置
Load the extension (dev/unpacked):
Copy
OpenClaw
浏览器
extension
安装
Chrome →
chrome://extensions
→ enable “Developer mode”
“Load unpacked” → select the directory printed by
OpenClaw 浏览器 extension path
Pin the extension, then click it在the tab you want到控制 (badge shows
ON
).
Use it:
命令行界面:
OpenClaw 浏览器 --浏览器-profile chrome tabs
智能体 工具:
浏览器
with
profile="chrome"
Optional: if you want a different name或relay port, create your own profile:
Copy
OpenClaw
浏览器
create-profile
\
--name
my-chrome
\
--driver
extension
\
--cdp-url
http://127.0.0.1:18792
\
--color
"#00AA00"
Notes:
This mode relies在Playwright-on-CDP为most operations (screenshots/snapshots/actions).
Detach通过clicking the extension icon again.
​
Isolation guarantees
Dedicated user data dir
: never touches your personal 浏览器 profile.
Dedicated ports
: avoids
9222
to prevent collisions使用dev workflows.
Deterministic tab 控制
: target tabs by
targetId
, not “last tab”.
​
浏览器 selection
When launching locally, OpenClaw picks the first available:
Chrome
Brave
Edge
Chromium
Chrome Canary
You can override with
浏览器.executablePath
.
平台:
macOS: checks
/Applications
and
~/Applications
.
Linux: looks for
google-chrome
,
brave
,
microsoft-edge
,
chromium
, etc.
Windows: checks common 安装 locations.
​
控制 API (optional)
For local integrations only, the 网关 exposes a small loopback HTTP API:
Status/start/stop:
GET /
,
POST /start
,
POST /stop
Tabs:
GET /tabs
,
POST /tabs/open
,
POST /tabs/focus
,
DELETE /tabs/:targetId
Snapshot/screenshot:
GET /snapshot
,
POST /screenshot
Actions:
POST /navigate
,
POST /act
Hooks:
POST /hooks/file-chooser
,
POST /hooks/dialog
Downloads:
POST /download
,
POST /wait/download
Debugging:
GET /console
,
POST /pdf
Debugging:
GET /errors
,
GET /requests
,
POST /trace/start
,
POST /trace/stop
,
POST /highlight
Network:
POST /response/body
State:
GET /cookies
,
POST /cookies/set
,
POST /cookies/clear
State:
GET /storage/:kind
,
POST /storage/:kind/set
,
POST /storage/:kind/clear
Settings:
POST /set/offline
,
POST /set/headers
,
POST /set/credentials
,
POST /set/geolocation
,
POST /set/media
,
POST /set/timezone
,
POST /set/locale
,
POST /set/device
All endpoints accept
?profile=<name>
.
If 网关 auth is configured, 浏览器 HTTP routes require auth too:
授权: Bearer <网关 token>
x-OpenClaw-password: <网关 password>
or HTTP Basic auth使用that password
​
Playwright requirement
Some features (navigate/act/AI snapshot/role snapshot, element screenshots, PDF) require
Playwright. If Playwright isn’t installed,那些endpoints return a clear 501
error. ARIA snapshots与basic screenshots still work为OpenClaw-managed Chrome.
For the Chrome extension relay driver, ARIA snapshots与screenshots require Playwright.
If you see
Playwright is not available在this 网关 构建
, 安装 the full
Playwright package (not
playwright-core
)与restart the 网关,或reinstall
OpenClaw使用浏览器 support.
​
Docker Playwright 安装
If your 网关 runs在Docker, avoid
npx playwright
(npm override conflicts).
Use the bundled 命令行界面 instead:
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
\
node
/app/node_modules/playwright-core/命令行界面.js
安装
chromium
To persist 浏览器 downloads, set
PLAYWRIGHT_BROWSERS_PATH
(for example,
/home/node/.cache/ms-playwright
)与make sure
/home/node
is persisted via
OPENCLAW_HOME_VOLUME
or a bind mount. See
Docker
.
​
How it works (internal)
High-level flow:
A small
控制 server
accepts HTTP requests.
It connects到Chromium-based browsers (Chrome/Brave/Edge/Chromium) via
CDP
.
For advanced actions (click/type/snapshot/PDF), it uses
Playwright
on top
of CDP.
When Playwright is missing, only non-Playwright operations are available.
This design keeps the agent在a stable, deterministic interface while letting
you swap local/remote browsers与profiles.
​
命令行界面 quick 参考
All commands accept
--浏览器-profile <name>
to target a specific profile.
All commands also accept
--JSON
for machine-readable output (stable payloads).
Basics:
OpenClaw 浏览器 status
OpenClaw 浏览器 start
OpenClaw 浏览器 stop
OpenClaw 浏览器 tabs
OpenClaw 浏览器 tab
OpenClaw 浏览器 tab new
OpenClaw 浏览器 tab select 2
OpenClaw 浏览器 tab close 2
OpenClaw 浏览器 open https://example.com
OpenClaw 浏览器 focus abcd1234
OpenClaw 浏览器 close abcd1234
Inspection:
OpenClaw 浏览器 screenshot
OpenClaw 浏览器 screenshot --full-page
OpenClaw 浏览器 screenshot --ref 12
OpenClaw 浏览器 screenshot --ref e12
OpenClaw 浏览器 snapshot
OpenClaw 浏览器 snapshot --format aria --limit 200
OpenClaw 浏览器 snapshot --interactive --compact --depth 6
OpenClaw 浏览器 snapshot --efficient
OpenClaw 浏览器 snapshot --labels
OpenClaw 浏览器 snapshot --selector "#main" --interactive
OpenClaw 浏览器 snapshot --frame "iframe#main" --interactive
OpenClaw 浏览器 console --level error
OpenClaw 浏览器 errors --clear
OpenClaw 浏览器 requests --filter api --clear
OpenClaw 浏览器 pdf
OpenClaw 浏览器 responsebody "**/api" --max-chars 5000
Actions:
OpenClaw 浏览器 navigate https://example.com
OpenClaw 浏览器 resize 1280 720
OpenClaw 浏览器 click 12 --double
OpenClaw 浏览器 click e12 --double
OpenClaw 浏览器 type 23 "hello" --submit
OpenClaw 浏览器 press Enter
OpenClaw 浏览器 hover 44
OpenClaw 浏览器 scrollintoview e12
OpenClaw 浏览器 drag 10 11
OpenClaw 浏览器 select 9 OptionA OptionB
OpenClaw 浏览器 download e12 report.pdf
OpenClaw 浏览器 waitfordownload report.pdf
OpenClaw 浏览器 upload /tmp/file.pdf
OpenClaw 浏览器 fill --fields '[{"ref":"1","type":"text","value":"Ada"}]'
OpenClaw 浏览器 dialog --accept
OpenClaw 浏览器 wait --text "Done"
OpenClaw 浏览器 wait "#main" --url "**/dash" --load networkidle --fn "window.ready===true"
OpenClaw 浏览器 evaluate --fn '(el) => el.textContent' --ref 7
OpenClaw 浏览器 highlight e12
OpenClaw 浏览器 trace start
OpenClaw 浏览器 trace stop
State:
OpenClaw 浏览器 cookies
OpenClaw 浏览器 cookies set 会话 abc123 --url "https://example.com"
OpenClaw 浏览器 cookies clear
OpenClaw 浏览器 storage local get
OpenClaw 浏览器 storage local set theme dark
OpenClaw 浏览器 storage 会话 clear
OpenClaw 浏览器 set offline on
OpenClaw 浏览器 set headers --JSON '{"X-调试":"1"}'
OpenClaw 浏览器 set credentials user pass
OpenClaw 浏览器 set credentials --clear
OpenClaw 浏览器 set geo 37.7749 -122.4194 --origin "https://example.com"
OpenClaw 浏览器 set geo --clear
OpenClaw 浏览器 set media dark
OpenClaw 浏览器 set timezone America/New_York
OpenClaw 浏览器 set locale en-US
OpenClaw 浏览器 set device "iPhone 14"
Notes:
upload
and
dialog
are
arming
calls; run them before the click/press
that triggers the chooser/dialog.
Download与trace output paths are constrained到OpenClaw temp roots:
traces:
/tmp/OpenClaw
(fallback:
${os.tmpdir()}/OpenClaw
)
downloads:
/tmp/OpenClaw/downloads
(fallback:
${os.tmpdir()}/OpenClaw/downloads
)
upload
can also set file inputs directly via
--input-ref
or
--element
.
snapshot
:
--format ai
(default when Playwright is installed): returns an AI snapshot使用numeric refs (
aria-ref="<n>"
).
--format aria
: returns the accessibility tree (no refs; inspection only).
--efficient
(or
--mode efficient
): compact role snapshot preset (interactive + compact + depth + lower maxChars).
Config default (工具/命令行界面 only): set
浏览器.snapshotDefaults.mode: "efficient"
to use efficient snapshots when the caller does not pass a mode (see
网关 配置
).
Role snapshot options (
--interactive
,
--compact
,
--depth
,
--selector
) force a role-based snapshot使用refs like
ref=e12
.
--frame "<iframe selector>"
scopes role snapshots到an iframe (pairs使用role refs like
e12
).
--interactive
outputs a flat, easy-to-pick list的interactive elements (best为driving actions).
--labels
adds a viewport-only screenshot使用overlayed ref labels (prints
MEDIA:<path>
).
click
/
type
/etc require a
ref
from
snapshot
(either numeric
12
or role ref
e12
).
CSS selectors are intentionally not supported为actions.
​
Snapshots与refs
OpenClaw supports two “snapshot” styles:
AI snapshot (numeric refs)
:
OpenClaw 浏览器 snapshot
(default;
--format ai
)
Output: a text snapshot那includes numeric refs.
Actions:
OpenClaw 浏览器 click 12
,
OpenClaw 浏览器 type 23 "hello"
.
Internally, the ref is resolved via Playwright’s
aria-ref
.
Role snapshot (role refs like
e12
)
:
OpenClaw 浏览器 snapshot --interactive
(or
--compact
,
--depth
,
--selector
,
--frame
)
Output: a role-based list/tree with
[ref=e12]
(and optional
[nth=1]
).
Actions:
OpenClaw 浏览器 click e12
,
OpenClaw 浏览器 highlight e12
.
Internally, the ref is resolved via
getByRole(...)
(plus
nth()
for duplicates).
Add
--labels
to include a viewport screenshot使用overlayed
e12
labels.
Ref behavior:
Refs are
not stable across navigations
; if something fails, re-run
snapshot
and use a fresh ref.
If the role snapshot was taken with
--frame
, role refs are scoped到that iframe until the next role snapshot.
​
Wait power-ups
You can wait在more than just time/text:
Wait为URL (globs supported通过Playwright):
OpenClaw 浏览器 wait --url "**/dash"
Wait为load state:
OpenClaw 浏览器 wait --load networkidle
Wait为a JS predicate:
OpenClaw 浏览器 wait --fn "window.ready===true"
Wait为a selector到become visible:
OpenClaw 浏览器 wait "#main"
These can be combined:
Copy
OpenClaw
浏览器
wait
"#main"
\
--url
"**/dash"
\
--load
networkidle
\
--fn
"window.ready===true"
\
--timeout-ms
15000
​
调试 workflows
When an action fails (e.g. “not visible”, “strict mode violation”, “covered”):
OpenClaw 浏览器 snapshot --interactive
Use
click <ref>
/
type <ref>
(prefer role refs在interactive mode)
If it still fails:
OpenClaw 浏览器 highlight <ref>
to see what Playwright is targeting
If the page behaves oddly:
OpenClaw 浏览器 errors --clear
OpenClaw 浏览器 requests --filter api --clear
For deep debugging: record a trace:
OpenClaw 浏览器 trace start
reproduce the issue
OpenClaw 浏览器 trace stop
(prints
TRACE:<path>
)
​
JSON output
--JSON
is为scripting与structured tooling.
Examples:
Copy
OpenClaw
浏览器
status
--JSON
OpenClaw
浏览器
snapshot
--interactive
--JSON
OpenClaw
浏览器
requests
--filter
api
--JSON
OpenClaw
浏览器
cookies
--JSON
Role snapshots在JSON include
refs
plus a small
stats
block (lines/chars/refs/interactive) so 工具 can reason about payload size与density.
​
State与environment knobs
These are useful为“make the site behave like X” workflows:
Cookies:
cookies
,
cookies set
,
cookies clear
Storage:
storage local|会话 get|set|clear
Offline:
set offline on|off
Headers:
set headers --JSON '{"X-调试":"1"}'
(or
--clear
)
HTTP basic auth:
set credentials user pass
(or
--clear
)
Geolocation:
set geo <lat> <lon> --origin "https://example.com"
(or
--clear
)
Media:
set media dark|light|no-preference|none
Timezone / locale:
set timezone ...
,
set locale ...
Device / viewport:
set device "iPhone 14"
(Playwright device presets)
set viewport 1280 720
​
Security & privacy
The OpenClaw 浏览器 profile may contain logged-in sessions; treat it as sensitive.
浏览器 act kind=evaluate
/
OpenClaw 浏览器 evaluate
and
wait --fn
execute arbitrary JavaScript在the page 上下文. 提示词 injection can steer
this. Disable it with
浏览器.evaluateEnabled=false
if you do not need it.
For logins与anti-bot notes (X/Twitter, etc.), see
浏览器 登录 + X/Twitter posting
.
Keep the 网关/node host private (loopback或tailnet-only).
Remote CDP endpoints are powerful; tunnel与protect them.
​
Troubleshooting
For Linux-specific issues (especially snap Chromium), see
浏览器 troubleshooting
.
​
智能体 工具 + how 控制 works
The 智能体 gets
one 工具
for 浏览器 automation:
浏览器
— status/start/stop/tabs/open/focus/close/snapshot/screenshot/navigate/act
How it maps:
浏览器 snapshot
returns a stable UI tree (AI或ARIA).
浏览器 act
uses the snapshot
ref
IDs到click/type/drag/select.
浏览器 screenshot
captures pixels (full page或element).
浏览器
accepts:
profile
to choose a named 浏览器 profile (OpenClaw, chrome,或remote CDP).
target
(
sandbox
|
host
|
node
)到select where the 浏览器 lives.
In sandboxed sessions,
target: "host"
requires
智能体.defaults.sandbox.浏览器.allowHostControl=true
.
If
target
is omitted: sandboxed sessions default to
sandbox
, non-sandbox sessions default to
host
.
If a 浏览器-capable node is connected, the 工具 may auto-route到it unless you pin
target="host"
or
target="node"
.
This keeps the 智能体 deterministic与avoids brittle selectors.
Reactions
浏览器 登录
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/浏览器)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*