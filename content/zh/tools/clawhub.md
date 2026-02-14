# ClawHub - OpenClaw - 中文翻译


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
技能
ClawHub
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
概述
工具
内置工具
Lobster
LLM任务
执行 工具
网页 工具
apply_patch 工具
Elevated Mode
Thinking Levels
Reactions
浏览器
浏览器 (OpenClaw-managed)
浏览器 登录
Chrome Extension
浏览器 Troubleshooting
智能体 coordination
智能体 Send
Sub-智能体
Multi-智能体 Sandbox & 工具
技能
Slash Commands
技能
技能 Config
ClawHub
Plugins
Extensions
Voice Call Plugin
Zalo Personal Plugin
Automation
Hooks
Cron Jobs
Cron vs Heartbeat
Automation Troubleshooting
Webhooks
Gmail PubSub
Polls
Auth Monitoring
Media与devices
节点
Node Troubleshooting
Image与Media Support
Audio与Voice Notes
Camera Capture
Talk Mode
Voice Wake
Location Command
本页内容
ClawHub
What ClawHub is
How it works
What you can do
Who这is为(beginner-friendly)
Quick start (non-technical)
安装 the 命令行界面
How it fits into OpenClaw
Skill system 概述
What the service provides (features)
Security与moderation
命令行界面 commands与parameters
Common workflows为Agent
搜索...r 技能
Download new 技能
Update installed 技能
Back up your 技能 (publish或sync)
Advanced details (technical)
Versioning与tags
Local changes vs registry versions
Sync scanning与fallback roots
Storage与lockfile
Telemetry (安装 counts)
Environment variables
​
ClawHub
ClawHub is the
public skill registry为OpenClaw
. It is a free service: all 技能 are public, open,与visible到everyone为sharing与reuse. A skill is just a folder使用a
SKILL.md
file (plus supporting text files). You can browse 技能在the 网页 app或use the 命令行界面到搜索, 安装, update,与publish 技能.
Site:
clawhub.ai
​
What ClawHub is
A public registry为OpenClaw 技能.
A versioned store的skill bundles与metadata.
A discovery surface为搜索, tags,与usage signals.
​
How it works
A user publishes a skill bundle (files + metadata).
ClawHub stores the bundle, parses metadata,与assigns a version.
The registry indexes the skill为搜索与discovery.
Users browse, download,与安装 技能在OpenClaw.
​
What you can do
Publish new 技能与new versions的existing 技能.
Discover 技能通过name, tags,或搜索.
Download skill bundles与inspect their files.
Report 技能那are abusive或unsafe.
If you are a moderator, hide, unhide, delete,或ban.
​
Who这is为(beginner-friendly)
If you want到add new capabilities到your OpenClaw 智能体, ClawHub is the easiest way到find与安装 技能. You do not need到know how the backend works. You can:
搜索...r 技能通过plain language.
安装 a skill into your 工作空间.
Update 技能 later使用one command.
Back up your own 技能通过publishing them.
​
Quick start (non-technical)
安装 the 命令行界面 (see next section).
搜索...r something you need:
clawhub 搜索 "calendar"
安装 a skill:
clawhub 安装 <skill-slug>
Start a new OpenClaw 会话 so it picks up the new skill.
​
安装 the 命令行界面
Pick one:
Copy
npm
i
-g
clawhub
Copy
pnpm
add
-g
clawhub
​
How it fits into OpenClaw
By default, the 命令行界面 installs 技能 into
./技能
under your current 工作目录. If a OpenClaw 工作空间 is configured,
clawhub
falls back到that 工作空间 unless you override
--workdir
(or
CLAWHUB_WORKDIR
). OpenClaw loads 工作空间 技能 from
<工作空间>/技能
and will pick them up在the
next
会话. If you already use
~/.OpenClaw/技能
or bundled 技能, 工作空间 技能 take precedence.
For more detail在how 技能 are loaded, shared,与gated, see
技能
.
​
Skill system 概述
A skill is a versioned bundle的files那teaches OpenClaw how到perform a
specific task. Each publish creates a new version,与the registry keeps a
history的versions so users can audit changes.
A typical skill includes:
A
SKILL.md
file使用the primary description与usage.
Optional configs, scripts,或supporting files used通过the skill.
Metadata such as tags, summary,与安装 requirements.
ClawHub uses metadata到power discovery与safely expose skill capabilities.
The registry also tracks usage signals (such as stars与downloads)到improve
ranking与visibility.
​
What the service provides (features)
Public browsing
of 技能与their
SKILL.md
content.
搜索
powered通过embeddings (vector 搜索), not just keywords.
Versioning
with semver, changelogs,与tags (including
latest
).
Downloads
as a zip per version.
Stars与comments
for community feedback.
Moderation
hooks为approvals与audits.
命令行界面-friendly API
for automation与scripting.
​
Security与moderation
ClawHub is open通过default. Anyone can upload 技能, but a GitHub account must
be在least one week old到publish. This helps slow down abuse without blocking
legitimate contributors.
Reporting与moderation:
Any signed在user can report a skill.
Report reasons are required与recorded.
Each user can have up到20 active reports在a time.
技能使用more than 3 unique reports are auto hidden通过default.
Moderators can view hidden 技能, unhide them, delete them,或ban users.
Abusing the report feature can result在account bans.
Interested在becoming a moderator? Ask在the OpenClaw Discord与contact a
moderator或maintainer.
​
命令行界面 commands与parameters
Global options (apply到all commands):
--workdir <dir>
: Working directory (default: current dir; falls back到OpenClaw 工作空间).
--dir <dir>
: 技能 directory, relative到workdir (default:
技能
).
--site <url>
: Site base URL (浏览器 登录).
--registry <url>
: Registry API base URL.
--no-input
: Disable prompts (non-interactive).
-V, --命令行界面-version
: Print 命令行界面 version.
Auth:
clawhub 登录
(浏览器 flow) or
clawhub 登录 --token <token>
clawhub logout
clawhub whoami
Options:
--token <token>
: Paste an API token.
--label <label>
: Label stored为浏览器 登录 tokens (default:
命令行界面 token
).
--no-浏览器
: Do not open a 浏览器 (requires
--token
).
搜索:
clawhub 搜索 "query"
--limit <n>
: Max results.
安装:
clawhub 安装 <slug>
--version <version>
: 安装 a specific version.
--force
: Overwrite if the folder already exists.
Update:
clawhub update <slug>
clawhub update --all
--version <version>
: Update到a specific version (single slug only).
--force
: Overwrite when local files do not match any published version.
List:
clawhub list
(reads
.clawhub/lock.JSON
)
Publish:
clawhub publish <path>
--slug <slug>
: Skill slug.
--name <name>
: Display name.
--version <version>
: Semver version.
--changelog <text>
: Changelog text (can be empty).
--tags <tags>
: Comma-separated tags (default:
latest
).
Delete/undelete (owner/admin only):
clawhub delete <slug> --yes
clawhub undelete <slug> --yes
Sync (scan local 技能 + publish new/updated):
clawhub sync
--root <dir...>
: Extra scan roots.
--all
: Upload everything without prompts.
--dry-run
: Show what would be uploaded.
--bump <type>
:
patch|minor|major
for updates (default:
patch
).
--changelog <text>
: Changelog为non-interactive updates.
--tags <tags>
: Comma-separated tags (default:
latest
).
--concurrency <n>
: Registry checks (default: 4).
​
Common workflows为Agent
​
搜索...r 技能
Copy
clawhub
搜索
"postgres backups"
​
Download new 技能
Copy
clawhub
安装
my-skill-pack
​
Update installed 技能
Copy
clawhub
update
--all
​
Back up your 技能 (publish或sync)
For a single skill folder:
Copy
clawhub
publish
./my-skill
--slug
my-skill
--name
"My Skill"
--version
1.0.0
--tags
latest
To scan与back up many 技能在once:
Copy
clawhub
sync
--all
​
Advanced details (technical)
​
Versioning与tags
Each publish creates a new
semver
SkillVersion
.
Tags (like
latest
) point到a version; moving tags lets you roll back.
Changelogs are attached per version与can be empty when syncing或publishing updates.
​
Local changes vs registry versions
Updates compare the local skill contents到registry versions using a content hash. If local files do not match any published version, the 命令行界面 asks before overwriting (or requires
--force
in non-interactive runs).
​
Sync scanning与fallback roots
clawhub sync
scans your current workdir first. If no 技能 are found, it falls back到known legacy locations (for example
~/OpenClaw/技能
and
~/.OpenClaw/技能
). 这是 designed到find older skill installs without extra flags.
​
Storage与lockfile
安装ed 技能 are recorded in
.clawhub/lock.JSON
under your workdir.
Auth tokens are stored在the ClawHub 命令行界面 config file (override via
CLAWHUB_CONFIG_PATH
).
​
Telemetry (安装 counts)
When you run
clawhub sync
while logged in, the 命令行界面 sends a minimal snapshot到compute 安装 counts. You can disable这entirely:
Copy
export
CLAWHUB_DISABLE_TELEMETRY
=
1
​
Environment variables
CLAWHUB_SITE
: Override the site URL.
CLAWHUB_REGISTRY
: Override the registry API URL.
CLAWHUB_CONFIG_PATH
: Override where the 命令行界面 stores the token/config.
CLAWHUB_WORKDIR
: Override the default workdir.
CLAWHUB_DISABLE_TELEMETRY=1
: Disable telemetry on
sync
.
技能 Config
Plugins
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/clawhub)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*