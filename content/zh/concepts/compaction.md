# Compaction - OpenClaw - 中文翻译


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
压缩
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
上下文 Window & 压缩
What 压缩 is
配置
Auto-压缩 (default on)
Manual 压缩
上下文 window source
压缩 vs 修剪
Tips
​
上下文 Window & 压缩
Every 模型 has a
上下文 window
(max tokens it can see). Long-运行 chats accumulate messages与tool results; once the window is tight, OpenClaw
compacts
older history到stay within limits.
​
What 压缩 is
压缩
summarizes older conversation
into a compact summary entry与keeps recent messages intact. The summary is stored在the 会话 history, so future requests use:
The 压缩 summary
Recent messages after the 压缩 point
压缩
persists
in the 会话’s JSONL history.
​
配置
Use the
智能体.defaults.压缩
setting在your
OpenClaw.JSON
to 配置 压缩 behavior (mode, target tokens, etc.).
​
Auto-压缩 (default on)
When a 会话 nears或exceeds the 模型’s 上下文 window, OpenClaw triggers auto-compaction与may 重试 the original request using the compacted 上下文.
You’ll see:
🧹 Auto-压缩 complete
in verbose mode
/status
showing
🧹 压缩s: <count>
Before 压缩, OpenClaw can run a
silent 记忆 flush
turn到store
durable notes到disk. See
记忆
for details与config.
​
Manual 压缩
Use
/compact
(optionally使用instructions)到force a 压缩 pass:
Copy
/compact Focus在decisions与open questions
​
上下文 window source
上下文 window is 模型-specific. OpenClaw uses the 模型 definition从the configured provider catalog到determine limits.
​
压缩 vs 修剪
压缩
: summarises and
persists
in JSONL.
会话 修剪
: trims old
工具 results
only,
in-记忆
, per request.
See
/concepts/会话-修剪
for 修剪 details.
​
Tips
Use
/compact
when sessions feel stale或上下文 is bloated.
Large 工具 outputs are already truncated; 修剪 can further reduce 工具-result buildup.
If you need a fresh slate,
/new
or
/reset
starts a new 会话 id.
记忆
多Agent路由
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/concepts/压缩)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*