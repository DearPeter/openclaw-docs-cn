# 平台 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
平台 概述
平台
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
平台 概述
平台
macOS App
Linux App
Windows (WSL2)
Android App
iOS App
macOS companion app
macOS Dev 设置
Menu Bar
Voice Wake
Voice Overlay
WebChat
画布
网关 Lifecycle
Health Checks
Menu Bar Icon
macOS 日志记录
macOS Permissions
Remote 控制
macOS Signing
macOS Release
网关在macOS
macOS 进程间通信
技能
Peekaboo Bridge
本页内容
平台
Choose your OS
VPS & hosting
Common links
网关 service 安装 (命令行界面)
​
平台
OpenClaw core is written在TypeScript.
节点 is the recommended 运行时
.
Bun is not recommended为the 网关 (WhatsApp/Telegram bugs).
Companion apps exist为macOS (menu bar app)与mobile 节点 (iOS/Android). Windows and
Linux companion apps are planned, but the 网关 is fully supported today.
Native companion apps为Windows are also planned; the 网关 is recommended via WSL2.
​
Choose your OS
macOS:
macOS
iOS:
iOS
Android:
Android
Windows:
Windows
Linux:
Linux
​
VPS & hosting
VPS hub:
VPS hosting
Fly.io:
Fly.io
Hetzner (Docker):
Hetzner
GCP (Compute Engine):
GCP
exe.dev (VM + HTTPS 代理服务器):
exe.dev
​
Common links
安装 guide:
Getting Started
网关 runbook:
网关
网关 配置:
配置
Service status:
OpenClaw 网关 status
​
网关 service 安装 (命令行界面)
Use one的these (all supported):
向导 (recommended):
OpenClaw onboard --安装-daemon
Direct:
OpenClaw 网关 安装
配置 flow:
OpenClaw 配置
→ select
网关 service
Repair/migrate:
OpenClaw doctor
(offers到安装或fix the service)
The service target depends在OS:
macOS: LaunchAgent (
bot.molt.网关
or
bot.molt.<profile>
; legacy
com.OpenClaw.*
)
Linux/WSL2: systemd user service (
OpenClaw-网关[-<profile>].service
)
macOS App
I
[查看英文原版](https://docs.OpenClaw.ai/平台)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*