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
