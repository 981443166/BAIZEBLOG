const API_URL = 'http://localhost:3001/api';

// 获取所有文章
export async function getArticles() {
  const response = await fetch(`${API_URL}/articles`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '获取文章失败');
  }

  return data.articles;
}

// 获取单篇文章
export async function getArticle(id) {
  const response = await fetch(`${API_URL}/articles/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '获取文章详情失败');
  }

  return data.article;
}

// 获取文章点赞数
export async function getArticleLikes(articleId) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}/articles/${articleId}/likes`, {
    headers
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '获取点赞数失败');
  }

  return data;
}

// 点赞/取消点赞文章
export async function likeArticle(articleId) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('请先登录');
  }
  
  const response = await fetch(`${API_URL}/articles/${articleId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '点赞操作失败');
  }

  return data;
}
