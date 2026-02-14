# 控制 UI - OpenClaw - 中文翻译


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
网页 interfaces
控制 UI
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
控制 UI (浏览器)
Quick open (local)
Device pairing (first connection)
What it can do (today)
Chat behavior
Tailnet access (recommended)
Integrated Tailscale Serve (preferred)
Bind到tailnet + token
Insecure HTTP
Building the UI
Debugging/testing: dev server + remote 网关
​
控制 UI (浏览器)
The 控制 UI is a small
Vite + Lit
single-page app served通过the 网关:
default:
http://<host>:18789/
optional prefix: set
网关.controlUi.basePath
(e.g.
/OpenClaw
)
It speaks
directly到the 网关 WebSocket
on the same port.
​
Quick open (local)
If the 网关 is 运行在the same computer, open:
http://127.0.0.1:18789/
(or
http://localhost:18789/
)
If the page fails到load, start the 网关 first:
OpenClaw 网关
.
Auth is supplied during the WebSocket handshake via:
connect.params.auth.token
connect.params.auth.password
The dashboard settings panel lets you store a token; passwords are not persisted.
The 入门指南 向导 generates a 网关 token通过default, so paste it here在first connect.
​
Device pairing (first connection)
When you connect到the 控制 UI从a new 浏览器或device, the 网关
requires a
one-time pairing approval
— even if you’re在the same Tailnet
with
网关.auth.allowTailscale: true
. 这是 a security measure到prevent
unauthorized access.
What you’ll see:
“disconnected (1008): pairing required”
To approve the device:
Copy
# List pending requests
OpenClaw
devices
list
# Approve通过request ID
OpenClaw
devices
approve
<
requestI
d
>
Once approved, the device is remembered与won’t require re-approval unless
you revoke it with
OpenClaw devices revoke --device <id> --role <role>
. See
Devices 命令行界面
for token rotation与revocation.
Notes:
Local connections (
127.0.0.1
) are auto-approved.
Remote connections (LAN, Tailnet, etc.) require explicit approval.
Each 浏览器 profile generates a unique device ID, so switching browsers or
clearing 浏览器 data will require re-pairing.
​
What it can do (today)
Chat使用the 模型 via 网关 WS (
chat.history
,
chat.send
,
chat.abort
,
chat.inject
)
Stream 工具 calls + live 工具 output cards在Chat (智能体 events)
频道: WhatsApp/Telegram/Discord/Slack + plugin 频道 (Mattermost, etc.) status + QR 登录 + per-频道 config (
频道.status
,
网页.登录.*
,
config.patch
)
Instances: 在线状态 list + refresh (
system-在线状态
)
会话: list + per-会话 thinking/verbose overrides (
sessions.list
,
sessions.patch
)
Cron jobs: list/add/run/enable/disable + run history (
cron.*
)
技能: status, enable/disable, 安装, API key updates (
技能.*
)
节点: list + caps (
node.list
)
执行 approvals: edit 网关或node allowlists + ask policy for
执行 host=网关/node
(
执行.approvals.*
)
Config: view/edit
~/.OpenClaw/OpenClaw.JSON
(
config.get
,
config.set
)
Config: apply + restart使用validation (
config.apply
)与wake the last active 会话
Config writes include a base-hash guard到prevent clobbering concurrent edits
Config schema + form rendering (
config.schema
, including plugin + 频道 schemas); Raw JSON editor remains available
调试: status/health/模型 snapshots + event log + manual RPC calls (
status
,
health
,
模型.list
)
Logs: live tail的网关 file logs使用filter/export (
logs.tail
)
Update: run a package/git update + restart (
update.run
)使用a restart report
Cron jobs panel notes:
For isolated jobs, delivery defaults到announce summary. You can switch到none if you want internal-only runs.
频道/target fields appear when announce is selected.
​
Chat behavior
chat.send
is
non-blocking
: it acks immediately with
{ runId, status: "started" }
and the response streams via
chat
events.
Re-发送使用the same
idempotencyKey
returns
{ status: "in_flight" }
while 运行, and
{ status: "ok" }
after completion.
chat.inject
appends an assistant note到the 会话 transcript与broadcasts a
chat
event为UI-only updates (no 智能体 run, no 频道 delivery).
Stop:
Click
Stop
(calls
chat.abort
)
Type
/stop
(or
stop|esc|abort|wait|exit|interrupt
)到abort out-of-band
chat.abort
supports
{ sessionKey }
(no
runId
)到abort all active runs为that 会话
​
Tailnet access (recommended)
​
Integrated Tailscale Serve (preferred)
Keep the 网关在loopback与let Tailscale Serve proxy it使用HTTPS:
Copy
OpenClaw
网关
--tailscale
serve
Open:
https://<magicdns>/
(or your configured
网关.controlUi.basePath
)
By default, Serve requests can authenticate via Tailscale identity headers
(
tailscale-user-登录
) when
网关.auth.allowTailscale
is
true
. OpenClaw
verifies the identity通过resolving the
x-forwarded-for
address with
tailscale whois
and matching it到the header,与only accepts这些when the
request hits loopback使用Tailscale’s
x-forwarded-*
headers. Set
网关.auth.allowTailscale: false
(or force
网关.auth.mode: "password"
)
if you want到require a token/password even为Serve traffic.
​
Bind到tailnet + token
Copy
OpenClaw
网关
--bind
tailnet
--token
"$(
openssl
rand
-hex
32
)"
Then open:
http://<tailscale-ip>:18789/
(or your configured
网关.controlUi.basePath
)
Paste the token into the UI settings (sent as
connect.params.auth.token
).
​
Insecure HTTP
If you open the dashboard over plain HTTP (
http://<lan-ip>
or
http://<tailscale-ip>
),
the 浏览器 runs在a
non-secure 上下文
and blocks WebCrypto. By default,
OpenClaw
blocks
控制 UI connections without device identity.
Recommended fix:
use HTTPS (Tailscale Serve)或open the UI locally:
https://<magicdns>/
(Serve)
http://127.0.0.1:18789/
(on the 网关 host)
Downgrade example (token-only over HTTP):
Copy
{
网关
:
{
controlUi
:
{
allowInsecureAuth
:
true
}
,
bind
:
"tailnet"
,
auth
:
{
mode
:
"token"
,
token
:
"replace-me"
}
,
}
,
}
This disables device identity + pairing为the 控制 UI (even在HTTPS). Use
only if you trust the network.
See
Tailscale
for HTTPS 设置 guidance.
​
Building the UI
The 网关 serves static files from
dist/控制-ui
. 构建 them with:
Copy
pnpm
ui:构建
# auto-installs UI deps在first run
Optional absolute base (when you want fixed asset URLs):
Copy
OPENCLAW_CONTROL_UI_BASE_PATH
=
/OpenClaw/
pnpm
ui:构建
For local development (separate dev server):
Copy
pnpm
ui:dev
# auto-installs UI deps在first run
Then point the UI在your 网关 WS URL (e.g.
ws://127.0.0.1:18789
).
​
Debugging/testing: dev server + remote 网关
The 控制 UI is static files; the WebSocket target is configurable与can be
different从the HTTP origin. 这是 handy when you want the Vite dev server
locally but the 网关 runs elsewhere.
Start the UI dev server:
pnpm ui:dev
Open a URL like:
Copy
http://localhost:5173/?gatewayUrl=ws://<网关-host>:18789
Optional one-time auth (if needed):
Copy
http://localhost:5173/?gatewayUrl=wss://<网关-host>:18789&token=<网关-token>
Notes:
gatewayUrl
is stored在localStorage after load与removed从the URL.
token
is stored在localStorage;
password
is kept在记忆 only.
When
gatewayUrl
is set, the UI does not fall back到config或environment credentials.
Provide
token
(or
password
) explicitly. Missing explicit credentials is an error.
Use
wss://
when the 网关 is behind TLS (Tailscale Serve, HTTPS proxy, etc.).
gatewayUrl
is only accepted在a top-level window (not embedded)到prevent clickjacking.
For cross-origin dev setups (e.g.
pnpm ui:dev
to a remote 网关), add the UI
origin to
网关.controlUi.allowedOrigins
.
示例：
Copy
{
网关
:
{
controlUi
:
{
allowedOrigins
:
[
"http://localhost:5173"
]
,
}
,
}
,
}
Remote access 设置 details:
Remote access
.
网页
Dashboard
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/网页/控制-ui)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*