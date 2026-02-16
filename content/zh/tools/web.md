# 网页 工具 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
内置工具
网页 工具
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
网页 工具
How it works
Choosing a 搜索 provider
Getting a Brave API密钥
Where到set the key (recommended)
Using Perplexity (direct或via OpenRouter)
Getting an OpenRouter API密钥
Setting up Perplexity 搜索
Available Perplexity 模型
web_search
Requirements
Config
工具 parameters
web_fetch
web_fetch requirements
web_fetch config
web_fetch 工具 parameters
​
网页 工具
OpenClaw ships two lightweight 网页 工具:
web_search
web_fetch
— HTTP 获取 + readable extraction (HTML → Markdown/text).
These are
not
浏览器 automation. For JS-heavy sites或logins, use the
浏览器 工具
.
​
How it works
web_search
calls your configured provider与returns results.
Brave
(default): returns structured results (title, URL, snippet).
Perplexity
: returns AI-synthesized answers使用citations从real-time 网页 搜索.
Results are cached通过query为15 minutes (configurable).
web_fetch
does a plain HTTP GET与extracts readable content
(HTML → Markdown/text). It does
not
execute JavaScript.
web_fetch
is enabled通过default (unless explicitly disabled).
​
Choosing a 搜索 provider
Provider
Pros
Cons
API密钥
Brave
(default)
Fast, structured results, free tier
Traditional 搜索 results
BRAVE_API_KEY
Perplexity
AI-synthesized answers, citations, real-time
Requires Perplexity或OpenRouter access
OPENROUTER_API_KEY
or
PERPLEXITY_API_KEY
See
and
Perplexity Sonar
for provider-specific details.
Set the provider在config:
Copy
{
工具
:
{
网页
:
{
搜索
:
{
provider
:
"brave"
,
//或"perplexity"
}
,
}
,
}
,
}
示例： switch到Perplexity Sonar (direct API):
Copy
{
工具
:
{
网页
:
{
搜索
:
{
provider
:
"perplexity"
,
perplexity
:
{
apiKey
:
"pplx-..."
,
baseUrl
:
"https://api.perplexity.ai"
,
模型
:
"perplexity/sonar-pro"
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
​
Getting a Brave API密钥
https://brave.com/搜索/api/
In the 仪表板, choose the
Data为搜索
plan (not “Data为AI”)与generate an API密钥.
Run
OpenClaw 配置 --section 网页
to store the key在config (recommended),或set
BRAVE_API_KEY
in your environment.
Brave provides a free tier plus paid plans; check the Brave API portal为the
current limits与pricing.
​
Where到set the key (recommended)
Recommended:
run
OpenClaw 配置 --section 网页
. It stores the key in
~/.OpenClaw/OpenClaw.JSON
under
工具.网页.搜索.apiKey
.
Environment alternative:
set
BRAVE_API_KEY
in the 网关 进程
environment. For a 网关 安装, put it in
~/.OpenClaw/.env
(or your
service environment). See
Env vars
.
​
Using Perplexity (direct或via OpenRouter)
Perplexity Sonar 模型 have built-in 网页 搜索 capabilities与return AI-synthesized
answers使用citations. You can use them via OpenRouter (no credit card required - supports
crypto/prepaid).
​
Getting an OpenRouter API密钥
Create an account at
https://openrouter.ai/
Add credits (supports crypto, prepaid,或credit card)
Generate an API密钥在your account settings
​
Setting up Perplexity 搜索
Copy
{
工具
:
{
网页
:
{
搜索
:
{
enabled
:
true
,
provider
:
"perplexity"
,
perplexity
:
{
// API key (optional if OPENROUTER_API_KEY或PERPLEXITY_API_KEY is set)
apiKey
:
"sk-or-v1-..."
,
// Base URL (key-aware default if omitted)
baseUrl
:
"https://openrouter.ai/api/v1"
,
// 模型 (defaults到perplexity/sonar-pro)
模型
:
"perplexity/sonar-pro"
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
Environment alternative:
set
OPENROUTER_API_KEY
or
PERPLEXITY_API_KEY
in the 网关
environment. For a 网关 安装, put it in
~/.OpenClaw/.env
.
If no base URL is set, OpenClaw chooses a default based在the API密钥 source:
PERPLEXITY_API_KEY
or
pplx-...
→
https://api.perplexity.ai
OPENROUTER_API_KEY
or
sk-or-...
→
https://openrouter.ai/api/v1
Unknown key formats → OpenRouter (safe fallback)
​
Available Perplexity 模型
模型
Description
Best for
perplexity/sonar
Fast Q&A使用网页 搜索
Quick lookups
perplexity/sonar-pro
(default)
Multi-step reasoning使用网页 搜索
Complex questions
perplexity/sonar-reasoning-pro
Chain-of-thought analysis
Deep research
​
web_search
​
Requirements
工具.网页.搜索.enabled
must not be
false
(default: enabled)
API密钥为your chosen provider:
Brave
:
BRAVE_API_KEY
or
工具.网页.搜索.apiKey
Perplexity
:
OPENROUTER_API_KEY
,
PERPLEXITY_API_KEY
, or
工具.网页.搜索.perplexity.apiKey
​
Config
Copy
{
工具
:
{
网页
:
{
搜索
:
{
enabled
:
true
,
apiKey
:
"BRAVE_API_KEY_HERE"
,
// optional if BRAVE_API_KEY is set
maxResults
:
5
,
timeoutSeconds
:
30
,
cacheTtlMinutes
:
15
,
}
,
}
,
}
,
}
​
工具 parameters
query
(required)
count
(1–10; default从config)
country
(optional): 2-letter country code为region-specific results (e.g., “DE”, “US”, “ALL”). If omitted, Brave chooses its default region.
search_lang
(optional): ISO language code为搜索 results (e.g., “de”, “en”, “fr”)
ui_lang
(optional): ISO language code为UI elements
freshness
(optional): filter通过discovery time
Brave:
pd
,
pw
,
pm
,
py
, or
YYYY-MM-DDtoYYYY-MM-DD
Perplexity:
pd
,
pw
,
pm
,
py
Examples:
Copy
// German-specific 搜索
await
web_search
({
query
:
"TV online schauen"
,
count
:
10
,
country
:
"DE"
,
search_lang
:
"de"
,
});
// French 搜索使用French UI
await
web_search
({
query
:
"actualités"
,
country
:
"FR"
,
search_lang
:
"fr"
,
ui_lang
:
"fr"
,
});
// Recent results (past week)
await
web_search
({
query
:
"TMBG interview"
,
freshness
:
"pw"
,
});
​
web_fetch
获取 a URL与extract readable content.
​
web_fetch requirements
工具.网页.获取.enabled
must not be
false
(default: enabled)
Optional Firecrawl fallback: set
工具.网页.获取.firecrawl.apiKey
or
FIRECRAWL_API_KEY
.
​
web_fetch config
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
enabled
:
true
,
maxChars
:
50000
,
maxCharsCap
:
50000
,
timeoutSeconds
:
30
,
cacheTtlMinutes
:
15
,
maxRedirects
:
3
,
userAgent
:
"Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
,
readability
:
true
,
firecrawl
:
{
enabled
:
true
,
apiKey
:
"FIRECRAWL_API_KEY_HERE"
,
// optional if FIRECRAWL_API_KEY is set
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
86400000
,
// ms (1 day)
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
​
web_fetch 工具 parameters
url
(required, http/https only)
extractMode
(
Markdown
|
text
)
maxChars
(truncate long pages)
Notes:
web_fetch
uses Readability (main-content extraction) first, then Firecrawl (if configured). If both fail, the 工具 returns an error.
Firecrawl requests use bot-circumvention mode与缓存 results通过default.
web_fetch
sends a Chrome-like User-智能体 and
Accept-Language
by default; override
userAgent
if needed.
web_fetch
blocks private/internal hostnames与re-checks redirects (limit with
maxRedirects
).
maxChars
is clamped to
工具.网页.获取.maxCharsCap
.
web_fetch
is best-effort extraction; some sites will need the 浏览器 工具.
See
Firecrawl
for key 设置与service details.
Responses are cached (default 15 minutes)到reduce repeated fetches.
If you use 工具 profiles/allowlists, add
web_search
/
web_fetch
or
group:网页
.
If the Brave key is missing,
web_search
returns a short 设置 hint使用a docs link.
执行 工具
apply_patch 工具
I
[查看英文原版](https://docs.OpenClaw.ai/工具/网页)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*