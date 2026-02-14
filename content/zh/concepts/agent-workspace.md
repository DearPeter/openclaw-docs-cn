# Agent 工作空间 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
基础概念
Agent工作空间
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
Agent工作空间
Default location
Extra 工作空间 folders
工作空间 file map (what each file means)
What is NOT在the 工作空间
Git backup (recommended, private)
1) Initialize the repo
2) Add a private remote (beginner-friendly options)
3) Ongoing updates
Do not commit secrets
Moving the 工作空间到a new machine
Advanced notes
​
Agent工作空间
The 工作空间 is the 智能体’s home. It is the only 工作目录 used for
file 工具与for 工作空间 上下文. Keep it private与treat it as 记忆.
这是 separate from
~/.OpenClaw/
, which stores config, credentials, and
sessions.
重要：
the 工作空间 is the
default cwd
, not a hard sandbox. 工具
resolve relative paths against the 工作空间, but absolute paths can still reach
elsewhere在the host unless sandboxing is enabled. If you need isolation, use
智能体.defaults.sandbox
(and/or per‑智能体 sandbox config).
When sandboxing is enabled and
workspaceAccess
is not
"rw"
, 工具 operate
inside a sandbox 工作空间 under
~/.OpenClaw/sandboxes
, not your host 工作空间.
​
Default location
Default:
~/.OpenClaw/工作空间
If
OPENCLAW_PROFILE
is set与not
"default"
, the default becomes
~/.OpenClaw/工作空间-<profile>
.
Override in
~/.OpenClaw/OpenClaw.JSON
:
Copy
{
智能体
:
{
工作空间
:
"~/.OpenClaw/工作空间"
,
}
,
}
OpenClaw onboard
,
OpenClaw 配置
, or
OpenClaw 设置
will create the
工作空间与seed the 引导 files if they are missing.
If you already manage the 工作空间 files yourself, you can disable 引导
file creation:
Copy
{
智能体
:
{
skipBootstrap
:
true
} }
​
Extra 工作空间 folders
Older installs may have created
~/OpenClaw
. Keeping multiple 工作空间
directories around can cause confusing auth或state drift, because only one
工作空间 is active在a time.
Recommendation:
keep a single active 工作空间. If you no longer use the
extra folders, archive或move them到Trash (for example
trash ~/OpenClaw
).
If you intentionally keep multiple workspaces, make sure
智能体.defaults.工作空间
points到the active one.
OpenClaw doctor
warns when it detects extra 工作空间 directories.
​
工作空间 file map (what each file means)
These are the standard files OpenClaw expects inside the 工作空间:
智能体.md
Operating instructions为the agent与how it should use 记忆.
Loaded在the start的every 会话.
Good place为rules, priorities,与“how到behave” details.
SOUL.md
Persona, tone,与boundaries.
Loaded every 会话.
USER.md
Who the user is与how到address them.
Loaded every 会话.
IDENTITY.md
The 智能体’s name, vibe,与emoji.
Created/updated during the 引导 ritual.
工具.md
Notes about your local 工具与conventions.
Does not 控制 工具 availability; it is only guidance.
HEARTBEAT.md
Optional tiny checklist为heartbeat runs.
Keep it short到avoid token burn.
BOOT.md
Optional startup checklist executed在网关 restart when internal hooks are enabled.
Keep it short; use the 消息 tool为outbound sends.
引导.md
One-time first-run ritual.
Only created为a brand-new 工作空间.
Delete it after the ritual is complete.
记忆/YYYY-MM-DD.md
Daily 记忆 log (one file per day).
Recommended到read today + yesterday在会话 start.
记忆.md
(optional)
Curated long-term 记忆.
Only load在the main, private 会话 (not shared/group contexts).
See
记忆
for the workflow与automatic 记忆 flush.
技能/
(optional)
工作空间-specific 技能.
Overrides managed/bundled 技能 when names collide.
画布/
(optional)
画布 UI files为node displays (for example
画布/index.html
).
If any 引导 file is missing, OpenClaw injects a “missing file” marker into
the 会话与continues. Large 引导 files are truncated when injected;
adjust the limit with
智能体.defaults.bootstrapMaxChars
(default: 20000).
OpenClaw 设置
can recreate missing defaults without overwriting existing
files.
​
What is NOT在the 工作空间
These live under
~/.OpenClaw/
and should NOT be committed到the 工作空间 repo:
~/.OpenClaw/OpenClaw.JSON
(config)
~/.OpenClaw/credentials/
(OAuth tokens, API keys)
~/.OpenClaw/智能体/<agentId>/sessions/
(会话 transcripts + metadata)
~/.OpenClaw/技能/
(managed 技能)
If you need到migrate sessions或config, copy them separately与keep them
out的version 控制.
​
Git backup (recommended, private)
Treat the 工作空间 as private 记忆. Put it在a
private
git repo so it is
backed up与recoverable.
Run这些steps在the machine where the 网关 runs (that is where the
工作空间 lives).
​
1) Initialize the repo
If git is installed, brand-new workspaces are initialized automatically. If this
工作空间 is not already a repo, run:
Copy
cd
~/.OpenClaw/工作空间
git
init
git
add
智能体.md
SOUL.md
工具.md
IDENTITY.md
USER.md
HEARTBEAT.md
记忆/
git
commit
-m
"Add 智能体 工作空间"
​
2) Add a private remote (beginner-friendly options)
Option A: GitHub 网页 UI
Create a new
private
repository在GitHub.
Do not initialize使用a README (avoids merge conflicts).
Copy the HTTPS remote URL.
Add the remote与push:
Copy
git
branch
-M
main
git
remote
add
origin
<
https-ur
l
>
git
push
-u
origin
main
Option B: GitHub 命令行界面 (
gh
)
Copy
gh
auth
登录
gh
repo
create
OpenClaw-工作空间
--private
--source
.
--remote
origin
--push
Option C: GitLab 网页 UI
Create a new
private
repository在GitLab.
Do not initialize使用a README (avoids merge conflicts).
Copy the HTTPS remote URL.
Add the remote与push:
Copy
git
branch
-M
main
git
remote
add
origin
<
https-ur
l
>
git
push
-u
origin
main
​
3) Ongoing updates
Copy
git
status
git
add
.
git
commit
-m
"Update 记忆"
git
push
​
Do not commit secrets
Even在a private repo, avoid storing secrets在the 工作空间:
API keys, OAuth tokens, passwords,或private credentials.
Anything under
~/.OpenClaw/
.
Raw dumps的chats或sensitive attachments.
If you must store sensitive references, use placeholders与keep the real
secret elsewhere (password manager, environment variables, or
~/.OpenClaw/
).
Suggested
.gitignore
starter:
Copy
.DS_Store
.env
**/*.key
**/*.pem
**/secrets*
​
Moving the 工作空间到a new machine
Clone the repo到the desired path (default
~/.OpenClaw/工作空间
).
Set
智能体.defaults.工作空间
to那path in
~/.OpenClaw/OpenClaw.JSON
.
Run
OpenClaw 设置 --工作空间 <path>
to seed any missing files.
If you need sessions, copy
~/.OpenClaw/智能体/<agentId>/sessions/
from the
old machine separately.
​
Advanced notes
多Agent routing can use different workspaces per 智能体. See
频道 routing
for routing 配置.
If
智能体.defaults.sandbox
is enabled, non-main sessions can use per-会话 sandbox
workspaces under
智能体.defaults.sandbox.workspaceRoot
.
上下文
OAuth
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/智能体-工作空间)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*