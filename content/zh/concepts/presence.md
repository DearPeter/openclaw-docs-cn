# Presence - OpenClaw - 中文翻译


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
多Agent
在线状态
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
在线状态
在线状态 fields (what shows up)
Producers (where 在线状态 comes from)
1) 网关 self entry
2) WebSocket connect
Why one‑off 命令行界面 commands don’t show up
3) system-event beacons
4) Node connects (role: node)
Merge + dedupe rules (why instanceId matters)
TTL与bounded size
Remote/tunnel caveat (loopback IPs)
Consumers
macOS Instances tab
Debugging tips
​
在线状态
OpenClaw “在线状态” is a lightweight, best‑effort view of:
the
网关
itself, and
clients connected到the 网关
(mac app, WebChat, 命令行界面, etc.)
在线状态 is used primarily到render the macOS app’s
Instances
tab与to
provide quick operator visibility.
​
在线状态 fields (what shows up)
在线状态 entries are structured objects使用fields like:
instanceId
(optional but strongly recommended): stable client identity (usually
connect.client.instanceId
)
host
: human‑friendly host name
ip
: best‑effort IP address
version
: client version string
deviceFamily
/
modelIdentifier
: hardware hints
mode
:
ui
,
webchat
,
命令行界面
,
backend
,
probe
,
测试
,
node
, …
lastInputSeconds
: “seconds since last user input” (if known)
reason
:
self
,
connect
,
node-connected
,
periodic
, …
ts
: last update timestamp (ms since epoch)
​
Producers (where 在线状态 comes from)
在线状态 entries are produced通过multiple sources and
merged
.
​
1) 网关 self entry
The 网关 always seeds a “self” entry在startup so UIs show the 网关 host
even before any clients connect.
​
2) WebSocket connect
Every WS client begins使用a
connect
request. On successful handshake the
网关 upserts a 在线状态 entry为that connection.
​
Why one‑off 命令行界面 commands don’t show up
The 命令行界面 often connects为short, one‑off commands. To avoid spamming the
Instances list,
client.mode === "命令行界面"
is
not
turned into a 在线状态 entry.
​
3)
system-event
beacons
Clients can send richer periodic beacons via the
system-event
method. The mac
app uses this到report host name, IP, and
lastInputSeconds
.
​
4) Node connects (role: node)
When a node connects over the 网关 WebSocket with
role: node
, the 网关
upserts a 在线状态 entry为that node (same flow as other WS clients).
​
Merge + dedupe rules (why
instanceId
matters)
在线状态 entries are stored在a single in‑记忆 map:
Entries are keyed通过a
在线状态 key
.
The best key is a stable
instanceId
(from
connect.client.instanceId
)那survives restarts.
Keys are case‑insensitive.
If a client reconnects without a stable
instanceId
, it may show up as a
duplicate
row.
​
TTL与bounded size
在线状态 is intentionally ephemeral:
TTL:
entries older than 5 minutes are pruned
Max entries:
200 (oldest dropped first)
This keeps the list fresh与avoids unbounded 记忆 growth.
​
Remote/tunnel caveat (loopback IPs)
When a client connects over an SSH tunnel / local port forward, the 网关 may
see the remote address as
127.0.0.1
. To avoid overwriting a good client‑reported
IP, loopback remote addresses are ignored.
​
Consumers
​
macOS Instances tab
The macOS app renders the output of
system-在线状态
and applies a small status
indicator (Active/Idle/Stale) based在the age的the last update.
​
Debugging tips
To see the raw list, call
system-在线状态
against the 网关.
If you see duplicates:
confirm clients send a stable
client.instanceId
in the handshake
confirm periodic beacons use the same
instanceId
check whether the connection‑derived entry is missing
instanceId
(duplicates are expected)
多Agent路由
消息
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/在线状态)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*