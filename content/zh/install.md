---
title: "OpenClaw 安装指南"
description: "OpenClaw 安装指南 - 通过安装脚本、npm、Docker 等多种方式安装 OpenClaw"
date: 2026-02-15
---

# OpenClaw 安装指南

本文档提供 OpenClaw 的完整安装指南，涵盖多种安装方法和故障排除。

## 系统要求

在开始安装之前，请确保您的系统满足以下要求：

- **节点.js 22+** (安装脚本会自动检测并安装)
- **操作系统**: macOS, Linux 或 Windows (推荐使用 WSL2)
- **包管理器**: pnpm (仅从源代码构建时需要)

**Windows 用户注意**: 强烈建议在 WSL2 环境下运行 OpenClaw，以获得最佳兼容性和性能。

## 安装方法

### 推荐方法：安装脚本

安装脚本是最简单、最推荐的安装方式。它会自动处理 节点.js 检测、安装和初始设置。

**macOS / Linux / WSL2:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

脚本执行完成后，您就拥有了完整的 OpenClaw 环境，包括命令行工具和网关服务。

#### 跳过初始设置

如果您只需要安装二进制文件而不运行初始设置向导：

**macOS / Linux / WSL2:**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows (PowerShell):**

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

有关所有选项、环境变量和 CI/CD 自动化配置，请参阅[安装脚本内部原理](#安装脚本内部原理)。

### npm / pnpm 安装

如果您已经安装了 节点.js 22+，并希望自己管理安装：

**使用 npm:**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

**处理 sharp 构建错误:**

如果您全局安装了 libvips (macOS 上通过 Homebrew 常见) 并且 `sharp` 包构建失败，可以强制使用预构建二进制文件：

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

如果看到 `sharp: Please add 节点-gyp to your dependencies` 错误，请安装构建工具 (macOS: Xcode CLT + `npm install -g 节点-gyp`) 或使用上述环境变量。

**使用 pnpm:**

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g  # 批准 OpenClaw、节点-llama-cpp、sharp 等包的构建脚本
openclaw onboard --install-daemon
```

pnpm 要求明确批准使用构建脚本的包。首次安装显示 "Ignored build scripts" 警告后，运行 `pnpm approve-builds -g` 并选择列出的包。

### 从源代码安装

适用于贡献者或希望从本地代码库运行的用户。

#### 1. 克隆和构建

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

#### 2. 链接命令行工具

使 `openclaw` 命令全局可用：

```bash
pnpm link --global
```

或者，跳过链接，从代码库内部通过 `pnpm openclaw ...` 运行命令。

#### 3. 运行初始设置

```bash
openclaw onboard --install-daemon
```

有关更深度的开发工作流程，请参阅[开发设置指南](/zh/start/setup/)。

## 其他安装方法

### Docker

适用于容器化或无头部署。OpenClaw 提供官方 Docker 镜像，支持多种架构和配置。请参阅 [Docker 安装文档](/zh/install/docker/)。

### Nix

通过 Nix 进行声明式安装，确保环境一致性。适用于使用 Nix 包管理器的系统。

### Ansible

用于自动化集群配置和部署，适合企业级部署场景。

### Bun (实验性)

通过 Bun 运行时使用 CLI 功能。注意：部分功能可能受限。

## 安装后验证

安装完成后，请验证一切是否正常工作：

```bash
openclaw doctor    # 检查配置问题
openclaw status    # 查看网关状态
openclaw 仪表板 # 打开浏览器控制界面
```

### 自定义环境变量

如果需要自定义运行时路径，可以使用以下环境变量：

- `OPENCLAW_HOME`: 基于主目录的内部路径
- `OPENCLAW_STATE_DIR`: 可变状态文件的位置
- `OPENCLAW_CONFIG_PATH`: 配置文件的位置

有关环境变量的优先级和完整详细信息，请参阅[环境变量文档](/zh/help/environment/)。

## 故障排除

### 问题：找不到 OpenClaw 命令

如果系统找不到 `openclaw` 命令，通常是 PATH 环境变量配置问题。

#### 快速诊断：

```bash
节点 -v           # 检查 节点.js 版本
npm -v            # 检查 npm 版本
npm prefix -g     # 查看全局安装目录
echo "$PATH"      # 查看当前 PATH
```

如果 `$(npm prefix -g)/bin` (macOS/Linux) 或 `$(npm prefix -g)` (Windows) 不在您的 `$PATH` 中，shell 将无法找到全局 npm 二进制文件（包括 `openclaw`）。

#### 解决方案：

将全局 npm 二进制目录添加到 shell 启动文件中：

**macOS/Linux (添加到 ~/.zshrc 或 ~/.bashrc):**

```bash
export PATH="$(npm prefix -g)/bin:$PATH"
```

**Windows:** 将 `npm prefix -g` 的输出添加到系统 PATH 环境变量中。

添加后，请打开新的终端窗口（或在 zsh 中执行 `rehash`，在 bash 中执行 `hash -r`）。

## 更新和卸载

### 更新 OpenClaw

保持 OpenClaw 最新版本：

```bash
npm update -g openclaw@latest
# 或使用您最初使用的安装方法
```

### 迁移到新机器

将 OpenClaw 配置和数据迁移到新机器，请参阅[迁移指南](/zh/install/migration/)。

### 卸载 OpenClaw

完全移除 OpenClaw：

1. 停止网关服务：`openclaw gateway stop`
2. 卸载全局包：
   ```bash
   npm uninstall -g openclaw
   # 或 pnpm remove -g openclaw
   ```
3. 删除配置文件和数据目录：
   ```bash
   rm -rf ~/.openclaw
   ```

## 安装脚本内部原理

安装脚本 (`install.sh` 和 `install.ps1`) 执行以下操作：

1. **系统检测**: 识别操作系统架构和包管理器
2. **Node.js 检查**: 检查 节点.js 22+ 是否存在，如不存在则安装
3. **二进制下载**: 下载最新版 OpenClaw CLI
4. **全局安装**: 通过 npm 全局安装 OpenClaw
5. **服务设置**: 配置和启动网关守护进程
6. **初始设置**: 运行交互式设置向导（除非指定 `--no-onboard`）

脚本支持多种环境变量进行自定义：

- `OPENCLAW_VERSION`: 指定安装版本
- `OPENCLAW_INSTALL_DIR`: 自定义安装目录
- `OPENCLAW_SKIP_DEPENDENCIES`: 跳过依赖检查

## 获取帮助

如果在安装过程中遇到问题：

1. 查阅[常见问题解答](/zh/help/)
2. 查看[故障排除指南](/zh/install/troubleshooting/)
3. 在 [GitHub Discussions](https://github.com/openclaw/openclaw/discussions) 寻求社区帮助
4. 提交 [GitHub Issue](https://github.com/openclaw/openclaw/issues) 报告 bug

---

**恭喜！您已成功安装 OpenClaw。接下来，请查看[快速开始指南](/zh/getting-started/)开始使用。**

> 注意：本文档基于 OpenClaw 最新版本编写，内容可能随版本更新而变化。请定期查看[更新日志](https://github.com/openclaw/openclaw/releases)获取最新信息。