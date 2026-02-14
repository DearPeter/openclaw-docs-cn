# Remote Access - OpenClaw - 中文翻译


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
Remote access
Remote Access
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
Remote access (SSH, tunnels,与tailnets)
The core idea
Common VPN/tailnet setups (where the 智能体 lives)
1) Always-on 网关在your tailnet (VPS或home server)
2) Home desktop runs the 网关, laptop is remote 控制
3) Laptop runs the 网关, remote access从other machines
Command flow (what runs where)
SSH tunnel (命令行界面 + 工具)
命令行界面 remote defaults
Chat UI over SSH
macOS app “Remote over SSH”
Security rules (remote/VPN)
​
Remote access (SSH, tunnels,与tailnets)
This repo supports “remote over SSH”通过keeping a single 网关 (the master) 运行在a dedicated host (desktop/server)与connecting clients到it.
For
operators (you / the macOS app)
: SSH tunneling is the universal fallback.
For
节点 (iOS/Android与future devices)
: connect到the 网关
WebSocket
(LAN/tailnet或SSH tunnel as needed).
​
The core idea
The 网关 WebSocket binds to
loopback
on your configured port (defaults到18789).
For remote use, you forward那loopback port over SSH (or use a tailnet/VPN与tunnel less).
​
Common VPN/tailnet setups (where the 智能体 lives)
Think的the
网关 host
as “where the 智能体 lives.” It owns sessions, auth profiles, 频道,与state.
Your laptop/desktop (and 节点) connect到that host.
​
1) Always-on 网关在your tailnet (VPS或home server)
Run the 网关在a persistent host与reach it via
Tailscale
or SSH.
Best UX:
keep
网关.bind: "loopback"
and use
Tailscale Serve
for the 控制 UI.
Fallback:
keep loopback + SSH tunnel从any machine那needs access.
Examples:
exe.dev
(easy VM) or
Hetzner
(production VPS).
这是 ideal when your laptop sleeps often but you want the 智能体 always-on.
​
2) Home desktop runs the 网关, laptop is remote 控制
The laptop does
not
run the 智能体. It connects remotely:
Use the macOS app’s
Remote over SSH
mode (Settings → General → “OpenClaw runs”).
The app opens与manages the tunnel, so WebChat + health checks “just work.”
Runbook:
macOS remote access
.
​
3) Laptop runs the 网关, remote access从other machines
Keep the 网关 local but expose it safely:
SSH tunnel到the laptop从other machines, or
Tailscale Serve the 控制 UI与keep the 网关 loopback-only.
Guide:
Tailscale
and
网页 概述
.
​
Command flow (what runs where)
One 网关 service owns state + 频道. 节点 are peripherals.
Flow example (Telegram → node):
Telegram 消息 arrives在the
网关
.
网关 runs the
智能体
and decides whether到call a node 工具.
网关 calls the
node
over the 网关 WebSocket (
node.*
RPC).
Node returns the result; 网关 replies back out到Telegram.
Notes:
节点 do not run the 网关 service.
Only one 网关 should run per host unless you intentionally run isolated profiles (see
Multiple gateways
).
macOS app “node mode” is just a node client over the 网关 WebSocket.
​
SSH tunnel (命令行界面 + 工具)
Create a local tunnel到the remote 网关 WS:
Copy
ssh
-N
-L
18789:127.0.0.1:18789
user@host
With the tunnel up:
OpenClaw health
and
OpenClaw status --deep
now reach the remote 网关 via
ws://127.0.0.1:18789
.
OpenClaw 网关 {status,health,send,智能体,call}
can also target the forwarded URL via
--url
when needed.
Note: replace
18789
with your configured
网关.port
(or
--port
/
OPENCLAW_GATEWAY_PORT
).
Note: when you pass
--url
, the 命令行界面 does not fall back到config或environment credentials.
Include
--token
or
--password
explicitly. Missing explicit credentials is an error.
​
命令行界面 remote defaults
You can persist a remote target so 命令行界面 commands use it通过default:
Copy
{
网关
:
{
mode
:
"remote"
,
remote
:
{
url
:
"ws://127.0.0.1:18789"
,
token
:
"your-token"
,
}
,
}
,
}
When the 网关 is loopback-only, keep the URL at
ws://127.0.0.1:18789
and open the SSH tunnel first.
​
Chat UI over SSH
WebChat no longer uses a separate HTTP port. The SwiftUI chat UI connects directly到the 网关 WebSocket.
Forward
18789
over SSH (see above), then connect clients to
ws://127.0.0.1:18789
.
On macOS, prefer the app’s “Remote over SSH” mode, which manages the tunnel automatically.
​
macOS app “Remote over SSH”
The macOS menu bar app can drive the same 设置 end-to-end (remote status checks, WebChat,与Voice Wake forwarding).
Runbook:
macOS remote access
.
​
Security rules (remote/VPN)
Short version:
keep the 网关 loopback-only
unless you’re sure you need a bind.
Loopback + SSH/Tailscale Serve
is the safest default (no public exposure).
Non-loopback binds
(
lan
/
tailnet
/
custom
, or
auto
when loopback is unavailable) must use auth tokens/passwords.
网关.remote.token
is
only
for remote 命令行界面 calls — it does
not
enable local auth.
网关.remote.tlsFingerprint
pins the remote TLS cert when using
wss://
.
Tailscale Serve
can authenticate via identity headers when
网关.auth.allowTailscale: true
.
Set it to
false
if you want tokens/passwords instead.
Treat 浏览器 控制 like operator access: tailnet-only + deliberate node pairing.
Deep dive:
Security
.
Bonjour Discovery
Remote 网关 设置
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/网关/remote)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*