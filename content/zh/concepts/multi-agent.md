---
title: "多代理系统与路由"
description: "OpenClaw 多代理系统 - 了解多代理配置、路由规则、隔离机制和协作工作流"
date: 2026-02-15
---

# 多代理系统与路由

OpenClaw 的多代理系统允许您在同一网关中运行多个独立的代理，每个代理拥有自己的工作空间、配置和会话状态。这种设计使得不同代理可以专注于特定任务，同时保持完全隔离。

## 概述

### 什么是多代理系统？

多代理系统是指在同一 OpenClaw 网关实例中运行**多个独立代理**的能力。每个代理都是一个完全独立的大脑，拥有：

- 独立的工作空间和文件系统
- 专用的状态目录和配置
- 隔离的会话存储和聊天历史
- 单独的身份验证配置文件

### 核心目标

1. **隔离性**：不同代理之间的完全状态隔离
2. **专业化**：每个代理专注于特定领域或任务
3. **并发性**：多个代理可以同时处理不同请求
4. **灵活性**：灵活的路由规则将消息导向最合适的代理

## 核心概念

### 什么是"一个代理"？

在 OpenClaw 中，一个**代理**是一个完全独立的作用域大脑，拥有：

1. **工作空间**：包含文件、`agent.md`/`SOUL.md`/`USER.md`、本地笔记和角色规则
2. **状态目录**：用于身份验证配置文件、模型注册表和每代理配置的 `agentDir`
3. **会话存储**：聊天历史记录和路由状态，位于 `~/.openclaw/agent/<agentId>/sessions`

### 身份验证配置文件

身份验证配置文件是**每代理**的。每个代理从自己的位置读取：

```
~/.openclaw/agent/<agentId>/agent/auth-profiles.json
```

**重要**：主代理凭证不会自动共享。切勿跨代理重用 `agentDir`（这会导致身份验证/会话冲突）。如果要共享凭证，请将 `auth-profiles.json` 复制到其他代理的 `agentDir` 中。

### 技能

技能通过每个工作空间的 `skills/` 文件夹实现每代理，共享技能可从 `~/.openclaw/skills` 获取。

## 路由机制

### 默认路由行为

默认情况下，OpenClaw 运行在**单代理模式**下。所有传入消息都路由到默认代理（通常名为 `main`）。

### 启用多代理路由

要启用多代理路由，需要在配置中定义多个代理和路由规则：

```json
{
  "代理": {
    "bindings": [
      {
        "id": "main",
        "label": "General Assistant",
        "workspace": "~/.openclaw/workspace/main"
      },
      {
        "id": "coding",
        "label": "Coding Specialist",
        "workspace": "~/.openclaw/workspace/coding"
      },
      {
        "id": "research",
        "label": "Research Assistant", 
        "workspace": "~/.openclaw/workspace/research"
      }
    ],
    "routing": {
      "rules": [
        {
          "match": {
            "频道": "Telegram",
            "text": "/code"
          },
          "target": "coding"
        },
        {
          "match": {
            "频道": "Discord",
            "chatType": "group"
          },
          "target": "main"
        }
      ],
      "default": "main"
    }
  }
}
```

### 路由规则类型

#### 1. 基于频道的路由
```json
{
  "match": {
    "频道": "WhatsApp"
  },
  "target": "personal"
}
```

#### 2. 基于内容的路由
```json
{
  "match": {
    "text": "/research"
  },
  "target": "research"
}
```

#### 3. 基于发送者的路由
```json
{
  "match": {
    "sender": "alice@company.com"
  },
  "target": "work"
}
```

#### 4. 组合条件路由
```json
{
  "match": {
    "频道": "Telegram",
    "chatType": "direct",
    "text": "/code"
  },
  "target": "coding"
}
```

## 配置示例

### 示例 1：两个 WhatsApp 账户 → 两个代理

