# Slash Commands - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
技能
Slash Commands
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
Slash commands
Config
Command list
Usage surfaces (what shows where)
模型 selection (/模型)
调试 overrides
Config updates
Surface notes
​
Slash commands
Commands are handled通过the 网关. Most commands must be sent as a
standalone
消息那starts with
/
.
The host-only bash chat command uses
! <cmd>
(with
/bash <cmd>
as an alias).
There are two related systems:
Commands
: standalone
/...
messages.
Directives
:
/think
,
/verbose
,
/reasoning
,
/elevated
,
/执行
,
/模型
,
/队列
.
Directives are stripped从the 消息 before the 模型 sees it.
In normal chat messages (not directive-only), they are treated as “inline hints”与do
not
persist 会话 settings.
In directive-only messages (the 消息 contains only directives), they persist到the 会话与reply使用an acknowledgement.
Directives are only applied for
authorized senders
. If
commands.allowFrom
is set, it is the only
allowlist used; otherwise 授权 comes从channel allowlists/pairing plus
commands.useAccessGroups
.
Unauthorized senders see directives treated as plain text.
There are also a few
inline shortcuts
(allowlisted/authorized senders only):
/帮助
,
/commands
,
/status
,
/whoami
(
/id
).
They run immediately, are stripped before the 模型 sees the 消息,与the remaining text continues through the normal flow.
​
Config
Copy
{
commands
:
{
native
:
"auto"
,
native技能
:
"auto"
,
text
:
true
,
bash
:
false
,
bashForegroundMs
:
2000
,
config
:
false
,
调试
:
false
,
restart
:
false
,
allowFrom
:
{
"*"
:
[
"user1"
]
,
Discord
:
[
"user:123"
]
,
}
,
useAccessGroups
:
true
,
}
,
}
commands.text
(default
true
) enables parsing
/...
in chat messages.
On surfaces without native commands (WhatsApp/WebChat/Signal/iMessage/Google Chat/MS Teams), text commands still work even if you set这to
false
.
commands.native
(default
"auto"
) registers native commands.
Auto: on为Discord/Telegram; off为Slack (until you add slash commands); ignored为提供者 without native support.
Set
频道.Discord.commands.native
,
频道.Telegram.commands.native
, or
频道.Slack.commands.native
to override per provider (bool or
"auto"
).
false
clears previously registered commands在Discord/Telegram在startup. Slack commands are managed在the Slack app与are not removed automatically.
commands.native技能
(default
"auto"
) registers
skill
commands natively when supported.
Auto: on为Discord/Telegram; off为Slack (Slack requires creating a slash command per skill).
Set
频道.Discord.commands.native技能
,
频道.Telegram.commands.native技能
, or
频道.Slack.commands.native技能
to override per provider (bool or
"auto"
).
commands.bash
(default
false
) enables
! <cmd>
to run host shell commands (
/bash <cmd>
is an alias; requires
工具.elevated
allowlists).
commands.bashForegroundMs
(default
2000
) controls how long bash waits before switching到background mode (
0
backgrounds immediately).
commands.config
(default
false
) enables
/config
(reads/writes
OpenClaw.JSON
).
commands.调试
(default
false
) enables
/调试
(运行时-only overrides).
commands.allowFrom
(optional) sets a per-provider allowlist为command 授权. When configured, it is the
only 授权 source为commands与directives (频道 allowlists/pairing and
commands.useAccessGroups
are ignored). Use
"*"
for a global default; provider-specific keys override it.
commands.useAccessGroups
(default
true
) enforces allowlists/policies为commands when
commands.allowFrom
is not set.
​
Command list
Text + native (when enabled):
/帮助
/commands
/skill <name> [input]
(run a skill通过name)
/status
(show current status; includes provider usage/quota为the current 模型 provider when available)
/allowlist
(list/add/remove allowlist entries)
/approve <id> allow-once|allow-always|deny
(resolve 执行 approval prompts)
/上下文 [list|detail|JSON]
(explain “上下文”;
detail
shows per-file + per-工具 + per-skill + system 提示词 size)
/whoami
(show your sender id; alias:
/id
)
/subagents list|stop|log|info|send
(inspect, stop, log,或消息 sub-智能体 runs为the current 会话)
/config show|get|set|unset
(persist config到disk, owner-only; requires
commands.config: true
)
/调试 show|set|unset|reset
(运行时 overrides, owner-only; requires
commands.调试: true
)
/usage off|tokens|full|cost
(per-response usage footer或local cost summary)
/文本转语音 off|always|inbound|tagged|status|provider|limit|summary|audio
(控制 文本转语音; see
/文本转语音
)
Discord: native command is
/voice
(Discord reserves
/文本转语音
); text
/文本转语音
still works.
/stop
/restart
/dock-Telegram
(alias:
/dock_telegram
) (switch replies到Telegram)
/dock-Discord
(alias:
/dock_discord
) (switch replies到Discord)
/dock-Slack
(alias:
/dock_slack
) (switch replies到Slack)
/activation mention|always
(groups only)
/send on|off|inherit
(owner-only)
/reset
or
/new [模型]
(optional 模型 hint; remainder is passed through)
/think <off|minimal|low|medium|high|xhigh>
(dynamic choices通过model/provider; aliases:
/thinking
,
/t
)
/verbose on|full|off
(alias:
/v
)
/reasoning on|off|stream
(alias:
/reason
; when on, sends a separate 消息 prefixed
Reasoning:
;
流
= Telegram draft only)
/elevated on|off|ask|full
(alias:
/elev
;
full
skips 执行 approvals)
/执行 host=<sandbox|网关|node> security=<deny|allowlist|full> ask=<off|on-miss|always> node=<id>
(send
/执行
to show current)
/模型 <name>
(alias:
/模型
; or
/<alias>
from
智能体.defaults.模型.*.alias
)
/队列 <mode>
(plus options like
debounce:2s cap:25 drop:summarize
; send
/队列
to see current settings)
/bash <command>
(host-only; alias for
! <command>
; requires
commands.bash: true
+
工具.elevated
allowlists)
Text-only:
/compact [instructions]
(see
/concepts/压缩
)
! <command>
(host-only; one在a time; use
!poll
+
!stop
for long-运行 jobs)
!poll
(check output / status; accepts optional
sessionId
;
/bash poll
also works)
!stop
(stop the 运行 bash job; accepts optional
sessionId
;
/bash stop
also works)
Notes:
Commands accept an optional
:
between the command与args (e.g.
/think: high
,
/send: on
,
/帮助:
).
/new <模型>
accepts a 模型 alias,
provider/模型
,或a provider name (fuzzy match); if no match, the text is treated as the 消息 body.
For full provider usage breakdown, use
OpenClaw status --usage
.
/allowlist add|remove
requires
commands.config=true
and honors 频道
configWrites
.
/usage
controls the per-response usage footer;
/usage cost
prints a local cost summary从OpenClaw 会话 logs.
/restart
is disabled通过default; set
commands.restart: true
to enable it.
/verbose
is meant为调试与extra visibility; keep it
off
in normal use.
/reasoning
(and
/verbose
) are risky在group settings: they may reveal internal reasoning或工具 output you did not intend到expose. Prefer leaving them off, especially在group chats.
Fast path:
command-only messages从allowlisted senders are handled immediately (bypass 队列 + 模型).
Group mention gating:
command-only messages从allowlisted senders bypass mention requirements.
Inline shortcuts (allowlisted senders only):
certain commands also work when embedded在a normal 消息与are stripped before the 模型 sees the remaining text.
示例：
hey /status
triggers a status reply,与the remaining text continues through the normal flow.
Currently:
/帮助
,
/commands
,
/status
,
/whoami
(
/id
).
Unauthorized command-only messages are silently ignored,与inline
/...
tokens are treated as plain text.
Skill commands:
user-invocable
技能 are exposed as slash commands. Names are sanitized to
a-z0-9_
(max 32 chars); collisions get numeric suffixes (e.g.
_2
).
/skill <name> [input]
runs a skill通过name (useful when native command limits prevent per-skill commands).
By default, skill commands are forwarded到the 模型 as a normal request.
技能 may optionally declare
command-dispatch: 工具
to route the command directly到a 工具 (deterministic, no 模型).
示例：
/prose
(OpenProse plugin) — see
OpenProse
.
Native command arguments:
Discord uses autocomplete为dynamic options (and button menus when you omit required args). Telegram与Slack show a button menu when a command supports choices与you omit the arg.
​
Usage surfaces (what shows where)
Provider usage/quota
(example: “Claude 80% left”) shows up in
/status
for the current 模型 provider when usage tracking is enabled.
Per-response tokens/cost
is controlled by
/usage off|tokens|full
(appended到normal replies).
/模型 status
is about
模型/auth/endpoints
, not usage.
​
模型 selection (
/模型
)
/模型
is implemented as a directive.
Examples:
Copy
/模型
/模型 list
/模型 3
/模型 openai/gpt-5.2
/模型 opus@anthropic:default
/模型 status
Notes:
/模型
and
/模型 list
show a compact, numbered picker (模型 family + available 提供者).
/模型 <#>
selects从that picker (and prefers the current provider when possible).
/模型 status
shows the detailed view, including configured provider 端点 (
baseUrl
)与API mode (
API
) when available.
​
调试 overrides
/调试
lets you set
运行时-only
config overrides (记忆, not disk). Owner-only. Disabled通过default; enable with
commands.调试: true
.
Examples:
Copy
/调试 show
/调试 set messages.responsePrefix="[OpenClaw]"
/调试 set 频道.WhatsApp.allowFrom=["+1555","+4477"]
/调试 unset messages.responsePrefix
/调试 reset
Notes:
Overrides apply immediately到new config reads, but do
not
write to
OpenClaw.JSON
.
Use
/调试 reset
to clear all overrides与return到the on-disk config.
​
Config updates
/config
writes到your on-disk config (
OpenClaw.JSON
). Owner-only. Disabled通过default; enable with
commands.config: true
.
Examples:
Copy
/config show
/config show messages.responsePrefix
/config get messages.responsePrefix
/config set messages.responsePrefix="[OpenClaw]"
/config unset messages.responsePrefix
Notes:
Config is validated before write; invalid changes are rejected.
/config
updates persist across restarts.
​
Surface notes
Text commands
run在the normal chat 会话 (DMs share
main
, groups have their own 会话).
Native commands
use isolated sessions:
Discord:
智能体:<agentId>:Discord:slash:<userId>
Slack:
智能体:<agentId>:Slack:slash:<userId>
(prefix configurable via
频道.Slack.slashCommand.sessionPrefix
)
Telegram:
Telegram:slash:<userId>
(targets the chat 会话 via
CommandTarget会话Key
)
/stop
targets the active chat 会话 so it can abort the current run.
Slack:
频道.Slack.slashCommand
is still supported为a single
/OpenClaw
-style command. If you enable
commands.native
, you must create one Slack slash command per built-in command (same names as
/帮助
). Command argument menus为Slack are delivered as ephemeral Block Kit buttons.
Multi-智能体 Sandbox & 工具
技能
I
[查看英文原版](https://docs.OpenClaw.ai/工具/slash-commands)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*