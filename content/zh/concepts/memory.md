# 记忆 - OpenClaw - 中文翻译


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
会话与记忆
记忆
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
记忆
记忆 files (Markdown)
When到write 记忆
Automatic 记忆 flush (pre-压缩 ping)
Vector 记忆 搜索
QMD backend (experimental)
Additional 记忆 paths
Gemini embeddings (native)
How the 记忆 工具 work
What gets indexed (and when)
Hybrid 搜索 (BM25 + vector)
Why hybrid?
How we merge results (the current design)
Embedding cache
会话 记忆 搜索 (experimental)
SQLite vector acceleration (sqlite-vec)
Local embedding auto-download
Custom OpenAI-compatible endpoint example
​
记忆
OpenClaw 记忆 is
plain Markdown在the 智能体 工作空间
. The files are the
source的truth; the 模型 only “remembers” what gets written到disk.
记忆 搜索 工具 are provided通过the active 记忆 plugin (default:
记忆-core
). Disable 记忆 plugins with
plugins.slots.记忆 = "none"
.
​
记忆 files (Markdown)
The default 工作空间 layout uses two 记忆 layers:
记忆/YYYY-MM-DD.md
Daily log (append-only).
Read today + yesterday在会话 start.
记忆.md
(optional)
Curated long-term 记忆.
Only load在the main, private 会话
(never在group contexts).
These files live under the 工作空间 (
智能体.defaults.工作空间
, default
~/.OpenClaw/工作空间
). See
Agent工作空间
for the full layout.
​
When到write 记忆
Decisions, preferences,与durable facts go to
记忆.md
.
Day-to-day notes与运行 上下文 go to
记忆/YYYY-MM-DD.md
.
If someone says “remember this,” write it down (do not keep it在RAM).
This area is still evolving. It helps到remind the model到store memories; it will know what到do.
If you want something到stick,
ask the bot到write it
into 记忆.
​
Automatic 记忆 flush (pre-压缩 ping)
When a 会话 is
close到auto-压缩
, OpenClaw triggers a
silent,
agentic turn
that reminds the model到write durable 记忆
before
the
上下文 is compacted. The default prompts explicitly say the 模型
may reply
,
but usually
NO_REPLY
is the correct response so the user never sees这turn.
这是 controlled by
智能体.defaults.压缩.memoryFlush
:
Copy
{
智能体
:
{
defaults
:
{
压缩
:
{
reserveTokensFloor
:
20000
,
memoryFlush
:
{
enabled
:
true
,
softThresholdTokens
:
4000
,
systemPrompt
:
"会话 nearing 压缩. Store durable memories now."
,
提示词
:
"Write any lasting notes到记忆/YYYY-MM-DD.md; reply使用NO_REPLY if nothing到store."
,
}
,
}
,
}
,
}
,
}
Details:
Soft threshold
: flush triggers when the 会话 token estimate crosses
contextWindow - reserveTokensFloor - softThresholdTokens
.
Silent
by default: prompts include
NO_REPLY
so nothing is delivered.
Two prompts
: a user 提示词 plus a system 提示词 append the reminder.
One flush per 压缩 cycle
(tracked in
sessions.JSON
).
工作空间 must be writable
: if the 会话 runs sandboxed with
workspaceAccess: "ro"
or
"none"
, the flush is skipped.
For the full 压缩 lifecycle, see
会话 管理 + 压缩
.
​
Vector 记忆 搜索
OpenClaw can 构建 a small vector index over
记忆.md
and
记忆/*.md
so
semantic queries can find related notes even when wording differs.
Defaults:
Enabled通过default.
Watches 记忆 files为changes (debounced).
配置 记忆 搜索 under
智能体.defaults.memorySearch
(not top-level
memorySearch
).
Uses remote embeddings通过default. If
memory搜索...ovider
is not set, OpenClaw auto-selects:
local
if a
memory搜索...cal.modelPath
is configured与the file exists.
openai
if an OpenAI key can be resolved.
gemini
if a Gemini key can be resolved.
voyage
if a Voyage key can be resolved.
Otherwise 记忆 搜索 stays disabled until configured.
Local mode uses node-llama-cpp与may require
pnpm approve-builds
.
Uses sqlite-vec (when available)到accelerate vector 搜索 inside SQLite.
Remote embeddings
require
an API key为the embedding provider. OpenClaw
resolves keys从auth profiles,
模型.提供者.*.apiKey
,或environment
variables. Codex OAuth only covers chat/completions与does
not
satisfy
embeddings为记忆 搜索. For Gemini, use
GEMINI_API_KEY
or
模型.提供者.google.apiKey
. For Voyage, use
VOYAGE_API_KEY
or
模型.提供者.voyage.apiKey
. When using a custom OpenAI-compatible endpoint,
set
memory搜索...mote.apiKey
(and optional
memory搜索...mote.headers
).
​
QMD backend (experimental)
Set
记忆.backend = "qmd"
to swap the built-in SQLite indexer for
QMD
: a local-first 搜索 sidecar那combines
BM25 + vectors + reranking. Markdown stays the source的truth; OpenClaw shells
out到QMD为retrieval. Key points:
Prereqs
Disabled通过default. Opt在per-config (
记忆.backend = "qmd"
).
安装 the QMD 命令行界面 separately (
bun 安装 -g https://GitHub.com/tobi/qmd
or grab
a release)与make sure the
qmd
binary is在the 网关’s
PATH
.
QMD needs an SQLite build那allows extensions (
brew 安装 sqlite
on
macOS).
QMD runs fully locally via Bun +
node-llama-cpp
and auto-downloads GGUF
模型从HuggingFace在first use (no separate Ollama daemon required).
The 网关 runs QMD在a self-contained XDG home under
~/.OpenClaw/智能体/<agentId>/qmd/
by setting
XDG_CONFIG_HOME
and
XDG_CACHE_HOME
.
OS support: macOS与Linux work out的the box once Bun + SQLite are
installed. Windows is best supported via WSL2.
How the sidecar runs
The 网关 writes a self-contained QMD home under
~/.OpenClaw/智能体/<agentId>/qmd/
(config + cache + sqlite DB).
Collections are created via
qmd collection add
from
记忆.qmd.paths
(plus default 工作空间 记忆 files), then
qmd update
+
qmd embed
run
on boot与on a configurable interval (
记忆.qmd.update.interval
,
default 5 m).
The 网关 now initializes the QMD manager在startup, so periodic update
timers are armed even before the first
memory_search
call.
Boot refresh now runs在the background通过default so chat startup is not
blocked; set
记忆.qmd.update.waitForBootSync = true
to keep the previous
blocking behavior.
搜索...run via
记忆.qmd.searchMode
(default
qmd 搜索 --JSON
; also
supports
vsearch
and
query
). If the selected mode rejects flags在your
QMD 构建, OpenClaw retries with
qmd query
. If QMD fails或the binary is
missing, OpenClaw automatically falls back到the builtin SQLite manager so
记忆 工具 keep working.
OpenClaw does not expose QMD embed batch-size tuning today; batch behavior is
controlled通过QMD itself.
First 搜索 may be slow
: QMD may download local GGUF 模型 (reranker/query
expansion)在the first
qmd query
run.
OpenClaw sets
XDG_CONFIG_HOME
/
XDG_CACHE_HOME
automatically when it runs QMD.
If you want到pre-download 模型 manually (and warm the same index OpenClaw
uses), run a one-off query使用the 智能体’s XDG dirs.
OpenClaw’s QMD state lives under your
state dir
(defaults to
~/.OpenClaw
).
You can point
qmd
at the exact same index通过exporting the same XDG vars
OpenClaw uses:
Copy
# Pick the same state dir OpenClaw uses
STATE_DIR
=
"${OPENCLAW_STATE_DIR
:-
$HOME
/
.OpenClaw}"
if
[
-d
"$HOME/.moltbot"
]
&&
[
!
-d
"$HOME/.OpenClaw"
] \
&&
[
-z
"${OPENCLAW_STATE_DIR
:-
}"
];
then
STATE_DIR
=
"$HOME/.moltbot"
fi
export
XDG_CONFIG_HOME
=
"$STATE_DIR/智能体/main/qmd/xdg-config"
export
XDG_CACHE_HOME
=
"$STATE_DIR/智能体/main/qmd/xdg-cache"
# (Optional) force an index refresh + embeddings
qmd
update
qmd
embed
# Warm up / trigger first-time 模型 downloads
qmd
query
"测试"
-c
记忆-root
--JSON
>
/dev/null
2>&1
Config surface (
记忆.qmd.*
)
command
(default
qmd
): override the executable path.
searchMode
(default
搜索
): pick which QMD command backs
memory_search
(
搜索
,
vsearch
,
query
).
includeDefault记忆
(default
true
): auto-index
记忆.md
+
记忆/**/*.md
.
paths[]
: add extra directories/files (
path
, optional
pattern
, optional
stable
name
).
sessions
: opt into 会话 JSONL indexing (
enabled
,
retentionDays
,
exportDir
).
update
: controls refresh cadence与maintenance execution:
(
interval
,
debounceMs
,
onBoot
,
waitForBootSync
,
embedInterval
,
commandTimeoutMs
,
updateTimeoutMs
,
embedTimeoutMs
).
limits
: clamp recall payload (
maxResults
,
maxSnippetChars
,
maxInjectedChars
,
timeoutMs
).
scope
: same schema as
会话.sendPolicy
.
Default is DM-only (
deny
all,
allow
direct chats); loosen it到surface QMD
hits在groups/频道.
When
scope
denies a 搜索, OpenClaw logs a warning使用the derived
频道
/
chatType
so empty results are easier到debug.
Snippets sourced outside the 工作空间 show up as
qmd/<collection>/<relative-path>
in
memory_search
results;
memory_get
understands那prefix与reads从the configured QMD collection root.
When
记忆.qmd.sessions.enabled = true
, OpenClaw exports sanitized 会话
transcripts (User/Assistant turns) into a dedicated QMD collection under
~/.OpenClaw/智能体/<id>/qmd/sessions/
, so
memory_search
can recall recent
conversations without touching the builtin SQLite index.
memory_search
snippets now include a
Source: <path#line>
footer when
记忆.citations
is
auto
/
on
; set
记忆.citations = "off"
to keep
the path metadata internal (the 智能体 still receives the path for
memory_get
, but the snippet text omits the footer与the system 提示词
warns the 智能体 not到cite it).
Example
Copy
记忆: {
backend
:
"qmd"
,
citations
:
"auto"
,
qmd
:
{
includeDefault记忆
:
true
,
update
:
{
interval
:
"5m"
,
debounceMs
:
15000 }
,
limits
:
{
maxResults
:
6
,
timeoutMs
:
4000 }
,
scope
:
{
default
:
"deny"
,
rules
:
[{
action
:
"allow"
,
match
:
{
chatType
:
"direct"
} }]
}
,
paths
:
[
{
name
:
"docs"
,
path
:
"~/notes"
,
pattern
:
"**/*.md"
}
]
}
}
Citations & fallback
记忆.citations
applies regardless的backend (
auto
/
on
/
off
).
When
qmd
runs, we tag
status().backend = "qmd"
so diagnostics show which
engine served the results. If the QMD subprocess exits或JSON output can’t be
parsed, the 搜索 manager logs a warning与returns the builtin provider
(existing Markdown embeddings) until QMD recovers.
​
Additional 记忆 paths
If you want到index Markdown files outside the default 工作空间 layout, add
explicit paths:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
extraPaths
:
[
"../team-docs"
,
"/srv/shared-notes/概述.md"
]
}
}
}
Notes:
Paths can be absolute或工作空间-relative.
Directories are scanned recursively for
.md
files.
Only Markdown files are indexed.
Symlinks are ignored (files或directories).
​
Gemini embeddings (native)
Set the provider to
gemini
to use the Gemini embeddings API directly:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
provider
:
"gemini"
,
模型
:
"gemini-embedding-001"
,
remote
:
{
apiKey
:
"YOUR_GEMINI_API_KEY"
}
}
}
}
Notes:
remote.baseUrl
is optional (defaults到the Gemini API base URL).
remote.headers
lets you add extra headers if needed.
Default 模型:
gemini-embedding-001
.
If you want到use a
custom OpenAI-compatible endpoint
(OpenRouter, vLLM,或a proxy),
you can use the
remote
配置使用the OpenAI provider:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
provider
:
"openai"
,
模型
:
"text-embedding-3-small"
,
remote
:
{
baseUrl
:
"https://api.example.com/v1/"
,
apiKey
:
"YOUR_OPENAI_COMPAT_API_KEY"
,
headers
:
{
"X-Custom-Header"
:
"value"
}
}
}
}
}
If you don’t want到set an API key, use
memory搜索...ovider = "local"
or set
memory搜索...llback = "none"
.
Fallbacks:
memory搜索...llback
can be
openai
,
gemini
,
local
, or
none
.
The fallback provider is only used when the primary embedding provider fails.
Batch indexing (OpenAI + Gemini + Voyage):
Disabled通过default. Set
智能体.defaults.memory搜索...mote.batch.enabled = true
to enable为large-corpus indexing (OpenAI, Gemini,与Voyage).
Default behavior waits为batch completion; tune
remote.batch.wait
,
remote.batch.pollIntervalMs
, and
remote.batch.timeoutMinutes
if needed.
Set
remote.batch.concurrency
to 控制 how many batch jobs we submit在parallel (default: 2).
Batch mode applies when
memory搜索...ovider = "openai"
or
"gemini"
and uses the corresponding API key.
Gemini batch jobs use the async embeddings batch endpoint与require Gemini Batch API availability.
Why OpenAI batch is fast + cheap:
For large backfills, OpenAI is typically the fastest option we support because we can submit many embedding requests在a single batch job与let OpenAI 进程 them asynchronously.
OpenAI offers discounted pricing为Batch API workloads, so large indexing runs are usually cheaper than 发送 the same requests synchronously.
See the OpenAI Batch API docs与pricing为details:
https://platform.openai.com/docs/api-参考/batch
https://platform.openai.com/pricing
Config example:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
provider
:
"openai"
,
模型
:
"text-embedding-3-small"
,
fallback
:
"openai"
,
remote
:
{
batch
:
{
enabled
:
true
,
concurrency
:
2 }
}
,
sync
:
{
watch
:
true
}
}
}
}
工具:
memory_search
— returns snippets使用file + line ranges.
memory_get
— read 记忆 file content通过path.
Local mode:
Set
智能体.defaults.memory搜索...ovider = "local"
.
Provide
智能体.defaults.memory搜索...cal.modelPath
(GGUF or
hf:
URI).
Optional: set
智能体.defaults.memory搜索...llback = "none"
to avoid remote fallback.
​
How the 记忆 工具 work
memory_search
semantically searches Markdown chunks (~400 token target, 80-token overlap) from
记忆.md
+
记忆/**/*.md
. It returns snippet text (capped ~700 chars), file path, line range, score, provider/模型,与whether we fell back从local → remote embeddings. No full file payload is returned.
memory_get
reads a specific 记忆 Markdown file (工作空间-relative), optionally从a starting line与for N lines. Paths outside
记忆.md
/
记忆/
are rejected.
Both 工具 are enabled only when
memory搜索...abled
resolves true为the 智能体.
​
What gets indexed (and when)
File type: Markdown only (
记忆.md
,
记忆/**/*.md
).
Index storage: per-智能体 SQLite at
~/.OpenClaw/记忆/<agentId>.sqlite
(configurable via
智能体.defaults.memory搜索...ore.path
, supports
{agentId}
token).
Freshness: watcher on
记忆.md
+
记忆/
marks the index dirty (debounce 1.5s). Sync is scheduled在会话 start,在搜索,或on an interval与runs asynchronously. 会话 transcripts use delta thresholds到trigger background sync.
Reindex triggers: the index stores the embedding
provider/模型 + endpoint fingerprint + 分块 params
. If any的those change, OpenClaw automatically resets与reindexes the entire store.
​
Hybrid 搜索 (BM25 + vector)
When enabled, OpenClaw combines:
Vector similarity
(semantic match, wording can differ)
BM25 keyword relevance
(exact tokens like IDs, env vars, code symbols)
If full-text 搜索 is unavailable在your platform, OpenClaw falls back到vector-only 搜索.
​
Why hybrid?
Vector 搜索 is great在“this means the same thing”:
“Mac Studio 网关 host” vs “the machine 运行 the 网关”
“debounce file updates” vs “avoid indexing在every write”
But it can be weak在exact, high-signal tokens:
IDs (
a828e60
,
b3b9895a…
)
code symbols (
memory搜索...ery.hybrid
)
error strings (“sqlite-vec unavailable”)
BM25 (full-text) is the opposite: strong在exact tokens, weaker在paraphrases.
Hybrid 搜索 is the pragmatic middle ground:
use both retrieval signals
so you get
good results为both “natural language” queries与“needle在a haystack” queries.
​
How we merge results (the current design)
Implementation sketch:
Retrieve a candidate pool从both sides:
Vector
: top
maxResults * candidateMultiplier
by cosine similarity.
BM25
: top
maxResults * candidateMultiplier
by FTS5 BM25 rank (lower is better).
Convert BM25 rank into a 0..1-ish score:
textScore = 1 / (1 + max(0, bm25Rank))
Union candidates通过chunk id与compute a weighted score:
finalScore = vectorWeight * vectorScore + textWeight * textScore
Notes:
vectorWeight
+
textWeight
is normalized到1.0在config resolution, so weights behave as percentages.
If embeddings are unavailable (or the provider returns a zero-vector), we still run BM25与return keyword matches.
If FTS5 can’t be created, we keep vector-only 搜索 (no hard failure).
这是n’t “IR-theory perfect”, but it’s simple, fast,与tends到improve recall/precision在real notes.
If we want到get fancier later, common next steps are Reciprocal Rank Fusion (RRF)或score normalization
(min/max或z-score) before mixing.
Config:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
query
:
{
hybrid
:
{
enabled
:
true
,
vectorWeight
:
0.7
,
textWeight
:
0.3
,
candidateMultiplier
:
4
}
}
}
}
}
​
Embedding cache
OpenClaw can cache
chunk embeddings
in SQLite so reindexing与frequent updates (especially 会话 transcripts) don’t re-embed unchanged text.
Config:
Copy
智能体: {
defaults
:
{
memorySearch
:
{
cache
:
{
enabled
:
true
,
maxEntries
:
50000
}
}
}
}
​
会话 记忆 搜索 (experimental)
You can optionally index
会话 transcripts
and surface them via
memory_search
.
这是 gated behind an experimental flag.
Copy
智能体: {
defaults
:
{
memorySearch
:
{
experimental
:
{
session记忆
:
true
}
,
sources
:
[
"记忆"
,
"sessions"
]
}
}
}
Notes:
会话 indexing is
opt-in
(off通过default).
会话 updates are debounced and
indexed asynchronously
once they cross delta thresholds (best-effort).
memory_search
never blocks在indexing; results can be slightly stale until background sync finishes.
Results still include snippets only;
memory_get
remains limited到记忆 files.
会话 indexing is isolated per 智能体 (only那agent’s 会话 logs are indexed).
会话 logs live在disk (
~/.OpenClaw/智能体/<agentId>/sessions/*.jsonl
). Any 进程/user使用filesystem access can read them, so treat disk access as the trust boundary. For stricter isolation, run 智能体 under separate OS users或hosts.
Delta thresholds (defaults shown):
Copy
智能体: {
defaults
:
{
memorySearch
:
{
sync
:
{
sessions
:
{
deltaBytes
:
100000
,
// ~100 KB
delta消息
:
50     // JSONL lines
}
}
}
}
}
​
SQLite vector acceleration (sqlite-vec)
When the sqlite-vec extension is available, OpenClaw stores embeddings在a
SQLite virtual table (
vec0
)与performs vector distance queries在the
database. This keeps 搜索 fast without loading every embedding into JS.
配置 (optional):
Copy
智能体: {
defaults
:
{
memorySearch
:
{
store
:
{
vector
:
{
enabled
:
true
,
extensionPath
:
"/path/to/sqlite-vec"
}
}
}
}
}
Notes:
enabled
defaults到true; when disabled, 搜索 falls back到in-进程
cosine similarity over stored embeddings.
If the sqlite-vec extension is missing或fails到load, OpenClaw logs the
error与continues使用the JS fallback (no vector table).
extensionPath
overrides the bundled sqlite-vec path (useful为custom builds
or non-standard 安装 locations).
​
Local embedding auto-download
Default local embedding 模型:
hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf
(~0.6 GB).
When
memory搜索...ovider = "local"
,
node-llama-cpp
resolves
modelPath
; if the GGUF is missing it
auto-downloads
to the cache (or
local.modelCacheDir
if set), then loads it. Downloads resume在retry.
Native 构建 requirement: run
pnpm approve-builds
, pick
node-llama-cpp
, then
pnpm rebuild node-llama-cpp
.
Fallback: if local 设置 fails and
memory搜索...llback = "openai"
, we automatically switch到remote embeddings (
openai/text-embedding-3-small
unless overridden)与record the reason.
​
Custom OpenAI-compatible endpoint example
Copy
智能体: {
defaults
:
{
memorySearch
:
{
provider
:
"openai"
,
模型
:
"text-embedding-3-small"
,
remote
:
{
baseUrl
:
"https://api.example.com/v1/"
,
apiKey
:
"YOUR_REMOTE_API_KEY"
,
headers
:
{
"X-Organization"
:
"org-id"
,
"X-Project"
:
"project-id"
}
}
}
}
}
Notes:
remote.*
takes precedence over
模型.提供者.openai.*
.
remote.headers
merge使用OpenAI headers; remote wins在key conflicts. Omit
remote.headers
to use the OpenAI defaults.
会话 工具
压缩
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/记忆#custom-openai-compatible-endpoint-example)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*