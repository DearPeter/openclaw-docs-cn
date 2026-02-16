# 网关架构

## 概述

OpenClaw 的核心是一个长期运行的**网关**守护进程，它管理所有消息服务连接（包括通过 Baileys 的 WhatsApp、通过 grammY 的 Telegram、Slack、Discord、Signal、iMessage 和 WebChat）。

控制平面客户端（macOS 应用程序、命令行界面、网页 UI、自动化工具）通过 WebSocket 连接到网关，使用配置的绑定主机地址（默认为 `127.0.0.1:18789`）。

**节点**（macOS/iOS/Android/无头设备）也通过 WebSocket 连接，但需要在连接时声明 `role: node` 并提供明确的能力/命令。

每个主机只有一个网关实例，它是唯一能够打开 WhatsApp 会话的地方。

此外，一个**画布主机**（默认端口 18793）提供代理可编辑的 HTML 和 A2UI 界面。

## 组件与数据流

### 网关（守护进程）

- 维护与消息提供商（WhatsApp、Telegram 等）的连接
- 提供类型化的 WebSocket API（请求、响应、服务器推送事件）
- 根据 JSON Schema 验证传入的数据帧
- 发出各种事件，如 `代理`、`chat`、`presence`、`health`、`heartbeat`、`cron`

### 客户端（mac 应用 / 命令行界面 / 网页管理界面）

- 每个客户端维护一个独立的 WebSocket 连接
- 发送请求（`health`、`status`、`send`、`代理`、`system-presence`）
- 订阅事件（`tick`、`代理`、`presence`、`shutdown`）

### 节点（macOS / iOS / Android / 无头设备）

- 连接到同一个 WebSocket 服务器，但需要指定 `role: 节点`
- 在连接时提供设备身份标识
- 配对是基于设备的（角色为 `节点`），批准信息存储在设备配对存储中
- 暴露命令，如 `canvas.*`、`camera.*`、`screen.record`、`location.get`
- 协议详情请参阅：[网关协议](../gateway/protocol.md)

### WebChat

- 使用网关 WebSocket API 获取聊天记录和发送消息的静态用户界面
- 在远程设置中，通过与其他客户端相同的 SSH/Tailscale 隧道连接

## 连接生命周期（单个客户端）

### 线协议（摘要）

- **传输层**：WebSocket，使用 JSON 载荷的文本帧
- **第一帧**：必须是 `connect`
- **握手后**：
  - **请求**：`{type:"req", id, method, params}` → `{type:"res", id, ok, payload|error}`
  - **事件**：`{type:"event", event, payload, seq?, stateVersion?}`
- 如果设置了 `OPENCLAW_网关_TOKEN`（或 `--令牌`），`connect.params.auth.令牌` 必须匹配，否则连接关闭
- 对有副作用的方法（`send`、`代理`）需要幂等键，以安全重试；服务器维护短期的去重缓存
- 节点必须在 `connect` 中包含 `role: "node"` 以及能力/命令/权限信息

## 配对与本地信任

所有 WebSocket 客户端（操作员和节点）在连接时都必须提供**设备身份标识**。

新的设备 ID 需要配对批准；网关会为后续连接颁发**设备令牌**。

**本地连接**（环回地址或网关主机自身的 Tailscale 网络地址）可以自动批准，以保持同主机用户体验的流畅性。

**非本地连接**必须对 `connect.challenge` 随机数进行签名，并且需要显式批准。

网关认证（`gateway.auth.*`）仍然适用于所有连接，无论是本地还是远程。

详情请参阅：[网关协议](../gateway/protocol.md)、[配对](../channels/pairing.md)、[安全](../gateway/security.md)

## 协议类型化与代码生成

- 使用 TypeBox 模式定义协议
- 从这些模式生成 JSON Schema
- 从 JSON Schema 生成 Swift 模型

## 远程访问

**首选方案**：Tailscale 或 VPN

**备选方案**：SSH 隧道
```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

相同的握手和认证令牌在隧道中同样适用。

在远程设置中，可以为 WebSocket 启用 TLS 和可选的证书锁定。

## 运维快照

- **启动**：`OpenClaw 网关`（前台运行，日志输出到标准输出）
- **健康检查**：通过 WebSocket 的 `health` 请求（也包含在 `hello-ok` 中）
- **监管**：使用 launchd/systemd 实现自动重启

## 不变式

1. 每个主机上只有一个网关控制一个 Baileys 会话
2. 握手是强制性的；任何非 JSON 或非 `connect` 的第一帧都会导致连接立即关闭
3. 事件不会重放；客户端必须在出现间隙时刷新状态

---

*最后更新：2026-01-22*

*本文档已根据 OpenClaw 技术术语表进行专业重译，确保术语一致性。如有疑问请参考相关技术文档。*