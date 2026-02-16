# 流式传输与分块 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
消息与传递
流式传输与分块
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
流式传输 + 分块
Block 流式传输 (频道 messages)
分块 algorithm (low/high bounds)
Coalescing (merge streamed blocks)
Human-like pacing between blocks
“流 chunks或everything”
Telegram draft 流式传输 (令牌-ish)
​
流式传输 + 分块
OpenClaw has two separate “流式传输” layers:
Block 流式传输 (频道):
emit completed
blocks
as the assistant writes. These are normal 频道 messages (not 令牌 deltas).
令牌-ish 流式传输 (Telegram only):
update a
draft bubble
with partial text while generating; final 消息 is sent在the end.
There is
no real 令牌 流式传输
to external 频道 messages today. Telegram draft 流式传输 is the only partial-流 surface.
​
Block 流式传输 (频道 messages)
Block 流式传输 sends assistant output在coarse chunks as it becomes available.
Copy
模型 output
└─ text_delta/events
├─ (blockStreamingBreak=text_end)
│    └─ chunker emits blocks as 缓冲区 grows
└─ (blockStreamingBreak=消息_end)
└─ chunker flushes在消息_end
└─ 频道 send (block replies)
Legend:
text_delta/events
: 模型 流 events (may be sparse为non-流式传输 模型).
chunker
:
EmbeddedBlockChunker
applying min/max bounds + break preference.
频道 send
: actual outbound messages (block replies).
Controls:
智能体.defaults.blockStreamingDefault
:
"on"
/
"off"
(default off).
频道 overrides:
*.blockStreaming
(and per-account variants)到force
"on"
/
"off"
per 频道.
智能体.defaults.blockStreamingBreak
:
"text_end"
or
"消息_end"
.
智能体.defaults.blockStreamingChunk
:
{ minChars, maxChars, breakPreference? }
.
智能体.defaults.blockStreamingCoalesce
:
{ minChars?, maxChars?, idleMs? }
(merge streamed blocks before send).
频道 hard cap:
*.textChunkLimit
(e.g.,
频道.WhatsApp.textChunkLimit
).
频道 chunk mode:
*.chunkMode
(
length
default,
newline
splits在blank lines (paragraph boundaries) before length 分块).
Discord soft cap:
频道.Discord.maxLinesPerMessage
(default 17) splits tall replies到avoid UI clipping.
Boundary semantics:
text_end
: 流 blocks as soon as chunker emits; flush在each
text_end
.
消息_end
: wait until assistant 消息 finishes, then flush buffered output.
消息_end
still uses the chunker if the buffered text exceeds
maxChars
, so it can emit multiple chunks在the end.
​
分块 algorithm (low/high bounds)
Block 分块 is implemented by
EmbeddedBlockChunker
:
Low bound:
don’t emit until 缓冲区 >=
minChars
(unless forced).
High bound:
prefer splits before
maxChars
; if forced, split at
maxChars
.
Break preference:
paragraph
→
newline
→
sentence
→
whitespace
→ hard break.
Code fences:
never split inside fences; when forced at
maxChars
, close + reopen the fence到keep Markdown valid.
maxChars
is clamped到the 频道
textChunkLimit
, so you can’t exceed per-频道 caps.
​
Coalescing (merge streamed blocks)
When block 流式传输 is enabled, OpenClaw can
merge consecutive block chunks
before 发送 them out. This reduces “single-line spam” while still providing
progressive output.
Coalescing waits for
idle gaps
(
idleMs
) before flushing.
Buffers are capped by
maxChars
and will flush if they exceed it.
minChars
prevents tiny fragments从发送 until enough text accumulates
(final flush always sends remaining text).
Joiner is derived from
blockStreamingChunk.breakPreference
(
paragraph
→
\n\n
,
newline
→
\n
,
sentence
→ space).
频道 overrides are available via
*.blockStreamingCoalesce
(including per-account configs).
Default coalesce
minChars
is bumped到1500为Signal/Slack/Discord unless overridden.
​
Human-like pacing between blocks
When block 流式传输 is enabled, you can add a
randomized pause
between
block replies (after the first block). This makes multi-bubble responses feel
more natural.
Config:
智能体.defaults.humanDelay
(override per 智能体 via
智能体.list[].humanDelay
).
Modes:
off
(default),
natural
(800–2500ms),
custom
(
minMs
/
maxMs
).
Applies only to
block replies
, not final replies或工具 summaries.
​
“流 chunks或everything”
This maps to:
流 chunks:
blockStreamingDefault: "on"
+
blockStreamingBreak: "text_end"
(emit as you go). Non-Telegram 频道 also need
*.blockStreaming: true
.
流 everything在end:
blockStreamingBreak: "消息_end"
(flush once, possibly multiple chunks if very long).
No block 流式传输:
blockStreamingDefault: "off"
(only final reply).
频道 note:
For non-Telegram 频道, block 流式传输 is
off unless
*.blockStreaming
is explicitly set to
true
. Telegram can 流 drafts
(
频道.Telegram.streamMode
) without block replies.
Config location reminder: the
blockStreaming*
defaults live under
智能体.defaults
, not the root config.
​
Telegram draft 流式传输 (令牌-ish)
Telegram is the only 频道使用draft 流式传输:
Uses Bot API
sendMessageDraft
in
private chats使用topics
.
频道.Telegram.streamMode: "partial" | "block" | "off"
.
partial
: draft updates使用the latest 流 text.
block
: draft updates在chunked blocks (same chunker rules).
off
: no draft 流式传输.
Draft chunk config (only for
streamMode: "block"
):
频道.Telegram.draftChunk
(defaults:
minChars: 200
,
maxChars: 800
).
Draft 流式传输 is separate从block 流式传输; block replies are off通过default与only enabled by
*.blockStreaming: true
on non-Telegram 频道.
Final reply is still a normal 消息.
/reasoning stream
writes reasoning into the draft bubble (Telegram only).
When draft 流式传输 is active, OpenClaw disables block 流式传输为that reply到avoid double-流式传输.
Copy
Telegram (private + topics)
└─ sendMessageDraft (draft bubble)
├─ streamMode=partial → update latest text
└─ streamMode=block   → chunker updates draft
└─ final reply → normal 消息
Legend:
sendMessageDraft
: Telegram draft bubble (not a real 消息).
final reply
: normal Telegram 消息 send.
消息
重试策略
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/流式传输)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*