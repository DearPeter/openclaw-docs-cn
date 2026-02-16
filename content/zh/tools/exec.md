# 执行 工具 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
执行 工具
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
执行 工具
Parameters
Config
PATH handling
会话 overrides (/执行)
授权 模型
执行 approvals (companion app / node host)
Allowlist + safe bins
Examples
apply_patch (experimental)
​
执行 工具
Run shell commands在the 工作空间. Supports foreground + background execution via
进程
.
If
进程
is disallowed,
执行
runs synchronously与ignores
yieldMs
/
background
.
Background sessions are scoped per 智能体;
进程
only sees sessions从the same 智能体.
​
Parameters
command
(required)
workdir
(defaults到cwd)
env
(key/value overrides)
yieldMs
(default 10000): auto-background after delay
background
(bool): background immediately
timeout
(seconds, default 1800): kill在expiry
pty
(bool): run在a pseudo-terminal when available (TTY-only CLIs, coding 智能体, terminal UIs)
host
(
sandbox | 网关 | 节点
): where到execute
security
(
deny | allowlist | full
): enforcement mode for
网关
/
节点
ask
(
off | on-miss | always
): approval prompts for
网关
/
节点
节点
(string): node id/name for
host=节点
elevated
(bool): request elevated mode (网关 host);
security=full
is only forced when elevated resolves to
full
Notes:
host
defaults to
sandbox
.
elevated
is ignored when sandboxing is off (执行 already runs在the host).
网关
/
节点
approvals are controlled by
~/.OpenClaw/执行-approvals.JSON
.
节点
requires a paired 节点 (companion app或headless 节点 host).
If multiple 节点 are available, set
执行.节点
or
工具.执行.节点
to select one.
On non-Windows hosts, 执行 uses
SHELL
when set; if
SHELL
is
fish
, it prefers
bash
(or
sh
)
from
PATH
to avoid fish-incompatible scripts, then falls back to
SHELL
if neither exists.
Host execution (
网关
/
节点
) rejects
env.PATH
and loader overrides (
LD_*
/
DYLD_*
) to
prevent binary hijacking或injected code.
重要： sandboxing is
off通过default
. If sandboxing is off,
host=sandbox
runs directly on
the 网关 host (no 容器) and
does not require approvals
. To require approvals, run with
host=网关
and 配置 执行 approvals (or enable sandboxing).
​
Config
工具.执行.notifyOnExit
(default: true): when true, backgrounded 执行 sessions enqueue a system event与request a heartbeat在exit.
工具.执行.approvalRunningNoticeMs
(default: 10000): emit a single “运行” notice when an approval-gated 执行 runs longer than这(0 disables).
工具.执行.host
(default:
sandbox
)
工具.执行.security
(default:
deny
for sandbox,
allowlist
for 网关 + 节点 when unset)
工具.执行.ask
(default:
on-miss
)
工具.执行.节点
(default: unset)
工具.执行.pathPrepend
: list的directories到prepend to
PATH
for 执行 runs.
工具.执行.safeBins
: stdin-only safe binaries那can run without explicit allowlist entries.
示例：
Copy
{
工具
:
{
执行
:
{
pathPrepend
:
[
"~/bin"
,
"/opt/oss/bin"
]
,
}
,
}
,
}
​
PATH handling
host=网关
: merges your 登录-shell
PATH
into the 执行 environment.
env.PATH
overrides are
rejected为host execution. The daemon itself still runs使用a minimal
PATH
:
macOS:
/opt/homebrew/bin
,
/usr/local/bin
,
/usr/bin
,
/bin
Linux:
/usr/local/bin
,
/usr/bin
,
/bin
host=sandbox
: runs
sh -lc
(登录 shell) inside the 容器, so
/etc/profile
may reset
PATH
.
OpenClaw prepends
env.PATH
after profile sourcing via an internal env var (no shell interpolation);
工具.执行.pathPrepend
applies here too.
host=节点
: only non-blocked env overrides you pass are sent到the 节点.
env.PATH
overrides are
rejected为host execution. Headless 节点 hosts accept
PATH
only when it prepends the 节点 host
PATH (no replacement). macOS 节点 drop
PATH
overrides entirely.
Per-智能体 节点 binding (use the 智能体 list index在config):
Copy
OpenClaw
config
get
智能体.list
OpenClaw
config
set
智能体.list[0].工具.执行.节点
"节点-id-or-name"
控制 UI: the 节点 tab includes a small “执行 节点 binding” panel为the same settings.
​
会话 overrides (
/执行
)
Use
/执行
to set
per-会话
defaults for
host
,
security
,
ask
, and
节点
.
Send
/执行
with no arguments到show the current values.
示例：
Copy
/执行 host=网关 security=allowlist ask=on-miss node=mac-1
​
授权 模型
/执行
is only honored for
authorized senders
(频道 allowlists/pairing plus
commands.useAccessGroups
).
It updates
会话 state only
and does not write config. To hard-disable 执行, deny it via 工具
policy (
工具.deny: ["执行"]
or per-智能体). Host approvals still apply unless you explicitly set
security=full
and
ask=off
.
​
执行 approvals (companion app / node host)
Sandboxed 智能体 can require per-request approval before
执行
runs在the 网关或节点 host.
See
执行 approvals
for the policy, allowlist,与UI flow.
When approvals are required, the 执行 工具 returns immediately with
status: "approval-pending"
and an approval id. Once approved (or denied / timed out),
the 网关 emits system events (
执行 finished
/
执行 denied
). If the command is still
运行 after
工具.执行.approvalRunningNoticeMs
, a single
执行 运行
notice is emitted.
​
Allowlist + safe bins
Allowlist enforcement matches
resolved binary paths only
(no basename matches). When
security=allowlist
, shell commands are auto-allowed only if every pipeline segment is
allowlisted或a safe bin. Chaining (
;
,
&&
,
||
)与redirections are rejected in
allowlist mode.
​
Examples
Foreground:
Copy
{
"工具"
:
"执行"
,
"command"
:
"ls -la"
}
Background + poll:
Copy
{
"工具"
:
"执行"
,
"command"
:
"npm run 构建"
,
"yieldMs"
:
1000
}
{
"工具"
:
"进程"
,
"action"
:
"poll"
,
"sessionId"
:
"<id>"
}
Send keys (tmux-style):
Copy
{
"工具"
:
"进程"
,
"action"
:
"send-keys"
,
"sessionId"
:
"<id>"
,
"keys"
:
[
"Enter"
]}
{
"工具"
:
"进程"
,
"action"
:
"send-keys"
,
"sessionId"
:
"<id>"
,
"keys"
:
[
"C-c"
]}
{
"工具"
:
"进程"
,
"action"
:
"send-keys"
,
"sessionId"
:
"<id>"
,
"keys"
:
[
"Up"
,
"Up"
,
"Enter"
]}
Submit (send CR only):
Copy
{
"工具"
:
"进程"
,
"action"
:
"submit"
,
"sessionId"
:
"<id>"
}
Paste (bracketed通过default):
Copy
{
"工具"
:
"进程"
,
"action"
:
"paste"
,
"sessionId"
:
"<id>"
,
"text"
:
"line1\nline2\n"
}
​
apply_patch (experimental)
apply_patch
is a subtool of
执行
for structured multi-file edits.
Enable it explicitly:
Copy
{
工具
:
{
执行
:
{
applyPatch
:
{
enabled
:
true
,
allow模型
:
[
"gpt-5.2"
] }
,
}
,
}
,
}
Notes:
Only available为OpenAI/OpenAI Codex 模型.
工具 policy still applies;
allow: ["执行"]
implicitly allows
apply_patch
.
Config lives under
工具.执行.applyPatch
.
LLM任务
网页 工具
I
[查看英文原版](https://docs.OpenClaw.ai/工具/执行)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*