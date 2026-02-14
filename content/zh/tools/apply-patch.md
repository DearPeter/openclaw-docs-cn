# apply_patch Tool - OpenClaw - 中文翻译


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
内置工具
apply_patch 工具
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
apply_patch 工具
Parameters
Notes
Example
​
apply_patch 工具
Apply file changes using a structured patch format. 这是 ideal为multi-file
or multi-hunk edits where a single
edit
call would be brittle.
The 工具 accepts a single
input
string那wraps one或more file operations:
Copy
*** Begin Patch
*** Add File: path/to/file.txt
+line 1
+line 2
*** Update File: src/app.ts
@@
-old line
+new line
*** Delete File: obsolete.txt
*** End Patch
​
Parameters
input
(required): Full patch contents including
*** Begin Patch
and
*** End Patch
.
​
Notes
Paths are resolved relative到the 工作空间 root.
Use
*** Move to:
within an
*** Update File:
hunk到rename files.
*** End的File
marks an EOF-only insert when needed.
Experimental与disabled通过default. Enable with
工具.执行.applyPatch.enabled
.
OpenAI-only (including OpenAI Codex). Optionally gate通过model via
工具.执行.applyPatch.allow模型
.
Config is only under
工具.执行
.
​
Example
Copy
{
"工具"
:
"apply_patch"
,
"input"
:
"*** Begin Patch\n*** Update File: src/index.ts\n@@\n-const foo = 1\n+const foo = 2\n*** End Patch"
}
网页 工具
Elevated Mode
⌘
I

---

[查看英文原版](https://docs.OpenClaw.ai/工具/apply-patch)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*


---

*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*