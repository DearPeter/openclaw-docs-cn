---
title: "快速开始指南"
description: "OpenClaw 快速开始指南 - 在10分钟内安装、配置并开始使用 OpenClaw"
date: 2026-02-15
---

# OpenClaw 快速开始指南

本指南将帮助您在10分钟内完成 OpenClaw 的安装、配置并开始使用。无论您是开发人员、技术爱好者还是企业用户，都可以按照本指南快速上手。

## 系统要求

在开始之前，请确保您的系统满足以下要求：

- **操作系统**：macOS 10.15+、Linux（Ubuntu 20.04+、Debian 11+）、Windows 10+（推荐使用 WSL2）
- **Node.js**：版本 22.x 或更高（安装脚本会自动安装）
- **内存**：至少 4GB RAM（推荐 8GB+）
- **磁盘空间**：至少 2GB 可用空间
- **网络连接**：稳定的互联网连接

## 步骤 1：安装 OpenClaw

### 推荐方法：使用安装脚本

打开终端并运行以下命令：

**macOS / Linux / WSL2：**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows PowerShell：**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### 安装过程说明

安装脚本将自动执行以下操作：

1. **检测系统环境**：检查操作系统和架构
2. **安装 Node.js**：如果未安装则自动安装 Node.js 22+
3. **下载 OpenClaw CLI**：下载最新版 OpenClaw 命令行工具
4. **全局安装**：通过 npm 全局安装 OpenClaw
5. **启动设置向导**：运行交互式初始设置向导

### 验证安装

安装完成后，验证 OpenClaw 是否正确安装：

```bash
openclaw --version
openclaw doctor
```

如果看到 OpenClaw 版本信息和系统检查通过，说明安装成功。

## 步骤 2：初始配置

### 运行设置向导

安装脚本会自动启动设置向导。如果您跳过了向导或需要重新配置，可以手动运行：

```bash
openclaw onboard
```

### 向导步骤

设置向导将引导您完成以下配置：

1. **选择配置模式**：
   - **快速配置**：使用默认设置（推荐新手）
   - **高级配置**：自定义各项设置

2. **设置工作目录**：
   - 默认：`~/.openclaw/workspace`
   - 可自定义其他目录

3. **选择代理模型**：
   - **默认模型**：OpenClaw 推荐的模型配置
   - **自定义模型**：指定其他模型提供商

4. **配置消息频道**（可选）：
   - 可以稍后配置
   - 支持 WhatsApp、Telegram、Discord 等

5. **安全设置**：
   - 设置 API 密钥和访问控制
   - 配置沙箱和安全限制

### 生成配置文件

向导完成后，会在以下位置生成配置文件：

- **主配置文件**：`~/.openclaw/openclaw.json`
- **代理配置**：`~/.openclaw/agent/main/agent.json`
- **环境变量**：`~/.openclaw/.env`（可选）

## 步骤 3：启动网关服务

### 启动网关

OpenClaw 的核心是网关服务，它管理所有代理和连接：

```bash
openclaw gateway start
```

### 验证网关状态

```bash
openclaw status
```

输出应显示网关正在运行，并列出可用的代理和连接。

### 设置开机自启（可选）

如果您希望网关在系统启动时自动运行：

**macOS（使用 launchd）：**
```bash
openclaw gateway install-launchd
```

**Linux（使用 systemd）：**
```bash
openclaw gateway install-systemd
```

**Windows（使用服务）：**
```bash
openclaw gateway install-service
```

## 步骤 4：连接消息频道

### 选择消息平台

OpenClaw 支持多种消息平台。选择您最常用的平台开始：

#### 连接 WhatsApp

1. 确保手机已安装 WhatsApp
2. 运行 WhatsApp 连接向导：
   ```bash
   openclaw channel connect whatsapp
   ```
3. 扫描显示的二维码
4. 等待连接建立

#### 连接 Telegram

1. 在 Telegram 中创建 Bot（通过 @BotFather）
2. 获取 Bot Token
3. 运行 Telegram 连接向导：
   ```bash
   openclaw channel connect telegram --token YOUR_BOT_TOKEN
   ```
4. 在 Telegram 中与您的 Bot 开始对话

#### 连接 Discord

1. 在 Discord 开发者门户创建应用
2. 获取 Bot Token 和 Client ID
3. 运行 Discord 连接向导：
   ```bash
   openclaw channel connect discord --token YOUR_BOT_TOKEN --client-id YOUR_CLIENT_ID
   ```
4. 邀请 Bot 到您的服务器

### 验证频道连接

```bash
openclaw channels list
```

应显示已连接的频道及其状态。

## 步骤 5：与代理对话

### 通过 WebChat 界面

OpenClaw 提供了内置的 Web 聊天界面：

```bash
openclaw dashboard
```

然后在浏览器中打开 `http://localhost:18789`（或显示的地址）。

### 通过消息平台

向您连接的消息频道发送消息，代理将自动回复。

#### 示例对话：

**您：** 你好，OpenClaw！
**代理：** 你好！我是 OpenClaw 代理，很高兴为您服务。我可以帮您做什么？

**您：** 今天的日期是什么？
**代理：** 今天是 2026年2月15日，星期日。

