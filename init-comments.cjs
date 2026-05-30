const db = require('./server/db.cjs');
const fs = require('fs');
const path = require('path');

async function initComments() {
  try {
    console.log('正在初始化评论表...');
    
    // 读取SQL文件
    const sqlPath = path.join(__dirname, 'server', 'init-comments.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // 分割SQL语句（按分号分割）
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // 执行每条SQL语句
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement);
      }
    }
    
    console.log('评论表初始化成功！');
    
    // 验证表是否创建成功
    const [tables] = await db.execute("SHOW TABLES LIKE 'comments'");
    console.log('comments 表存在:', tables.length > 0);
    
  } catch (error) {
    console.error('初始化失败:', error.message);
  } finally {
    process.exit(0);
  }
}

initComments();