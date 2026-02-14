# Tailscale - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Remote access
Tailscale
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
Tailscale (网关 dashboard)
Modes
Auth
Config examples
Tailnet-only (Serve)
Tailnet-only (bind到Tailnet IP)
Public internet (Funnel + shared password)
命令行界面 examples
Notes
浏览器 控制 (remote 网关 + local 浏览器)
Tailscale prerequisites + limits
Learn more
​
Tailscale (网关 dashboard)
OpenClaw can auto-配置 Tailscale
Serve
(tailnet) or
Funnel
(public)为the
网关 dashboard与WebSocket port. This keeps the 网关 bound到loopback while
Tailscale provides HTTPS, routing,与(for Serve) identity headers.
​
Modes
serve
: Tailnet-only Serve via
tailscale serve
. The 网关 stays on
127.0.0.1
.
funnel
: Public HTTPS via
tailscale funnel
. OpenClaw requires a shared password.
off
: Default (no Tailscale automation).
​
Auth
Set
网关.auth.mode
to 控制 the handshake:
token
(default when
OPENCLAW_GATEWAY_TOKEN
is set)
password
(shared secret via
OPENCLAW_GATEWAY_PASSWORD
or config)
When
tailscale.mode = "serve"
and
网关.auth.allowTailscale
is
true
,
valid Serve proxy requests can authenticate via Tailscale identity headers
(
tailscale-user-登录
) without supplying a token/password. OpenClaw verifies
the identity通过resolving the
x-forwarded-for
address via the local Tailscale
daemon (
tailscale whois
)与matching it到the header before accepting it.
OpenClaw only treats a request as Serve when it arrives从loopback with
Tailscale’s
x-forwarded-for
,
x-forwarded-proto
, and
x-forwarded-host
headers.
To require explicit credentials, set
网关.auth.allowTailscale: false
or
force
网关.auth.mode: "password"
.
​
Config examples
​
Tailnet-only (Serve)
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
Open:
https://<magicdns>/
(or your configured
网关.controlUi.basePath
)
​
Tailnet-only (bind到Tailnet IP)
Use这when you want the 网关到listen directly在the Tailnet IP (no Serve/Funnel).
Copy
{
网关
:
{
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
"your-token"
}
,
}
,
}
Connect从another Tailnet device:
控制 UI:
http://<tailscale-ip>:18789/
WebSocket:
ws://<tailscale-ip>:18789
Note: loopback (
http://127.0.0.1:18789
) will
not
work在this mode.
​
Public internet (Funnel + shared password)
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
,
password
:
"replace-me"
}
,
}
,
}
Prefer
OPENCLAW_GATEWAY_PASSWORD
over committing a password到disk.
​
命令行界面 examples
Copy
OpenClaw
网关
--tailscale
serve
OpenClaw
网关
--tailscale
funnel
--auth
password
​
Notes
Tailscale Serve/Funnel requires the
tailscale
命令行界面到be installed与logged in.
tailscale.mode: "funnel"
refuses到start unless auth mode is
password
to avoid public exposure.
Set
网关.tailscale.resetOnExit
if you want OpenClaw到undo
tailscale serve
or
tailscale funnel
配置在shutdown.
网关.bind: "tailnet"
is a direct Tailnet bind (no HTTPS, no Serve/Funnel).
网关.bind: "auto"
prefers loopback; use
tailnet
if you want Tailnet-only.
Serve/Funnel only expose the
网关 控制 UI + WS
. 节点 connect over
the same 网关 WS endpoint, so Serve can work为node access.
​
浏览器 控制 (remote 网关 + local 浏览器)
If you run the 网关在one machine but want到drive a 浏览器在another machine,
run a
node host
on the 浏览器 machine与keep both在the same tailnet.
The 网关 will proxy 浏览器 actions到the node; no separate 控制 server或Serve URL needed.
Avoid Funnel为浏览器 控制; treat node pairing like operator access.
​
Tailscale prerequisites + limits
Serve requires HTTPS enabled为your tailnet; the 命令行界面 prompts if it is missing.
Serve injects Tailscale identity headers; Funnel does not.
Funnel requires Tailscale v1.38.3+, MagicDNS, HTTPS enabled,与a funnel node attribute.
Funnel only supports ports
443
,
8443
, and
10000
over TLS.
Funnel在macOS requires the open-source Tailscale app variant.
​
Learn more
Tailscale Serve 概述:
https://tailscale.com/kb/1312/serve
tailscale serve
command:
https://tailscale.com/kb/1242/tailscale-serve
Tailscale Funnel 概述:
https://tailscale.com/kb/1223/tailscale-funnel
tailscale funnel
command:
https://tailscale.com/kb/1311/tailscale-funnel
Remote 网关 设置
Formal Verification (Security 模型)
I
[查看英文原版](https://docs.OpenClaw.ai/网关/tailscale)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*