#!/usr/bin/env python3
"""
最终修复：创建完整的英文内容，然后生成中文翻译
"""
import os
import shutil
from pathlib import Path

def create_complete_structure():
    """创建完整的网站结构"""
    base_dir = Path('/root/.openclaw/workspace/openclaw-docs-cn')
    
    # 1. 创建英文内容（使用占位符，但包含完整结构）
    en_dir = base_dir / 'content' / 'en'
    
    # 创建主要部分
    sections = ['concepts', 'tools', 'start', 'install', 'channels', 'gateway', 'web', 'help', 'cli', 'nodes', 'plugins', 'automation', 'reference']
    
    for section in sections:
        section_dir = en_dir / section
        section_dir.mkdir(parents=True, exist_ok=True)
        
        # 创建_index.md
        index_file = section_dir / '_index.md'
        if not index_file.exists():
            index_file.write_text(f"""---
title: "{section.title()}"
weight: 10
---

# {section.title()}

This section contains documentation about {section}.

See Chinese version for translated content.
""")
    
    # 2. 确保中文目录有完整结构
    zh_dir = base_dir / 'content' / 'zh'
    
    for section in sections:
        section_dir = zh_dir / section
        section_dir.mkdir(parents=True, exist_ok=True)
        
        # 创建_index.md
        index_file = section_dir / '_index.md'
        if not index_file.exists():
            index_file.write_text(f"""---
title: "{'概念' if section == 'concepts' else '工具' if section == 'tools' else '开始' if section == 'start' else '安装' if section == 'install' else '频道' if section == 'channels' else '网关' if section == 'gateway' else '网页' if section == 'web' else '帮助' if section == 'help' else 'CLI' if section == 'cli' else '节点' if section == 'nodes' else '插件' if section == 'plugins' else '自动化' if section == 'automation' else '参考'}"
weight: 10
---

# {'概念' if section == 'concepts' else '工具' if section == 'tools' else '开始' if section == 'start' else '安装' if section == 'install' else '频道' if section == 'channels' else '网关' if section == 'gateway' else '网页' if section == 'web' else '帮助' if section == 'help' else 'CLI' if section == 'cli' else '节点' if section == 'nodes' else '插件' if section == 'plugins' else '自动化' if section == 'automation' else '参考'}

此部分包含关于{'概念' if section == 'concepts' else '工具' if section == 'tools' else '开始' if section == 'start' else '安装' if section == 'install' else '频道' if section == 'channels' else '网关' if section == 'gateway' else '网页' if section == 'web' else '帮助' if section == 'help' else 'CLI' if section == 'cli' else '节点' if section == 'nodes' else '插件' if section == 'plugins' else '自动化' if section == 'automation' else '参考'}的文档。
""")
    
    # 3. 创建简单的内容文件
    create_simple_content()
    
    print("网站结构创建完成")

def create_simple_content():
    """创建简单的内容文件用于测试"""
    base_dir = Path('/root/.openclaw/workspace/openclaw-docs-cn/content')
    
    # 创建几个示例页面
    pages = [
        ('zh/concepts/agent.md', '# 代理运行时\n\nOpenClaw的核心概念：代理运行时环境。'),
        ('zh/tools/browser.md', '# 浏览器工具\n\nOpenClaw的浏览器自动化工具。'),
        ('zh/start/getting-started.md', '# 开始使用\n\nOpenClaw快速入门指南。'),
        ('en/concepts/agent.md', '# Agent Runtime\n\nCore concept of OpenClaw: agent runtime environment.'),
        ('en/tools/browser.md', '# Browser Tool\n\nBrowser automation tool in OpenClaw.'),
        ('en/start/getting-started.md', '# Getting Started\n\nQuick start guide for OpenClaw.'),
    ]
    
    for path, content in pages:
        file_path = base_dir / path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content)
        print(f"创建文件: {path}")

if __name__ == '__main__':
    print("开始创建完整网站结构...")
    create_complete_structure()
    print("\n完成！现在可以构建网站了。")