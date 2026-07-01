import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SEOHead from '../components/SEOHead';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AboutPage() {
  const mainRef = useRef(null);

  const skills = [
    { name: '前端开发', desc: 'React · Vue · TypeScript · Tailwind CSS', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H9H8' },
    { name: 'UI/UX 设计', desc: '极简设计 · 用户体验优化 · Figma', icon: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586 M11 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
    { name: '后端开发', desc: 'Node.js · Express · MySQL · REST API', icon: 'M4 17h16M4 12h16M4 7h16 M4 4h16v16H4z' },
    { name: '写作与思考', desc: '技术博客 · 设计随笔 · 生活记录', icon: 'M11 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7 M11 4v6l3-2 3 2V4' },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/981443166', desc: '开源项目和代码仓库' },
    { name: 'Twitter', url: '#', desc: '日常随想与设计灵感' },
    { name: '邮箱', url: 'mailto:hello@example.com', desc: 'hello@example.com' },
  ];

  // ScrollTrigger 批量入场动画
  useGSAP(() => {
    const sections = mainRef.current?.querySelectorAll('[data-animate]');
    if (!sections) return;

    sections.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    // 技能卡片 staggered — 不用 ScrollTrigger，直接延时入场
    const skillCards = mainRef.current?.querySelectorAll('[data-skill]');
    if (skillCards && skillCards.length > 0) {
      gsap.set(skillCards, { opacity: 0, y: 30 });
      gsap.to(skillCards, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
      });
    }

    // 社交链接 staggered
    const socialCards = mainRef.current?.querySelectorAll('[data-social]');
    if (socialCards && socialCards.length > 0) {
      gsap.set(socialCards, { opacity: 0, y: 20 });
      gsap.to(socialCards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.8,
        ease: 'power2.out',
      });
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      <SEOHead title="关于" description="关于白泽 — 设计师、开发者、写作者" url="/about" />

      {/* ──── 非对称双栏头部 ──── */}
      <section className="mb-24 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
        <div data-animate>
          <span className="text-xs tracking-[0.3em] text-stone-400 uppercase font-serif">
            About Me
          </span>
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mt-6 mb-6 text-stone-900 dark:text-stone-100 leading-[1.1]">
            关于<br />白泽
          </h1>
          <div className="w-16 h-px bg-stone-300 dark:bg-stone-700 mb-6" />
          <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg max-w-md font-light">
            设计师、开发者、写作者。在代码与像素之间寻找平衡，在技术与人文之间探索可能。
          </p>
        </div>

        {/* 轻量头像 + 身份标签 */}
        <div data-animate className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center ring-1 ring-stone-300 dark:ring-stone-700 ring-offset-4 ring-offset-stone-50 dark:ring-offset-stone-950">
            <span className="text-3xl text-stone-600 dark:text-stone-400 font-serif">白</span>
          </div>
          <span className="text-sm text-stone-500 dark:text-stone-400 tracking-wider">白泽</span>
          <span className="text-xs text-stone-400 tracking-[0.15em]">DESIGNER · DEVELOPER · WRITER</span>
        </div>
      </section>

      {/* ──── 个人简介 + 非对称留白 ──── */}
      <section data-animate className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-3 space-y-5 text-stone-600 dark:text-stone-400 leading-relaxed text-base">
            <p>
              我是白泽，一个热爱设计与技术的创作者。我相信好的设计应该是隐形的——它服务于内容，而不是喧宾夺主。
            </p>
            <p>
              在这个信息过载的时代，我追求极简与克制。无论是写代码还是做设计，我都试图在复杂与简单之间找到那个微妙的平衡点。
            </p>
            <p>
              这个博客是我思考与记录的空间。在这里，我分享关于设计、技术与生活的随笔，希望能给你带来一些启发。
            </p>
          </div>
          <div className="md:col-span-2 hidden md:flex items-start justify-end pt-4">
            <div className="w-px h-32 bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </section>

      {/* ──── 设计理念 - 大引用块 ──── */}
      <section data-animate className="mb-24">
        <div className="relative py-20 px-8 md:px-16 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
          {/* 装饰角标 */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-stone-300 dark:border-stone-700" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-stone-300 dark:border-stone-700" />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-stone-300 dark:text-stone-700 mx-auto mb-8"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
          </svg>

          <blockquote className="text-2xl md:text-3xl font-light text-stone-700 dark:text-stone-200 leading-relaxed tracking-wide italic text-center mb-6">
            "设计不是装饰，而是沟通。"
          </blockquote>

          <p className="text-xs text-stone-400 tracking-[0.2em] uppercase text-center font-serif">
            我的设计哲学
          </p>
        </div>
      </section>

      {/* ──── 技能专长 ──── */}
      <section className="mb-24">
        <div data-animate className="mb-10">
          <span className="text-xs tracking-[0.2em] text-stone-400 uppercase font-serif">Expertise</span>
          <h2 className="text-3xl font-light text-stone-900 dark:text-stone-100 mt-3 tracking-wide">技能专长</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              data-skill
              className="group flex items-start gap-5 p-6 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
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
                  className="text-stone-500 dark:text-stone-400"
                >
                  {skill.icon.split(' ').map((d, j) => (
                    <path key={j} d={d} />
                  ))}
                </svg>
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-base font-normal text-stone-800 dark:text-stone-200 tracking-wide">
                    {skill.name}
                  </h3>
                  <span className="text-xs text-stone-400 font-sans">0{i + 1}</span>
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {skill.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── 联系方式 ──── */}
      <section className="mb-24">
        <div data-animate className="mb-10">
          <span className="text-xs tracking-[0.2em] text-stone-400 uppercase font-serif">Connect</span>
          <h2 className="text-3xl font-light text-stone-900 dark:text-stone-100 mt-3 tracking-wide">联系方式</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              data-social
              href={link.url}
              target="_blank" rel="noopener noreferrer"
              className="group flex flex-col p-6 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-sm font-serif text-stone-700 dark:text-stone-300 tracking-wider mb-2">
                {link.name}
              </span>
              <span className="text-xs text-stone-400 mb-4">{link.desc}</span>
              <span className="mt-auto flex items-center gap-2 text-xs text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                联系我
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-0.5 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ──── 博客信息 + CTA ──── */}
      <section data-animate>
        <div className="border-t border-stone-200 dark:border-stone-800 pt-12 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="text-lg font-light text-stone-800 dark:text-stone-200 mb-3 tracking-wide">
              关于这个博客
            </h3>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed max-w-lg text-sm">
              使用 React · Tailwind CSS · GSAP 构建，追求极简、优雅的设计风格。所有内容均为原创，记录设计、技术与生活的思考。
            </p>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-3 px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-500 dark:hover:border-stone-500 transition-all duration-300 tracking-wider text-sm font-serif shrink-0"
          >
            阅读文章
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ──── 页脚 ──── */}
      <footer className="border-t border-stone-200 dark:border-stone-800 mt-20 pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-stone-400 tracking-wider font-serif">
            © 2026 白泽的博客 · 用热爱构建，以文字记录
          </p>
          <div className="flex items-center gap-8">
            <a href="https://github.com/981443166" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors tracking-wider font-serif">
              GitHub
            </a>
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors tracking-wider font-serif">
              Twitter
            </a>
            <a href="#" className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors tracking-wider font-serif">
              RSS
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default AboutPage;
