const API_URL = 'http://localhost:3001/api';

// 获取文章的评论
export async function getComments(articleId) {
  const response = await fetch(`${API_URL}/articles/${articleId}/comments`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '获取评论失败');
  }

  return data.comments;
}

// 添加评论
export async function addComment(articleId, content, parentId = null) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('请先登录');
  }

  const response = await fetch(`${API_URL}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parentId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '添加评论失败');
  }

  return data.comment;
}

// 更新评论
export async function updateComment(commentId, content) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('请先登录');
  }

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '更新评论失败');
  }

  return data;
}

// 删除评论
export async function deleteComment(commentId) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('请先登录');
  }

  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '删除评论失败');
  }

  return data;
}