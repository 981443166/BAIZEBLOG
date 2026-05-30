const db = require('./server/db.cjs');

async function check() {
  try {
    const [users] = await db.execute("SHOW TABLES LIKE 'users'");
    console.log('users table exists:', users.length > 0);

    const [articles] = await db.execute("SHOW TABLES LIKE 'articles'");
    console.log('articles table exists:', articles.length > 0);

    if (users.length === 0) {
      console.log('Need to create tables');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
  process.exit(0);
}

check();
