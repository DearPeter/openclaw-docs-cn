/**
 * OpenClaw 中文文档 - 主要交互功能
 * Phase 3 视觉设计与功能增强
 */

document.addEventListener('DOMContentLoaded', function() {
  // ===========================================================================
  // 1. 代码复制按钮
  // ===========================================================================
  function initCopyButtons() {
    // 为所有代码块添加复制按钮
    // 选择所有 pre 元素，包括那些在 .highlight 中的
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
      // 检查是否已经添加了复制按钮
      if (pre.querySelector('.copy-code-button') || pre.parentElement.classList.contains('code-block-wrapper')) {
        return;
      }
      
      // 检查 pre 是否在 .highlight 容器内
      const highlightContainer = pre.closest('.highlight');
      const targetContainer = highlightContainer || pre;
      
      // 创建按钮
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>';
      button.setAttribute('aria-label', '复制代码');
      button.setAttribute('title', '复制代码到剪贴板');
      
      // 创建包装器
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      
      // 如果 pre 在 .highlight 中，包装整个 .highlight 容器
      if (highlightContainer) {
        highlightContainer.parentNode.insertBefore(wrapper, highlightContainer);
        wrapper.appendChild(highlightContainer);
      } else {
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }
      
      wrapper.appendChild(button);
      
      // 添加点击事件
      button.addEventListener('click', async () => {
        // 获取代码文本
        const codeElement = pre.querySelector('code');
        const code = codeElement ? codeElement.innerText : pre.innerText;
        
        try {
          await navigator.clipboard.writeText(code);
          
          // 视觉反馈
          const originalText = button.innerHTML;
          button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';
          button.classList.add('copied');
          button.setAttribute('aria-label', '已复制');
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
            button.setAttribute('aria-label', '复制代码');
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          const originalText = button.innerHTML;
          button.innerHTML = '复制失败';
          button.style.background = 'var(--oc-danger)';
          button.setAttribute('aria-label', '复制失败');
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.setAttribute('aria-label', '复制代码');
          }, 2000);
        }
      });
    });
  }
  
  // ===========================================================================
  // 2. 主题切换功能（由注入的脚本处理）
  // ===========================================================================
  // 主题切换功能已在 layouts/partials/docs/inject/body.html 中实现
  // 此处无需重复实现
  
  // ===========================================================================
  // 3. 阅读进度条
  // ===========================================================================
  function initReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    document.body.prepend(progressBar);
    
    const progress = progressBar.querySelector('.progress-bar');
    
    // 更新进度条
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      
      const percentage = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
      progress.style.width = percentage + '%';
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress(); // 初始更新
  }
  
  // ===========================================================================
  // 4. 字体大小调整
  // ===========================================================================
  function initFontSizeControls() {
    const controls = document.querySelector('.font-size-controls');
    if (!controls) return;
    
    const buttons = controls.querySelectorAll('button');
    const fontSizeKey = 'font-size';
    const defaultSize = 100; // 百分比
    
    // 获取保存的字体大小
    let currentSize = parseInt(localStorage.getItem(fontSizeKey)) || defaultSize;
    document.documentElement.style.fontSize = currentSize + '%';
    
    // 激活当前按钮
    buttons.forEach(btn => {
      const size = parseInt(btn.dataset.size);
      if (size === currentSize) {
        btn.classList.add('active');
      }
      
      btn.addEventListener('click', () => {
        currentSize = size;
        document.documentElement.style.fontSize = currentSize + '%';
        localStorage.setItem(fontSizeKey, currentSize);
        
        // 更新按钮状态
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  
  // ===========================================================================
  // 5. 移动端菜单优化
  // ===========================================================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (!menuToggle) return;
    
    const menu = document.querySelector('.book-menu');
    if (!menu) return;
    
    menuToggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }
  
  // ===========================================================================
  // 6. 表格响应式处理
  // ===========================================================================
  function initResponsiveTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      // 为宽表格添加滚动容器
      if (table.scrollWidth > table.clientWidth) {
        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.margin = 'var(--oc-spacing) 0';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }
  
  // ===========================================================================
  // 7. 平滑滚动
  // ===========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // ===========================================================================
  // 8. 搜索优化
  // ===========================================================================
  function initSearch() {
    const searchInput = document.querySelector('.book-search input');
    if (!searchInput) return;
    
    // 添加搜索建议占位符
    searchInput.setAttribute('placeholder', '搜索文档... (支持中英文)');
    
    // 添加搜索快捷键提示
    const searchShortcut = document.createElement('div');
    searchShortcut.className = 'search-shortcut';
    searchShortcut.innerHTML = '按 <kbd>/</kbd> 键快速搜索';
    searchShortcut.style.cssText = 'font-size: 0.75rem; color: var(--oc-gray-5); margin-top: 0.25rem;';
    searchInput.parentNode.appendChild(searchShortcut);
    
    // 快捷键监听
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }
  
  // ===========================================================================
  // 9. 图片懒加载
  // ===========================================================================
  function initLazyLoad() {
    const images = document.querySelectorAll('img:not([loading])');
    
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }
  
  // ===========================================================================
  // 10. 面包屑导航生成
  // ===========================================================================
  function initBreadcrumbs() {
    // 检查是否已有面包屑
    if (document.querySelector('.breadcrumb')) return;
    
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/zh/') return;
    
    // 简单实现：基于URL生成面包屑
    const paths = currentPath.split('/').filter(p => p);
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', '面包屑导航');
    
    let html = '<li class="breadcrumb-item"><a href="/">首页</a></li>';
    
    let accumulatedPath = '';
    paths.forEach((path, index) => {
      accumulatedPath += '/' + path;
      const isLast = index === paths.length - 1;
      
      if (isLast) {
        // 获取当前页面标题
        const title = document.title.replace(' - OpenClaw 中文文档', '');
        html += `<li class="breadcrumb-item active" aria-current="page">${title}</li>`;
      } else {
        // 解码路径显示
        const displayName = decodeURIComponent(path).replace(/-/g, ' ');
        html += `<li class="breadcrumb-item"><a href="${accumulatedPath}">${displayName}</a></li>`;
      }
    });
    
    breadcrumb.innerHTML = html;
    
    // 插入到页面主要内容之前
    const mainContent = document.querySelector('.book-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.insertBefore(breadcrumb, mainContent.firstChild);
    }
  }
  
  // ===========================================================================
  // 初始化所有功能
  // ===========================================================================
  initCopyButtons();
  // initThemeToggle(); // 由注入脚本处理
  initReadingProgress();
  // initFontSizeControls(); // 由注入脚本处理
  initMobileMenu();
  initResponsiveTables();
  initSmoothScroll();
  initSearch();
  initLazyLoad();
  initBreadcrumbs();
  
  console.log('OpenClaw 文档交互功能已加载');
});