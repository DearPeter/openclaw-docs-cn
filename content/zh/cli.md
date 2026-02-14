# 命令行界面 参考 - OpenClaw - 中文翻译


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
命令行界面 commands
命令行界面 参考
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
命令行界面 commands
命令行界面 参考
智能体
智能体
approvals
浏览器
频道
配置
cron
dashboard
directory
dns
docs
doctor
网关
health
hooks
logs
记忆
消息
模型
节点
onboard
pairing
plugins
reset
Sandbox 命令行界面
security
sessions
设置
技能
status
system
tui
uninstall
update
voicecall
RPC与API
RPC Adapters
Device 模型 Database
Templates
Default 智能体.md
智能体.md Template
BOOT.md Template
引导.md Template
HEARTBEAT.md Template
IDENTITY
SOUL.md Template
工具.md Template
USER
Technical 参考
向导 参考
Token Use与Costs
grammY
Concept internals
TypeBox
Markdown Formatting
Typing Indicators
Usage Tracking
Timezones
Project
Credits
Release notes
Release Checklist
Tests
Experiments
入门指南与Config Protocol
Cron Add Hardening
Telegram Allowlist Hardening
工作空间 记忆 Research
模型 Config Exploration
本页内容
命令行界面 参考
Command pages
Global flags
Output styling
Color palette
Command tree
Security
Plugins
记忆
Chat slash commands
设置 + 入门指南
设置
onboard
配置
config
doctor
频道 helpers
频道
技能
pairing
webhooks gmail
dns 设置
Messaging + 智能体
消息
智能体
智能体
智能体 list
智能体 add [name]
智能体 delete <id>
acp
status
Usage tracking
health
sessions
Reset / Uninstall
reset
uninstall
网关
网关
网关 service
logs
网关 <subcommand>
模型
模型 (root)
模型 list
模型 status
模型 set <模型>
模型 set-image <模型>
模型 aliases list|add|remove
模型 fallbacks list|add|remove|clear
模型 image-fallbacks list|add|remove|clear
模型 scan
模型 auth add|设置-token|paste-token
模型 auth order get|set|clear
System
system event
system heartbeat last|enable|disable
system 在线状态
Cron
Node host
节点
浏览器
Docs 搜索
docs [query...]
TUI
tui
​
命令行界面 参考
This page describes the current 命令行界面 behavior. If commands change, update这doc.
​
Command pages
设置
onboard
配置
config
doctor
dashboard
reset
uninstall
update
消息
智能体
智能体
acp
status
health
sessions
网关
logs
system
模型
记忆
节点
devices
node
approvals
sandbox
tui
浏览器
cron
dns
docs
hooks
webhooks
pairing
plugins
(plugin commands)
频道
security
技能
voicecall
(plugin; if installed)
​
Global flags
--dev
: isolate state under
~/.OpenClaw-dev
and shift default ports.
--profile <name>
: isolate state under
~/.OpenClaw-<name>
.
--no-color
: disable ANSI colors.
--update
: shorthand for
OpenClaw update
(source installs only).
-V
,
--version
,
-v
: print version与exit.
​
Output styling
ANSI colors与progress indicators only render在TTY sessions.
OSC-8 hyperlinks render as clickable links在supported terminals; otherwise we fall back到plain URLs.
--JSON
(and
--plain
where supported) disables styling为clean output.
--no-color
disables ANSI styling;
NO_COLOR=1
is also respected.
Long-运行 commands show a progress indicator (OSC 9;4 when supported).
​
Color palette
OpenClaw uses a lobster palette为命令行界面 output.
accent
(#FF5A2D): headings, labels, primary highlights.
accentBright
(#FF7A3D): command names, emphasis.
accentDim
(#D14A22): secondary highlight text.
info
(#FF8A5B): informational values.
success
(#2FBF71): success states.
warn
(#FFB020): warnings, fallbacks, attention.
error
(#E23D2D): errors, failures.
muted
(#8B7F77): de-emphasis, metadata.
Palette source的truth:
src/terminal/palette.ts
(aka “lobster seam”).
​
Command tree
Copy
OpenClaw [--dev] [--profile <name>] <command>
设置
onboard
配置
config
get
set
unset
doctor
security
audit
reset
uninstall
update
频道
list
status
logs
add
remove
登录
logout
技能
list
info
check
plugins
list
info
安装
enable
disable
doctor
记忆
status
index
搜索
消息
智能体
智能体
list
add
delete
acp
status
health
sessions
网关
call
health
status
probe
discover
安装
uninstall
start
stop
restart
run
logs
system
event
heartbeat last|enable|disable
在线状态
模型
list
status
set
set-image
aliases list|add|remove
fallbacks list|add|remove|clear
image-fallbacks list|add|remove|clear
scan
auth add|设置-token|paste-token
auth order get|set|clear
sandbox
list
recreate
explain
cron
status
list
add
edit
rm
enable
disable
runs
run
节点
devices
node
run
status
安装
uninstall
start
stop
restart
approvals
get
set
allowlist add|remove
浏览器
status
start
stop
reset-profile
tabs
open
focus
close
profiles
create-profile
delete-profile
screenshot
snapshot
navigate
resize
click
type
press
hover
drag
select
upload
fill
dialog
wait
evaluate
console
pdf
hooks
list
info
check
enable
disable
安装
update
webhooks
gmail 设置|run
pairing
list
approve
docs
dns
设置
tui
Note: plugins can add additional top-level commands (for example
OpenClaw voicecall
).
​
Security
OpenClaw security audit
— audit config + local state为common security foot-guns.
OpenClaw security audit --deep
— best-effort live 网关 probe.
OpenClaw security audit --fix
— tighten safe defaults与chmod state/config.
​
Plugins
Manage extensions与their config:
OpenClaw plugins list
— discover plugins (use
--JSON
for machine output).
OpenClaw plugins info <id>
— show details为a plugin.
OpenClaw plugins 安装 <path|.tgz|npm-spec>
— 安装 a plugin (or add a plugin path to
plugins.load.paths
).
OpenClaw plugins enable <id>
/
disable <id>
— toggle
plugins.entries.<id>.enabled
.
OpenClaw plugins doctor
— report plugin load errors.
Most plugin changes require a 网关 restart. See
/plugin
.
​
记忆
Vector 搜索 over
记忆.md
+
记忆/*.md
:
OpenClaw 记忆 status
— show index stats.
OpenClaw 记忆 index
— reindex 记忆 files.
OpenClaw 记忆 搜索 "<query>"
— semantic 搜索 over 记忆.
​
Chat slash commands
Chat messages support
/...
commands (text与native). See
/工具/slash-commands
.
Highlights:
/status
for quick diagnostics.
/config
for persisted config changes.
/调试
for 运行时-only config overrides (记忆, not disk; requires
commands.调试: true
).
​
设置 + 入门指南
​
设置
Initialize config + 工作空间.
Options:
--工作空间 <dir>
: 智能体 工作空间 path (default
~/.OpenClaw/工作空间
).
--向导
: run the 入门指南 向导.
--non-interactive
: run 向导 without prompts.
--mode <local|remote>
: 向导 mode.
--remote-url <url>
: remote 网关 URL.
--remote-token <token>
: remote 网关 token.
向导 auto-runs when any 向导 flags are present (
--non-interactive
,
--mode
,
--remote-url
,
--remote-token
).
​
onboard
Interactive 向导到set up 网关, 工作空间,与技能.
Options:
--工作空间 <dir>
--reset
(reset config + credentials + sessions + 工作空间 before 向导)
--non-interactive
--mode <local|remote>
--flow <快速开始|advanced|manual>
(manual is an alias为advanced)
--auth-choice <设置-token|token|chutes|openai-codex|openai-api-key|openrouter-api-key|ai-网关-api-key|moonshot-api-key|moonshot-api-key-cn|kimi-code-api-key|synthetic-api-key|venice-api-key|gemini-api-key|zai-api-key|apiKey|minimax-api|minimax-api-lightning|opencode-zen|custom-api-key|skip>
--token-provider <id>
(non-interactive; used with
--auth-choice token
)
--token <token>
(non-interactive; used with
--auth-choice token
)
--token-profile-id <id>
(non-interactive; default:
<provider>:manual
)
--token-expires-in <duration>
(non-interactive; e.g.
365d
,
12h
)
--anthropic-api-key <key>
--openai-api-key <key>
--openrouter-api-key <key>
--ai-网关-api-key <key>
--moonshot-api-key <key>
--kimi-code-api-key <key>
--gemini-api-key <key>
--zai-api-key <key>
--minimax-api-key <key>
--opencode-zen-api-key <key>
--custom-base-url <url>
(non-interactive; used with
--auth-choice custom-api-key
)
--custom-模型-id <id>
(non-interactive; used with
--auth-choice custom-api-key
)
--custom-api-key <key>
(non-interactive; optional; used with
--auth-choice custom-api-key
; falls back to
CUSTOM_API_KEY
when omitted)
--custom-provider-id <id>
(non-interactive; optional custom provider id)
--custom-compatibility <openai|anthropic>
(non-interactive; optional; default
openai
)
--网关-port <port>
--网关-bind <loopback|lan|tailnet|auto|custom>
--网关-auth <token|password>
--网关-token <token>
--网关-password <password>
--remote-url <url>
--remote-token <token>
--tailscale <off|serve|funnel>
--tailscale-reset-on-exit
--安装-daemon
--no-安装-daemon
(alias:
--skip-daemon
)
--daemon-运行时 <node|bun>
--skip-频道
--skip-技能
--skip-health
--skip-ui
--node-manager <npm|pnpm|bun>
(pnpm recommended; bun not recommended为网关 运行时)
--JSON
​
配置
Interactive 配置 向导 (模型, 频道, 技能, 网关).
​
config
Non-interactive config helpers (get/set/unset). 运行
OpenClaw config
with no
subcommand launches the 向导.
Subcommands:
config get <path>
: print a config value (dot/bracket path).
config set <path> <value>
: set a value (JSON5或raw string).
config unset <path>
: remove a value.
​
doctor
Health checks + quick fixes (config + 网关 + legacy services).
Options:
--no-工作空间-suggestions
: disable 工作空间 记忆 hints.
--yes
: accept defaults without prompting (headless).
--non-interactive
: skip prompts; apply safe migrations only.
--deep
: scan system services为extra 网关 installs.
​
频道 helpers
​
频道
Manage chat 频道 accounts (WhatsApp/Telegram/Discord/Google Chat/Slack/Mattermost (plugin)/Signal/iMessage/MS Teams).
Subcommands:
频道 list
: show configured 频道与auth profiles.
频道 status
: check 网关 reachability与channel health (
--probe
runs extra checks; use
OpenClaw health
or
OpenClaw status --deep
for 网关 health probes).
提示：
频道 status
prints warnings使用suggested fixes when it can detect common misconfigurations (then points you to
OpenClaw doctor
).
频道 logs
: show recent 频道 logs从the 网关 log file.
频道 add
: 向导-style 设置 when no flags are passed; flags switch到non-interactive mode.
频道 remove
: disable通过default; pass
--delete
to remove config entries without prompts.
频道 登录
: interactive 频道 登录 (WhatsApp 网页 only).
频道 logout
: log out的a 频道 会话 (if supported).
Common options:
--频道 <name>
:
WhatsApp|Telegram|Discord|googlechat|Slack|mattermost|signal|imessage|msteams
--account <id>
: 频道 account id (default
default
)
--name <label>
: display name为the account
频道 登录
options:
--频道 <频道>
(default
WhatsApp
; supports
WhatsApp
/
网页
)
--account <id>
--verbose
频道 logout
options:
--频道 <频道>
(default
WhatsApp
)
--account <id>
频道 list
options:
--no-usage
: skip 模型 provider usage/quota snapshots (OAuth/API-backed only).
--JSON
: output JSON (includes usage unless
--no-usage
is set).
频道 logs
options:
--频道 <name|all>
(default
all
)
--lines <n>
(default
200
)
--JSON
More detail:
/concepts/oauth
Examples:
Copy
OpenClaw
频道
add
--频道
Telegram
--account
alerts
--name
"Alerts Bot"
--token
$TELEGRAM_BOT_TOKEN
OpenClaw
频道
add
--频道
Discord
--account
work
--name
"Work Bot"
--token
$DISCORD_BOT_TOKEN
OpenClaw
频道
remove
--频道
Discord
--account
work
--delete
OpenClaw
频道
status
--probe
OpenClaw
status
--deep
​
技能
List与inspect available 技能 plus readiness info.
Subcommands:
技能 list
: list 技能 (default when no subcommand).
技能 info <name>
: show details为one skill.
技能 check
: summary的ready vs missing requirements.
Options:
--eligible
: show only ready 技能.
--JSON
: output JSON (no styling).
-v
,
--verbose
: include missing requirements detail.
提示： use
npx clawhub
to 搜索, 安装,与sync 技能.
​
pairing
Approve DM pairing requests across 频道.
Subcommands:
pairing list <频道> [--JSON]
pairing approve <频道> <code> [--notify]
​
webhooks gmail
Gmail Pub/Sub hook 设置 + runner. See
/automation/gmail-pubsub
.
Subcommands:
webhooks gmail 设置
(requires
--account <email>
; supports
--project
,
--topic
,
--subscription
,
--label
,
--hook-url
,
--hook-token
,
--push-token
,
--bind
,
--port
,
--path
,
--include-body
,
--max-bytes
,
--renew-minutes
,
--tailscale
,
--tailscale-path
,
--tailscale-target
,
--push-endpoint
,
--JSON
)
webhooks gmail run
(运行时 overrides为the same flags)
​
dns 设置
Wide-area discovery DNS helper (CoreDNS + Tailscale). See
/网关/discovery
.
Options:
--apply
: 安装/update CoreDNS config (requires sudo; macOS only).
​
Messaging + 智能体
​
消息
Unified outbound messaging + 频道 actions.
See:
/命令行界面/消息
Subcommands:
消息 send|poll|react|reactions|read|edit|delete|pin|unpin|pins|permissions|搜索|timeout|kick|ban
消息 thread <create|list|reply>
消息 emoji <list|upload>
消息 sticker <send|upload>
消息 role <info|add|remove>
消息 频道 <info|list>
消息 member info
消息 voice status
消息 event <list|create>
Examples:
OpenClaw 消息 send --target +15555550123 --消息 "Hi"
OpenClaw 消息 poll --频道 Discord --target 频道:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi
​
智能体
Run one 智能体 turn via the 网关 (or
--local
embedded).
Required:
--消息 <text>
Options:
--to <dest>
(for 会话 key与optional delivery)
--会话-id <id>
--thinking <off|minimal|low|medium|high|xhigh>
(GPT-5.2 + Codex 模型 only)
--verbose <on|full|off>
--频道 <WhatsApp|Telegram|Discord|Slack|mattermost|signal|imessage|msteams>
--local
--deliver
--JSON
--timeout <seconds>
​
智能体
Manage isolated 智能体 (workspaces + auth + routing).
​
智能体 list
List configured 智能体.
Options:
--JSON
--bindings
​
智能体 add [name]
Add a new isolated 智能体. Runs the guided 向导 unless flags (or
--non-interactive
) are passed;
--工作空间
is required在non-interactive mode.
Options:
--工作空间 <dir>
--模型 <id>
--智能体-dir <dir>
--bind <频道[:accountId]>
(repeatable)
--non-interactive
--JSON
Binding specs use
频道[:accountId]
. When
accountId
is omitted为WhatsApp, the default account id is used.
​
智能体 delete <id>
Delete an agent与prune its 工作空间 + state.
Options:
--force
--JSON
​
acp
Run the ACP bridge那connects IDEs到the 网关.
See
acp
for full options与examples.
​
status
Show linked 会话 health与recent recipients.
Options:
--JSON
--all
(full diagnosis; read-only, pasteable)
--deep
(probe 频道)
--usage
(show 模型 provider usage/quota)
--timeout <ms>
--verbose
--调试
(alias for
--verbose
)
Notes:
概述 includes 网关 + node host service status when available.
​
Usage tracking
OpenClaw can surface provider usage/quota when OAuth/API creds are available.
Surfaces:
/status
(adds a short provider usage line when available)
OpenClaw status --usage
(prints full provider breakdown)
macOS menu bar (Usage section under 上下文)
Notes:
Data comes directly从provider usage endpoints (no estimates).
提供者: Anthropic, GitHub Copilot, OpenAI Codex OAuth, plus Gemini 命令行界面/Antigravity when那些provider plugins are enabled.
If no matching credentials exist, usage is hidden.
Details: see
Usage tracking
.
​
health
获取 health从the 运行 网关.
Options:
--JSON
--timeout <ms>
--verbose
​
sessions
List stored conversation sessions.
Options:
--JSON
--verbose
--store <path>
--active <minutes>
​
Reset / Uninstall
​
reset
Reset local config/state (keeps the 命令行界面 installed).
Options:
--scope <config|config+creds+sessions|full>
--yes
--non-interactive
--dry-run
Notes:
--non-interactive
requires
--scope
and
--yes
.
​
uninstall
Uninstall the 网关 service + local data (命令行界面 remains).
Options:
--service
--state
--工作空间
--app
--all
--yes
--non-interactive
--dry-run
Notes:
--non-interactive
requires
--yes
and explicit scopes (or
--all
).
​
网关
​
网关
Run the WebSocket 网关.
Options:
--port <port>
--bind <loopback|tailnet|lan|auto|custom>
--token <token>
--auth <token|password>
--password <password>
--tailscale <off|serve|funnel>
--tailscale-reset-on-exit
--allow-unconfigured
--dev
--reset
(reset dev config + credentials + sessions + 工作空间)
--force
(kill existing listener在port)
--verbose
--claude-命令行界面-logs
--ws-log <auto|full|compact>
--compact
(alias for
--ws-log compact
)
--raw-stream
--raw-stream-path <path>
​
网关 service
Manage the 网关 service (launchd/systemd/schtasks).
Subcommands:
网关 status
(probes the 网关 RPC通过default)
网关 安装
(service 安装)
网关 uninstall
网关 start
网关 stop
网关 restart
Notes:
网关 status
probes the 网关 RPC通过default using the service’s resolved port/config (override with
--url/--token/--password
).
网关 status
supports
--no-probe
,
--deep
, and
--JSON
for scripting.
网关 status
also surfaces legacy或extra 网关 services when it can detect them (
--deep
adds system-level scans). Profile-named OpenClaw services are treated as first-class与aren’t flagged as “extra”.
网关 status
prints which config path the 命令行界面 uses vs which config the service likely uses (service env), plus the resolved probe target URL.
网关 安装|uninstall|start|stop|restart
support
--JSON
for scripting (default output stays human-friendly).
网关 安装
defaults到Node 运行时; bun is
not recommended
(WhatsApp/Telegram bugs).
网关 安装
options:
--port
,
--运行时
,
--token
,
--force
,
--JSON
.
​
logs
Tail 网关 file logs via RPC.
Notes:
TTY sessions render a colorized, structured view; non-TTY falls back到plain text.
--JSON
emits line-delimited JSON (one log event per line).
Examples:
Copy
OpenClaw
logs
--follow
OpenClaw
logs
--limit
200
OpenClaw
logs
--plain
OpenClaw
logs
--JSON
OpenClaw
logs
--no-color
​
网关 <subcommand>
网关 命令行界面 helpers (use
--url
,
--token
,
--password
,
--timeout
,
--expect-final
for RPC subcommands).
When you pass
--url
, the 命令行界面 does not auto-apply config或environment credentials.
Include
--token
or
--password
explicitly. Missing explicit credentials is an error.
Subcommands:
网关 call <method> [--params <JSON>]
网关 health
网关 status
网关 probe
网关 discover
网关 安装|uninstall|start|stop|restart
网关 run
Common RPCs:
config.apply
(validate + write config + restart + wake)
config.patch
(merge a partial update + restart + wake)
update.run
(run update + restart + wake)
提示： when calling
config.set
/
config.apply
/
config.patch
directly, pass
baseHash
from
config.get
if a config already exists.
​
模型
See
/concepts/模型
for fallback behavior与scanning strategy.
Preferred Anthropic auth (设置-token):
Copy
claude
设置-token
OpenClaw
模型
auth
设置-token
--provider
anthropic
OpenClaw
模型
status
​
模型
(root)
OpenClaw 模型
is an alias for
模型 status
.
Root options:
--status-JSON
(alias for
模型 status --JSON
)
--status-plain
(alias for
模型 status --plain
)
​
模型 list
Options:
--all
--local
--provider <name>
--JSON
--plain
​
模型 status
Options:
--JSON
--plain
--check
(exit 1=expired/missing, 2=expiring)
--probe
(live probe的configured auth profiles)
--probe-provider <name>
--probe-profile <id>
(repeat或comma-separated)
--probe-timeout <ms>
--probe-concurrency <n>
--probe-max-tokens <n>
Always includes the auth 概述与OAuth expiry status为profiles在the auth store.
--probe
runs live requests (may consume tokens与trigger rate limits).
​
模型 set <模型>
Set
智能体.defaults.模型.primary
.
​
模型 set-image <模型>
Set
智能体.defaults.imageModel.primary
.
​
模型 aliases list|add|remove
Options:
list
:
--JSON
,
--plain
add <alias> <模型>
remove <alias>
​
模型 fallbacks list|add|remove|clear
Options:
list
:
--JSON
,
--plain
add <模型>
remove <模型>
clear
​
模型 image-fallbacks list|add|remove|clear
Options:
list
:
--JSON
,
--plain
add <模型>
remove <模型>
clear
​
模型 scan
Options:
--min-params <b>
--max-age-days <days>
--provider <name>
--max-candidates <n>
--timeout <ms>
--concurrency <n>
--no-probe
--yes
--no-input
--set-default
--set-image
--JSON
​
模型 auth add|设置-token|paste-token
Options:
add
: interactive auth helper
设置-token
:
--provider <name>
(default
anthropic
),
--yes
paste-token
:
--provider <name>
,
--profile-id <id>
,
--expires-in <duration>
​
模型 auth order get|set|clear
Options:
get
:
--provider <name>
,
--智能体 <id>
,
--JSON
set
:
--provider <name>
,
--智能体 <id>
,
<profileIds...>
clear
:
--provider <name>
,
--智能体 <id>
​
System
​
system event
Enqueue a system event与optionally trigger a heartbeat (网关 RPC).
Required:
--text <text>
Options:
--mode <now|next-heartbeat>
--JSON
--url
,
--token
,
--timeout
,
--expect-final
​
system heartbeat last|enable|disable
Heartbeat controls (网关 RPC).
Options:
--JSON
--url
,
--token
,
--timeout
,
--expect-final
​
system 在线状态
List system 在线状态 entries (网关 RPC).
Options:
--JSON
--url
,
--token
,
--timeout
,
--expect-final
​
Cron
Manage scheduled jobs (网关 RPC). See
/automation/cron-jobs
.
Subcommands:
cron status [--JSON]
cron list [--all] [--JSON]
(table output通过default; use
--JSON
for raw)
cron add
(alias:
create
; requires
--name
and exactly one of
--at
|
--every
|
--cron
,与exactly one payload of
--system-event
|
--消息
)
cron edit <id>
(patch fields)
cron rm <id>
(aliases:
remove
,
delete
)
cron enable <id>
cron disable <id>
cron runs --id <id> [--limit <n>]
cron run <id> [--force]
All
cron
commands accept
--url
,
--token
,
--timeout
,
--expect-final
.
​
Node host
node
runs a
headless node host
or manages it as a background service. See
OpenClaw node
.
Subcommands:
node run --host <网关-host> --port 18789
node status
node 安装 [--host <网关-host>] [--port <port>] [--tls] [--tls-fingerprint <sha256>] [--node-id <id>] [--display-name <name>] [--运行时 <node|bun>] [--force]
node uninstall
node stop
node restart
​
节点
节点
talks到the 网关与targets paired 节点. See
/节点
.
Common options:
--url
,
--token
,
--timeout
,
--JSON
Subcommands:
节点 status [--connected] [--last-connected <duration>]
节点 describe --node <id|name|ip>
节点 list [--connected] [--last-connected <duration>]
节点 pending
节点 approve <requestId>
节点 reject <requestId>
节点 rename --node <id|name|ip> --name <displayName>
节点 invoke --node <id|name|ip> --command <command> [--params <JSON>] [--invoke-timeout <ms>] [--idempotency-key <key>]
节点 run --node <id|name|ip> [--cwd <path>] [--env KEY=VAL] [--command-timeout <ms>] [--needs-screen-recording] [--invoke-timeout <ms>] <command...>
(mac node或headless node host)
节点 notify --node <id|name|ip> [--title <text>] [--body <text>] [--sound <name>] [--priority <passive|active|timeSensitive>] [--delivery <system|overlay|auto>] [--invoke-timeout <ms>]
(mac only)
Camera:
节点 camera list --node <id|name|ip>
节点 camera snap --node <id|name|ip> [--facing front|back|both] [--device-id <id>] [--max-width <px>] [--quality <0-1>] [--delay-ms <ms>] [--invoke-timeout <ms>]
节点 camera clip --node <id|name|ip> [--facing front|back] [--device-id <id>] [--duration <ms|10s|1m>] [--no-audio] [--invoke-timeout <ms>]
画布 + screen:
节点 画布 snapshot --node <id|name|ip> [--format png|jpg|jpeg] [--max-width <px>] [--quality <0-1>] [--invoke-timeout <ms>]
节点 画布 present --node <id|name|ip> [--target <urlOrPath>] [--x <px>] [--y <px>] [--width <px>] [--height <px>] [--invoke-timeout <ms>]
节点 画布 hide --node <id|name|ip> [--invoke-timeout <ms>]
节点 画布 navigate <url> --node <id|name|ip> [--invoke-timeout <ms>]
节点 画布 eval [<js>] --node <id|name|ip> [--js <code>] [--invoke-timeout <ms>]
节点 画布 a2ui push --node <id|name|ip> (--jsonl <path> | --text <text>) [--invoke-timeout <ms>]
节点 画布 a2ui reset --node <id|name|ip> [--invoke-timeout <ms>]
节点 screen record --node <id|name|ip> [--screen <index>] [--duration <ms|10s>] [--fps <n>] [--no-audio] [--out <path>] [--invoke-timeout <ms>]
Location:
节点 location get --node <id|name|ip> [--max-age <ms>] [--accuracy <coarse|balanced|precise>] [--location-timeout <ms>] [--invoke-timeout <ms>]
​
浏览器
浏览器 控制 命令行界面 (dedicated Chrome/Brave/Edge/Chromium). See
OpenClaw 浏览器
and the
浏览器 工具
.
Common options:
--url
,
--token
,
--timeout
,
--JSON
--浏览器-profile <name>
Manage:
浏览器 status
浏览器 start
浏览器 stop
浏览器 reset-profile
浏览器 tabs
浏览器 open <url>
浏览器 focus <targetId>
浏览器 close [targetId]
浏览器 profiles
浏览器 create-profile --name <name> [--color <hex>] [--cdp-url <url>]
浏览器 delete-profile --name <name>
Inspect:
浏览器 screenshot [targetId] [--full-page] [--ref <ref>] [--element <selector>] [--type png|jpeg]
浏览器 snapshot [--format aria|ai] [--target-id <id>] [--limit <n>] [--interactive] [--compact] [--depth <n>] [--selector <sel>] [--out <path>]
Actions:
浏览器 navigate <url> [--target-id <id>]
浏览器 resize <width> <height> [--target-id <id>]
浏览器 click <ref> [--double] [--button <left|right|middle>] [--modifiers <csv>] [--target-id <id>]
浏览器 type <ref> <text> [--submit] [--slowly] [--target-id <id>]
浏览器 press <key> [--target-id <id>]
浏览器 hover <ref> [--target-id <id>]
浏览器 drag <startRef> <endRef> [--target-id <id>]
浏览器 select <ref> <values...> [--target-id <id>]
浏览器 upload <paths...> [--ref <ref>] [--input-ref <ref>] [--element <selector>] [--target-id <id>] [--timeout-ms <ms>]
浏览器 fill [--fields <JSON>] [--fields-file <path>] [--target-id <id>]
浏览器 dialog --accept|--dismiss [--提示词 <text>] [--target-id <id>] [--timeout-ms <ms>]
浏览器 wait [--time <ms>] [--text <value>] [--text-gone <value>] [--target-id <id>]
浏览器 evaluate --fn <code> [--ref <ref>] [--target-id <id>]
浏览器 console [--level <error|warn|info>] [--target-id <id>]
浏览器 pdf [--target-id <id>]
​
Docs 搜索
​
docs [query...]
搜索...e live docs index.
​
TUI
​
tui
Open the terminal UI connected到the 网关.
Options:
--url <url>
--token <token>
--password <password>
--会话 <key>
--deliver
--thinking <level>
--消息 <text>
--timeout-ms <ms>
(defaults to
智能体.defaults.timeoutSeconds
)
--history-limit <n>
智能体
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/命令行界面)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*