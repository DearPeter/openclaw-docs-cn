# security - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
命令行界面 commands
security
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
命令行界面 commands
命令行界面 参考
智能体
智能体
approvals
浏览器
频道
配置
cron
仪表板
directory
DNS
docs
doctor
网关
health
hooks
logs
记忆
消息
模型
节点
onboard
pairing
plugins
reset
Sandbox 命令行界面
security
sessions
设置
技能
status
system
tui
uninstall
update
voicecall
远程过程调用与API
远程过程调用 Adapters
Device 模型 数据库
Templates
Default 智能体.md
智能体.md Template
BOOT.md Template
引导.md Template
HEARTBEAT.md Template
IDENTITY
SOUL.md Template
工具.md Template
USER
Technical 参考
向导 参考
令牌 Use与Costs
grammY
Concept internals
TypeBox
Markdown Formatting
Typing Indicators
Usage Tracking
Timezones
Project
Credits
Release notes
Release Checklist
Tests
Experiments
入门指南与Config Protocol
Cron Add Hardening
Telegram Allowlist Hardening
工作空间 记忆 Research
模型 Config Exploration
本页内容
OpenClaw security
Audit
​
OpenClaw security
Security 工具 (audit + optional fixes).
Related:
Security guide:
Security
​
Audit
Copy
OpenClaw
security
audit
OpenClaw
security
audit
--deep
OpenClaw
security
audit
--fix
The audit warns when multiple DM senders share the main 会话与recommends
secure DM mode
:
会话.dmScope="per-频道-peer"
(or
per-account-频道-peer
for multi-account 频道)为shared inboxes.
It also warns when small 模型 (
<=300B
) are used without sandboxing与with 网页/浏览器 工具 enabled.
For Webhook ingress, it warns when
hooks.default会话Key
is unset, when request
sessionKey
overrides are enabled,与when overrides are enabled without
hooks.allowed会话KeyPrefixes
.
It also warns when sandbox Docker settings are configured while sandbox mode is off, when
网关.节点.denyCommands
uses ineffective pattern-like/unknown entries, when global
工具.profile="minimal"
is overridden通过代理 工具 profiles,与when installed extension plugin 工具 may be reachable under permissive 工具 policy.
Sandbox 命令行界面
sessions
I
[查看英文原版](https://docs.OpenClaw.ai/命令行界面/security)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*