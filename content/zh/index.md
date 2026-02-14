# OpenClaw - OpenClaw - 中文翻译


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
Home
OpenClaw
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
OpenClaw 🦞
What is OpenClaw?
How it works
Key capabilities
Quick start
Dashboard
配置 (optional)
Start here
Learn more
​
OpenClaw 🦞
“EXFOLIATE! EXFOLIATE!”
— A space lobster, probably
Any OS 网关为AI 智能体 across WhatsApp, Telegram, Discord, iMessage,与more.
Send a 消息, get an 智能体 response从your pocket. Plugins add Mattermost与more.
开始使用
安装 OpenClaw与bring up the 网关在minutes.
Run the 向导
Guided 设置 with
OpenClaw onboard
and pairing flows.
Open the 控制 UI
Launch the 浏览器 dashboard为chat, config,与sessions.
​
What is OpenClaw?
OpenClaw is a
self-hosted 网关
that connects your favorite chat apps — WhatsApp, Telegram, Discord, iMessage,与more —到AI coding 智能体 like Pi. You run a single 网关 进程在your own machine (or a server),与it becomes the bridge between your messaging apps与an always-available AI assistant.
Who is it for?
Developers与power users who want a personal AI assistant they can 消息从anywhere — without giving up 控制的their data或relying在a hosted service.
What makes it different?
Self-hosted
: runs在your hardware, your rules
Multi-频道
: one 网关 serves WhatsApp, Telegram, Discord,与more simultaneously
智能体-native
: built为coding Agent使用tool use, sessions, 记忆,与multi-智能体 routing
Open source
: MIT licensed, community-driven
What do you need?
Node 22+, an API key (Anthropic recommended),与5 minutes.
​
How it works
The 网关 is the single source的truth为sessions, routing,与channel connections.
​
Key capabilities
Multi-频道 网关
WhatsApp, Telegram, Discord,与iMessage使用a single 网关 进程.
Plugin 频道
Add Mattermost与more使用extension packages.
多Agent routing
Isolated sessions per 智能体, 工作空间,或sender.
Media support
Send与receive images, audio,与documents.
网页 控制 UI
浏览器 dashboard为chat, config, sessions,与节点.
Mobile 节点
Pair iOS与Android 节点使用画布 support.
​
Quick start
1
安装 OpenClaw
Copy
npm
安装
-g
OpenClaw@latest
2
Onboard与安装 the service
Copy
OpenClaw
onboard
--安装-daemon
3
Pair WhatsApp与start the 网关
Copy
OpenClaw
频道
登录
OpenClaw
网关
--port
18789
Need the full 安装与dev 设置? See
Quick start
.
​
Dashboard
Open the 浏览器 控制 UI after the 网关 starts.
Local default:
http://127.0.0.1:18789/
Remote access:
网页 surfaces
and
Tailscale
​
配置 (optional)
Config lives at
~/.OpenClaw/OpenClaw.JSON
.
If you
do nothing
, OpenClaw uses the bundled Pi binary在RPC mode使用per-sender sessions.
If you want到lock it down, start with
频道.WhatsApp.allowFrom
and (for groups) mention rules.
示例：
Copy
{
频道
:
{
WhatsApp
:
{
allowFrom
:
[
"+15555550123"
]
,
groups
:
{
"*"
:
{
requireMention
:
true
} }
,
}
,
}
,
messages
:
{
groupChat
:
{
mentionPatterns
:
[
"@OpenClaw"
] } }
,
}
​
Start here
Docs 中心
All docs与guides, organized通过use case.
配置
Core 网关 settings, tokens,与provider config.
Remote access
SSH与tailnet access patterns.
频道
频道-specific 设置为WhatsApp, Telegram, Discord,与more.
节点
iOS与Android 节点使用pairing与画布.
帮助
Common fixes与troubleshooting entry point.
​
Learn more
Full feature list
Complete 频道, routing,与media capabilities.
多Agent routing
工作空间 isolation与per-智能体 sessions.
Security
Tokens, allowlists,与safety controls.
Troubleshooting
网关 diagnostics与common errors.
About与credits
Project origins, contributors,与license.
展示
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/#dashboard))ities)ional)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*