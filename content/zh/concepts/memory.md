---
title: "记忆管理"
description: "OpenClaw 记忆系统 - 了解记忆存储、搜索、向量索引和配置选项"
date: 2026-02-15
---

# 记忆管理

记忆系统是 OpenClaw 的核心功能之一，它使代理能够持久化存储和检索信息，保持长期上下文和知识。

## 概述

### 什么是 OpenClaw 记忆？

OpenClaw 记忆系统基于简单的 Markdown 文件，存储在代理的工作空间中。这些文件是**真相源** - 模型只"记住"写入磁盘的内容。记忆搜索工具通过活动记忆插件提供，支持语义搜索和向量索引。

### 核心设计原则

1. **文件即真相**：所有记忆都以 Markdown 文件形式存储
2. **可搜索性**：支持语义搜索和关键词搜索
3. **可扩展性**：支持本地和远程向量嵌入
4. **性能优化**：智能缓存和索引管理

## 记忆文件结构

### 默认工作空间布局

OpenClaw 使用两层记忆结构：

```
工作空间/
├── 记忆.md                    # 精选长期记忆（可选）
└── memory/                      # 日常记忆目录
    ├── 2026-02-14.md           # 每日日志（仅追加）
    ├── 2026-02-15.md           # 当前日志
    └── ...
```

### 文件用途

- **`memory.md`**：精选的长期记忆，包含重要决策、偏好和持久性事实
  - 仅在主私密会话中加载（不在群组上下文中）
- **`memory/YYYY-MM-DD.md`**：日常日志，包含日常笔记和运行上下文
  - 在会话开始时读取今天和昨天的日志
  - 仅追加模式，保持时间顺序

## 何时写入记忆

### 记忆分类准则

1. **写入 `记忆.md`**：
   - 重要决策和结论
   - 用户偏好和配置
   - 持久性事实和知识
   - 需要长期保留的信息

2. **写入 `memory/YYYY-MM-DD.md`**：
   - 日常操作笔记
   - 会话上下文和临时信息
   - 执行日志和调试信息
   - 时间敏感的内容

### 最佳实践

- **主动记录**：当有人要求"记住这个"时，立即写入文件
- **避免内存存储**：不要将重要信息仅保存在 RAM 中
- **定期整理**：定期审查和整理记忆文件
- **明确标注**：使用清晰的标题和结构组织内容

## 自动记忆刷新（压缩前触发）

当会话接近自动压缩时，OpenClaw 会触发**静默的、代理式的轮次**，提醒模型在上下文被压缩之前写入持久性记忆。

### 配置示例

```json
{
  "代理": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000,
          "systemPrompt": "会话 nearing 压缩. Store durable memories now.",
          "prompt": "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
        }
      }
    }
  }
}
```

### 工作原理

1. **软阈值**：当会话令牌估计超过 `contextWindow - reserveTokensFloor - softThresholdTokens` 时触发刷新
2. **静默执行**：默认提示包含 `NO_REPLY`，因此不会向用户显示任何内容
3. **双重提示**：用户提示加系统提示追加提醒
4. **每压缩周期一次**：在 `sessions.JSON` 中跟踪
5. **可写性检查**：如果会话在沙箱中运行且 `workspaceAccess` 为 `"ro"` 或 `"none"`，则跳过刷新

## 向量记忆搜索

OpenClaw 可以为 `memory.md` 和 `memory/*.md` 构建小型向量索引，即使措辞不同，语义查询也能找到相关笔记。

### 默认配置

- **启用状态**：默认启用
- **文件监控**：监视记忆文件变化（防抖动）
- **配置位置**：在 `代理.defaults.memorySearch` 下配置（不是顶层 `memorySearch`）
- **嵌入提供程序**：默认使用远程嵌入

### 嵌入提供程序选择

如果没有设置提供程序，OpenClaw 自动选择：

1. **本地模式**：如果配置了 `local` 且文件存在
2. **OpenAI**：如果可以解析 OpenAI 密钥
3. **Gemini**：如果可以解析 Gemini 密钥
4. **Voyage**：如果可以解析 Voyage 密钥

否则，记忆搜索保持禁用状态，直到配置完成。

## 混合搜索（BM25 + 向量）

OpenClaw 支持混合搜索，结合向量相似性和关键词相关性：

### 为什么需要混合搜索？

- **向量搜索**：擅长语义匹配，即使措辞不同
  - 示例："Mac Studio 网关主机" vs "运行网关的机器"
  - 示例："防抖动文件更新" vs "避免每次写入都索引"

- **BM25 关键词搜索**：擅长精确令牌匹配
  - 示例：ID（`a828e60`, `b3b9895a...`）
  - 示例：代码符号（`sessionStatus`）
  - 示例：错误字符串（"sqlite-vec unavailable"）

### 结果合并策略

1. **候选池检索**：
   - 向量：按余弦相似度获取前 `maxResults * candidateMultiplier` 个结果
   - BM25：按 FTS5 BM25 排名获取前 `maxResults * candidateMultiplier` 个结果

2. **分数转换**：
   - BM25 排名转换为 0..1 范围的分数：`textScore = 1 / (1 + max(0, bm25Rank))`

3. **加权最终分数**：
   - `finalScore = vectorWeight * vectorScore + textWeight * textScore`

