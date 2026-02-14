# Dashboard - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
网页 interfaces
Dashboard
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
Dashboard (控制 UI)
Fast path (recommended)
Token basics (local vs remote)
If you see “unauthorized” / 1008
​
Dashboard (控制 UI)
The 网关 dashboard is the 浏览器 控制 UI served at
/
by default
(override with
网关.controlUi.basePath
).
Quick open (local 网关):
http://127.0.0.1:18789/
(or
http://localhost:18789/
)
Key references:
控制 UI
for usage与UI capabilities.
Tailscale
for Serve/Funnel automation.
网页 surfaces
for bind modes与security notes.
认证 is enforced在the WebSocket handshake via
connect.params.auth
(token或password). See
网关.auth
in
网关 配置
.
Security note: the 控制 UI is an
admin surface
(chat, config, 执行 approvals).
Do not expose it publicly. The UI stores the token in
localStorage
after first load.
Prefer localhost, Tailscale Serve,或an SSH tunnel.
​
Fast path (recommended)
After 入门指南, the 命令行界面 auto-opens the dashboard与prints a clean (non-tokenized) link.
Re-open anytime:
OpenClaw dashboard
(copies link, opens 浏览器 if possible, shows SSH hint if headless).
If the UI prompts为auth, paste the token from
网关.auth.token
(or
OPENCLAW_GATEWAY_TOKEN
) into 控制 UI settings.
​
Token basics (local vs remote)
Localhost
: open
http://127.0.0.1:18789/
.
Token source
:
网关.auth.token
(or
OPENCLAW_GATEWAY_TOKEN
); the UI stores a copy在localStorage after you connect.
Not localhost
: use Tailscale Serve (tokenless if
网关.auth.allowTailscale: true
), tailnet bind使用a token,或an SSH tunnel. See
网页 surfaces
.
​
If you see “unauthorized” / 1008
Ensure the 网关 is reachable (local:
OpenClaw status
; remote: SSH tunnel
ssh -N -L 18789:127.0.0.1:18789 user@host
then open
http://127.0.0.1:18789/
).
Retrieve the token从the 网关 host:
OpenClaw config get 网关.auth.token
(or generate one:
OpenClaw doctor --generate-网关-token
).
In the dashboard settings, paste the token into the auth field, then connect.
控制 UI
WebChat
I
[查看英文原版](https://docs.OpenClaw.ai/网页/dashboard)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*