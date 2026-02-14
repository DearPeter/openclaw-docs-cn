# OpenClaw中文文档网站部署指南

## 项目状态
- ✅ 翻译完成：99个文件已翻译
- ✅ 网站构建：测试成功
- ✅ Git仓库：已初始化并提交
- ✅ GitHub Actions：已配置

## 部署步骤

### 1. 推送代码到GitHub

由于当前环境没有GitHub访问权限，需要手动完成以下步骤：

1. **在GitHub上创建仓库**（如果尚未存在）：
   - 访问 https://github.com/new
   - 仓库名：`openclaw-docs-cn`
   - 描述：`OpenClaw官方文档中文翻译 - 完整的工具文档中文版`
   - 选择公开（Public）
   - 不初始化README（代码已准备好）

2. **推送本地代码**：
   ```bash
   # 添加远程仓库
   git remote add origin https://github.com/DearPeter/openclaw-docs-cn.git
   
   # 推送代码
   git push -u origin master
   ```

   如果使用SSH：
   ```bash
   git remote add origin git@github.com:DearPeter/openclaw-docs-cn.git
   git push -u origin master
   ```

### 2. 配置GitHub Pages

代码推送后，GitHub Actions会自动运行：

1. **访问仓库的Actions标签页**：
   - https://github.com/DearPeter/openclaw-docs-cn/actions

2. **首次运行可能需要授权**：
   - 如果工作流被阻止，点击"Approve and run"

3. **配置Pages设置**：
   - 进入仓库Settings → Pages
   - Source: GitHub Actions
   - 确保工作流成功运行后，网站将自动部署到：
     `https://dearpeter.github.io/openclaw-docs-cn/`

### 3. 自定义域名（可选）

如果需要自定义域名：

1. **在Pages设置中添加自定义域名**
2. **配置DNS记录**：
   ```
   CNAME记录指向：dearpeter.github.io
   ```

### 4. 验证部署

部署完成后，访问以下URL验证：

- 主站：https://dearpeter.github.io/openclaw-docs-cn/
- 中文版：https://dearpeter.github.io/openclaw-docs-cn/zh/
- 英文版：https://dearpeter.github.io/openclaw-docs-cn/en/

## 技术配置详情

### GitHub Actions工作流
- **触发条件**：推送到main分支或手动触发
- **构建环境**：Ubuntu最新版
- **构建步骤**：
  1. 检出代码
  2. 安装Hugo (v0.140.0扩展版)
  3. 安装Node.js依赖
  4. 构建网站
  5. 生成搜索索引
  6. 部署到GitHub Pages

### 网站配置
- **基础URL**：`https://dearpeter.github.io/openclaw-docs-cn/`
- **多语言支持**：中文（默认）、英文
- **主题**：自定义OpenClaw文档主题
- **搜索功能**：已启用
- **响应式设计**：支持移动端

## 维护指南

### 更新内容
1. 编辑`content/zh/`目录下的中文文档
2. 编辑`content/en/`目录下的英文文档
3. 提交更改并推送到GitHub
4. GitHub Actions会自动重新部署

### 添加新页面
1. 在相应语言目录创建Markdown文件
2. 添加Front Matter：
   ```yaml
   ---
   title: "页面标题"
   date: 2024-01-01
   weight: 10
   ---
   ```
3. 提交并推送

### 本地开发
```bash
# 安装Hugo
# 扩展版：https://github.com/gohugoio/hugo/releases

# 启动开发服务器
hugo server -D

# 构建网站
hugo
```

## 故障排除

### 构建失败
1. 检查GitHub Actions日志
2. 验证Hugo版本（需要扩展版）
3. 检查依赖安装

### 页面404
1. 确认baseURL配置正确
2. 检查文件路径和大小写
3. 清除浏览器缓存

### 搜索不工作
1. 确认`scripts/generate-search-index.js`成功运行
2. 检查控制台错误
3. 验证JSON搜索索引文件生成

## 联系支持

如有问题，请：
1. 查看GitHub Issues：https://github.com/DearPeter/openclaw-docs-cn/issues
2. 提交问题报告
3. 或联系项目维护者

---

**部署状态**：代码已准备就绪，等待推送到GitHub仓库并启用GitHub Pages。