```json
{
  "代理": {
    "bindings": [
      {
        "id": "personal",
        "label": "Personal Assistant",
        "workspace": "~/.openclaw/workspace/personal"
      },
      {
        "id": "work", 
        "label": "Work Assistant",
        "workspace": "~/.openclaw/workspace/work"
      }
    ],
    "routing": {
      "rules": [
        {
          "match": {
            "频道": "WhatsApp",
            "account": "personal"
          },
          "target": "personal"
        },
        {
          "match": {
            "频道": "WhatsApp", 
            "account": "work"
          },
          "target": "work"
        }
      ]
    }
  }
}
```

### 示例 2：WhatsApp 日常聊天 + Telegram 深度工作

```json
{
  "代理": {
    "bindings": [
      {
        "id": "casual",
        "label": "Casual Chat",
        "workspace": "~/.openclaw/workspace/casual"
      },
      {
        "id": "deepwork",
        "label": "Deep Work",
        "workspace": "~/.openclaw/workspace/deepwork"
      }
    ],
    "routing": {
      "rules": [
        {
          "match": {
            "频道": "WhatsApp"
          },
          "target": "casual"
        },
        {
          "match": {
            "频道": "Telegram"
          },
          "target": "deepwork"
        }
      ]
    }
  }
}
```

### 示例 3：同一频道，不同发送者到不同代理

```json
{
  "代理": {
    "bindings": [
      {
        "id": "family",
        "label": "Family Assistant",
        "workspace": "~/.openclaw/workspace/family"
      },
      {
        "id": "friends",
        "label": "Friends Assistant",
        "workspace": "~/.openclaw/workspace/friends"
      }
    ],
    "routing": {
      "rules": [
        {
          "match": {
            "频道": "WhatsApp",
            "sender": "+1234567890"
          },
          "target": "family"
        },
        {
          "match": {
            "频道": "WhatsApp",
            "sender": "+0987654321"
          },
          "target": "friends"
        }
      ],
      "default": "family"
    }
  }
}
```

## 每代理沙箱和工具配置

### 沙箱隔离

每个代理在独立的沙箱环境中运行：

```json
{
  "代理": {
    "bindings": [
      {
        "id": "secure",
        "label": "Secure 代理",
        "workspace": "~/.openclaw/workspace/secure",
        "sandbox": {
          "enabled": true,
          "resourceLimits": {
            "cpu": "50%",
            "记忆": "512MB",
            "network": "restricted"
          },
          "toolPermissions": {
            "执行": false,
            "浏览器": false,
            "write": "workspace-only"
          }
        }
      }
    ]
  }
}
```

### 工具配置

不同代理可以有不同的工具访问权限：

```json
{
  "代理": {
    "bindings": [
      {
        "id": "admin",
        "label": "Admin 代理",
        "workspace": "~/.openclaw/workspace/admin",
        "tools": {
          "profile": "full",
          "allow": ["执行", "浏览器", "write", "read"]
        }
      },
      {
        "id": "restricted",
        "label": "Restricted 代理",
        "workspace": "~/.openclaw/workspace/restricted",
        "tools": {
          "profile": "messaging",
          "allow": ["消息", "read"]
        }
      }
    ]
  }
}
```

## 多代理协作

### 代理间通信

代理可以通过消息传递进行协作：

```json
{
  "代理": {
    "bindings": [
      {
        "id": "coordinator",
        "label": "Coordinator",
        "workspace": "~/.openclaw/workspace/coordinator"
      },
      {
        "id": "specialist1",
        "label": "Specialist 1",
        "workspace": "~/.openclaw/workspace/specialist1"
      },
      {
        "id": "specialist2",
        "label": "Specialist 2",
        "workspace": "~/.openclaw/workspace/specialist2"
      }
    ],
    "collaboration": {
      "enabled": true,
      "channels": {
        "internal": "agent://collaboration"
      }
    }
  }
}
```

### 工作流示例

