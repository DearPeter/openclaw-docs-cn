# Lobster - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
Lobster
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
Lobster
Hook
Why
Why a DSL instead的plain programs?
How it works
Pattern: small 命令行界面 + JSON pipes + approvals
JSON-only LLM steps (llm-task)
Workflow files (.lobster)
安装 Lobster
Enable the 工具
示例： Email triage
工具 parameters
run
resume
Optional inputs
Output envelope
Approvals
OpenProse
Safety
Troubleshooting
Learn more
Case study: community workflows
​
Lobster
Lobster is a workflow shell那lets OpenClaw run multi-step 工具 sequences as a single, deterministic operation使用explicit approval checkpoints.
​
Hook
Your assistant can 构建 the 工具那manage itself. Ask为a workflow,与30 minutes later you have a 命令行界面 plus pipelines那run as one call. Lobster is the missing piece: deterministic pipelines, explicit approvals,与resumable state.
​
Why
Today, complex workflows require many back-and-forth 工具 calls. Each call costs tokens,与the LLM has到orchestrate every step. Lobster moves那orchestration into a typed 运行时:
One call instead的many
: OpenClaw runs one Lobster 工具 call与gets a structured result.
Approvals built in
: Side effects (send email, post comment) halt the workflow until explicitly approved.
Resumable
: Halted workflows return a token; approve与resume without re-运行 everything.
​
Why a DSL instead的plain programs?
Lobster is intentionally small. The goal is not “a new language,” it’s a predictable, AI-friendly pipeline spec使用first-class approvals与resume tokens.
Approve/resume is built in
: A normal program can 提示词 a human, but it can’t
pause与resume
with a durable token without you inventing那runtime yourself.
Determinism + auditability
: Pipelines are data, so they’re easy到log, diff, replay,与review.
Constrained surface为AI
: A tiny grammar + JSON piping reduces “creative” code paths与makes validation realistic.
Safety policy baked in
: Timeouts, output caps, sandbox checks,与allowlists are enforced通过the 运行时, not each script.
Still programmable
: Each step can call any 命令行界面或script. If you want JS/TS, generate
.lobster
files从code.
​
How it works
OpenClaw launches the local
lobster
命令行界面 in
工具 mode
and parses a JSON envelope从stdout.
If the pipeline pauses为approval, the 工具 returns a
resumeToken
so you can continue later.
​
Pattern: small 命令行界面 + JSON pipes + approvals
构建 tiny commands那speak JSON, then chain them into a single Lobster call. (Example command names below — swap在your own.)
Copy
inbox
list
--JSON
inbox
categorize
--JSON
inbox
apply
--JSON
Copy
{
"action"
:
"run"
,
"pipeline"
:
"执行 --JSON --shell 'inbox list --JSON' | 执行 --stdin JSON --shell 'inbox categorize --JSON' | 执行 --stdin JSON --shell 'inbox apply --JSON' | approve --preview-from-stdin --limit 5 --提示词 'Apply changes?'"
,
"timeoutMs"
:
30000
}
If the pipeline requests approval, resume使用the token:
Copy
{
"action"
:
"resume"
,
"token"
:
"<resumeToken>"
,
"approve"
:
true
}
AI triggers the workflow; Lobster executes the steps. Approval gates keep side effects explicit与auditable.
示例： map input items into 工具 calls:
Copy
gog.gmail.搜索
--query
'newer_than:1d'
\
|
OpenClaw.invoke
--工具
消息
--action
send
--each
--item-key
消息
--args-JSON
'{"provider":"Telegram","to":"..."}'
​
JSON-only LLM steps (llm-task)
For workflows那need a
structured LLM step
, enable the optional
llm-task
plugin tool与call it从Lobster. This keeps the workflow
deterministic while still letting you classify/summarize/draft使用a 模型.
Enable the 工具:
Copy
{
"plugins"
:
{
"entries"
:
{
"llm-task"
:
{
"enabled"
:
true
}
}
}
,
"智能体"
:
{
"list"
:
[
{
"id"
:
"main"
,
"工具"
:
{
"allow"
:
[
"llm-task"
] }
}
]
}
}
Use it在a pipeline:
Copy
OpenClaw.invoke --工具 llm-task --action JSON --args-JSON '{
"提示词": "Given the input email, return intent与draft.",
"input": { "subject": "Hello", "body": "Can you 帮助?" },
"schema": {
"type": "object",
"properties": {
"intent": { "type": "string" },
"draft": { "type": "string" }
},
"required": ["intent", "draft"],
"additionalProperties": false
}
}'
See
LLM任务
for details与配置 options.
​
Workflow files (.lobster)
Lobster can run YAML/JSON workflow files with
name
,
args
,
steps
,
env
,
condition
, and
approval
fields. In OpenClaw 工具 calls, set
pipeline
to the file path.
Copy
name
:
inbox-triage
args
:
tag
:
default
:
"family"
steps
:
-
id
:
collect
command
:
inbox list --JSON
-
id
:
categorize
command
:
inbox categorize --JSON
stdin
:
$collect.stdout
-
id
:
approve
command
:
inbox apply --approve
stdin
:
$categorize.stdout
approval
:
required
-
id
:
execute
command
:
inbox apply --execute
stdin
:
$categorize.stdout
condition
:
$approve.approved
Notes:
stdin: $step.stdout
and
stdin: $step.JSON
pass a prior step’s output.
condition
(or
when
) can gate steps on
$step.approved
.
​
安装 Lobster
安装 the Lobster 命令行界面在the
same host
that runs the OpenClaw 网关 (see the
Lobster repo
),与ensure
lobster
is on
PATH
.
If you want到use a custom binary location, pass an
absolute
lobsterPath
in the 工具 call.
​
Enable the 工具
Lobster is an
optional
plugin 工具 (not enabled通过default).
Recommended (additive, safe):
Copy
{
"工具"
:
{
"alsoAllow"
:
[
"lobster"
]
}
}
Or per-智能体:
Copy
{
"智能体"
:
{
"list"
:
[
{
"id"
:
"main"
,
"工具"
:
{
"alsoAllow"
:
[
"lobster"
]
}
}
]
}
}
Avoid using
工具.allow: ["lobster"]
unless you intend到run在restrictive allowlist mode.
Note: allowlists are opt-in为optional plugins. If your allowlist only names
plugin 工具 (like
lobster
), OpenClaw keeps core 工具 enabled. To restrict core
工具, include the core 工具或groups you want在the allowlist too.
​
示例： Email triage
Without Lobster:
Copy
User: "Check my email与draft replies"
→ OpenClaw calls gmail.list
→ LLM summarizes
→ User: "draft replies到#2与#5"
→ LLM drafts
→ User: "send #2"
→ OpenClaw calls gmail.send
(repeat daily, no 记忆的what was triaged)
With Lobster:
Copy
{
"action"
:
"run"
,
"pipeline"
:
"email.triage --limit 20"
,
"timeoutMs"
:
30000
}
Returns a JSON envelope (truncated):
Copy
{
"ok"
:
true
,
"status"
:
"needs_approval"
,
"output"
:
[{
"summary"
:
"5 need replies, 2 need action"
}]
,
"requiresApproval"
:
{
"type"
:
"approval_request"
,
"提示词"
:
"Send 2 draft replies?"
,
"items"
:
[]
,
"resumeToken"
:
"..."
}
}
User approves → resume:
Copy
{
"action"
:
"resume"
,
"token"
:
"<resumeToken>"
,
"approve"
:
true
}
One workflow. Deterministic. Safe.
​
工具 parameters
​
run
Run a pipeline在tool mode.
Copy
{
"action"
:
"run"
,
"pipeline"
:
"gog.gmail.搜索 --query 'newer_than:1d' | email.triage"
,
"cwd"
:
"/path/to/工作空间"
,
"timeoutMs"
:
30000
,
"maxStdoutBytes"
:
512000
}
Run a workflow file使用args:
Copy
{
"action"
:
"run"
,
"pipeline"
:
"/path/to/inbox-triage.lobster"
,
"argsJson"
:
"{\"tag\":\"family\"}"
}
​
resume
Continue a halted workflow after approval.
Copy
{
"action"
:
"resume"
,
"token"
:
"<resumeToken>"
,
"approve"
:
true
}
​
Optional inputs
lobsterPath
: Absolute path到the Lobster binary (omit到use
PATH
).
cwd
: Working directory为the pipeline (defaults到the current 进程 工作目录).
timeoutMs
: Kill the subprocess if it exceeds这duration (default: 20000).
maxStdoutBytes
: Kill the subprocess if stdout exceeds这size (default: 512000).
argsJson
: JSON string passed to
lobster run --args-JSON
(workflow files only).
​
Output envelope
Lobster returns a JSON envelope使用one的three statuses:
ok
→ finished successfully
needs_approval
→ paused;
requiresApproval.resumeToken
is required到resume
cancelled
→ explicitly denied或cancelled
The 工具 surfaces the envelope在both
content
(pretty JSON) and
details
(raw object).
​
Approvals
If
requiresApproval
is present, inspect the prompt与decide:
approve: true
→ resume与continue side effects
approve: false
→ cancel与finalize the workflow
Use
approve --preview-from-stdin --limit N
to attach a JSON preview到approval requests without custom jq/heredoc glue. Resume tokens are now compact: Lobster stores workflow resume state under its state dir与hands back a small token key.
​
OpenProse
OpenProse pairs well使用Lobster: use
/prose
to orchestrate multi-智能体 prep, then run a Lobster pipeline为deterministic approvals. If a Prose program needs Lobster, allow the
lobster
tool为sub-智能体 via
工具.subagents.工具
. See
OpenProse
.
​
Safety
Local subprocess only
— no network calls从the plugin itself.
No secrets
— Lobster doesn’t manage OAuth; it calls OpenClaw 工具那do.
Sandbox-aware
— disabled when the 工具 上下文 is sandboxed.
Hardened
—
lobsterPath
must be absolute if specified; timeouts与output caps enforced.
​
Troubleshooting
lobster subprocess timed out
→ increase
timeoutMs
,或split a long pipeline.
lobster output exceeded maxStdoutBytes
→ raise
maxStdoutBytes
or reduce output size.
lobster returned invalid JSON
→ ensure the pipeline runs在tool mode与prints only JSON.
lobster failed (code …)
→ run the same pipeline在a terminal到inspect stderr.
​
Learn more
Plugins
Plugin 工具 authoring
​
Case study: community workflows
One public example: a “second brain” 命令行界面 + Lobster pipelines那manage three Markdown vaults (personal, partner, shared). The 命令行界面 emits JSON为stats, inbox listings,与stale scans; Lobster chains那些commands into workflows like
weekly-review
,
inbox-triage
,
记忆-consolidation
, and
shared-task-sync
, each使用approval gates. AI handles judgment (categorization) when available与falls back到deterministic rules when not.
Thread:
https://x.com/plattenschieber/status/2014508656335770033
Repo:
https://GitHub.com/bloomedai/brain-命令行界面
工具
LLM任务
I
[查看英文原版](https://docs.OpenClaw.ai/工具/lobster)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*