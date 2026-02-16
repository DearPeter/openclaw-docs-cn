# Thinking Levels - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
Thinking Levels
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
Thinking Levels (/think directives)
What it does
Resolution order
Setting a 会话 default
应用通过代理
Verbose directives (/verbose或/v)
Reasoning visibility (/reasoning)
Related
Heartbeats
网页 chat UI
​
Thinking Levels (/think directives)
​
What it does
Inline directive在any inbound body:
/t <level>
,
/think:<level>
, or
/thinking <level>
.
Levels (aliases):
off | minimal | low | medium | high | xhigh
(GPT-5.2 + Codex 模型 only)
minimal → “think”
low → “think hard”
medium → “think harder”
high → “ultrathink” (max budget)
xhigh → “ultrathink+” (GPT-5.2 + Codex 模型 only)
x-high
,
x_high
,
extra-high
,
extra high
, and
extra_high
map to
xhigh
.
highest
,
max
map to
high
.
Provider notes:
Z.AI (
zai/*
) only supports binary thinking (
on
/
off
). Any non-
off
level is treated as
on
(mapped to
low
).
​
Resolution order
Inline directive在the 消息 (applies only到that 消息).
会话 override (set通过发送 a directive-only 消息).
Global default (
智能体.defaults.thinkingDefault
in config).
Fallback: low为reasoning-capable 模型; off otherwise.
​
Setting a 会话 default
Send a 消息那is
only
the directive (whitespace allowed), e.g.
/think:medium
or
/t high
.
That sticks为the current 会话 (per-sender通过default); cleared by
/think:off
or 会话 idle reset.
Confirmation reply is sent (
Thinking level set到high.
/
Thinking disabled.
). If the level is invalid (e.g.
/thinking big
), the command is rejected使用a hint与the 会话 state is left unchanged.
Send
/think
(or
/think:
)使用no argument到see the current thinking level.
​
应用通过代理
Embedded Pi
: the resolved level is passed到the in-进程 Pi 代理运行时.
​
Verbose directives (/verbose或/v)
Levels:
on
(minimal) |
full
|
off
(default).
Directive-only 消息 toggles 会话 verbose与replies
Verbose 日志记录 enabled.
/
Verbose 日志记录 disabled.
; invalid levels return a hint without changing state.
/verbose off
stores an explicit 会话 override; clear it via the 会话 UI通过choosing
inherit
.
Inline directive affects only那消息; 会话/global defaults apply otherwise.
Send
/verbose
(or
/verbose:
)使用no argument到see the current verbose level.
When verbose is on, 代理那emit structured 工具 results (Pi, other JSON 智能体) send each 工具 call back as its own metadata-only 消息, prefixed with
<emoji> <工具-name>: <arg>
when available (path/command). These 工具 summaries are sent as soon as each 工具 starts (separate bubbles), not as 流式传输 deltas.
When verbose is
full
, 工具 outputs are also forwarded after completion (separate bubble, truncated到a safe length). If you toggle
/verbose on|full|off
while a run is in-flight, subsequent 工具 bubbles honor the new setting.
​
Reasoning visibility (/reasoning)
Levels:
on|off|流
.
Directive-only 消息 toggles whether thinking blocks are shown在replies.
When enabled, reasoning is sent as a
separate 消息
prefixed with
Reasoning:
.
流
(Telegram only): streams reasoning into the Telegram draft bubble while the reply is generating, then sends the final answer without reasoning.
Alias:
/reason
.
Send
/reasoning
(or
/reasoning:
)使用no argument到see the current reasoning level.
​
Related
Elevated mode docs live in
Elevated mode
.
​
Heartbeats
Heartbeat probe body is the configured heartbeat 提示词 (default:
Read HEARTBEAT.md if it exists (工作空间 上下文). Follow it strictly. Do not infer或repeat old 任务从prior chats. If nothing needs attention, reply HEARTBEAT_OK.
). Inline directives在a heartbeat 消息 apply as usual (but avoid changing 会话 defaults从heartbeats).
Heartbeat delivery defaults到the final payload only. To also send the separate
Reasoning:
消息 (when available), set
智能体.defaults.heartbeat.includeReasoning: true
or per-智能体
智能体.list[].heartbeat.includeReasoning: true
.
​
网页 chat UI
The 网页 chat thinking selector mirrors the 会话’s stored level从the inbound 会话 store/config when the page loads.
Picking another level applies only到the next 消息 (
thinkingOnce
); after 发送, the selector snaps back到the stored 会话 level.
To change the 会话 default, send a
/think:<level>
directive (as before); the selector will reflect it after the next reload.
Elevated Mode
Reactions
I
[查看英文原版](https://docs.OpenClaw.ai/工具/thinking)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*