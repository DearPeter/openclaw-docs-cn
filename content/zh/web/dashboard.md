# 仪表板 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
网页 interfaces
仪表板
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
仪表板
WebChat
TUI
本页内容
仪表板 (控制 UI)
Fast path (recommended)
令牌 basics (local vs remote)
If you see “unauthorized” / 1008
​
仪表板 (控制 UI)
The 网关 仪表板 is the 浏览器 控制 UI served at
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
(令牌或password). See
网关.auth
in
网关 配置
.
Security note: the 控制 UI is an
admin surface
(chat, config, 执行 approvals).
Do not expose it publicly. The UI stores the 令牌 in
localStorage
after first load.
Prefer localhost, Tailscale Serve,或an SSH tunnel.
​
Fast path (recommended)
After 入门指南, the 命令行界面 auto-opens the 仪表板与prints a clean (non-tokenized) link.
Re-open anytime:
OpenClaw 仪表板
(copies link, opens 浏览器 if possible, shows SSH hint if headless).
If the UI prompts为auth, paste the 令牌 from
网关.auth.令牌
(or
OPENCLAW_网关_令牌
) into 控制 UI settings.
​
令牌 basics (local vs remote)
Localhost
: open
http://127.0.0.1:18789/
.
令牌 source
:
网关.auth.令牌
(or
OPENCLAW_网关_令牌
); the UI stores a copy在localStorage after you connect.
Not localhost
: use Tailscale Serve (tokenless if
网关.auth.allowTailscale: true
), tailnet bind使用a 令牌,或an SSH tunnel. See
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
Retrieve the 令牌从the 网关 host:
OpenClaw config get 网关.auth.令牌
(or generate one:
OpenClaw doctor --generate-网关-令牌
).
In the 仪表板 settings, paste the 令牌 into the auth field, then connect.
控制 UI
WebChat
I
[查看英文原版](https://docs.OpenClaw.ai/网页/dashboard)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*