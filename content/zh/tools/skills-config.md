# 技能 Config - OpenClaw - 中文翻译


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
技能
技能 Config
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
技能 Config
Fields
Notes
Sandboxed 技能 + env vars
​
技能 Config
All 技能-related 配置 lives under
技能
in
~/.OpenClaw/OpenClaw.JSON
.
Copy
{
技能
:
{
allowBundled
:
[
"gemini"
,
"peekaboo"
]
,
load
:
{
extraDirs
:
[
"~/Projects/智能体-scripts/技能"
,
"~/Projects/oss/some-skill-pack/技能"
]
,
watch
:
true
,
watchDebounceMs
:
250
,
}
,
安装
:
{
preferBrew
:
true
,
nodeManager
:
"npm"
,
// npm | pnpm | yarn | bun (网关 运行时 still Node; bun not recommended)
}
,
entries
:
{
"nano-banana-pro"
:
{
enabled
:
true
,
apiKey
:
"GEMINI_KEY_HERE"
,
env
:
{
GEMINI_API_KEY
:
"GEMINI_KEY_HERE"
,
}
,
}
,
peekaboo
:
{
enabled
:
true
}
,
sag
:
{
enabled
:
false
}
,
}
,
}
,
}
​
Fields
allowBundled
: optional allowlist for
bundled
技能 only. When set, only
bundled 技能在the list are eligible (managed/工作空间 技能 unaffected).
load.extraDirs
: additional skill directories到scan (lowest precedence).
load.watch
: watch skill folders与refresh the 技能 snapshot (default: true).
load.watchDebounceMs
: debounce为skill watcher events在milliseconds (default: 250).
安装.preferBrew
: prefer brew installers when available (default: true).
安装.nodeManager
: node installer preference (
npm
|
pnpm
|
yarn
|
bun
, default: npm).
This only affects
skill installs
; the 网关 运行时 should still be Node
(Bun not recommended为WhatsApp/Telegram).
entries.<skillKey>
: per-skill overrides.
Per-skill fields:
enabled
: set
false
to disable a skill even if it’s bundled/installed.
env
: environment variables injected为the 智能体 run (only if not already set).
apiKey
: optional convenience为技能那declare a primary env var.
​
Notes
Keys under
entries
map到the skill name通过default. If a skill defines
metadata.OpenClaw.skillKey
, use那key instead.
Changes到技能 are picked up在the next 智能体 turn when the watcher is enabled.
​
Sandboxed 技能 + env vars
When a 会话 is
sandboxed
, skill processes run inside Docker. The sandbox
does
not
inherit the host
进程.env
.
Use one of:
智能体.defaults.sandbox.docker.env
(or per-智能体
智能体.list[].sandbox.docker.env
)
bake the env into your custom sandbox image
Global
env
and
技能.entries.<skill>.env/apiKey
apply to
host
runs only.
技能
ClawHub
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/技能-config)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*