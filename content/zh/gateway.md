# 网关 Runbook - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
网关
网关 Runbook
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
网关 runbook
5-minute local startup
运行时 模型
Port与bind precedence
Hot reload modes
Operator command set
Remote access
Supervision与service lifecycle
Multiple gateways在one host
Dev profile quick path
Protocol quick 参考 (operator view)
Operational checks
Liveness
Readiness
Gap recovery
Common failure signatures
Safety guarantees
​
网关 runbook
Use这page为day-1 startup与day-2 operations的the 网关 service.
Deep troubleshooting
Symptom-first diagnostics使用exact command ladders与log signatures.
配置
Task-oriented 设置 guide + full 配置 参考.
​
5-minute local startup
1
Start the 网关
Copy
OpenClaw
网关
--port
18789
# 调试/trace mirrored到stdio
OpenClaw
网关
--port
18789
--verbose
# force-kill listener在selected port, then start
OpenClaw
网关
--force
2
Verify service health
Copy
OpenClaw
网关
status
OpenClaw
status
OpenClaw
logs
--follow
Healthy baseline:
运行时: 运行
and
RPC probe: ok
.
3
Validate 频道 readiness
Copy
OpenClaw
频道
status
--probe
网关 config reload watches the active config file path (resolved从profile/state defaults, or
OPENCLAW_CONFIG_PATH
when set).
Default mode is
网关.reload.mode="hybrid"
.
​
运行时 模型
One always-on 进程为routing, 控制 plane,与channel connections.
Single multiplexed port for:
WebSocket 控制/RPC
HTTP APIs (OpenAI-compatible, Responses, 工具 invoke)
控制 UI与hooks
Default bind mode:
loopback
.
Auth is required通过default (
网关.auth.token
/
网关.auth.password
, or
OPENCLAW_GATEWAY_TOKEN
/
OPENCLAW_GATEWAY_PASSWORD
).
​
Port与bind precedence
Setting
Resolution order
网关 port
--port
→
OPENCLAW_GATEWAY_PORT
→
网关.port
→
18789
Bind mode
命令行界面/override →
网关.bind
→
loopback
​
Hot reload modes
网关.reload.mode
Behavior
off
No config reload
hot
Apply only hot-safe changes
restart
Restart在reload-required changes
hybrid
(default)
Hot-apply when safe, restart when required
​
Operator command set
Copy
OpenClaw
网关
status
OpenClaw
网关
status
--deep
OpenClaw
网关
status
--JSON
OpenClaw
网关
安装
OpenClaw
网关
restart
OpenClaw
网关
stop
OpenClaw
logs
--follow
OpenClaw
doctor
​
Remote access
Preferred: Tailscale/VPN.
Fallback: SSH tunnel.
Copy
ssh
-N
-L
18789:127.0.0.1:18789
user@host
Then connect clients to
ws://127.0.0.1:18789
locally.
If 网关 auth is configured, clients still must send auth (
token
/
password
) even over SSH tunnels.
See:
Remote 网关
,
认证
,
Tailscale
.
​
Supervision与service lifecycle
Use supervised runs为production-like reliability.
macOS (launchd)
Linux (systemd user)
Linux (system service)
Copy
OpenClaw
网关
安装
OpenClaw
网关
status
OpenClaw
网关
restart
OpenClaw
网关
stop
LaunchAgent labels are
ai.OpenClaw.网关
(default) or
ai.OpenClaw.<profile>
(named profile).
OpenClaw doctor
audits与repairs service config drift.
Copy
OpenClaw
网关
安装
systemctl
--user
enable
--now
OpenClaw-网关[-
<
profil
e
>
].service
OpenClaw
网关
status
For persistence after logout, enable lingering:
Copy
sudo
loginctl
enable-linger
<
use
r
>
Use a system unit为multi-user/always-on hosts.
Copy
sudo
systemctl
daemon-reload
sudo
systemctl
enable
--now
OpenClaw-网关[-
<
profil
e
>
].service
​
Multiple gateways在one host
Most setups should run
one
网关.
Use multiple only为strict isolation/redundancy (for example a rescue profile).
Checklist per instance:
Unique
网关.port
Unique
OPENCLAW_CONFIG_PATH
Unique
OPENCLAW_STATE_DIR
Unique
智能体.defaults.工作空间
示例：
Copy
OPENCLAW_CONFIG_PATH
=
~/.OpenClaw/a.JSON
OPENCLAW_STATE_DIR
=
~/.OpenClaw-a
OpenClaw
网关
--port
19001
OPENCLAW_CONFIG_PATH
=
~/.OpenClaw/b.JSON
OPENCLAW_STATE_DIR
=
~/.OpenClaw-b
OpenClaw
网关
--port
19002
See:
Multiple gateways
.
​
Dev profile quick path
Copy
OpenClaw
--dev
设置
OpenClaw
--dev
网关
--allow-unconfigured
OpenClaw
--dev
status
Defaults include isolated state/config与base 网关 port
19001
.
​
Protocol quick 参考 (operator view)
First client frame must be
connect
.
网关 returns
hello-ok
snapshot (
在线状态
,
health
,
stateVersion
,
uptimeMs
, limits/policy).
Requests:
req(method, params)
→
res(ok/payload|error)
.
Common events:
connect.challenge
,
智能体
,
chat
,
在线状态
,
tick
,
health
,
heartbeat
,
shutdown
.
智能体 runs are two-stage:
Immediate accepted ack (
status:"accepted"
)
Final completion response (
status:"ok"|"error"
),使用streamed
智能体
events在between.
See full protocol docs:
网关 Protocol
.
​
Operational checks
​
Liveness
Open WS与send
connect
.
Expect
hello-ok
response使用snapshot.
​
Readiness
Copy
OpenClaw
网关
status
OpenClaw
频道
status
--probe
OpenClaw
health
​
Gap recovery
Events are not replayed. On sequence gaps, refresh state (
health
,
system-在线状态
) before continuing.
​
Common failure signatures
Signature
Likely issue
refusing到bind 网关 ... without auth
Non-loopback bind without token/password
another 网关 instance is already listening
/
EADDRINUSE
Port conflict
网关 start blocked: set 网关.mode=local
Config set到remote mode
unauthorized
during connect
Auth mismatch between client与网关
For full diagnosis ladders, use
网关 Troubleshooting
.
​
Safety guarantees
网关 protocol clients fail fast when 网关 is unavailable (no implicit direct-频道 fallback).
Invalid/non-connect first frames are rejected与closed.
Graceful shutdown emits
shutdown
event before socket close.
Related:
Troubleshooting
Background 进程
配置
Health
Doctor
认证
配置
I
[查看英文原版](https://docs.OpenClaw.ai/网关)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*