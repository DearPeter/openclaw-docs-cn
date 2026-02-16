---
title: "会话管理"
description: "OpenClaw 会话管理 - 了解会话生命周期、安全模式、配置选项和最佳实践"
date: 2026-02-15
---

# 会话管理

会话是 OpenClaw 中的核心概念，它代表了用户与代理之间的交互上下文。每个会话包含了对话历史、工具调用记录、执行状态和用户偏好设置。

## 会话概述

### 什么是会话？

在 OpenClaw 中，**会话**是代理执行任务的基本上下文单元。每当用户与代理交互时，都会在特定的会话上下文中进行。会话确保了：

- **连续性**: 保持对话历史的连贯性
- **状态管理**: 跟踪工具调用和执行状态
- **隔离性**: 不同用户或对话之间的上下文隔离
- **持久化**: 会话状态可以保存和恢复

### 会话类型

OpenClaw 支持多种会话类型：

1. **直接消息会话**: 一对一的用户与代理对话
2. **群组会话**: 群组或频道中的对话
3. **线程会话**: Slack、Discord 线程或 Telegram 主题中的对话
4. **系统会话**: 定时任务、Webhook 等系统生成的会话

## 安全直接消息模式（推荐用于多用户设置）

### 安全警告

如果您的代理可以从**多个用户**接收直接消息，强烈建议启用安全直接消息模式。否则，所有用户共享相同的会话上下文，可能导致用户之间的隐私信息泄露。

#### 问题示例（使用默认设置）：

1. Alice 向您的代理发送关于私人主题的消息（例如医疗预约）
2. Bob 向您的代理发送消息询问："我们刚才在讨论什么？"
3. 由于两个直接消息共享同一个会话，模型可能会使用 Alice 的先前上下文回答 Bob

#### 解决方案：

设置 `dmScope` 参数，为每个用户隔离会话：

```json
// ~/.openclaw/openclaw.json
{
  "会话": {
    // 安全直接消息模式：按频道 + 发送者隔离直接消息上下文
    "dmScope": "per-频道-peer"
  }
}
```

### 何时启用安全模式？

- 您为多个发送者配置了配对批准
- 您使用包含多个条目的直接消息白名单
- 您设置 `dmPolicy: "open"`
- 多个电话号码或账户可以向您的代理发送消息

### 注意事项：

- 默认设置为 `dmScope: "main"` 以确保连续性（所有直接消息共享主会话）。对于单用户设置这是合适的。
- 对于同一频道中的多账户收件箱，建议使用 `per-account-频道-peer`
- 如果同一用户通过多个频道联系您，使用 `会话.identityLinks` 将他们的直接消息会话合并到一个规范身份中

## 网关作为真相源

所有会话状态都**由网关拥有和管理**（OpenClaw 的"主"实例）。UI 客户端（macOS 应用、WebChat 等）必须查询网关以获取会话列表和令牌计数，而不是读取本地文件。

在**远程模式**下，您关心的会话存储位于远程网关主机上，而不是您的 Mac 上。

UI 中显示的令牌计数来自网关的存储字段（`inputTokens`、`outputTokens`、`totalTokens`、`contextTokens`）。客户端不会解析 JSONL 记录来"修正"总数。

## 会话存储位置

### 在网关主机上：

- **存储文件**: `~/.openclaw/agent/<agentId>/sessions/sessions.json`（每个代理）
- **会话记录**: `~/.openclaw/agent/<agentId>/sessions/<sessionId>.jsonl`（Telegram 主题会话使用 `.../<sessionId>-topic-<threadId>.jsonl`）

存储是一个映射 `sessionKey -> { sessionId, updatedAt, ... }`。删除条目是安全的；它们会在需要时重新创建。

群组条目可能包含 `displayName`、`频道`、`subject`、`room` 和 `space` 字段，用于在 UI 中标记会话。

会话条目包括 `origin` 元数据（标签 + 路由提示），因此 UI 可以解释会话的来源。

OpenClaw **不会**读取传统的 Pi/Tau 会话文件夹。

## 会话修剪

OpenClaw 默认在 LLM 调用之前从内存上下文中**修剪旧的工具结果**。

这**不会**重写 JSONL 历史记录。有关详细信息，请参阅[会话修剪概念](/zh/concepts/session-pruning/)。

## 压缩前的记忆刷新

当会话接近自动压缩时，OpenClaw 可以运行**静默记忆刷新**轮次，提醒模型将持久性笔记写入磁盘。这仅在**工作空间可写时**运行。请参阅[记忆管理](/zh/concepts/memory/)和[压缩](/zh/concepts/compaction/)。

## 传输映射 → 会话键

### 直接消息

直接消息遵循 `会话.dmScope` 设置（默认 `main`）：

- `main`: `agent:<agentId>:<mainKey>`（跨设备/频道的连续性）
- `per-peer`: `代理:<agentId>:dm:<peerId>`
- `per-频道-peer`: `代理:<agentId>:<频道>:dm:<peerId>`
- `per-account-频道-peer`: `代理:<agentId>:<频道>:<accountId>:dm:<peerId>`（accountId 默认为 `default`）

如果 `会话.identityLinks` 匹配提供程序前缀的对等 ID（例如 `Telegram:123`），规范键将替换 `<peerId>`，因此同一用户跨频道共享一个会话。

### 群组聊天

群组聊天隔离状态：`agent:<agentId>:<channel>:group:<id>`（房间/频道使用 `agent:<agentId>:<channel>:channel:<id>`）

Telegram 论坛主题附加 `:topic:<threadId>` 到群组 ID 以实现隔离。

传统的 `group:<id>` 键仍被识别以支持迁移。

入站上下文可能仍使用 `group:<id>`；频道从 `Provider` 推断并规范化为规范形式 `代理:<agentId>:<频道>:group:<id>`。

