# 入门指南 向导 (命令行界面) - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
First steps
入门指南 向导 (命令行界面)
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
入门指南 向导 (命令行界面)
快速开始 vs Advanced
What the 向导 configures
Add another 智能体
Full 参考
Related docs
​
入门指南 向导 (命令行界面)
The 入门指南 向导 is the
recommended
way到set up OpenClaw在macOS,
Linux,或Windows (via WSL2; strongly recommended).
It configures a local 网关或a remote 网关 connection, plus 频道, 技能,
and 工作空间 defaults在one guided flow.
Copy
OpenClaw
onboard
Fastest first chat: open the 控制 UI (no 频道 设置 needed). Run
OpenClaw dashboard
and chat在the 浏览器. Docs:
Dashboard
.
To reconfigure later:
Copy
OpenClaw
配置
OpenClaw
智能体
add
<
nam
e
>
--JSON
does not imply non-interactive mode. For scripts, use
--non-interactive
.
web_search
(
web_fetch
works without a key). Easiest path:
OpenClaw 配置 --section 网页
which stores
工具.网页.搜索.apiKey
. Docs:
网页 工具
.
​
快速开始 vs Advanced
The 向导 starts with
快速开始
(defaults) vs
Advanced
(full 控制).
快速开始 (defaults)
Advanced (full 控制)
Local 网关 (loopback)
工作空间 default (or existing 工作空间)
网关 port
18789
网关 auth
Token
(auto‑generated, even在loopback)
Tailscale exposure
Off
Telegram + WhatsApp DMs default to
allowlist
(you’ll be prompted为your phone number)
Exposes every step (mode, 工作空间, 网关, 频道, daemon, 技能).
​
What the 向导 configures
Local mode (default)
walks you through这些steps:
模型/Auth
— Anthropic API key (recommended), OpenAI,或Custom Provider
(OpenAI-compatible, Anthropic-compatible,或Unknown auto-detect). Pick a default 模型.
工作空间
— Location为agent files (default
~/.OpenClaw/工作空间
). Seeds 引导 files.
网关
— Port, bind address, auth mode, Tailscale exposure.
频道
— WhatsApp, Telegram, Discord, Google Chat, Mattermost, Signal, BlueBubbles,或iMessage.
Daemon
— 安装s a LaunchAgent (macOS)或systemd user unit (Linux/WSL2).
Health check
— Starts the 网关与verifies it’s 运行.
技能
— 安装s recommended 技能与optional dependencies.
Re-运行 the 向导 does
not
wipe anything unless you explicitly choose
Reset
(or pass
--reset
).
If the config is invalid或contains legacy keys, the 向导 asks you到run
OpenClaw doctor
first.
Remote mode
only configures the local client到connect到a 网关 elsewhere.
It does
not
安装或change anything在the remote host.
​
Add another 智能体
Use
OpenClaw 智能体 add <name>
来创建 a separate agent使用its own 工作空间,
sessions,与auth profiles. 运行 without
--工作空间
launches the 向导.
What it sets:
智能体.list[].name
智能体.list[].工作空间
智能体.list[].agentDir
Notes:
Default workspaces follow
~/.OpenClaw/工作空间-<agentId>
.
Add
bindings
to route inbound messages (the 向导 can do this).
Non-interactive flags:
--模型
,
--智能体-dir
,
--bind
,
--non-interactive
.
​
Full 参考
For detailed step-by-step breakdowns, non-interactive scripting, Signal 设置,
RPC API,与a full list的config fields the 向导 writes, see the
向导 参考
.
​
Related docs
命令行界面 command 参考:
OpenClaw onboard
入门指南 概述:
入门指南 概述
macOS app 入门指南:
入门指南
智能体 first-run ritual:
智能体 引导启动
入门指南 概述
入门指南: macOS App
I
[查看英文原版](https://docs.OpenClaw.ai/start/向导)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*