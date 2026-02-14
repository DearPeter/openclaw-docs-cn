# 网页 - OpenClaw - 中文翻译


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
网页
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
网页 (网关)
Webhooks
Config (default-on)
Tailscale access
Integrated Serve (recommended)
Tailnet bind + token
Public internet (Funnel)
Security notes
Building the UI
​
网页 (网关)
The 网关 serves a small
浏览器 控制 UI
(Vite + Lit)从the same port as the 网关 WebSocket:
default:
http://<host>:18789/
optional prefix: set
网关.controlUi.basePath
(e.g.
/OpenClaw
)
Capabilities live in
控制 UI
.
This page focuses在bind modes, security,与网页-facing surfaces.
​
Webhooks
When
hooks.enabled=true
, the 网关 also exposes a small webhook endpoint在the same HTTP server.
See
网关 配置
→
hooks
for auth + payloads.
​
Config (default-on)
The 控制 UI is
enabled通过default
when assets are present (
dist/控制-ui
).
You can 控制 it via config:
Copy
{
网关
:
{
controlUi
:
{
enabled
:
true
,
basePath
:
"/OpenClaw"
}
,
// basePath optional
}
,
}
​
Tailscale access
​
Integrated Serve (recommended)
Keep the 网关在loopback与let Tailscale Serve proxy it:
Copy
{
网关
:
{
bind
:
"loopback"
,
tailscale
:
{
mode
:
"serve"
}
,
}
,
}
Then start the 网关:
Copy
OpenClaw
网关
Open:
https://<magicdns>/
(or your configured
网关.controlUi.basePath
)
​
Tailnet bind + token
Copy
{
网关
:
{
bind
:
"tailnet"
,
controlUi
:
{
enabled
:
true
}
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
"your-token"
}
,
}
,
}
Then start the 网关 (token required为non-loopback binds):
Copy
OpenClaw
网关
Open:
http://<tailscale-ip>:18789/
(or your configured
网关.controlUi.basePath
)
​
Public internet (Funnel)
Copy
{
网关
:
{
bind
:
"loopback"
,
tailscale
:
{
mode
:
"funnel"
}
,
auth
:
{
mode
:
"password"
}
,
//或OPENCLAW_GATEWAY_PASSWORD
}
,
}
​
Security notes
网关 auth is required通过default (token/password或Tailscale identity headers).
Non-loopback binds still
require
a shared token/password (
网关.auth
or env).
The 向导 generates a 网关 token通过default (even在loopback).
The UI sends
connect.params.auth.token
or
connect.params.auth.password
.
The 控制 UI sends anti-clickjacking headers与only accepts same-origin 浏览器
websocket connections unless
网关.controlUi.allowedOrigins
is set.
With Serve, Tailscale identity headers can satisfy auth when
网关.auth.allowTailscale
is
true
(no token/password required). Set
网关.auth.allowTailscale: false
to require explicit credentials. See
Tailscale
and
Security
.
网关.tailscale.mode: "funnel"
requires
网关.auth.mode: "password"
(shared password).
​
Building the UI
The 网关 serves static files from
dist/控制-ui
. 构建 them with:
Copy
pnpm
ui:构建
# auto-installs UI deps在first run
Formal Verification (Security 模型)
控制 UI
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/网页)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*