# Retry Policy - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
消息与传递
重试策略
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
重试 policy
Goals
Defaults
Behavior
Discord
Telegram
配置
Notes
​
重试 policy
​
Goals
重试 per HTTP request, not per multi-step flow.
Preserve ordering通过retrying only the current step.
Avoid duplicating non-idempotent operations.
​
Defaults
Attempts: 3
Max delay cap: 30000 ms
Jitter: 0.1 (10 percent)
Provider defaults:
Telegram min delay: 400 ms
Discord min delay: 500 ms
​
Behavior
​
Discord
Retries only在rate-limit errors (HTTP 429).
Uses Discord
retry_after
when available, otherwise exponential backoff.
​
Telegram
Retries在transient errors (429, timeout, connect/reset/closed, temporarily unavailable).
Uses
retry_after
when available, otherwise exponential backoff.
Markdown parse errors are not retried; they fall back到plain text.
​
配置
Set 重试 policy per provider in
~/.OpenClaw/OpenClaw.JSON
:
Copy
{
频道
:
{
Telegram
:
{
重试
:
{
attempts
:
3
,
minDelayMs
:
400
,
maxDelayMs
:
30000
,
jitter
:
0.1
,
}
,
}
,
Discord
:
{
重试
:
{
attempts
:
3
,
minDelayMs
:
500
,
maxDelayMs
:
30000
,
jitter
:
0.1
,
}
,
}
,
}
,
}
​
Notes
Retries apply per request (消息 send, media upload, reaction, poll, sticker).
Composite flows do not 重试 completed steps.
流式传输与分块
命令队列
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/重试)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*