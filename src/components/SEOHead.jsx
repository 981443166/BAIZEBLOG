import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = '白泽',
  publishedTime,
  modifiedTime,
  article = false,
  jsonLd,
}) => {
  const siteName = '白泽博客';
  const defaultDescription = '白泽博客是一个专注于技术分享、编程教程和个人感悟的博客平台，提供前端开发、后端技术、数据库等技术文章。';
  const defaultKeywords = '博客,技术分享,编程,前端开发,后端开发,JavaScript,React,Node.js';
  const siteUrl = 'https://baizeblog.com';
  
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - 技术分享与生活感悟`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const ogImage = image ? `${siteUrl}${image}` : `${siteUrl}/og-default.png`;

  return (
    <Helmet>
      {/* 基础 meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph 标签 */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* 文章专属标签 */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* JSON-LD 结构化数据 */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
