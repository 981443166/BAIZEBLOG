import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from './SEOHead';

function Articles() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('category') || 'all');
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
    const locale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  // 默认图片
  const defaultImage = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=300&fit=crop';

  const categoryKeys = [
    { key: 'all', dbValue: 'all' },
    { key: '设计思考', dbValue: '设计思考' },
    { key: '技术随笔', dbValue: '技术随笔' },
    { key: '生活记录', dbValue: '生活记录' },
  ];

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(a => a.category === filter);

  return (
    <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <SEOHead
        title={t('articles.title')}
        description={t('home.subtitle')}
        url="/articles"
      />
      {/* 页面头部 */}
      <header className="mb-16 animate-fade-in-up">
        <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-6 font-serif">
          {t('articles.allArticles')}
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-stone-900 dark:text-stone-100 leading-tight">
          {t('articles.title')}
        </h1>
        <div className="w-16 h-px bg-stone-300 dark:bg-stone-700 mb-8" />
        <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg tracking-wide max-w-xl font-light">
          {t('home.subtitle')}
        </p>
      </header>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up delay-100">
        {categoryKeys.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.dbValue)}
            className={`px-5 py-2 text-sm tracking-wider transition-all duration-300 border ${
              filter === cat.dbValue
                ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-200 dark:text-stone-900 dark:border-stone-200'
                : 'text-stone-500 border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
            }`}
          >
            {t(`articles.categories.${cat.key === 'all' ? 'all' : cat.key}`)}
          </button>
        ))}
      </div>

      {/* 文章网格 - 便当盒布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          </div>
        ) : (
        filteredArticles.map((article, index) => (
          <Link
            to={`/article/${article.id}`}
            key={article.id}
            className="group block bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* 图片区域 */}
            <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
              <img
                src={article.cover_image || defaultImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {/* 元信息 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs tracking-wider text-stone-500 dark:text-stone-500 uppercase">
                  {t(`articles.categories.${article.category}`)}
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                <span className="text-xs text-stone-400 font-sans">{t('home.readTime', { count: article.read_time })}</span>
              </div>

              {/* 标题 */}
              <h2 className="text-lg font-light text-stone-800 dark:text-stone-200 mb-3 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors duration-300 tracking-wide leading-snug line-clamp-2">
                {article.title}
              </h2>

              {/* 摘要 */}
              <p className="text-sm text-stone-500 dark:text-stone-500 leading-relaxed line-clamp-2 mb-4">
                {article.excerpt}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <time className="text-xs text-stone-400 tracking-wider font-sans">
                  {formatDate(article.created_at)}
                </time>
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
          </Link>
        )))}
      </div>

      {/* 空状态 */}
      {filteredArticles.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-stone-400 tracking-wider font-serif">{t('articles.noResults')}</p>
        </div>
      )}

      {/* 页脚 */}
      <footer className="border-t border-stone-200 dark:border-stone-800 mt-20 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-stone-400 tracking-wider font-serif mb-1">
              {t('footer.copyright')}
            </p>
            <p className="text-xs text-stone-400 tracking-wider">
              {t('footer.slogan')}
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://github.com/981443166" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif">
              GitHub
            </a>
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif">
              Twitter
            </a>
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif">
              RSS
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Articles;
