# Plugins - OpenClaw - 中文翻译


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
Plugins
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
Plugins (Extensions)
Quick start (new到plugins?)
Available plugins (official)
运行时 helpers
Discovery & precedence
Package packs
频道 catalog metadata
Plugin IDs
Config
Plugin slots (exclusive categories)
控制 UI (schema + labels)
命令行界面
Plugin API (概述)
Plugin hooks
Example
Provider plugins (模型 auth)
Register a messaging 频道
Write a new messaging 频道 (step‑by‑step)
智能体 工具
Register a 网关 RPC method
Register 命令行界面 commands
Register auto-reply commands
Register background services
Naming conventions
技能
Distribution (npm)
Example plugin: Voice Call
Safety notes
Testing plugins
​
Plugins (Extensions)
​
Quick start (new到plugins?)
A plugin is just a
small code module
that extends OpenClaw使用extra
features (commands, 工具,与网关 RPC).
Most的the time, you’ll use plugins when you want a feature that’s not built
into core OpenClaw yet (or you want到keep optional features out的your main
安装).
Fast path:
See what’s already loaded:
Copy
OpenClaw
plugins
list
安装 an official plugin (example: Voice Call):
Copy
OpenClaw
plugins
安装
@OpenClaw/voice-call
Restart the 网关, then 配置 under
plugins.entries.<id>.config
.
See
Voice Call
for a concrete example plugin.
​
Available plugins (official)
Microsoft Teams is plugin-only as的2026.1.15; 安装
@OpenClaw/msteams
if you use Teams.
记忆 (Core) — bundled 记忆 搜索 plugin (enabled通过default via
plugins.slots.记忆
)
记忆 (LanceDB) — bundled long-term 记忆 plugin (auto-recall/capture; set
plugins.slots.记忆 = "记忆-lancedb"
)
Voice Call
—
@OpenClaw/voice-call
Zalo Personal
—
@OpenClaw/zalouser
Matrix
—
@OpenClaw/matrix
Nostr
—
@OpenClaw/nostr
Zalo
—
@OpenClaw/zalo
Microsoft Teams
—
@OpenClaw/msteams
Google Antigravity OAuth (provider auth) — bundled as
google-antigravity-auth
(disabled通过default)
Gemini 命令行界面 OAuth (provider auth) — bundled as
google-gemini-命令行界面-auth
(disabled通过default)
Qwen OAuth (provider auth) — bundled as
qwen-portal-auth
(disabled通过default)
Copilot Proxy (provider auth) — local VS Code Copilot Proxy bridge; distinct从built-in
GitHub-copilot
device 登录 (bundled, disabled通过default)
OpenClaw plugins are
TypeScript modules
loaded在runtime via jiti.
Config
validation does not execute plugin code
; it uses the plugin manifest与JSON
Schema instead. See
Plugin manifest
.
Plugins can register:
网关 RPC methods
网关 HTTP handlers
智能体 工具
命令行界面 commands
Background services
Optional config validation
技能
(by listing
技能
directories在the plugin manifest)
Auto-reply commands
(execute without invoking the AI 智能体)
Plugins run
in‑进程
with the 网关, so treat them as trusted code.
工具 authoring guide:
Plugin 智能体 工具
.
​
运行时 helpers
Plugins can access selected core helpers via
api.运行时
. For telephony 文本转语音:
Copy
const
result
=
await
api
.
运行时
.
文本转语音
.textToSpeechTelephony
({
text
:
"Hello从OpenClaw"
,
cfg
:
api
.config
,
});
Notes:
Uses core
messages.文本转语音
配置 (OpenAI或ElevenLabs).
Returns PCM audio buffer + sample rate. Plugins must resample/encode为提供者.
Edge 文本转语音 is not supported为telephony.
​
Discovery & precedence
OpenClaw scans,在order:
Config paths
plugins.load.paths
(file或directory)
工作空间 extensions
<工作空间>/.OpenClaw/extensions/*.ts
<工作空间>/.OpenClaw/extensions/*/index.ts
Global extensions
~/.OpenClaw/extensions/*.ts
~/.OpenClaw/extensions/*/index.ts
Bundled extensions (shipped使用OpenClaw,
disabled通过default
)
<OpenClaw>/extensions/*
Bundled plugins must be enabled explicitly via
plugins.entries.<id>.enabled
or
OpenClaw plugins enable <id>
. 安装ed plugins are enabled通过default,
but can be disabled the same way.
Each plugin must include a
OpenClaw.plugin.JSON
file在its root. If a path
points在a file, the plugin root is the file’s directory与must contain the
manifest.
If multiple plugins resolve到the same id, the first match在the order above
wins与lower-precedence copies are ignored.
​
Package packs
A plugin directory may include a
package.JSON
with
OpenClaw.extensions
:
Copy
{
"name"
:
"my-pack"
,
"OpenClaw"
:
{
"extensions"
:
[
"./src/safety.ts"
,
"./src/工具.ts"
]
}
}
Each entry becomes a plugin. If the pack lists multiple extensions, the plugin id
becomes
name/<fileBase>
.
If your plugin imports npm deps, 安装 them在that directory so
node_modules
is available (
npm 安装
/
pnpm 安装
).
​
频道 catalog metadata
频道 plugins can advertise 入门指南 metadata via
OpenClaw.频道
and
安装 hints via
OpenClaw.安装
. This keeps the core catalog data-free.
示例：
Copy
{
"name"
:
"@OpenClaw/nextcloud-talk"
,
"OpenClaw"
:
{
"extensions"
:
[
"./index.ts"
]
,
"频道"
:
{
"id"
:
"nextcloud-talk"
,
"label"
:
"Nextcloud Talk"
,
"selectionLabel"
:
"Nextcloud Talk (self-hosted)"
,
"docsPath"
:
"/频道/nextcloud-talk"
,
"docsLabel"
:
"nextcloud-talk"
,
"blurb"
:
"Self-hosted chat via Nextcloud Talk webhook bots."
,
"order"
:
65
,
"aliases"
:
[
"nc-talk"
,
"nc"
]
}
,
"安装"
:
{
"npmSpec"
:
"@OpenClaw/nextcloud-talk"
,
"localPath"
:
"extensions/nextcloud-talk"
,
"defaultChoice"
:
"npm"
}
}
}
OpenClaw can also merge
external 频道 catalogs
(for example, an MPM
registry export). Drop a JSON file在one of:
~/.OpenClaw/mpm/plugins.JSON
~/.OpenClaw/mpm/catalog.JSON
~/.OpenClaw/plugins/catalog.JSON
Or point
OPENCLAW_PLUGIN_CATALOG_PATHS
(or
OPENCLAW_MPM_CATALOG_PATHS
) at
one或more JSON files (comma/semicolon/
PATH
-delimited). Each file should
contain
{ "entries": [ { "name": "@scope/pkg", "OpenClaw": { "频道": {...}, "安装": {...} } } ] }
.
​
Plugin IDs
Default plugin ids:
Package packs:
package.JSON
name
Standalone file: file base name (
~/.../voice-call.ts
→
voice-call
)
If a plugin exports
id
, OpenClaw uses it but warns when it doesn’t match the
configured id.
​
Config
Copy
{
plugins
:
{
enabled
:
true
,
allow
:
[
"voice-call"
]
,
deny
:
[
"untrusted-plugin"
]
,
load
:
{
paths
:
[
"~/Projects/oss/voice-call-extension"
] }
,
entries
:
{
"voice-call"
:
{
enabled
:
true
,
config
:
{
provider
:
"twilio"
} }
,
}
,
}
,
}
Fields:
enabled
: master toggle (default: true)
allow
: allowlist (optional)
deny
: denylist (optional; deny wins)
load.paths
: extra plugin files/dirs
entries.<id>
: per‑plugin toggles + config
Config changes
require a 网关 restart
.
Validation rules (strict):
Unknown plugin ids in
entries
,
allow
,
deny
, or
slots
are
errors
.
Unknown
频道.<id>
keys are
errors
unless a plugin manifest declares
the 频道 id.
Plugin config is validated using the JSON Schema embedded in
OpenClaw.plugin.JSON
(
configSchema
).
If a plugin is disabled, its config is preserved与a
warning
is emitted.
​
Plugin slots (exclusive categories)
Some plugin categories are
exclusive
(only one active在a time). Use
plugins.slots
to select which plugin owns the slot:
Copy
{
plugins
:
{
slots
:
{
记忆
:
"记忆-core"
,
//或"none"到disable 记忆 plugins
}
,
}
,
}
If multiple plugins declare
kind: "记忆"
, only the selected one loads. Others
are disabled使用diagnostics.
​
控制 UI (schema + labels)
The 控制 UI uses
config.schema
(JSON Schema +
uiHints
)到render better forms.
OpenClaw augments
uiHints
at 运行时 based在discovered plugins:
Adds per-plugin labels for
plugins.entries.<id>
/
.enabled
/
.config
Merges optional plugin-provided config field hints under:
plugins.entries.<id>.config.<field>
If you want your plugin config fields到show good labels/placeholders (and mark secrets as sensitive),
provide
uiHints
alongside your JSON Schema在the plugin manifest.
示例：
Copy
{
"id"
:
"my-plugin"
,
"configSchema"
:
{
"type"
:
"object"
,
"additionalProperties"
:
false
,
"properties"
:
{
"apiKey"
:
{
"type"
:
"string"
}
,
"region"
:
{
"type"
:
"string"
}
}
}
,
"uiHints"
:
{
"apiKey"
:
{
"label"
:
"API Key"
,
"sensitive"
:
true
}
,
"region"
:
{
"label"
:
"Region"
,
"placeholder"
:
"us-east-1"
}
}
}
​
命令行界面
Copy
OpenClaw
plugins
list
OpenClaw
plugins
info
<
i
d
>
OpenClaw
plugins
安装
<
pat
h
>
# copy a local file/dir into ~/.OpenClaw/extensions/<id>
OpenClaw
plugins
安装
./extensions/voice-call
# relative path ok
OpenClaw
plugins
安装
./plugin.tgz
# 安装从a local tarball
OpenClaw
plugins
安装
./plugin.zip
# 安装从a local zip
OpenClaw
plugins
安装
-l
./extensions/voice-call
# link (no copy)为dev
OpenClaw
plugins
安装
@OpenClaw/voice-call
# 安装从npm
OpenClaw
plugins
update
<
i
d
>
OpenClaw
plugins
update
--all
OpenClaw
plugins
enable
<
i
d
>
OpenClaw
plugins
disable
<
i
d
>
OpenClaw
plugins
doctor
plugins update
only works为npm installs tracked under
plugins.installs
.
Plugins may also register their own top‑level commands (example:
OpenClaw voicecall
).
​
Plugin API (概述)
Plugins export either:
A function:
(api) => { ... }
An object:
{ id, name, configSchema, register(api) { ... } }
​
Plugin hooks
Plugins can ship hooks与register them在runtime. This lets a plugin bundle
event-driven automation without a separate hook pack 安装.
​
Example
Copy
import { registerPluginHooksFromDir }从"OpenClaw/plugin-sdk";
export default function register(api) {
registerPluginHooksFromDir(api, "./hooks");
}
Notes:
Hook directories follow the normal hook structure (
HOOK.md
+
handler.ts
).
Hook eligibility rules still apply (OS/bins/env/config requirements).
Plugin-managed hooks show up in
OpenClaw hooks list
with
plugin:<id>
.
You cannot enable/disable plugin-managed hooks via
OpenClaw hooks
; enable/disable the plugin instead.
​
Provider plugins (模型 auth)
Plugins can register
模型 provider auth
flows so users can run OAuth or
API-key 设置 inside OpenClaw (no external scripts needed).
Register a provider via
api.registerProvider(...)
. Each provider exposes one
or more auth methods (OAuth, API key, device code, etc.). These methods power:
OpenClaw 模型 auth 登录 --provider <id> [--method <id>]
示例：
Copy
api
.registerProvider
({
id
:
"acme"
,
label
:
"AcmeAI"
,
auth
:
[
{
id
:
"oauth"
,
label
:
"OAuth"
,
kind
:
"oauth"
,
run
:
async
(ctx)
=>
{
// Run OAuth flow与return auth profiles.
return
{
profiles
:
[
{
profileId
:
"acme:default"
,
credential
:
{
type
:
"oauth"
,
provider
:
"acme"
,
access
:
"..."
,
refresh
:
"..."
,
expires
:
Date
.now
()
+
3600
*
1000
,
}
,
}
,
]
,
defaultModel
:
"acme/opus-1"
,
};
}
,
}
,
]
,
});
Notes:
run
receives a
ProviderAuth上下文
with
prompter
,
运行时
,
openUrl
, and
oauth.createVpsAwareHandlers
helpers.
Return
configPatch
when you need到add default 模型或provider config.
Return
defaultModel
so
--set-default
can update 智能体 defaults.
​
Register a messaging 频道
Plugins can register
频道 plugins
that behave like built‑in 频道
(WhatsApp, Telegram, etc.). 频道 config lives under
频道.<id>
and is
validated通过your 频道 plugin code.
Copy
const
myChannel
=
{
id
:
"acmechat"
,
meta
:
{
id
:
"acmechat"
,
label
:
"AcmeChat"
,
selectionLabel
:
"AcmeChat (API)"
,
docsPath
:
"/频道/acmechat"
,
blurb
:
"demo 频道 plugin."
,
aliases
:
[
"acme"
]
,
}
,
capabilities
:
{ chatTypes
:
[
"direct"
] }
,
config
:
{
listAccountIds
:
(cfg)
=>
Object
.keys
(
cfg
.
频道
?.
acmechat
?.accounts
??
{})
,
resolveAccount
:
(cfg
,
accountId)
=>
cfg
.
频道
?.
acmechat
?.accounts?.[accountId
??
"default"
]
??
{
accountId
,
}
,
}
,
outbound
:
{
deliveryMode
:
"direct"
,
sendText
:
async
()
=>
({ ok
:
true
})
,
}
,
};
export
default
function
(api) {
api
.registerChannel
({ plugin
:
myChannel });
}
Notes:
Put config under
频道.<id>
(not
plugins.entries
).
meta.label
is used为labels在命令行界面/UI lists.
meta.aliases
adds alternate ids为normalization与命令行界面 inputs.
meta.preferOver
lists 频道 ids到skip auto-enable when both are configured.
meta.detailLabel
and
meta.systemImage
let UIs show richer 频道 labels/icons.
​
Write a new messaging 频道 (step‑by‑step)
Use这when you want a
new chat surface
(a “messaging 频道”), not a 模型 provider.
模型 provider docs live under
/提供者/*
.
Pick an id + config shape
All 频道 config lives under
频道.<id>
.
Prefer
频道.<id>.accounts.<accountId>
for multi‑account setups.
Define the 频道 metadata
meta.label
,
meta.selectionLabel
,
meta.docsPath
,
meta.blurb
控制 命令行界面/UI lists.
meta.docsPath
should point在a docs page like
/频道/<id>
.
meta.preferOver
lets a plugin replace another 频道 (auto-enable prefers it).
meta.detailLabel
and
meta.systemImage
are used通过UIs为detail text/icons.
Implement the required adapters
config.listAccountIds
+
config.resolveAccount
capabilities
(chat types, media, threads, etc.)
outbound.deliveryMode
+
outbound.sendText
(for basic send)
Add optional adapters as needed
设置
(向导),
security
(DM policy),
status
(health/diagnostics)
网关
(start/stop/登录),
mentions
,
threading
,
流式传输
actions
(消息 actions),
commands
(native command behavior)
Register the channel在your plugin
api.registerChannel({ plugin })
Minimal config example:
Copy
{
频道
:
{
acmechat
:
{
accounts
:
{
default
:
{
token
:
"ACME_TOKEN"
,
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
Minimal 频道 plugin (outbound‑only):
Copy
const
plugin
=
{
id
:
"acmechat"
,
meta
:
{
id
:
"acmechat"
,
label
:
"AcmeChat"
,
selectionLabel
:
"AcmeChat (API)"
,
docsPath
:
"/频道/acmechat"
,
blurb
:
"AcmeChat messaging 频道."
,
aliases
:
[
"acme"
]
,
}
,
capabilities
:
{ chatTypes
:
[
"direct"
] }
,
config
:
{
listAccountIds
:
(cfg)
=>
Object
.keys
(
cfg
.
频道
?.
acmechat
?.accounts
??
{})
,
resolveAccount
:
(cfg
,
accountId)
=>
cfg
.
频道
?.
acmechat
?.accounts?.[accountId
??
"default"
]
??
{
accountId
,
}
,
}
,
outbound
:
{
deliveryMode
:
"direct"
,
sendText
:
async
({ text })
=>
{
// deliver `text`到your 频道 here
return
{ ok
:
true
};
}
,
}
,
};
export
default
function
(api) {
api
.registerChannel
({ plugin });
}
Load the plugin (extensions dir or
plugins.load.paths
), restart the 网关,
then 配置
频道.<id>
in your config.
​
智能体 工具
See the dedicated guide:
Plugin 智能体 工具
.
​
Register a 网关 RPC method
Copy
export
default
function
(api) {
api
.registerGatewayMethod
(
"myplugin.status"
,
({ respond })
=>
{
respond
(
true
,
{ ok
:
true
});
});
}
​
Register 命令行界面 commands
Copy
export
default
function
(api) {
api
.registerCli
(
({ program })
=>
{
program
.command
(
"mycmd"
)
.action
(()
=>
{
console
.log
(
"Hello"
);
});
}
,
{ commands
:
[
"mycmd"
] }
,
);
}
​
Register auto-reply commands
Plugins can register custom slash commands那execute
without invoking the
AI 智能体
. 这是 useful为toggle commands, status checks,或quick actions
that don’t need LLM processing.
Copy
export
default
function
(api) {
api
.registerCommand
({
name
:
"mystatus"
,
description
:
"Show plugin status"
,
handler
:
(ctx)
=>
({
text
:
`Plugin is 运行! 频道:
${
ctx
.频道
}
`
,
})
,
});
}
Command handler 上下文:
senderId
: The sender’s ID (if available)
频道
: The 频道 where the command was sent
isAuthorizedSender
: Whether the sender is an authorized user
args
: Arguments passed after the command (if
acceptsArgs: true
)
commandBody
: The full command text
config
: The current OpenClaw config
Command options:
name
: Command name (without the leading
/
)
description
: 帮助 text shown在command lists
acceptsArgs
: Whether the command accepts arguments (default: false). If false与arguments are provided, the command won’t match与the 消息 falls through到other handlers
requireAuth
: Whether到require authorized sender (default: true)
handler
: Function那returns
{ text: string }
(can be async)
Example使用authorization与arguments:
Copy
api
.registerCommand
({
name
:
"setmode"
,
description
:
"Set plugin mode"
,
acceptsArgs
:
true
,
requireAuth
:
true
,
handler
:
async
(ctx)
=>
{
const
mode
=
ctx
.
args
?.trim
()
||
"default"
;
await
saveMode
(mode);
return
{ text
:
`Mode set to:
${
mode
}
`
};
}
,
});
Notes:
Plugin commands are processed
before
built-in commands与the AI 智能体
Commands are registered globally与work across all 频道
Command names are case-insensitive (
/MyStatus
matches
/mystatus
)
Command names must start使用a letter与contain only letters, numbers, hyphens,与underscores
Reserved command names (like
帮助
,
status
,
reset
, etc.) cannot be overridden通过plugins
Duplicate command registration across plugins will fail使用a diagnostic error
​
Register background services
Copy
export
default
function
(api) {
api
.registerService
({
id
:
"my-service"
,
start
:
()
=>
api
.
logger
.info
(
"ready"
)
,
stop
:
()
=>
api
.
logger
.info
(
"bye"
)
,
});
}
​
Naming conventions
网关 methods:
pluginId.action
(example:
voicecall.status
)
工具:
snake_case
(example:
voice_call
)
命令行界面 commands: kebab或camel, but avoid clashing使用core commands
​
技能
Plugins can ship a skill在the repo (
技能/<name>/SKILL.md
).
Enable it with
plugins.entries.<id>.enabled
(or other config gates)与ensure
it’s present在your 工作空间/managed 技能 locations.
​
Distribution (npm)
Recommended packaging:
Main package:
OpenClaw
(this repo)
Plugins: separate npm packages under
@OpenClaw/*
(example:
@OpenClaw/voice-call
)
Publishing contract:
Plugin
package.JSON
must include
OpenClaw.extensions
with one或more entry files.
Entry files can be
.js
or
.ts
(jiti loads TS在runtime).
OpenClaw plugins 安装 <npm-spec>
uses
npm pack
, extracts into
~/.OpenClaw/extensions/<id>/
,与enables it在config.
Config key stability: scoped packages are normalized到the
unscoped
id for
plugins.entries.*
.
​
Example plugin: Voice Call
This repo includes a voice‑call plugin (Twilio或log fallback):
Source:
extensions/voice-call
Skill:
技能/voice-call
命令行界面:
OpenClaw voicecall start|status
工具:
voice_call
RPC:
voicecall.start
,
voicecall.status
Config (twilio):
provider: "twilio"
+
twilio.accountSid/authToken/from
(optional
statusCallbackUrl
,
twimlUrl
)
Config (dev):
provider: "log"
(no network)
See
Voice Call
and
extensions/voice-call/README.md
for 设置与usage.
​
Safety notes
Plugins run in-进程使用the 网关. Treat them as trusted code:
Only 安装 plugins you trust.
Prefer
plugins.allow
allowlists.
Restart the 网关 after changes.
​
Testing plugins
Plugins can (and should) ship tests:
In-repo plugins can keep Vitest tests under
src/**
(example:
src/plugins/voice-call.plugin.测试.ts
).
Separately published plugins should run their own CI (lint/构建/测试)与validate
OpenClaw.extensions
points在the built entrypoint (
dist/index.js
).
ClawHub
Voice Call Plugin
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/plugin)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*