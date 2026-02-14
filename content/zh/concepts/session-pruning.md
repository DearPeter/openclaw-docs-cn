# 会话 Pruning - OpenClaw - 中文翻译


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
会话修剪
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
会话修剪
When it runs
Smart defaults (Anthropic)
What这improves (cost + cache behavior)
What can be pruned
上下文 window estimation
Mode
cache-ttl
Soft vs hard 修剪
工具 selection
Interaction使用other limits
Defaults (when enabled)
Examples
​
会话修剪
会话 修剪 trims
old 工具 results
from the in-记忆 上下文 right before each LLM call. It does
not
rewrite the on-disk 会话 history (
*.jsonl
).
​
When it runs
When
mode: "cache-ttl"
is enabled与the last Anthropic call为the 会话 is older than
ttl
.
Only affects the messages sent到the model为that request.
Only active为Anthropic API calls (and OpenRouter Anthropic 模型).
For best results, match
ttl
to your 模型
cacheControlTtl
.
After a prune, the TTL window resets so subsequent requests keep cache until
ttl
expires again.
​
Smart defaults (Anthropic)
OAuth或设置-token
profiles: enable
cache-ttl
pruning与set heartbeat to
1h
.
API key
profiles: enable
cache-ttl
修剪, set heartbeat to
30m
,与default
cacheControlTtl
to
1h
on Anthropic 模型.
If you set any的these values explicitly, OpenClaw does
not
override them.
​
What这improves (cost + cache behavior)
Why prune:
Anthropic 提示词 caching only applies within the TTL. If a 会话 goes idle past the TTL, the next request re-caches the full 提示词 unless you trim it first.
What gets cheaper:
修剪 reduces the
cacheWrite
size为that first request after the TTL expires.
Why the TTL reset matters:
once 修剪 runs, the cache window resets, so follow‑up requests can reuse the freshly cached 提示词 instead的re-caching the full history again.
What it does not do:
修剪 doesn’t add tokens或“double” costs; it only changes what gets cached在that first post‑TTL request.
​
What can be pruned
Only
toolResult
messages.
User + assistant messages are
never
modified.
The last
keepLastAssistants
assistant messages are protected; 工具 results after那cutoff are not pruned.
If there aren’t enough assistant messages到establish the cutoff, 修剪 is skipped.
工具 results containing
image blocks
are skipped (never trimmed/cleared).
​
上下文 window estimation
修剪 uses an estimated 上下文 window (chars ≈ tokens × 4). The base window is resolved在this order:
模型.提供者.*.模型[].contextWindow
override.
模型 definition
contextWindow
(from the 模型 registry).
Default
200000
tokens.
If
智能体.defaults.contextTokens
is set, it is treated as a cap (min)在the resolved window.
​
Mode
​
cache-ttl
修剪 only runs if the last Anthropic call is older than
ttl
(default
5m
).
When it runs: same soft-trim + hard-clear behavior as before.
​
Soft vs hard 修剪
Soft-trim
: only为oversized 工具 results.
Keeps head + tail, inserts
...
,与appends a note使用the original size.
Skips results使用image blocks.
Hard-clear
: replaces the entire 工具 result with
hardClear.placeholder
.
​
工具 selection
工具.allow
/
工具.deny
support
*
wildcards.
Deny wins.
Matching is case-insensitive.
Empty allow list => all 工具 allowed.
​
Interaction使用other limits
内置工具 already truncate their own output; 会话 修剪 is an extra layer那prevents long-运行 chats从accumulating too much 工具 output在the 模型 上下文.
压缩 is separate: 压缩 summarizes与persists, 修剪 is transient per request. See
/concepts/压缩
.
​
Defaults (when enabled)
ttl
:
"5m"
keepLastAssistants
:
3
softTrimRatio
:
0.3
hardClearRatio
:
0.5
minPrunableToolChars
:
50000
softTrim
:
{ maxChars: 4000, headChars: 1500, tailChars: 1500 }
hardClear
:
{ enabled: true, placeholder: "[Old 工具 result content cleared]" }
​
Examples
Default (off):
Copy
{
智能体
:
{
contextPruning
:
{
mode
:
"off"
}
,
}
,
}
Enable TTL-aware 修剪:
Copy
{
智能体
:
{
contextPruning
:
{
mode
:
"cache-ttl"
,
ttl
:
"5m"
}
,
}
,
}
Restrict pruning到specific 工具:
Copy
{
智能体
:
{
contextPruning
:
{
mode
:
"cache-ttl"
,
工具
:
{
allow
:
[
"执行"
,
"read"
]
,
deny
:
[
"*image*"
] }
,
}
,
}
,
}
See config 参考:
网关 配置
会话
会话 工具
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/会话-修剪)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*