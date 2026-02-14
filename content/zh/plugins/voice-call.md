# Voice Call Plugin - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Extensions
Voice Call Plugin
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
Voice Call (plugin)
Where it runs (local vs remote)
安装
Option A: 安装从npm (recommended)
Option B: 安装从a local folder (dev, no copying)
Config
Webhook Security
文本转语音为calls
More examples
Inbound calls
命令行界面
智能体 工具
网关 RPC
​
Voice Call (plugin)
Voice calls为OpenClaw via a plugin. Supports outbound notifications and
multi-turn conversations使用inbound policies.
Current 提供者:
twilio
(Programmable Voice + Media Streams)
telnyx
(Call 控制 v2)
plivo
(Voice API + XML transfer + GetInput speech)
mock
(dev/no network)
Quick mental 模型:
安装 plugin
Restart 网关
配置 under
plugins.entries.voice-call.config
Use
OpenClaw voicecall ...
or the
voice_call
工具
​
Where it runs (local vs remote)
The Voice Call plugin runs
inside the 网关 进程
.
If you use a remote 网关, 安装/配置 the plugin在the
machine 运行 the 网关
, then restart the 网关到load it.
​
安装
​
Option A: 安装从npm (recommended)
Copy
OpenClaw
plugins
安装
@OpenClaw/voice-call
Restart the 网关 afterwards.
​
Option B: 安装从a local folder (dev, no copying)
Copy
OpenClaw
plugins
安装
./extensions/voice-call
cd
./extensions/voice-call
&&
pnpm
安装
Restart the 网关 afterwards.
​
Config
Set config under
plugins.entries.voice-call.config
:
Copy
{
plugins
:
{
entries
:
{
"voice-call"
:
{
enabled
:
true
,
config
:
{
provider
:
"twilio"
,
//或"telnyx" | "plivo" | "mock"
fromNumber
:
"+15550001234"
,
toNumber
:
"+15550005678"
,
twilio
:
{
accountSid
:
"ACxxxxxxxx"
,
authToken
:
"..."
,
}
,
plivo
:
{
authId
:
"MAxxxxxxxxxxxxxxxxxxxx"
,
authToken
:
"..."
,
}
,
// Webhook server
serve
:
{
port
:
3334
,
path
:
"/voice/webhook"
,
}
,
// Webhook security (recommended为tunnels/proxies)
webhookSecurity
:
{
allowedHosts
:
[
"voice.example.com"
]
,
trustedProxyIPs
:
[
"100.64.0.1"
]
,
}
,
// Public exposure (pick one)
// publicUrl: "https://example.ngrok.app/voice/webhook",
// tunnel: { provider: "ngrok" },
// tailscale: { mode: "funnel", path: "/voice/webhook" }
outbound
:
{
defaultMode
:
"notify"
,
// notify | conversation
}
,
流式传输
:
{
enabled
:
true
,
streamPath
:
"/voice/stream"
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
Notes:
Twilio/Telnyx require a
publicly reachable
webhook URL.
Plivo requires a
publicly reachable
webhook URL.
mock
is a local dev provider (no network calls).
skipSignatureVerification
is为local testing only.
If you use ngrok free tier, set
publicUrl
to the exact ngrok URL; signature verification is always enforced.
tunnel.allowNgrokFreeTierLoopbackBypass: true
allows Twilio webhooks使用invalid signatures
only
when
tunnel.provider="ngrok"
and
serve.bind
is loopback (ngrok local 智能体). Use为local dev only.
Ngrok free tier URLs can change或add interstitial behavior; if
publicUrl
drifts, Twilio signatures will fail. For production, prefer a stable domain或Tailscale funnel.
​
Webhook Security
When a proxy或tunnel sits在front的the 网关, the plugin reconstructs the
public URL为signature verification. These options 控制 which forwarded
headers are trusted.
webhookSecurity.allowedHosts
allowlists hosts从forwarding headers.
webhookSecurity.trustForwardingHeaders
trusts forwarded headers without an allowlist.
webhookSecurity.trustedProxyIPs
only trusts forwarded headers when the request
remote IP matches the list.
Example使用a stable public host:
Copy
{
plugins
:
{
entries
:
{
"voice-call"
:
{
config
:
{
publicUrl
:
"https://voice.example.com/voice/webhook"
,
webhookSecurity
:
{
allowedHosts
:
[
"voice.example.com"
]
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
​
文本转语音为calls
Voice Call uses the core
messages.文本转语音
配置 (OpenAI或ElevenLabs) for
流式传输 speech在calls. You can override it under the plugin config使用the
same shape
— it deep‑merges with
messages.文本转语音
.
Copy
{
文本转语音
:
{
provider
:
"elevenlabs"
,
elevenlabs
:
{
voiceId
:
"pMsXgVXv3BLzUgSXRplE"
,
modelId
:
"eleven_multilingual_v2"
,
}
,
}
,
}
Notes:
Edge 文本转语音 is ignored为voice calls
(telephony audio needs PCM; Edge output is unreliable).
Core 文本转语音 is used when Twilio media 流式传输 is enabled; otherwise calls fall back到provider native voices.
​
More examples
Use core 文本转语音 only (no override):
Copy
{
messages
:
{
文本转语音
:
{
provider
:
"openai"
,
openai
:
{
voice
:
"alloy"
}
,
}
,
}
,
}
Override到ElevenLabs just为calls (keep core default elsewhere):
Copy
{
plugins
:
{
entries
:
{
"voice-call"
:
{
config
:
{
文本转语音
:
{
provider
:
"elevenlabs"
,
elevenlabs
:
{
apiKey
:
"elevenlabs_key"
,
voiceId
:
"pMsXgVXv3BLzUgSXRplE"
,
modelId
:
"eleven_multilingual_v2"
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
,
}
Override only the OpenAI model为calls (deep‑merge example):
Copy
{
plugins
:
{
entries
:
{
"voice-call"
:
{
config
:
{
文本转语音
:
{
openai
:
{
模型
:
"gpt-4o-mini-文本转语音"
,
voice
:
"marin"
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
,
}
​
Inbound calls
Inbound policy defaults to
disabled
. To enable inbound calls, set:
Copy
{
inboundPolicy
:
"allowlist"
,
allowFrom
:
[
"+15550001234"
]
,
inboundGreeting
:
"Hello! How can I 帮助?"
,
}
Auto-responses use the 智能体 system. Tune with:
responseModel
responseSystemPrompt
responseTimeoutMs
​
命令行界面
Copy
OpenClaw
voicecall
call
--to
"+15555550123"
--消息
"Hello从OpenClaw"
OpenClaw
voicecall
continue
--call-id
<
i
d
>
--消息
"Any questions?"
OpenClaw
voicecall
speak
--call-id
<
i
d
>
--消息
"One moment"
OpenClaw
voicecall
end
--call-id
<
i
d
>
OpenClaw
voicecall
status
--call-id
<
i
d
>
OpenClaw
voicecall
tail
OpenClaw
voicecall
expose
--mode
funnel
​
智能体 工具
工具 name:
voice_call
Actions:
initiate_call
(消息, to?, mode?)
continue_call
(callId, 消息)
speak_to_user
(callId, 消息)
end_call
(callId)
get_status
(callId)
This repo ships a matching skill doc at
技能/voice-call/SKILL.md
.
​
网关 RPC
voicecall.initiate
(
to?
,
消息
,
mode?
)
voicecall.continue
(
callId
,
消息
)
voicecall.speak
(
callId
,
消息
)
voicecall.end
(
callId
)
voicecall.status
(
callId
)
Plugins
Zalo Personal Plugin
I
[查看英文原版](https://docs.OpenClaw.ai/plugins/voice-call)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*