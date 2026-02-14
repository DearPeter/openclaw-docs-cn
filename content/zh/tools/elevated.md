# Elevated Mode - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
Elevated Mode
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
Elevated Mode (/elevated directives)
What it does
What it controls (and what it doesn’t)
Resolution order
Setting a 会话 default
Availability + allowlists
Logging + status
​
Elevated Mode (/elevated directives)
​
What it does
/elevated on
runs在the 网关 host与keeps 执行 approvals (same as
/elevated ask
).
/elevated full
runs在the 网关 host
and
auto-approves 执行 (skips 执行 approvals).
/elevated ask
runs在the 网关 host but keeps 执行 approvals (same as
/elevated on
).
on
/
ask
do
not
force
执行.security=full
; configured security/ask policy still applies.
Only changes behavior when the 智能体 is
sandboxed
(otherwise 执行 already runs在the host).
Directive forms:
/elevated on|off|ask|full
,
/elev on|off|ask|full
.
Only
on|off|ask|full
are accepted; anything else returns a hint与does not change state.
​
What it controls (and what it doesn’t)
Availability gates
:
工具.elevated
is the global baseline.
智能体.list[].工具.elevated
can further restrict elevated per 智能体 (both must allow).
Per-会话 state
:
/elevated on|off|ask|full
sets the elevated level为the current 会话 key.
Inline directive
:
/elevated on|ask|full
inside a 消息 applies到that 消息 only.
Groups
: In group chats, elevated directives are only honored when the 智能体 is mentioned. Command-only messages那bypass mention requirements are treated as mentioned.
Host execution
: elevated forces
执行
onto the 网关 host;
full
also sets
security=full
.
Approvals
:
full
skips 执行 approvals;
on
/
ask
honor them when allowlist/ask rules require.
Unsandboxed 智能体
: no-op为location; only affects gating, logging,与status.
工具 policy still applies
: if
执行
is denied通过tool policy, elevated cannot be used.
Separate from
/执行
:
/执行
adjusts per-会话 defaults为authorized senders与does not require elevated.
​
Resolution order
Inline directive在the 消息 (applies only到that 消息).
会话 override (set通过发送 a directive-only 消息).
Global default (
智能体.defaults.elevatedDefault
in config).
​
Setting a 会话 default
Send a 消息那is
only
the directive (whitespace allowed), e.g.
/elevated full
.
Confirmation reply is sent (
Elevated mode set到full...
/
Elevated mode disabled.
).
If elevated access is disabled或the sender is not在the approved allowlist, the directive replies使用an actionable error与does not change 会话 state.
Send
/elevated
(or
/elevated:
)使用no argument到see the current elevated level.
​
Availability + allowlists
Feature gate:
工具.elevated.enabled
(default can be off via config even if the code supports it).
Sender allowlist:
工具.elevated.allowFrom
with per-provider allowlists (e.g.
Discord
,
WhatsApp
).
Per-智能体 gate:
智能体.list[].工具.elevated.enabled
(optional; can only further restrict).
Per-智能体 allowlist:
智能体.list[].工具.elevated.allowFrom
(optional; when set, the sender must match
both
global + per-智能体 allowlists).
Discord fallback: if
工具.elevated.allowFrom.Discord
is omitted, the
频道.Discord.dm.allowFrom
list is used as a fallback. Set
工具.elevated.allowFrom.Discord
(even
[]
)到override. Per-智能体 allowlists do
not
use the fallback.
All gates must pass; otherwise elevated is treated as unavailable.
​
Logging + status
Elevated 执行 calls are logged在info level.
会话 status includes elevated mode (e.g.
elevated=ask
,
elevated=full
).
apply_patch 工具
Thinking Levels
I
[查看英文原版](https://docs.OpenClaw.ai/工具/elevated)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*