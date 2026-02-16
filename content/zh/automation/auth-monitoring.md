# Auth 监控 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Auth 监控
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
Auth 监控
Preferred: 命令行界面 check (portable)
Optional scripts (ops / phone workflows)
​
Auth 监控
OpenClaw exposes OAuth expiry health via
OpenClaw 模型 status
. Use那for
automation与alerting; scripts are optional extras为phone workflows.
​
Preferred: 命令行界面 check (portable)
Copy
OpenClaw
模型
status
--check
Exit codes:
0
: OK
1
: expired或missing credentials
2
: expiring soon (within 24h)
This works在cron/systemd与requires no extra scripts.
​
Optional scripts (ops / phone workflows)
These live under
scripts/
and are
optional
. They assume SSH access到the
网关 host与are tuned为systemd + Termux.
scripts/claude-auth-status.sh
now uses
OpenClaw 模型 status --JSON
as the
source的truth (falling back到direct file reads if the 命令行界面 is unavailable),
so keep
OpenClaw
on
PATH
for timers.
scripts/auth-monitor.sh
: cron/systemd timer target; sends alerts (ntfy或phone).
scripts/systemd/OpenClaw-auth-monitor.{service,timer}
: systemd user timer.
scripts/claude-auth-status.sh
: Claude Code + OpenClaw auth checker (full/JSON/simple).
scripts/mobile-reauth.sh
: guided re‑auth flow over SSH.
scripts/termux-quick-auth.sh
: one‑tap widget status + open auth URL.
scripts/termux-auth-widget.sh
: full guided widget flow.
scripts/termux-sync-widget.sh
: sync Claude Code creds → OpenClaw.
If you don’t need phone automation或systemd timers, skip这些scripts.
Polls
节点
I
[查看英文原版](https://docs.OpenClaw.ai/automation/auth-monitoring)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*