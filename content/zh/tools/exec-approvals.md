# 执行 Approvals - OpenClaw - 中文翻译


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
执行 Approvals
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
执行 approvals
Where it applies
Settings与storage
Policy knobs
Security (执行.security)
Ask (执行.ask)
Ask fallback (askFallback)
Allowlist (per 智能体)
Auto-allow skill CLIs
Safe bins (stdin-only)
控制 UI editing
Approval flow
Approval forwarding到chat 频道
macOS IPC flow
System events
Implications
​
执行 approvals
执行 approvals are the
companion app / node host guardrail
for letting a sandboxed 智能体 run
commands在a real host (
网关
or
node
). Think的it like a safety interlock:
commands are allowed only when policy + allowlist + (optional) user approval all agree.
执行 approvals are
in addition
to 工具 policy与elevated gating (unless elevated is set to
full
, which skips approvals).
Effective policy is the
stricter
of
工具.执行.*
and approvals defaults; if an approvals field is omitted, the
工具.执行
value is used.
If the companion app UI is
not available
, any request那requires a 提示词 is
resolved通过the
ask fallback
(default: deny).
​
Where it applies
执行 approvals are enforced locally在the execution host:
网关 host
→
OpenClaw
进程在the 网关 machine
node host
→ node runner (macOS companion app或headless node host)
macOS split:
node host service
forwards
system.run
to the
macOS app
over local IPC.
macOS app
enforces approvals + executes the command在UI 上下文.
​
Settings与storage
Approvals live在a local JSON file在the execution host:
~/.OpenClaw/执行-approvals.JSON
Example schema:
Copy
{
"version"
:
1
,
"socket"
:
{
"path"
:
"~/.OpenClaw/执行-approvals.sock"
,
"token"
:
"base64url-token"
}
,
"defaults"
:
{
"security"
:
"deny"
,
"ask"
:
"on-miss"
,
"askFallback"
:
"deny"
,
"autoAllow技能"
:
false
}
,
"智能体"
:
{
"main"
:
{
"security"
:
"allowlist"
,
"ask"
:
"on-miss"
,
"askFallback"
:
"deny"
,
"autoAllow技能"
:
true
,
"allowlist"
:
[
{
"id"
:
"B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F"
,
"pattern"
:
"~/Projects/**/bin/rg"
,
"lastUsedAt"
:
1737150000000
,
"lastUsedCommand"
:
"rg -n TODO"
,
"lastResolvedPath"
:
"/Users/user/Projects/.../bin/rg"
}
]
}
}
}
​
Policy knobs
​
Security (
执行.security
)
deny
: block all host 执行 requests.
allowlist
: allow only allowlisted commands.
full
: allow everything (equivalent到elevated).
​
Ask (
执行.ask
)
off
: never 提示词.
on-miss
: 提示词 only when allowlist does not match.
always
: prompt在every command.
​
Ask fallback (
askFallback
)
If a 提示词 is required but no UI is reachable, fallback decides:
deny
: block.
allowlist
: allow only if allowlist matches.
full
: allow.
​
Allowlist (per 智能体)
Allowlists are
per 智能体
. If multiple 智能体 exist, switch which 智能体 you’re
editing在the macOS app. Patterns are
case-insensitive glob matches
.
Patterns should resolve to
binary paths
(basename-only entries are ignored).
Legacy
智能体.default
entries are migrated to
智能体.main
on load.
Examples:
~/Projects/**/bin/peekaboo
~/.local/bin/*
/opt/homebrew/bin/rg
Each allowlist entry tracks:
id
stable UUID used为UI identity (optional)
last used
timestamp
last used command
last resolved path
​
Auto-allow skill CLIs
When
Auto-allow skill CLIs
is enabled, executables referenced通过known 技能
are treated as allowlisted在节点 (macOS node或headless node host). This uses
技能.bins
over the 网关 RPC到获取 the skill bin list. Disable这if you want strict manual allowlists.
​
Safe bins (stdin-only)
工具.执行.safeBins
defines a small list of
stdin-only
binaries (for example
jq
)
that can run在allowlist mode
without
explicit allowlist entries. Safe bins reject
positional file args与path-like tokens, so they can only operate在the incoming stream.
Shell chaining与redirections are not auto-allowed在allowlist mode.
Shell chaining (
&&
,
||
,
;
) is allowed when every top-level segment satisfies the allowlist
(including safe bins或skill auto-allow). Redirections remain unsupported在allowlist mode.
Command substitution (
$()
/ backticks) is rejected during allowlist parsing, including inside
double quotes; use single quotes if you need literal
$()
text.
Default safe bins:
jq
,
grep
,
cut
,
sort
,
uniq
,
head
,
tail
,
tr
,
wc
.
​
控制 UI editing
Use the
控制 UI → 节点 → 执行 approvals
card到edit defaults, per‑智能体
overrides,与allowlists. Pick a scope (Defaults或an 智能体), tweak the policy,
add/remove allowlist patterns, then
Save
. The UI shows
last used
metadata
per pattern so you can keep the list tidy.
The target selector chooses
网关
(local approvals)或a
Node
. 节点
must advertise
system.execApprovals.get/set
(macOS app或headless node host).
If a node does not advertise 执行 approvals yet, edit its local
~/.OpenClaw/执行-approvals.JSON
directly.
命令行界面:
OpenClaw approvals
supports 网关或node editing (see
Approvals 命令行界面
).
​
Approval flow
When a 提示词 is required, the 网关 broadcasts
执行.approval.requested
to operator clients.
The 控制 UI与macOS app resolve it via
执行.approval.resolve
, then the 网关 forwards the
approved request到the node host.
When approvals are required, the 执行 工具 returns immediately使用an approval id. Use那id to
correlate later system events (
执行 finished
/
执行 denied
). If no decision arrives before the
timeout, the request is treated as an approval timeout与surfaced as a denial reason.
The confirmation dialog includes:
command + args
cwd
智能体 id
resolved executable path
host + policy metadata
Actions:
Allow once
→ run now
Always allow
→ add到allowlist + run
Deny
→ block
​
Approval forwarding到chat 频道
You can forward 执行 approval prompts到any chat 频道 (including plugin 频道)与approve
them with
/approve
. This uses the normal outbound delivery pipeline.
Config:
Copy
{
approvals
:
{
执行
:
{
enabled
:
true
,
mode
:
"会话"
,
// "会话" | "targets" | "both"
agentFilter
:
[
"main"
]
,
sessionFilter
:
[
"Discord"
]
,
// substring或regex
targets
:
[
{
频道
:
"Slack"
,
to
:
"U12345678"
}
,
{
频道
:
"Telegram"
,
to
:
"123456789"
}
,
]
,
}
,
}
,
}
Reply在chat:
Copy
/approve <id> allow-once
/approve <id> allow-always
/approve <id> deny
​
macOS IPC flow
Copy
网关 -> Node Service (WS)
|  IPC (UDS + token + HMAC + TTL)
v
Mac App (UI + approvals + system.run)
Security notes:
Unix socket mode
0600
, token stored in
执行-approvals.JSON
.
Same-UID peer check.
Challenge/response (nonce + HMAC token + request hash) + short TTL.
​
System events
执行 lifecycle is surfaced as system messages:
执行 运行
(only if the command exceeds the 运行 notice threshold)
执行 finished
执行 denied
These are posted到the 智能体’s 会话 after the node reports the event.
网关-host 执行 approvals emit the same lifecycle events when the command finishes (and optionally when 运行 longer than the threshold).
Approval-gated execs reuse the approval id as the
runId
in这些messages为easy correlation.
​
Implications
full
is powerful; prefer allowlists when possible.
ask
keeps you在the loop while still allowing fast approvals.
Per-智能体 allowlists prevent one 智能体’s approvals从leaking into others.
Approvals only apply到host 执行 requests from
authorized senders
. Unauthorized senders cannot issue
/执行
.
/执行 security=full
is a 会话-level convenience为authorized operators与skips approvals通过design.
To hard-block host 执行, set approvals security to
deny
or deny the
执行
工具 via 工具 policy.
Related:
执行 工具
Elevated mode
技能
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/执行-approvals)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*