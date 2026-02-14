# OpenClaw 中文文档

OpenClaw 官方文档的中文翻译版本，部署在 GitHub Pages 上。

## 网站地址

- 主站: https://dearpeter.github.io/openclaw-docs-cn/
- 英文原版: https://docs.openclaw.ai/

## 功能特性

- 📚 完整的 OpenClaw 文档中文翻译
- 🔍 全站搜索功能
- 🌐 响应式设计，支持移动端
- 🔄 中英文切换支持
- 🚀 基于 Hugo 的静态网站
- 📱 现代化的用户界面
- ⚡ 快速的页面加载速度

## 本地开发

### 环境要求

- Node.js 18+
- Hugo 0.140.0+
- Git

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/DearPeter/openclaw-docs-cn.git
cd openclaw-docs-cn
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中打开：http://localhost:1313

### 构建网站

```bash
npm run build
```

构建后的文件将生成在 `public/` 目录中。

## 项目结构

```
openclaw-docs-cn/
├── content/              # 网站内容（Markdown文件）
│   ├── zh-CN/           # 中文内容
│   └── en/              # 英文内容
├── themes/              # Hugo主题
│   └── openclaw-docs-theme/
│       ├── layouts/     # 页面模板
│       ├── static/      # 静态资源
│       └── ...
├── scripts/             # 构建脚本
├── public/              # 构建输出目录
├── hugo.toml           # Hugo配置文件
└── package.json        # Node.js依赖
```

## 贡献指南

### 翻译贡献

1. 在 `content/zh-CN/` 目录下找到需要翻译的页面
2. 创建或编辑对应的 Markdown 文件
3. 提交 Pull Request

### 样式改进

1. 编辑 `themes/openclaw-docs-theme/` 中的文件
2. 测试修改效果
3. 提交 Pull Request

### 报告问题

如果发现翻译错误、链接失效或其他问题，请通过以下方式报告：

1. 在 GitHub 上创建 Issue
2. 描述具体问题和建议的解决方案
3. 提供相关截图或链接

## 部署

网站通过 GitHub Actions 自动部署到 GitHub Pages。每次推送到 `main` 分支时都会自动构建和部署。

### 手动部署

如果需要手动部署，可以运行：

```bash
npm run deploy
```

然后将 `public/` 目录的内容推送到 `gh-pages` 分支。

## 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](LICENSE) 文件。

## 致谢

- 感谢 OpenClaw 团队创建了优秀的开源项目
- 感谢所有贡献者的翻译工作
- 感谢 Hugo 静态网站生成器

## 联系方式

- GitHub: [@DearPeter](https://github.com/DearPeter)
- 项目地址: https://github.com/DearPeter/openclaw-docs-cn
- 问题反馈: https://github.com/DearPeter/openclaw-docs-cn/issues