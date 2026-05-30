const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('./db.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务 - 提供上传的图片访问
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 配置 multer 文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳 + 随机数 + 原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // 只允许图片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

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

// 更新用户资料
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user.userId;

    // 验证输入
    if (!name || !email) {
      return res.status(400).json({ message: '姓名和邮箱为必填项' });
    }

    // 检查邮箱是否已被其他用户使用
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: '该邮箱已被其他用户使用' });
    }

    // 更新用户信息
    await db.execute(
      'UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?',
      [name, email, avatar || null, userId]
    );

    // 获取更新后的用户信息
    const [updatedUsers] = await db.execute(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({ 
      message: '资料更新成功',
      user: updatedUsers[0] 
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 修改密码
app.put('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // 验证输入
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '请填写当前密码和新密码' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码长度至少为6位' });
    }

    // 获取当前用户密码
    const [users] = await db.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '当前密码错误' });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取所有文章（支持根据用户身份返回不同数据）
app.get('/api/articles', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    let query;
    let params = [];
    
    if (token) {
      // 如果提供了 token，返回所有文章（包括草稿）
      query = `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.category, 
                      a.cover_image, a.read_time, a.status, a.created_at,
                      u.name as author_name
               FROM articles a
               JOIN users u ON a.author_id = u.id
               ORDER BY a.created_at DESC`;
    } else {
      // 未登录只返回已发布文章
      query = `SELECT a.id, a.title, a.slug, a.excerpt, a.category, 
                      a.cover_image, a.read_time, a.status, a.created_at,
                      u.name as author_name
               FROM articles a
               JOIN users u ON a.author_id = u.id
               WHERE a.status = 'published'
               ORDER BY a.created_at DESC`;
    }

    const [articles] = await db.execute(query, params);
    res.json({ articles });
  } catch (error) {
    console.error('获取文章错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取所有分类
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(
      `SELECT DISTINCT category FROM articles ORDER BY category`
    );
    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ error: '获取分类失败' });
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

// 创建文章
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, cover_image, read_time, status } = req.body;
    const author_id = req.user.userId || req.user.id;

    console.log('创建文章请求数据:', { title, excerpt, content, category, read_time, status, author_id });

    const safeTitle = title || '';
    // 生成唯一的 slug：使用时间戳避免冲突
    const timestamp = Date.now();
    const baseSlug = slug || safeTitle.toLowerCase().replace(/\s+/g, '-') || 'article';
    const safeSlug = `${baseSlug}-${timestamp}`;
    const safeExcerpt = excerpt !== undefined ? excerpt : null;
    const safeContent = content !== undefined ? content : null;
    // 如果没有提供分类，获取数据库中的第一个分类
    let safeCategory = category;
    if (!safeCategory) {
      const [categories] = await db.execute('SELECT DISTINCT category FROM articles LIMIT 1');
      safeCategory = categories.length > 0 ? categories[0].category : '未分类';
    }
    const safeCoverImage = cover_image !== undefined ? cover_image : null;
    const safeReadTime = read_time !== undefined ? parseInt(read_time) : 8;
    const safeStatus = status || 'published';

    const [result] = await db.execute(
      `INSERT INTO articles (title, slug, excerpt, content, category, cover_image, read_time, status, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        safeTitle, 
        safeSlug, 
        safeExcerpt, 
        safeContent, 
        safeCategory, 
        safeCoverImage, 
        safeReadTime, 
        safeStatus, 
        author_id
      ]
    );

    res.status(201).json({ id: result.insertId, message: '文章创建成功' });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ message: '服务器内部错误: ' + error.message });
  }
});

// 更新文章
app.put('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, category, cover_image, read_time, status } = req.body;

    // 获取现有文章的 slug（如果用户没有提供新的 slug）
    const [existing] = await db.execute('SELECT slug FROM articles WHERE id = ?', [id]);
    const existingSlug = existing.length > 0 ? existing[0].slug : '';
    
    // 保持原有 slug 或生成新的
    const safeSlug = slug || existingSlug || `article-${Date.now()}`;

    // 如果没有提供分类，获取数据库中的第一个分类
    let updateCategory = category;
    if (!updateCategory) {
      const [categories] = await db.execute('SELECT DISTINCT category FROM articles LIMIT 1');
      updateCategory = categories.length > 0 ? categories[0].category : '未分类';
    }

    await db.execute(
      `UPDATE articles 
       SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, cover_image = ?, read_time = ?, status = ?
       WHERE id = ?`,
      [
        title || '', 
        safeSlug, 
        excerpt !== undefined ? excerpt : null, 
        content !== undefined ? content : null, 
        updateCategory, 
        cover_image !== undefined ? cover_image : null, 
        read_time !== undefined ? parseInt(read_time) : 8, 
        status || 'published', 
        id
      ]
    );

    res.json({ message: '文章更新成功' });
  } catch (error) {
    console.error('更新文章错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除文章
app.delete('/api/articles/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM article_tags WHERE article_id = ?', [id]);
    await db.execute('DELETE FROM articles WHERE id = ?', [id]);

    res.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 图片上传接口
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    // 返回图片访问路径
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: '图片上传成功',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('图片上传错误:', error);
    res.status(500).json({ message: '图片上传失败' });
  }
});

// ==================== 评论 API ====================

// 获取文章的所有评论
app.get('/api/articles/:articleId/comments', async (req, res) => {
  try {
    const { articleId } = req.params;

    // 获取评论及其用户信息，支持嵌套回复
    const [comments] = await db.execute(
      `SELECT 
        c.id, c.content, c.article_id, c.user_id, c.parent_id, 
        c.status, c.created_at, c.updated_at,
        u.name as user_name, u.avatar as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.article_id = ? AND c.status = 'approved'
       ORDER BY c.created_at DESC`,
      [articleId]
    );

    // 构建评论树（支持嵌套回复）
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap[comment.parent_id];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.json({ comments: rootComments });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 添加评论
app.post('/api/articles/:articleId/comments', authenticateToken, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.userId;

    // 验证输入
    if (!content || !content.trim()) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    // 验证文章是否存在
    const [articles] = await db.execute(
      'SELECT id FROM articles WHERE id = ? AND status = ?',
      [articleId, 'published']
    );

    if (articles.length === 0) {
      return res.status(404).json({ message: '文章不存在' });
    }

    // 如果是回复，验证父评论是否存在
    if (parentId) {
      const [parentComments] = await db.execute(
        'SELECT id FROM comments WHERE id = ? AND article_id = ?',
        [parentId, articleId]
      );

      if (parentComments.length === 0) {
        return res.status(404).json({ message: '父评论不存在' });
      }
    }

    // 创建评论
    const [result] = await db.execute(
      'INSERT INTO comments (content, article_id, user_id, parent_id) VALUES (?, ?, ?, ?)',
      [content.trim(), articleId, userId, parentId || null]
    );

    // 获取创建的评论
    const [newComments] = await db.execute(
      `SELECT 
        c.id, c.content, c.article_id, c.user_id, c.parent_id, 
        c.status, c.created_at, c.updated_at,
        u.name as user_name, u.avatar as user_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    if (newComments.length === 0) {
      return res.status(500).json({ message: '评论创建失败' });
    }

    const newComment = newComments[0];
    newComment.replies = [];

    res.status(201).json({ 
      message: '评论添加成功',
      comment: newComment 
    });
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新评论
app.put('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    // 验证输入
    if (!content || !content.trim()) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    // 验证评论是否存在且属于当前用户
    const [comments] = await db.execute(
      'SELECT id, user_id FROM comments WHERE id = ?',
      [id]
    );

    if (comments.length === 0) {
      return res.status(404).json({ message: '评论不存在' });
    }

    if (comments[0].user_id !== userId) {
      return res.status(403).json({ message: '无权修改此评论' });
    }

    // 更新评论
    await db.execute(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content.trim(), id]
    );

    res.json({ message: '评论更新成功' });
  } catch (error) {
    console.error('更新评论错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除评论
app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // 验证评论是否存在
    const [comments] = await db.execute(
      'SELECT id, user_id FROM comments WHERE id = ?',
      [id]
    );

    if (comments.length === 0) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 验证是否是评论作者或管理员
    // 这里简化处理，只允许评论作者删除
    if (comments[0].user_id !== userId) {
      return res.status(403).json({ message: '无权删除此评论' });
    }

    // 删除评论（会级联删除子评论）
    await db.execute('DELETE FROM comments WHERE id = ?', [id]);

    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    // 获取所有已发布的文章
    const [articles] = await db.execute(
      `SELECT id, slug, updated_at 
       FROM articles 
       WHERE status = 'published' 
       ORDER BY updated_at DESC`
    );

    // 获取所有分类
    const [categories] = await db.execute(
      `SELECT DISTINCT category FROM articles WHERE status = 'published'`
    );

    const baseUrl = process.env.BASE_URL || 'https://your-blog-domain.com';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 首页
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>1.0</priority>\n`;
    sitemap += `  </url>\n`;

    // 文章列表页
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/articles</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>0.9</priority>\n`;
    sitemap += `  </url>\n`;

    // 各分类页面
    categories.forEach(cat => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/articles?category=${encodeURIComponent(cat.category)}</loc>\n`;
      sitemap += `    <lastmod>${today}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // 各文章页面
    articles.forEach(article => {
      const lastmod = article.updated_at 
        ? new Date(article.updated_at).toISOString().split('T')[0]
        : today;
      
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/article/${article.slug || article.id}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>monthly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('生成 sitemap 错误:', error);
    res.status(500).send('生成 sitemap 失败');
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
