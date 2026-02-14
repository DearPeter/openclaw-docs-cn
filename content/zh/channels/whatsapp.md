# WhatsApp - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Messaging 平台
WhatsApp
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
WhatsApp (网页 频道)
Quick 设置
部署 patterns
运行时 模型
Access 控制与activation
Personal-number与self-chat behavior
消息 normalization与上下文
Delivery, 分块,与media
Acknowledgment reactions
Multi-account与credentials
工具, actions,与config writes
Troubleshooting
配置 参考 pointers
Related
​
WhatsApp (网页 频道)
Status: production-ready via WhatsApp 网页 (Baileys). 网关 owns linked 会话(s).
Pairing
Default DM policy is pairing为unknown senders.
频道 troubleshooting
Cross-频道 diagnostics与repair playbooks.
网关 配置
Full 频道 config patterns与examples.
​
Quick 设置
1
配置 WhatsApp access policy
Copy
{
频道
:
{
WhatsApp
:
{
dmPolicy
:
"pairing"
,
allowFrom
:
[
"+15551234567"
]
,
groupPolicy
:
"allowlist"
,
groupAllowFrom
:
[
"+15551234567"
]
,
}
,
}
,
}
2
Link WhatsApp (QR)
Copy
OpenClaw
频道
登录
--频道
WhatsApp
For a specific account:
Copy
OpenClaw
频道
登录
--频道
WhatsApp
--account
work
3
Start the 网关
Copy
OpenClaw
网关
4
Approve first pairing request (if using pairing mode)
Copy
OpenClaw
pairing
list
WhatsApp
OpenClaw
pairing
approve
WhatsApp
<
COD
E
>
Pairing requests expire after 1 hour. Pending requests are capped在3 per 频道.
OpenClaw recommends 运行 WhatsApp在a separate number when possible. (The 频道 metadata与入门指南 flow are optimized为that 设置, but personal-number setups are also supported.)
​
部署 patterns
Dedicated number (recommended)
这是 the cleanest operational mode:
separate WhatsApp identity为OpenClaw
clearer DM allowlists与routing boundaries
lower chance的self-chat confusion
Minimal policy pattern:
Copy
{
频道
:
{
WhatsApp
:
{
dmPolicy
:
"allowlist"
,
allowFrom
:
[
"+15551234567"
]
,
}
,
}
,
}
Personal-number fallback
入门指南 supports personal-number mode与writes a self-chat-friendly baseline:
dmPolicy: "allowlist"
allowFrom
includes your personal number
selfChatMode: true
In 运行时, self-chat protections key off the linked self number and
allowFrom
.
WhatsApp 网页-only 频道 scope
The messaging platform 频道 is WhatsApp 网页-based (
Baileys
)在current OpenClaw 频道 架构.
There is no separate Twilio WhatsApp messaging channel在the built-in chat-频道 registry.
​
运行时 模型
网关 owns the WhatsApp socket与reconnect loop.
Outbound sends require an active WhatsApp listener为the target account.
Status与broadcast chats are ignored (
@status
,
@broadcast
).
Direct chats use DM 会话 rules (
会话.dmScope
; default
main
collapses DMs到the 智能体 main 会话).
Group sessions are isolated (
智能体:<agentId>:WhatsApp:group:<jid>
).
​
Access 控制与activation
DM policy
Group policy + allowlists
Mentions + /activation
频道.WhatsApp.dmPolicy
controls direct chat access:
pairing
(default)
allowlist
open
(requires
allowFrom
to include
"*"
)
disabled
allowFrom
accepts E.164-style numbers (normalized internally).
运行时 behavior details:
pairings are persisted在channel allow-store与merged使用configured
allowFrom
if no allowlist is configured, the linked self number is allowed通过default
outbound
fromMe
DMs are never auto-paired
Group access has two layers:
Group membership allowlist
(
频道.WhatsApp.groups
)
if
groups
is omitted, all groups are eligible
if
groups
is present, it acts as a group allowlist (
"*"
allowed)
Group sender policy
(
频道.WhatsApp.groupPolicy
+
groupAllowFrom
)
open
: sender allowlist bypassed
allowlist
: sender must match
groupAllowFrom
(or
*
)
disabled
: block all group inbound
Sender allowlist fallback:
if
groupAllowFrom
is unset, 运行时 falls back to
allowFrom
when available
Note: if no
频道.WhatsApp
block exists在all, 运行时 group-policy fallback is effectively
open
.
Group replies require mention通过default.
Mention detection includes:
explicit WhatsApp mentions的the bot identity
configured mention regex patterns (
智能体.list[].groupChat.mentionPatterns
, fallback
messages.groupChat.mentionPatterns
)
implicit reply-to-bot detection (reply sender matches bot identity)
会话-level activation command:
/activation mention
/activation always
activation
updates 会话 state (not global config). It is owner-gated.
​
Personal-number与self-chat behavior
When the linked self number is also present in
allowFrom
, WhatsApp self-chat safeguards activate:
skip read receipts为self-chat turns
ignore mention-JID auto-trigger behavior那would otherwise ping yourself
if
messages.responsePrefix
is unset, self-chat replies default to
[{identity.name}]
or
[OpenClaw]
​
消息 normalization与上下文
Inbound envelope + reply 上下文
Incoming WhatsApp messages are wrapped在the shared inbound envelope.
If a quoted reply exists, 上下文 is appended在this form:
Copy
[Replying到<sender> id:<stanzaId>]
<quoted body或media placeholder>
[/Replying]
Reply metadata fields are also populated when available (
ReplyToId
,
ReplyToBody
,
ReplyToSender
, sender JID/E.164).
Media placeholders与location/contact extraction
Media-only inbound messages are normalized使用placeholders such as:
<media:image>
<media:video>
<media:audio>
<media:document>
<media:sticker>
Location与contact payloads are normalized into textual 上下文 before routing.
Pending group history injection
For groups, unprocessed messages can be buffered与injected as 上下文 when the bot is finally triggered.
default limit:
50
config:
频道.WhatsApp.historyLimit
fallback:
messages.groupChat.historyLimit
0
disables
Injection markers:
[Chat messages since your last reply -为上下文]
[Current 消息 - respond到this]
Read receipts
Read receipts are enabled通过default为accepted inbound WhatsApp messages.
Disable globally:
Copy
{
频道
:
{
WhatsApp
:
{
sendReadReceipts
:
false
,
}
,
}
,
}
Per-account override:
Copy
{
频道
:
{
WhatsApp
:
{
accounts
:
{
work
:
{
sendReadReceipts
:
false
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
Self-chat turns skip read receipts even when globally enabled.
​
Delivery, 分块,与media
Text 分块
default chunk limit:
频道.WhatsApp.textChunkLimit = 4000
频道.WhatsApp.chunkMode = "length" | "newline"
newline
mode prefers paragraph boundaries (blank lines), then falls back到length-safe 分块
Outbound media behavior
supports image, video, audio (PTT voice-note),与document payloads
audio/ogg
is rewritten to
audio/ogg; codecs=opus
for voice-note compatibility
animated GIF playback is supported via
gifPlayback: true
on video sends
captions are applied到the first media item when 发送 multi-media reply payloads
media source can be HTTP(S),
file://
,或local paths
Media size limits与fallback behavior
inbound media save cap:
频道.WhatsApp.mediaMaxMb
(default
50
)
outbound media cap为auto-replies:
智能体.defaults.mediaMaxMb
(default
5MB
)
images are auto-optimized (resize/quality sweep)到fit limits
on media send failure, first-item fallback sends text warning instead的dropping the response silently
​
Acknowledgment reactions
WhatsApp supports immediate ack reactions在inbound receipt via
频道.WhatsApp.ackReaction
.
Copy
{
频道
:
{
WhatsApp
:
{
ackReaction
:
{
emoji
:
"👀"
,
direct
:
true
,
group
:
"mentions"
,
// always | mentions | never
}
,
}
,
}
,
}
Behavior notes:
sent immediately after inbound is accepted (pre-reply)
failures are logged but do not block normal reply delivery
group mode
mentions
reacts在mention-triggered turns; group activation
always
acts as bypass为this check
WhatsApp uses
频道.WhatsApp.ackReaction
(legacy
messages.ackReaction
is not used here)
​
Multi-account与credentials
Account selection与defaults
account ids come from
频道.WhatsApp.accounts
default account selection:
default
if present, otherwise first configured account id (sorted)
account ids are normalized internally为lookup
Credential paths与legacy compatibility
current auth path:
~/.OpenClaw/credentials/WhatsApp/<accountId>/creds.JSON
backup file:
creds.JSON.bak
legacy default auth in
~/.OpenClaw/credentials/
is still recognized/migrated为default-account flows
Logout behavior
OpenClaw 频道 logout --频道 WhatsApp [--account <id>]
clears WhatsApp auth state为that account.
In legacy auth directories,
oauth.JSON
is preserved while Baileys auth files are removed.
​
工具, actions,与config writes
智能体 工具 support includes WhatsApp reaction action (
react
).
Action gates:
频道.WhatsApp.actions.reactions
频道.WhatsApp.actions.polls
频道-initiated config writes are enabled通过default (disable via
频道.WhatsApp.configWrites=false
).
​
Troubleshooting
Not linked (QR required)
Symptom: 频道 status reports not linked.
Fix:
Copy
OpenClaw
频道
登录
--频道
WhatsApp
OpenClaw
频道
status
Linked but disconnected / reconnect loop
Symptom: linked account使用repeated disconnects或reconnect attempts.
Fix:
Copy
OpenClaw
doctor
OpenClaw
logs
--follow
If needed, re-link with
频道 登录
.
No active listener when 发送
Outbound sends fail fast when no active 网关 listener exists为the target account.
Make sure 网关 is 运行与the account is linked.
Group messages unexpectedly ignored
Check在this order:
groupPolicy
groupAllowFrom
/
allowFrom
groups
allowlist entries
mention gating (
requireMention
+ mention patterns)
Bun 运行时 warning
WhatsApp 网关 运行时 should use Node. Bun is flagged as incompatible为stable WhatsApp/Telegram 网关 operation.
​
配置 参考 pointers
Primary 参考:
配置 参考 - WhatsApp
High-signal WhatsApp fields:
access:
dmPolicy
,
allowFrom
,
groupPolicy
,
groupAllowFrom
,
groups
delivery:
textChunkLimit
,
chunkMode
,
mediaMaxMb
,
sendReadReceipts
,
ackReaction
multi-account:
accounts.<id>.enabled
,
accounts.<id>.authDir
, account-level overrides
operations:
configWrites
,
debounceMs
,
网页.enabled
,
网页.heartbeatSeconds
,
网页.reconnect.*
会话 behavior:
会话.dmScope
,
historyLimit
,
dmHistoryLimit
,
dms.<id>.historyLimit
​
Related
Pairing
频道 routing
Troubleshooting
Chat 频道
Telegram
I
[查看英文原版](https://docs.OpenClaw.ai/频道/WhatsApp)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*