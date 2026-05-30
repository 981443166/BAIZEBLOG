const API_URL = 'http://localhost:3001/api';

// 注册
export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '注册失败');
  }

  // 保存 token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// 登录
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '登录失败');
  }

  // 保存 token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// 获取当前用户
export async function getCurrentUser() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Token 无效，清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }

  const data = await response.json();
  return data.user;
}

// 退出登录
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// 检查是否已登录
export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// 获取存储的用户信息
export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// 更新用户资料
export async function updateProfile(name, email, avatar) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, avatar }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '更新失败');
  }

  // 更新本地存储的用户信息
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

// 修改密码
export async function changePassword(currentPassword, newPassword) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('未登录');
  }

  const response = await fetch(`${API_URL}/auth/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '修改密码失败');
  }

  return data;
}
