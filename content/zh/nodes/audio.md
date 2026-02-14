# Audio与Voice Notes - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Media与devices
Audio与Voice Notes
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
Auth Monitoring
Media与devices
节点
Node Troubleshooting
Image与Media Support
Audio与Voice Notes
Camera Capture
Talk Mode
Voice Wake
Location Command
本页内容
Audio / Voice Notes — 2026-01-17
What works
Auto-detection (default)
Config examples
Provider + 命令行界面 fallback (OpenAI + Whisper 命令行界面)
Provider-only使用scope gating
Provider-only (Deepgram)
Notes & limits
Mention Detection在Groups
Gotchas
​
Audio / Voice Notes — 2026-01-17
​
What works
Media understanding (audio)
: If audio understanding is enabled (or auto‑detected), OpenClaw:
Locates the first audio attachment (local path或URL)与downloads it if needed.
Enforces
maxBytes
before 发送到each 模型 entry.
Runs the first eligible 模型 entry在order (provider或命令行界面).
If it fails或skips (size/timeout), it tries the next entry.
On success, it replaces
Body
with an
[Audio]
block与sets
{{Transcript}}
.
Command parsing
: When transcription succeeds,
CommandBody
/
RawBody
are set到the transcript so slash commands still work.
Verbose logging
: In
--verbose
, we log when transcription runs与when it replaces the body.
​
Auto-detection (default)
If you
don’t 配置 模型
and
工具.media.audio.enabled
is
not
set to
false
,
OpenClaw auto-detects在this order与stops在the first working option:
Local CLIs
(if installed)
sherpa-onnx-offline
(requires
SHERPA_ONNX_MODEL_DIR
with encoder/decoder/joiner/tokens)
whisper-命令行界面
(from
whisper-cpp
; uses
WHISPER_CPP_MODEL
or the bundled tiny 模型)
whisper
(Python 命令行界面; downloads 模型 automatically)
Gemini 命令行界面
(
gemini
) using
read_many_files
Provider keys
(OpenAI → Groq → Deepgram → Google)
To disable auto-detection, set
工具.media.audio.enabled: false
.
To customize, set
工具.media.audio.模型
.
Note: Binary detection is best-effort across macOS/Linux/Windows; ensure the 命令行界面 is on
PATH
(we expand
~
),或set an explicit 命令行界面 model使用a full command path.
​
Config examples
​
Provider + 命令行界面 fallback (OpenAI + Whisper 命令行界面)
Copy
{
工具
:
{
media
:
{
audio
:
{
enabled
:
true
,
maxBytes
:
20971520
,
模型
:
[
{
provider
:
"openai"
,
模型
:
"gpt-4o-mini-transcribe"
}
,
{
type
:
"命令行界面"
,
command
:
"whisper"
,
args
:
[
"--模型"
,
"base"
,
"{{MediaPath}}"
]
,
timeoutSeconds
:
45
,
}
,
]
,
}
,
}
,
}
,
}
​
Provider-only使用scope gating
Copy
{
工具
:
{
media
:
{
audio
:
{
enabled
:
true
,
scope
:
{
default
:
"allow"
,
rules
:
[{
action
:
"deny"
,
match
:
{
chatType
:
"group"
} }]
,
}
,
模型
:
[{
provider
:
"openai"
,
模型
:
"gpt-4o-mini-transcribe"
}]
,
}
,
}
,
}
,
}
​
Provider-only (Deepgram)
Copy
{
工具
:
{
media
:
{
audio
:
{
enabled
:
true
,
模型
:
[{
provider
:
"deepgram"
,
模型
:
"nova-3"
}]
,
}
,
}
,
}
,
}
​
Notes & limits
Provider auth follows the standard 模型 auth order (auth profiles, env vars,
模型.提供者.*.apiKey
).
Deepgram picks up
DEEPGRAM_API_KEY
when
provider: "deepgram"
is used.
Deepgram 设置 details:
Deepgram (audio transcription)
.
Audio 提供者 can override
baseUrl
,
headers
, and
providerOptions
via
工具.media.audio
.
Default size cap is 20MB (
工具.media.audio.maxBytes
). Oversize audio is skipped为that model与the next entry is tried.
Default
maxChars
for audio is
unset
(full transcript). Set
工具.media.audio.maxChars
or per-entry
maxChars
to trim output.
OpenAI auto default is
gpt-4o-mini-transcribe
; set
模型: "gpt-4o-transcribe"
for higher accuracy.
Use
工具.media.audio.attachments
to 进程 multiple voice notes (
mode: "all"
+
maxAttachments
).
Transcript is available到templates as
{{Transcript}}
.
命令行界面 stdout is capped (5MB); keep 命令行界面 output concise.
​
Mention Detection在Groups
When
requireMention: true
is set为a group chat, OpenClaw now transcribes audio
before
checking为mentions. This allows voice notes到be processed even when they contain mentions.
How it works:
If a voice 消息 has no text body与the group requires mentions, OpenClaw performs a “preflight” transcription.
The transcript is checked为mention patterns (e.g.,
@BotName
, emoji triggers).
If a mention is found, the 消息 proceeds through the full reply pipeline.
The transcript is used为mention detection so voice notes can pass the mention gate.
Fallback behavior:
If transcription fails during preflight (timeout, API error, etc.), the 消息 is processed based在text-only mention detection.
This ensures那mixed messages (text + audio) are never incorrectly dropped.
示例：
A user sends a voice note saying “Hey @Claude, what’s the weather?”在a Telegram group with
requireMention: true
. The voice note is transcribed, the mention is detected,与the 智能体 replies.
​
Gotchas
Scope rules use first-match wins.
chatType
is normalized to
direct
,
group
, or
room
.
Ensure your 命令行界面 exits 0与prints plain text; JSON needs到be massaged via
jq -r .text
.
Keep timeouts reasonable (
timeoutSeconds
, default 60s)到avoid blocking the reply 队列.
Preflight transcription only processes the
first
audio attachment为mention detection. Additional audio is processed during the main media understanding phase.
Image与Media Support
Camera Capture
I
[查看英文原版](https://docs.OpenClaw.ai/节点/audio)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*