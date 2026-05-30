import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth.jsx';
import SEOHead from '../components/SEOHead';

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    comments: true,
    updates: false,
  });
  const [success, setSuccess] = useState('');

  // 检查登录状态
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // 初始化暗黑模式状态
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
  }, []);

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

  // 切换语言
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18n-lang', newLang);
  };

  // 切换通知设置
  const toggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setSuccess(t('settings.saved'));
    setTimeout(() => setSuccess(''), 2000);
  };

  // 初始化通知设置
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  if (authLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
    }),
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      <SEOHead title={t('settings.title')} />

      {/* 页面头部 */}
      <motion.header
        className="mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-6 font-serif">
          Settings
        </p>
        <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-stone-900 dark:text-stone-100 leading-tight">
          {t('settings.title')}
        </h1>
        <div className="w-16 h-px bg-stone-300 dark:bg-stone-700" />
      </motion.header>

      {/* 保存成功提示 */}
      {success && (
        <motion.div
          className="mb-6 px-4 py-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-sm tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {success}
        </motion.div>
      )}

      {/* 外观设置 */}
      <motion.section
        className="mb-10"
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xs tracking-[0.2em] text-stone-400 uppercase mb-4 font-serif">
          {t('settings.appearance')}
        </h2>
        <div className="border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {/* 暗黑模式 */}
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.darkMode')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.darkModeDesc')}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                darkMode
                  ? 'bg-stone-600 dark:bg-stone-400'
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 语言切换 */}
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.language')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.languageDesc')}
              </p>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-1.5 text-xs tracking-wider border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-500 dark:hover:border-stone-500 transition-all duration-300"
            >
              {i18n.language === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        </div>
      </motion.section>

      {/* 通知设置 */}
      <motion.section
        className="mb-10"
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xs tracking-[0.2em] text-stone-400 uppercase mb-4 font-serif">
          {t('settings.notifications')}
        </h2>
        <div className="border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {/* 邮件通知 */}
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.emailNotify')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.emailNotifyDesc')}
              </p>
            </div>
            <button
              onClick={() => toggleNotification('email')}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                notifications.email
                  ? 'bg-stone-600 dark:bg-stone-400'
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  notifications.email ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 评论通知 */}
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.commentNotify')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.commentNotifyDesc')}
              </p>
            </div>
            <button
              onClick={() => toggleNotification('comments')}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                notifications.comments
                  ? 'bg-stone-600 dark:bg-stone-400'
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  notifications.comments ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 更新通知 */}
          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.updateNotify')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.updateNotifyDesc')}
              </p>
            </div>
            <button
              onClick={() => toggleNotification('updates')}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 dark:focus:ring-offset-stone-900 ${
                notifications.updates
                  ? 'bg-stone-600 dark:bg-stone-400'
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  notifications.updates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 账户安全 */}
      <motion.section
        className="mb-10"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xs tracking-[0.2em] text-stone-400 uppercase mb-4 font-serif">
          {t('settings.accountSecurity')}
        </h2>
        <div className="border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {/* 个人资料 */}
          <Link
            to="/profile"
            className="flex items-center justify-between p-5 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors duration-300 group"
          >
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.editProfile')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.editProfileDesc')}
              </p>
            </div>
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
              className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* 修改密码 */}
          <Link
            to="/profile"
            className="flex items-center justify-between p-5 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors duration-300 group"
          >
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.changePassword')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {t('settings.changePasswordDesc')}
              </p>
            </div>
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
              className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </motion.section>

      {/* 关于 */}
      <motion.section
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xs tracking-[0.2em] text-stone-400 uppercase mb-4 font-serif">
          {t('settings.about')}
        </h2>
        <div className="border border-stone-200 dark:border-stone-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-800 dark:text-stone-200 tracking-wide">
                {t('settings.version')}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                BaizeBlog v1.0.0
              </p>
            </div>
            <span className="text-xs text-stone-400 tracking-wider">
              React + Tailwind CSS
            </span>
          </div>
        </div>
      </motion.section>

      {/* 底部装饰 */}
      <div className="mt-16 w-8 h-px bg-stone-200 dark:bg-stone-800 mx-auto" />
    </main>
  );
}

export default SettingsPage;
