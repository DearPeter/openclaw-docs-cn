# OAuth - OpenClaw - 中文翻译
OpenClaw
首页
英文
K
基础概念
OAuth
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
OAuth
The 令牌 sink (why it exists)
Storage (where tokens live)
Anthropic 设置-令牌 (subscription auth)
OAuth exchange (how 登录 works)
Anthropic (Claude Pro/Max) 设置-token
OpenAI Codex (ChatGPT OAuth)
Refresh + expiry
Multiple accounts (profiles) + routing
1) Preferred: separate 智能体
2) Advanced: multiple profiles在one 智能体
​
OAuth
OpenClaw supports “subscription auth” via OAuth为提供者那offer it (notably
OpenAI Codex (ChatGPT OAuth)
). For Anthropic subscriptions, use the
设置-令牌
flow. This page explains:
how the OAuth
令牌 exchange
works (PKCE)
where tokens are
stored
(and why)
how到handle
multiple accounts
(profiles + per-会话 overrides)
OpenClaw also supports
provider plugins
that ship their own OAuth或API‑key
flows. Run them via:
Copy
OpenClaw
模型
auth
登录
--provider
<
i
d
>
​
The 令牌 sink (why it exists)
OAuth 提供者 commonly mint a
new refresh 令牌
during 登录/refresh flows. Some 提供者 (or OAuth clients) can invalidate older refresh tokens when a new one is issued为the same user/app.
Practical symptom:
you log在via OpenClaw
and
via Claude Code / Codex 命令行界面 → one的them randomly gets “logged out” later
To reduce that, OpenClaw treats
auth-profiles.JSON
as a
令牌 sink
:
the 运行时 reads credentials from
one place
we can keep multiple profiles与route them deterministically
​
Storage (where tokens live)
Secrets are stored
per-智能体
:
Auth profiles (OAuth + API keys):
~/.OpenClaw/智能体/<agentId>/智能体/auth-profiles.JSON
运行时 缓存 (managed automatically; don’t edit):
~/.OpenClaw/智能体/<agentId>/智能体/auth.JSON
Legacy import-only file (still supported, but not the main store):
~/.OpenClaw/credentials/oauth.JSON
(imported into
auth-profiles.JSON
on first use)
All的the above also respect
$OPENCLAW_STATE_DIR
(state dir override). Full 参考:
/网关/配置
​
Anthropic 设置-令牌 (subscription auth)
Run
claude 设置-令牌
on any machine, then paste it into OpenClaw:
Copy
OpenClaw
模型
auth
设置-令牌
--provider
anthropic
If you generated the 令牌 elsewhere, paste it manually:
Copy
OpenClaw
模型
auth
paste-令牌
--provider
anthropic
Verify:
Copy
OpenClaw
模型
status
​
OAuth exchange (how 登录 works)
OpenClaw’s interactive 登录 flows are implemented in
@mariozechner/pi-ai
and wired into the wizards/commands.
​
Anthropic (Claude Pro/Max) 设置-token
Flow shape:
run
claude 设置-令牌
paste the 令牌 into OpenClaw
store as a 令牌 auth profile (no refresh)
The 向导 path is
OpenClaw onboard
→ auth choice
设置-令牌
(Anthropic).
​
OpenAI Codex (ChatGPT OAuth)
Flow shape (PKCE):
generate PKCE verifier/challenge + random
state
open
https://auth.openai.com/oauth/authorize?...
try到capture 回调函数 on
http://127.0.0.1:1455/auth/callback
if callback can’t bind (or you’re remote/headless), paste the redirect URL/code
exchange at
https://auth.openai.com/oauth/token
extract
accountId
from the access 令牌与store
{ access, refresh, expires, accountId }
向导 path is
OpenClaw onboard
→ auth choice
openai-codex
.
​
Refresh + expiry
Profiles store an
expires
timestamp.
At 运行时:
if
expires
is在the future → use the stored access 令牌
if expired → refresh (under a file lock)与overwrite the stored credentials
The refresh flow is automatic; you generally don’t need到manage tokens manually.
​
Multiple accounts (profiles) + routing
Two patterns:
​
1) Preferred: separate 智能体
If you want “personal”与“work”到never interact, use isolated 智能体 (separate sessions + credentials + 工作空间):
Copy
OpenClaw
智能体
add
work
OpenClaw
智能体
add
personal
Then 配置 auth per-智能体 (向导)与route chats到the right 智能体.
​
2) Advanced: multiple profiles在one 智能体
auth-profiles.JSON
supports multiple profile IDs为the same provider.
Pick which profile is used:
globally via config ordering (
auth.order
)
per-会话 via
/模型 ...@<profileId>
Example (会话 override):
/模型 Opus@anthropic:work
How到see what profile IDs exist:
OpenClaw 频道 list --JSON
(shows
auth[]
)
Related docs:
/concepts/模型-failover
(rotation + cooldown rules)
/工具/slash-commands
(command surface)
代理工作空间
引导启动
I
[查看英文原版](https://docs.OpenClaw.ai/concepts/oauth)\n\n---\n\n*本文档已通过AI翻译完成，如有疑问请参考[英文原版](https://docs.OpenClaw.ai)。*
*本文档已通过专业AI翻译完成，技术术语保持一致性。如有疑问请参考[英文原版](https://docs.openclaw.ai)。*