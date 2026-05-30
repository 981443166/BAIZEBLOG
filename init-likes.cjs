const mysql = require('mysql2/promise');
require('dotenv').config();

async function initLikes() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baizeblog'
  });

  try {
    console.log('正在创建文章点赞表...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS article_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (article_id, user_id),
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('文章点赞表创建成功！');
    
    // 检查表是否存在
    const [tables] = await connection.execute("SHOW TABLES LIKE 'article_likes'");
    if (tables.length > 0) {
      console.log('✓ article_likes 表已存在');
    } else {
      console.log('✗ article_likes 表不存在');
    }
    
  } catch (error) {
    console.error('创建点赞表失败:', error.message);
  } finally {
    await connection.end();
  }
}

initLikes();