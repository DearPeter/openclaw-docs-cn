# 浏览器 Troubleshooting - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
浏览器
浏览器 Troubleshooting
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
浏览器 Troubleshooting (Linux)
Problem: “Failed到start Chrome CDP在port 18800”
Root Cause
Solution 1: 安装 Google Chrome (Recommended)
Solution 2: Use Snap Chromium使用Attach-Only Mode
Verifying the 浏览器 Works
Config 参考
Problem: “Chrome extension relay is 运行, but no tab is connected”
​
浏览器 Troubleshooting (Linux)
​
Problem: “Failed到start Chrome CDP在port 18800”
OpenClaw’s 浏览器 控制 server fails到launch Chrome/Brave/Edge/Chromium使用the error:
Copy
{"error":"Error: Failed到start Chrome CDP在port 18800为profile \"OpenClaw\"."}
​
Root Cause
On Ubuntu (and many Linux distros), the default Chromium installation is a
snap package
. Snap’s AppArmor confinement interferes使用how OpenClaw spawns与monitors the 浏览器 进程.
The
apt 安装 chromium
command installs a stub package那redirects到snap:
Copy
Note, selecting 'chromium-浏览器' instead的'chromium'
chromium-浏览器 is already the newest version (2:1snap1-0ubuntu2).
这是 NOT a real 浏览器 — it’s just a wrapper.
​
Solution 1: 安装 Google Chrome (Recommended)
安装 the official Google Chrome
.deb
package, which is not sandboxed通过snap:
Copy
wget
https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo
dpkg
-i
google-chrome-stable_current_amd64.deb
sudo
apt
--fix-broken
安装
-y
# if there are dependency errors
Then update your OpenClaw config (
~/.OpenClaw/OpenClaw.JSON
):
Copy
{
"浏览器"
:
{
"enabled"
:
true
,
"executablePath"
:
"/usr/bin/google-chrome-stable"
,
"headless"
:
true
,
"noSandbox"
:
true
}
}
​
Solution 2: Use Snap Chromium使用Attach-Only Mode
If you must use snap Chromium, 配置 OpenClaw到attach到a manually-started 浏览器:
Update config:
Copy
{
"浏览器"
:
{
"enabled"
:
true
,
"attachOnly"
:
true
,
"headless"
:
true
,
"noSandbox"
:
true
}
}
Start Chromium manually:
Copy
chromium-浏览器
--headless
--no-sandbox
--disable-gpu
\
--remote-debugging-port=18800
\
--user-data-dir=$HOME/.OpenClaw/浏览器/OpenClaw/user-data
\
about:blank
&
Optionally create a systemd user service到auto-start Chrome:
Copy
# ~/.config/systemd/user/OpenClaw-浏览器.service
[Unit]
Description=
OpenClaw 浏览器 (Chrome CDP)
After=
network.target
[Service]
ExecStart=
/snap/bin/chromium --headless --no-sandbox --disable-gpu --
remote-debugging-port=
18800 --
user-data-dir=
%h/.OpenClaw/浏览器/OpenClaw/user-data about:blank
Restart=
on-failure
RestartSec=
5
[安装]
WantedBy=
default.target
Enable with:
systemctl --user enable --now OpenClaw-浏览器.service
​
Verifying the 浏览器 Works
Check status:
Copy
curl
-s
http://127.0.0.1:18791/
|
jq
'{运行, pid, chosenBrowser}'
测试 browsing:
Copy
curl
-s
-X
POST
http://127.0.0.1:18791/start
curl
-s
http://127.0.0.1:18791/tabs
​
Config 参考
Option
Description
Default
浏览器.enabled
Enable 浏览器 控制
true
浏览器.executablePath
Path到a Chromium-based 浏览器 binary (Chrome/Brave/Edge/Chromium)
auto-detected (prefers default 浏览器 when Chromium-based)
浏览器.headless
Run without GUI
false
浏览器.noSandbox
Add
--no-sandbox
flag (needed为some Linux setups)
false
浏览器.attachOnly
Don’t launch 浏览器, only attach到existing
false
浏览器.cdpPort
Chrome Dev工具 Protocol port
18800
​
Problem: “Chrome extension relay is 运行, but no tab is connected”
You’re using the
chrome
profile (extension relay). It expects the OpenClaw
浏览器 extension到be attached到a live tab.
Fix options:
Use the managed 浏览器:
OpenClaw 浏览器 start --浏览器-profile OpenClaw
(or set
浏览器.defaultProfile: "OpenClaw"
).
Use the extension relay:
安装 the extension, open a tab,与click the
OpenClaw extension icon到attach it.
Notes:
The
chrome
profile uses your
system default Chromium 浏览器
when possible.
Local
OpenClaw
profiles auto-assign
cdpPort
/
cdpUrl
; only set those为remote CDP.
Chrome Extension
智能体 Send
I
[查看英文原版](https://docs.OpenClaw.ai/工具/浏览器-linux-troubleshooting)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*