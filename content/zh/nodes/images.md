# Image与Media Support - OpenClaw - 中文翻译


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
Media与devices
Image与Media Support
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
Image & Media Support — 2025-12-05
Goals
命令行界面 Surface
WhatsApp 网页 频道 behavior
Auto-Reply Pipeline
Inbound Media到Commands (Pi)
Limits & Errors
Notes为Tests
​
Image & Media Support — 2025-12-05
The WhatsApp 频道 runs via
Baileys 网页
. This document captures the current media handling rules为send, 网关,与agent replies.
​
Goals
Send media使用optional captions via
OpenClaw 消息 send --media
.
Allow auto-replies从the 网页 inbox到include media alongside text.
Keep per-type limits sane与predictable.
​
命令行界面 Surface
OpenClaw 消息 send --media <path-or-url> [--消息 <caption>]
--media
optional; caption can be empty为media-only sends.
--dry-run
prints the resolved payload;
--JSON
emits
{ 频道, to, messageId, mediaUrl, caption }
.
​
WhatsApp 网页 频道 behavior
Input: local file path
or
HTTP(S) URL.
Flow: load into a Buffer, detect media kind,与build the correct payload:
Images:
resize & recompress到JPEG (max side 2048px) targeting
智能体.defaults.mediaMaxMb
(default 5 MB), capped在6 MB.
Audio/Voice/Video:
pass-through up到16 MB; audio is sent as a voice note (
ptt: true
).
Documents:
anything else, up到100 MB,使用filename preserved when available.
WhatsApp GIF-style playback: send an MP4 with
gifPlayback: true
(命令行界面:
--gif-playback
) so mobile clients loop inline.
MIME detection prefers magic bytes, then headers, then file extension.
Caption comes from
--消息
or
reply.text
; empty caption is allowed.
Logging: non-verbose shows
↩️
/
✅
; verbose includes size与source path/URL.
​
Auto-Reply Pipeline
getReplyFromConfig
returns
{ text?, mediaUrl?, mediaUrls? }
.
When media is present, the 网页 sender resolves local paths或URLs using the same pipeline as
OpenClaw 消息 send
.
Multiple media entries are sent sequentially if provided.
​
Inbound Media到Commands (Pi)
When inbound 网页 messages include media, OpenClaw downloads到a temp file与exposes templating variables:
{{MediaUrl}}
pseudo-URL为the inbound media.
{{MediaPath}}
local temp path written before 运行 the command.
When a per-会话 Docker sandbox is enabled, inbound media is copied into the sandbox 工作空间 and
MediaPath
/
MediaUrl
are rewritten到a relative path like
media/inbound/<filename>
.
Media understanding (if configured via
工具.media.*
or shared
工具.media.模型
) runs before templating与can insert
[Image]
,
[Audio]
, and
[Video]
blocks into
Body
.
Audio sets
{{Transcript}}
and uses the transcript为command parsing so slash commands still work.
Video与image descriptions preserve any caption text为command parsing.
By default only the first matching image/audio/video attachment is processed; set
工具.media.<cap>.attachments
to 进程 multiple attachments.
​
Limits & Errors
Outbound send caps (WhatsApp 网页 send)
Images: ~6 MB cap after recompression.
Audio/voice/video: 16 MB cap; documents: 100 MB cap.
Oversize或unreadable media → clear error在logs与the reply is skipped.
Media understanding caps (transcription/description)
Image default: 10 MB (
工具.media.image.maxBytes
).
Audio default: 20 MB (
工具.media.audio.maxBytes
).
Video default: 50 MB (
工具.media.video.maxBytes
).
Oversize media skips understanding, but replies still go through使用the original body.
​
Notes为Tests
Cover send + reply flows为image/audio/document cases.
Validate recompression为images (size bound)与voice-note flag为audio.
Ensure multi-media replies fan out as sequential sends.
Node Troubleshooting
Audio与Voice Notes
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/节点/images)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*