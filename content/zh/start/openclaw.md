# Personal Assistant 设置 - OpenClaw - 中文翻译


此页面正在翻译中...\n\n
跳转到主要内容
OpenClaw
首页
英文
搜索...
⌘
K
搜索...
导航
Guides
Personal Assistant 设置
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
Home
OpenClaw
概述
展示
Core concepts
Features
First steps
Getting Started
入门指南 概述
入门指南: 命令行界面
入门指南: macOS App
Guides
Personal Assistant 设置
本页内容
Building a personal assistant使用OpenClaw
⚠️ Safety first
Prerequisites
The two-phone 设置 (recommended)
5-minute quick start
Give the 智能体 a 工作空间 (智能体)
The config那turns it into “an assistant”
会话与记忆
Heartbeats (proactive mode)
Media in与out
Operations checklist
Next steps
​
Building a personal assistant使用OpenClaw
OpenClaw is a WhatsApp + Telegram + Discord + iMessage 网关 for
Pi
智能体. Plugins add Mattermost. This guide is the “personal assistant” 设置: one dedicated WhatsApp number那behaves like your always-on 智能体.
​
⚠️ Safety first
You’re putting an agent在a position to:
run commands在your machine (depending在your Pi 工具 设置)
read/write files在your 工作空间
send messages back out via WhatsApp/Telegram/Discord/Mattermost (plugin)
Start conservative:
Always set
频道.WhatsApp.allowFrom
(never run open-to-the-world在your personal Mac).
Use a dedicated WhatsApp number为the assistant.
Heartbeats now default到every 30 minutes. Disable until you trust the 设置通过setting
智能体.defaults.heartbeat.every: "0m"
.
​
Prerequisites
OpenClaw installed与onboarded — see
Getting Started
if you haven’t done这yet
A second phone number (SIM/eSIM/prepaid)为the assistant
​
The two-phone 设置 (recommended)
You want this:
If you link your personal WhatsApp到OpenClaw, every 消息到you becomes “智能体 input”. That’s rarely what you want.
​
5-minute quick start
Pair WhatsApp 网页 (shows QR; scan使用the assistant phone):
Copy
OpenClaw
频道
登录
Start the 网关 (leave it 运行):
Copy
OpenClaw
网关
--port
18789
Put a minimal config in
~/.OpenClaw/OpenClaw.JSON
:
Copy
{
频道
:
{
WhatsApp
:
{
allowFrom
:
[
"+15555550123"
] } }
,
}
Now 消息 the assistant number从your allowlisted phone.
When 入门指南 finishes, we auto-open the dashboard与print a clean (non-tokenized) link. If it prompts为auth, paste the token from
网关.auth.token
into 控制 UI settings. To reopen later:
OpenClaw dashboard
.
​
Give the 智能体 a 工作空间 (智能体)
OpenClaw reads operating instructions与“记忆”从its 工作空间 directory.
By default, OpenClaw uses
~/.OpenClaw/工作空间
as the 智能体 工作空间,与will create it (plus starter
智能体.md
,
SOUL.md
,
工具.md
,
IDENTITY.md
,
USER.md
,
HEARTBEAT.md
) automatically在设置/first 智能体 run.
引导.md
is only created when the 工作空间 is brand new (it should not come back after you delete it).
记忆.md
is optional (not auto-created); when present, it is loaded为normal sessions. Subagent sessions only inject
智能体.md
and
工具.md
.
提示： treat这folder like OpenClaw’s “记忆”与make it a git repo (ideally private) so your
智能体.md
+ 记忆 files are backed up. If git is installed, brand-new workspaces are auto-initialized.
Copy
OpenClaw
设置
完整的工作空间布局 + 备份指南:
Agent工作空间
记忆 workflow:
记忆
Optional: choose a different 工作空间 with
智能体.defaults.工作空间
(supports
~
).
Copy
{
智能体
:
{
工作空间
:
"~/.OpenClaw/工作空间"
,
}
,
}
If you already ship your own 工作空间 files从a repo, you can disable 引导 file creation entirely:
Copy
{
智能体
:
{
skipBootstrap
:
true
,
}
,
}
​
The config那turns it into “an assistant”
OpenClaw defaults到a good assistant 设置, but you’ll usually want到tune:
persona/instructions in
SOUL.md
thinking defaults (if desired)
heartbeats (once you trust it)
示例：
Copy
{
logging
:
{
level
:
"info"
}
,
智能体
:
{
模型
:
"anthropic/claude-opus-4-6"
,
工作空间
:
"~/.OpenClaw/工作空间"
,
thinkingDefault
:
"high"
,
timeoutSeconds
:
1800
,
// Start使用0; enable later.
heartbeat
:
{
every
:
"0m"
}
,
}
,
频道
:
{
WhatsApp
:
{
allowFrom
:
[
"+15555550123"
]
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
}
,
}
,
}
,
}
,
routing
:
{
groupChat
:
{
mentionPatterns
:
[
"@OpenClaw"
,
"OpenClaw"
]
,
}
,
}
,
会话
:
{
scope
:
"per-sender"
,
resetTriggers
:
[
"/new"
,
"/reset"
]
,
reset
:
{
mode
:
"daily"
,
atHour
:
4
,
idleMinutes
:
10080
,
}
,
}
,
}
​
会话与记忆
会话 files:
~/.OpenClaw/智能体/<agentId>/sessions/{{SessionId}}.jsonl
会话 metadata (token usage, last route, etc):
~/.OpenClaw/智能体/<agentId>/sessions/sessions.JSON
(legacy:
~/.OpenClaw/sessions/sessions.JSON
)
/new
or
/reset
starts a fresh 会话为that chat (configurable via
resetTriggers
). If sent alone, the 智能体 replies使用a short hello到confirm the reset.
/compact [instructions]
compacts the 会话 上下文与reports the remaining 上下文 budget.
​
Heartbeats (proactive mode)
By default, OpenClaw runs a heartbeat every 30 minutes使用the 提示词:
Read HEARTBEAT.md if it exists (工作空间 上下文). Follow it strictly. Do not infer或repeat old 任务从prior chats. If nothing needs attention, reply HEARTBEAT_OK.
Set
智能体.defaults.heartbeat.every: "0m"
to disable.
If
HEARTBEAT.md
exists but is effectively empty (only blank lines与markdown headers like
# Heading
), OpenClaw skips the heartbeat run到save API calls.
If the file is missing, the heartbeat still runs与the 模型 decides what到do.
If the 智能体 replies with
HEARTBEAT_OK
(optionally使用short padding; see
智能体.defaults.heartbeat.ackMaxChars
), OpenClaw suppresses outbound delivery为that heartbeat.
Heartbeats run full 智能体 turns — shorter intervals burn more tokens.
Copy
{
智能体
:
{
heartbeat
:
{
every
:
"30m"
}
,
}
,
}
​
Media in与out
Inbound attachments (images/audio/docs) can be surfaced到your command via templates:
{{MediaPath}}
(local temp file path)
{{MediaUrl}}
(pseudo-URL)
{{Transcript}}
(if audio transcription is enabled)
Outbound attachments从the 智能体: include
MEDIA:<path-or-url>
on its own line (no spaces). 示例：
Copy
Here’s the screenshot.
MEDIA:https://example.com/screenshot.png
OpenClaw extracts these与sends them as media alongside the text.
​
Operations checklist
Copy
OpenClaw
status
# local status (creds, sessions, queued events)
OpenClaw
status
--all
# full diagnosis (read-only, pasteable)
OpenClaw
status
--deep
# adds 网关 health probes (Telegram + Discord)
OpenClaw
health
--JSON
# 网关 health snapshot (WS)
Logs live under
/tmp/OpenClaw/
(default:
OpenClaw-YYYY-MM-DD.log
).
​
Next steps
WebChat:
WebChat
网关 ops:
网关 runbook
Cron + wakeups:
Cron jobs
macOS menu bar companion:
OpenClaw macOS app
iOS node app:
iOS app
Android node app:
Android app
Windows status:
Windows (WSL2)
Linux status:
Linux app
Security:
Security
入门指南: macOS App
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/start/OpenClaw)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*