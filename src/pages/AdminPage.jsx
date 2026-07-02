import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

function AdminPage() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    coverImage: '',
    readTime: 8,
    status: 'published'
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // 检查是否登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // 获取文章列表和分类
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch('http://localhost:3001/api/articles', { headers });
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('获取文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      setCategories(data);
      // 如果当前没有选择分类，设置默认值
      if (data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: data[0] }));
      }
    } catch (error) {
      console.error('获取分类失败:', error);
    }
  };

  // 删除文章
  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 打开编辑弹窗
  const handleEdit = async (article) => {
    setEditingArticle(article);
    // 从 API 获取完整文章内容（列表 API 可能不含 content）
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`http://localhost:3001/api/articles/${article.id}`, { headers });
      const data = await res.json();
      const full = data.article || article;
      setFormData({
        title: full.title || '',
        category: full.category || '',
        excerpt: full.excerpt || '',
        content: full.content || '',
        coverImage: full.cover_image || '',
        readTime: full.read_time || 8,
        status: full.status || 'published'
      });
    } catch {
      // fallback 到列表数据
      setFormData({
        title: article.title || '',
        category: article.category || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        coverImage: article.cover_image || '',
        readTime: article.read_time || 8,
        status: article.status || 'published'
      });
    }
    setShowModal(true);
  };

  // 打开新增弹窗
  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      coverImage: '',
      readTime: 8,
      status: 'published'
    });
    setShowModal(true);
  };

  // 插入图片到内容
  const insertImage = () => {
    if (imageUrl.trim()) {
      const imageMarkdown = `![图片](${imageUrl.trim()})`;
      setFormData({
        ...formData,
        content: formData.content + '\n' + imageMarkdown + '\n'
      });
      setImageUrl('');
    }
  };

  // 上传封面图片
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, coverImage: data.url });
      } else {
        const error = await response.json();
        alert(error.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 保存文章
  const handleSave = async (e, draftStatus = null) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingArticle 
        ? `http://localhost:3001/api/articles/${editingArticle.id}`
        : 'http://localhost:3001/api/articles';
      
      // 转换字段名以匹配后端期望的格式
      const saveData = {
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        category: formData.category || (categories.length > 0 ? categories[0] : ''),
        cover_image: formData.coverImage || null,
        read_time: parseInt(formData.readTime) || 8,
        status: draftStatus || formData.status || 'published'
      };
      
      const response = await fetch(url, {
        method: editingArticle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saveData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchArticles();
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 格式化日期
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-stone-800 dark:text-stone-200 tracking-wide">
              文章管理
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              共 {articles.length} 篇文章
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-800 dark:bg-stone-700 text-white text-sm rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新建文章
          </button>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-stone-400 tracking-wider uppercase">
                    文章信息
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-stone-400 tracking-wider uppercase">
                    分类
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-stone-400 tracking-wider uppercase">
                    状态
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-stone-400 tracking-wider uppercase">
                    日期
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-stone-400 tracking-wider uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr 
                    key={article.id}
                    className="border-b border-stone-100 dark:border-stone-800/50 last:border-b-0 hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
                          {article.title}
                        </h3>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                          {article.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${
                        article.status === 'published'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {article.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-stone-400">
                        {formatDate(article.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/article/${article.id}`}
                          className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
                          title="查看"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
                          title="编辑"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-stone-400 hover:text-red-500 transition-colors duration-200"
                          title="删除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {articles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-400 text-sm">暂无文章</p>
                <button
                  onClick={handleAdd}
                  className="mt-4 text-sm text-stone-600 hover:text-stone-800 underline"
                >
                  创建第一篇文章
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 编辑弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* 头部 - 固定 */}
            <div className="shrink-0 border-b border-stone-200 dark:border-stone-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-serif text-stone-800 dark:text-stone-200">
                {editingArticle ? '编辑文章' : '新建文章'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            {/* 内容区域 - 可滚动 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                  placeholder="输入文章标题"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                    分类
                  </label>
                  <select
                    value={formData.category === '' || categories.includes(formData.category) ? formData.category : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setFormData({...formData, category: ''});
                      } else {
                        setFormData({...formData, category: e.target.value});
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                  >
                    <option value="">请选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__custom__">+ 自定义分类</option>
                  </select>
                  {(!categories.includes(formData.category) || formData.category === '') && (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2.5 mt-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                      placeholder="输入自定义分类名称"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                    阅读时间（分钟）
                  </label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData({...formData, readTime: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                    封面图片
                  </label>
                  <div className="space-y-2">
                    {/* 图片预览 */}
                    {formData.coverImage && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                        <img 
                          src={formData.coverImage.startsWith('/uploads') ? `http://localhost:3001${formData.coverImage}` : formData.coverImage} 
                          alt="封面预览" 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, coverImage: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {/* URL 输入 */}
                    <input
                      type="text"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                      placeholder="输入图片URL"
                    />
                    {/* 本地上传按钮 */}
                    <div className="flex items-center gap-2">
                      <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-lg cursor-pointer hover:border-stone-400 dark:hover:border-stone-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="text-sm text-stone-500">
                          {uploading ? '上传中...' : '点击上传本地图片'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-stone-400">支持 JPG、PNG、GIF、WebP 格式，最大 5MB</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                  摘要
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 resize-none"
                  rows="2"
                  placeholder="输入文章摘要"
                />
              </div>
              
              {/* 图片插入工具 */}
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4">
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                  插入图片
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                    placeholder="输入图片URL，点击插入到文章"
                  />
                  <button
                    type="button"
                    onClick={insertImage}
                    className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-sm rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    插入
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-stone-400 uppercase tracking-wider mb-2">
                  正文内容
                </label>
                <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden" data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData({...formData, content: value || ''})}
                    height={350}
                    preview="edit"
                  />
                </div>
              </div>
            </div>
            
            {/* 底部按钮 - 固定 */}
            <div className="shrink-0 border-t border-stone-200 dark:border-stone-800 px-6 py-4 flex items-center gap-4 bg-white dark:bg-stone-900">
              <button
                type="button"
                onClick={(e) => handleSave(e, 'published')}
                className="px-6 py-2.5 bg-stone-800 dark:bg-stone-700 text-white text-sm rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-300"
              >
                {editingArticle ? '保存修改' : '发布文章'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSave(e, 'draft')}
                className="px-6 py-2.5 border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 text-sm rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors duration-300"
              >
                存为草稿
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 text-sm transition-colors duration-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPage;
