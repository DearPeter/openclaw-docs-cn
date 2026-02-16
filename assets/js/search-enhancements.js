/**
 * OpenClaw 文档搜索功能增强
 * Phase 3 任务3：搜索功能增强
 */

(function() {
  'use strict';
  
  // 等待DOM加载
  document.addEventListener('DOMContentLoaded', function() {
    // 搜索输入和结果容器
    const searchInput = document.querySelector('#book-search-input');
    const searchResults = document.querySelector('#book-search-results');
    const searchContainer = document.querySelector('.book-search');
    
    if (!searchInput || !searchResults) {
      return; // 搜索功能未启用
    }
    
    // 创建搜索建议容器
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--oc-gray-0);
      border: 1px solid var(--oc-gray-2);
      border-radius: var(--oc-border-radius);
      box-shadow: var(--oc-shadow-lg);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
      margin-top: 4px;
    `;
    searchContainer.appendChild(suggestionsContainer);
    
    // 添加高亮样式
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
      .search-highlight {
        background-color: var(--oc-highlight);
        color: var(--oc-gray-9);
        padding: 0.1em 0.2em;
        border-radius: var(--oc-border-radius-sm);
        font-weight: 600;
      }
      
      .search-suggestions {
        font-family: inherit;
      }
      
      .search-suggestion-item {
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid var(--oc-gray-1);
        transition: background-color 0.15s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .search-suggestion-item:hover,
      .search-suggestion-item.selected {
        background-color: var(--oc-gray-1);
      }
      
      .search-suggestion-item .suggestion-category {
        font-size: 0.75rem;
        color: var(--oc-gray-6);
        background: var(--oc-gray-2);
        padding: 0.2em 0.5em;
        border-radius: var(--oc-border-radius-sm);
      }
      
      .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--oc-gray-2);
      }
      
      .search-results-count {
        font-size: 0.875rem;
        color: var(--oc-gray-6);
      }
      
      .search-result-item {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid var(--oc-gray-2);
        border-radius: var(--oc-border-radius);
        transition: box-shadow 0.2s ease;
      }
      
      .search-result-item:hover {
        box-shadow: var(--oc-shadow);
      }
      
      .search-result-title {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
      }
      
      .search-result-title a {
        color: var(--oc-primary);
        text-decoration: none;
      }
      
      .search-result-title a:hover {
        text-decoration: underline;
      }
      
      .search-result-preview {
        color: var(--oc-gray-7);
        font-size: 0.875rem;
        line-height: 1.5;
        margin: 0.5rem 0;
      }
      
      .search-result-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: var(--oc-gray-5);
        margin-top: 0.5rem;
      }
      
      .search-result-category {
        background: var(--oc-gray-1);
        padding: 0.2em 0.5em;
        border-radius: var(--oc-border-radius-sm);
      }
      
      .search-no-results {
        text-align: center;
        padding: 2rem;
        color: var(--oc-gray-6);
      }
      
      .search-no-results h3 {
        margin-bottom: 0.5rem;
        color: var(--oc-gray-7);
      }
      
      .search-suggestions-header {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        color: var(--oc-gray-6);
        border-bottom: 1px solid var(--oc-gray-2);
        background: var(--oc-gray-1);
      }
      
      .search-suggestions-footer {
        padding: 0.75rem 1rem;
        font-size: 0.75rem;
        color: var(--oc-gray-5);
        border-top: 1px solid var(--oc-gray-2);
        background: var(--oc-gray-1);
        text-align: center;
      }
    `;
    document.head.appendChild(highlightStyle);
    
    // 搜索状态
    let searchIndex = null;
    let allPages = [];
    let currentSuggestions = [];
    let selectedSuggestionIndex = -1;
    
    // 初始化搜索索引
    function initSearchIndex() {
      if (window.bookSearchIndex && window.bookSearchIndex._docs) {
        searchIndex = window.bookSearchIndex;
        allPages = searchIndex._docs;
        console.log('搜索索引已加载，共', allPages.length, '个页面');
      }
    }
    
    // 轮询直到索引加载
    const checkIndexInterval = setInterval(() => {
      if (window.bookSearchIndex) {
        clearInterval(checkIndexInterval);
        initSearchIndex();
      }
    }, 100);
    
    // 设置超时停止检查
    setTimeout(() => clearInterval(checkIndexInterval), 5000);
    
    // 输入事件处理
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length === 0) {
        hideSuggestions();
        return;
      }
      
      // 防抖
      searchTimeout = setTimeout(() => {
        if (query.length < 2) {
          showShortQuerySuggestions(query);
        } else {
          showSearchSuggestions(query);
        }
      }, 150);
    });
    
    // 键盘导航
    searchInput.addEventListener('keydown', function(e) {
      if (!suggestionsContainer.style.display || suggestionsContainer.style.display === 'none') {
        return;
      }
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectNextSuggestion();
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectPreviousSuggestion();
          break;
        case 'Enter':
          if (selectedSuggestionIndex >= 0) {
            e.preventDefault();
            selectSuggestion(currentSuggestions[selectedSuggestionIndex]);
          }
          break;
        case 'Escape':
          hideSuggestions();
          break;
      }
    });
    
    // 点击外部隐藏建议
    document.addEventListener('click', function(e) {
      if (!searchContainer.contains(e.target)) {
        hideSuggestions();
      }
    });
    
    // 显示搜索建议
    function showSearchSuggestions(query) {
      if (!searchIndex) return;
      
      // 执行搜索
      const searchHits = searchIndex.search(query).slice(0, 5);
      currentSuggestions = searchHits.map(hit => hit.item);
      
      if (currentSuggestions.length === 0) {
        // 如果没有匹配，显示热门搜索
        showPopularSuggestions(query);
        return;
      }
      
      // 生成建议HTML
      let html = '<div class="search-suggestions-header">搜索建议</div>';
      
      currentSuggestions.forEach((page, index) => {
        const title = highlightText(page.title, query);
        const preview = getPreview(page.content, query, 60);
        const category = page.category || getCategoryFromPath(page.href);
        
        html += `
          <div class="search-suggestion-item ${index === 0 ? 'selected' : ''}" 
               data-index="${index}" 
               data-href="${page.href}">
            <div>
              <div style="font-weight: 500; margin-bottom: 0.25rem;">${title}</div>
              <div style="font-size: 0.875rem; color: var(--oc-gray-6);">${preview}</div>
            </div>
            ${category ? `<span class="suggestion-category">${category}</span>` : ''}
          </div>
        `;
      });
      
      html += '<div class="search-suggestions-footer">使用 ↑ ↓ 选择，Enter 确认</div>';
      
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.style.display = 'block';
      selectedSuggestionIndex = 0;
      
      // 添加点击事件
      suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          selectSuggestion(currentSuggestions[index]);
        });
        
        item.addEventListener('mouseenter', function() {
          const index = parseInt(this.dataset.index);
          selectSuggestionByIndex(index);
        });
      });
    }
    
    // 显示短查询建议
    function showShortQuerySuggestions(query) {
      if (!allPages || allPages.length === 0) return;
      
      // 基于热门页面或最近访问的建议
      const popularPages = allPages
        .filter(page => page.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      
      currentSuggestions = popularPages;
      
      let html = '<div class="search-suggestions-header">热门页面</div>';
      
      if (popularPages.length === 0) {
        html += '<div class="search-suggestion-item">继续输入以搜索...</div>';
      } else {
        popularPages.forEach((page, index) => {
          const category = page.category || getCategoryFromPath(page.href);
          
          html += `
            <div class="search-suggestion-item" data-index="${index}" data-href="${page.href}">
              <div>
                <div style="font-weight: 500;">${page.title}</div>
              </div>
              ${category ? `<span class="suggestion-category">${category}</span>` : ''}
            </div>
          `;
        });
      }
      
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.style.display = 'block';
      selectedSuggestionIndex = -1;
      
      suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          selectSuggestion(currentSuggestions[index]);
        });
      });
    }
    
    // 显示热门建议
    function showPopularSuggestions(query) {
      // 生成一些通用建议
      const suggestions = [
        { title: 'OpenClaw 入门指南', href: '/zh/getting-started/', category: '指南' },
        { title: '安装 OpenClaw', href: '/zh/installation/', category: '安装' },
        { title: '配置说明', href: '/zh/configuration/', category: '配置' },
        { title: '命令行工具', href: '/zh/cli/', category: 'CLI' },
        { title: 'API 参考', href: '/zh/api/', category: 'API' }
      ];
      
      currentSuggestions = suggestions;
      
      let html = '<div class="search-suggestions-header">热门搜索</div>';
      
      suggestions.forEach((page, index) => {
        html += `
          <div class="search-suggestion-item" data-index="${index}" data-href="${page.href}">
            <div>
              <div style="font-weight: 500;">${page.title}</div>
            </div>
            <span class="suggestion-category">${page.category}</span>
          </div>
        `;
      });
      
      html += '<div class="search-suggestions-footer">尝试不同的关键词</div>';
      
      suggestionsContainer.innerHTML = html;
      suggestionsContainer.style.display = 'block';
      selectedSuggestionIndex = -1;
      
      suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          const suggestion = currentSuggestions[index];
          window.location.href = suggestion.href;
        });
      });
    }
    
    // 选择下一个建议
    function selectNextSuggestion() {
      if (currentSuggestions.length === 0) return;
      
      selectedSuggestionIndex = (selectedSuggestionIndex + 1) % currentSuggestions.length;
      updateSelectedSuggestion();
    }
    
    // 选择上一个建议
    function selectPreviousSuggestion() {
      if (currentSuggestions.length === 0) return;
      
      selectedSuggestionIndex = selectedSuggestionIndex <= 0 
        ? currentSuggestions.length - 1 
        : selectedSuggestionIndex - 1;
      updateSelectedSuggestion();
    }
    
    // 通过索引选择建议
    function selectSuggestionByIndex(index) {
      if (index < 0 || index >= currentSuggestions.length) return;
      
      selectedSuggestionIndex = index;
      updateSelectedSuggestion();
    }
    
    // 更新选中的建议
    function updateSelectedSuggestion() {
      suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }
    
    // 选择建议
    function selectSuggestion(page) {
      if (!page || !page.href) return;
      
      window.location.href = page.href;
    }
    
    // 隐藏建议
    function hideSuggestions() {
      suggestionsContainer.style.display = 'none';
      selectedSuggestionIndex = -1;
    }
    
    // 高亮文本
    function highlightText(text, query) {
      if (!query || query.length < 2) return escapeHtml(text);
      
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // 获取预览文本
    function getPreview(content, query, maxLength) {
      if (!content) return '';
      
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const text = escapeHtml(content.replace(/<[^>]*>/g, ' '));
      
      // 查找查询词出现的位置
      const match = regex.exec(text);
      if (match) {
        const index = match.index;
        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + maxLength);
        let preview = text.substring(start, end);
        
        if (start > 0) preview = '...' + preview;
        if (end < text.length) preview = preview + '...';
        
        return preview.replace(regex, '<span class="search-highlight">$1</span>');
      }
      
      // 如果没有匹配，返回开头部分
      return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
    }
    
    // 从路径获取类别
    function getCategoryFromPath(path) {
      if (!path) return '';
      
      const match = path.match(/\/([^\/]+)\//);
      if (match) {
        const dir = match[1];
        const categories = {
          'getting-started': '入门',
          'installation': '安装',
          'configuration': '配置',
          'cli': '命令行',
          'api': 'API',
          'guides': '指南',
          'reference': '参考',
          'tutorials': '教程'
        };
        
        return categories[dir] || dir;
      }
      
      return '';
    }
    
    // 转义正则表达式
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 转义HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // 增强搜索结果（覆盖默认的搜索结果渲染）
    function enhanceSearchResults() {
      // 监听搜索结果更新
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.target === searchResults) {
            updateSearchResultsUI();
          }
        });
      });
      
      observer.observe(searchResults, { childList: true });
    }
    
    // 更新搜索结果UI
    function updateSearchResultsUI() {
      const query = searchInput.value.trim();
      if (!query) return;
      
      const items = searchResults.querySelectorAll('li');
      if (items.length === 0) {
        // 显示无结果消息
        searchResults.innerHTML = `
          <div class="search-no-results">
            <h3>未找到匹配的结果</h3>
            <p>尝试使用不同的关键词或查看以下建议：</p>
            <ul style="text-align: left; display: inline-block; margin-top: 1rem;">
              <li>检查拼写错误</li>
              <li>使用更通用的词汇</li>
              <li>尝试英文关键词</li>
              <li>浏览左侧菜单导航</li>
            </ul>
          </div>
        `;
        return;
      }
      
      // 添加结果计数
      const resultsHeader = document.createElement('div');
      resultsHeader.className = 'search-results-header';
      resultsHeader.innerHTML = `
        <h3 style="margin: 0;">搜索结果</h3>
        <div class="search-results-count">共 ${items.length} 个结果</div>
      `;
      
      // 将每个结果项增强为卡片
      items.forEach(item => {
        const link = item.querySelector('a');
        const small = item.querySelector('small');
        
        if (!link) return;
        
        const title = link.textContent;
        const href = link.href;
        const category = small ? small.textContent : getCategoryFromPath(href);
        
        // 创建增强的结果项
        const enhancedItem = document.createElement('div');
        enhancedItem.className = 'search-result-item';
        enhancedItem.innerHTML = `
          <h4 class="search-result-title">
            <a href="${href}">${highlightText(title, query)}</a>
          </h4>
          ${category ? `<div class="search-result-meta"><span class="search-result-category">${category}</span></div>` : ''}
        `;
        
        // 替换原项目
        item.parentNode.replaceChild(enhancedItem, item);
      });
      
      // 在结果列表前插入标题
      searchResults.insertBefore(resultsHeader, searchResults.firstChild);
    }
    
    // 初始化增强功能
    enhanceSearchResults();
    
    console.log('OpenClaw 搜索增强功能已加载');
  });
})();