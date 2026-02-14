# Docker - OpenClaw - 中文翻译


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
Other 安装 methods
Docker
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
安装 概述
安装
安装er Internals
Other 安装 methods
Docker
Nix
Ansible
Bun (Experimental)
Maintenance
Updating
Migration Guide
Uninstall
Hosting与deployment
Fly.io
Hetzner
GCP
macOS VMs
exe.dev
Deploy在Railway
Deploy在Render
Deploy在Northflank
Advanced
Development 频道
本页内容
Docker (optional)
Is Docker right为me?
Requirements
Containerized 网关 (Docker Compose)
Quick start (recommended)
Shell 帮助ers (optional)
Manual flow (compose)
控制 UI token + pairing (Docker)
Extra mounts (optional)
Persist the entire container home (optional)
安装 extra apt packages (optional)
Power-user / full-featured container (opt-in)
Permissions + EACCES
Faster rebuilds (recommended)
频道 设置 (optional)
OpenAI Codex OAuth (headless Docker)
Health check
E2E smoke 测试 (Docker)
QR import smoke 测试 (Docker)
Notes
智能体 Sandbox (host 网关 + Docker 工具)
What it does
Per-智能体 sandbox profiles (multi-智能体)
Default behavior
Enable sandboxing
构建 the default sandbox image
Sandbox common image (optional)
Sandbox 浏览器 image
Custom sandbox image
工具 policy (allow/deny)
修剪 strategy
Security notes
Troubleshooting
​
Docker (optional)
Docker is
optional
. Use it only if you want a containerized 网关或to validate the Docker flow.
​
Is Docker right为me?
Yes
: you want an isolated, throwaway 网关 environment或to run OpenClaw在a host without local installs.
No
: you’re 运行在your own machine与just want the fastest dev loop. Use the normal 安装 flow instead.
Sandboxing note
: 智能体 sandboxing uses Docker too, but it does
not
require the full 网关到run在Docker. See
Sandboxing
.
This guide covers:
Containerized 网关 (full OpenClaw在Docker)
Per-会话 智能体 Sandbox (host 网关 + Docker-isolated 智能体 工具)
Sandboxing details:
Sandboxing
​
Requirements
Docker Desktop (or Docker Engine) + Docker Compose v2
Enough disk为images + logs
​
Containerized 网关 (Docker Compose)
​
Quick start (recommended)
From repo root:
Copy
./docker-设置.sh
This script:
builds the 网关 image
runs the 入门指南 向导
prints optional provider 设置 hints
starts the 网关 via Docker Compose
generates a 网关 token与writes it to
.env
Optional env vars:
OPENCLAW_DOCKER_APT_PACKAGES
— 安装 extra apt packages during 构建
OPENCLAW_EXTRA_MOUNTS
— add extra host bind mounts
OPENCLAW_HOME_VOLUME
— persist
/home/node
in a named volume
After it finishes:
Open
http://127.0.0.1:18789/
in your 浏览器.
Paste the token into the 控制 UI (Settings → token).
Need the URL again? Run
docker compose run --rm OpenClaw-命令行界面 dashboard --no-open
.
It writes config/工作空间在the host:
~/.OpenClaw/
~/.OpenClaw/工作空间
运行在a VPS? See
Hetzner (Docker VPS)
.
​
Shell 帮助ers (optional)
For easier day-to-day Docker 管理, 安装
ClawDock
:
Copy
mkdir
-p
~/.clawdock
&&
curl
-sL
https://raw.githubusercontent.com/OpenClaw/OpenClaw/main/scripts/shell-helpers/clawdock-helpers.sh
-o
~/.clawdock/clawdock-helpers.sh
Add到your shell config (zsh):
Copy
echo
'source ~/.clawdock/clawdock-helpers.sh'
>>
~/.zshrc
&&
source
~/.zshrc
Then use
clawdock-start
,
clawdock-stop
,
clawdock-dashboard
, etc. Run
clawdock-帮助
for all commands.
See
ClawDock
帮助er README
for details.
​
Manual flow (compose)
Copy
docker
构建
-t
OpenClaw:local
-f
Dockerfile
.
docker
compose
run
--rm
OpenClaw-命令行界面
onboard
docker
compose
up
-d
OpenClaw-网关
Note: run
docker compose ...
from the repo root. If you enabled
OPENCLAW_EXTRA_MOUNTS
or
OPENCLAW_HOME_VOLUME
, the 设置 script writes
docker-compose.extra.yml
; include it when 运行 Compose elsewhere:
Copy
docker
compose
-f
docker-compose.yml
-f
docker-compose.extra.yml
<
comman
d
>
​
控制 UI token + pairing (Docker)
If you see “unauthorized”或“disconnected (1008): pairing required”, 获取 a
fresh dashboard link与approve the 浏览器 device:
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
dashboard
--no-open
docker
compose
run
--rm
OpenClaw-命令行界面
devices
list
docker
compose
run
--rm
OpenClaw-命令行界面
devices
approve
<
requestI
d
>
More detail:
Dashboard
,
Devices
.
​
Extra mounts (optional)
If you want到mount additional host directories into the containers, set
OPENCLAW_EXTRA_MOUNTS
before 运行
docker-设置.sh
. This accepts a
comma-separated list的Docker bind mounts与applies them到both
OpenClaw-网关
and
OpenClaw-命令行界面
by generating
docker-compose.extra.yml
.
示例：
Copy
export
OPENCLAW_EXTRA_MOUNTS
=
"$HOME/.codex:/home/node/.codex:ro,$HOME/GitHub:/home/node/GitHub:rw"
./docker-设置.sh
Notes:
Paths must be shared使用Docker Desktop在macOS/Windows.
If you edit
OPENCLAW_EXTRA_MOUNTS
, rerun
docker-设置.sh
to regenerate the
extra compose file.
docker-compose.extra.yml
is generated. Don’t hand-edit it.
​
Persist the entire container home (optional)
If you want
/home/node
to persist across container recreation, set a named
volume via
OPENCLAW_HOME_VOLUME
. This creates a Docker volume与mounts it at
/home/node
, while keeping the standard config/工作空间 bind mounts. Use a
named volume here (not a bind path);为bind mounts, use
OPENCLAW_EXTRA_MOUNTS
.
示例：
Copy
export
OPENCLAW_HOME_VOLUME
=
"openclaw_home"
./docker-设置.sh
You can combine this使用extra mounts:
Copy
export
OPENCLAW_HOME_VOLUME
=
"openclaw_home"
export
OPENCLAW_EXTRA_MOUNTS
=
"$HOME/.codex:/home/node/.codex:ro,$HOME/GitHub:/home/node/GitHub:rw"
./docker-设置.sh
Notes:
If you change
OPENCLAW_HOME_VOLUME
, rerun
docker-设置.sh
to regenerate the
extra compose file.
The named volume persists until removed with
docker volume rm <name>
.
​
安装 extra apt packages (optional)
If you need system packages inside the image (for example, 构建 工具或media
libraries), set
OPENCLAW_DOCKER_APT_PACKAGES
before 运行
docker-设置.sh
.
This installs the packages during the image 构建, so they persist even if the
container is deleted.
示例：
Copy
export
OPENCLAW_DOCKER_APT_PACKAGES
=
"ffmpeg 构建-essential"
./docker-设置.sh
Notes:
This accepts a space-separated list的apt package names.
If you change
OPENCLAW_DOCKER_APT_PACKAGES
, rerun
docker-设置.sh
to rebuild
the image.
​
Power-user / full-featured container (opt-in)
The default Docker image is
security-first
and runs as the non-root
node
user. This keeps the attack surface small, but it means:
no system package installs在runtime
no Homebrew通过default
no bundled Chromium/Playwright browsers
If you want a more full-featured container, use这些opt-in knobs:
Persist
/home/node
so 浏览器 downloads与tool caches survive:
Copy
export
OPENCLAW_HOME_VOLUME
=
"openclaw_home"
./docker-设置.sh
Bake system deps into the image
(repeatable + persistent):
Copy
export
OPENCLAW_DOCKER_APT_PACKAGES
=
"git curl jq"
./docker-设置.sh
安装 Playwright browsers without
npx
(avoids npm override conflicts):
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
\
node
/app/node_modules/playwright-core/命令行界面.js
安装
chromium
If you need Playwright到安装 system deps, rebuild the image with
OPENCLAW_DOCKER_APT_PACKAGES
instead的using
--with-deps
at 运行时.
Persist Playwright 浏览器 downloads
:
Set
PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright
in
docker-compose.yml
.
Ensure
/home/node
persists via
OPENCLAW_HOME_VOLUME
,或mount
/home/node/.cache/ms-playwright
via
OPENCLAW_EXTRA_MOUNTS
.
​
Permissions + EACCES
The image runs as
node
(uid 1000). If you see permission errors on
/home/node/.OpenClaw
, make sure your host bind mounts are owned通过uid 1000.
Example (Linux host):
Copy
sudo
chown
-R
1000:1000
/path/to/OpenClaw-config
/path/to/OpenClaw-工作空间
If you choose到run as root为convenience, you accept the security tradeoff.
​
Faster rebuilds (recommended)
To speed up rebuilds, order your Dockerfile so dependency layers are cached.
This avoids re-运行
pnpm 安装
unless lockfiles change:
Copy
FROM
node:22-bookworm
# 安装 Bun (required为build scripts)
RUN
curl -fsSL https://bun.sh/安装 | bash
ENV
PATH=
"/root/.bun/bin:${PATH}"
RUN
corepack enable
WORKDIR
/app
# Cache dependencies unless package metadata changes
COPY
package.JSON pnpm-lock.YAML pnpm-工作空间.YAML .npmrc ./
COPY
ui/package.JSON ./ui/package.JSON
COPY
scripts ./scripts
RUN
pnpm 安装 --frozen-lockfile
COPY
. .
RUN
pnpm 构建
RUN
pnpm ui:安装
RUN
pnpm ui:构建
ENV
NODE_ENV=production
CMD
[
"node"
,
"dist/index.js"
]
​
频道 设置 (optional)
Use the 命令行界面 container到configure 频道, then restart the 网关 if needed.
WhatsApp (QR):
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
频道
登录
Telegram (bot token):
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
频道
add
--频道
Telegram
--token
"<token>"
Discord (bot token):
Copy
docker
compose
run
--rm
OpenClaw-命令行界面
频道
add
--频道
Discord
--token
"<token>"
Docs:
WhatsApp
,
Telegram
,
Discord
​
OpenAI Codex OAuth (headless Docker)
If you pick OpenAI Codex OAuth在the 向导, it opens a 浏览器 URL与tries
to capture a callback on
http://127.0.0.1:1455/auth/callback
. In Docker or
headless setups那callback can show a 浏览器 error. Copy the full redirect
URL you land on与paste it back into the 向导到finish auth.
​
Health check
Copy
docker
compose
执行
OpenClaw-网关
node
dist/index.js
health
--token
"$OPENCLAW_GATEWAY_TOKEN"
​
E2E smoke 测试 (Docker)
Copy
scripts/e2e/onboard-docker.sh
​
QR import smoke 测试 (Docker)
Copy
pnpm
测试:docker:qr
​
Notes
网关 bind defaults to
lan
for container use.
Dockerfile CMD uses
--allow-unconfigured
; mounted config with
网关.mode
not
local
will still start. Override CMD到enforce the guard.
The 网关 container is the source的truth为sessions (
~/.OpenClaw/智能体/<agentId>/sessions/
).
​
智能体 Sandbox (host 网关 + Docker 工具)
Deep dive:
Sandboxing
​
What it does
When
智能体.defaults.sandbox
is enabled,
non-main sessions
run 工具 inside a Docker
container. The 网关 stays在your host, but the 工具 execution is isolated:
scope:
"智能体"
by default (one container + 工作空间 per 智能体)
scope:
"会话"
for per-会话 isolation
per-scope 工作空间 folder mounted at
/工作空间
optional 智能体 工作空间 access (
智能体.defaults.sandbox.workspaceAccess
)
allow/deny 工具 policy (deny wins)
inbound media is copied into the active sandbox 工作空间 (
media/inbound/*
) so 工具 can read it (with
workspaceAccess: "rw"
,这lands在the 智能体 工作空间)
警告：
scope: "shared"
disables cross-会话 isolation. All sessions share
one container与one 工作空间.
​
Per-智能体 sandbox profiles (multi-智能体)
If you use multi-智能体 routing, each 智能体 can override sandbox + 工具 settings:
智能体.list[].sandbox
and
智能体.list[].工具
(plus
智能体.list[].工具.sandbox.工具
). This lets you run
mixed access levels在one 网关:
Full access (personal 智能体)
Read-only 工具 + read-only 工作空间 (family/work 智能体)
No filesystem/shell 工具 (public 智能体)
See
Multi-智能体 Sandbox & 工具
for examples,
precedence,与troubleshooting.
​
Default behavior
Image:
OpenClaw-sandbox:bookworm-slim
One container per 智能体
Agent工作空间 access:
workspaceAccess: "none"
(default) uses
~/.OpenClaw/sandboxes
"ro"
keeps the sandbox 工作空间 at
/工作空间
and mounts the 智能体 工作空间 read-only at
/智能体
(disables
write
/
edit
/
apply_patch
)
"rw"
mounts the 智能体 工作空间 read/write at
/工作空间
Auto-prune: idle > 24h OR age > 7d
Network:
none
by default (explicitly opt-in if you need egress)
Default allow:
执行
,
进程
,
read
,
write
,
edit
,
sessions_list
,
sessions_history
,
sessions_send
,
sessions_spawn
,
session_status
Default deny:
浏览器
,
画布
,
节点
,
cron
,
Discord
,
网关
​
Enable sandboxing
If you plan到安装 packages in
setupCommand
, note:
Default
docker.network
is
"none"
(no egress).
readOnlyRoot: true
blocks package installs.
user
must be root for
apt-get
(omit
user
or set
user: "0:0"
).
OpenClaw auto-recreates containers when
setupCommand
(or docker config) changes
unless the container was
recently used
(within ~5 minutes). Hot containers
log a warning使用the exact
OpenClaw sandbox recreate ...
command.
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
mode
:
"non-main"
,
// off | non-main | all
scope
:
"智能体"
,
// 会话 | 智能体 | shared (智能体 is default)
workspaceAccess
:
"none"
,
// none | ro | rw
workspaceRoot
:
"~/.OpenClaw/sandboxes"
,
docker
:
{
image
:
"OpenClaw-sandbox:bookworm-slim"
,
workdir
:
"/工作空间"
,
readOnlyRoot
:
true
,
tmpfs
:
[
"/tmp"
,
"/var/tmp"
,
"/run"
]
,
network
:
"none"
,
user
:
"1000:1000"
,
capDrop
:
[
"ALL"
]
,
env
:
{
LANG
:
"C.UTF-8"
}
,
setupCommand
:
"apt-get update && apt-get 安装 -y git curl jq"
,
pidsLimit
:
256
,
记忆
:
"1g"
,
memorySwap
:
"2g"
,
cpus
:
1
,
ulimits
:
{
nofile
:
{
soft
:
1024
,
hard
:
2048 }
,
nproc
:
256
,
}
,
seccompProfile
:
"/path/to/seccomp.JSON"
,
apparmorProfile
:
"OpenClaw-sandbox"
,
dns
:
[
"1.1.1.1"
,
"8.8.8.8"
]
,
extraHosts
:
[
"internal.service:10.0.0.5"
]
,
}
,
prune
:
{
idleHours
:
24
,
// 0 disables idle 修剪
maxAgeDays
:
7
,
// 0 disables max-age 修剪
}
,
}
,
}
,
}
,
工具
:
{
sandbox
:
{
工具
:
{
allow
:
[
"执行"
,
"进程"
,
"read"
,
"write"
,
"edit"
,
"sessions_list"
,
"sessions_history"
,
"sessions_send"
,
"sessions_spawn"
,
"session_status"
,
]
,
deny
:
[
"浏览器"
,
"画布"
,
"节点"
,
"cron"
,
"Discord"
,
"网关"
]
,
}
,
}
,
}
,
}
Hardening knobs live under
智能体.defaults.sandbox.docker
:
network
,
user
,
pidsLimit
,
记忆
,
memorySwap
,
cpus
,
ulimits
,
seccompProfile
,
apparmorProfile
,
dns
,
extraHosts
.
多Agent: override
智能体.defaults.sandbox.{docker,浏览器,prune}.*
per 智能体 via
智能体.list[].sandbox.{docker,浏览器,prune}.*
(ignored when
智能体.defaults.sandbox.scope
/
智能体.list[].sandbox.scope
is
"shared"
).
​
构建 the default sandbox image
Copy
scripts/sandbox-设置.sh
This builds
OpenClaw-sandbox:bookworm-slim
using
Dockerfile.sandbox
.
​
Sandbox common image (optional)
If you want a sandbox image使用common 构建 tooling (Node, Go, Rust, etc.), 构建 the common image:
Copy
scripts/sandbox-common-设置.sh
This builds
OpenClaw-sandbox-common:bookworm-slim
. To use it:
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
docker
:
{
image
:
"OpenClaw-sandbox-common:bookworm-slim"
} }
,
}
,
}
,
}
​
Sandbox 浏览器 image
To run the 浏览器 工具 inside the sandbox, 构建 the 浏览器 image:
Copy
scripts/sandbox-浏览器-设置.sh
This builds
OpenClaw-sandbox-浏览器:bookworm-slim
using
Dockerfile.sandbox-浏览器
. The container runs Chromium使用CDP enabled and
an optional noVNC observer (headful via Xvfb).
Notes:
Headful (Xvfb) reduces bot blocking vs headless.
Headless can still be used通过setting
智能体.defaults.sandbox.浏览器.headless=true
.
No full desktop environment (GNOME) is needed; Xvfb provides the display.
Use config:
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
浏览器
:
{
enabled
:
true
}
,
}
,
}
,
}
,
}
Custom 浏览器 image:
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
浏览器
:
{
image
:
"my-OpenClaw-浏览器"
} }
,
}
,
}
,
}
When enabled, the 智能体 receives:
a sandbox 浏览器 控制 URL (for the
浏览器
工具)
a noVNC URL (if enabled与headless=false)
Remember: if you use an allowlist为工具, add
浏览器
(and remove it from
deny)或the 工具 remains blocked.
Prune rules (
智能体.defaults.sandbox.prune
) apply到浏览器 containers too.
​
Custom sandbox image
构建 your own image与point config到it:
Copy
docker
构建
-t
my-OpenClaw-sbx
-f
Dockerfile.sandbox
.
Copy
{
智能体
:
{
defaults
:
{
sandbox
:
{
docker
:
{
image
:
"my-OpenClaw-sbx"
} }
,
}
,
}
,
}
​
工具 policy (allow/deny)
deny
wins over
allow
.
If
allow
is empty: all 工具 (except deny) are available.
If
allow
is non-empty: only 工具 in
allow
are available (minus deny).
​
修剪 strategy
Two knobs:
prune.idleHours
: remove containers not used在X hours (0 = disable)
prune.maxAgeDays
: remove containers older than X days (0 = disable)
示例：
Keep busy sessions but cap lifetime:
idleHours: 24
,
maxAgeDays: 7
Never prune:
idleHours: 0
,
maxAgeDays: 0
​
Security notes
Hard wall only applies to
工具
(执行/read/write/edit/apply_patch).
Host-only 工具 like 浏览器/camera/画布 are blocked通过default.
Allowing
浏览器
in sandbox
breaks isolation
(浏览器 runs在host).
​
Troubleshooting
Image missing: 构建 with
scripts/sandbox-设置.sh
or set
智能体.defaults.sandbox.docker.image
.
Container not 运行: it will auto-create per 会话在demand.
Permission errors在sandbox: set
docker.user
to a UID:GID那matches your
mounted 工作空间 ownership (or chown the 工作空间 folder).
Custom 工具 not found: OpenClaw runs commands with
sh -lc
(登录 shell), which
sources
/etc/profile
and may reset PATH. Set
docker.env.PATH
to prepend your
custom 工具 paths (e.g.,
/custom/bin:/usr/local/share/npm-global/bin
),或add
a script under
/etc/profile.d/
in your Dockerfile.
安装er Internals
Nix
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/安装/docker)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*