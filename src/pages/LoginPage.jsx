import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { login, register } from '../api/auth';
import { useAuth } from '../hooks/useAuth.jsx';

function LoginPage() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      if (isLogin) {
        const data = await login(formData.email, formData.password);
        setUser(data.user);
        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError(t('register.confirmPassword') + ' ✗');
          setLoading(false);
          return;
        }
        const data = await register(formData.name, formData.email, formData.password);
        setUser(data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const formVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      marginBottom: 24,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      opacity: 0,
      x: isLogin ? 20 : -20,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        {/* 返回首页 */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
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
        </motion.div>

        {/* 标题 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login-title' : 'register-title'}
            className="mb-10"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-3xl font-light tracking-wide text-stone-900 dark:text-stone-100 mb-4">
              {isLogin ? t('login.title') : t('register.title')}
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm tracking-wide">
              {isLogin ? t('login.title') : t('register.title')}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* 错误提示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm tracking-wider overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 表单字段容器 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-form' : 'register-form'}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
                exit: { opacity: 0 },
              }}
            >
              {/* 姓名 - 仅注册时显示 */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                      {t('register.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                      placeholder={t('register.name')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 邮箱 */}
              <motion.div variants={formVariants} className="mb-6">
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
              </motion.div>

              {/* 密码 */}
              <motion.div variants={formVariants} className="mb-6">
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
              </motion.div>

              {/* 确认密码 - 仅注册时显示 */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden"
                  >
                    <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                      {t('register.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                      placeholder="••••••••"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* 提交按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : isLogin ? t('login.loginButton') : t('register.registerButton')}
            </button>
          </motion.div>
        </form>

        {/* 切换登录/注册 */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-sm text-stone-400 tracking-wider">
            {isLogin ? t('login.noAccount') : t('register.hasAccount')}
            <button
              onClick={toggleMode}
              className="text-stone-600 dark:text-stone-400 hover:underline ml-2 transition-colors duration-300"
            >
              {isLogin ? t('login.register') : t('register.login')}
            </button>
          </p>
        </motion.div>

        {/* 分隔线 */}
        <motion.div
          className="flex items-center gap-4 my-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          <span className="text-xs text-stone-400 tracking-wider uppercase">{t('login.orContinueWith')}</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </motion.div>

        {/* 第三方登录 */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <button className="w-full py-3 flex items-center justify-center gap-3 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-colors duration-300 tracking-wider text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
          <button className="w-full py-3 flex items-center justify-center gap-3 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-colors duration-300 tracking-wider text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
            Twitter
          </button>
        </motion.div>

        {/* 页脚 */}
        <motion.footer
          className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <p className="text-xs text-stone-400 text-center tracking-wider">
            {t('footer.copyright')}. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </main>
  );
}

export default LoginPage;
