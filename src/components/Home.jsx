import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEOHead from './SEOHead';

function Home() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/articles');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  // 根据文章数据计算分类统计
  const categories = [
    { 
      name: t('articles.categories.设计思考'),
      nameKey: '设计思考',
      count: articles.filter(a => a.category === '设计思考').length 
    },
    { 
      name: t('articles.categories.技术随笔'),
      nameKey: '技术随笔',
      count: articles.filter(a => a.category === '技术随笔').length 
    },
    { 
      name: t('articles.categories.生活记录'),
      nameKey: '生活记录',
      count: articles.filter(a => a.category === '生活记录').length 
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <SEOHead
        title={t('nav.home')}
        description={t('home.subtitle')}
        url="/"
      />
      {/* 顶部欢迎区域 - Hero */}
      <motion.section
        className="relative mb-24 overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* 背景装饰纹理 */}
        <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-[0.02]">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* 装饰几何线条 */}
        <div className="absolute top-10 right-10 md:right-20 w-32 h-32 opacity-10 dark:opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-stone-400 dark:text-stone-600">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.3" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="absolute bottom-20 left-10 md:left-20 w-24 h-24 opacity-10 dark:opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-stone-400 dark:text-stone-600">
            <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.3" />
            <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="max-w-2xl relative">
          <motion.p
            className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-8 font-serif"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Personal Blog
          </motion.p>
          
          <motion.h1
            className="text-5xl md:text-7xl font-light tracking-wide mb-8 text-stone-900 dark:text-stone-100 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="block mb-2">{t('home.welcome').split('白泽的博客')[0]}</span>
            <span className="italic text-stone-700 dark:text-stone-300 relative">
              {t('home.welcome').includes('白泽的博客') ? '白泽的博客' : "Baize's Blog"}
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-stone-400 to-transparent dark:from-stone-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              />
            </span>
          </motion.h1>
          
          <motion.div
            className="w-24 h-px bg-gradient-to-r from-stone-400 via-stone-300 to-transparent dark:from-stone-600 dark:via-stone-700 mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          
          <motion.p
            className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg tracking-wide max-w-lg font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {t('home.subtitle')}
          </motion.p>
        </div>
      </motion.section>

      {/* 统计与分类 */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.nameKey}
              to={`/articles?category=${encodeURIComponent(cat.nameKey)}`}
              className="block"
            >
            <motion.div
              className="group relative cursor-pointer p-6 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 backdrop-blur-sm transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-stone-800/50"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* 图标 */}
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors duration-300">
                {cat.nameKey === '设计思考' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600 dark:text-stone-400">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                ) : cat.nameKey === '技术随笔' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600 dark:text-stone-400">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-600 dark:text-stone-400">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                )}
              </div>
              
              {/* 名称和计数 */}
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm tracking-wider text-stone-700 dark:text-stone-300 font-serif">
                  {cat.name}
                </span>
                <span className="text-xs text-stone-400 font-sans bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-full">
                  {cat.count} {t('home.articles') || '篇'}
                </span>
              </div>
              
              {/* 描述 */}
              <p className="text-xs text-stone-500 dark:text-stone-500 leading-relaxed mb-4">
                {cat.nameKey === '设计思考' ? '探索设计与用户体验的思考' :
                 cat.nameKey === '技术随笔' ? '分享技术见解与编程经验' :
                 '记录生活点滴与个人感悟'}
              </p>
              
              {/* 底部指示条 */}
              <div className="w-0 h-[2px] bg-gradient-to-r from-stone-400 to-stone-200 dark:from-stone-600 dark:to-stone-800 group-hover:w-full transition-all duration-500" />
            </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* 文章列表 */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-px bg-stone-300 dark:bg-stone-700" />
          <span className="text-xs tracking-[0.2em] text-stone-400 uppercase font-serif">{t('home.recentPosts')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-stone-400 text-sm">{t('common.noData')}</p>
            </div>
          ) : (
            articles.slice(0, 6).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link
                  to={`/article/${article.id}`}
                  className="group block h-full"
                >
                  <div className="h-full bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-stone-800/50 overflow-hidden">
                    {/* 封面图片 */}
                    {article.cover_image && (
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    {/* 内容区域 */}
                    <div className="p-6">
                      {/* 分类和日期 */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs tracking-wider text-stone-500 dark:text-stone-500 uppercase bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                        <time className="text-xs text-stone-400 tracking-wider font-sans">
                          {formatDate(article.created_at)}
                        </time>
                      </div>
                      
                      {/* 标题 */}
                      <h2 className="text-lg font-light text-stone-800 dark:text-stone-200 mb-3 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors duration-300 tracking-wide leading-snug line-clamp-2">
                        {article.title}
                      </h2>
                      
                      {/* 摘要 */}
                      <p className="text-stone-500 dark:text-stone-500 leading-relaxed text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      {/* 底部信息 */}
                      <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                        <span className="text-xs text-stone-400 font-sans">
                          {t('home.readTime', { count: article.read_time })}
                        </span>
                        <div className="flex items-center gap-1 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors duration-300">
                          <span className="text-xs tracking-wider font-serif">{t('home.readMore')}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transform group-hover:translate-x-1 transition-transform duration-300"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* 查看更多 */}
        {articles.length > 6 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link to="/articles" className="inline-flex items-center gap-3 px-8 py-3 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-500 dark:hover:border-stone-500 transition-all duration-300 tracking-wider text-sm font-serif">
              {t('home.allPosts')}
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
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </motion.div>
        )}
      </motion.section>

      {/* 引用区域 */}
      <motion.section
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center py-20 relative">
          {/* 装饰边框 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
          
          {/* 引用图标 */}
          <motion.div
            className="w-16 h-16 mx-auto mb-8 text-stone-200 dark:text-stone-800"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </motion.div>
          
          <motion.blockquote
            className="text-xl md:text-2xl font-light text-stone-700 dark:text-stone-300 leading-relaxed tracking-wide italic mb-8 px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            "{t('home.quote')}"
          </motion.blockquote>
          
          <motion.cite
            className="text-xs text-stone-400 tracking-[0.2em] uppercase not-italic font-serif"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {t('home.quoteAuthor')}
          </motion.cite>
        </div>
      </motion.section>

      {/* 页脚 */}
      <motion.footer
        className="border-t border-stone-200 dark:border-stone-800 pt-16 pb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-xs text-stone-400 tracking-wider font-serif mb-2">
              {t('footer.copyright')}
            </p>
            <p className="text-xs text-stone-400 tracking-wider">
              {t('footer.slogan')}
            </p>
          </div>
          
          {/* 社交链接 */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="group flex items-center gap-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span className="text-xs tracking-wider font-serif">GitHub</span>
            </a>
            
            <a
              href="#"
              className="group flex items-center gap-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
              <span className="text-xs tracking-wider font-serif">Twitter</span>
            </a>
            
            <a
              href="#"
              className="group flex items-center gap-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              <span className="text-xs tracking-wider font-serif">RSS</span>
            </a>
          </div>
        </div>
        
        {/* 底部装饰线 */}
        <div className="mt-12 w-8 h-px bg-stone-200 dark:bg-stone-800 mx-auto" />
      </motion.footer>
    </main>
  );
}

export default Home;