### 其他来源

- **定时任务**: `cron:<job.id>`
- **Webhook**: `hook:<uuid>`（除非通过 hook 明确设置）
- **节点运行**: `node-<nodeId>`

## 会话生命周期

### 重置策略

会话会重复使用直到过期，过期时间在下一条入站消息时评估。

### 每日重置

默认在**网关主机本地时间凌晨 4:00**。一旦会话的最后更新时间早于最近的每日重置时间，会话即被视为过时。

### 空闲重置（可选）

`idleMinutes` 添加滑动空闲窗口。当同时配置每日重置和空闲重置时，**先到期的重置**强制创建新会话。

### 传统仅空闲模式

如果您设置了 `session.idleMinutes` 而没有任何 `session.reset`/`resetByType` 配置，OpenClaw 会保持仅空闲模式以向后兼容。

### 按类型覆盖（可选）

`resetByType` 允许您覆盖 `direct`、`group` 和 `thread` 会话的策略（thread = Slack/Discord 线程、Telegram 主题、连接器提供的 Matrix 线程）。

### 按频道覆盖（可选）

`resetByChannel` 覆盖频道的重置策略（适用于该频道的所有会话类型，优先于 `reset`/`resetByType`）。

### 重置触发器

确切的 `/new` 或 `/reset`（加上 `resetTriggers` 中的任何额外内容）会启动一个新的会话 ID，并将消息的其余部分传递过去。

`/new <model>` 接受模型别名、`provider/model` 或提供程序名称（模糊匹配）来设置新会话的模型。如果单独发送 `/new` 或 `/reset`，OpenClaw 会运行一个简短的"问候"轮次以确认重置。

### 手动重置

从存储中删除特定键或删除 JSONL 记录；下一条消息会重新创建它们。

### 隔离的定时任务

每次运行总是创建一个新的 `sessionId`（无空闲重用）。

## 发送策略（可选）

阻止特定会话类型的消息传递，而无需列出单个 ID。

```json
{
  "会话": {
    "sendPolicy": {
      "rules": [
        {
          "action": "deny",
          "match": {
            "频道": "Discord",
            "chatType": "group"
          }
        },
        {
          "action": "deny", 
          "match": {
            "keyPrefix": "cron:"
          }
        }
      ],
      "default": "allow"
    }
  }
}
```

### 运行时覆盖（仅所有者）

- `/send on` → 允许此会话
- `/send off` → 阻止此会话  
- `/send inherit` → 清除覆盖并使用配置规则

将这些作为独立消息发送以便注册。

## 配置示例

```json
// ~/.openclaw/openclaw.json
{
  "会话": {
    "scope": "per-sender",
    "dmScope": "main",
    "identityLinks": {
      "alice": [
        "Telegram:123456789",
        "Discord:987654321012345678"
      ]
    },
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 120
    },
    "resetByType": {
      "线程": {
        "mode": "daily",
        "atHour": 4
      },
      "direct": {
        "mode": "idle", 
        "idleMinutes": 240
      },
      "group": {
        "mode": "idle",
        "idleMinutes": 120
      }
    },
    "resetByChannel": {
      "Discord": {
        "mode": "idle",
        "idleMinutes": 10080
      }
    },
    "resetTriggers": ["/new", "/reset"],
    "store": "~/.openclaw/agent/{agentId}/sessions/sessions.json",
    "mainKey": "main"
  }
}
```

## 检查和监控

### 命令行工具

- `openclaw status` — 显示存储路径和最近会话
- `openclaw sessions --JSON` — 转储每个条目（使用 `--active <minutes>` 过滤）
- `openclaw gateway call sessions.list --params '{}'` — 从运行中的网关获取会话（使用 `--url`/`--token` 进行远程网关访问）

### 聊天命令

- `/status` — 查看代理是否可访问、使用了多少会话上下文、当前思考/详细切换状态，以及 WhatsApp Web 凭证最后刷新时间
- `/context list` 或 `/context detail` — 查看系统提示和工作空间文件中的内容（以及最大的上下文贡献者）
- `/stop` — 中止当前运行，清除该会话的排队后续操作，并停止由其派生的任何子代理运行
- `/compact` — 总结较旧的上下文并释放窗口空间

### JSONL 记录

可以直接打开 JSONL 记录以查看完整的轮次历史。

## 最佳实践

### 会话管理

1. **保持主键专用于 1:1 流量**：让群组保持自己的键
2. **自动化清理时**：删除单个键而不是整个存储，以保留其他地方的上下文
3. **监控会话增长**：定期检查会话大小和令牌使用情况
4. **合理配置重置策略**：根据使用模式调整每日/空闲重置

### 安全建议

1. **多用户环境启用安全模式**：防止隐私泄露
2. **定期审计配置**：使用 `openclaw security audit` 验证安全设置
3. **限制敏感操作**：通过发送策略控制特定会话类型的权限

## 会话起源元数据

每个会话条目在 `origin` 字段中记录其来源（尽力而为）：

- `label`: 人类可读标签（从对话标签 + 群组主题/频道解析）
- `provider`: 规范化的频道 ID（包括扩展）
- `from`/`to`: 入站信封中的原始路由 ID
- `accountId`: 提供程序账户 ID（多账户时）
- `threadId`: 频道支持时的线程/主题 ID

来源字段为直接消息、频道和群组填充。如果连接器仅更新传递路由（例如，保持直接消息主会话新鲜），它仍应提供入站上下文，以便会话保持其解释性元数据。

---

*本文档已根据 OpenClaw 技术术语表进行专业重译，确保术语一致性。有关最新信息，请参考[英文原版文档](https://docs.openclaw.ai/concepts/session)。*