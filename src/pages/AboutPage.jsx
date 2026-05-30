import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

function AboutPage() {
  const skills = [
    { name: '前端开发', description: 'React, Vue, TypeScript, Tailwind CSS' },
    { name: 'UI/UX 设计', description: '极简设计，用户体验优化' },
    { name: '后端开发', description: 'Node.js, Express, 数据库设计' },
    { name: '写作与思考', description: '技术博客，设计随笔，生活记录' },
  ];

  const socialLinks = [
    { name: 'GitHub', url: '#', icon: 'GitHub' },
    { name: 'Twitter', url: '#', icon: 'Twitter' },
    { name: '邮箱', url: 'mailto:hello@example.com', icon: 'Email' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      {/* 页面头部 */}
      <header className="mb-16 animate-fade-in-up">
        <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-6 font-serif">
          About Me
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-stone-900 dark:text-stone-100 leading-tight">
          关于我
        </h1>
        <div className="w-16 h-px bg-stone-300 dark:bg-stone-700 mb-8" />
        <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg tracking-wide max-w-xl font-light">
          设计师、开发者、写作者。在代码与像素之间寻找平衡，在技术与人文之间探索可能。
        </p>
      </header>

      {/* 个人简介 */}
      <section className="mb-20 animate-fade-in-up delay-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-6 tracking-wide">
              个人简介
            </h2>
            <div className="space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>
                我是白泽，一个热爱设计与技术的创作者。我相信好的设计应该是隐形的，它应该服务于内容，而不是喧宾夺主。
              </p>
              <p>
                在这个信息过载的时代，我追求极简与克制。无论是写代码还是做设计，我都试图在复杂与简单之间找到那个微妙的平衡点。
              </p>
              <p>
                这个博客是我思考与记录的空间。在这里，我分享关于设计、技术与生活的随笔，希望能给你带来一些启发。
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-64 h-64 bg-stone-200 dark:bg-stone-800 rounded-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-stone-600 dark:text-stone-400 font-serif">白</span>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 tracking-wider">白泽</p>
                <p className="text-xs text-stone-400 mt-1">设计师 / 开发者 / 写作者</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技能专长 */}
      <section className="mb-20 animate-fade-in-up delay-200">
        <h2 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-8 tracking-wide">
          技能专长
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="border-t border-stone-200 dark:border-stone-800 pt-6 transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-lg font-light text-stone-800 dark:text-stone-200 tracking-wide">
                  {skill.name}
                </h3>
                <span className="text-xs text-stone-400 font-sans">0{index + 1}</span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 设计理念 */}
      <section className="mb-20 animate-fade-in-up delay-300">
        <div className="max-w-3xl mx-auto text-center py-16 border-t border-b border-stone-200 dark:border-stone-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-stone-300 dark:text-stone-700 mx-auto mb-6"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
          </svg>
          <blockquote className="text-xl md:text-2xl font-light text-stone-700 dark:text-stone-300 leading-relaxed tracking-wide italic mb-6">
            "设计不是装饰，而是沟通。"
          </blockquote>
          <cite className="text-xs text-stone-400 tracking-[0.2em] uppercase not-italic font-serif">
            —— 我的设计哲学
          </cite>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="mb-20 animate-fade-in-up delay-400">
        <h2 className="text-2xl font-light text-stone-800 dark:text-stone-200 mb-8 tracking-wide">
          联系方式
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="group block border-t border-stone-200 dark:border-stone-800 pt-6 transition-all duration-300 hover:border-stone-400 dark:hover:border-stone-600"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm tracking-wider text-stone-600 dark:text-stone-400 font-serif">
                  {link.name}
                </span>
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
                  className="text-stone-400 transform group-hover:translate-x-1 transition-transform duration-300"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
              <div className="w-full h-px bg-stone-100 dark:bg-stone-800 group-hover:bg-stone-300 dark:group-hover:bg-stone-600 transition-colors duration-300" />
            </a>
          ))}
        </div>
      </section>

      {/* 博客信息 */}
      <section className="animate-fade-in-up delay-500">
        <div className="border-t border-stone-200 dark:border-stone-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h3 className="text-lg font-light text-stone-800 dark:text-stone-200 mb-4 tracking-wide">
                关于这个博客
              </h3>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed max-w-lg">
                这个博客使用 React、Tailwind CSS 和 Framer Motion 构建，追求极简、优雅的设计风格。所有内容均为原创，记录我在设计、技术与生活中的思考与探索。
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/articles"
                className="inline-flex items-center gap-3 px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-500 dark:hover:border-stone-500 transition-all duration-300 tracking-wider text-sm font-serif"
              >
                阅读文章
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
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-stone-200 dark:border-stone-800 mt-20 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-stone-400 tracking-wider font-serif mb-1">
              © 2026 白泽的博客
            </p>
            <p className="text-xs text-stone-400 tracking-wider">
              用热爱构建，以文字记录
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider font-serif"
            >
              RSS
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default AboutPage;