# BaizeBlog

> 白泽的博客 · 极简全栈博客系统

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4-000?logo=express)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)](https://mysql.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vite.dev)
[![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock)](https://gsap.com)

---

## 特性

- **Stone 色系** — 暖灰基底 + 衬线字体，沉稳静谧的阅读氛围
- **暗黑模式** — 亮色/暗色一键切换，跟随系统偏好
- **中英双语** — i18next 驱动，结构清晰，轻松扩展
- **响应式** — 桌面宽屏到移动端，处处精致
- **Markdown 编辑** — `@uiw/react-md-editor` 后台集成，实时预览
- **评论系统** — 文章评论 + 嵌套回复，JWT 认证
- **实时搜索** — 标题、分类、摘要毫秒级检索
- **GSAP 动画** — 页面过渡 + 滚动微交互

---

## 技术栈

| 层 | 技术 |
|:---:|------|
| 前端 | React 19 · Vite 6 · Tailwind CSS 4 |
| 动画 | GSAP 3 · @gsap/react |
| 路由 | React Router 7 · react-i18next |
| 编辑 | @uiw/react-md-editor · react-markdown · react-syntax-highlighter |
| 后端 | Express 4 · MySQL2 · JWT · bcryptjs · Multer |
| 构建 | Vite · PostCSS · Autoprefixer |

---

## 快速开始

**需要** Node.js ≥ 18 · MySQL ≥ 8.0

```bash
git clone https://github.com/your-username/baizeblog.git
cd baizeblog
npm install
```

创建 `.env`：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=baizeblog
JWT_SECRET=your_jwt_secret
PORT=3001
```

```bash
mysql -u root -p < server/init-db.sql   # 初始化数据库
npm run server:dev                       # 后端 → :3001
npm run dev                              # 前端 → :5173
```

---

## 项目结构

```
BaizeBlog/
├── public/                  # 静态资源 & 上传文件
├── server/                  # Express 后端
│   ├── index.cjs           # 路由 & 中间件 & 认证
│   ├── db.cjs              # MySQL 连接池
│   └── init-db.sql         # 建表脚本
├── src/                     # React 前端
│   ├── api/                # API 封装
│   ├── components/         # 通用组件
│   │   ├── Home.jsx        # 首页 (Hero + 分类 + 列表)
│   │   ├── Articles.jsx    # 文章列表 & 搜索
│   │   ├── Hero.jsx        # 文章详情
│   │   ├── Navbar.jsx      # 导航栏
│   │   ├── CommentSection.jsx  # 评论区
│   │   ├── CommentItem.jsx # 评论项 & 嵌套回复
│   │   ├── Login.jsx       # 登录/注册表单
│   │   ├── SEOHead.jsx     # SEO Meta
│   │   └── AnimatedSection.jsx  # GSAP 动画包装
│   ├── pages/              # 页面入口
│   │   ├── AdminPage.jsx   # 后台管理
│   │   ├── LoginPage.jsx   # 登录页
│   │   ├── AboutPage.jsx   # 关于
│   │   ├── ProfilePage.jsx # 个人资料
│   │   └── SettingsPage.jsx    # 偏好设置
│   ├── hooks/              # useAuth 上下文
│   ├── i18n/               # zh.json · en.json
│   ├── App.jsx             # 路由 & 布局
│   ├── main.jsx            # 入口
│   └── index.css           # 全局样式 & Tailwind 配置
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## 路由

| 路径 | 页面 | 权限 |
|------|------|:--:|
| `/` | 首页 | 公开 |
| `/articles` | 文章列表 | 公开 |
| `/article/:id` | 文章详情 | 公开 |
| `/about` | 关于 | 公开 |
| `/login` | 登录 / 注册 | 游客 |
| `/admin` | 后台管理 | 🔒 |
| `/profile` | 个人资料 | 🔒 |
| `/settings` | 偏好设置 | 🔒 |

---

## API

### 认证

| 方法 | 端点 | 说明 |
|:--:|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 当前用户 |
| PUT | `/api/auth/profile` | 更新资料 |
| PUT | `/api/auth/password` | 修改密码 |

### 文章

| 方法 | 端点 | 说明 |
|:--:|------|------|
| GET | `/api/articles` | 列表 |
| GET | `/api/articles/:id` | 详情 |
| POST | `/api/articles` | 创建 🔒 |
| PUT | `/api/articles/:id` | 更新 🔒 |
| DELETE | `/api/articles/:id` | 删除 🔒 |

### 评论 & 点赞

| 方法 | 端点 | 说明 |
|:--:|------|------|
| GET | `/api/comments/:articleId` | 文章评论 |
| POST | `/api/comments` | 发表 🔒 |
| DELETE | `/api/comments/:id` | 删除 🔒 |
| POST | `/api/likes/:articleId` | 点赞 🔒 |
| GET | `/api/likes/:articleId` | 点赞数 |

### 其他

| 方法 | 端点 | 说明 |
|:--:|------|------|
| GET | `/api/categories` | 分类列表 |
| POST | `/api/upload` | 上传图片 🔒 |

---

## 数据模型

| 表 | 字段 |
|----|------|
| **users** | id, name, email, password, avatar, bio, created_at |
| **articles** | id, title, slug, content, excerpt, category, cover_image, read_time, author_id, status, created_at, updated_at |
| **comments** | id, article_id, user_id, parent_id, content, created_at |
| **likes** | id, article_id, user_id, created_at |

---

## 部署

```bash
npm run build   # → dist/
```

- **前端**: Vercel · Netlify · Cloudflare Pages
- **后端**: Railway · Render · VPS
- **数据库**: PlanetScale · Supabase · 自建 MySQL

---

## 路线图

- [x] 文章 CRUD · Markdown 渲染
- [x] 暗黑模式
- [x] 中英双语
- [x] 评论 + 回复
- [x] 用户认证
- [x] 后台管理
- [x] 文章点赞
- [ ] 标签系统
- [ ] RSS 订阅
- [ ] 全文搜索
- [ ] 图片懒加载

---

MIT · 用热爱构建，以文字记录
