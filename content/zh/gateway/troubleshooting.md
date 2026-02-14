# Troubleshooting - OpenClaw - 中文翻译


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
配置与operations
Troubleshooting
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
网关
网关 Runbook
配置与operations
配置
配置 参考
配置 Examples
认证
Health Checks
Heartbeat
Doctor
Logging
网关 Lock
Background 执行与进程 工具
Multiple Gateways
Troubleshooting
Security与sandboxing
Protocols与APIs
Networking与discovery
Remote access
Remote Access
Remote 网关 设置
Tailscale
Security
Formal Verification (Security 模型)
网页 interfaces
网页
控制 UI
Dashboard
WebChat
TUI
本页内容
网关 troubleshooting
Command ladder
No replies
Dashboard 控制 ui connectivity
网关 service not 运行
频道 connected messages not flowing
Cron与heartbeat delivery
Node paired 工具 fails
浏览器 工具 fails
If you upgraded与something suddenly broke
1) Auth与URL override behavior changed
2) Bind与auth guardrails are stricter
3) Pairing与device identity state changed
​
网关 troubleshooting
This page is the deep runbook.
Start at
/帮助/troubleshooting
if you want the fast triage flow first.
​
Command ladder
Run这些first,在this order:
Copy
OpenClaw
status
OpenClaw
网关
status
OpenClaw
logs
--follow
OpenClaw
doctor
OpenClaw
频道
status
--probe
Expected healthy signals:
OpenClaw 网关 status
shows
运行时: 运行
and
RPC probe: ok
.
OpenClaw doctor
reports no blocking config/service issues.
OpenClaw 频道 status --probe
shows connected/ready 频道.
​
No replies
If 频道 are up but nothing answers, check routing与policy before reconnecting anything.
Copy
OpenClaw
status
OpenClaw
频道
status
--probe
OpenClaw
pairing
list
<
channe
l
>
OpenClaw
config
get
频道
OpenClaw
logs
--follow
Look for:
Pairing pending为DM senders.
Group mention gating (
requireMention
,
mentionPatterns
).
频道/group allowlist mismatches.
Common signatures:
drop guild 消息 (mention required
→ group 消息 ignored until mention.
pairing request
→ sender needs approval.
blocked
/
allowlist
→ sender/频道 was filtered通过policy.
Related:
/频道/troubleshooting
/频道/pairing
/频道/groups
​
Dashboard 控制 ui connectivity
When dashboard/控制 UI will not connect, validate URL, auth mode,与secure 上下文 assumptions.
Copy
OpenClaw
网关
status
OpenClaw
status
OpenClaw
logs
--follow
OpenClaw
doctor
OpenClaw
网关
status
--JSON
Look for:
Correct probe URL与dashboard URL.
Auth mode/token mismatch between client与网关.
HTTP usage where device identity is required.
Common signatures:
device identity required
→ non-secure 上下文或missing device auth.
unauthorized
/ reconnect loop → token/password mismatch.
网关 connect failed:
→ wrong host/port/url target.
Related:
/网页/控制-ui
/网关/认证
/网关/remote
​
网关 service not 运行
Use这when service is installed but 进程 does not stay up.
Copy
OpenClaw
网关
status
OpenClaw
status
OpenClaw
logs
--follow
OpenClaw
doctor
OpenClaw
网关
status
--deep
Look for:
运行时: stopped
with exit hints.
Service config mismatch (
Config (命令行界面)
vs
Config (service)
).
Port/listener conflicts.
Common signatures:
网关 start blocked: set 网关.mode=local
→ local 网关 mode is not enabled.
refusing到bind 网关 ... without auth
→ non-loopback bind without token/password.
another 网关 instance is already listening
/
EADDRINUSE
→ port conflict.
Related:
/网关/background-进程
/网关/配置
/网关/doctor
​
频道 connected messages not flowing
If 频道 state is connected but 消息 flow is dead, focus在policy, permissions,与channel specific delivery rules.
Copy
OpenClaw
频道
status
--probe
OpenClaw
pairing
list
<
channe
l
>
OpenClaw
status
--deep
OpenClaw
logs
--follow
OpenClaw
config
get
频道
Look for:
DM policy (
pairing
,
allowlist
,
open
,
disabled
).
Group allowlist与mention requirements.
Missing 频道 API permissions/scopes.
Common signatures:
mention required
→ 消息 ignored通过group mention policy.
pairing
/ pending approval traces → sender is not approved.
missing_scope
,
not_in_channel
,
Forbidden
,
401/403
→ 频道 auth/permissions issue.
Related:
/频道/troubleshooting
/频道/WhatsApp
/频道/Telegram
/频道/Discord
​
Cron与heartbeat delivery
If cron或heartbeat did not run或did not deliver, verify scheduler state first, then delivery target.
Copy
OpenClaw
cron
status
OpenClaw
cron
list
OpenClaw
cron
runs
--id
<
jobI
d
>
--limit
20
OpenClaw
system
heartbeat
last
OpenClaw
logs
--follow
Look for:
Cron enabled与next wake present.
Job run history status (
ok
,
skipped
,
error
).
Heartbeat skip reasons (
quiet-hours
,
requests-in-flight
,
alerts-disabled
).
Common signatures:
cron: scheduler disabled; jobs will not run automatically
→ cron disabled.
cron: timer tick failed
→ scheduler tick failed; check file/log/运行时 errors.
heartbeat skipped
with
reason=quiet-hours
→ outside active hours window.
heartbeat: unknown accountId
→ invalid account id为heartbeat delivery target.
Related:
/automation/troubleshooting
/automation/cron-jobs
/网关/heartbeat
​
Node paired 工具 fails
If a node is paired but 工具 fail, isolate foreground, permission,与approval state.
Copy
OpenClaw
节点
status
OpenClaw
节点
describe
--node
<
idOrNameOrI
p
>
OpenClaw
approvals
get
--node
<
idOrNameOrI
p
>
OpenClaw
logs
--follow
OpenClaw
status
Look for:
Node online使用expected capabilities.
OS permission grants为camera/mic/location/screen.
执行 approvals与allowlist state.
Common signatures:
NODE_BACKGROUND_UNAVAILABLE
→ node app must be在foreground.
*_PERMISSION_REQUIRED
/
LOCATION_PERMISSION_REQUIRED
→ missing OS permission.
SYSTEM_RUN_DENIED: approval required
→ 执行 approval pending.
SYSTEM_RUN_DENIED: allowlist miss
→ command blocked通过allowlist.
Related:
/节点/troubleshooting
/节点/index
/工具/执行-approvals
​
浏览器 工具 fails
Use这when 浏览器 工具 actions fail even though the 网关 itself is healthy.
Copy
OpenClaw
浏览器
status
OpenClaw
浏览器
start
--浏览器-profile
OpenClaw
OpenClaw
浏览器
profiles
OpenClaw
logs
--follow
OpenClaw
doctor
Look for:
Valid 浏览器 executable path.
CDP profile reachability.
Extension relay tab attachment for
profile="chrome"
.
Common signatures:
Failed到start Chrome CDP在port
→ 浏览器 进程 failed到launch.
浏览器.executablePath not found
→ configured path is invalid.
Chrome extension relay is 运行, but no tab is connected
→ extension relay not attached.
浏览器 attachOnly is enabled ... not reachable
→ attach-only profile has no reachable target.
Related:
/工具/浏览器-linux-troubleshooting
/工具/chrome-extension
/工具/浏览器
​
If you upgraded与something suddenly broke
Most post-upgrade breakage is config drift或stricter defaults now being enforced.
​
1) Auth与URL override behavior changed
Copy
OpenClaw
网关
status
OpenClaw
config
get
网关.mode
OpenClaw
config
get
网关.remote.url
OpenClaw
config
get
网关.auth.mode
What到check:
If
网关.mode=remote
, 命令行界面 calls may be targeting remote while your local service is fine.
Explicit
--url
calls do not fall back到stored credentials.
Common signatures:
网关 connect failed:
→ wrong URL target.
unauthorized
→ endpoint reachable but wrong auth.
​
2) Bind与auth guardrails are stricter
Copy
OpenClaw
config
get
网关.bind
OpenClaw
config
get
网关.auth.token
OpenClaw
网关
status
OpenClaw
logs
--follow
What到check:
Non-loopback binds (
lan
,
tailnet
,
custom
) need auth configured.
Old keys like
网关.token
do not replace
网关.auth.token
.
Common signatures:
refusing到bind 网关 ... without auth
→ bind+auth mismatch.
RPC probe: failed
while 运行时 is 运行 → 网关 alive but inaccessible使用current auth/url.
​
3) Pairing与device identity state changed
Copy
OpenClaw
devices
list
OpenClaw
pairing
list
<
channe
l
>
OpenClaw
logs
--follow
OpenClaw
doctor
What到check:
Pending device approvals为dashboard/节点.
Pending DM pairing approvals after policy或identity changes.
Common signatures:
device identity required
→ device auth not satisfied.
pairing required
→ sender/device must be approved.
If the service config与runtime still disagree after checks, reinstall service metadata从the same profile/state directory:
Copy
OpenClaw
网关
安装
--force
OpenClaw
网关
restart
Related:
/网关/pairing
/网关/认证
/网关/background-进程
Multiple Gateways
Security
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/网关/troubleshooting)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*