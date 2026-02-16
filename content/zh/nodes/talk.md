# Talk Mode - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Media与devices
Talk Mode
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
Talk Mode
Behavior (macOS)
Voice directives在replies
Config (~/.OpenClaw/OpenClaw.JSON)
macOS UI
Notes
​
Talk Mode
Talk mode is a continuous voice conversation loop:
Listen为speech
Send transcript到the 模型 (main 会话, chat.send)
Wait为the response
Speak it via ElevenLabs (流式传输 playback)
​
Behavior (macOS)
Always-on overlay
while Talk mode is enabled.
Listening → Thinking → Speaking
phase transitions.
On a
short pause
(silence window), the current transcript is sent.
Replies are
written到WebChat
(same as typing).
Interrupt在speech
(default on): if the user starts talking while the assistant is speaking, we stop playback与note the interruption timestamp为the next 提示词.
​
Voice directives在replies
The assistant may prefix its reply使用a
single JSON line
to 控制 voice:
Copy
{
"voice"
:
"<voice-id>"
,
"once"
:
true
}
Rules:
First non-empty line only.
Unknown keys are ignored.
once: true
applies到the current reply only.
Without
once
, the voice becomes the new default为Talk mode.
The JSON line is stripped before 文本转语音 playback.
Supported keys:
voice
/
voice_id
/
voiceId
模型
/
model_id
/
modelId
speed
,
rate
(WPM),
stability
,
similarity
,
style
,
speakerBoost
seed
,
normalize
,
lang
,
output_format
,
延迟_tier
once
​
Config (
~/.OpenClaw/OpenClaw.JSON
)
Copy
{
talk
:
{
voiceId
:
"elevenlabs_voice_id"
,
modelId
:
"eleven_v3"
,
outputFormat
:
"mp3_44100_128"
,
apiKey
:
"elevenlabs_API_key"
,
interruptOnSpeech
:
true
,
}
,
}
Defaults:
interruptOnSpeech
: true
voiceId
: falls back to
ELEVENLABS_VOICE_ID
/
SAG_VOICE_ID
(or first ElevenLabs voice when API密钥 is available)
modelId
: defaults to
eleven_v3
when unset
apiKey
: falls back to
ELEVENLABS_API_KEY
(or 网关 shell profile if available)
outputFormat
: defaults to
pcm_44100
on macOS/iOS and
pcm_24000
on Android (set
mp3_*
to force MP3 流式传输)
​
macOS UI
Menu bar toggle:
Talk
Config tab:
Talk Mode
group (voice id + interrupt toggle)
Overlay:
Listening
: cloud pulses使用mic level
Thinking
: sinking animation
Speaking
: radiating rings
Click cloud: stop speaking
Click X: exit Talk mode
​
Notes
Requires Speech + Microphone permissions.
Uses
chat.send
against 会话 key
main
.
文本转语音 uses ElevenLabs 流式传输 API with
ELEVENLABS_API_KEY
and incremental playback在macOS/iOS/Android为lower latency.
stability
for
eleven_v3
is validated to
0.0
,
0.5
, or
1.0
; other 模型 accept
0..1
.
延迟_tier
is validated to
0..4
when set.
Android supports
pcm_16000
,
pcm_22050
,
pcm_24000
, and
pcm_44100
output formats为low-延迟 AudioTrack 流式传输.
Camera Capture
Voice Wake
I
[查看英文原版](https://docs.OpenClaw.ai/节点/talk)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*