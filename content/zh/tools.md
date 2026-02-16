---
title: "工具系统"
description: "OpenClaw 工具系统 - 了解核心工具、配置选项、使用方法和最佳实践"
date: 2026-02-15
---

# OpenClaw 工具系统

工具是 OpenClaw 代理能力扩展的核心机制，使代理能够与外部系统交互、执行命令、处理文件、控制浏览器等。本文档介绍 OpenClaw 的核心工具集及其使用方法。

## 概述

### 什么是工具？

在 OpenClaw 中，**工具**是代理可以调用的功能模块，每个工具都：

- **提供特定功能**：如浏览器控制、命令执行、消息发送等
- **定义清晰接口**：输入参数、输出格式、错误处理
- **运行在安全环境**：沙箱隔离、权限控制、资源限制
- **支持异步操作**：长时间任务可以异步执行和监控

### 工具系统架构

```
用户请求 → 代理分析 → 工具选择 → 工具执行 → 结果处理 → 用户响应
                    ↓
              工具注册中心
               ├── 浏览器工具
               ├── 执行工具  
               ├── 消息工具
               ├── 文件工具
               ├── 网络工具
               └── 自定义工具
```

## 核心工具分类

### 1. 浏览器工具

浏览器工具允许代理控制网页浏览器，实现自动化网页操作。

#### 主要功能：
- **网页浏览**：导航到指定 URL
- **内容提取**：提取网页文本、图片、链接
- **表单操作**：填写表单、提交数据
- **交互控制**：点击按钮、选择选项、滚动页面
- **截图录制**：捕获屏幕截图、录制操作视频

#### 配置示例：
```json
{
  "tools": {
    "browser": {
      "enabled": true,
      "profile": "openclaw",
      "sandbox": {
        "timeout": 30000,
        "resourceLimits": {
          "memory": "512MB"
        }
      }
    }
  }
}
```

#### 使用场景：
- 网页数据抓取和监控
- 自动化测试和验证
- 网页内容摘要和翻译
- 交互式网页操作

### 2. 执行工具

执行工具允许代理在受控环境中运行 shell 命令和脚本。

#### 主要功能：
- **命令执行**：运行系统命令和脚本
- **输出捕获**：捕获命令输出和错误
- **环境控制**：设置工作目录和环境变量
- **权限管理**：基于角色的命令执行权限
- **超时控制**：防止长时间运行的命令

#### 安全特性：
- **沙箱环境**：隔离的命令执行环境
- **资源限制**：CPU、内存、磁盘使用限制
- **命令白名单**：只允许执行预批准的命令
- **输出过滤**：过滤敏感信息输出
- **审计日志**：记录所有命令执行

#### 配置示例：
```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "sandbox": {
        "enabled": true,
        "resourceLimits": {
          "cpu": "50%",
          "memory": "256MB",
          "timeout": 60000
        }
      },
      "allowList": [
        "ls", "cat", "grep", "find",
        "git status", "git log",
        "npm install", "pnpm install"
      ]
    }
  }
}
```

### 3. 消息工具

消息工具使代理能够发送和接收跨平台消息。

#### 支持平台：
- **即时通讯**：WhatsApp、Telegram、Discord、Signal、iMessage
- **协作工具**：Slack、Microsoft Teams、Mattermost
- **电子邮件**：SMTP、IMAP、Gmail、Outlook
- **社交媒体**：Twitter、Facebook、LinkedIn（通过插件）

#### 主要功能：
- **消息发送**：发送文本、图片、文件、富媒体
- **消息接收**：监听和接收消息
- **会话管理**：管理对话线程和上下文
- **群组支持**：群组消息发送和接收
- **附件处理**：上传和下载文件附件

#### 配置示例：
```json
{
  "tools": {
    "message": {
      "enabled": true,
      "channels": {
        "telegram": {
          "enabled": true,
          "botToken": "${TELEGRAM_BOT_TOKEN}"
        },
        "whatsapp": {
          "enabled": true,
          "sessionPath": "~/.openclaw/whatsapp-session"
        }
      }
    }
  }
}
```

