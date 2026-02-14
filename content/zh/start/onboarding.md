# 入门指南 (macOS App) - OpenClaw - 中文翻译


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
入门指南 (macOS App)
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
入门指南 (macOS App)
​
入门指南 (macOS App)
This doc describes the
current
first‑run 入门指南 flow. The goal is a
smooth “day 0” experience: pick where the 网关 runs, connect auth, run the
向导,与let the 智能体 引导 itself.
For a general 概述的入门指南 paths, see
入门指南 概述
.
1
Approve macOS warning
2
Approve find local networks
3
Welcome与security notice
4
Local vs Remote
Where does the
网关
run?
This Mac (Local only):
入门指南 can run OAuth flows与write credentials
locally.
Remote (over SSH/Tailnet):
入门指南 does
not
run OAuth locally;
credentials must exist在the 网关 host.
配置 later:
skip 设置与leave the app unconfigured.
网关 auth tip:
The 向导 now generates a
token
even为loopback, so local WS clients must authenticate.
If you disable auth, any local 进程 can connect; use那only在fully trusted machines.
Use a
token
for multi‑machine access或non‑loopback binds.
5
Permissions
入门指南 requests TCC permissions needed for:
Automation (AppleScript)
Notifications
Accessibility
Screen Recording
Microphone
Speech Recognition
Camera
Location
6
命令行界面
This step is optional
The app can 安装 the global
OpenClaw
命令行界面 via npm/pnpm so terminal
workflows与launchd 任务 work out的the box.
7
入门指南 Chat (dedicated 会话)
After 设置, the app opens a dedicated 入门指南 chat 会话 so the 智能体 can
introduce itself与guide next steps. This keeps first‑run guidance separate
from your normal conversation. See
引导启动
for
what happens在the 网关 host during the first 智能体 run.
入门指南: 命令行界面
Personal Assistant 设置
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/start/入门指南)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*