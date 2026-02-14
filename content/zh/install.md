# 安装 - OpenClaw - 中文翻译


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
安装 概述
安装
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
安装
System requirements
安装 methods
Other 安装 methods
After 安装
Troubleshooting: OpenClaw not found
Update / uninstall
​
安装
Already followed
Getting Started
? You’re all set —这page is为alternative 安装 methods, platform-specific instructions,与maintenance.
​
System requirements
Node 22+
(the
installer script
will 安装 it if missing)
macOS, Linux,或Windows
pnpm
only if you build从source
On Windows, we strongly recommend 运行 OpenClaw under
WSL2
.
​
安装 methods
The
installer script
is the recommended way到安装 OpenClaw. It handles Node detection, installation,与入门指南在one step.
安装er script
Downloads the 命令行界面, installs it globally via npm,与launches the 入门指南 向导.
macOS / Linux / WSL2
Windows (PowerShell)
Copy
curl
-fsSL
https://OpenClaw.ai/安装.sh
|
bash
Copy
iwr
-
useb https:
//
OpenClaw.ai
/
安装.ps1
|
iex
That’s it — the script handles Node detection, installation,与入门指南.
To skip 入门指南与just 安装 the binary:
macOS / Linux / WSL2
Windows (PowerShell)
Copy
curl
-fsSL
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--no-onboard
Copy
&
([
scriptblock
]::Create((iwr
-
useb https:
//
OpenClaw.ai
/
安装.ps1)))
-
NoOnboard
For all flags, env vars,与CI/automation options, see
安装er internals
.
npm / pnpm
If you already have Node 22+与prefer到manage the 安装 yourself:
npm
pnpm
Copy
npm
安装
-g
OpenClaw@latest
OpenClaw
onboard
--安装-daemon
sharp 构建 errors?
If you have libvips installed globally (common在macOS via Homebrew) and
sharp
fails, force prebuilt binaries:
Copy
SHARP_IGNORE_GLOBAL_LIBVIPS
=
1
npm
安装
-g
OpenClaw@latest
If you see
sharp: Please add node-gyp到your dependencies
, either 安装 构建 tooling (macOS: Xcode CLT +
npm 安装 -g node-gyp
)或use the env var above.
Copy
pnpm
add
-g
OpenClaw@latest
pnpm
approve-builds
-g
# approve OpenClaw, node-llama-cpp, sharp, etc.
OpenClaw
onboard
--安装-daemon
pnpm requires explicit approval为packages使用build scripts. After the first 安装 shows the “Ignored 构建 scripts” warning, run
pnpm approve-builds -g
and select the listed packages.
From source
For contributors或anyone who wants到run从a local checkout.
1
Clone与build
Clone the
OpenClaw repo
and 构建:
Copy
git
clone
https://GitHub.com/OpenClaw/OpenClaw.git
cd
OpenClaw
pnpm
安装
pnpm
ui:构建
pnpm
构建
2
Link the 命令行界面
Make the
OpenClaw
command available globally:
Copy
pnpm
link
--global
Alternatively, skip the link与run commands via
pnpm OpenClaw ...
from inside the repo.
3
Run 入门指南
Copy
OpenClaw
onboard
--安装-daemon
For deeper development workflows, see
设置
.
​
Other 安装 methods
Docker
Containerized或headless deployments.
Nix
Declarative 安装 via Nix.
Ansible
Automated fleet provisioning.
Bun
命令行界面-only usage via the Bun 运行时.
​
After 安装
Verify everything is working:
Copy
OpenClaw
doctor
# check为config issues
OpenClaw
status
# 网关 status
OpenClaw
dashboard
# open the 浏览器 UI
If you need custom 运行时 paths, use:
OPENCLAW_HOME
for home-directory based internal paths
OPENCLAW_STATE_DIR
for mutable state location
OPENCLAW_CONFIG_PATH
for config file location
See
Environment vars
for precedence与full details.
​
Troubleshooting:
OpenClaw
not found
PATH diagnosis与fix
Quick diagnosis:
Copy
node
-v
npm
-v
npm
prefix
-g
echo
"$PATH"
If
$(npm prefix -g)/bin
(macOS/Linux) or
$(npm prefix -g)
(Windows) is
not
in your
$PATH
, your shell can’t find global npm binaries (including
OpenClaw
).
Fix — add it到your shell startup file (
~/.zshrc
or
~/.bashrc
):
Copy
export
PATH
=
"$(
npm
prefix
-g
)/bin:$PATH"
On Windows, add the output of
npm prefix -g
to your PATH.
Then open a new terminal (or
rehash
in zsh /
hash -r
in bash).
​
Update / uninstall
Updating
Keep OpenClaw up到date.
Migrating
Move到a new machine.
Uninstall
Remove OpenClaw completely.
安装er Internals
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/安装)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*