const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 中间件
app.use(cors());
app.use(express.json());

// 验证 JWT 中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供访问令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 验证输入
    if (!name || !email || !password) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6位' });
    }

    // 检查邮箱是否已存在
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: '该邮箱已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // 生成 JWT
    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: result.insertId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '请填写邮箱和密码' });
    }

    // 查找用户
    const [users] = await db.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取所有文章
app.get('/api/articles', async (req, res) => {
  try {
    const [articles] = await db.execute(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.category, 
              a.cover_image, a.read_time, a.created_at,
              u.name as author_name
       FROM articles a
       JOIN users u ON a.author_id = u.id
       WHERE a.status = 'published'
       ORDER BY a.created_at DESC`
    );

    res.json({ articles });
  } catch (error) {
    console.error('获取文章错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取单篇文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [articles] = await db.execute(
      `SELECT a.id, a.title, a.slug, a.content, a.excerpt, 
              a.category, a.cover_image, a.read_time, a.created_at,
              u.name as author_name
       FROM articles a
       JOIN users u ON a.author_id = u.id
       WHERE a.id = ? AND a.status = 'published'`,
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 获取文章标签
    const [tags] = await db.execute(
      `SELECT t.name FROM tags t
       JOIN article_tags at ON t.id = at.tag_id
       WHERE at.article_id = ?`,
      [id]
    );

    res.json({
      article: {
        ...articles[0],
        tags: tags.map(t => t.name),
      },
    });
  } catch (error) {
    console.error('获取文章详情错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