### 4. 文件工具

文件工具提供文件系统操作能力。

#### 主要功能：
- **文件读写**：读取和写入文本、二进制文件
- **文件操作**：创建、删除、移动、复制文件
- **目录管理**：列出目录内容、创建目录
- **内容编辑**：在文件中搜索、替换、编辑内容
- **权限检查**：检查文件权限和属性

#### 安全限制：
- **工作空间限制**：默认限制在工作空间内操作
- **路径验证**：验证文件路径，防止目录遍历攻击
- **大小限制**：限制操作的文件大小
- **类型检查**：检查文件类型和扩展名

#### 配置示例：
```json
{
  "tools": {
    "file": {
      "enabled": true,
      "restrictions": {
        "workspaceOnly": true,
        "maxFileSize": 10485760,  // 10MB
        "allowedExtensions": [".md", ".txt", ".json", ".yml", ".yaml"]
      }
    }
  }
}
```

### 5. 网络工具

网络工具提供 HTTP 请求和 API 调用能力。

#### 主要功能：
- **HTTP 请求**：GET、POST、PUT、DELETE 等请求
- **API 调用**：调用 RESTful API、GraphQL 接口
- **数据处理**：JSON、XML、表单数据处理
- **身份验证**：Bearer Token、API Key、OAuth 支持
- **错误处理**：重试机制、超时处理、错误解析

#### 配置示例：
```json
{
  "tools": {
    "network": {
      "enabled": true,
      "defaults": {
        "timeout": 30000,
        "maxRetries": 3,
        "retryDelay": 1000
      },
      "authentication": {
        "apiKeys": {
          "openai": "${OPENAI_API_KEY}",
          "github": "${GITHUB_TOKEN}"
        }
      }
    }
  }
}
```

## 工具配置和管理

### 全局工具配置

```json
{
  "tools": {
    "profiles": {
      "full": {
        "browser": true,
        "exec": true,
        "message": true,
        "file": true,
        "network": true
      },
      "restricted": {
        "browser": false,
        "exec": false,
        "message": true,
        "file": "read-only",
        "network": true
      },
      "coding": {
        "browser": true,
        "exec": true,
        "message": false,
        "file": true,
        "network": true
      }
    },
    "defaultProfile": "restricted"
  }
}
```

### 每代理工具配置

```json
{
  "agent": {
    "bindings": [
      {
        "id": "admin",
        "tools": {
          "profile": "full"
        }
      },
      {
        "id": "assistant",
        "tools": {
          "profile": "restricted",
          "allow": ["message", "file"]
        }
      }
    ]
  }
}
```

### 运行时工具控制

代理可以通过特殊命令控制工具访问：

```
/工具 enable browser      # 启用浏览器工具
/工具 disable exec        # 禁用执行工具
/工具 status              # 查看工具状态
/工具 list                # 列出可用工具
```

## 工具开发

### 自定义工具结构

自定义工具需要实现以下结构：

```javascript
// custom-tool.js
module.exports = {
  name: "customTool",
  description: "自定义工具描述",
  parameters: {
    param1: {
      type: "string",
      description: "参数1描述",
      required: true
    },
    param2: {
      type: "number",
      description: "参数2描述",
      required: false,
      default: 0
    }
  },
  execute: async (params, context) => {
    // 工具执行逻辑
    const result = await doSomething(params.param1, params.param2);
    
    return {
      success: true,
      data: result,
      message: "操作成功完成"
    };
  }
};
```

### 工具注册

将自定义工具注册到 OpenClaw：

```json
{
  "tools": {
    "custom": {
      "customTool": {
        "path": "./tools/custom-tool.js",
        "enabled": true
      }
    }
  }
}
```

### 工具测试

测试自定义工具：

```bash
# 测试工具功能
openclaw tool test customTool --params '{"param1": "value"}'

# 查看工具文档
openclaw tool docs customTool

# 验证工具配置
openclaw tool validate customTool
```

## 高级功能

### 工具链

多个工具可以组合成工具链，实现复杂工作流：