### 配置示例

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "query": {
          "hybrid": {
            "enabled": true,
            "vectorWeight": 0.7,
            "textWeight": 0.3,
            "candidateMultiplier": 4
          }
        }
      }
    }
  }
}
```

## 记忆工具

### `记忆_search` 工具

语义搜索 Markdown 块（约 400 个令牌目标，80 个令牌重叠），返回：
- 片段文本（约 700 字符限制）
- 文件路径和行范围
- 匹配分数
- 提供程序/模型信息
- 是否从本地回退到远程嵌入

**注意**：不返回完整的文件内容。

### `记忆_get` 工具

读取特定的记忆 Markdown 文件（工作空间相对路径），可选择从起始行开始读取指定行数。

**限制**：拒绝 `memory.md`/`memory/` 之外的路径。

## 配置选项

### 基本配置

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "provider": "openai",
        "model": "text-embedding-3-small",
        "remote": {
          "apiKey": "YOUR_API_KEY"
        },
        "extraPaths": [
          "../team-docs",
          "/srv/shared-notes/overview.md"
        ]
      }
    }
  }
}
```

### 本地嵌入配置

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "provider": "local",
        "model": "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf",
        "local": {
          "modelPath": "~/.cache/openclaw/embeddings/model.gguf"
        }
      }
    }
  }
}
```

### Gemini 嵌入配置

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "provider": "gemini",
        "model": "gemini-embedding-001",
        "remote": {
          "apiKey": "YOUR_GEMINI_API_KEY"
        }
      }
    }
  }
}
```

## 索引管理

### 索引位置

每个代理的 SQLite 索引存储在：`~/.openclaw/memory/<agentId>.sqlite`

可通过 `代理.defaults.memorySearch.store` 配置，支持 `{agentId}` 令牌。

### 索引触发条件

1. **文件变化**：监视 `memory.md` + `memory/` 目录，标记索引为脏（防抖动 1.5 秒）
2. **同步计划**：在会话开始、搜索时或按间隔异步运行
3. **会话记录**：使用增量阈值触发后台同步
4. **重新索引**：如果嵌入提供程序/模型、端点指纹或分块参数发生更改，OpenClaw 自动重置并重新索引整个存储

## 高级功能

### 嵌入缓存

OpenClaw 可以在 SQLite 中缓存块嵌入，以便重新索引和频繁更新（尤其是会话记录）不会重新嵌入未更改的文本。

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "缓存": {
          "enabled": true,
          "maxEntries": 50000
        }
      }
    }
  }
}
```

### SQLite 向量加速（sqlite-vec）

当 sqlite-vec 扩展可用时，OpenClaw 在 SQLite 虚拟表（`vec0`）中存储嵌入，并在数据库中执行向量距离查询。

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "store": {
          "vector": {
            "enabled": true,
            "extensionPath": "/path/to/sqlite-vec"
          }
        }
      }
    }
  }
}
```

### 会话记忆搜索（实验性）

可选地索引会话记录并通过 `记忆_search` 显示它们。

```json
{
  "代理": {
    "defaults": {
      "memorySearch": {
        "experimental": {
          "sessionMemory": true
        },
        "sources": ["记忆", "sessions"]
      }
    }
  }
}
```

## QMD 后端（实验性）

QMD 是一个本地优先的搜索辅助工具，结合了 BM25 + 向量 + 重新排序。

### 启用 QMD

```json
{
  "记忆": {
    "backend": "qmd",
    "citations": "auto",
    "qmd": {
      "includeDefaultMemory": true,
      "update": {
        "interval": "5m",
        "debounceMs": 15000
      },
      "limits": {
        "maxResults": 6,
        "timeoutMs": 4000
      },
      "scope": {
        "default": "deny",
        "rules": [{
          "action": "allow",
          "match": {
            "chatType": "direct"
          }
        }]
      },
      "paths": [{
        "name": "docs",
        "path": "~/notes",
        "pattern": "**/*.md"
      }]
    }
  }
}
```

## 最佳实践

### 记忆管理

1. **定期整理**：每周审查记忆文件，清理过时信息
2. **明确分类**：将长期记忆与日常日志分开存储
3. **备份重要记忆**：定期备份 `memory.md` 文件
4. **监控索引大小**：定期检查向量索引大小

### 性能优化

1. **使用混合搜索**：结合语义和关键词搜索提高准确性
2. **启用嵌入缓存**：减少重复嵌入计算
3. **合理配置阈值**：根据使用模式调整压缩和刷新阈值
4. **选择性索引**：只索引真正需要搜索的文档

### 安全考虑

1. **敏感信息处理**：避免在记忆文件中存储密码或密钥
2. **访问控制**：确保记忆文件目录有适当的文件权限
3. **隐私保护**：在多人环境中使用安全记忆模式
4. **定期审计**：检查记忆文件内容，确保没有泄露敏感信息

## 故障排除

### 常见问题

1. **记忆搜索不工作**：
   - 检查 API 密钥配置
   - 验证记忆文件路径
   - 检查索引状态

2. **索引不同步**：
   - 手动触发重新索引
   - 检查文件权限
   - 查看错误日志

3. **性能问题**：
   - 减少索引文件数量
   - 启用缓存
   - 调整搜索参数

4. **嵌入失败**：
   - 检查网络连接
   - 验证 API 配额
   - 尝试回退到本地模式

### 调试命令

```bash
# 检查记忆系统状态
openclaw status --记忆

# 查看索引统计
openclaw 记忆 stats

# 手动触发重新索引
openclaw 记忆 reindex

# 测试记忆搜索
openclaw 记忆 search "查询内容"
```

---

*本文档已根据 OpenClaw 技术术语表进行专业重译，确保术语一致性。有关最新信息，请参考[英文原版文档](https://docs.openclaw.ai/concepts/memory)。*