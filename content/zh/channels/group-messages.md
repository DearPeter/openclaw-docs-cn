# Group Messages - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
配置
Group 消息
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
Group messages (WhatsApp 网页 频道)
What’s implemented (2025-12-03)
Config example (WhatsApp)
Activation command (owner-only)
How到use
Testing / verification
Known considerations
​
Group messages (WhatsApp 网页 频道)
Goal: let Clawd sit在WhatsApp groups, wake up only when pinged,与keep那thread separate从the personal DM 会话.
Note:
智能体.list[].groupChat.mentionPatterns
is now used通过Telegram/Discord/Slack/iMessage as well;这doc focuses在WhatsApp-specific behavior. For multi-智能体 setups, set
智能体.list[].groupChat.mentionPatterns
per 智能体 (or use
messages.groupChat.mentionPatterns
as a global fallback).
​
What’s implemented (2025-12-03)
Activation modes:
mention
(default) or
always
.
mention
requires a ping (real WhatsApp @-mentions via
mentionedJids
, regex patterns,或the bot’s E.164 anywhere在the text).
always
wakes the agent在every 消息 but it should reply only when it can add meaningful value; otherwise it returns the silent token
NO_REPLY
. Defaults can be set在config (
频道.WhatsApp.groups
)与overridden per group via
/activation
. When
频道.WhatsApp.groups
is set, it also acts as a group allowlist (include
"*"
to allow all).
Group policy:
频道.WhatsApp.groupPolicy
controls whether group messages are accepted (
open|disabled|allowlist
).
allowlist
uses
频道.WhatsApp.groupAllowFrom
(fallback: explicit
频道.WhatsApp.allowFrom
). Default is
allowlist
(blocked until you add senders).
Per-group sessions: 会话 keys look like
智能体:<agentId>:WhatsApp:group:<jid>
so commands such as
/verbose on
or
/think high
(sent as standalone messages) are scoped到that group; personal DM state is untouched. Heartbeats are skipped为group threads.
上下文 injection:
pending-only
group messages (default 50) that
did not
trigger a run are prefixed under
[Chat messages since your last reply -为上下文]
,使用the triggering line under
[Current 消息 - respond到this]
. 消息 already在the 会话 are not re-injected.
Sender surfacing: every group batch now ends with
[from: Sender Name (+E164)]
so Pi knows who is speaking.
Ephemeral/view-once: we unwrap那些before extracting text/mentions, so pings inside them still trigger.
Group system 提示词:在the first turn的a group 会话 (and whenever
/activation
changes the mode) we inject a short blurb into the system 提示词 like
You are replying inside the WhatsApp group "<subject>". Group members: Alice (+44...), Bob (+43...), … Activation: trigger-only … Address the specific sender noted在the 消息 上下文.
If metadata isn’t available we still tell the 智能体 it’s a group chat.
​
Config example (WhatsApp)
Add a
groupChat
block to
~/.OpenClaw/OpenClaw.JSON
so display-name pings work even when WhatsApp strips the visual
@
in the text body:
Copy
{
频道
:
{
WhatsApp
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
true
}
,
}
,
}
,
}
,
智能体
:
{
list
:
[
{
id
:
"main"
,
groupChat
:
{
historyLimit
:
50
,
mentionPatterns
:
[
"@?OpenClaw"
,
"\\+?15555550123"
]
,
}
,
}
,
]
,
}
,
}
Notes:
The regexes are case-insensitive; they cover a display-name ping like
@OpenClaw
and the raw number with或without
+
/spaces.
WhatsApp still sends canonical mentions via
mentionedJids
when someone taps the contact, so the number fallback is rarely needed but is a useful safety net.
​
Activation command (owner-only)
Use the group chat command:
/activation mention
/activation always
Only the owner number (from
频道.WhatsApp.allowFrom
,或the bot’s own E.164 when unset) can change this. Send
/status
as a standalone 消息在the group到see the current activation mode.
​
How到use
Add your WhatsApp account (the one 运行 OpenClaw)到the group.
Say
@OpenClaw …
(or include the number). Only allowlisted senders can trigger it unless you set
groupPolicy: "open"
.
The 智能体 提示词 will include recent group 上下文 plus the trailing
[from: …]
marker so it can address the right person.
会话-level directives (
/verbose on
,
/think high
,
/new
or
/reset
,
/compact
) apply only到that group’s 会话; send them as standalone messages so they register. Your personal DM 会话 remains independent.
​
Testing / verification
Manual smoke:
Send an
@OpenClaw
ping在the group与confirm a reply那references the sender name.
Send a second ping与verify the history block is included then cleared在the next turn.
Check 网关 logs (run with
--verbose
)到see
inbound 网页 消息
entries showing
from: <groupJid>
and the
[from: …]
suffix.
​
Known considerations
Heartbeats are intentionally skipped为groups到avoid noisy broadcasts.
Echo suppression uses the combined batch string; if you send identical text twice without mentions, only the first will get a response.
会话 store entries will appear as
智能体:<agentId>:WhatsApp:group:<jid>
in the 会话 store (
~/.OpenClaw/智能体/<agentId>/sessions/sessions.JSON
by default); a missing entry just means the group hasn’t triggered a run yet.
Typing indicators在groups follow
智能体.defaults.typingMode
(default:
消息
when unmentioned).
Pairing
Groups
I
[查看英文原版](https://docs.OpenClaw.ai/频道/group-messages)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*