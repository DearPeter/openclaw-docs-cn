# Chrome Extension - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
浏览器
Chrome Extension
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
Auth 监控
Media与devices
节点
节点 Troubleshooting
Image与Media Support
Audio与Voice Notes
Camera Capture
Talk Mode
Voice Wake
Location Command
本页内容
Chrome extension (浏览器 relay)
What it is (concept)
安装 / load (unpacked)
Updates (no 构建 step)
Use it (no extra config)
Attach / detach (toolbar button)
Which tab does it 控制?
Badge + common errors
Remote 网关 (use a 节点 host)
Local 网关 (same machine as Chrome) — usually no extra steps
Remote 网关 (网关 runs elsewhere) — run a 节点 host
Sandboxing (工具 containers)
Remote access tips
How “extension path” works
Security implications (read this)
​
Chrome extension (浏览器 relay)
The OpenClaw Chrome extension lets the 智能体 控制 your
existing Chrome tabs
(your normal Chrome window) instead的launching a separate OpenClaw-managed Chrome profile.
Attach/detach happens via a
single Chrome toolbar button
.
​
What it is (concept)
There are three parts:
浏览器 控制 service
(网关或node): the API the 智能体/工具 calls (via the 网关)
Local relay server
(loopback CDP): bridges between the 控制 server与the extension (
http://127.0.0.1:18792
by default)
Chrome MV3 extension
: attaches到the active tab using
chrome.debugger
and pipes CDP messages到the relay
OpenClaw then controls the attached tab through the normal
浏览器
工具 surface (selecting the right profile).
​
安装 / load (unpacked)
安装 the extension到a stable local path:
Copy
OpenClaw
浏览器
extension
安装
Print the installed extension directory path:
Copy
OpenClaw
浏览器
extension
path
Chrome →
chrome://extensions
Enable “Developer mode”
“Load unpacked” → select the directory printed above
Pin the extension.
​
Updates (no 构建 step)
The extension ships inside the OpenClaw release (npm 包) as static files. There is no separate “构建” step.
After upgrading OpenClaw:
Re-run
OpenClaw 浏览器 extension 安装
to refresh the installed files under your OpenClaw state directory.
Chrome →
chrome://extensions
→ click “Reload”在the extension.
​
Use it (no extra config)
OpenClaw ships使用a built-in 浏览器 profile named
chrome
that targets the extension relay在the default 端口.
Use it:
命令行界面:
OpenClaw 浏览器 --浏览器-profile chrome tabs
智能体 工具:
浏览器
with
profile="chrome"
If you want a different name或a different relay 端口, create your own profile:
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
​
Attach / detach (toolbar button)
Open the tab you want OpenClaw到控制.
Click the extension icon.
Badge shows
ON
when attached.
Click again到detach.
​
Which tab does it 控制?
It does
not
automatically 控制 “whatever tab you’re looking at”.
It controls
only the tab(s) you explicitly attached
by clicking the toolbar button.
To switch: open the other tab与click the extension icon there.
​
Badge + common errors
ON
: attached; OpenClaw can drive那tab.
…
: connecting到the local relay.
!
: relay not reachable (most common: 浏览器 relay server isn’t 运行在this machine).
If you see
!
:
Make sure the 网关 is 运行 locally (default 设置),或run a 节点 host在this machine if the 网关 runs elsewhere.
Open the extension Options page; it shows whether the relay is reachable.
​
Remote 网关 (use a 节点 host)
​
Local 网关 (same machine as Chrome) — usually
no extra steps
If the 网关 runs在the same machine as Chrome, it starts the 浏览器 控制 service在loopback
and auto-starts the relay server. The extension talks到the local relay; the 命令行界面/工具 calls go到the 网关.
​
Remote 网关 (网关 runs elsewhere) —
run a 节点 host
If your 网关 runs在another machine, start a 节点 host在the machine那runs Chrome.
The 网关 will 代理服务器 浏览器 actions到that 节点; the extension + relay stay local到the 浏览器 machine.
If multiple 节点 are connected, pin one with
网关.节点.浏览器.node
or set
网关.节点.浏览器.mode
.
​
Sandboxing (工具 containers)
If your 智能体 会话 is sandboxed (
智能体.defaults.sandbox.mode != "off"
), the
浏览器
工具 can be restricted:
By default, sandboxed sessions often target the
sandbox 浏览器
(
target="sandbox"
), not your host Chrome.
Chrome extension relay takeover requires controlling the
host
浏览器 控制 server.
Options:
Easiest: use the extension从a
non-sandboxed
会话/智能体.
Or allow host 浏览器 控制为sandboxed sessions:
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
浏览器
:
{
allowHostControl
:
true
,
}
,
}
,
}
,
}
,
}
Then ensure the 工具 isn’t denied通过tool policy,与(if needed) call
浏览器
with
target="host"
.
调试:
OpenClaw sandbox explain
​
Remote access tips
Keep the 网关与节点 host在the same tailnet; avoid exposing relay ports到LAN或public Internet.
Pair 节点 intentionally; disable 浏览器 代理服务器 routing if you don’t want remote 控制 (
网关.节点.浏览器.mode="off"
).
​
How “extension path” works
OpenClaw 浏览器 extension path
prints the
installed
on-disk directory containing the extension files.
The 命令行界面 intentionally does
not
print a
节点_modules
path. Always run
OpenClaw 浏览器 extension 安装
first到copy the extension到a stable location under your OpenClaw state directory.
If you move或delete那安装 directory, Chrome will mark the extension as broken until you reload it从a valid path.
​
Security implications (read this)
这是 powerful与risky. Treat it like giving the 模型 “hands在your 浏览器”.
The extension uses Chrome’s debugger API (
chrome.debugger
). When attached, the 模型 can:
click/type/navigate在that tab
read page content
access whatever the tab’s logged-in 会话 can access
这是 not isolated
like the dedicated OpenClaw-managed profile.
If you attach到your daily-driver profile/tab, you’re granting access到that account state.
Recommendations:
Prefer a dedicated Chrome profile (separate从your personal browsing)为extension relay usage.
Keep the 网关与any 节点 hosts tailnet-only; rely在网关 auth + 节点 pairing.
Avoid exposing relay ports over LAN (
0.0.0.0
)与avoid Funnel (public).
The relay blocks non-extension origins与requires an internal auth 令牌为CDP clients.
Related:
浏览器 工具 概述:
浏览器
Security audit:
Security
Tailscale 设置:
Tailscale
浏览器 登录
浏览器 Troubleshooting
I
[查看英文原版](https://docs.OpenClaw.ai/工具/chrome-extension)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*