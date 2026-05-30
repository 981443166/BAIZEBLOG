-- 创建博客专用数据库用户（无密码，仅本地开发使用）
CREATE USER IF NOT EXISTS 'baizeblog'@'localhost' IDENTIFIED BY 'baize123';
GRANT ALL PRIVILEGES ON baizeblog.* TO 'baizeblog'@'localhost';
FLUSH PRIVILEGES;
