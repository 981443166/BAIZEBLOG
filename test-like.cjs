const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLike() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baizeblog'
  });

  try {
    console.log('测试点赞功能...');
    
    // 检查article_likes表是否存在
    const [tables] = await connection.execute("SHOW TABLES LIKE 'article_likes'");
    if (tables.length === 0) {
      console.log('✗ article_likes 表不存在，请先运行 npm run init-likes');
      return;
    }
    
    console.log('✓ article_likes 表存在');
    
    // 检查表结构
    const [columns] = await connection.execute("DESCRIBE article_likes");
    console.log('表结构:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''} ${col.Key === 'UNI' ? 'UNIQUE' : ''}`);
    });
    
    // 检查是否有数据
    const [likes] = await connection.execute("SELECT COUNT(*) as count FROM article_likes");
    console.log(`当前点赞记录数: ${likes[0].count}`);
    
    // 检查文章表
    const [articles] = await connection.execute("SELECT COUNT(*) as count FROM articles WHERE status = 'published'");
    console.log(`已发布文章数: ${articles[0].count}`);
    
    // 检查用户表
    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users");
    console.log(`用户数: ${users[0].count}`);
    
    console.log('\n点赞功能测试完成！');
    console.log('要测试点赞功能，请：');
    console.log('1. 启动服务器: npm run server');
    console.log('2. 启动前端: npm run dev');
    console.log('3. 登录后访问文章详情页，点击点赞按钮');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  } finally {
    await connection.end();
  }
}

testLike();