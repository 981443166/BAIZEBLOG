import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * GSAP 动画包装器 - 替代 framer-motion 的 motion.div
 * @param {string} animation - 'fadeUp' | 'fadeIn' | 'fadeDown'
 * @param {number} delay - 延迟秒数
 */
export default function AnimatedSection({ children, className = '', animation = 'fadeUp', delay = 0 }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    const anims = {
      fadeUp: { opacity: 0, y: 20 },
      fadeDown: { opacity: 0, y: -20 },
      fadeIn: { opacity: 0 },
    };
    gsap.from(ref.current, {
      ...anims[animation] || anims.fadeUp,
      duration: 0.4,
      delay,
      ease: 'power2.out',
    });
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
}
