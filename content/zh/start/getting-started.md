# Getting Started - OpenClaw - 中文翻译


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
First steps
Getting Started
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
Home
OpenClaw
概述
展示
Core concepts
Features
First steps
Getting Started
入门指南 概述
入门指南: 命令行界面
入门指南: macOS App
Guides
Personal Assistant 设置
本页内容
Getting Started
Prereqs
Quick 设置 (命令行界面)
Optional checks与extras
Useful environment variables
Go deeper
What you will have
Next steps
​
Getting Started
Goal: go从zero到a first working chat使用minimal 设置.
Fastest chat: open the 控制 UI (no 频道 设置 needed). Run
OpenClaw dashboard
and chat在the 浏览器,或open
http://127.0.0.1:18789/
on the
网关 host
.
Docs:
Dashboard
and
控制 UI
.
​
Prereqs
Node 22或newer
Check your Node version with
node --version
if you are unsure.
​
Quick 设置 (命令行界面)
1
安装 OpenClaw (recommended)
macOS/Linux
Windows (PowerShell)
Copy
curl
-fsSL
https://OpenClaw.ai/安装.sh
|
bash
Copy
iwr
-
useb https:
//
OpenClaw.ai
/
安装.ps1
|
iex
Other 安装 methods与requirements:
安装
.
2
Run the 入门指南 向导
Copy
OpenClaw
onboard
--安装-daemon
The 向导 configures auth, 网关 settings,与optional 频道.
See
入门指南 向导
for details.
3
Check the 网关
If you installed the service, it should already be 运行:
Copy
OpenClaw
网关
status
4
Open the 控制 UI
Copy
OpenClaw
dashboard
If the 控制 UI loads, your 网关 is ready为use.
​
Optional checks与extras
Run the 网关在the foreground
Useful为quick tests或troubleshooting.
Copy
OpenClaw
网关
--port
18789
Send a 测试 消息
Requires a configured 频道.
Copy
OpenClaw
消息
send
--target
+15555550123
--消息
"Hello从OpenClaw"
​
Useful environment variables
If you run OpenClaw as a service account或want custom config/state locations:
OPENCLAW_HOME
sets the home directory used为internal path resolution.
OPENCLAW_STATE_DIR
overrides the state directory.
OPENCLAW_CONFIG_PATH
overrides the config file path.
Full environment variable 参考:
Environment vars
.
​
Go deeper
入门指南 向导 (details)
Full 命令行界面 向导 参考与advanced options.
macOS app 入门指南
First run flow为the macOS app.
​
What you will have
A 运行 网关
Auth configured
控制 UI access或a connected 频道
​
Next steps
DM safety与approvals:
Pairing
Connect more 频道:
频道
Advanced workflows与from source:
设置
Features
入门指南 概述
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/start/getting-started#next-steps)ll-have)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*