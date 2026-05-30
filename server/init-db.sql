-- 创建数据库
CREATE DATABASE IF NOT EXISTS baizeblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE baizeblog;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500) DEFAULT NULL,
  category VARCHAR(100) NOT NULL,
  cover_image VARCHAR(500) DEFAULT NULL,
  read_time INT DEFAULT 0,
  author_id INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  article_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章点赞表
CREATE TABLE IF NOT EXISTS article_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (article_id, user_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例用户（密码: 123456）
-- 密码使用 bcrypt 加密，这是示例哈希值
INSERT IGNORE INTO users (id, name, email, password) VALUES 
(1, '白泽', 'baize@example.com', '$2a$10$YourHashedPasswordHere');

-- 插入示例文章
INSERT IGNORE INTO articles (id, title, slug, content, excerpt, category, read_time, author_id) VALUES
(1, '关于极简设计的边界', 'minimal-design-boundary', 
'极简设计不是简单的少，而是恰到好处的多。在这篇文章中，我们将探讨如何在视觉与功能之间找到平衡点...',
'极简不是少，而是刚好。探讨如何在视觉与功能之间找到平衡点，让设计回归本质，在留白中传递力量...',
'设计思考', 8, 1),
(2, 'React 与状态管理的反思', 'react-state-management',
'从 Redux 到 Zustand，再到 React Context，状态管理的演进反映了前端开发的简化趋势...',
'从 Redux 到 Zustand，再到 React Context，状态管理的演进反映了前端开发的简化趋势与本质回归...',
'技术随笔', 12, 1),
(3, '一个程序员的周末', 'programmer-weekend',
'不写代码的时候，我在做什么。关于咖啡、阅读和慢生活的思考...',
'不写代码的时候，我在做什么。关于咖啡、阅读和慢生活的思考，以及如何在忙碌中寻找内心的平静...',
'生活记录', 6, 1);

-- 插入标签
INSERT IGNORE INTO tags (id, name) VALUES
(1, '极简主义'), (2, '设计哲学'), (3, 'UI设计'), (4, 'React'), (5, '前端');

-- 关联文章标签
INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5);
