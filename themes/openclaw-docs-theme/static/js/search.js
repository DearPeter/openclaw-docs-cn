// OpenClaw 文档搜索功能

class OpenClawSearch {
    constructor() {
        this.searchIndex = null;
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.searchResults = document.getElementById('search-results');
        this.isLoading = false;
        
        this.init();
    }
    
    async init() {
        // 加载搜索索引
        await this.loadSearchIndex();
        
        // 绑定事件
        this.bindEvents();
        
        // 检查URL中的搜索参数
        this.checkUrlSearch();
    }
    
    async loadSearchIndex() {
        try {
            // 尝试加载搜索索引文件
            const response = await fetch('/search-index.json');
            if (response.ok) {
                this.searchIndex = await response.json();
                console.log('搜索索引加载成功:', this.searchIndex.length, '个文档');
            } else {
                console.warn('搜索索引文件不存在，使用客户端生成索引');
                await this.generateClientIndex();
            }
        } catch (error) {
            console.warn('无法加载搜索索引:', error);
            await this.generateClientIndex();
        }
    }
    
    async generateClientIndex() {
        // 从页面内容生成客户端索引
        this.searchIndex = [];
        
        // 获取所有文章链接
        const articleLinks = document.querySelectorAll('article a[href^="/"]');
        const urls = new Set();
        
        articleLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.includes('://')) {
                urls.add(href);
            }
        });
        
        // 为每个URL创建索引条目
        for (const url of Array.from(urls).slice(0, 50)) { // 限制数量
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const html = await response.text();
                    const doc = this.parseHtmlToDoc(html, url);
                    if (doc) {
                        this.searchIndex.push(doc);
                    }
                }
            } catch (error) {
                console.warn('无法索引文档:', url, error);
            }
        }
        
        console.log('客户端索引生成完成:', this.searchIndex.length, '个文档');
    }
    
    parseHtmlToDoc(html, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const title = doc.querySelector('h1')?.textContent || 
                     doc.querySelector('title')?.textContent || 
                     '未命名文档';
        
        const content = doc.querySelector('article')?.textContent || 
                       doc.querySelector('main')?.textContent || 
                       doc.body.textContent;
        
        if (!content) return null;
        
        return {
            url: url,
            title: title.trim(),
            content: content.trim().substring(0, 1000), // 限制内容长度
            excerpt: content.trim().substring(0, 200) + '...'
        };
    }
    
    bindEvents() {
        // 输入搜索
        this.searchInput.addEventListener('input', (e) => {
            this.debouncedSearch(e.target.value);
        });
        
        // 按钮搜索
        this.searchButton.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });
        
        // 回车搜索
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(this.searchInput.value);
            }
        });
        
        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!this.searchResults.contains(e.target) && 
                !this.searchInput.contains(e.target) && 
                !this.searchButton.contains(e.target)) {
                this.hideResults();
            }
        });
        
        // 聚焦显示最近搜索
        this.searchInput.addEventListener('focus', () => {
            if (!this.searchInput.value) {
                this.showRecentSearches();
            }
        });
    }
    
    debouncedSearch(query) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    async performSearch(query) {
        if (!query.trim()) {
            this.showRecentSearches();
            return;
        }
        
        if (!this.searchIndex || this.searchIndex.length === 0) {
            this.showMessage('搜索索引加载中...', 'info');
            return;
        }
        
        this.isLoading = true;
        this.showLoading();
        
        // 简单搜索算法
        const results = this.simpleSearch(query);
        
        this.isLoading = false;
        this.displayResults(results, query);
        
        // 保存搜索记录
        this.saveSearchHistory(query);
    }
    
    simpleSearch(query) {
        const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        
        return this.searchIndex
            .map(doc => {
                let score = 0;
                const title = doc.title.toLowerCase();
                const content = doc.content.toLowerCase();
                
                // 计算匹配分数
                searchTerms.forEach(term => {
                    // 标题匹配权重更高
                    if (title.includes(term)) score += 10;
                    if (content.includes(term)) score += 1;
                    
                    // 完全匹配额外加分
                    if (title === term) score += 5;
                });
                
                return { ...doc, score };
            })
            .filter(doc => doc.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // 限制结果数量
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.showMessage(`没有找到 "${query}" 的相关结果`, 'empty');
            return;
        }
        
        const resultsHtml = `
            <div class="search-results-header">
                <h3>搜索结果 (${results.length})</h3>
                <button class="close-results" aria-label="关闭搜索结果">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results-list">
                ${results.map(result => `
                    <a href="${result.url}" class="search-result-item">
                        <h4 class="result-title">${this.highlightText(result.title, query)}</h4>
                        <p class="result-excerpt">${this.highlightText(result.excerpt, query)}</p>
                        <div class="result-meta">
                            <span class="result-url">${result.url}</span>
                            <span class="result-score">相关度: ${result.score}</span>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
        
        this.searchResults.innerHTML = resultsHtml;
        this.searchResults.classList.add('active');
        
        // 绑定关闭按钮事件
        const closeButton = this.searchResults.querySelector('.close-results');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideResults();
            });
        }
    }
    
    highlightText(text, query) {
        if (!query) return text;
        
        const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        let highlighted = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        });
        
        return highlighted;
    }
    
    showRecentSearches() {
        const history = this.getSearchHistory();
        
        if (history.length === 0) {
            this.hideResults();
            return;
        }
        
        const historyHtml = `
            <div class="search-results-header">
                <h3>最近搜索</h3>
                <button class="clear-history" aria-label="清除搜索历史">
                    清除
                </button>
            </div>
            <div class="search-history-list">
                ${history.map(item => `
                    <button class="history-item" data-query="${item.query}">
                        <i class="fas fa-history"></i>
                        <span class="history-query">${item.query}</span>
                        <span class="history-date">${this.formatDate(item.timestamp)}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        this.searchResults.innerHTML = historyHtml;
        this.searchResults.classList.add('active');
        
        // 绑定历史项点击事件
        this.searchResults.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const query = e.currentTarget.dataset.query;
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });
        
        // 绑定清除历史按钮
        const clearButton = this.searchResults.querySelector('.clear-history');
        if (clearButton) {
            clearButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearSearchHistory();
                this.hideResults();
            });
        }
    }
    
    showLoading() {
        this.searchResults.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>正在搜索...</p>
            </div>
        `;
        this.searchResults.classList.add('active');
    }
    
    showMessage(message, type = 'info') {
        this.searchResults.innerHTML = `
            <div class="search-message search-message-${type}">
                <i class="fas fa-${type === 'empty' ? 'search' : 'info-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        this.searchResults.classList.add('active');
    }
    
    hideResults() {
        this.searchResults.classList.remove('active');
    }
    
    // 搜索历史管理
    saveSearchHistory(query) {
        const history = this.getSearchHistory();
        const newItem = {
            query: query,
            timestamp: Date.now()
        };
        
        // 移除重复项
        const filteredHistory = history.filter(item => item.query !== query);
        
        // 添加新项到开头
        filteredHistory.unshift(newItem);
        
        // 限制历史记录数量
        const limitedHistory = filteredHistory.slice(0, 10);
        
        localStorage.setItem('openclaw-search-history', JSON.stringify(limitedHistory));
    }
    
    getSearchHistory() {
        try {
            const history = localStorage.getItem('openclaw-search-history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.warn('无法读取搜索历史:', error);
            return [];
        }
    }
    
    clearSearchHistory() {
        localStorage.removeItem('openclaw-search-history');
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    checkUrlSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        
        if (searchQuery) {
            this.searchInput.value = searchQuery;
            this.performSearch(searchQuery);
        }
    }
}

// 初始化搜索
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-input')) {
        new OpenClawSearch();
    }
});