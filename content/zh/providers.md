# Model 提供者 - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
概述
模型 提供者
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
模型 提供者
模型 Provider 快速开始
模型 concepts
模型 命令行界面
配置
模型 提供者
模型 Failover
提供者
Anthropic
OpenAI
OpenRouter
Litellm
Amazon Bedrock
Vercel AI 网关
Moonshot AI
MiniMax
OpenCode Zen
GLM 模型
Z.AI
Synthetic
Qianfan
本页内容
模型 提供者
Highlight: Venice (Venice AI)
Quick start
Provider docs
Transcription 提供者
Community 工具
​
模型 提供者
OpenClaw can use many LLM 提供者. Pick a provider, authenticate, then set the
default 模型 as
provider/模型
.
Looking为chat 频道 docs (WhatsApp/Telegram/Discord/Slack/Mattermost (plugin)/etc.)? See
频道
.
​
Highlight: Venice (Venice AI)
Venice is our recommended Venice AI 设置为privacy-first inference使用an option到use Opus为hard 任务.
Default:
venice/llama-3.3-70b
Best overall:
venice/claude-opus-45
(Opus remains the strongest)
See
Venice AI
.
​
Quick start
Authenticate使用the provider (usually via
OpenClaw onboard
).
Set the default 模型:
Copy
{
智能体
:
{
defaults
:
{
模型
:
{
primary
:
"anthropic/claude-opus-4-6"
} } }
,
}
​
Provider docs
OpenAI (API + Codex)
Anthropic (API + Claude Code 命令行界面)
Qwen (OAuth)
OpenRouter
LiteLLM (unified 网关)
Vercel AI 网关
Together AI
Cloudflare AI 网关
Moonshot AI (Kimi + Kimi Coding)
OpenCode Zen
Amazon Bedrock
Z.AI
Xiaomi
GLM 模型
MiniMax
Venice (Venice AI, privacy-focused)
Hugging Face (Inference)
Ollama (local 模型)
vLLM (local 模型)
Qianfan
NVIDIA
​
Transcription 提供者
Deepgram (audio transcription)
​
Community 工具
Claude Max API Proxy
- Use Claude Max/Pro subscription as an OpenAI-compatible API endpoint
For the full provider catalog (xAI, Groq, Mistral, etc.)与advanced 配置,
see
模型 提供者
.
模型 Provider 快速开始
I
[查看英文原版](https://docs.OpenClaw.ai/提供者)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*