# System Prompt - OpenClaw - 中文翻译


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
基础概念
系统提示
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
系统提示
Structure
提示词 modes
工作空间 引导 injection
Time handling
技能
Documentation
​
系统提示
OpenClaw builds a custom system prompt为every 智能体 run. The 提示词 is
OpenClaw-owned
and does not use the p-coding-智能体 default 提示词.
The 提示词 is assembled通过OpenClaw与injected into each 智能体 run.
​
Structure
The 提示词 is intentionally compact与uses fixed sections:
Tooling
: current 工具 list + short descriptions.
Safety
: short guardrail reminder到avoid power-seeking behavior或bypassing oversight.
技能
(when available): tells the 模型 how到load skill instructions在demand.
OpenClaw Self-Update
: how到run
config.apply
and
update.run
.
工作空间
: 工作目录 (
智能体.defaults.工作空间
).
Documentation
: local path到OpenClaw docs (repo或npm package)与when到read them.
工作空间 Files (injected)
: indicates 引导 files are included below.
Sandbox
(when enabled): indicates sandboxed 运行时, sandbox paths,与whether elevated 执行 is available.
Current Date & Time
: user-local time, timezone,与time format.
Reply Tags
: optional reply tag syntax为supported 提供者.
Heartbeats
: heartbeat prompt与ack behavior.
运行时
: host, OS, node, 模型, repo root (when detected), thinking level (one line).
Reasoning
: current visibility level + /reasoning toggle hint.
Safety guardrails在the system 提示词 are advisory. They guide 模型 behavior but do not enforce policy. Use 工具 policy, 执行 approvals, sandboxing,与channel allowlists为hard enforcement; operators can disable these通过design.
​
提示词 modes
OpenClaw can render smaller system prompts为sub-智能体. The 运行时 sets a
promptMode
for each run (not a user-facing config):
full
(default): includes all sections above.
minimal
: used为sub-智能体; omits
技能
,
记忆 Recall
,
OpenClaw
Self-Update
,
模型 Aliases
,
User Identity
,
Reply Tags
,
Messaging
,
Silent Replies
, and
Heartbeats
. Tooling,
Safety
,
工作空间, Sandbox, Current Date & Time (when known), 运行时,与injected
上下文 stay available.
none
: returns only the base identity line.
When
promptMode=minimal
, extra injected prompts are labeled
Subagent
上下文
instead of
Group Chat 上下文
.
​
工作空间 引导 injection
引导 files are trimmed与appended under
Project 上下文
so the 模型 sees identity与profile 上下文 without needing explicit reads:
智能体.md
SOUL.md
工具.md
IDENTITY.md
USER.md
HEARTBEAT.md
引导.md
(only在brand-new workspaces)
记忆.md
and/or
记忆.md
(when present在the 工作空间; either或both may be injected)
All的these files are
injected into the 上下文 window
on every turn, which
means they consume tokens. Keep them concise — especially
记忆.md
, which can
grow over time与lead到unexpectedly high 上下文 usage与more frequent
压缩.
Note:
记忆/*.md
daily files are
not
injected automatically. They
are accessed在demand via the
memory_search
and
memory_get
工具, so they
do not count against the 上下文 window unless the 模型 explicitly reads them.
Large files are truncated使用a marker. The max per-file size is controlled by
智能体.defaults.bootstrapMaxChars
(default: 20000). Missing files inject a
short missing-file marker.
Sub-智能体 sessions only inject
智能体.md
and
工具.md
(other 引导 files
are filtered out到keep the sub-智能体 上下文 small).
Internal hooks can intercept这step via
智能体:引导
to mutate或replace
the injected 引导 files (for example swapping
SOUL.md
for an alternate persona).
To inspect how much each injected file contributes (raw vs injected, truncation, plus 工具 schema overhead), use
/上下文 list
or
/上下文 detail
. See
上下文
.
​
Time handling
The system 提示词 includes a dedicated
Current Date & Time
section when the
user timezone is known. To keep the 提示词 cache-stable, it now only includes
the
time zone
(no dynamic clock或time format).
Use
session_status
when the 智能体 needs the current time; the status card
includes a timestamp line.
配置 with:
智能体.defaults.userTimezone
智能体.defaults.timeFormat
(
auto
|
12
|
24
)
See
Date & Time
for full behavior details.
​
技能
When eligible 技能 exist, OpenClaw injects a compact
available 技能 list
(
format技能ForPrompt
)那includes the
file path
for each skill. The
提示词 instructs the model到use
read
to load the SKILL.md在the listed
location (工作空间, managed,或bundled). If no 技能 are eligible, the
技能 section is omitted.
Copy
<available_skills>
<skill>
<name>...</name>
<description>...</description>
<location>...</location>
</skill>
</available_skills>
This keeps the base 提示词 small while still enabling targeted skill usage.
​
Documentation
When available, the system 提示词 includes a
Documentation
section那points到the
local OpenClaw docs directory (either
docs/
in the repo 工作空间或the bundled npm
package docs)与also notes the public mirror, source repo, community Discord, and
ClawHub (
https://clawhub.com
)为技能 discovery. The 提示词 instructs the model到consult local docs first
for OpenClaw behavior, commands, 配置,或架构,与to run
OpenClaw status
itself when possible (asking the user only when it lacks access).
Agent循环
上下文
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/system-提示词)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*