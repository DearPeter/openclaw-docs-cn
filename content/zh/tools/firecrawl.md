# Firecrawl - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
Firecrawl
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
Firecrawl
Get an API密钥
配置 Firecrawl
Stealth / bot circumvention
How web_fetch uses Firecrawl
​
Firecrawl
OpenClaw can use
Firecrawl
as a fallback extractor for
web_fetch
. It is a hosted
content extraction service那supports bot circumvention与caching, which helps
with JS-heavy sites或pages那block plain HTTP fetches.
​
Get an API密钥
Create a Firecrawl account与generate an API密钥.
Store it在config或set
FIRECRAWL_API_KEY
in the 网关 environment.
​
配置 Firecrawl
Copy
{
工具
:
{
网页
:
{
获取
:
{
firecrawl
:
{
apiKey
:
"FIRECRAWL_API_KEY_HERE"
,
baseUrl
:
"https://api.firecrawl.dev"
,
onlyMainContent
:
true
,
maxAgeMs
:
172800000
,
timeoutSeconds
:
60
,
}
,
}
,
}
,
}
,
}
Notes:
firecrawl.enabled
defaults到true when an API密钥 is present.
maxAgeMs
controls how old cached results can be (ms). Default is 2 days.
​
Stealth / bot circumvention
Firecrawl exposes a
代理服务器 mode
parameter为bot circumvention (
basic
,
stealth
, or
auto
).
OpenClaw always uses
代理服务器: "auto"
plus
storeInCache: true
for Firecrawl requests.
If 代理服务器 is omitted, Firecrawl defaults to
auto
.
auto
retries使用stealth proxies if a basic attempt fails, which may use more credits
than basic-only scraping.
​
How
web_fetch
uses Firecrawl
web_fetch
extraction order:
Readability (local)
Firecrawl (if configured)
Basic HTML cleanup (last fallback)
See
网页 工具
for the full 网页 工具 设置.
I
[查看英文原版](https://docs.OpenClaw.ai/工具/firecrawl)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*