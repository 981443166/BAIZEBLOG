# BaizeBlog - 白泽的博客

一个现代极简风格的个人博客系统，采用 React + Express + MySQL 全栈架构，支持多语言国际化、暗黑模式、文章管理等功能。

## 功能特性

### 前端功能
- **极简设计** - 采用 stone 色系，现代优雅的视觉风格
- **响应式布局** - 完美适配桌面端和移动端
- **暗黑模式** - 支持亮色/暗色主题切换，自动跟随系统偏好
- **国际化** - 支持中文/英文双语切换
- **流畅动画** - 使用 Framer Motion 实现页面过渡和微交互
- **实时搜索** - 支持文章标题、分类、摘要的实时搜索
- **分类筛选** - 首页分类卡片支持点击跳转筛选
- **SEO 优化** - 每个页面独立的 meta 标签和结构化数据

### 后台功能
- **文章管理** - 创建、编辑、删除文章，支持草稿和发布状态
- **Markdown 编辑器** - 支持 Markdown 语法和实时预览
- **图片上传** - 支持文章封面图片上传
- **评论系统** - 文章评论、回复、删除功能
- **用户认证** - JWT 认证，注册/登录/个人资料管理
- **设置页面** - 外观、通知、账户安全等设置

## 技术栈

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.0 | 用户界面构建 |
| Vite | 6.2 | 构建工具 |
| Tailwind CSS | 4.0 | 样式框架 |
| Framer Motion | 12.5 | 动画库 |
| React Router | 7.4 | 路由管理 |
| react-i18next | 17.0 | 国际化 |
| react-markdown | 10.1 | Markdown 渲染 |

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| Express | 4.21 | Web 框架 |
| MySQL2 | 3.12 | 数据库驱动 |
| JWT | 9.0 | 身份认证 |
| bcryptjs | 2.4 | 密码加密 |
| Multer | 2.1 | 文件上传 |

## 快速开始

### 环境要求
- Node.js >= 18
- MySQL >= 8.0
- npm 或 yarn

### 1. 克隆项目

```bash
git clone https://github.com/your-username/baizeblog.git
cd baizeblog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置数据库

创建 `.env` 文件并配置数据库连接：

```env
# 数据库配置
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=baizeblog

# JWT 密钥
JWT_SECRET=your_jwt_secret_key

# 服务器端口
PORT=3001
```

初始化数据库：

```bash
mysql -u root -p < server/init-db.sql
```

### 4. 启动后端服务

```bash
npm run server
```

后端服务将在 http://localhost:3001 启动

### 5. 启动前端开发服务器

```bash
npm run dev
```

前端将在 http://localhost:5173 启动

## 项目结构

```
BaizeBlog/
├── public/                    # 静态资源
├── server/                    # 后端代码
│   ├── index.cjs             # Express 服务器主文件
│   ├── db.cjs                # 数据库连接配置
│   ├── init-db.sql           # 数据库初始化脚本
│   ├── init-comments.sql     # 评论表初始化
│   └── uploads/              # 上传文件存储
├── src/                       # 前端代码
│   ├── api/                  # API 接口
│   │   ├── auth.js           # 认证相关 API
│   │   └── translate.js      # 翻译 API
│   ├── components/           # 组件
│   │   ├── Navbar.jsx        # 导航栏
│   │   ├── Home.jsx          # 首页
│   │   ├── Articles.jsx      # 文章列表
│   │   ├── Hero.jsx          # 文章详情
│   │   ├── Login.jsx         # 登录组件
│   │   ├── CommentSection.jsx # 评论区
│   │   ├── CommentItem.jsx   # 评论项
│   │   └── SEOHead.jsx       # SEO 组件
│   ├── hooks/                # 自定义 Hooks
│   │   └── useAuth.jsx       # 认证上下文
│   ├── i18n/                 # 国际化配置
│   │   ├── index.js          # i18n 初始化
│   │   ├── zh.json           # 中文翻译
│   │   └── en.json           # 英文翻译
│   ├── pages/                # 页面组件
│   │   ├── LoginPage.jsx     # 登录页
│   │   ├── AdminPage.jsx     # 后台管理
│   │   ├── AboutPage.jsx     # 关于页
│   │   ├── ProfilePage.jsx   # 个人资料
│   │   └── SettingsPage.jsx  # 设置页
│   ├── App.jsx               # 路由配置
│   ├── main.jsx              # 入口文件
│   └── index.css             # 全局样式
├── .env                       # 环境变量
├── package.json               # 项目配置
├── vite.config.js             # Vite 配置
└── README.md                  # 项目说明
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 首页，展示 Hero、分类、文章列表 |
| `/articles` | Articles | 文章列表页，支持分类筛选 |
| `/article/:id` | Hero | 文章详情页 |
| `/login` | LoginPage | 登录/注册页 |
| `/admin` | AdminPage | 后台文章管理 |
| `/about` | AboutPage | 关于页面 |
| `/profile` | ProfilePage | 个人资料页 |
| `/settings` | SettingsPage | 设置页面 |