```json
{
  "tools": {
    "chains": {
      "dataPipeline": {
        "steps": [
          {
            "tool": "network",
            "action": "fetch",
            "params": {
              "url": "https://api.example.com/data"
            }
          },
          {
            "tool": "file",
            "action": "save",
            "params": {
              "path": "data.json",
              "content": "$.step1.result"
            }
          },
          {
            "tool": "exec",
            "action": "process",
            "params": {
              "command": "jq '.items[]' data.json"
            }
          }
        ]
      }
    }
  }
}
```

### 工具监控

监控工具使用情况和性能：

```bash
# 查看工具使用统计
openclaw tools stats

# 监控工具性能
openclaw tools monitor --tool browser

# 查看工具错误日志
openclaw tools errors --since "1h"

# 生成工具使用报告
openclaw tools report --format html
```

### 工具权限系统

基于角色的工具访问控制：

```json
{
  "tools": {
    "permissions": {
      "roles": {
        "admin": {
          "browser": "full",
          "exec": "full",
          "message": "full",
          "file": "full",
          "network": "full"
        },
        "user": {
          "browser": "read-only",
          "exec": false,
          "message": "send-only",
          "file": "workspace-only",
          "network": "restricted"
        },
        "guest": {
          "browser": false,
          "exec": false,
          "message": false,
          "file": "read-only",
          "network": false
        }
      }
    }
  }
}
```

## 最佳实践

### 安全最佳实践

1. **最小权限原则**：仅授予必要的最小工具权限
2. **输入验证**：严格验证所有工具输入参数
3. **输出过滤**：过滤敏感信息，防止数据泄露
4. **沙箱隔离**：始终在沙箱环境中运行工具
5. **审计日志**：记录所有工具调用和操作

### 性能最佳实践

1. **资源限制**：合理设置工具资源限制
2. **缓存策略**：缓存频繁使用的工具结果
3. **异步操作**：长时间操作使用异步模式
4. **批量处理**：合并小操作提高效率
5. **连接复用**：复用网络和数据库连接

### 可靠性最佳实践

1. **错误处理**：实现完善的错误处理和恢复机制
2. **重试策略**：配置适当的重试机制
3. **超时设置**：设置合理的操作超时时间
4. **健康检查**：定期检查工具健康状况
5. **备份策略**：备份重要工具配置和状态

### 维护最佳实践

1. **版本控制**：将工具配置纳入版本控制
2. **文档完整**：为每个工具编写完整文档
3. **测试覆盖**：为工具编写单元测试和集成测试
4. **监控报警**：设置工具监控和报警机制
5. **定期更新**：定期更新工具和安全补丁

## 故障排除

### 常见问题

#### 工具无法调用
- 检查工具是否启用：`openclaw tool status <toolName>`
- 验证工具配置：`openclaw tool validate <toolName>`
- 查看错误日志：`openclaw logs --tool <toolName>`
- 检查权限设置：`openclaw permissions check`

#### 工具执行失败
- 检查输入参数格式
- 验证依赖和环境配置
- 查看资源限制是否足够
- 检查网络连接和API密钥

#### 工具性能问题
- 监控资源使用情况
- 检查是否有内存泄漏
- 优化工具实现代码
- 调整资源配置和限制

### 调试命令

```bash
# 查看所有工具状态
openclaw tools list

# 测试特定工具
openclaw tool test <toolName> [--params JSON]

# 查看工具日志
openclaw logs --tool <toolName> [--tail 100]

# 重置工具状态
openclaw tool reset <toolName>

# 重新加载工具配置
openclaw tools reload
```

### 获取帮助

```bash
# 查看工具帮助
openclaw tools --help

# 查看特定工具文档
openclaw tool docs <toolName>

# 搜索可用工具
openclaw tools search <keyword>

# 查看使用示例
openclaw tools examples
```

---

*本文档提供了 OpenClaw 工具系统的核心概念和使用指南。有关特定工具的详细文档，请参阅各工具的专门文档。工具系统正在积极开发中，功能可能随时间变化，请定期查看更新日志。*