# 上下文 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
基础概念
上下文
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
代理运行时
代理循环
系统提示
上下文
代理工作空间
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
多代理
多代理路由
在线状态
消息与传递
消息
流式传输与分块
重试策略
命令队列
本页内容
上下文
Quick start (inspect 上下文)
Example output
/上下文 list
/上下文 detail
What counts toward the 上下文 window
How OpenClaw builds the system 提示词
Injected 工作空间 files (Project 上下文)
技能: what’s injected vs loaded on-demand
工具: there are two costs
Commands, directives,与“inline shortcuts”
会话, 压缩,与pruning (what persists)
What /上下文 actually reports
​
上下文
“上下文” is
everything OpenClaw sends到the model为a run
. It is bounded通过the 模型’s
上下文 window
(令牌 limit).
Beginner mental 模型:
System 提示词
(OpenClaw-built): rules, 工具, 技能 list, time/运行时,与injected 工作空间 files.
Conversation history
: your messages + the assistant’s messages为this 会话.
工具 calls/results + attachments
: command output, file reads, images/audio, etc.
上下文 is
not the same thing
as “记忆”: 记忆 can be stored在disk与reloaded later; 上下文 is what’s inside the 模型’s current window.
​
Quick start (inspect 上下文)
/status
→ quick “how full is my window?” view + 会话 settings.
/上下文 list
→ what’s injected + rough sizes (per file + totals).
/上下文 detail
→ deeper breakdown: per-file, per-工具 schema sizes, per-skill entry sizes,与system 提示词 size.
/usage tokens
→ append per-reply usage footer到normal replies.
/compact
→ summarize older history into a compact entry到free window space.
另请参阅:
Slash commands
,
令牌 use & costs
,
压缩
.
​
Example output
Values vary通过model, provider, 工具 policy,与what’s在your 工作空间.
​
/上下文 list
Copy
🧠 上下文 breakdown
工作空间: <workspaceDir>
引导 max/file: 20,000 chars
Sandbox: mode=non-main sandboxed=false
System 提示词 (run): 38,412 chars (~9,603 tok) (Project 上下文 23,901 chars (~5,976 tok))
Injected 工作空间 files:
- 智能体.md: OK | raw 1,742 chars (~436 tok) | injected 1,742 chars (~436 tok)
- SOUL.md: OK | raw 912 chars (~228 tok) | injected 912 chars (~228 tok)
- 工具.md: TRUNCATED | raw 54,210 chars (~13,553 tok) | injected 20,962 chars (~5,241 tok)
- IDENTITY.md: OK | raw 211 chars (~53 tok) | injected 211 chars (~53 tok)
- USER.md: OK | raw 388 chars (~97 tok) | injected 388 chars (~97 tok)
- HEARTBEAT.md: MISSING | raw 0 | injected 0
- 引导.md: OK | raw 0 chars (~0 tok) | injected 0 chars (~0 tok)
技能 list (system 提示词 text): 2,184 chars (~546 tok) (12 技能)
工具: read, edit, write, 执行, 进程, 浏览器, 消息, sessions_send, …
工具 list (system 提示词 text): 1,032 chars (~258 tok)
工具 schemas (JSON): 31,988 chars (~7,997 tok) (counts toward 上下文; not shown as text)
工具: (same as above)
会话 tokens (cached): 14,250 total / ctx=32,000
​
/上下文 detail
Copy
🧠 上下文 breakdown (detailed)
…
Top 技能 (提示词 entry size):
- frontend-design: 412 chars (~103 tok)
- oracle: 401 chars (~101 tok)
… (+10 more 技能)
Top 工具 (schema size):
- 浏览器: 9,812 chars (~2,453 tok)
- 执行: 6,240 chars (~1,560 tok)
… (+N more 工具)
​
What counts toward the 上下文 window
Everything the 模型 receives counts, including:
System 提示词 (all sections).
Conversation history.
工具 calls + 工具 results.
Attachments/transcripts (images/audio/files).
压缩 summaries与pruning artifacts.
Provider “wrappers”或hidden headers (not visible, still counted).
​
How OpenClaw builds the system 提示词
The system 提示词 is
OpenClaw-owned
and rebuilt each run. It includes:
工具 list + short descriptions.
技能 list (metadata only; see below).
工作空间 location.
Time (UTC + converted user time if configured).
运行时 metadata (host/OS/模型/thinking).
Injected 工作空间 引导 files under
Project 上下文
.
Full breakdown:
系统提示
.
​
Injected 工作空间 files (Project 上下文)
By default, OpenClaw injects a fixed set的工作空间 files (if present):
智能体.md
SOUL.md
工具.md
IDENTITY.md
USER.md
HEARTBEAT.md
引导.md
(first-run only)
Large files are truncated per-file using
智能体.defaults.bootstrapMaxChars
(default
20000
chars).
/上下文
shows
raw vs injected
sizes与whether truncation happened.
​
技能: what’s injected vs loaded on-demand
The system 提示词 includes a compact
技能 list
(name + description + location). This list has real overhead.
Skill instructions are
not
included通过default. The 模型 is expected to
read
the skill’s
SKILL.md
only when needed
.
​
工具: there are two costs
工具 affect 上下文在two ways:
工具 list text
in the system 提示词 (what you see as “Tooling”).
工具 schemas
(JSON). These are sent到the 模型 so it can call 工具. They count toward 上下文 even though you don’t see them as plain text.
/上下文 detail
breaks down the biggest 工具 schemas so you can see what dominates.
​
Commands, directives,与“inline shortcuts”
Slash commands are handled通过the 网关. There are a few different behaviors:
Standalone commands
: a 消息那is only
/...
runs as a command.
Directives
:
/think
,
/verbose
,
/reasoning
,
/elevated
,
/模型
,
/队列
are stripped before the 模型 sees the 消息.
Directive-only messages persist 会话 settings.
Inline directives在a normal 消息 act as per-消息 hints.
Inline shortcuts
(allowlisted senders only): certain
/...
tokens inside a normal 消息 can run immediately (example: “hey /status”),与are stripped before the 模型 sees the remaining text.
Details:
Slash commands
.
​
会话, 压缩,与pruning (what persists)
What persists across messages depends在the mechanism:
Normal history
persists在the 会话 transcript until compacted/pruned通过policy.
压缩
persists a summary into the transcript与keeps recent messages intact.
修剪
removes old 工具 results从the
in-记忆
prompt为a run, but does not rewrite the transcript.
Docs:
会话
,
压缩
,
会话 修剪
.
​
What
/上下文
actually reports
/上下文
prefers the latest
run-built
system 提示词 report when available:
System 提示词 (run)
= captured从the last embedded (工具-capable) run与persisted在the 会话 store.
System 提示词 (estimate)
= computed在the fly when no run report exists (or when 运行 via a 命令行界面 backend那doesn’t generate the report).
Either way, it reports sizes与top contributors; it does
not
dump the full 系统提示或工具 schemas.
系统提示
代理工作空间
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/上下文)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*