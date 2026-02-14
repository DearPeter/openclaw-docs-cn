// OpenClaw 文档主题主脚本

document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // 点击外部关闭菜单
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // 语言切换
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            // 这里应该实现语言切换逻辑
            console.log('切换到语言:', lang);
            // 实际实现需要根据网站的多语言配置来处理
        });
    }
    
    // 平滑滚动到锚点
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
                
                // 更新URL
                history.pushState(null, null, href);
            }
        });
    });
    
    // 代码块复制按钮
    document.querySelectorAll('pre').forEach(pre => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="far fa-copy"></i>';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.setAttribute('title', '复制代码');
        
        // 添加按钮到代码块
        pre.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.style.padding = '5px 10px';
        copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
        copyButton.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        copyButton.style.borderRadius = '4px';
        copyButton.style.color = '#fff';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '12px';
        copyButton.style.transition = 'all 0.2s ease';
        
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        copyButton.addEventListener('click', async () => {
            const code = pre.querySelector('code').textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // 显示成功提示
                const originalHTML = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.background = '#10b981';
                copyButton.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    copyButton.innerHTML = originalHTML;
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                    copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                
                // 显示错误提示
                const originalHTML = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-times"></i>';
                copyButton.style.background = '#ef4444';
                copyButton.style.borderColor = '#ef4444';
                
                setTimeout(() => {
                    copyButton.innerHTML = originalHTML;
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                    copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }, 2000);
            }
        });
        
        pre.appendChild(copyButton);
    });
    
    // 表格响应式处理
    document.querySelectorAll('table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.style.overflowX = 'auto';
        wrapper.style.marginBottom = '1.5rem';
        
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
    
    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, imageOptions);
    
    images.forEach(img => imageObserver.observe(img));
    
    // 侧边栏滚动高亮
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = Array.from(sidebarLinks).map(link => {
        const href = link.getAttribute('href');
        return document.querySelector(href);
    }).filter(section => section !== null);
    
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sidebarLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        });
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    // 主题切换（暗色模式）
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', '切换主题');
    themeToggle.setAttribute('title', '切换主题');
    
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.background = 'var(--primary-color)';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.fontSize = '1.25rem';
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.innerHTML = document.body.classList.contains('dark-mode')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        
        // 保存主题偏好
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    // 检查保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.body.appendChild(themeToggle);
    
    // 添加暗色模式样式
    const darkModeStyles = `
        body.dark-mode {
            --text-color: #e5e7eb;
            --text-light: #9ca3af;
            --bg-color: #111827;
            --bg-light: #1f2937;
            --bg-dark: #374151;
            --border-color: #4b5563;
            --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        body.dark-mode .article,
        body.dark-mode .feature-card,
        body.dark-mode .link-card {
            background-color: var(--bg-light);
        }
        
        body.dark-mode pre {
            background-color: var(--bg-dark);
        }
        
        body.dark-mode code {
            background-color: var(--bg-dark);
        }
        
        body.dark-mode .theme-toggle {
            background: var(--secondary-color);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = darkModeStyles;
    document.head.appendChild(styleSheet);
    
    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Esc 关闭菜单和搜索
        if (e.key === 'Escape') {
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.blur();
            }
        }
    });
});