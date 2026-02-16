# 技能 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
技能
技能
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
技能 (OpenClaw)
Locations与precedence
Per-智能体 vs shared 技能
Plugins + 技能
ClawHub (安装 + sync)
Security notes
Format (代理技能 + Pi-compatible)
Gating (load-time filters)
Config overrides (~/.OpenClaw/OpenClaw.JSON)
Environment injection (per 智能体 run)
会话 snapshot (性能)
Remote macOS 节点 (Linux 网关)
技能 watcher (auto-refresh)
令牌 impact (技能 list)
Managed 技能 lifecycle
Config 参考
Looking为more 技能?
​
技能 (OpenClaw)
OpenClaw uses
代理技能
-compatible
skill folders到teach the 智能体 how到use 工具. Each skill is a directory containing a
SKILL.md
with YAML frontmatter与instructions. OpenClaw loads
bundled 技能
plus optional local overrides,与filters them在load time based在environment, config,与binary 在线状态.
​
Locations与precedence
技能 are loaded from
three
places:
Bundled 技能
: shipped使用the 安装 (npm 包或OpenClaw.app)
Managed/local 技能
:
~/.OpenClaw/技能
工作空间 技能
:
<工作空间>/技能
If a skill name conflicts, precedence is:
<工作空间>/技能
(highest) →
~/.OpenClaw/技能
→ bundled 技能 (lowest)
Additionally, you can 配置 extra skill folders (lowest precedence) via
技能.load.extraDirs
in
~/.OpenClaw/OpenClaw.JSON
.
​
Per-智能体 vs shared 技能
In
multi-智能体
setups, each 智能体 has its own 工作空间. That means:
Per-智能体 技能
live in
<工作空间>/技能
for那代理 only.
Shared 技能
live in
~/.OpenClaw/技能
(managed/local)与are visible
to
all 智能体
on the same machine.
Shared folders
can also be added via
技能.load.extraDirs
(lowest
precedence) if you want a common 技能 pack used通过multiple 智能体.
If the same skill name exists在more than one place, the usual precedence
applies: 工作空间 wins, then managed/local, then bundled.
​
Plugins + 技能
Plugins can ship their own 技能通过listing
技能
directories in
OpenClaw.plugin.JSON
(paths relative到the plugin root). Plugin 技能 load
when the plugin is enabled与participate在the normal skill precedence rules.
You can gate them via
metadata.OpenClaw.requires.config
on the plugin’s config
entry. See
Plugins
for discovery/config and
工具
for the
工具 surface那些技能 teach.
​
ClawHub (安装 + sync)
ClawHub is the public 技能 registry为OpenClaw. Browse at
https://clawhub.com
. Use it到discover, 安装, update,与back up 技能.
Full guide:
ClawHub
.
Common flows:
安装 a skill into your 工作空间:
clawhub 安装 <skill-slug>
Update all installed 技能:
clawhub update --all
Sync (scan + publish updates):
clawhub sync --all
By default,
clawhub
installs into
./技能
under your current working
directory (or falls back到the configured OpenClaw 工作空间). OpenClaw picks
that up as
<工作空间>/技能
on the next 会话.
​
Security notes
Treat third-party 技能 as
untrusted code
. Read them before enabling.
Prefer sandboxed runs为untrusted inputs与risky 工具. See
Sandboxing
.
技能.entries.*.env
and
技能.entries.*.apiKey
inject secrets into the
host
进程
for那代理 turn (not the sandbox). Keep secrets out的prompts与logs.
For a broader threat model与checklists, see
Security
.
​
Format (代理技能 + Pi-compatible)
SKILL.md
must include在least:
Copy
name
:
nano-banana-pro
description
:
Generate或edit images via Gemini 3 Pro Image
Notes:
We follow the Agent技能 spec为layout/intent.
The parser used通过the embedded 智能体 supports
single-line
frontmatter keys only.
metadata
should be a
single-line JSON object
.
Use
{baseDir}
in instructions到参考 the skill folder path.
Optional frontmatter keys:
homepage
— URL surfaced as “Website”在the macOS 技能 UI (also supported via
metadata.OpenClaw.homepage
).
user-invocable
—
true|false
(default:
true
). When
true
, the skill is exposed as a user slash command.
disable-模型-invocation
—
true|false
(default:
false
). When
true
, the skill is excluded从the 模型 提示词 (still available via user invocation).
command-dispatch
—
工具
(optional). When set to
工具
, the slash command bypasses the model与dispatches directly到a 工具.
command-工具
— 工具 name到invoke when
command-dispatch: 工具
is set.
command-arg-mode
—
raw
(default). For 工具 dispatch, forwards the raw args string到the 工具 (no core parsing).
The 工具 is invoked使用params:
{ command: "<raw args>", commandName: "<slash command>", skillName: "<skill name>" }
.
​
Gating (load-time filters)
OpenClaw
filters 技能在load time
using
metadata
(single-line JSON):
Copy
name
:
nano-banana-pro
description
:
Generate或edit images via Gemini 3 Pro Image
metadata
:
{
"OpenClaw"
:
{
"requires"
:
{
"bins"
:
[
"uv"
]
,
"env"
:
[
"GEMINI_API_KEY"
]
,
"config"
:
[
"浏览器.enabled"
] }
,
"primaryEnv"
:
"GEMINI_API_KEY"
,
}
,
}
Fields under
metadata.OpenClaw
:
always: true
— always include the skill (skip other gates).
emoji
— optional emoji used通过the macOS 技能 UI.
homepage
— optional URL shown as “Website”在the macOS 技能 UI.
os
— optional list的平台 (
darwin
,
linux
,
win32
). If set, the skill is only eligible在those OSes.
requires.bins
— list; each must exist on
PATH
.
requires.anyBins
— list;在least one must exist on
PATH
.
requires.env
— list; env var must exist
or
be provided在config.
requires.config
— list of
OpenClaw.JSON
paths那must be truthy.
primaryEnv
— env var name associated with
技能.entries.<name>.apiKey
.
安装
— optional array的installer specs used通过the macOS 技能 UI (brew/node/go/uv/download).
Note在sandboxing:
requires.bins
is checked在the
host
at skill load time.
If an 智能体 is sandboxed, the binary must also exist
inside the 容器
.
安装 it via
智能体.defaults.sandbox.Docker.setupCommand
(or a custom image).
setupCommand
runs once after the 容器 is created.
包 installs also require network egress, a writable root FS,与a root user在the sandbox.
示例： the
summarize
skill (
技能/summarize/SKILL.md
) needs the
summarize
命令行界面
in the sandbox 容器到run there.
安装er example:
Copy
name
:
gemini
description
:
Use Gemini 命令行界面为coding assistance与Google 搜索 lookups.
metadata
:
{
"OpenClaw"
:
{
"emoji"
:
"♊️"
,
"requires"
:
{
"bins"
:
[
"gemini"
] }
,
"安装"
:
[
{
"id"
:
"brew"
,
"kind"
:
"brew"
,
"formula"
:
"gemini-命令行界面"
,
"bins"
:
[
"gemini"
]
,
"label"
:
"安装 Gemini 命令行界面 (brew)"
,
}
,
]
,
}
,
}
Notes:
If multiple installers are listed, the 网关 picks a
single
preferred option (brew when available, otherwise 节点).
If all installers are
download
, OpenClaw lists each entry so you can see the available artifacts.
安装er specs can include
os: ["darwin"|"linux"|"win32"]
to filter options通过platform.
节点 installs honor
技能.安装.nodeManager
in
OpenClaw.JSON
(default: npm; options: npm/pnpm/yarn/bun).
This only affects
skill installs
; the 网关 运行时 should still be 节点
(Bun is not recommended为WhatsApp/Telegram).
Go installs: if
go
is missing and
brew
is available, the 网关 installs Go via Homebrew first与sets
GOBIN
to Homebrew’s
bin
when possible.
Download installs:
url
(required),
archive
(
tar.gz
|
tar.bz2
|
zip
),
extract
(default: auto when archive detected),
stripComponents
,
targetDir
(default:
~/.OpenClaw/工具/<skillKey>
).
If no
metadata.OpenClaw
is present, the skill is always eligible (unless
disabled在config或blocked by
技能.allowBundled
for bundled 技能).
​
Config overrides (
~/.OpenClaw/OpenClaw.JSON
)
Bundled/managed 技能 can be toggled与supplied使用env values:
Copy
{
技能
:
{
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
config
:
{
端点
:
"https://example.invalid"
,
模型
:
"nano-pro"
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
Note: if the skill name contains hyphens, quote the key (JSON5 allows quoted keys).
Config keys match the
skill name
by default. If a skill defines
metadata.OpenClaw.skillKey
, use那key under
技能.entries
.
Rules:
enabled: false
disables the skill even if it’s bundled/installed.
env
: injected
only if
the variable isn’t already set在the 进程.
apiKey
: convenience为技能那declare
metadata.OpenClaw.primaryEnv
.
config
: optional bag为custom per-skill fields; custom keys must live here.
allowBundled
: optional allowlist for
bundled
技能 only. If set, only
bundled 技能在the list are eligible (managed/工作空间 技能 unaffected).
​
Environment injection (per 智能体 run)
When an 智能体 run starts, OpenClaw:
Reads skill metadata.
Applies any
技能.entries.<key>.env
or
技能.entries.<key>.apiKey
to
进程.env
.
Builds the system 提示词 with
eligible
技能.
Restores the original environment after the run ends.
这是
scoped到the 智能体 run
, not a global shell environment.
​
会话 snapshot (性能)
OpenClaw snapshots the eligible 技能
when a 会话 starts
and reuses那list为subsequent turns在the same 会话. Changes到技能或config take effect在the next new 会话.
技能 can also refresh mid-会话 when the 技能 watcher is enabled或when a new eligible remote 节点 appears (see below). Think的this as a
hot reload
: the refreshed list is picked up在the next 智能体 turn.
​
Remote macOS 节点 (Linux 网关)
If the 网关 is 运行在Linux but a
macOS 节点
is connected
with
system.run
allowed
(执行 approvals security not set to
deny
), OpenClaw can treat macOS-only 技能 as eligible when the required binaries are present在that 节点. The 智能体 should execute那些技能 via the
节点
工具 (typically
节点.run
).
This relies在the 节点 reporting its command support与on a bin probe via
system.run
. If the macOS 节点 goes offline later, the 技能 remain visible; invocations may fail until the 节点 reconnects.
​
技能 watcher (auto-refresh)
By default, OpenClaw watches skill folders与bumps the 技能 snapshot when
SKILL.md
files change. Configure这under
技能.load
:
Copy
{
技能
:
{
load
:
{
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
}
,
}
​
令牌 impact (技能 list)
When 技能 are eligible, OpenClaw injects a compact XML list的available 技能 into the system 提示词 (via
format技能ForPrompt
in
pi-coding-智能体
). The cost is deterministic:
Base overhead (only when ≥1 skill):
195 characters.
Per skill:
97 characters + the length的the XML-escaped
<name>
,
<description>
, and
<location>
values.
Formula (characters):
Copy
total = 195 + Σ (97 + len(name_escaped) + len(description_escaped) + len(location_escaped))
Notes:
XML escaping expands
& < > " '
into entities (
&amp;
,
&lt;
, etc.), increasing length.
Token counts vary通过model tokenizer. A rough OpenAI-style estimate is ~4 chars/token, so
97 chars ≈ 24 tokens
per skill plus your actual field lengths.
​
Managed 技能 lifecycle
OpenClaw ships a baseline set的技能 as
bundled 技能
as part的the
安装 (npm 包或OpenClaw.app).
~/.OpenClaw/技能
exists为local
overrides (for example, pinning/patching a skill without changing the bundled
copy). 工作空间 技能 are user-owned与override both在name conflicts.
​
Config 参考
See
技能 config
for the full 配置 schema.
​
Looking为more 技能?
Browse
https://clawhub.com
.
Slash Commands
技能 Config
I
[查看英文原版](https://docs.OpenClaw.ai/工具/技能)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*