# Agent Send - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
智能体 coordination
智能体 Send
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
OpenClaw 智能体 (direct 智能体 runs)
Behavior
Examples
Flags
​
OpenClaw 智能体
(direct 智能体 runs)
OpenClaw 智能体
runs a single 智能体 turn without needing an inbound chat 消息.
By default it goes
through the 网关
; add
--local
to force the embedded
runtime在the current machine.
​
Behavior
Required:
--消息 <text>
会话 selection:
--to <dest>
derives the 会话 key (group/频道 targets preserve isolation; direct chats collapse to
main
),
or
--会话-id <id>
reuses an existing 会话通过id,
or
--智能体 <id>
targets a configured 智能体 directly (uses那agent’s
main
会话 key)
Runs the same embedded Agent运行时 as normal inbound replies.
Thinking/verbose flags persist into the 会话 store.
Output:
default: prints reply text (plus
MEDIA:<url>
lines)
--JSON
: prints structured payload + metadata
Optional delivery back到a 频道 with
--deliver
+
--频道
(target formats match
OpenClaw 消息 --target
).
Use
--reply-频道
/
--reply-to
/
--reply-account
to override delivery without changing the 会话.
If the 网关 is unreachable, the 命令行界面
falls back
to the embedded local run.
​
Examples
Copy
OpenClaw
智能体
--to
+15555550123
--消息
"status update"
OpenClaw
智能体
--智能体
ops
--消息
"Summarize logs"
OpenClaw
智能体
--会话-id
1234
--消息
"Summarize inbox"
--thinking
medium
OpenClaw
智能体
--to
+15555550123
--消息
"Trace logs"
--verbose
on
--JSON
OpenClaw
智能体
--to
+15555550123
--消息
"Summon reply"
--deliver
OpenClaw
智能体
--智能体
ops
--消息
"Generate report"
--deliver
--reply-频道
Slack
--reply-to
"#reports"
​
Flags
--local
: run locally (requires 模型 provider API keys在your shell)
--deliver
: send the reply到the chosen 频道
--频道
: delivery 频道 (
WhatsApp|Telegram|Discord|googlechat|Slack|signal|imessage
, default:
WhatsApp
)
--reply-to
: delivery target override
--reply-频道
: delivery 频道 override
--reply-account
: delivery account id override
--thinking <off|minimal|low|medium|high|xhigh>
: persist thinking level (GPT-5.2 + Codex 模型 only)
--verbose <on|full|off>
: persist verbose level
--timeout <seconds>
: override 智能体 timeout
--JSON
: output structured JSON
浏览器 Troubleshooting
Sub-智能体
I
[查看英文原版](https://docs.OpenClaw.ai/工具/智能体-send)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*