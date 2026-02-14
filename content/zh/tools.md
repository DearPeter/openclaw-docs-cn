# 工具 - OpenClaw - 中文翻译


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
概述
工具
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
工具 (OpenClaw)
Disabling 工具
工具 profiles (base allowlist)
Provider-specific 工具 policy
工具 groups (shorthands)
Plugins + 工具
工具 inventory
apply_patch
执行
进程
web_search
web_fetch
浏览器
画布
节点
image
消息
cron
网关
sessions_list / sessions_history / sessions_send / sessions_spawn / session_status
agents_list
Parameters (common)
Recommended 智能体 flows
Safety
How 工具 are presented到the 智能体
​
工具 (OpenClaw)
OpenClaw exposes
first-class 智能体 工具
for 浏览器, 画布, 节点,与cron.
These replace the old
OpenClaw-*
技能: the 工具 are typed, no shelling,
and the 智能体 should rely在them directly.
​
Disabling 工具
You can globally allow/deny 工具 via
工具.allow
/
工具.deny
in
OpenClaw.JSON
(deny wins). This prevents disallowed 工具从being sent到model 提供者.
Copy
{
工具
:
{
deny
:
[
"浏览器"
] }
,
}
Notes:
Matching is case-insensitive.
*
wildcards are supported (
"*"
means all 工具).
If
工具.allow
only references unknown或unloaded plugin 工具 names, OpenClaw logs a warning与ignores the allowlist so core 工具 stay available.
​
工具 profiles (base allowlist)
工具.profile
sets a
base 工具 allowlist
before
工具.allow
/
工具.deny
.
Per-智能体 override:
智能体.list[].工具.profile
.
Profiles:
minimal
:
session_status
only
coding
:
group:fs
,
group:运行时
,
group:sessions
,
group:记忆
,
image
messaging
:
group:messaging
,
sessions_list
,
sessions_history
,
sessions_send
,
session_status
full
: no restriction (same as unset)
Example (messaging-only通过default, allow Slack + Discord 工具 too):
Copy
{
工具
:
{
profile
:
"messaging"
,
allow
:
[
"Slack"
,
"Discord"
]
,
}
,
}
Example (coding profile, but deny 执行/进程 everywhere):
Copy
{
工具
:
{
profile
:
"coding"
,
deny
:
[
"group:运行时"
]
,
}
,
}
Example (global coding profile, messaging-only support 智能体):
Copy
{
工具
:
{
profile
:
"coding"
}
,
智能体
:
{
list
:
[
{
id
:
"support"
,
工具
:
{
profile
:
"messaging"
,
allow
:
[
"Slack"
] }
,
}
,
]
,
}
,
}
​
Provider-specific 工具 policy
Use
工具.byProvider
to
further restrict
工具为specific 提供者
(or a single
provider/模型
) without changing your global defaults.
Per-智能体 override:
智能体.list[].工具.byProvider
.
这是 applied
after
the base 工具 profile and
before
allow/deny lists,
so it can only narrow the 工具 set.
Provider keys accept either
provider
(e.g.
google-antigravity
) or
provider/模型
(e.g.
openai/gpt-5.2
).
Example (keep global coding profile, but minimal 工具为Google Antigravity):
Copy
{
工具
:
{
profile
:
"coding"
,
byProvider
:
{
"google-antigravity"
:
{
profile
:
"minimal"
}
,
}
,
}
,
}
Example (provider/模型-specific allowlist为a flaky endpoint):
Copy
{
工具
:
{
allow
:
[
"group:fs"
,
"group:运行时"
,
"sessions_list"
]
,
byProvider
:
{
"openai/gpt-5.2"
:
{
allow
:
[
"group:fs"
,
"sessions_list"
] }
,
}
,
}
,
}
Example (智能体-specific override为a single provider):
Copy
{
智能体
:
{
list
:
[
{
id
:
"support"
,
工具
:
{
byProvider
:
{
"google-antigravity"
:
{
allow
:
[
"消息"
,
"sessions_list"
] }
,
}
,
}
,
}
,
]
,
}
,
}
​
工具 groups (shorthands)
工具 policies (global, 智能体, sandbox) support
group:*
entries那expand到multiple 工具.
Use这些in
工具.allow
/
工具.deny
.
Available groups:
group:运行时
:
执行
,
bash
,
进程
group:fs
:
read
,
write
,
edit
,
apply_patch
group:sessions
:
sessions_list
,
sessions_history
,
sessions_send
,
sessions_spawn
,
session_status
group:记忆
:
memory_search
,
memory_get
group:网页
:
web_search
,
web_fetch
group:ui
:
浏览器
,
画布
group:automation
:
cron
,
网关
group:messaging
:
消息
group:节点
:
节点
group:OpenClaw
: all built-in OpenClaw 工具 (excludes provider plugins)
Example (allow only file 工具 + 浏览器):
Copy
{
工具
:
{
allow
:
[
"group:fs"
,
"浏览器"
]
,
}
,
}
​
Plugins + 工具
Plugins can register
additional 工具
(and 命令行界面 commands) beyond the core set.
See
Plugins
for 安装 + config, and
技能
for how
工具 usage guidance is injected into prompts. Some plugins ship their own 技能
alongside 工具 (for example, the voice-call plugin).
Optional plugin 工具:
Lobster
: typed workflow runtime使用resumable approvals (requires the Lobster 命令行界面在the 网关 host).
LLM任务
: JSON-only LLM step为structured workflow output (optional schema validation).
​
工具 inventory
​
apply_patch
Apply structured patches across one或more files. Use为multi-hunk edits.
Experimental: enable via
工具.执行.applyPatch.enabled
(OpenAI 模型 only).
​
执行
Run shell commands在the 工作空间.
Core parameters:
command
(required)
yieldMs
(auto-background after timeout, default 10000)
background
(immediate background)
timeout
(seconds; kills the 进程 if exceeded, default 1800)
elevated
(bool; run在host if elevated mode is enabled/allowed; only changes behavior when the 智能体 is sandboxed)
host
(
sandbox | 网关 | node
)
security
(
deny | allowlist | full
)
ask
(
off | on-miss | always
)
node
(node id/name for
host=node
)
Need a real TTY? Set
pty: true
.
Notes:
Returns
status: "运行"
with a
sessionId
when backgrounded.
Use
进程
to poll/log/write/kill/clear background sessions.
If
进程
is disallowed,
执行
runs synchronously与ignores
yieldMs
/
background
.
elevated
is gated by
工具.elevated
plus any
智能体.list[].工具.elevated
override (both must allow)与is an alias for
host=网关
+
security=full
.
elevated
only changes behavior when the 智能体 is sandboxed (otherwise it’s a no-op).
host=node
can target a macOS companion app或a headless node host (
OpenClaw node run
).
网关/node approvals与allowlists:
执行 approvals
.
​
进程
Manage background 执行 sessions.
Core actions:
list
,
poll
,
log
,
write
,
kill
,
clear
,
remove
Notes:
poll
returns new output与exit status when complete.
log
supports line-based
offset
/
limit
(omit
offset
to grab the last N lines).
进程
is scoped per 智能体; sessions从other 智能体 are not visible.
​
web_search
搜索...e 网页 using Brave 搜索...I.
Core parameters:
query
(required)
count
(1–10; default from
工具.网页.搜索.maxResults
)
Notes:
Requires a Brave API key (recommended:
OpenClaw 配置 --section 网页
,或set
BRAVE_API_KEY
).
Enable via
工具.网页.搜索.enabled
.
Responses are cached (default 15 min).
See
网页 工具
for 设置.
​
web_fetch
获取与extract readable content从a URL (HTML → Markdown/text).
Core parameters:
url
(required)
extractMode
(
Markdown
|
text
)
maxChars
(truncate long pages)
Notes:
Enable via
工具.网页.获取.enabled
.
maxChars
is clamped by
工具.网页.获取.maxCharsCap
(default 50000).
Responses are cached (default 15 min).
For JS-heavy sites, prefer the 浏览器 工具.
See
网页 工具
for 设置.
See
Firecrawl
for the optional anti-bot fallback.
​
浏览器
控制 the dedicated OpenClaw-managed 浏览器.
Core actions:
status
,
start
,
stop
,
tabs
,
open
,
focus
,
close
snapshot
(aria/ai)
screenshot
(returns image block +
MEDIA:<path>
)
act
(UI actions: click/type/press/hover/drag/select/fill/resize/wait/evaluate)
navigate
,
console
,
pdf
,
upload
,
dialog
Profile 管理:
profiles
— list all 浏览器 profiles使用status
create-profile
— create new profile使用auto-allocated port (or
cdpUrl
)
delete-profile
— stop 浏览器, delete user data, remove从config (local only)
reset-profile
— kill orphan 进程在profile’s port (local only)
Common parameters:
profile
(optional; defaults to
浏览器.defaultProfile
)
target
(
sandbox
|
host
|
node
)
node
(optional; picks a specific node id/name)
Notes:
Requires
浏览器.enabled=true
(default is
true
; set
false
to disable).
All actions accept optional
profile
parameter为multi-instance support.
When
profile
is omitted, uses
浏览器.defaultProfile
(defaults到“chrome”).
Profile names: lowercase alphanumeric + hyphens only (max 64 chars).
Port range: 18800-18899 (~100 profiles max).
Remote profiles are attach-only (no start/stop/reset).
If a 浏览器-capable node is connected, the 工具 may auto-route到it (unless you pin
target
).
snapshot
defaults to
ai
when Playwright is installed; use
aria
for the accessibility tree.
snapshot
also supports role-snapshot options (
interactive
,
compact
,
depth
,
selector
) which return refs like
e12
.
act
requires
ref
from
snapshot
(numeric
12
from AI snapshots, or
e12
from role snapshots); use
evaluate
for rare CSS selector needs.
Avoid
act
→
wait
by default; use it only在exceptional cases (no reliable UI state到wait on).
upload
can optionally pass a
ref
to auto-click after arming.
upload
also supports
inputRef
(aria ref) or
element
(CSS selector)到set
<input type="file">
directly.
​
画布
Drive the node 画布 (present, eval, snapshot, A2UI).
Core actions:
present
,
hide
,
navigate
,
eval
snapshot
(returns image block +
MEDIA:<path>
)
a2ui_push
,
a2ui_reset
Notes:
Uses 网关
node.invoke
under the hood.
If no
node
is provided, the 工具 picks a default (single connected node或local mac node).
A2UI is v0.8 only (no
createSurface
); the 命令行界面 rejects v0.9 JSONL使用line errors.
Quick smoke:
OpenClaw 节点 画布 a2ui push --node <id> --text "Hello从A2UI"
.
​
节点
Discover与target paired 节点; send notifications; capture camera/screen.
Core actions:
status
,
describe
pending
,
approve
,
reject
(pairing)
notify
(macOS
system.notify
)
run
(macOS
system.run
)
camera_snap
,
camera_clip
,
screen_record
location_get
Notes:
Camera/screen commands require the node app到be foregrounded.
Images return image blocks +
MEDIA:<path>
.
Videos return
FILE:<path>
(mp4).
Location returns a JSON payload (lat/lon/accuracy/timestamp).
run
params:
command
argv array; optional
cwd
,
env
(
KEY=VAL
),
commandTimeoutMs
,
invokeTimeoutMs
,
needsScreenRecording
.
Example (
run
):
Copy
{
"action"
:
"run"
,
"node"
:
"office-mac"
,
"command"
:
[
"echo"
,
"Hello"
]
,
"env"
:
[
"FOO=bar"
]
,
"commandTimeoutMs"
:
12000
,
"invokeTimeoutMs"
:
45000
,
"needsScreenRecording"
:
false
}
​
image
Analyze an image使用the configured image 模型.
Core parameters:
image
(required path或URL)
提示词
(optional; defaults到“Describe the image.”)
模型
(optional override)
maxBytesMb
(optional size cap)
Notes:
Only available when
智能体.defaults.imageModel
is configured (primary或fallbacks),或when an implicit image 模型 can be inferred从your default 模型 + configured auth (best-effort pairing).
Uses the image 模型 directly (independent的the main chat 模型).
​
消息
Send messages与channel actions across Discord/Google Chat/Slack/Telegram/WhatsApp/Signal/iMessage/MS Teams.
Core actions:
send
(text + optional media; MS Teams also supports
card
for Adaptive Cards)
poll
(WhatsApp/Discord/MS Teams polls)
react
/
reactions
/
read
/
edit
/
delete
pin
/
unpin
/
list-pins
permissions
thread-create
/
thread-list
/
thread-reply
搜索
sticker
member-info
/
role-info
emoji-list
/
emoji-upload
/
sticker-upload
role-add
/
role-remove
频道-info
/
频道-list
voice-status
event-list
/
event-create
timeout
/
kick
/
ban
Notes:
send
routes WhatsApp via the 网关; other 频道 go direct.
poll
uses the 网关为WhatsApp与MS Teams; Discord polls go direct.
When a 消息 工具 call is bound到an active chat 会话, sends are constrained到that 会话’s target到avoid cross-上下文 leaks.
​
cron
Manage 网关 cron jobs与wakeups.
Core actions:
status
,
list
add
,
update
,
remove
,
run
,
runs
wake
(enqueue system event + optional immediate heartbeat)
Notes:
add
expects a full cron job object (same schema as
cron.add
RPC).
update
uses
{ jobId, patch }
(
id
accepted为compatibility).
​
网关
Restart或apply updates到the 运行 网关 进程 (in-place).
Core actions:
restart
(authorizes + sends
SIGUSR1
for in-进程 restart;
OpenClaw 网关
restart in-place)
config.get
/
config.schema
config.apply
(validate + write config + restart + wake)
config.patch
(merge partial update + restart + wake)
update.run
(run update + restart + wake)
Notes:
Use
delayMs
(defaults到2000)到avoid interrupting an in-flight reply.
restart
is disabled通过default; enable with
commands.restart: true
.
​
sessions_list
/
sessions_history
/
sessions_send
/
sessions_spawn
/
session_status
List sessions, inspect transcript history,或send到another 会话.
Core parameters:
sessions_list
:
kinds?
,
limit?
,
activeMinutes?
,
messageLimit?
(0 = none)
sessions_history
:
sessionKey
(or
sessionId
),
limit?
,
include工具?
sessions_send
:
sessionKey
(or
sessionId
),
消息
,
timeoutSeconds?
(0 = fire-and-forget)
sessions_spawn
:
task
,
label?
,
agentId?
,
模型?
,
runTimeoutSeconds?
,
cleanup?
session_status
:
sessionKey?
(default current; accepts
sessionId
),
模型?
(
default
clears override)
Notes:
main
is the canonical direct-chat key; global/unknown are hidden.
messageLimit > 0
fetches last N messages per 会话 (工具 messages filtered).
sessions_send
waits为final completion when
timeoutSeconds > 0
.
Delivery/announce happens after completion与is best-effort;
status: "ok"
confirms the 智能体 run finished, not那the announce was delivered.
sessions_spawn
starts a sub-智能体 run与posts an announce reply back到the requester chat.
sessions_spawn
is non-blocking与returns
status: "accepted"
immediately.
sessions_send
runs a reply‑back ping‑pong (reply
REPLY_SKIP
to stop; max turns via
会话.agentToAgent.maxPingPongTurns
, 0–5).
After the ping‑pong, the target 智能体 runs an
announce step
; reply
ANNOUNCE_SKIP
to suppress the announcement.
​
agents_list
List 智能体 ids那the current 会话 may target with
sessions_spawn
.
Notes:
Result is restricted到per-智能体 allowlists (
智能体.list[].subagents.allowAgent
).
When
["*"]
is configured, the 工具 includes all configured Agent与marks
allowAny: true
.
​
Parameters (common)
网关-backed 工具 (
画布
,
节点
,
cron
):
gatewayUrl
(default
ws://127.0.0.1:18789
)
gatewayToken
(if auth enabled)
timeoutMs
Note: when
gatewayUrl
is set, include
gatewayToken
explicitly. 工具 do not inherit config
or environment credentials为overrides,与missing explicit credentials is an error.
浏览器 工具:
profile
(optional; defaults to
浏览器.defaultProfile
)
target
(
sandbox
|
host
|
node
)
node
(optional; pin a specific node id/name)
​
Recommended 智能体 flows
浏览器 automation:
浏览器
→
status
/
start
snapshot
(ai或aria)
act
(click/type/press)
screenshot
if you need visual confirmation
画布 render:
画布
→
present
a2ui_push
(optional)
snapshot
Node targeting:
节点
→
status
describe
on the chosen node
notify
/
run
/
camera_snap
/
screen_record
​
Safety
Avoid direct
system.run
; use
节点
→
run
only使用explicit user consent.
Respect user consent为camera/screen capture.
Use
status/describe
to ensure permissions before invoking media commands.
​
How 工具 are presented到the 智能体
工具 are exposed在two parallel 频道:
System 提示词 text
: a human-readable list + guidance.
工具 schema
: the structured function definitions sent到the 模型 API.
That means the 智能体 sees both “what 工具 exist”与“how到call them.” If a 工具
doesn’t appear在the system prompt或the schema, the 模型 cannot call it.
Lobster
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具#safety)-+-工具)esented-to-the-智能体)ssions_send-/-sessions_spawn-/-session_status)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*