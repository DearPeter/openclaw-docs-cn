# Reactions - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
Reactions
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
Reaction tooling
​
Reaction tooling
Shared reaction semantics across 频道:
emoji
is required when adding a reaction.
emoji=""
removes the bot’s reaction(s) when supported.
remove: true
removes the specified emoji when supported (requires
emoji
).
频道 notes:
Discord/Slack
: empty
emoji
removes all的the bot’s reactions在the 消息;
remove: true
removes just那emoji.
Google Chat
: empty
emoji
removes the app’s reactions在the 消息;
remove: true
removes just那emoji.
Telegram
: empty
emoji
removes the bot’s reactions;
remove: true
also removes reactions but still requires a non-empty
emoji
for 工具 validation.
WhatsApp
: empty
emoji
removes the bot reaction;
remove: true
maps到empty emoji (still requires
emoji
).
Signal
: inbound reaction notifications emit system events when
频道.signal.reactionNotifications
is enabled.
Thinking Levels
浏览器 (OpenClaw-managed)
I
[查看英文原版](https://docs.OpenClaw.ai/工具/reactions)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*