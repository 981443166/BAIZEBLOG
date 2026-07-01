import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../api/auth';
import { useAuth } from '../hooks/useAuth.jsx';
import AnimatedSection from '../components/AnimatedSection';

function LoginPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email, formData.password);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        {/* 返回首页 */}
        <AnimatedSection animation="fadeDown" delay={0.1} className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider"
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
            {t('nav.home')}
          </Link>
        </AnimatedSection>

        {/* 标题 */}
        <AnimatedSection animation="fadeUp" delay={0.2} className="mb-10">
          <h1 className="text-3xl font-light tracking-wide text-stone-900 dark:text-stone-100 mb-4">
            {t('login.adminLogin')}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm tracking-wide">
            {t('login.adminLoginDesc')}
          </p>
        </AnimatedSection>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* 错误提示 */}
          {error && (
            <AnimatedSection animation="fadeDown" className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm tracking-wider overflow-hidden">
              {error}
            </AnimatedSection>
          )}

          {/* 邮箱 */}
          <AnimatedSection animation="fadeUp" delay={0.3} className="mb-6">
            <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
              {t('login.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
              placeholder="your@email.com"
            />
          </AnimatedSection>

          {/* 密码 */}
          <AnimatedSection animation="fadeUp" delay={0.4} className="mb-6">
            <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
              {t('login.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
              placeholder="••••••••"
            />
          </AnimatedSection>

          {/* 提交按钮 */}
          <AnimatedSection animation="fadeUp" delay={0.5}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('login.loginButton')}
            </button>
          </AnimatedSection>
        </form>

        {/* 页脚 */}
        <AnimatedSection animation="fadeIn" delay={0.6} className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs text-stone-400 text-center tracking-wider">
            {t('footer.copyright')}. All rights reserved.
          </p>
        </AnimatedSection>
      </div>
    </main>
  );
}

export default LoginPage;
