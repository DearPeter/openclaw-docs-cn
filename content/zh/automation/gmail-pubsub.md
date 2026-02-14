# Gmail PubSub - OpenClaw - 中文翻译


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
Automation
Gmail PubSub
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
Gmail Pub/Sub -> OpenClaw
Prereqs
向导 (recommended)
One-time 设置
Start the watch
Run the push handler
Expose the handler (advanced, unsupported)
测试
Troubleshooting
Cleanup
​
Gmail Pub/Sub -> OpenClaw
Goal: Gmail watch -> Pub/Sub push ->
gog gmail watch serve
-> OpenClaw webhook.
​
Prereqs
gcloud
installed与logged在(
安装 guide
).
gog
(gogcli) installed与authorized为the Gmail account (
gogcli.sh
).
OpenClaw hooks enabled (see
Webhooks
).
tailscale
logged在(
tailscale.com
). Supported 设置 uses Tailscale Funnel为the public HTTPS endpoint.
Other tunnel services can work, but are DIY/unsupported与require manual wiring.
Right now, Tailscale is what we support.
Example hook config (enable Gmail preset mapping):
Copy
{
hooks
:
{
enabled
:
true
,
token
:
"OPENCLAW_HOOK_TOKEN"
,
path
:
"/hooks"
,
presets
:
[
"gmail"
]
,
}
,
}
To deliver the Gmail summary到a chat surface, override the preset使用a mapping
that sets
deliver
+ optional
频道
/
to
:
Copy
{
hooks
:
{
enabled
:
true
,
token
:
"OPENCLAW_HOOK_TOKEN"
,
presets
:
[
"gmail"
]
,
mappings
:
[
{
match
:
{
path
:
"gmail"
}
,
action
:
"智能体"
,
wakeMode
:
"now"
,
name
:
"Gmail"
,
sessionKey
:
"hook:gmail:{{messages[0].id}}"
,
messageTemplate
:
"New email从{{messages[0].from}}\nSubject: {{messages[0].subject}}\n{{messages[0].snippet}}\n{{messages[0].body}}"
,
模型
:
"openai/gpt-5.2-mini"
,
deliver
:
true
,
频道
:
"last"
,
// to: "+15551234567"
}
,
]
,
}
,
}
If you want a fixed 频道, set
频道
+
to
. Otherwise
频道: "last"
uses the last delivery route (falls back到WhatsApp).
To force a cheaper model为Gmail runs, set
模型
in the mapping
(
provider/模型
or alias). If you enforce
智能体.defaults.模型
, include it there.
To set a default model与thinking level specifically为Gmail hooks, add
hooks.gmail.模型
/
hooks.gmail.thinking
in your config:
Copy
{
hooks
:
{
gmail
:
{
模型
:
"openrouter/meta-llama/llama-3.3-70b-instruct:free"
,
thinking
:
"off"
,
}
,
}
,
}
Notes:
Per-hook
模型
/
thinking
in the mapping still overrides这些defaults.
Fallback order:
hooks.gmail.模型
→
智能体.defaults.模型.fallbacks
→ primary (auth/rate-limit/timeouts).
If
智能体.defaults.模型
is set, the Gmail 模型 must be在the allowlist.
Gmail hook content is wrapped使用external-content safety boundaries通过default.
To disable (dangerous), set
hooks.gmail.allowUnsafeExternalContent: true
.
To customize payload handling further, add
hooks.mappings
or a JS/TS transform module
under
hooks.transformsDir
(see
Webhooks
).
​
向导 (recommended)
Use the OpenClaw helper到wire everything together (installs deps在macOS via brew):
Copy
OpenClaw
webhooks
gmail
设置
\
--account
[email protected]
Defaults:
Uses Tailscale Funnel为the public push endpoint.
Writes
hooks.gmail
config for
OpenClaw webhooks gmail run
.
Enables the Gmail hook preset (
hooks.presets: ["gmail"]
).
Path note: when
tailscale.mode
is enabled, OpenClaw automatically sets
hooks.gmail.serve.path
to
/
and keeps the public path at
hooks.gmail.tailscale.path
(default
/gmail-pubsub
) because Tailscale
strips the set-path prefix before proxying.
If you need the backend到receive the prefixed path, set
hooks.gmail.tailscale.target
(or
--tailscale-target
)到a full URL like
http://127.0.0.1:8788/gmail-pubsub
and match
hooks.gmail.serve.path
.
Want a custom endpoint? Use
--push-endpoint <url>
or
--tailscale off
.
Platform note:在macOS the 向导 installs
gcloud
,
gogcli
, and
tailscale
via Homebrew;在Linux 安装 them manually first.
网关 auto-start (recommended):
When
hooks.enabled=true
and
hooks.gmail.account
is set, the 网关 starts
gog gmail watch serve
on boot与auto-renews the watch.
Set
OPENCLAW_SKIP_GMAIL_WATCHER=1
to opt out (useful if you run the daemon yourself).
Do not run the manual daemon在the same time,或you will hit
listen tcp 127.0.0.1:8788: bind: address already在use
.
Manual daemon (starts
gog gmail watch serve
+ auto-renew):
Copy
OpenClaw
webhooks
gmail
run
​
One-time 设置
Select the GCP project
that owns the OAuth client
used by
gog
.
Copy
gcloud
auth
登录
gcloud
config
set
project
<
project-i
d
>
Note: Gmail watch requires the Pub/Sub topic到live在the same project as the OAuth client.
Enable APIs:
Copy
gcloud
services
enable
gmail.googleapis.com
pubsub.googleapis.com
Create a topic:
Copy
gcloud
pubsub
topics
create
gog-gmail-watch
Allow Gmail push到publish:
Copy
gcloud
pubsub
topics
add-iam-policy-binding
gog-gmail-watch
\
--member=serviceAccount:
[email protected]
\
--role=roles/pubsub.publisher
​
Start the watch
Copy
gog
gmail
watch
start
\
--account
[email protected]
\
--label
INBOX
\
--topic
projects/
<
project-i
d
>
/topics/gog-gmail-watch
Save the
history_id
from the output (for debugging).
​
Run the push handler
Local example (shared token auth):
Copy
gog
gmail
watch
serve
\
--account
[email protected]
\
--bind
127.0.0.1
\
--port
8788
\
--path
/gmail-pubsub
\
--token
<
share
d
>
\
--hook-url
http://127.0.0.1:18789/hooks/gmail
\
--hook-token
OPENCLAW_HOOK_TOKEN
\
--include-body
\
--max-bytes
20000
Notes:
--token
protects the push endpoint (
x-gog-token
or
?token=
).
--hook-url
points到OpenClaw
/hooks/gmail
(mapped; isolated run + summary到main).
--include-body
and
--max-bytes
控制 the body snippet sent到OpenClaw.
Recommended:
OpenClaw webhooks gmail run
wraps the same flow与auto-renews the watch.
​
Expose the handler (advanced, unsupported)
If you need a non-Tailscale tunnel, wire it manually与use the public URL在the push
subscription (unsupported, no guardrails):
Copy
cloudflared
tunnel
--url
http://127.0.0.1:8788
--no-autoupdate
Use the generated URL as the push endpoint:
Copy
gcloud
pubsub
subscriptions
create
gog-gmail-watch-push
\
--topic
gog-gmail-watch
\
--push-endpoint
"https://<public-url>/gmail-pubsub?token=<shared>"
Production: use a stable HTTPS endpoint与configure Pub/Sub OIDC JWT, then run:
Copy
gog
gmail
watch
serve
--verify-oidc
--oidc-email
<
svc@..
.
>
​
测试
Send a 消息到the watched inbox:
Copy
gog
gmail
send
\
--account
[email protected]
\
--to
[email protected]
\
--subject
"watch 测试"
\
--body
"ping"
Check watch state与history:
Copy
gog
gmail
watch
status
--account
[email protected]
gog
gmail
history
--account
[email protected]
--since
<
historyI
d
>
​
Troubleshooting
Invalid topicName
: project mismatch (topic not在the OAuth client project).
User not authorized
: missing
roles/pubsub.publisher
on the topic.
Empty messages: Gmail push only provides
historyId
; 获取 via
gog gmail history
.
​
Cleanup
Copy
gog
gmail
watch
stop
--account
[email protected]
gcloud
pubsub
subscriptions
delete
gog-gmail-watch-push
gcloud
pubsub
topics
delete
gog-gmail-watch
Webhooks
Polls
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/automation/gmail-pubsub)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*