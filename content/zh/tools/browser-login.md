# 浏览器 登录 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
浏览器
浏览器 登录
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
浏览器 登录 + X/Twitter posting
Manual 登录 (recommended)
Which Chrome profile is used?
X/Twitter: recommended flow
Sandboxing + host 浏览器 access
​
浏览器 登录 + X/Twitter posting
​
Manual 登录 (recommended)
When a site requires 登录,
sign在manually
in the
host
浏览器 profile (the OpenClaw 浏览器).
Do
not
give the 模型 your credentials. Automated logins often trigger anti‑bot defenses与can lock the account.
Back到the main 浏览器 docs:
浏览器
.
​
Which Chrome profile is used?
OpenClaw controls a
dedicated Chrome profile
(named
OpenClaw
, orange‑tinted UI). 这是 separate从your daily 浏览器 profile.
Two easy ways到access it:
Ask the 代理到open the 浏览器
and then log在yourself.
Open it via 命令行界面
:
Copy
OpenClaw
浏览器
start
OpenClaw
浏览器
open
https://x.com
If you have multiple profiles, pass
--浏览器-profile <name>
(the default is
OpenClaw
).
​
X/Twitter: recommended flow
Read/搜索/threads:
use the
host
浏览器 (manual 登录).
Post updates:
use the
host
浏览器 (manual 登录).
​
Sandboxing + host 浏览器 access
Sandboxed 浏览器 sessions are
more likely
to trigger bot detection. For X/Twitter (and other strict sites), prefer the
host
浏览器.
If the 智能体 is sandboxed, the 浏览器 工具 defaults到the sandbox. To allow host 控制:
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
mode
:
"non-main"
,
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
Then target the host 浏览器:
Copy
OpenClaw
浏览器
open
https://x.com
--浏览器-profile
OpenClaw
--target
host
Or disable sandboxing为the 代理那posts updates.
浏览器 (OpenClaw-managed)
Chrome Extension
I
[查看英文原版](https://docs.OpenClaw.ai/工具/浏览器-登录)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*