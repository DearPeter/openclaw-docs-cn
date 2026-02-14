# Environment Variables - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Environment与debugging
Environment Variables
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
Environment variables
Precedence (highest → lowest)
Config env block
Shell env import
Env var substitution在config
Path-related env vars
OPENCLAW_HOME
Related
​
Environment variables
OpenClaw pulls environment variables从multiple sources. The rule is
never override existing values
.
​
Precedence (highest → lowest)
进程 environment
(what the 网关 进程 already has从the parent shell/daemon).
.env
in the current 工作目录
(dotenv default; does not override).
Global
.env
at
~/.OpenClaw/.env
(aka
$OPENCLAW_STATE_DIR/.env
; does not override).
Config
env
block
in
~/.OpenClaw/OpenClaw.JSON
(applied only if missing).
Optional 登录-shell import
(
env.shellEnv.enabled
or
OPENCLAW_LOAD_SHELL_ENV=1
), applied only为missing expected keys.
If the config file is missing entirely, step 4 is skipped; shell import still runs if enabled.
​
Config
env
block
Two equivalent ways到set inline env vars (both are non-overriding):
Copy
{
env
:
{
OPENROUTER_API_KEY
:
"sk-or-..."
,
vars
:
{
GROQ_API_KEY
:
"gsk-..."
,
}
,
}
,
}
​
Shell env import
env.shellEnv
runs your 登录 shell与imports only
missing
expected keys:
Copy
{
env
:
{
shellEnv
:
{
enabled
:
true
,
timeoutMs
:
15000
,
}
,
}
,
}
Env var equivalents:
OPENCLAW_LOAD_SHELL_ENV=1
OPENCLAW_SHELL_ENV_TIMEOUT_MS=15000
​
Env var substitution在config
You can 参考 env vars directly在config string values using
${VAR_NAME}
syntax:
Copy
{
模型
:
{
提供者
:
{
"vercel-网关"
:
{
apiKey
:
"${VERCEL_GATEWAY_API_KEY}"
,
}
,
}
,
}
,
}
See
配置: Env var substitution
for full details.
​
Path-related env vars
Variable
Purpose
OPENCLAW_HOME
Override the home directory used为all internal path resolution (
~/.OpenClaw/
, 智能体 dirs, sessions, credentials). Useful when 运行 OpenClaw as a dedicated service user.
OPENCLAW_STATE_DIR
Override the state directory (default
~/.OpenClaw
).
OPENCLAW_CONFIG_PATH
Override the config file path (default
~/.OpenClaw/OpenClaw.JSON
).
​
OPENCLAW_HOME
When set,
OPENCLAW_HOME
replaces the system home directory (
$HOME
/
os.homedir()
)为all internal path resolution. This enables full filesystem isolation为headless service accounts.
Precedence:
OPENCLAW_HOME
>
$HOME
>
USERPROFILE
>
os.homedir()
Example
(macOS LaunchDaemon):
Copy
<
key
>EnvironmentVariables</
key
>
<
dict
>
<
key
>OPENCLAW_HOME</
key
>
<
string
>/Users/kira</
string
>
</
dict
>
OPENCLAW_HOME
can also be set到a tilde path (e.g.
~/svc
), which gets expanded using
$HOME
before use.
​
Related
网关 配置
FAQ: env vars与.env loading
模型 概述
OpenClaw Lore
Debugging
I
[查看英文原版](https://docs.OpenClaw.ai/帮助/environment)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*