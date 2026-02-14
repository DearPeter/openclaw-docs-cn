# Agent运行时 - OpenClaw - 中文翻译


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
Agent运行时
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
Agent运行时 🤖
工作空间（必需）
引导文件（注入）
内置工具
技能
pi-mono集成
会话
流式传输时的转向控制
模型引用
配置（最小化）
​
Agent运行时 🤖
OpenClaw运行一个源自pi-mono的单一嵌入式Agent运行时
pi-mono
.
​
工作空间（必需）
OpenClaw使用单一的Agent工作空间目录 (
智能体.defaults.工作空间
) as the 智能体’s
only
工作目录 (
cwd
) 用于工具和上下文.
推荐使用
OpenClaw 设置
来创建
~/.OpenClaw/OpenClaw.JSON
如果缺失并初始化工作空间文件.
完整的工作空间布局 + 备份指南:
Agent工作空间
If
智能体.defaults.sandbox
is enabled, non-main sessions can override这with
每个会话的工作空间位于
智能体.defaults.sandbox.workspaceRoot
(see
网关 配置
).
​
引导文件（注入）
Inside
智能体.defaults.工作空间
, OpenClaw expects这些user-editable files:
智能体.md
— operating instructions + “记忆”
SOUL.md
— persona, boundaries, tone
工具.md
— user-maintained 工具 notes (e.g.
imsg
,
sag
, conventions)
引导.md
— one-time first-run ritual (deleted after completion)
IDENTITY.md
— 智能体 name/vibe/emoji
USER.md
— user profile + preferred address
On the first turn的a new 会话, OpenClaw injects the contents的these files directly into the 智能体 上下文.
Blank files are skipped. Large files are trimmed与truncated使用a marker so prompts stay lean (read the file为full content).
If a file is missing, OpenClaw injects a single “missing file” marker line (and
OpenClaw 设置
will create a safe default template).
引导.md
is only created为a
brand new 工作空间
(no other 引导 files present). If you delete it after completing the ritual, it should not be recreated在later restarts.
To disable 引导 file creation entirely (for pre-seeded workspaces), set:
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
内置工具
Core 工具 (read/执行/edit/write与related system 工具) are always available,
subject到tool policy.
apply_patch
is optional与gated by
工具.执行.applyPatch
.
工具.md
does
not
控制 which 工具 exist; it’s
guidance为how
you
want them used.
​
技能
OpenClaw loads 技能从three locations (工作空间 wins在name conflict):
Bundled (shipped使用the 安装)
Managed/local:
~/.OpenClaw/技能
工作空间:
<工作空间>/技能
技能 can be gated通过config/env (see
技能
in
网关 配置
).
​
pi-mono集成
OpenClaw reuses pieces的the pi-mono codebase (模型/工具), but
会话 管理, discovery,与tool wiring are OpenClaw-owned
.
No pi-coding Agent运行时.
No
~/.pi/智能体
or
<工作空间>/.pi
settings are consulted.
​
会话
会话 transcripts are stored as JSONL at:
~/.OpenClaw/智能体/<agentId>/sessions/<SessionId>.jsonl
The 会话 ID is stable与chosen通过OpenClaw.
Legacy Pi/Tau 会话 folders are
not
read.
​
流式传输时的转向控制
When 队列 mode is
steer
, inbound messages are injected into the current run.
The 队列 is checked
after each 工具 call
; if a queued 消息 is present,
remaining 工具 calls从the current assistant 消息 are skipped (error 工具
results使用“Skipped due到queued user 消息.”), then the queued user
消息 is injected before the next assistant response.
When 队列 mode is
followup
or
collect
, inbound messages are held until the
current turn ends, then a new 智能体 turn starts使用the queued payloads. See
队列
for mode + debounce/cap behavior.
Block 流式传输 sends completed assistant blocks as soon as they finish; it is
off通过default
(
智能体.defaults.blockStreamingDefault: "off"
).
Tune the boundary via
智能体.defaults.blockStreamingBreak
(
text_end
vs
message_end
; defaults到text_end).
控制 soft block 分块 with
智能体.defaults.blockStreamingChunk
(defaults to
800–1200 chars; prefers paragraph breaks, then newlines; sentences last).
Coalesce streamed chunks with
智能体.defaults.blockStreamingCoalesce
to reduce
single-line spam (idle-based merging before send). Non-Telegram 频道 require
explicit
*.blockStreaming: true
to enable block replies.
Verbose 工具 summaries are emitted在tool start (no debounce); 控制 UI
streams 工具 output via 智能体 events when available.
More details:
流式传输 + 分块
.
​
模型引用
模型引用在config (for example
智能体.defaults.模型
and
智能体.defaults.模型
) are parsed通过splitting在the
first
/
.
Use
provider/模型
when configuring 模型.
If the 模型 ID itself contains
/
(OpenRouter-style), include the provider prefix (example:
openrouter/moonshotai/kimi-k2
).
If you omit the provider, OpenClaw treats the input as an alias或a model为the
default provider
(only works when there is no
/
in the 模型 ID).
​
配置（最小化）
At minimum, set:
智能体.defaults.工作空间
频道.WhatsApp.allowFrom
(strongly recommended)
下一步：
群组聊天
🦞
网关架构
Agent循环
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/智能体#配置-minimal)ng)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*