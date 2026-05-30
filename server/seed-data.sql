USE baizeblog;

INSERT IGNORE INTO users (id, name, email, password) VALUES 
(1, '白泽', 'baize@example.com', '$2a$10$YourHashedPasswordHere');

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

INSERT IGNORE INTO tags (id, name) VALUES
(1, '极简主义'), (2, '设计哲学'), (3, 'UI设计'), (4, 'React'), (5, '前端');

INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5);
