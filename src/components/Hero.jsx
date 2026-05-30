import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CommentSection from './CommentSection';
import SEOHead from './SEOHead';

function Hero() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 监听暗黑模式变化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/articles/${id}`);
      const data = await response.json();
      setArticle(data.article);
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

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center py-40">
          <p className="text-stone-400">{t('article.notFound')}</p>
          <Link to="/" className="text-sm text-stone-600 hover:text-stone-800 mt-4 inline-block">
            {t('article.backToHome')}
          </Link>
        </div>
      </main>
    );
  }

  // JSON-LD 结构化数据
  const jsonLd = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: article.author_name || '白泽',
    },
    publisher: {
      '@type': 'Organization',
      name: '白泽博客',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://baizeblog.com/article/${article.id}`,
    },
  } : null;

  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      {article && (
        <SEOHead
          title={article.title}
          description={article.excerpt || article.title}
          keywords={article.tags ? article.tags.join(',') : ''}
          image={article.cover_image}
          url={`/article/${article.id}`}
          type="article"
          author={article.author_name || '白泽'}
          publishedTime={article.created_at}
          modifiedTime={article.updated_at || article.created_at}
          article={true}
          jsonLd={jsonLd}
        />
      )}
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[60]">
        <div
          className="h-full bg-stone-600 dark:bg-stone-400 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 文章头部 */}
      <header className="mb-16 animate-fade-in-up">
        {/* 分类与元信息 */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs tracking-[0.2em] text-stone-500 dark:text-stone-500 uppercase font-serif">
            {article.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
          <time className="text-xs text-stone-400 tracking-wider font-sans">
            {formatDate(article.created_at)}
          </time>
          <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="text-xs text-stone-400 tracking-wider font-sans">
            {t('article.readTime', { count: article.read_time })}
          </span>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-stone-900 dark:text-stone-100 leading-[1.2]">
          {article.title}
        </h1>

        {/* 作者 */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
            <span className="text-sm text-stone-600 dark:text-stone-400 font-serif">
              {article.author_name ? article.author_name[0] : '白'}
            </span>
          </div>
          <div>
            <p className="text-sm text-stone-700 dark:text-stone-300 font-serif">
              {article.author_name || '白泽'}
            </p>
            <p className="text-xs text-stone-400 tracking-wider">{t('article.author')}</p>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-full h-px bg-stone-200 dark:bg-stone-800 mt-10" />
      </header>

      {/* 文章内容 */}
      <article className="prose-elegant animate-fade-in-up delay-100">
        <div className="text-stone-600 dark:text-stone-400 leading-[1.8] text-base tracking-wide">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={isDark ? vscDarkPlus : vs}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg my-4 text-sm"
                    showLineNumbers
                    lineNumberStyle={{ 
                      fontSize: '0.75rem',
                      minWidth: '2.5em',
                      paddingRight: '1em'
                    }}
                    customStyle={{
                      border: `1px solid ${isDark ? '#292524' : '#e7e5e4'}`,
                      borderRadius: '12px',
                      padding: '1.5em',
                      margin: '1.5em 0',
                      fontSize: '0.875rem',
                      lineHeight: '1.7'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-sm font-mono text-stone-700 dark:text-stone-300" {...props}>
                    {children}
                  </code>
                );
              },
              pre({ children }) {
                return <>{children}</>;
              }
            }}
          >
            {article.content || t('article.noContent')}
          </ReactMarkdown>
        </div>
      </article>

      {/* 标签 */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-12 mb-16 animate-fade-in-up delay-200">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-xs tracking-wider text-stone-500 dark:text-stone-500 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors duration-300 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 评论区 */}
      <div className="animate-fade-in-up delay-250">
        <CommentSection articleId={article.id} />
      </div>

      {/* 返回首页 */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-12 mb-16 animate-fade-in-up delay-300">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors duration-300"
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
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="text-sm tracking-wider font-serif">{t('article.backToList')}</span>
        </Link>
      </div>

      {/* 分享与互动 */}
      <div className="border-t border-stone-200 dark:border-stone-800 pt-12 mb-16 animate-fade-in-up delay-400">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 tracking-wider">{t('article.share')}</span>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </button>
              <button className="w-9 h-9 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>
            </div>
          </div>

          <button className="flex items-center gap-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="text-sm tracking-wider font-serif">{t('article.like')}</span>
          </button>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="border-t border-stone-200 dark:border-stone-800 pt-12 animate-fade-in-up delay-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-stone-400 tracking-wider font-serif mb-1">
              {t('footer.copyright')}
            </p>
            <p className="text-xs text-stone-400 tracking-wider">
              {t('footer.slogan')}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Hero;
