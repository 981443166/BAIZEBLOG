import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './Login';

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [articles, setArticles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const searchRef = useRef(null);

  // 切换语言
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18n-lang', newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取文章数据
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/articles');
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('获取文章失败:', error);
      }
    };
    fetchArticles();
  }, []);

  // 实时搜索（带防抖）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      const query = searchQuery.toLowerCase();
      const results = articles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        (article.category && article.category.toLowerCase().includes(query)) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(query))
      );
      setSearchResults(results);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, articles]);

  // 处理搜索项点击
  const handleResultClick = (articleId) => {
    navigate(`/article/${articleId}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // 切换暗黑模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 初始化暗黑模式 - 在组件挂载时执行
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // 使用 requestAnimationFrame 避免同步 setState 警告
    requestAnimationFrame(() => {
      if (isDark) {
        document.documentElement.classList.add('dark');
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setDarkMode(false);
      }
    });
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-stone-200/60 shadow-sm dark:bg-stone-900/90 dark:border-stone-700/60' 
          : 'bg-stone-50/80 dark:bg-stone-950/80'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl tracking-[0.15em] text-stone-800 hover:text-stone-600 dark:text-stone-200 dark:hover:text-stone-400 transition-colors duration-300 select-none font-serif"
        >
          白泽的BLOG
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="relative text-sm tracking-widest text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 uppercase group"
          >
            {t('nav.home')}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-800 dark:bg-stone-200 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            to="/articles"
            className="relative text-sm tracking-widest text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 uppercase group"
          >
            {t('nav.articles')}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-800 dark:bg-stone-200 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            to="/about"
            className="relative text-sm tracking-widest text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 uppercase group"
          >
            {t('nav.about')}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-800 dark:bg-stone-200 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* 语言切换按钮 */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center w-9 h-9 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 dark:hover:text-stone-300 transition-all duration-300 text-xs font-medium"
            aria-label={t('nav.language')}
          >
            {i18n.language === 'zh' ? 'EN' : '中'}
          </button>

          {/* 暗黑模式切换按钮 */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 dark:hover:text-stone-300 transition-all duration-300"
            aria-label={darkMode ? t('nav.lightMode') : t('nav.darkMode')}
          >
            {darkMode ? (
              // 太阳图标 - 亮色模式
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // 月亮图标 - 暗黑模式
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* 登录模块 */}
          <Login />

          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
                searchOpen 
                  ? 'text-stone-700 bg-stone-100 dark:text-stone-300 dark:bg-stone-800' 
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-300 dark:hover:bg-stone-800'
              }`}
              aria-label={t('nav.search')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 animate-fade-in-up">
                <div className="bg-white rounded-lg shadow-xl border border-stone-200 overflow-hidden dark:bg-stone-800 dark:border-stone-700">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 dark:border-stone-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-stone-400 shrink-0"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') setSearchResults([]);
                      }}

                      placeholder={t('nav.search')}
                      className="w-full text-sm text-stone-700 placeholder-stone-300 bg-transparent outline-none tracking-wide font-sans dark:text-stone-200 dark:placeholder-stone-500"
                      autoFocus
                    />
                  </div>
                  {/* 搜索结果 */}
                  {searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => handleResultClick(article.id)}
                          className="px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-b-0 transition-colors duration-200 dark:hover:bg-stone-700 dark:border-stone-700"
                        >
                          <p className="text-sm text-stone-800 font-medium mb-1 dark:text-stone-200">{article.title}</p>
                          <div className="flex items-center gap-2 text-xs text-stone-400">
                            <span>{article.category}</span>
                            <span>·</span>
                            <span>{article.created_at ? new Date(article.created_at).toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US') : ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 搜索提示 */}
                  {searchResults.length === 0 && searchQuery.trim() && (
                    <div className="px-4 py-3 bg-stone-50/50 dark:bg-stone-700/50">
                      <p className="text-xs text-stone-400 tracking-wider font-serif">{t('articles.noResults')}</p>
                    </div>
                  )}
                  
                  {searchResults.length === 0 && !searchQuery.trim() && (
                    <div className="px-4 py-3 bg-stone-50/50 dark:bg-stone-700/50">
                      <p className="text-xs text-stone-400 tracking-wider font-serif">Enter {t('nav.search')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
