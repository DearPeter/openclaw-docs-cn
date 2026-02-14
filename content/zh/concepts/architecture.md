# 网关 架构 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
基础概念
网关架构
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
基础概念
网关架构
Agent运行时
Agent循环
系统提示
上下文
Agent工作空间
OAuth
引导启动
引导启动
会话与记忆
会话管理
会话
会话修剪
会话 工具
记忆
压缩
多Agent
多Agent路由
在线状态
消息与传递
消息
流式传输与分块
重试策略
命令队列
本页内容
网关 架构
概述
Components与flows
网关 (daemon)
Clients (mac app / 命令行界面 / 网页 admin)
节点 (macOS / iOS / Android / headless)
WebChat
Connection lifecycle (single client)
Wire protocol (summary)
Pairing + local trust
Protocol typing与codegen
Remote access
Operations snapshot
Invariants
​
网关 架构
Last updated: 2026-01-22
​
概述
A single long‑lived
网关
owns all messaging surfaces (WhatsApp via
Baileys, Telegram via grammY, Slack, Discord, Signal, iMessage, WebChat).
控制-plane clients (macOS app, 命令行界面, 网页 UI, automations) connect到the
网关 over
WebSocket
on the configured bind host (default
127.0.0.1:18789
).
节点
(macOS/iOS/Android/headless) also connect over
WebSocket
, but
declare
role: node
with explicit caps/commands.
One 网关 per host; it is the only place那opens a WhatsApp 会话.
A
画布 host
(default
18793
) serves 智能体‑editable HTML与A2UI.
​
Components与flows
​
网关 (daemon)
Maintains provider connections.
Exposes a typed WS API (requests, responses, server‑push events).
Validates inbound frames against JSON Schema.
Emits events like
智能体
,
chat
,
在线状态
,
health
,
heartbeat
,
cron
.
​
Clients (mac app / 命令行界面 / 网页 admin)
One WS connection per client.
Send requests (
health
,
status
,
send
,
智能体
,
system-在线状态
).
Subscribe到events (
tick
,
智能体
,
在线状态
,
shutdown
).
​
节点 (macOS / iOS / Android / headless)
Connect到the
same WS server
with
role: node
.
Provide a device identity in
connect
; pairing is
device‑based
(role
node
) and
approval lives在the device pairing store.
Expose commands like
画布.*
,
camera.*
,
screen.record
,
location.get
.
Protocol details:
网关 protocol
​
WebChat
Static UI那uses the 网关 WS API为chat history与sends.
In remote setups, connects through the same SSH/Tailscale tunnel as other
clients.
​
Connection lifecycle (single client)
​
Wire protocol (summary)
Transport: WebSocket, text frames使用JSON payloads.
First frame
must
be
connect
.
After handshake:
Requests:
{type:"req", id, method, params}
→
{type:"res", id, ok, payload|error}
Events:
{type:"event", event, payload, seq?, stateVersion?}
If
OPENCLAW_GATEWAY_TOKEN
(or
--token
) is set,
connect.params.auth.token
must match或the socket closes.
Idempotency keys are required为side‑effecting methods (
send
,
智能体
) to
safely 重试; the server keeps a short‑lived dedupe cache.
节点 must include
role: "node"
plus caps/commands/permissions in
connect
.
​
Pairing + local trust
All WS clients (operators + 节点) include a
device identity
on
connect
.
New device IDs require pairing approval; the 网关 issues a
device token
for subsequent connects.
Local
connects (loopback或the 网关 host’s own tailnet address) can be
auto‑approved到keep same‑host UX smooth.
Non‑local
connects must sign the
connect.challenge
nonce与require
explicit approval.
网关 auth (
网关.auth.*
) still applies to
all
connections, local or
remote.
Details:
网关 protocol
,
Pairing
,
Security
.
​
Protocol typing与codegen
TypeBox schemas define the protocol.
JSON Schema is generated从those schemas.
Swift 模型 are generated从the JSON Schema.
​
Remote access
Preferred: Tailscale或VPN.
Alternative: SSH tunnel
Copy
ssh
-N
-L
18789:127.0.0.1:18789
user@host
The same handshake + auth token apply over the tunnel.
TLS + optional pinning can be enabled为WS在remote setups.
​
Operations snapshot
Start:
OpenClaw 网关
(foreground, logs到stdout).
Health:
health
over WS (also included in
hello-ok
).
Supervision: launchd/systemd为auto‑restart.
​
Invariants
Exactly one 网关 controls a single Baileys 会话 per host.
Handshake is mandatory; any non‑JSON或non‑connect first frame is a hard close.
Events are not replayed; clients must refresh在gaps.
Agent运行时
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/架构#operations-snapshot)命令行界面-%2F-网页-admin)adless)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*