**您：** 帮我创建一个简单的 Python 脚本
**代理：** 当然！这是一个简单的 Python 脚本示例...
（代理会提供代码并解释）

### 常用命令

代理支持一些特殊命令：

- `/help` - 显示帮助信息
- `/status` - 查看代理状态
- `/tools` - 列出可用工具
- `/reset` - 重置当前会话
- `/new` - 开始新会话

## 步骤 6：探索核心功能

### 1. 工具调用

让代理执行实际任务：

**浏览器操作：**
```
帮我搜索 OpenAI 的最新公告
```

**文件操作：**
```
在当前目录创建一个名为 notes.md 的文件
```

**命令执行：**
```
查看当前目录的文件列表
```

### 2. 会话管理

- **会话历史**：代理会记住对话上下文
- **多会话支持**：同时进行多个独立对话
- **会话导出**：导出对话记录供以后参考

### 3. 记忆系统

代理可以记住重要信息：

```
记住：我最喜欢的颜色是蓝色
```

稍后您可以询问：
```
我之前说过最喜欢的颜色是什么？
```

### 4. 多代理系统（高级）

配置多个专业代理：

```bash
# 创建编码专用代理
openclaw agent create coding --workspace ~/.openclaw/workspace/coding

# 创建研究专用代理  
openclaw agent create research --workspace ~/.openclaw/workspace/research
```

## 步骤 7：基本配置调整

### 修改代理行为

编辑代理配置文件 `~/.openclaw/agent/main/agent.json`：

```json
{
  "systemPrompt": "你是一个有帮助的助手，专注于提供准确、有用的信息。",
  "parameters": {
    "temperature": 0.7,
    "maxTokens": 2000
  },
  "tools": {
    "profile": "restricted",
    "allow": ["message", "file", "network"]
  }
}
```

### 添加 API 密钥

如果您使用需要 API 密钥的服务（如 OpenAI、Gemini）：

```bash
# 设置 OpenAI API 密钥
openclaw config set openai.apiKey YOUR_API_KEY

# 设置 Gemini API 密钥
openclaw config set google.apiKey YOUR_GEMINI_KEY
```

### 调整资源限制

根据您的系统资源调整限制：

```json
{
  "agent": {
    "sandbox": {
      "resourceLimits": {
        "cpu": "50%",
        "memory": "1GB",
        "timeout": 60000
      }
    }
  }
}
```

## 常见问题解答

### Q1：安装失败怎么办？

**A：** 尝试以下步骤：
1. 检查网络连接
2. 确保有足够的磁盘空间
3. 查看详细错误日志：`openclaw doctor --verbose`
4. 手动安装 Node.js 22+ 后重试

### Q2：网关无法启动？

**A：** 检查：
1. 端口 18789 是否被占用：`sudo lsof -i :18789`
2. 防火墙是否阻止连接
3. 查看网关日志：`openclaw logs --gateway`

### Q3：代理不响应消息？

**A：** 验证：
1. 网关是否正在运行：`openclaw status`
2. 频道是否已连接：`openclaw channels list`
3. 代理是否启用：`openclaw agent status main`

### Q4：如何更新 OpenClaw？

**A：** 运行更新命令：
```bash
openclaw update
```
或重新运行安装脚本。

### Q5：如何卸载 OpenClaw？

**A：** 完全卸载：
```bash
# 停止服务
openclaw gateway stop

# 卸载 CLI
npm uninstall -g openclaw

# 删除配置和数据（可选）
rm -rf ~/.openclaw
```

## 下一步学习路径

### 初学者
1. **阅读核心概念**：了解代理、会话、工具、记忆等基本概念
2. **尝试各种工具**：体验浏览器、执行、文件等工具
3. **连接多个频道**：设置 Telegram、Discord 等其他平台

### 进阶用户
1. **配置多代理系统**：创建专业分工的多个代理
2. **开发自定义工具**：扩展代理的能力范围
3. **集成外部系统**：连接数据库、API、Webhook 等
4. **优化性能配置**：调整参数以获得最佳性能

### 开发者
1. **探索 API 文档**：了解 OpenClaw 的编程接口
2. **贡献代码**：参与 OpenClaw 开源项目
3. **构建插件**：开发频道插件或工具插件
4. **部署生产环境**：配置高可用性和安全性

## 获取帮助

### 官方资源
- **文档网站**：https://docs.openclaw.ai
- **GitHub 仓库**：https://github.com/openclaw/openclaw
- **更新日志**：https://github.com/openclaw/openclaw/releases

### 社区支持
- **GitHub Discussions**：提问和讨论
- **问题追踪**：报告 bug 和功能请求
- **Discord 社区**：实时交流和支持

### 故障排除
- **系统检查**：`openclaw doctor`
- **查看日志**：`openclaw logs [--tail 100]`
- **调试模式**：`openclaw --verbose [command]`

---

**恭喜！您已经成功安装并配置了 OpenClaw。现在开始探索 AI 代理的强大能力吧！**

> 提示：OpenClaw 正在积极开发中，建议定期检查更新以获取新功能和安全修复。如果您遇到任何问题，请查阅文档或在社区中寻求帮助。