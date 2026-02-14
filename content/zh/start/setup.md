# 设置 - OpenClaw - 中文翻译


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
Developer 设置
设置
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
帮助
帮助
Troubleshooting
FAQ
Community
OpenClaw Lore
Environment与debugging
Environment Variables
Debugging
Testing
Scripts
Node 运行时
Node.js
压缩 internals
会话管理 Deep Dive
Developer 设置
设置
Contributing
Submitting a PR
Submitting an Issue
CI Pipeline
Docs meta
Docs 中心
Docs directory
本页内容
设置
TL;DR
Prereqs (from source)
Tailoring strategy (so updates don’t hurt)
Run the 网关从this repo
Stable workflow (macOS app first)
Bleeding edge workflow (网关在a terminal)
0) (Optional) Run the macOS app从source too
1) Start the dev 网关
2) Point the macOS app在your 运行 网关
3) Verify
Common footguns
Credential storage map
Updating (without wrecking your 设置)
Linux (systemd user service)
Related docs
​
设置
If you are setting up为the first time, start with
Getting Started
.
For 向导 details, see
入门指南 向导
.
Last updated: 2026-01-01
​
TL;DR
Tailoring lives outside the repo:
~/.OpenClaw/工作空间
(工作空间) +
~/.OpenClaw/OpenClaw.JSON
(config).
Stable workflow:
安装 the macOS app; let it run the bundled 网关.
Bleeding edge workflow:
run the 网关 yourself via
pnpm 网关:watch
, then let the macOS app attach在Local mode.
​
Prereqs (from source)
Node
>=22
pnpm
Docker (optional; only为containerized 设置/e2e — see
Docker
)
​
Tailoring strategy (so updates don’t hurt)
If you want “100% tailored到me”
and
easy updates, keep your customization in:
Config:
~/.OpenClaw/OpenClaw.JSON
(JSON/JSON5-ish)
工作空间:
~/.OpenClaw/工作空间
(技能, prompts, memories; make it a private git repo)
引导 once:
Copy
OpenClaw
设置
From inside这repo, use the local 命令行界面 entry:
Copy
OpenClaw
设置
If you don’t have a global 安装 yet, run it via
pnpm OpenClaw 设置
.
​
Run the 网关从this repo
After
pnpm 构建
, you can run the packaged 命令行界面 directly:
Copy
node
OpenClaw.mjs
网关
--port
18789
--verbose
​
Stable workflow (macOS app first)
安装 + launch
OpenClaw.app
(menu bar).
Complete the 入门指南/permissions checklist (TCC prompts).
Ensure 网关 is
Local
and 运行 (the app manages it).
Link surfaces (example: WhatsApp):
Copy
OpenClaw
频道
登录
Sanity check:
Copy
OpenClaw
health
If 入门指南 is not available在your 构建:
Run
OpenClaw 设置
, then
OpenClaw 频道 登录
, then start the 网关 manually (
OpenClaw 网关
).
​
Bleeding edge workflow (网关在a terminal)
Goal: work在the TypeScript 网关, get hot reload, keep the macOS app UI attached.
​
0) (Optional) Run the macOS app从source too
If you also want the macOS app在the bleeding edge:
Copy
./scripts/restart-mac.sh
​
1) Start the dev 网关
Copy
pnpm
安装
pnpm
网关:watch
网关:watch
runs the 网关在watch mode与reloads在TypeScript changes.
​
2) Point the macOS app在your 运行 网关
In
OpenClaw.app
:
Connection Mode:
Local
The app will attach到the 运行 网关在the configured port.
​
3) Verify
In-app 网关 status should read
“Using existing 网关 …”
Or via 命令行界面:
Copy
OpenClaw
health
​
Common footguns
Wrong port:
网关 WS defaults to
ws://127.0.0.1:18789
; keep app + 命令行界面在the same port.
Where state lives:
Credentials:
~/.OpenClaw/credentials/
会话:
~/.OpenClaw/智能体/<agentId>/sessions/
Logs:
/tmp/OpenClaw/
​
Credential storage map
Use这when debugging auth或deciding what到back up:
WhatsApp
:
~/.OpenClaw/credentials/WhatsApp/<accountId>/creds.JSON
Telegram bot token
: config/env or
频道.Telegram.tokenFile
Discord bot token
: config/env (token file not yet supported)
Slack tokens
: config/env (
频道.Slack.*
)
Pairing allowlists
:
~/.OpenClaw/credentials/<频道>-allowFrom.JSON
模型 auth profiles
:
~/.OpenClaw/智能体/<agentId>/智能体/auth-profiles.JSON
Legacy OAuth import
:
~/.OpenClaw/credentials/oauth.JSON
More detail:
Security
.
​
Updating (without wrecking your 设置)
Keep
~/.OpenClaw/工作空间
and
~/.OpenClaw/
as “your stuff”; don’t put personal prompts/config into the
OpenClaw
repo.
Updating source:
git pull
+
pnpm 安装
(when lockfile changed) + keep using
pnpm 网关:watch
.
​
Linux (systemd user service)
Linux installs use a systemd
user
service. By default, systemd stops user
services在logout/idle, which kills the 网关. 入门指南 attempts到enable
lingering为you (may prompt为sudo). If it’s still off, run:
Copy
sudo
loginctl
enable-linger
$USER
For always-on或multi-user servers, consider a
system
service instead的a
user service (no lingering needed). See
网关 runbook
for the systemd notes.
​
Related docs
网关 runbook
(flags, supervision, ports)
网关 配置
(config schema + examples)
Discord
and
Telegram
(reply tags + replyToMode settings)
OpenClaw assistant 设置
macOS app
(网关 lifecycle)
会话管理 Deep Dive
Submitting a PR
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/start/设置)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*