import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { updateProfile, changePassword } from '../api/auth';
import AnimatedSection from '../components/AnimatedSection';

function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // 个人资料表单数据
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  
  // 密码表单数据
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 检查登录状态并初始化表单数据
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, authLoading, navigate]);

  // 处理个人资料表单变化
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  // 处理密码表单变化
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  // 提交个人资料更新
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await updateProfile(profileData.name, profileData.email, profileData.avatar);
      setUser(data.user);
      setSuccess('个人资料更新成功');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 提交密码修改
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // 验证新密码
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('两次输入的新密码不一致');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('新密码长度至少为6位');
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('密码修改成功');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 加载中状态
  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      </main>
    );
  }

  // 未登录状态
  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* 页面标题 */}
        <AnimatedSection animation="fadeDown" className="mb-10">
          <h1 className="text-3xl font-light tracking-wide text-stone-900 dark:text-stone-100 mb-2">
            个人资料
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm tracking-wide">
            管理你的账户信息和安全设置
          </p>
        </AnimatedSection>

        {/* 选项卡 */}
        <AnimatedSection animation="fadeDown" delay={0.1} className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg mb-8">
          <button
            onClick={() => {
              setActiveTab('profile');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2.5 text-sm tracking-wider rounded-md transition-all duration-300 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => {
              setActiveTab('password');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2.5 text-sm tracking-wider rounded-md transition-all duration-300 ${
              activeTab === 'password'
                ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-sm'
                : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            修改密码
          </button>
        </AnimatedSection>

        {/* 成功/错误提示 */}
        {(success || error) && (
          <AnimatedSection animation="fadeDown" className={`mb-6 p-4 rounded-lg text-sm tracking-wider ${
            success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
          }`}>
            {success || error}
          </AnimatedSection>
        )}

        {/* 个人资料表单 */}
        {activeTab === 'profile' && (
          <AnimatedSection animation="fadeUp">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* 头像预览 */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="头像" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl font-serif text-stone-500 dark:text-stone-400">
                      {user.name?.[0] || '用'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-1">头像</p>
                  <p className="text-xs text-stone-400">输入图片URL来更新头像</p>
                </div>
              </div>

              {/* 头像URL */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  头像URL
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* 姓名 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="你的名字"
                />
              </div>

              {/* 邮箱 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  邮箱
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="your@email.com"
                />
              </div>

              {/* 注册时间 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  注册时间
                </label>
                <div className="px-4 py-3 text-sm text-stone-500 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 tracking-wide">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '未知'}
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '保存中...' : '保存修改'}
                </button>
              </div>
            </form>
          </AnimatedSection>
        )}

        {/* 修改密码表单 */}
        {activeTab === 'password' && (
          <AnimatedSection animation="fadeUp">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* 当前密码 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  当前密码
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="••••••••"
                />
              </div>

              {/* 新密码 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  新密码
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="••••••••"
                />
                <p className="mt-2 text-xs text-stone-400">密码长度至少为6位</p>
              </div>

              {/* 确认新密码 */}
              <div>
                <label className="block text-xs text-stone-400 tracking-wider mb-2 uppercase">
                  确认新密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 text-sm text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:border-stone-400 dark:focus:border-stone-600 outline-none transition-colors duration-300 tracking-wide"
                  placeholder="••••••••"
                />
              </div>

              {/* 提交按钮 */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm text-white bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '修改中...' : '修改密码'}
                </button>
              </div>
            </form>
          </AnimatedSection>
        )}

        {/* 返回首页 */}
        <AnimatedSection animation="fadeIn" delay={0.3} className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-400 transition-colors duration-300 tracking-wider"
          >
            ← 返回首页
          </button>
        </AnimatedSection>
      </div>
    </main>
  );
}

export default ProfilePage;
