#!/usr/bin/env python3
"""
创建最简单的静态网站
"""
import os
import shutil
from pathlib import Path

def create_simple_site():
    """创建最简单的静态网站"""
    base_dir = Path('/root/.openclaw/workspace/openclaw-docs-cn')
    public_dir = base_dir / 'public'
    
    # 清空public目录
    if public_dir.exists():
        shutil.rmtree(public_dir)
    public_dir.mkdir(parents=True)
    
    # 创建中文目录
    zh_dir = public_dir / 'zh'
    zh_dir.mkdir(parents=True)
    
    # 创建首页
    index_html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw 中文文档</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        nav { background: #f5f5f5; padding: 10px; margin-bottom: 20px; }
        nav a { margin-right: 15px; text-decoration: none; color: #0366d6; }
        h1 { color: #24292e; }
        .content { line-height: 1.6; }
        footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
        .page-list { margin-top: 20px; }
        .page-item { margin-bottom: 10px; padding: 10px; border: 1px solid #e1e4e8; border-radius: 6px; }
    </style>
</head>
<body>
    <nav>
        <a href="/openclaw-docs-cn/">首页</a>
        <a href="/openclaw-docs-cn/zh/">中文</a>
        <a href="/openclaw-docs-cn/en/">英文</a>
        <a href="https://docs.openclaw.ai/">原版文档</a>
    </nav>
    
    <h1>OpenClaw 中文文档</h1>
    
    <div class="content">
        <p>欢迎访问 OpenClaw 官方文档的中文翻译版本！</p>
        
        <h2>文档分类</h2>
        
        <div class="page-list">
            <div class="page-item">
                <h3><a href="/openclaw-docs-cn/zh/concepts/">概念文档</a></h3>
                <p>OpenClaw 的核心概念和架构说明。</p>
            </div>
            
            <div class="page-item">
                <h3><a href="/openclaw-docs-cn/zh/tools/">工具文档</a></h3>
                <p>OpenClaw 的各种工具和功能使用指南。</p>
            </div>
            
            <div class="page-item">
                <h3><a href="/openclaw-docs-cn/zh/start/">开始使用</a></h3>
                <p>OpenClaw 的安装和快速入门指南。</p>
            </div>
            
            <div class="page-item">
                <h3><a href="/openclaw-docs-cn/zh/install/">安装指南</a></h3>
                <p>详细的安装步骤和配置说明。</p>
            </div>
            
            <div class="page-item">
                <h3><a href="/openclaw-docs-cn/zh/channels/">频道配置</a></h3>
                <p>各种消息频道的配置和使用方法。</p>
            </div>
        </div>
        
        <h2>项目信息</h2>
        <ul>
            <li><strong>GitHub仓库</strong>: <a href="https://github.com/DearPeter/openclaw-docs-cn">DearPeter/openclaw-docs-cn</a></li>
            <li><strong>原版文档</strong>: <a href="https://docs.openclaw.ai/">docs.openclaw.ai</a></li>
            <li><strong>部署状态</strong>: GitHub Pages 自动部署</li>
            <li><strong>最后更新</strong>: 2026-02-14</li>
        </ul>
    </div>
    
    <footer>
        <p>© 2026 OpenClaw 中文文档 - OpenClaw官方文档中文翻译</p>
        <p>本网站由 Data Team Assistant 自动创建和部署</p>
    </footer>
</body>
</html>"""
    
    # 写入首页
    (public_dir / 'index.html').write_text(index_html)
    (zh_dir / 'index.html').write_text(index_html)
    
    # 创建示例内容页面
    create_example_pages(zh_dir)
    
    # 创建英文目录（占位符）
    en_dir = public_dir / 'en'
    en_dir.mkdir(parents=True)
    (en_dir / 'index.html').write_text("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw Documentation</title>
</head>
<body>
    <h1>OpenClaw Documentation</h1>
    <p>English version placeholder. See <a href="/openclaw-docs-cn/zh/">Chinese version</a> for content.</p>
</body>
</html>""")
    
    print(f"静态网站创建完成: {public_dir}")
    print(f"总文件数: {len(list(public_dir.rglob('*.html')))}")

def create_example_pages(zh_dir):
    """创建示例内容页面"""
    pages = [
        ('concepts/index.html', '概念文档', 'OpenClaw 的核心概念和架构说明。'),
        ('concepts/agent.html', '代理运行时', 'OpenClaw 代理运行时的详细说明。'),
        ('tools/index.html', '工具文档', 'OpenClaw 的各种工具和功能使用指南。'),
        ('tools/browser.html', '浏览器工具', 'OpenClaw 浏览器自动化工具的使用方法。'),
        ('start/index.html', '开始使用', 'OpenClaw 的安装和快速入门指南。'),
        ('start/getting-started.html', '快速入门', 'OpenClaw 快速入门步骤。'),
    ]
    
    for path, title, description in pages:
        file_path = zh_dir / path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - OpenClaw 中文文档</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        nav {{ background: #f5f5f5; padding: 10px; margin-bottom: 20px; }}
        nav a {{ margin-right: 15px; text-decoration: none; color: #0366d6; }}
        h1 {{ color: #24292e; }}
        .content {{ line-height: 1.6; }}
        footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }}
    </style>
</head>
<body>
    <nav>
        <a href="/openclaw-docs-cn/">首页</a>
        <a href="/openclaw-docs-cn/zh/">中文首页</a>
        <a href="/openclaw-docs-cn/en/">英文</a>
        <a href="https://docs.openclaw.ai/">原版文档</a>
    </nav>
    
    <h1>{title}</h1>
    
    <div class="content">
        <p>{description}</p>
        
        <h2>内容概要</h2>
        <p>此页面是 {title} 的示例页面。完整的翻译内容正在准备中。</p>
        
        <h2>相关链接</h2>
        <ul>
            <li><a href="/openclaw-docs-cn/zh/">返回中文首页</a></li>
            <li><a href="https://docs.openclaw.ai/">访问原版文档</a></li>
            <li><a href="https://github.com/DearPeter/openclaw-docs-cn">GitHub仓库</a></li>
        </ul>
    </div>
    
    <footer>
        <p>© 2026 OpenClaw 中文文档 - 此页面为示例内容</p>
    </footer>
</body>
</html>"""
        
        file_path.write_text(content)
        print(f"创建页面: {path}")

if __name__ == '__main__':
    print("开始创建最简单的静态网站...")
    create_simple_site()
    print("\n完成！现在可以直接部署静态网站。")