## API 接口

### 认证相关
```
POST   /api/auth/register    # 用户注册
POST   /api/auth/login       # 用户登录
GET    /api/auth/me          # 获取当前用户信息
PUT    /api/auth/profile     # 更新个人资料
PUT    /api/auth/password    # 修改密码
```

### 文章相关
```
GET    /api/articles         # 获取文章列表
GET    /api/articles/:id     # 获取单篇文章
POST   /api/articles         # 创建文章
PUT    /api/articles/:id     # 更新文章
DELETE /api/articles/:id     # 删除文章
```

### 分类相关
```
GET    /api/categories       # 获取所有分类
```

### 评论相关
```
GET    /api/comments/:articleId  # 获取文章评论
POST   /api/comments             # 发表评论
DELETE /api/comments/:id         # 删除评论
```

### 文件上传
```
POST   /api/upload           # 上传图片
```

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| name | VARCHAR(100) | 用户名 |
| email | VARCHAR(255) | 邮箱（唯一） |
| password | VARCHAR(255) | 加密密码 |
| avatar | VARCHAR(500) | 头像 URL |
| bio | TEXT | 个人简介 |
| created_at | TIMESTAMP | 创建时间 |

### articles 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| title | VARCHAR(255) | 标题 |
| slug | VARCHAR(255) | URL 别名 |
| content | LONGTEXT | 内容 |
| excerpt | TEXT | 摘要 |
| category | VARCHAR(100) | 分类 |
| cover_image | VARCHAR(500) | 封面图片 |
| read_time | INT | 阅读时间（分钟） |
| author_id | INT | 作者 ID |
| status | ENUM('published', 'draft') | 状态 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### comments 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| article_id | INT | 文章 ID |
| user_id | INT | 用户 ID |
| parent_id | INT | 父评论 ID |
| content | TEXT | 评论内容 |
| created_at | TIMESTAMP | 创建时间 |

## 国际化

项目支持中文和英文两种语言，语言包位于 `src/i18n/` 目录：

- `zh.json` - 中文翻译
- `en.json` - 英文翻译

切换语言的方式：
1. 导航栏语言切换按钮
2. 设置页面语言选项

## 部署

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 部署建议
- 前端：Vercel、Netlify、Cloudflare Pages
- 后端：Railway、Render、自建服务器
- 数据库：PlanetScale、Supabase、自建 MySQL

## 开发计划

- [x] 基础博客功能
- [x] 暗黑模式
- [x] 国际化支持
- [x] 评论系统
- [x] 文章管理后台
- [x] 设置页面
- [ ] 文章标签系统
- [x] 文章点赞功能
- [ ] 文章分享功能
- [ ] RSS 订阅
- [ ] 全文搜索优化
- [ ] 性能优化（图片懒加载、代码分割）

## 许可证

MIT License

## 作者

白泽 - [GitHub](https://github.com/your-username) | [Twitter](https://twitter.com/your-username)

---

> 用热爱构建，以文字记录
