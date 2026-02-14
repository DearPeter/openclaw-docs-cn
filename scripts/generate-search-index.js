#!/usr/bin/env node

/**
 * 生成搜索索引
 * 这个脚本会在构建后运行，生成供客户端搜索使用的JSON索引
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 配置
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'search-index.json');
const EXCLUDE_PATHS = ['/404.html', '/search-index.json', '/sitemap.xml'];

// 提取页面内容的函数
function extractPageContent(html, url) {
    try {
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        // 提取标题
        const title = doc.querySelector('h1')?.textContent?.trim() || 
                     doc.querySelector('title')?.textContent?.trim() || 
                     '未命名文档';
        
        // 提取主要内容
        const mainContent = doc.querySelector('article') || 
                           doc.querySelector('main') || 
                           doc.body;
        
        let content = '';
        if (mainContent) {
            // 移除不需要的元素
            const elementsToRemove = mainContent.querySelectorAll('script, style, nav, footer, header, .sidebar, .breadcrumb, .page-nav');
            elementsToRemove.forEach(el => el.remove());
            
            // 获取文本内容
            content = mainContent.textContent
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 5000); // 限制内容长度
        }
        
        // 提取描述
        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                           content.substring(0, 200) + '...';
        
        return {
            url,
            title,
            description,
            content
        };
    } catch (error) {
        console.error(`处理页面 ${url} 时出错:`, error);
        return null;
    }
}

// 主函数
async function generateSearchIndex() {
    console.log('开始生成搜索索引...');
    
    const searchIndex = [];
    
    // 遍历public目录下的所有HTML文件
    function walkDir(dir, basePath = '') {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            const relativePath = path.join(basePath, file);
            
            if (stat.isDirectory()) {
                walkDir(filePath, relativePath);
            } else if (file.endsWith('.html')) {
                const url = '/' + relativePath.replace(/\\/g, '/');
                
                // 跳过排除的路径
                if (EXCLUDE_PATHS.includes(url)) {
                    continue;
                }
                
                try {
                    // 读取HTML文件
                    const html = fs.readFileSync(filePath, 'utf8');
                    
                    // 提取内容
                    const pageData = extractPageContent(html, url);
                    
                    if (pageData && pageData.content) {
                        searchIndex.push(pageData);
                        console.log(`已索引: ${url}`);
                    }
                } catch (error) {
                    console.error(`读取文件 ${filePath} 时出错:`, error);
                }
            }
        }
    }
    
    // 开始遍历
    walkDir(PUBLIC_DIR);
    
    // 保存索引文件
    fs.writeFileSync(
        OUTPUT_FILE,
        JSON.stringify(searchIndex, null, 2),
        'utf8'
    );
    
    console.log(`搜索索引生成完成！共索引 ${searchIndex.length} 个页面`);
    console.log(`索引文件已保存到: ${OUTPUT_FILE}`);
    
    // 生成简单的搜索页面
    generateSearchPage(searchIndex);
}

// 生成搜索页面
function generateSearchPage(index) {
    const searchPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>搜索 - OpenClaw 中文文档</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f9fafb;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        
        .logo a {
            text-decoration: none;
            color: inherit;
        }
        
        .search-box {
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        #search-input {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1.1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            outline: none;
            transition: all 0.2s;
        }
        
        #search-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .results-info {
            text-align: center;
            color: #6b7280;
            margin-bottom: 2rem;
        }
        
        .results-list {
            display: grid;
            gap: 1.5rem;
        }
        
        .result-item {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s;
        }
        
        .result-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .result-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .result-title a {
            text-decoration: none;
            color: #1f2937;
        }
        
        .result-title a:hover {
            color: #3b82f6;
        }
        
        .result-description {
            color: #6b7280;
            margin-bottom: 1rem;
        }
        
        .result-url {
            font-family: monospace;
            font-size: 0.875rem;
            color: #9ca3af;
        }
        
        .no-results {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }
        
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        
        mark {
            background: rgba(59, 130, 246, 0.2);
            color: #1f2937;
            padding: 0.1em 0.2em;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="logo">
                <a href="/">OpenClaw 中文文档</a>
            </div>
            <h1>文档搜索</h1>
        </header>
        
        <div class="search-box">
            <input type="text" id="search-input" placeholder="输入关键词搜索文档...">
        </div>
        
        <div class="results-info" id="results-info">
            输入关键词开始搜索
        </div>
        
        <div class="results-list" id="results-list">
            <!-- 搜索结果将在这里显示 -->
        </div>
        
        <footer class="footer">
            <p>© 2024 OpenClaw 中文文档 | <a href="/">返回首页</a></p>
        </footer>
    </div>
    
    <script>
        // 搜索索引数据
        const searchIndex = ${JSON.stringify(index)};
        
        // DOM 元素
        const searchInput = document.getElementById('search-input');
        const resultsInfo = document.getElementById('results-info');
        const resultsList = document.getElementById('results-list');
        
        // 搜索函数
        function performSearch(query) {
            if (!query.trim()) {
                resultsInfo.textContent = '输入关键词开始搜索';
                resultsList.innerHTML = '';
                return;
            }
            
            const terms = query.toLowerCase().split(/\\s+/).filter(term => term.length > 0);
            const results = [];
            
            // 搜索逻辑
            searchIndex.forEach(item => {
                let score = 0;
                const title = item.title.toLowerCase();
                const content = item.content.toLowerCase();
                const description = item.description.toLowerCase();
                
                terms.forEach(term => {
                    if (title.includes(term)) score += 10;
                    if (description.includes(term)) score += 5;
                    if (content.includes(term)) score += 1;
                });
                
                if (score > 0) {
                    results.push({
                        ...item,
                        score
                    });
                }
            });
            
            // 按分数排序
            results.sort((a, b) => b.score - a.score);
            
            // 显示结果
            displayResults(results, query);
        }
        
        // 显示结果
        function displayResults(results, query) {
            if (results.length === 0) {
                resultsInfo.textContent = \`没有找到 "\${query}" 的相关结果\`;
                resultsList.innerHTML = '<div class="no-results">没有找到相关文档</div>';
                return;
            }
            
            resultsInfo.textContent = \`找到 \${results.length} 个相关结果\`;
            
            const resultsHtml = results.map(result => {
                const highlightedTitle = highlightText(result.title, query);
                const highlightedDesc = highlightText(result.description, query);
                
                return \`
                    <div class="result-item">
                        <h2 class="result-title">
                            <a href="\${result.url}">\${highlightedTitle}</a>
                        </h2>
                        <p class="result-description">\${highlightedDesc}</p>
                        <div class="result-url">\${result.url}</div>
                    </div>
                \`;
            }).join('');
            
            resultsList.innerHTML = resultsHtml;
        }
        
        // 高亮文本
        function highlightText(text, query) {
            const terms = query.toLowerCase().split(/\\s+/).filter(term => term.length > 0);
            let highlighted = text;
            
            terms.forEach(term => {
                const regex = new RegExp(\`(\${term})\`, 'gi');
                highlighted = highlighted.replace(regex, '<mark>$1</mark>');
            });
            
            return highlighted;
        }
        
        // 事件监听
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
        
        // 从URL参数获取搜索词
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
            searchInput.value = searchQuery;
            performSearch(searchQuery);
        }
        
        // 聚焦搜索框
        searchInput.focus();
    </script>
</body>
</html>
    `;
    
    fs.writeFileSync(
        path.join(PUBLIC_DIR, 'search.html'),
        searchPage,
        'utf8'
    );
    
    console.log('搜索页面已生成: /search.html');
}

// 运行主函数
generateSearchIndex().catch(console.error);