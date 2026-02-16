# LLM任务 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
LLM任务
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
Auth 监控
Media与devices
节点
节点 Troubleshooting
Image与Media Support
Audio与Voice Notes
Camera Capture
Talk Mode
Voice Wake
Location Command
本页内容
LLM任务
Enable the plugin
Config (optional)
工具 parameters
Output
示例： Lobster workflow step
Safety notes
​
LLM任务
llm-task
is an
optional plugin 工具
that runs a JSON-only LLM任务 and
returns structured output (optionally validated against JSON Schema).
这是 ideal为workflow engines like Lobster: you can add a single LLM step
without writing custom OpenClaw code为each workflow.
​
Enable the plugin
Enable the plugin:
Copy
{
"plugins"
:
{
"entries"
:
{
"llm-task"
:
{
"enabled"
:
true
}
}
}
}
Allowlist the 工具 (it is registered with
optional: true
):
Copy
{
"智能体"
:
{
"list"
:
[
{
"id"
:
"main"
,
"工具"
:
{
"allow"
:
[
"llm-task"
] }
}
]
}
}
​
Config (optional)
Copy
{
"plugins"
:
{
"entries"
:
{
"llm-task"
:
{
"enabled"
:
true
,
"config"
:
{
"defaultProvider"
:
"openai-codex"
,
"defaultModel"
:
"gpt-5.2"
,
"defaultAuthProfileId"
:
"main"
,
"allowed模型"
:
[
"openai-codex/gpt-5.3-codex"
]
,
"maxTokens"
:
800
,
"timeoutMs"
:
30000
}
}
}
}
}
allowed模型
is an allowlist of
provider/模型
strings. If set, any request
outside the list is rejected.
​
工具 parameters
提示词
(string, required)
input
(any, optional)
schema
(object, optional JSON Schema)
provider
(string, optional)
模型
(string, optional)
authProfileId
(string, optional)
temperature
(number, optional)
maxTokens
(number, optional)
timeoutMs
(number, optional)
​
Output
Returns
details.JSON
containing the parsed JSON (and validates against
schema
when provided).
​
示例： Lobster workflow step
Copy
OpenClaw.invoke --工具 llm-task --action JSON --args-JSON '{
"提示词": "Given the input email, return intent与draft.",
"input": {
"subject": "Hello",
"body": "Can you 帮助?"
},
"schema": {
"type": "object",
"properties": {
"intent": { "type": "string" },
"draft": { "type": "string" }
},
"required": ["intent", "draft"],
"additionalProperties": false
}
}'
​
Safety notes
The 工具 is
JSON-only
and instructs the model到output only JSON (no
code fences, no commentary).
No 工具 are exposed到the model为this run.
Treat output as untrusted unless you validate with
schema
.
Put approvals before any side-effecting step (send, post, 执行).
Lobster
执行 工具
I
[查看英文原版](https://docs.OpenClaw.ai/工具/llm-task)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*