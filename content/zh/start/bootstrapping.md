# Agent 引导启动 - OpenClaw - 中文翻译


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
引导启动
智能体 引导启动
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
智能体 引导启动
What 引导启动 does
Where it runs
Related docs
​
智能体 引导启动
引导启动 is the
first‑run
ritual那prepares an 智能体 工作空间 and
collects identity details. It happens after 入门指南, when the 智能体 starts
for the first time.
​
What 引导启动 does
On the first 智能体 run, OpenClaw bootstraps the 工作空间 (default
~/.OpenClaw/工作空间
):
Seeds
智能体.md
,
引导.md
,
IDENTITY.md
,
USER.md
.
Runs a short Q&A ritual (one question在a time).
Writes identity + preferences to
IDENTITY.md
,
USER.md
,
SOUL.md
.
Removes
引导.md
when finished so it only runs once.
​
Where it runs
引导启动 always runs在the
网关 host
. If the macOS app connects to
a remote 网关, the 工作空间与引导启动 files live在that remote
machine.
When the 网关 runs在another machine, edit 工作空间 files在the 网关
host (for example,
user@网关-host:~/.OpenClaw/工作空间
).
​
Related docs
macOS app 入门指南:
入门指南
工作空间 layout:
Agent工作空间
OAuth
会话管理
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/start/引导启动)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*