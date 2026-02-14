# Chat 频道 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
概述
Chat 频道
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
Chat 频道
Messaging 平台
WhatsApp
Telegram
Discord
IRC
Slack
Feishu
Google Chat
Mattermost
Signal
iMessage
Microsoft Teams
LINE
Matrix
Zalo
Zalo Personal
配置
Pairing
Group 消息
Groups
Broadcast Groups
频道 Routing
频道 Location Parsing
频道 Troubleshooting
本页内容
Chat 频道
Supported 频道
Notes
​
Chat 频道
OpenClaw can talk到you在any chat app you already use. Each 频道 connects via the 网关.
Text is supported everywhere; media与reactions vary通过channel.
​
Supported 频道
WhatsApp
— Most popular; uses Baileys与requires QR pairing.
Telegram
— Bot API via grammY; supports groups.
Discord
— Discord Bot API + 网关; supports servers, 频道,与DMs.
IRC
— Classic IRC servers; 频道 + DMs使用pairing/allowlist controls.
Slack
— Bolt SDK; 工作空间 apps.
Feishu
— Feishu/Lark bot via WebSocket (plugin, installed separately).
Google Chat
— Google Chat API app via HTTP webhook.
Mattermost
— Bot API + WebSocket; 频道, groups, DMs (plugin, installed separately).
Signal
— signal-命令行界面; privacy-focused.
BlueBubbles
—
Recommended为iMessage
; uses the BlueBubbles macOS server REST API使用full feature support (edit, unsend, effects, reactions, group 管理 — edit currently broken在macOS 26 Tahoe).
iMessage (legacy)
— Legacy macOS 集成 via imsg 命令行界面 (deprecated, use BlueBubbles为new setups).
Microsoft Teams
— Bot Framework; enterprise support (plugin, installed separately).
LINE
— LINE Messaging API bot (plugin, installed separately).
Nextcloud Talk
— Self-hosted chat via Nextcloud Talk (plugin, installed separately).
Matrix
— Matrix protocol (plugin, installed separately).
Nostr
— Decentralized DMs via NIP-04 (plugin, installed separately).
Tlon
— Urbit-based messenger (plugin, installed separately).
Twitch
— Twitch chat via IRC connection (plugin, installed separately).
Zalo
— Zalo Bot API; Vietnam’s popular messenger (plugin, installed separately).
Zalo Personal
— Zalo personal account via QR 登录 (plugin, installed separately).
WebChat
— 网关 WebChat UI over WebSocket.
​
Notes
频道 can run simultaneously; 配置 multiple与OpenClaw will route per chat.
Fastest 设置 is usually
Telegram
(simple bot token). WhatsApp requires QR pairing and
stores more state在disk.
Group behavior varies通过channel; see
Groups
.
DM pairing与allowlists are enforced为safety; see
Security
.
Telegram internals:
grammY notes
.
Troubleshooting:
频道 troubleshooting
.
模型 提供者 are documented separately; see
模型 提供者
.
WhatsApp
I
[查看英文原版](https://docs.OpenClaw.ai/频道)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*