1. **接收用户请求**：协调代理接收用户消息
2. **任务分解**：分析请求并分解为子任务
3. **代理分配**：将子任务分配给专业代理
4. **结果收集**：收集各代理的结果
5. **综合响应**：整合结果并返回给用户

## 最佳实践

### 代理设计原则

1. **单一职责**：每个代理应专注于特定领域
2. **明确边界**：明确定义代理的职责和能力边界
3. **适度隔离**：在隔离和协作之间找到平衡
4. **可扩展设计**：设计易于添加新代理的系统

### 路由策略

1. **渐进式路由**：从简单规则开始，逐步增加复杂性
2. **回退机制**：始终配置默认路由目标
3. **监控路由决策**：记录路由决策以便调试
4. **定期评估**：定期审查路由规则的效果

### 性能考虑

1. **资源分配**：合理分配 CPU、内存和存储资源
2. **冷启动优化**：考虑代理的启动时间
3. **会话管理**：有效管理多个代理的会话状态
4. **故障恢复**：设计代理故障时的恢复机制

## 故障排除

### 常见问题

#### 1. 路由失败
- **症状**：消息未路由到预期代理
- **检查项**：
  - 验证路由规则语法
  - 检查代理绑定配置
  - 查看网关日志中的路由决策

#### 2. 代理启动失败
- **症状**：代理无法启动或立即崩溃
- **检查项**：
  - 验证工作空间路径
  - 检查权限设置
  - 查看代理特定配置

#### 3. 工具访问问题
- **症状**：代理无法访问预期工具
- **检查项**：
  - 检查工具配置文件
  - 验证沙箱权限
  - 查看工具注册状态

#### 4. 会话混乱
- **症状**：不同代理的会话状态混淆
- **检查项**：
  - 验证 `agentDir` 隔离
  - 检查会话存储路径
  - 确保没有共享状态目录

### 调试命令

```bash
# 查看所有代理状态
openclaw 代理 list

# 检查特定代理状态
openclaw 代理 status <agentId>

# 测试路由规则
openclaw 代理 route-test --频道 WhatsApp --text "test 消息"

# 查看路由日志
openclaw logs --filter routing

# 手动路由消息
openclaw agent route --代理 <agentId> --消息 "manual routing test"
```

### 监控指标

1. **路由成功率**：消息正确路由的比例
2. **代理响应时间**：每个代理的平均响应时间
3. **资源使用率**：CPU、内存和存储使用情况
4. **错误率**：路由和代理执行错误率
5. **会话统计**：活跃会话数和平均会话长度

## 高级配置

### 动态路由

支持基于运行时条件的动态路由：

```json
{
  "代理": {
    "routing": {
      "dynamic": {
        "enabled": true,
        "factors": [
          {
            "name": "workload",
            "type": "代理-load",
            "threshold": 0.8,
            "action": "reroute"
          },
          {
            "name": "time-of-day",
            "type": "schedule",
            "schedule": {
              "work-hours": "09:00-17:00",
              "target": "work",
              "other": "personal"
            }
          }
        ]
      }
    }
  }
}
```

### 代理健康检查

自动监控代理健康状况：

```json
{
  "代理": {
    "health": {
      "enabled": true,
      "checkInterval": "30s",
      "timeout": "10s",
      "failureThreshold": 3,
      "successThreshold": 2,
      "actions": {
        "unhealthy": "reroute",
        "recovered": "恢复"
      }
    }
  }
}
```

## 未来扩展

OpenClaw 多代理系统正在积极开发中，未来计划的功能包括：

1. **自动代理发现**：动态发现和注册新代理
2. **负载均衡**：智能分配工作负载
3. **故障转移**：自动切换到备用代理
4. **版本管理**：代理版本控制和滚动更新
5. **性能分析**：详细的代理性能分析工具

---

*本文档已根据 OpenClaw 技术术语表进行专业重译，确保术语一致性。有关最新信息，请参考[英文原版文档](https://docs.openclaw.ai/concepts/multi-agent)。*