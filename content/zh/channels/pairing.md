# Pairing - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
配置
Pairing
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
Pairing
1) DM pairing (inbound chat access)
Approve a sender
Where the state lives
2) Node device pairing (iOS/Android/macOS/headless 节点)
Pair via Telegram (recommended为iOS)
Approve a node device
Node pairing state storage
Notes
Related docs
​
Pairing
“Pairing” is OpenClaw’s explicit
owner approval
step.
It is used在two places:
DM pairing
(who is allowed到talk到the bot)
Node pairing
(which devices/节点 are allowed到join the 网关 network)
Security 上下文:
Security
​
1) DM pairing (inbound chat access)
When a 频道 is configured使用DM policy
pairing
, unknown senders get a short code与their 消息 is
not processed
until you approve.
Default DM policies are documented in:
Security
Pairing codes:
8 characters, uppercase, no ambiguous chars (
0O1I
).
Expire after 1 hour
. The bot only sends the pairing 消息 when a new request is created (roughly once per hour per sender).
Pending DM pairing requests are capped at
3 per 频道
by default; additional requests are ignored until one expires或is approved.
​
Approve a sender
Copy
OpenClaw
pairing
list
Telegram
OpenClaw
pairing
approve
Telegram
<
COD
E
>
Supported 频道:
Telegram
,
WhatsApp
,
signal
,
imessage
,
Discord
,
Slack
,
feishu
.
​
Where the state lives
Stored under
~/.OpenClaw/credentials/
:
Pending requests:
<频道>-pairing.JSON
Approved allowlist store:
<频道>-allowFrom.JSON
Treat这些as sensitive (they gate access到your assistant).
​
2) Node device pairing (iOS/Android/macOS/headless 节点)
节点 connect到the 网关 as
devices
with
role: node
. The 网关
creates a device pairing request那must be approved.
​
Pair via Telegram (recommended为iOS)
If you use the
device-pair
plugin, you can do first-time device pairing entirely从Telegram:
In Telegram, 消息 your bot:
/pair
The bot replies使用two messages: an instruction 消息与a separate
设置 code
消息 (easy到copy/paste在Telegram).
On your phone, open the OpenClaw iOS app → Settings → 网关.
Paste the 设置 code与connect.
Back在Telegram:
/pair approve
The 设置 code is a base64-encoded JSON payload那contains:
url
: the 网关 WebSocket URL (
ws://...
or
wss://...
)
token
: a short-lived pairing token
Treat the 设置 code like a password while it is valid.
​
Approve a node device
Copy
OpenClaw
devices
list
OpenClaw
devices
approve
<
requestI
d
>
OpenClaw
devices
reject
<
requestI
d
>
​
Node pairing state storage
Stored under
~/.OpenClaw/devices/
:
pending.JSON
(short-lived; pending requests expire)
paired.JSON
(paired devices + tokens)
​
Notes
The legacy
node.pair.*
API (命令行界面:
OpenClaw 节点 pending/approve
) is a
separate 网关-owned pairing store. WS 节点 still require device pairing.
​
Related docs
Security 模型 + 提示词 injection:
Security
Updating safely (run doctor):
Updating
频道 configs:
Telegram:
Telegram
WhatsApp:
WhatsApp
Signal:
Signal
BlueBubbles (iMessage):
BlueBubbles
iMessage (legacy):
iMessage
Discord:
Discord
Slack:
Slack
Zalo Personal
Group 消息
I
[查看英文原版](https://docs.OpenClaw.ai/频道/pairing)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*