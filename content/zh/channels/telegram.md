# Telegram - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Messaging 平台
Telegram
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
Telegram (Bot API)
Quick 设置
Telegram side settings
Access 控制与activation
运行时 behavior
Feature 参考
Troubleshooting
Telegram config 参考 pointers
Related
​
Telegram (Bot API)
Status: production-ready为bot DMs + groups via grammY. Long polling is the default mode; Webhook mode is optional.
Pairing
Default DM policy为Telegram is pairing.
频道 troubleshooting
Cross-频道 diagnostics与repair playbooks.
网关 配置
Full 频道 config patterns与examples.
​
Quick 设置
1
Create the bot 令牌在BotFather
Open Telegram与chat with
@BotFather
(confirm the handle is exactly
@BotFather
).
Run
/newbot
, follow prompts,与save the 令牌.
2
配置 令牌与DM policy
Copy
{
频道
:
{
Telegram
:
{
enabled
:
true
,
botToken
:
"123:abc"
,
dmPolicy
:
"pairing"
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
}
Env fallback:
TELEGRAM_BOT_令牌=...
(default account only).
3
Start 网关与approve first DM
Copy
OpenClaw
网关
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
Pairing codes expire after 1 hour.
4
Add the bot到a group
Add the bot到your group, then set
频道.Telegram.groups
and
groupPolicy
to match your access 模型.
令牌 resolution order is account-aware. In practice, config values win over env fallback, and
TELEGRAM_BOT_令牌
only applies到the default account.
​
Telegram side settings
Privacy mode与group visibility
Telegram bots default to
Privacy Mode
, which limits what group messages they receive.
If the bot must see all group messages, either:
disable privacy mode via
/setprivacy
, or
make the bot a group admin.
When toggling privacy mode, remove + re-add the bot在each group so Telegram applies the change.
Group permissions
Admin status is controlled在Telegram group settings.
Admin bots receive all group messages, which is useful为always-on group behavior.
帮助ful BotFather toggles
/setjoingroups
to allow/deny group adds
/setprivacy
for group visibility behavior
​
Access 控制与activation
DM policy
Group policy与allowlists
Mention behavior
频道.Telegram.dmPolicy
controls direct 消息 access:
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
频道.Telegram.allowFrom
accepts numeric IDs与usernames.
Telegram:
/
tg:
prefixes are accepted与normalized.
​
Finding your Telegram user ID
Safer (no third-party bot):
DM your bot.
Run
OpenClaw logs --follow
.
Read
from.id
.
Official Bot API method:
Copy
curl
"https://api.Telegram.org/bot<bot_token>/getUpdates"
Third-party method (less private):
@userinfobot
or
@getidsbot
.
There are two independent controls:
Which groups are allowed
(
频道.Telegram.groups
)
no
groups
config: all groups allowed
groups
configured: acts as allowlist (explicit IDs or
"*"
)
Which senders are allowed在groups
(
频道.Telegram.groupPolicy
)
open
allowlist
(default)
disabled
groupAllowFrom
is used为group sender filtering. If not set, Telegram falls back to
allowFrom
.
示例： allow any member在one specific group:
Copy
{
频道
:
{
Telegram
:
{
groups
:
{
"-1001234567890"
:
{
groupPolicy
:
"open"
,
requireMention
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
Group replies require mention通过default.
Mention can come from:
native
@botusername
mention, or
mention patterns in:
智能体.list[].groupChat.mentionPatterns
messages.groupChat.mentionPatterns
会话-level command toggles:
/activation always
/activation mention
These update 会话 state only. Use config为persistence.
Persistent config example:
Copy
{
频道
:
{
Telegram
:
{
groups
:
{
"*"
:
{
requireMention
:
false
}
,
}
,
}
,
}
,
}
Getting the group chat ID:
forward a group 消息 to
@userinfobot
/
@getidsbot
or read
chat.id
from
OpenClaw logs --follow
or inspect Bot API
getUpdates
​
运行时 behavior
Telegram is owned通过the 网关 进程.
Routing is deterministic: Telegram inbound replies back到Telegram (the 模型 does not pick 频道).
Inbound messages normalize into the shared 频道 envelope使用reply metadata与media placeholders.
Group sessions are isolated通过group ID. Forum topics append
:topic:<threadId>
to keep topics isolated.
DM messages can carry
消息_线程_id
; OpenClaw routes them使用线程-aware 会话 keys与preserves 线程 ID为replies.
Long polling uses grammY runner使用per-chat/per-thread sequencing. Overall runner sink concurrency uses
智能体.defaults.maxConcurrent
.
Telegram Bot API has no read-receipt support (
sendReadReceipts
does not apply).
​
Feature 参考
Draft 流式传输在Telegram DMs
OpenClaw can 流 partial replies使用Telegram draft bubbles (
sendMessageDraft
).
Requirements:
频道.Telegram.streamMode
is not
"off"
(default:
"partial"
)
private chat
inbound update includes
消息_线程_id
bot topics are enabled (
getMe().has_topics_enabled
)
Modes:
off
: no draft 流式传输
partial
: frequent draft updates从partial text
block
: chunked draft updates using
频道.Telegram.draftChunk
draftChunk
defaults为block mode:
minChars: 200
maxChars: 800
breakPreference: "paragraph"
maxChars
is clamped by
频道.Telegram.textChunkLimit
.
Draft 流式传输 is DM-only; groups/频道 do not use draft bubbles.
If you want early real Telegram messages instead的draft updates, use block 流式传输 (
频道.Telegram.blockStreaming: true
).
Telegram-only reasoning 流:
/reasoning stream
sends reasoning到the draft bubble while generating
final answer is sent without reasoning text
Formatting与HTML fallback
Outbound text uses Telegram
parse_mode: "HTML"
.
Markdown-ish text is rendered到Telegram-safe HTML.
Raw 模型 HTML is escaped到reduce Telegram parse failures.
If Telegram rejects parsed HTML, OpenClaw retries as plain text.
Link previews are enabled通过default与can be disabled with
频道.Telegram.linkPreview: false
.
Native commands与custom commands
Telegram command menu registration is handled在startup with
setMyCommands
.
Native command defaults:
commands.native: "auto"
enables native commands为Telegram
Add custom command menu entries:
Copy
{
频道
:
{
Telegram
:
{
customCommands
:
[
{
command
:
"备份"
,
description
:
"Git 备份"
}
,
{
command
:
"generate"
,
description
:
"Create an image"
}
,
]
,
}
,
}
,
}
Rules:
names are normalized (strip leading
/
, lowercase)
valid pattern:
a-z
,
0-9
,
_
, length
1..32
custom commands cannot override native commands
conflicts/duplicates are skipped与logged
Notes:
custom commands are menu entries only; they do not auto-implement behavior
plugin/skill commands can still work when typed even if not shown在Telegram menu
If native commands are disabled, built-ins are removed. Custom/plugin commands may still register if configured.
Common 设置 failure:
setMyCommands failed
usually means outbound DNS/HTTPS to
API.Telegram.org
is blocked.
​
Device pairing commands (
device-pair
plugin)
When the
device-pair
plugin is installed:
/pair
generates 设置 code
paste code在iOS app
/pair approve
approves latest pending request
More details:
Pairing
.
Inline buttons
配置 inline keyboard scope:
Copy
{
频道
:
{
Telegram
:
{
capabilities
:
{
inlineButtons
:
"allowlist"
,
}
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
Telegram
:
{
accounts
:
{
main
:
{
capabilities
:
{
inlineButtons
:
"allowlist"
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
,
}
Scopes:
off
dm
group
all
allowlist
(default)
Legacy
capabilities: ["inlineButtons"]
maps to
inlineButtons: "all"
.
消息 action example:
Copy
{
action
:
"send"
,
频道
:
"Telegram"
,
to
:
"123456789"
,
消息
:
"Choose an option:"
,
buttons
:
[
[
{
text
:
"Yes"
,
回调函数_data
:
"yes"
}
,
{
text
:
"No"
,
回调函数_data
:
"no"
}
,
]
,
[{
text
:
"Cancel"
,
回调函数_data
:
"cancel"
}]
,
]
,
}
回调函数 clicks are passed到the 智能体 as text:
回调函数_data: <value>
Telegram 消息 actions为代理与automation
Telegram 工具 actions include:
sendMessage
(
to
,
content
, optional
mediaUrl
,
replyToMessageId
,
messageThreadId
)
react
(
chatId
,
messageId
,
emoji
)
deleteMessage
(
chatId
,
messageId
)
editMessage
(
chatId
,
messageId
,
content
)
频道 消息 actions expose ergonomic aliases (
send
,
react
,
delete
,
edit
,
sticker
,
sticker-搜索
).
Gating controls:
频道.Telegram.actions.sendMessage
频道.Telegram.actions.editMessage
频道.Telegram.actions.deleteMessage
频道.Telegram.actions.reactions
频道.Telegram.actions.sticker
(default: disabled)
Reaction removal semantics:
/工具/reactions
Reply threading tags
Telegram supports explicit reply threading tags在generated output:
[[reply_to_current]]
replies到the triggering 消息
[[reply_to:<id>]]
replies到a specific Telegram 消息 ID
频道.Telegram.replyToMode
controls handling:
first
(default)
all
off
Forum topics与线程 behavior
Forum supergroups:
topic 会话 keys append
:topic:<threadId>
replies与typing target the topic 线程
topic config path:
频道.Telegram.groups.<chatId>.topics.<threadId>
General topic (
threadId=1
) special-case:
消息 sends omit
消息_线程_id
(Telegram rejects
sendMessage(...线程_id=1)
)
typing actions still include
消息_线程_id
Topic inheritance: topic entries inherit group settings unless overridden (
requireMention
,
allowFrom
,
技能
,
systemPrompt
,
enabled
,
groupPolicy
).
Template 上下文 includes:
MessageThreadId
IsForum
DM 线程 behavior:
private chats with
消息_线程_id
keep DM routing but use thread-aware 会话 keys/reply targets.
Audio, video,与stickers
​
Audio messages
Telegram distinguishes voice notes vs audio files.
default: audio file behavior
tag
[[audio_as_voice]]
in 智能体 reply到force voice-note send
消息 action example:
Copy
{
action
:
"send"
,
频道
:
"Telegram"
,
to
:
"123456789"
,
media
:
"https://example.com/voice.ogg"
,
asVoice
:
true
,
}
​
Video messages
Telegram distinguishes video files vs video notes.
消息 action example:
Copy
{
action
:
"send"
,
频道
:
"Telegram"
,
to
:
"123456789"
,
media
:
"https://example.com/video.mp4"
,
asVideoNote
:
true
,
}
Video notes do not support captions; provided 消息 text is sent separately.
​
Stickers
Inbound sticker handling:
static WEBP: downloaded与processed (placeholder
<media:sticker>
)
animated TGS: skipped
video WEBM: skipped
Sticker 上下文 fields:
Sticker.emoji
Sticker.setName
Sticker.fileId
Sticker.fileUniqueId
Sticker.cachedDescription
Sticker 缓存 file:
~/.OpenClaw/Telegram/sticker-cache.JSON
Stickers are described once (when possible)与cached到reduce repeated vision calls.
Enable sticker actions:
Copy
{
频道
:
{
Telegram
:
{
actions
:
{
sticker
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
Send sticker action:
Copy
{
action
:
"sticker"
,
频道
:
"Telegram"
,
to
:
"123456789"
,
fileId
:
"CAACAgIAAxkBAAI..."
,
}
Copy
{
action
:
"sticker-搜索"
,
频道
:
"Telegram"
,
query
:
"cat waving"
,
limit
:
5
,
}
Reaction notifications
Telegram reactions arrive as
消息_reaction
updates (separate从消息 payloads).
When enabled, OpenClaw enqueues system events like:
Telegram reaction added: 👍通过Alice (@alice)在msg 42
Config:
频道.Telegram.reactionNotifications
:
off | own | all
(default:
own
)
频道.Telegram.reactionLevel
:
off | ack | minimal | extensive
(default:
minimal
)
Notes:
own
means user reactions到bot-sent messages only (best-effort via sent-消息 缓存).
Telegram does not provide 线程 IDs在reaction updates.
non-forum groups route到group chat 会话
forum groups route到the group general-topic 会话 (
:topic:1
), not the exact originating topic
allowed_updates
for polling/webhook include
消息_reaction
automatically.
Config writes从Telegram events与commands
频道 config writes are enabled通过default (
configWrites !== false
).
Telegram-triggered writes include:
group 迁移 events (
migrate_to_chat_id
)到update
频道.Telegram.groups
/config set
and
/config unset
(requires command enablement)
Disable:
Copy
{
频道
:
{
Telegram
:
{
configWrites
:
false
,
}
,
}
,
}
Long polling vs Webhook
Default: long polling.
Webhook mode:
set
频道.Telegram.webhookUrl
set
频道.Telegram.webhookSecret
(required when Webhook URL is set)
optional
频道.Telegram.webhookPath
(default
/Telegram-webhook
)
optional
频道.Telegram.webhookHost
(default
127.0.0.1
)
Default local listener为Webhook mode binds to
127.0.0.1:8787
.
If your public 端点 differs, place a reverse 代理服务器在front与point
webhookUrl
at the public URL.
Set
webhookHost
(for example
0.0.0.0
) when you intentionally need external ingress.
Limits, 重试,与命令行界面 targets
频道.Telegram.textChunkLimit
default is 4000.
频道.Telegram.chunkMode="newline"
prefers paragraph boundaries (blank lines) before length splitting.
频道.Telegram.mediaMaxMb
(default 5) caps inbound Telegram media download/processing size.
频道.Telegram.timeoutSeconds
overrides Telegram API client timeout (if unset, grammY default applies).
group 上下文 history uses
频道.Telegram.historyLimit
or
messages.groupChat.historyLimit
(default 50);
0
disables.
DM history controls:
频道.Telegram.dmHistoryLimit
频道.Telegram.dms["<user_id>"].historyLimit
outbound Telegram API retries are configurable via
频道.Telegram.重试
.
命令行界面 send target can be numeric chat ID或username:
Copy
OpenClaw
消息
send
--频道
Telegram
--target
123456789
--消息
"hi"
OpenClaw
消息
send
--频道
Telegram
--target
@name
--消息
"hi"
​
Troubleshooting
Bot does not respond到non mention group messages
If
requireMention=false
, Telegram privacy mode must allow full visibility.
BotFather:
/setprivacy
-> Disable
then remove + re-add bot到group
OpenClaw 频道 status
warns when config expects unmentioned group messages.
OpenClaw 频道 status --probe
can check explicit numeric group IDs; wildcard
"*"
cannot be membership-probed.
quick 会话 测试:
/activation always
.
Bot not seeing group messages在all
when
频道.Telegram.groups
exists, group must be listed (or include
"*"
)
verify bot membership在group
review logs:
OpenClaw logs --follow
for skip reasons
Commands work partially或not在all
authorize your sender identity (pairing and/or
allowFrom
)
command 授权 still applies even when group policy is
open
setMyCommands failed
usually indicates DNS/HTTPS reachability issues to
API.Telegram.org
Polling或network instability
Node 22+ + custom 获取/proxy can trigger immediate abort behavior if AbortSignal types mismatch.
Some hosts resolve
API.Telegram.org
to IPv6 first; broken IPv6 egress can cause intermittent Telegram API failures.
Validate DNS answers:
Copy
dig
+short
API.Telegram.org
A
dig
+short
API.Telegram.org
AAAA
More 帮助:
频道 troubleshooting
.
​
Telegram config 参考 pointers
Primary 参考:
频道.Telegram.enabled
: enable/disable 频道 startup.
频道.Telegram.botToken
: bot 令牌 (BotFather).
频道.Telegram.tokenFile
: read 令牌从file path.
频道.Telegram.dmPolicy
:
pairing | allowlist | open | disabled
(default: pairing).
频道.Telegram.allowFrom
: DM allowlist (ids/usernames).
open
requires
"*"
.
频道.Telegram.groupPolicy
:
open | allowlist | disabled
(default: allowlist).
频道.Telegram.groupAllowFrom
: group sender allowlist (ids/usernames).
频道.Telegram.groups
: per-group defaults + allowlist (use
"*"
for global defaults).
频道.Telegram.groups.<id>.groupPolicy
: per-group override为groupPolicy (
open | allowlist | disabled
).
频道.Telegram.groups.<id>.requireMention
: mention gating default.
频道.Telegram.groups.<id>.技能
: skill filter (omit = all 技能, empty = none).
频道.Telegram.groups.<id>.allowFrom
: per-group sender allowlist override.
频道.Telegram.groups.<id>.systemPrompt
: extra 系统提示为the group.
频道.Telegram.groups.<id>.enabled
: disable the group when
false
.
频道.Telegram.groups.<id>.topics.<threadId>.*
: per-topic overrides (same fields as group).
频道.Telegram.groups.<id>.topics.<threadId>.groupPolicy
: per-topic override为groupPolicy (
open | allowlist | disabled
).
频道.Telegram.groups.<id>.topics.<threadId>.requireMention
: per-topic mention gating override.
频道.Telegram.capabilities.inlineButtons
:
off | dm | group | all | allowlist
(default: allowlist).
频道.Telegram.accounts.<account>.capabilities.inlineButtons
: per-account override.
频道.Telegram.replyToMode
:
off | first | all
(default:
first
).
频道.Telegram.textChunkLimit
: outbound chunk size (chars).
频道.Telegram.chunkMode
:
length
(default) or
newline
to split在blank lines (paragraph boundaries) before length 分块.
频道.Telegram.linkPreview
: toggle link previews为outbound messages (default: true).
频道.Telegram.streamMode
:
off | partial | block
(draft 流式传输).
频道.Telegram.mediaMaxMb
: inbound/outbound media cap (MB).
频道.Telegram.重试
: 重试 policy为outbound Telegram API calls (attempts, minDelayMs, maxDelayMs, jitter).
频道.Telegram.network.autoSelectFamily
: override 节点 autoSelectFamily (true=enable, false=disable). Defaults到disabled在节点 22到avoid Happy Eyeballs timeouts.
频道.Telegram.代理服务器
: proxy URL为Bot API calls (SOCKS/HTTP).
频道.Telegram.webhookUrl
: enable Webhook mode (requires
频道.Telegram.webhookSecret
).
频道.Telegram.webhookSecret
: Webhook secret (required when webhookUrl is set).
频道.Telegram.webhookPath
: local Webhook path (default
/Telegram-webhook
).
频道.Telegram.webhookHost
: local Webhook bind host (default
127.0.0.1
).
频道.Telegram.actions.reactions
: gate Telegram 工具 reactions.
频道.Telegram.actions.sendMessage
: gate Telegram 工具 消息 sends.
频道.Telegram.actions.deleteMessage
: gate Telegram 工具 消息 deletes.
频道.Telegram.actions.sticker
: gate Telegram sticker actions — send与搜索 (default: false).
频道.Telegram.reactionNotifications
:
off | own | all
— 控制 which reactions trigger system events (default:
own
when not set).
频道.Telegram.reactionLevel
:
off | ack | minimal | extensive
— 控制 智能体’s reaction capability (default:
minimal
when not set).
配置 参考 - Telegram
Telegram-specific high-signal fields:
startup/auth:
enabled
,
botToken
,
tokenFile
,
accounts.*
access 控制:
dmPolicy
,
allowFrom
,
groupPolicy
,
groupAllowFrom
,
groups
,
groups.*.topics.*
command/menu:
commands.native
,
customCommands
threading/replies:
replyToMode
流式传输:
streamMode
,
draftChunk
,
blockStreaming
formatting/delivery:
textChunkLimit
,
chunkMode
,
linkPreview
,
responsePrefix
media/network:
mediaMaxMb
,
timeoutSeconds
,
重试
,
network.autoSelectFamily
,
代理服务器
Webhook:
webhookUrl
,
webhookSecret
,
webhookPath
,
webhookHost
actions/capabilities:
capabilities.inlineButtons
,
actions.sendMessage|editMessage|deleteMessage|reactions|sticker
reactions:
reactionNotifications
,
reactionLevel
writes/history:
configWrites
,
historyLimit
,
dmHistoryLimit
,
dms.*.historyLimit
​
Related
Pairing
频道 routing
Troubleshooting
WhatsApp
Discord
I
[查看英文原版](https://docs.OpenClaw.ai/频道/Telegram)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*