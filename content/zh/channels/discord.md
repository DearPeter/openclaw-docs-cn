# Discord - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Messaging 平台
Discord
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
Discord (Bot API)
Quick 设置
运行时 模型
Access 控制与routing
Role-based 智能体 routing
Developer Portal 设置
Native commands与command auth
Feature details
工具与action gates
Voice messages
Troubleshooting
配置 参考 pointers
Safety与operations
Related
​
Discord (Bot API)
Status: ready为DMs与guild 频道 via the official Discord 网关.
Pairing
Discord DMs default到pairing mode.
Slash commands
Native command behavior与command catalog.
频道 troubleshooting
Cross-频道 diagnostics与repair flow.
​
Quick 设置
1
Create a Discord bot与enable intents
Create an 应用在the Discord Developer Portal, add a bot, then enable:
消息 Content Intent
Server Members Intent
(required为role allowlists与role-based routing; recommended为name-to-ID allowlist matching)
2
配置 token
Copy
{
频道
:
{
Discord
:
{
enabled
:
true
,
token
:
"YOUR_BOT_TOKEN"
,
}
,
}
,
}
Env fallback为the default account:
Copy
DISCORD_BOT_TOKEN
=
...
3
Invite the bot与start 网关
Invite the bot到your server使用消息 permissions.
Copy
OpenClaw
网关
4
Approve first DM pairing
Copy
OpenClaw
pairing
list
Discord
OpenClaw
pairing
approve
Discord
<
COD
E
>
Pairing codes expire after 1 hour.
Token resolution is account-aware. Config token values win over env fallback.
DISCORD_BOT_TOKEN
is only used为the default account.
​
运行时 模型
网关 owns the Discord connection.
Reply routing is deterministic: Discord inbound replies back到Discord.
By default (
会话.dmScope=main
), direct chats share the 智能体 main 会话 (
智能体:main:main
).
Guild 频道 are isolated 会话 keys (
智能体:<agentId>:Discord:频道:<channelId>
).
Group DMs are ignored通过default (
频道.Discord.dm.groupEnabled=false
).
Native slash commands run在isolated command sessions (
智能体:<agentId>:Discord:slash:<userId>
), while still carrying
CommandTarget会话Key
to the routed conversation 会话.
​
Access 控制与routing
DM policy
Guild policy
Mentions与group DMs
频道.Discord.dm.policy
controls DM access:
pairing
(default)
allowlist
open
(requires
频道.Discord.dm.allowFrom
to include
"*"
)
disabled
If DM policy is not open, unknown users are blocked (or prompted为pairing in
pairing
mode).
DM target format为delivery:
user:<id>
<@id>
mention
Bare numeric IDs are ambiguous与rejected unless an explicit user/频道 target kind is provided.
Guild handling is controlled by
频道.Discord.groupPolicy
:
open
allowlist
disabled
Secure baseline when
频道.Discord
exists is
allowlist
.
allowlist
behavior:
guild must match
频道.Discord.guilds
(
id
preferred, slug accepted)
optional sender allowlists:
users
(IDs或names) and
roles
(role IDs only); if either is configured, senders are allowed when they match
users
OR
roles
if a guild has
频道
configured, non-listed 频道 are denied
if a guild has no
频道
block, all 频道在that allowlisted guild are allowed
示例：
Copy
{
频道
:
{
Discord
:
{
groupPolicy
:
"allowlist"
,
guilds
:
{
"123456789012345678"
:
{
requireMention
:
true
,
users
:
[
"987654321098765432"
]
,
roles
:
[
"123456789012345678"
]
,
频道
:
{
general
:
{
allow
:
true
}
,
帮助
:
{
allow
:
true
,
requireMention
:
true
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
,
}
If you only set
DISCORD_BOT_TOKEN
and do not create a
频道.Discord
block, 运行时 fallback is
groupPolicy="open"
(with a warning在logs).
Guild messages are mention-gated通过default.
Mention detection includes:
explicit bot mention
configured mention patterns (
智能体.list[].groupChat.mentionPatterns
, fallback
messages.groupChat.mentionPatterns
)
implicit reply-to-bot behavior在supported cases
requireMention
is configured per guild/频道 (
频道.Discord.guilds...
).
Group DMs:
default: ignored (
dm.groupEnabled=false
)
optional allowlist via
dm.group频道
(频道 IDs或slugs)
​
Role-based 智能体 routing
Use
bindings[].match.roles
to route Discord guild members到different Agent通过role ID. Role-based bindings accept role IDs only与are evaluated after peer或parent-peer bindings与before guild-only bindings. If a binding also sets other match fields (for example
peer
+
guildId
+
roles
), all configured fields must match.
Copy
{
bindings
:
[
{
agentId
:
"opus"
,
match
:
{
频道
:
"Discord"
,
guildId
:
"123456789012345678"
,
roles
:
[
"111111111111111111"
]
,
}
,
}
,
{
agentId
:
"sonnet"
,
match
:
{
频道
:
"Discord"
,
guildId
:
"123456789012345678"
,
}
,
}
,
]
,
}
​
Developer Portal 设置
Create app与bot
Discord Developer Portal ->
Applications
->
New 应用
Bot
->
Add Bot
Copy bot token
Privileged intents
In
Bot -> Privileged 网关 Intents
, enable:
消息 Content Intent
Server Members Intent (recommended)
在线状态 intent is optional与only required if you want到receive 在线状态 updates. Setting bot 在线状态 (
set在线状态
) does not require enabling 在线状态 updates为members.
OAuth scopes与baseline permissions
OAuth URL generator:
scopes:
bot
,
applications.commands
Typical baseline permissions:
View 频道
Send 消息
Read 消息 History
Embed Links
Attach Files
Add Reactions (optional)
Avoid
Administrator
unless explicitly needed.
Copy IDs
Enable Discord Developer Mode, then copy:
server ID
频道 ID
user ID
Prefer numeric IDs在OpenClaw config为reliable audits与probes.
​
Native commands与command auth
commands.native
defaults to
"auto"
and is enabled为Discord.
Per-频道 override:
频道.Discord.commands.native
.
commands.native=false
explicitly clears previously registered Discord native commands.
Native command auth uses the same Discord allowlists/policies as normal 消息 handling.
Commands may still be visible在Discord UI为users who are not authorized; execution still enforces OpenClaw auth与returns “not authorized”.
See
Slash commands
for command catalog与behavior.
​
Feature details
Reply tags与native replies
Discord supports reply tags在agent output:
[[reply_to_current]]
[[reply_to:<id>]]
Controlled by
频道.Discord.replyToMode
:
off
(default)
first
all
消息 IDs are surfaced在上下文/history so 智能体 can target specific messages.
History, 上下文,与thread behavior
Guild history 上下文:
频道.Discord.historyLimit
default
20
fallback:
messages.groupChat.historyLimit
0
disables
DM history controls:
频道.Discord.dmHistoryLimit
频道.Discord.dms["<user_id>"].historyLimit
Thread behavior:
Discord threads are routed as 频道 sessions
parent thread metadata can be used为parent-会话 linkage
thread config inherits parent 频道 config unless a thread-specific entry exists
频道 topics are injected as
untrusted
上下文 (not as system 提示词).
Reaction notifications
Per-guild reaction notification mode:
off
own
(default)
all
allowlist
(uses
guilds.<id>.users
)
Reaction events are turned into system events与attached到the routed Discord 会话.
Config writes
频道-initiated config writes are enabled通过default.
This affects
/config set|unset
flows (when command features are enabled).
Disable:
Copy
{
频道
:
{
Discord
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
网关 proxy
Route Discord 网关 WebSocket traffic through an HTTP(S) proxy with
频道.Discord.proxy
.
Copy
{
频道
:
{
Discord
:
{
proxy
:
"http://proxy.example:8080"
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
Discord
:
{
accounts
:
{
primary
:
{
proxy
:
"http://proxy.example:8080"
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
PluralKit support
Enable PluralKit resolution到map proxied messages到system member identity:
Copy
{
频道
:
{
Discord
:
{
pluralkit
:
{
enabled
:
true
,
token
:
"pk_live_..."
,
// optional; needed为private systems
}
,
}
,
}
,
}
Notes:
allowlists can use
pk:<memberId>
member display names are matched通过name/slug
lookups use original 消息 ID与are time-window constrained
if lookup fails, proxied messages are treated as bot messages与dropped unless
allowBots=true
在线状态 配置
在线状态 updates are applied only when you set a status或activity field.
Status only example:
Copy
{
频道
:
{
Discord
:
{
status
:
"idle"
,
}
,
}
,
}
Activity example (custom status is the default activity type):
Copy
{
频道
:
{
Discord
:
{
activity
:
"Focus time"
,
activityType
:
4
,
}
,
}
,
}
流式传输 example:
Copy
{
频道
:
{
Discord
:
{
activity
:
"Live coding"
,
activityType
:
1
,
activityUrl
:
"https://twitch.tv/OpenClaw"
,
}
,
}
,
}
Activity type map:
0: Playing
1: 流式传输 (requires
activityUrl
)
2: Listening
3: Watching
4: Custom (uses the activity text as the status state; emoji is optional)
5: Competing
执行 approvals在Discord
Discord supports button-based 执行 approvals在DMs.
Config path:
频道.Discord.execApprovals.enabled
频道.Discord.execApprovals.approvers
agentFilter
,
sessionFilter
,
cleanupAfterResolve
If approvals fail使用unknown approval IDs, verify approver list与feature enablement.
Related docs:
执行 approvals
​
工具与action gates
Discord 消息 actions include messaging, 频道 admin, moderation, 在线状态,与metadata actions.
Core examples:
messaging:
sendMessage
,
read消息
,
editMessage
,
deleteMessage
,
threadReply
reactions:
react
,
reactions
,
emojiList
moderation:
timeout
,
kick
,
ban
在线状态:
set在线状态
Action gates live under
频道.Discord.actions.*
.
Default gate behavior:
Action group
Default
reactions, messages, threads, pins, polls, 搜索, memberInfo, roleInfo, channelInfo, 频道, voiceStatus, events, stickers, emojiUploads, stickerUploads, permissions
enabled
roles
disabled
moderation
disabled
在线状态
disabled
​
Voice messages
Discord voice messages show a waveform preview与require OGG/Opus audio plus metadata. OpenClaw generates the waveform automatically, but it needs
ffmpeg
and
ffprobe
available在the 网关 host到inspect与convert audio files.
Requirements与constraints:
Provide a
local file path
(URLs are rejected).
Omit text content (Discord does not allow text + voice 消息在the same payload).
Any audio format is accepted; OpenClaw converts到OGG/Opus when needed.
示例：
Copy
消息(action
=
"send"
,
频道=
"Discord"
,
target=
"频道:123"
,
path=
"/path/to/audio.mp3"
,
asVoice=
true
)
​
Troubleshooting
Used disallowed intents或bot sees no guild messages
enable 消息 Content Intent
enable Server Members Intent when you depend在user/member resolution
restart 网关 after changing intents
Guild messages blocked unexpectedly
verify
groupPolicy
verify guild allowlist under
频道.Discord.guilds
if guild
频道
map exists, only listed 频道 are allowed
verify
requireMention
behavior与mention patterns
Useful checks:
Copy
OpenClaw
doctor
OpenClaw
频道
status
--probe
OpenClaw
logs
--follow
Require mention false but still blocked
Common causes:
groupPolicy="allowlist"
without matching guild/频道 allowlist
requireMention
configured在the wrong place (must be under
频道.Discord.guilds
or 频道 entry)
sender blocked通过guild/频道
users
allowlist
Permissions audit mismatches
频道 status --probe
permission checks only work为numeric 频道 IDs.
If you use slug keys, 运行时 matching can still work, but probe cannot fully verify permissions.
DM与pairing issues
DM disabled:
频道.Discord.dm.enabled=false
DM policy disabled:
频道.Discord.dm.policy="disabled"
awaiting pairing approval in
pairing
mode
Bot到bot loops
By default bot-authored messages are ignored.
If you set
频道.Discord.allowBots=true
, use strict mention与allowlist rules到avoid loop behavior.
​
配置 参考 pointers
Primary 参考:
配置 参考 - Discord
High-signal Discord fields:
startup/auth:
enabled
,
token
,
accounts.*
,
allowBots
policy:
groupPolicy
,
dm.*
,
guilds.*
,
guilds.*.频道.*
command:
commands.native
,
commands.useAccessGroups
,
configWrites
reply/history:
replyToMode
,
historyLimit
,
dmHistoryLimit
,
dms.*.historyLimit
delivery:
textChunkLimit
,
chunkMode
,
maxLinesPerMessage
media/重试:
mediaMaxMb
,
重试
actions:
actions.*
在线状态:
activity
,
status
,
activityType
,
activityUrl
features:
pluralkit
,
execApprovals
,
intents
,
agentComponents
,
heartbeat
,
responsePrefix
​
Safety与operations
Treat bot tokens as secrets (
DISCORD_BOT_TOKEN
preferred在supervised environments).
Grant least-privilege Discord permissions.
If command 部署/state is stale, restart 网关与re-check with
OpenClaw 频道 status --probe
.
​
Related
Pairing
频道 routing
Troubleshooting
Slash commands
Telegram
IRC
I
[查看英文原版](https://docs.OpenClaw.ai/频道/Discord)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*