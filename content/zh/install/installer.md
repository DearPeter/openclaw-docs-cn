# Installer Internals - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
安装 概述
安装er Internals
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
安装er internals
Quick commands
安装.sh
Flow (安装.sh)
Source checkout detection
Examples (安装.sh)
安装-命令行界面.sh
Flow (安装-命令行界面.sh)
Examples (安装-命令行界面.sh)
安装.ps1
Flow (安装.ps1)
Examples (安装.ps1)
CI与automation
Troubleshooting
​
安装er internals
OpenClaw ships three installer scripts, served from
OpenClaw.ai
.
Script
Platform
What it does
安装.sh
macOS / Linux / WSL
安装s Node if needed, installs OpenClaw via npm (default)或git,与can run 入门指南.
安装-命令行界面.sh
macOS / Linux / WSL
安装s Node + OpenClaw into a local prefix (
~/.OpenClaw
). No root required.
安装.ps1
Windows (PowerShell)
安装s Node if needed, installs OpenClaw via npm (default)或git,与can run 入门指南.
​
Quick commands
安装.sh
安装-命令行界面.sh
安装.ps1
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--帮助
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
-s
--
--帮助
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
Tag beta
-
NoOnboard
-
DryRun
If 安装 succeeds but
OpenClaw
is not found在a new terminal, see
Node.js troubleshooting
.
​
安装.sh
Recommended为most interactive installs在macOS/Linux/WSL.
​
Flow (安装.sh)
1
Detect OS
Supports macOS与Linux (including WSL). If macOS is detected, installs Homebrew if missing.
2
Ensure Node.js 22+
Checks Node version与installs Node 22 if needed (Homebrew在macOS, NodeSource 设置 scripts在Linux apt/dnf/yum).
3
Ensure Git
安装s Git if missing.
4
安装 OpenClaw
npm
method (default): global npm 安装
git
method: clone/update repo, 安装 deps使用pnpm, 构建, then 安装 wrapper at
~/.local/bin/OpenClaw
5
Post-安装 任务
Runs
OpenClaw doctor --non-interactive
on upgrades与git installs (best effort)
Attempts 入门指南 when appropriate (TTY available, 入门指南 not disabled,与引导/config checks pass)
Defaults
SHARP_IGNORE_GLOBAL_LIBVIPS=1
​
Source checkout detection
If run inside an OpenClaw checkout (
package.JSON
+
pnpm-工作空间.YAML
), the script offers:
use checkout (
git
), or
use global 安装 (
npm
)
If no TTY is available与no 安装 method is set, it defaults to
npm
and warns.
The script exits使用code
2
for invalid method selection或invalid
--安装-method
values.
​
Examples (安装.sh)
Default
Skip 入门指南
Git 安装
Dry run
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--no-onboard
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--安装-method
git
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--dry-run
Flags 参考
Flag
Description
--安装-method npm|git
Choose 安装 method (default:
npm
). Alias:
--method
--npm
Shortcut为npm method
--git
Shortcut为git method. Alias:
--GitHub
--version <version|dist-tag>
npm version或dist-tag (default:
latest
)
--beta
Use beta dist-tag if available, else fallback to
latest
--git-dir <path>
Checkout directory (default:
~/OpenClaw
). Alias:
--dir
--no-git-update
Skip
git pull
for existing checkout
--no-提示词
Disable prompts
--no-onboard
Skip 入门指南
--onboard
Enable 入门指南
--dry-run
Print actions without applying changes
--verbose
Enable 调试 output (
set -x
, npm notice-level logs)
--帮助
Show usage (
-h
)
Environment variables 参考
Variable
Description
OPENCLAW_INSTALL_METHOD=git|npm
安装 method
OPENCLAW_VERSION=latest|next|<semver>
npm version或dist-tag
OPENCLAW_BETA=0|1
Use beta if available
OPENCLAW_GIT_DIR=<path>
Checkout directory
OPENCLAW_GIT_UPDATE=0|1
Toggle git updates
OPENCLAW_NO_PROMPT=1
Disable prompts
OPENCLAW_NO_ONBOARD=1
Skip 入门指南
OPENCLAW_DRY_RUN=1
Dry run mode
OPENCLAW_VERBOSE=1
调试 mode
OPENCLAW_NPM_LOGLEVEL=error|warn|notice
npm log level
SHARP_IGNORE_GLOBAL_LIBVIPS=0|1
控制 sharp/libvips behavior (default:
1
)
​
安装-命令行界面.sh
Designed为environments where you want everything under a local prefix (default
~/.OpenClaw
)与no system Node dependency.
​
Flow (安装-命令行界面.sh)
1
安装 local Node 运行时
Downloads Node tarball (default
22.22.0
) to
<prefix>/工具/node-v<version>
and verifies SHA-256.
2
Ensure Git
If Git is missing, attempts 安装 via apt/dnf/yum在Linux或Homebrew在macOS.
3
安装 OpenClaw under prefix
安装s使用npm using
--prefix <prefix>
, then writes wrapper to
<prefix>/bin/OpenClaw
.
​
Examples (安装-命令行界面.sh)
Default
Custom prefix + version
Automation JSON output
Run 入门指南
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
-s
--
--prefix
/opt/OpenClaw
--version
latest
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
-s
--
--JSON
--prefix
/opt/OpenClaw
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
-s
--
--onboard
Flags 参考
Flag
Description
--prefix <path>
安装 prefix (default:
~/.OpenClaw
)
--version <ver>
OpenClaw version或dist-tag (default:
latest
)
--node-version <ver>
Node version (default:
22.22.0
)
--JSON
Emit NDJSON events
--onboard
Run
OpenClaw onboard
after 安装
--no-onboard
Skip 入门指南 (default)
--set-npm-prefix
On Linux, force npm prefix to
~/.npm-global
if current prefix is not writable
--帮助
Show usage (
-h
)
Environment variables 参考
Variable
Description
OPENCLAW_PREFIX=<path>
安装 prefix
OPENCLAW_VERSION=<ver>
OpenClaw version或dist-tag
OPENCLAW_NODE_VERSION=<ver>
Node version
OPENCLAW_NO_ONBOARD=1
Skip 入门指南
OPENCLAW_NPM_LOGLEVEL=error|warn|notice
npm log level
OPENCLAW_GIT_DIR=<path>
Legacy cleanup lookup path (used when removing old
Peekaboo
submodule checkout)
SHARP_IGNORE_GLOBAL_LIBVIPS=0|1
控制 sharp/libvips behavior (default:
1
)
​
安装.ps1
​
Flow (安装.ps1)
1
Ensure PowerShell + Windows environment
Requires PowerShell 5+.
2
Ensure Node.js 22+
If missing, attempts 安装 via winget, then Chocolatey, then Scoop.
3
安装 OpenClaw
npm
method (default): global npm 安装 using selected
-Tag
git
method: clone/update repo, 安装/build使用pnpm,与安装 wrapper at
%USERPROFILE%\.local\bin\OpenClaw.cmd
4
Post-安装 任务
Adds needed bin directory到user PATH when possible, then runs
OpenClaw doctor --non-interactive
on upgrades与git installs (best effort).
​
Examples (安装.ps1)
Default
Git 安装
Custom git directory
Dry run
调试 trace
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
安装Method git
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
安装Method git
-
GitDir
"C:\OpenClaw"
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
DryRun
Copy
# 安装.ps1 has no dedicated -Verbose flag yet.
Set-PSDebug
-
Trace
1
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
Set-PSDebug
-
Trace
0
Flags 参考
Flag
Description
-安装Method npm|git
安装 method (default:
npm
)
-Tag <tag>
npm dist-tag (default:
latest
)
-GitDir <path>
Checkout directory (default:
%USERPROFILE%\OpenClaw
)
-NoOnboard
Skip 入门指南
-NoGitUpdate
Skip
git pull
-DryRun
Print actions only
Environment variables 参考
Variable
Description
OPENCLAW_INSTALL_METHOD=git|npm
安装 method
OPENCLAW_GIT_DIR=<path>
Checkout directory
OPENCLAW_NO_ONBOARD=1
Skip 入门指南
OPENCLAW_GIT_UPDATE=0
Disable git pull
OPENCLAW_DRY_RUN=1
Dry run mode
If
-安装Method git
is used与Git is missing, the script exits与prints the Git为Windows link.
​
CI与automation
Use non-interactive flags/env vars为predictable runs.
安装.sh (non-interactive npm)
安装.sh (non-interactive git)
安装-命令行界面.sh (JSON)
安装.ps1 (skip 入门指南)
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
-s
--
--no-提示词
--no-onboard
Copy
OPENCLAW_INSTALL_METHOD
=
git
OPENCLAW_NO_PROMPT
=
1
\
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
Copy
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装-命令行界面.sh
|
bash
-s
--
--JSON
--prefix
/opt/OpenClaw
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
​
Troubleshooting
Why is Git required?
Git is required for
git
安装 method. For
npm
installs, Git is still checked/installed到avoid
spawn git ENOENT
failures when dependencies use git URLs.
Why does npm hit EACCES在Linux?
Some Linux setups point npm global prefix到root-owned paths.
安装.sh
can switch prefix to
~/.npm-global
and append PATH exports到shell rc files (when那些files exist).
sharp/libvips issues
The scripts default
SHARP_IGNORE_GLOBAL_LIBVIPS=1
to avoid sharp building against system libvips. To override:
Copy
SHARP_IGNORE_GLOBAL_LIBVIPS
=
0
curl
-fsSL
--proto
'=https'
--tlsv1.2
https://OpenClaw.ai/安装.sh
|
bash
Windows: "npm error spawn git / ENOENT"
安装 Git为Windows, reopen PowerShell, rerun installer.
Windows: "OpenClaw is not recognized"
Run
npm config get prefix
, append
\bin
, add那directory到user PATH, then reopen PowerShell.
Windows: how到get verbose installer output
安装.ps1
does not currently expose a
-Verbose
switch.
Use PowerShell tracing为script-level diagnostics:
Copy
Set-PSDebug
-
Trace
1
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
Set-PSDebug
-
Trace
0
OpenClaw not found after 安装
Usually a PATH issue. See
Node.js troubleshooting
.
安装
Docker
I
[查看英文原版](https://docs.OpenClaw.ai/安装/installer)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*