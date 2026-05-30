const db = require('./db.cjs');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    console.log('Testing database connection...');
    const [result] = await db.execute('SELECT 1');
    console.log('DB OK');

    console.log('Testing user insert...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const [insertResult] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['测试用户', 'test2@example.com', hashedPassword]
    );
    console.log('Insert OK, ID:', insertResult.insertId);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
  process.exit(0);
}

test();
