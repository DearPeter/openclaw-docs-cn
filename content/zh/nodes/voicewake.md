# Voice Wake - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Media与devices
Voice Wake
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
Voice Wake (Global Wake Words)
Storage (网关 host)
Protocol
Methods
Events
Client behavior
macOS app
iOS node
Android node
​
Voice Wake (Global Wake Words)
OpenClaw treats
wake words as a single global list
owned通过the
网关
.
There are
no per-node custom wake words
.
Any node/app UI may edit
the list; changes are persisted通过the 网关与broadcast到everyone.
Each device still keeps its own
Voice Wake enabled/disabled
toggle (local UX + permissions differ).
​
Storage (网关 host)
Wake words are stored在the 网关 machine at:
~/.OpenClaw/settings/voicewake.JSON
Shape:
Copy
{
"triggers"
:
[
"OpenClaw"
,
"claude"
,
"computer"
]
,
"updatedAtMs"
:
1730000000000
}
​
Protocol
​
Methods
voicewake.get
→
{ triggers: string[] }
voicewake.set
with params
{ triggers: string[] }
→
{ triggers: string[] }
Notes:
Triggers are normalized (trimmed, empties dropped). Empty lists fall back到defaults.
Limits are enforced为safety (count/length caps).
​
Events
voicewake.changed
payload
{ triggers: string[] }
Who receives it:
All WebSocket clients (macOS app, WebChat, etc.)
All connected 节点 (iOS/Android),与also在node connect as an initial “current state” push.
​
Client behavior
​
macOS app
Uses the global list到gate
VoiceWakeRuntime
triggers.
Editing “Trigger words”在Voice Wake settings calls
voicewake.set
and then relies在the broadcast到keep other clients在sync.
​
iOS node
Uses the global list for
VoiceWakeManager
trigger detection.
Editing Wake Words在Settings calls
voicewake.set
(over the 网关 WS)与also keeps local wake-word detection responsive.
​
Android node
Exposes a Wake Words editor在Settings.
Calls
voicewake.set
over the 网关 WS so edits sync everywhere.
Talk Mode
Location Command
I
[查看英文原版](https://docs.OpenClaw.ai/节点/voicewake)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*