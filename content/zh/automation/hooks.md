# Hooks - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Automation
Hooks
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
Hooks
Getting Oriented
概述
Getting Started
Bundled Hooks
入门指南
Hook Discovery
Hook Packs (npm/archives)
Hook Structure
HOOK.md Format
Metadata Fields
Handler Implementation
Event 上下文
Event Types
Command Events
智能体 Events
网关 Events
工具 Result Hooks (Plugin API)
Future Events
Creating Custom Hooks
1. Choose Location
2. Create Directory Structure
3. Create HOOK.md
4. Create handler.ts
5. Enable与Test
配置
New Config Format (Recommended)
Per-Hook 配置
Extra Directories
Legacy Config Format (Still Supported)
命令行界面 Commands
List Hooks
Hook Information
Check Eligibility
Enable/Disable
Bundled hook 参考
会话-记忆
引导-extra-files
command-logger
boot-md
Best Practices
Keep Handlers Fast
Handle Errors Gracefully
Filter Events Early
Use Specific Event Keys
Debugging
Enable Hook Logging
Check Discovery
Check Registration
Verify Eligibility
Testing
网关 Logs
测试 Hooks Directly
架构
Core Components
Discovery Flow
Event Flow
Troubleshooting
Hook Not Discovered
Hook Not Eligible
Hook Not Executing
Handler Errors
Migration Guide
From Legacy Config到Discovery
See Also
​
Hooks
Hooks provide an extensible event-driven system为automating actions在response到agent commands与events. Hooks are automatically discovered从directories与can be managed via 命令行界面 commands, similar到how 技能 work在OpenClaw.
​
Getting Oriented
Hooks are small scripts那run when something happens. There are two kinds:
Hooks
(this page): run inside the 网关 when 智能体 events fire, like
/new
,
/reset
,
/stop
,或lifecycle events.
Webhooks
: external HTTP webhooks那let other systems trigger work在OpenClaw. See
Webhook Hooks
or use
OpenClaw webhooks
for Gmail helper commands.
Hooks can also be bundled inside plugins; see
Plugins
.
Common uses:
Save a 记忆 snapshot when you reset a 会话
Keep an audit trail的commands为troubleshooting或compliance
Trigger follow-up automation when a 会话 starts或ends
Write files into the 智能体 工作空间或call external APIs when events fire
If you can write a small TypeScript function, you can write a hook. Hooks are discovered automatically,与you enable或disable them via the 命令行界面.
​
概述
The hooks system allows you to:
Save 会话 上下文到记忆 when
/new
is issued
Log all commands为auditing
Trigger custom automations在agent lifecycle events
Extend OpenClaw’s behavior without modifying core code
​
Getting Started
​
Bundled Hooks
OpenClaw ships使用four bundled hooks那are automatically discovered:
💾 会话-记忆
: Saves 会话 上下文到your 智能体 工作空间 (default
~/.OpenClaw/工作空间/记忆/
) when you issue
/new
📎 引导-extra-files
: Injects additional 工作空间 引导 files从configured glob/path patterns during
智能体:引导
📝 command-logger
: Logs all command events to
~/.OpenClaw/logs/commands.log
🚀 boot-md
: Runs
BOOT.md
when the 网关 starts (requires internal hooks enabled)
List available hooks:
Copy
OpenClaw
hooks
list
Enable a hook:
Copy
OpenClaw
hooks
enable
会话-记忆
Check hook status:
Copy
OpenClaw
hooks
check
Get detailed information:
Copy
OpenClaw
hooks
info
会话-记忆
​
入门指南
During 入门指南 (
OpenClaw onboard
), you’ll be prompted到enable recommended hooks. The 向导 automatically discovers eligible hooks与presents them为selection.
​
Hook Discovery
Hooks are automatically discovered从three directories (in order的precedence):
工作空间 hooks
:
<工作空间>/hooks/
(per-智能体, highest precedence)
Managed hooks
:
~/.OpenClaw/hooks/
(user-installed, shared across workspaces)
Bundled hooks
:
<OpenClaw>/dist/hooks/bundled/
(shipped使用OpenClaw)
Managed hook directories can be either a
single hook
or a
hook pack
(package directory).
Each hook is a directory containing:
Copy
my-hook/
├── HOOK.md          # Metadata + documentation
└── handler.ts       # Handler implementation
​
Hook Packs (npm/archives)
Hook packs are standard npm packages那export one或more hooks via
OpenClaw.hooks
in
package.JSON
. 安装 them with:
Copy
OpenClaw
hooks
安装
<
path-or-spe
c
>
Example
package.JSON
:
Copy
{
"name"
:
"@acme/my-hooks"
,
"version"
:
"0.1.0"
,
"OpenClaw"
:
{
"hooks"
:
[
"./hooks/my-hook"
,
"./hooks/other-hook"
]
}
}
Each entry points到a hook directory containing
HOOK.md
and
handler.ts
(or
index.ts
).
Hook packs can ship dependencies; they will be installed under
~/.OpenClaw/hooks/<id>
.
​
Hook Structure
​
HOOK.md Format
The
HOOK.md
file contains metadata在YAML frontmatter plus Markdown documentation:
Copy
name
:
my-hook
description
:
"Short description的what这hook does"
homepage
:
https://docs.OpenClaw.ai/hooks#my-hook
metadata
:
{
"OpenClaw"
:
{
"emoji"
:
"🔗"
,
"events"
:
[
"command:new"
]
,
"requires"
:
{
"bins"
:
[
"node"
] } } }
# My Hook
Detailed documentation goes here...
## What It Does
- Listens for
`/new`
commands
- Performs some action
- Logs the result
## Requirements
- Node.js must be installed
## 配置
No 配置 needed.
​
Metadata Fields
The
metadata.OpenClaw
object supports:
emoji
: Display emoji为命令行界面 (e.g.,
"💾"
)
events
: Array的events到listen为(e.g.,
["command:new", "command:reset"]
)
export
: Named export到use (defaults to
"default"
)
homepage
: Documentation URL
requires
: Optional requirements
bins
: Required binaries在PATH (e.g.,
["git", "node"]
)
anyBins
: At least one的these binaries must be present
env
: Required environment variables
config
: Required config paths (e.g.,
["工作空间.dir"]
)
os
: Required 平台 (e.g.,
["darwin", "linux"]
)
always
: Bypass eligibility checks (boolean)
安装
: 安装ation methods (for bundled hooks:
[{"id":"bundled","kind":"bundled"}]
)
​
Handler Implementation
The
handler.ts
file exports a
HookHandler
function:
Copy
import
type
{ HookHandler }
from
"../../src/hooks/hooks.js"
;
const
myHandler
:
HookHandler
=
async
(event)
=>
{
// Only trigger在'new' command
if
(
event
.type
!==
"command"
||
event
.action
!==
"new"
) {
return
;
}
console
.log
(
`[my-hook] New command triggered`
);
console
.log
(
`  会话:
${
event
.sessionKey
}
`
);
console
.log
(
`  Timestamp:
${
event
.
timestamp
.toISOString
()
}
`
);
// Your custom logic here
// Optionally send 消息到user
event
.
messages
.push
(
"✨ My hook executed!"
);
};
export
default
myHandler;
​
Event 上下文
Each event includes:
Copy
{
type
:
'command'
|
'会话'
|
'智能体'
|
'网关'
,
action
:
string
,
// e.g., 'new', 'reset', 'stop'
sessionKey
:
string
,
// 会话 identifier
timestamp
:
Date
,
// When the event occurred
messages
:
string[]
,
// Push messages here到send到user
上下文
:
{
sessionEntry
?:
会话Entry
,
sessionId
?:
string
,
sessionFile
?:
string
,
commandSource
?:
string
,
// e.g., 'WhatsApp', 'Telegram'
senderId
?:
string
,
workspaceDir
?:
string
,
bootstrapFiles
?:
WorkspaceBootstrapFile[]
,
cfg
?:
OpenClawConfig
}
}
​
Event Types
​
Command Events
Triggered when 智能体 commands are issued:
command
: All command events (general listener)
command:new
: When
/new
command is issued
command:reset
: When
/reset
command is issued
command:stop
: When
/stop
command is issued
​
智能体 Events
智能体:引导
: Before 工作空间 引导 files are injected (hooks may mutate
上下文.bootstrapFiles
)
​
网关 Events
Triggered when the 网关 starts:
网关:startup
: After 频道 start与hooks are loaded
​
工具 Result Hooks (Plugin API)
These hooks are not event-stream listeners; they let plugins synchronously adjust 工具 results before OpenClaw persists them.
tool_result_persist
: transform 工具 results before they are written到the 会话 transcript. Must be synchronous; return the updated 工具 result payload or
undefined
to keep it as-is. See
Agent循环
.
​
Future Events
Planned event types:
会话:start
: When a new 会话 begins
会话:end
: When a 会话 ends
智能体:error
: When an 智能体 encounters an error
消息:sent
: When a 消息 is sent
消息:received
: When a 消息 is received
​
Creating Custom Hooks
​
1. Choose Location
工作空间 hooks
(
<工作空间>/hooks/
): Per-智能体, highest precedence
Managed hooks
(
~/.OpenClaw/hooks/
): Shared across workspaces
​
2. Create Directory Structure
Copy
mkdir
-p
~/.OpenClaw/hooks/my-hook
cd
~/.OpenClaw/hooks/my-hook
​
3. Create HOOK.md
Copy
name
:
my-hook
description
:
"Does something useful"
metadata
:
{
"OpenClaw"
:
{
"emoji"
:
"🎯"
,
"events"
:
[
"command:new"
] } }
# My Custom Hook
This hook does something useful when you issue
`/new`
.
​
4. Create handler.ts
Copy
import
type
{ HookHandler }
from
"../../src/hooks/hooks.js"
;
const
handler
:
HookHandler
=
async
(event)
=>
{
if
(
event
.type
!==
"command"
||
event
.action
!==
"new"
) {
return
;
}
console
.log
(
"[my-hook] 运行!"
);
// Your logic here
};
export
default
handler;
​
5. Enable与Test
Copy
# Verify hook is discovered
OpenClaw
hooks
list
# Enable it
OpenClaw
hooks
enable
my-hook
# Restart your 网关 进程 (menu bar app restart在macOS,或restart your dev 进程)
# Trigger the event
# Send /new via your messaging 频道
​
配置
​
New Config Format (Recommended)
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"entries"
:
{
"会话-记忆"
:
{
"enabled"
:
true
}
,
"command-logger"
:
{
"enabled"
:
false
}
}
}
}
}
​
Per-Hook 配置
Hooks can have custom 配置:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"entries"
:
{
"my-hook"
:
{
"enabled"
:
true
,
"env"
:
{
"MY_CUSTOM_VAR"
:
"value"
}
}
}
}
}
}
​
Extra Directories
Load hooks从additional directories:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"load"
:
{
"extraDirs"
:
[
"/path/to/more/hooks"
]
}
}
}
}
​
Legacy Config Format (Still Supported)
The old config format still works为backwards compatibility:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"handlers"
:
[
{
"event"
:
"command:new"
,
"module"
:
"./hooks/handlers/my-handler.ts"
,
"export"
:
"default"
}
]
}
}
}
Migration
: Use the new discovery-based system为new hooks. Legacy handlers are loaded after directory-based hooks.
​
命令行界面 Commands
​
List Hooks
Copy
# List all hooks
OpenClaw
hooks
list
# Show only eligible hooks
OpenClaw
hooks
list
--eligible
# Verbose output (show missing requirements)
OpenClaw
hooks
list
--verbose
# JSON output
OpenClaw
hooks
list
--JSON
​
Hook Information
Copy
# Show detailed info about a hook
OpenClaw
hooks
info
会话-记忆
# JSON output
OpenClaw
hooks
info
会话-记忆
--JSON
​
Check Eligibility
Copy
# Show eligibility summary
OpenClaw
hooks
check
# JSON output
OpenClaw
hooks
check
--JSON
​
Enable/Disable
Copy
# Enable a hook
OpenClaw
hooks
enable
会话-记忆
# Disable a hook
OpenClaw
hooks
disable
command-logger
​
Bundled hook 参考
​
会话-记忆
Saves 会话 上下文到记忆 when you issue
/new
.
Events
:
command:new
Requirements
:
工作空间.dir
must be configured
Output
:
<工作空间>/记忆/YYYY-MM-DD-slug.md
(defaults to
~/.OpenClaw/工作空间
)
What it does
:
Uses the pre-reset 会话 entry到locate the correct transcript
Extracts the last 15 lines的conversation
Uses LLM到generate a descriptive filename slug
Saves 会话 metadata到a dated 记忆 file
Example output
:
Copy
# 会话: 2026-01-16 14:30:00 UTC
-
**会话 Key**
: 智能体:main:main
-
**会话 ID**
: abc123def456
-
**Source**
: Telegram
Filename examples
:
2026-01-16-vendor-pitch.md
2026-01-16-api-design.md
2026-01-16-1430.md
(fallback timestamp if slug 生成 fails)
Enable
:
Copy
OpenClaw
hooks
enable
会话-记忆
​
引导-extra-files
Injects additional 引导 files (for example monorepo-local
智能体.md
/
工具.md
) during
智能体:引导
.
Events
:
智能体:引导
Requirements
:
工作空间.dir
must be configured
Output
: No files written; 引导 上下文 is modified in-记忆 only.
Config
:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"entries"
:
{
"引导-extra-files"
:
{
"enabled"
:
true
,
"paths"
:
[
"packages/*/智能体.md"
,
"packages/*/工具.md"
]
}
}
}
}
}
Notes
:
Paths are resolved relative到工作空间.
Files must stay inside 工作空间 (realpath-checked).
Only recognized 引导 basenames are loaded.
Subagent allowlist is preserved (
智能体.md
and
工具.md
only).
Enable
:
Copy
OpenClaw
hooks
enable
引导-extra-files
​
command-logger
Logs all command events到a centralized audit file.
Events
:
command
Requirements
: None
Output
:
~/.OpenClaw/logs/commands.log
What it does
:
Captures event details (command action, timestamp, 会话 key, sender ID, source)
Appends到log file在JSONL format
Runs silently在the background
Example log entries
:
Copy
{
"timestamp"
:
"2026-01-16T14:30:00.000Z"
,
"action"
:
"new"
,
"sessionKey"
:
"智能体:main:main"
,
"senderId"
:
"+1234567890"
,
"source"
:
"Telegram"
}
{
"timestamp"
:
"2026-01-16T15:45:22.000Z"
,
"action"
:
"stop"
,
"sessionKey"
:
"智能体:main:main"
,
"senderId"
:
"
[email protected]
"
,
"source"
:
"WhatsApp"
}
View logs
:
Copy
# View recent commands
tail
-n
20
~/.OpenClaw/logs/commands.log
# Pretty-print使用jq
cat
~/.OpenClaw/logs/commands.log
|
jq
.
# Filter通过action
grep
'"action":"new"'
~/.OpenClaw/logs/commands.log
|
jq
.
Enable
:
Copy
OpenClaw
hooks
enable
command-logger
​
boot-md
Runs
BOOT.md
when the 网关 starts (after 频道 start).
Internal hooks must be enabled为this到run.
Events
:
网关:startup
Requirements
:
工作空间.dir
must be configured
What it does
:
Reads
BOOT.md
from your 工作空间
Runs the instructions via the 智能体 runner
Sends any requested outbound messages via the 消息 工具
Enable
:
Copy
OpenClaw
hooks
enable
boot-md
​
Best Practices
​
Keep Handlers Fast
Hooks run during command processing. Keep them lightweight:
Copy
// ✓ Good - async work, returns immediately
const
handler
:
HookHandler
=
async
(event)
=>
{
void
processInBackground
(event);
// Fire与forget
};
// ✗ Bad - blocks command processing
const
handler
:
HookHandler
=
async
(event)
=>
{
await
slowDatabaseQuery
(event);
await
evenSlowerAPICall
(event);
};
​
Handle Errors Gracefully
Always wrap risky operations:
Copy
const
handler
:
HookHandler
=
async
(event)
=>
{
try
{
await
riskyOperation
(event);
}
catch
(err) {
console
.error
(
"[my-handler] Failed:"
,
err
instanceof
Error
?
err
.消息
:
String
(err));
// Don't throw - let other handlers run
}
};
​
Filter Events Early
Return early if the event isn’t relevant:
Copy
const
handler
:
HookHandler
=
async
(event)
=>
{
// Only handle 'new' commands
if
(
event
.type
!==
"command"
||
event
.action
!==
"new"
) {
return
;
}
// Your logic here
};
​
Use Specific Event Keys
Specify exact events在metadata when possible:
Copy
metadata
:
{
"OpenClaw"
:
{
"events"
:
[
"command:new"
] } }
# Specific
Rather than:
Copy
metadata
:
{
"OpenClaw"
:
{
"events"
:
[
"command"
] } }
# General - more overhead
​
Debugging
​
Enable Hook Logging
The 网关 logs hook loading在startup:
Copy
Registered hook: 会话-记忆 -> command:new
Registered hook: 引导-extra-files -> 智能体:引导
Registered hook: command-logger -> command
Registered hook: boot-md -> 网关:startup
​
Check Discovery
List all discovered hooks:
Copy
OpenClaw
hooks
list
--verbose
​
Check Registration
In your handler, log when it’s called:
Copy
const
handler
:
HookHandler
=
async
(event)
=>
{
console
.log
(
"[my-handler] Triggered:"
,
event
.type
,
event
.action);
// Your logic
};
​
Verify Eligibility
Check why a hook isn’t eligible:
Copy
OpenClaw
hooks
info
my-hook
Look为missing requirements在the output.
​
Testing
​
网关 Logs
Monitor 网关 logs到see hook execution:
Copy
# macOS
./scripts/clawlog.sh
-f
# Other 平台
tail
-f
~/.OpenClaw/网关.log
​
测试 Hooks Directly
测试 your handlers在isolation:
Copy
import
{ 测试 }
from
"vitest"
;
import
{ createHookEvent }
from
"./src/hooks/hooks.js"
;
import
myHandler
from
"./hooks/my-hook/handler.js"
;
测试
(
"my handler works"
,
async
()
=>
{
const
event
=
createHookEvent
(
"command"
,
"new"
,
"测试-会话"
,
{
foo
:
"bar"
,
});
await
myHandler
(event);
// Assert side effects
});
​
架构
​
Core Components
src/hooks/types.ts
: Type definitions
src/hooks/工作空间.ts
: Directory scanning与loading
src/hooks/frontmatter.ts
: HOOK.md metadata parsing
src/hooks/config.ts
: Eligibility checking
src/hooks/hooks-status.ts
: Status reporting
src/hooks/loader.ts
: Dynamic module loader
src/命令行界面/hooks-命令行界面.ts
: 命令行界面 commands
src/网关/server-startup.ts
: Loads hooks在网关 start
src/auto-reply/reply/commands-core.ts
: Triggers command events
​
Discovery Flow
Copy
网关 startup
↓
Scan directories (工作空间 → managed → bundled)
↓
Parse HOOK.md files
↓
Check eligibility (bins, env, config, os)
↓
Load handlers从eligible hooks
↓
Register handlers为events
​
Event Flow
Copy
User sends /new
↓
Command validation
↓
Create hook event
↓
Trigger hook (all registered handlers)
↓
Command processing continues
↓
会话 reset
​
Troubleshooting
​
Hook Not Discovered
Check directory structure:
Copy
ls
-la
~/.OpenClaw/hooks/my-hook/
# Should show: HOOK.md, handler.ts
Verify HOOK.md format:
Copy
cat
~/.OpenClaw/hooks/my-hook/HOOK.md
# Should have YAML frontmatter使用name与metadata
List all discovered hooks:
Copy
OpenClaw
hooks
list
​
Hook Not Eligible
Check requirements:
Copy
OpenClaw
hooks
info
my-hook
Look为missing:
Binaries (check PATH)
Environment variables
Config values
OS compatibility
​
Hook Not Executing
Verify hook is enabled:
Copy
OpenClaw
hooks
list
# Should show ✓ next到enabled hooks
Restart your 网关 进程 so hooks reload.
Check 网关 logs为errors:
Copy
./scripts/clawlog.sh
|
grep
hook
​
Handler Errors
Check为TypeScript/import errors:
Copy
# 测试 import directly
node
-e
"import('./path/to/handler.ts').then(console.log)"
​
Migration Guide
​
From Legacy Config到Discovery
Before
:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"handlers"
:
[
{
"event"
:
"command:new"
,
"module"
:
"./hooks/handlers/my-handler.ts"
}
]
}
}
}
After
:
Create hook directory:
Copy
mkdir
-p
~/.OpenClaw/hooks/my-hook
mv
./hooks/handlers/my-handler.ts
~/.OpenClaw/hooks/my-hook/handler.ts
Create HOOK.md:
Copy
name
:
my-hook
description
:
"My custom hook"
metadata
:
{
"OpenClaw"
:
{
"emoji"
:
"🎯"
,
"events"
:
[
"command:new"
] } }
# My Hook
Does something useful.
Update config:
Copy
{
"hooks"
:
{
"internal"
:
{
"enabled"
:
true
,
"entries"
:
{
"my-hook"
:
{
"enabled"
:
true
}
}
}
}
}
Verify与restart your 网关 进程:
Copy
OpenClaw
hooks
list
# Should show: 🎯 my-hook ✓
Benefits的migration
:
Automatic discovery
命令行界面 管理
Eligibility checking
Better documentation
Consistent structure
​
See Also
命令行界面 参考: hooks
Bundled Hooks README
Webhook Hooks
配置
Zalo Personal Plugin
Cron Jobs
I
[查看英文原版](https://docs.OpenClaw.ai/automation/hooks)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*