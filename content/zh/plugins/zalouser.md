# Zalo Personal Plugin - OpenClaw - 中文翻译


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
Extensions
Zalo Personal Plugin
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
Zalo Personal (plugin)
Naming
Where it runs
安装
Option A: 安装从npm
Option B: 安装从a local folder (dev)
Prerequisite: zca-命令行界面
Config
命令行界面
智能体 工具
​
Zalo Personal (plugin)
Zalo Personal support为OpenClaw via a plugin, using
zca-命令行界面
to automate a normal Zalo user account.
警告：
Unofficial automation may lead到account suspension/ban. Use在your own risk.
​
Naming
频道 id is
zalouser
to make it explicit这automates a
personal Zalo user account
(unofficial). We keep
zalo
reserved为a potential future official Zalo API 集成.
​
Where it runs
This plugin runs
inside the 网关 进程
.
If you use a remote 网关, 安装/配置 it在the
machine 运行 the 网关
, then restart the 网关.
​
安装
​
Option A: 安装从npm
Copy
OpenClaw
plugins
安装
@OpenClaw/zalouser
Restart the 网关 afterwards.
​
Option B: 安装从a local folder (dev)
Copy
OpenClaw
plugins
安装
./extensions/zalouser
cd
./extensions/zalouser
&&
pnpm
安装
Restart the 网关 afterwards.
​
Prerequisite: zca-命令行界面
The 网关 machine must have
zca
on
PATH
:
Copy
zca
--version
​
Config
频道 config lives under
频道.zalouser
(not
plugins.entries.*
):
Copy
{
频道
:
{
zalouser
:
{
enabled
:
true
,
dmPolicy
:
"pairing"
,
}
,
}
,
}
​
命令行界面
Copy
OpenClaw
频道
登录
--频道
zalouser
OpenClaw
频道
logout
--频道
zalouser
OpenClaw
频道
status
--probe
OpenClaw
消息
send
--频道
zalouser
--target
<
threadI
d
>
--消息
"Hello从OpenClaw"
OpenClaw
directory
peers
list
--频道
zalouser
--query
"name"
​
智能体 工具
工具 name:
zalouser
Actions:
send
,
image
,
link
,
friends
,
groups
,
me
,
status
Voice Call Plugin
Hooks
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/plugins/zalouser)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*