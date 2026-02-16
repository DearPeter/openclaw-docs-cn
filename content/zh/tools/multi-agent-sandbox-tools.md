# 多代理 Sandbox & 工具 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
智能体 coordination
Multi-智能体 Sandbox & 工具
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
Multi-智能体 Sandbox & 工具 配置
概述
配置 Examples
Example 1: Personal + Restricted Family 智能体
Example 2: Work 代理使用Shared Sandbox
Example 2b: Global coding profile + messaging-only 智能体
Example 3: Different Sandbox Modes per 智能体
配置 Precedence
Sandbox Config
工具 Restrictions
工具 groups (shorthands)
Elevated Mode
迁移从Single 智能体
工具 Restriction Examples
Read-only 智能体
Safe Execution 智能体 (no file modifications)
Communication-only 智能体
Common Pitfall: “non-main”
Testing
Troubleshooting
智能体 not sandboxed despite mode: "all"
工具 still available despite deny list
容器 not isolated per 智能体
See Also
​
Multi-智能体 Sandbox & 工具 配置
​
概述
Each 代理在a multi-智能体 设置 can now have its own:
Sandbox 配置
(
智能体.list[].sandbox
overrides
智能体.defaults.sandbox
)
工具 restrictions
(
工具.allow
/
工具.deny
, plus
智能体.list[].工具
)
This allows you到run multiple 代理使用different security profiles:
Personal assistant使用full access
Family/work Agent使用restricted 工具
Public-facing 代理在sandboxes
setupCommand
belongs under
sandbox.Docker
(global或per-智能体)与runs once
when the 容器 is created.
Auth is per-智能体: each 智能体 reads从its own
agentDir
auth store at:
Copy
~/.OpenClaw/智能体/<agentId>/智能体/auth-profiles.JSON
Credentials are
not
shared between 智能体. Never reuse
agentDir
across 智能体.
If you want到share creds, copy
auth-profiles.JSON
into the other 智能体’s
agentDir
.
For how sandboxing behaves在runtime, see
Sandboxing
.
For 调试 “why is这blocked?”, see
Sandbox vs 工具 Policy vs Elevated
and
OpenClaw sandbox explain
.
​
配置 Examples
​
Example 1: Personal + Restricted Family 智能体
Copy
{
"智能体"
:
{
"list"
:
[
{
"id"
:
"main"
,
"default"
:
true
,
"name"
:
"Personal Assistant"
,
"工作空间"
:
"~/.OpenClaw/工作空间"
,
"sandbox"
:
{
"mode"
:
"off"
}
}
,
{
"id"
:
"family"
,
"name"
:
"Family Bot"
,
"工作空间"
:
"~/.OpenClaw/工作空间-family"
,
"sandbox"
:
{
"mode"
:
"all"
,
"scope"
:
"智能体"
}
,
"工具"
:
{
"allow"
:
[
"read"
]
,
"deny"
:
[
"执行"
,
"write"
,
"edit"
,
"apply_patch"
,
"进程"
,
"浏览器"
]
}
}
]
}
,
"bindings"
:
[
{
"agentId"
:
"family"
,
"match"
:
{
"provider"
:
"WhatsApp"
,
"accountId"
:
"*"
,
"peer"
:
{
"kind"
:
"group"
,
"id"
:
"
[email protected]
"
}
}
}
]
}
Result:
main
智能体: Runs在host, full 工具 access
family
智能体: Runs在Docker (one 容器 per 智能体), only
read
工具
​
Example 2: Work 代理使用Shared Sandbox
Copy
{
"智能体"
:
{
"list"
:
[
{
"id"
:
"personal"
,
"工作空间"
:
"~/.OpenClaw/工作空间-personal"
,
"sandbox"
:
{
"mode"
:
"off"
}
}
,
{
"id"
:
"work"
,
"工作空间"
:
"~/.OpenClaw/工作空间-work"
,
"sandbox"
:
{
"mode"
:
"all"
,
"scope"
:
"shared"
,
"workspaceRoot"
:
"/tmp/work-sandboxes"
}
,
"工具"
:
{
"allow"
:
[
"read"
,
"write"
,
"apply_patch"
,
"执行"
]
,
"deny"
:
[
"浏览器"
,
"网关"
,
"Discord"
]
}
}
]
}
}
​
Example 2b: Global coding profile + messaging-only 智能体
Copy
{
"工具"
:
{
"profile"
:
"coding"
}
,
"智能体"
:
{
"list"
:
[
{
"id"
:
"support"
,
"工具"
:
{
"profile"
:
"messaging"
,
"allow"
:
[
"Slack"
] }
}
]
}
}
Result:
default 智能体 get coding 工具
support
智能体 is messaging-only (+ Slack 工具)
​
Example 3: Different Sandbox Modes per 智能体
Copy
{
"智能体"
:
{
"defaults"
:
{
"sandbox"
:
{
"mode"
:
"non-main"
,
// Global default
"scope"
:
"会话"
}
}
,
"list"
:
[
{
"id"
:
"main"
,
"工作空间"
:
"~/.OpenClaw/工作空间"
,
"sandbox"
:
{
"mode"
:
"off"
// Override: main never sandboxed
}
}
,
{
"id"
:
"public"
,
"工作空间"
:
"~/.OpenClaw/工作空间-public"
,
"sandbox"
:
{
"mode"
:
"all"
,
// Override: public always sandboxed
"scope"
:
"智能体"
}
,
"工具"
:
{
"allow"
:
[
"read"
]
,
"deny"
:
[
"执行"
,
"write"
,
"edit"
,
"apply_patch"
]
}
}
]
}
}
​
配置 Precedence
When both global (
智能体.defaults.*
)与代理-specific (
智能体.list[].*
) configs exist:
​
Sandbox Config
智能体-specific settings override global:
Copy
智能体.list[].sandbox.mode > 智能体.defaults.sandbox.mode
智能体.list[].sandbox.scope > 智能体.defaults.sandbox.scope
智能体.list[].sandbox.workspaceRoot > 智能体.defaults.sandbox.workspaceRoot
智能体.list[].sandbox.workspaceAccess > 智能体.defaults.sandbox.workspaceAccess
智能体.list[].sandbox.Docker.* > 智能体.defaults.sandbox.Docker.*
智能体.list[].sandbox.浏览器.* > 智能体.defaults.sandbox.浏览器.*
智能体.list[].sandbox.prune.* > 智能体.defaults.sandbox.prune.*
Notes:
智能体.list[].sandbox.{Docker,浏览器,prune}.*
overrides
智能体.defaults.sandbox.{Docker,浏览器,prune}.*
for那代理 (ignored when sandbox scope resolves to
"shared"
).
​
工具 Restrictions
The filtering order is:
工具 profile
(
工具.profile
or
智能体.list[].工具.profile
)
Provider 工具 profile
(
工具.byProvider[provider].profile
or
智能体.list[].工具.byProvider[provider].profile
)
Global 工具 policy
(
工具.allow
/
工具.deny
)
Provider 工具 policy
(
工具.byProvider[provider].allow/deny
)
智能体-specific 工具 policy
(
智能体.list[].工具.allow/deny
)
智能体 provider policy
(
智能体.list[].工具.byProvider[provider].allow/deny
)
Sandbox 工具 policy
(
工具.sandbox.工具
or
智能体.list[].工具.sandbox.工具
)
Subagent 工具 policy
(
工具.subagents.工具
, if applicable)
Each level can further restrict 工具, but cannot grant back denied 工具从earlier levels.
If
智能体.list[].工具.sandbox.工具
is set, it replaces
工具.sandbox.工具
for那代理.
If
智能体.list[].工具.profile
is set, it overrides
工具.profile
for那代理.
Provider 工具 keys accept either
provider
(e.g.
google-antigravity
) or
provider/模型
(e.g.
openai/gpt-5.2
).
​
工具 groups (shorthands)
工具 policies (global, 智能体, sandbox) support
group:*
entries那expand到multiple concrete 工具:
group:运行时
:
执行
,
bash
,
进程
group:fs
:
read
,
write
,
edit
,
apply_patch
group:sessions
:
sessions_list
,
sessions_history
,
sessions_send
,
sessions_spawn
,
会话_status
group:记忆
:
记忆_search
,
记忆_get
group:ui
:
浏览器
,
画布
group:automation
:
cron
,
网关
group:messaging
:
消息
group:节点
:
节点
group:OpenClaw
: all built-in OpenClaw 工具 (excludes provider plugins)
​
Elevated Mode
工具.elevated
is the global baseline (sender-based allowlist).
智能体.list[].工具.elevated
can further restrict elevated为specific 智能体 (both must allow).
Mitigation patterns:
Deny
执行
for untrusted 智能体 (
智能体.list[].工具.deny: ["执行"]
)
Avoid allowlisting senders那route到restricted 智能体
Disable elevated globally (
工具.elevated.enabled: false
) if you only want sandboxed execution
Disable elevated per 智能体 (
智能体.list[].工具.elevated.enabled: false
)为sensitive profiles
​
迁移从Single 智能体
Before (single 智能体):
Copy
{
"智能体"
:
{
"defaults"
:
{
"工作空间"
:
"~/.OpenClaw/工作空间"
,
"sandbox"
:
{
"mode"
:
"non-main"
}
}
}
,
"工具"
:
{
"sandbox"
:
{
"工具"
:
{
"allow"
:
[
"read"
,
"write"
,
"apply_patch"
,
"执行"
]
,
"deny"
:
[]
}
}
}
}
After (多代理使用different profiles):
Copy
{
"智能体"
:
{
"list"
:
[
{
"id"
:
"main"
,
"default"
:
true
,
"工作空间"
:
"~/.OpenClaw/工作空间"
,
"sandbox"
:
{
"mode"
:
"off"
}
}
]
}
}
Legacy
智能体.*
configs are migrated by
OpenClaw doctor
; prefer
智能体.defaults
+
智能体.list
going forward.
​
工具 Restriction Examples
​
Read-only 智能体
Copy
{
"工具"
:
{
"allow"
:
[
"read"
]
,
"deny"
:
[
"执行"
,
"write"
,
"edit"
,
"apply_patch"
,
"进程"
]
}
}
​
Safe Execution 智能体 (no file modifications)
Copy
{
"工具"
:
{
"allow"
:
[
"read"
,
"执行"
,
"进程"
]
,
"deny"
:
[
"write"
,
"edit"
,
"apply_patch"
,
"浏览器"
,
"网关"
]
}
}
​
Communication-only 智能体
Copy
{
"工具"
:
{
"allow"
:
[
"sessions_list"
,
"sessions_send"
,
"sessions_history"
,
"会话_status"
]
,
"deny"
:
[
"执行"
,
"write"
,
"edit"
,
"apply_patch"
,
"read"
,
"浏览器"
]
}
}
​
Common Pitfall: “non-main”
智能体.defaults.sandbox.mode: "non-main"
is based on
会话.mainKey
(default
"main"
),
not the 智能体 id. Group/频道 sessions always get their own keys, so they
are treated as non-main与will be sandboxed. If you want an 代理到never
sandbox, set
智能体.list[].sandbox.mode: "off"
.
​
Testing
After configuring multi-智能体 sandbox与工具:
Check 智能体 resolution:
Copy
OpenClaw 智能体 list --bindings
Verify sandbox containers:
Copy
Docker ps --filter "name=OpenClaw-sbx-"
测试 工具 restrictions:
Send a 消息 requiring restricted 工具
Verify the 智能体 cannot use denied 工具
Monitor logs:
Copy
tail -f "${OPENCLAW_STATE_DIR:-$HOME/.OpenClaw}/logs/网关.log" | grep -E "routing|sandbox|工具"
​
Troubleshooting
​
智能体 not sandboxed despite
mode: "all"
Check if there’s a global
智能体.defaults.sandbox.mode
that overrides it
智能体-specific config takes precedence, so set
智能体.list[].sandbox.mode: "all"
​
工具 still available despite deny list
Check 工具 filtering order: global → 智能体 → sandbox → subagent
Each level can only further restrict, not grant back
Verify使用logs:
[工具] filtering 工具为代理:${agentId}
​
容器 not isolated per 智能体
Set
scope: "智能体"
in 智能体-specific sandbox config
Default is
"会话"
which creates one 容器 per 会话
​
See Also
多代理路由
Sandbox 配置
会话管理
Sub-智能体
Slash Commands
I
[查看英文原版](https://docs.OpenClaw.ai/工具/multi-智能体-sandbox-工具)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*