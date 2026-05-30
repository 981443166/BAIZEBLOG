const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 中间件
app.use(cors());
app.use(express.json());

// 注册
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: '请填写所有必填字段' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '密码长度至少为6位' });
    }

    console.log('Checking existing user...');
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: '该邮箱已被注册' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Inserting user...');
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    console.log('User inserted, ID:', result.insertId);

    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: result.insertId, name, email },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '服务器内部错误: ' + error.message });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
});
