---
name: fix-code-highlight-dark-mode
overview: 修复代码高亮在亮色/暗色模式切换时背景颜色不变化的问题
todos:
  - id: fix-code-highlight-background
    content: 修改 Hero.jsx 移除 customStyle 中的 background 属性
    status: completed
  - id: fix-line-number-color
    content: 修改 Hero.jsx 移除 lineNumberStyle 中的 color 属性
    status: completed
    dependencies:
      - fix-code-highlight-background
  - id: verify-css-dark-mode
    content: 验证 index.css 中暗黑模式样式正确生效
    status: completed
    dependencies:
      - fix-line-number-color
  - id: test-dark-mode-switch
    content: 测试亮色/暗色模式切换时代码块背景颜色变化
    status: completed
    dependencies:
      - verify-css-dark-mode
---

## 需求概述

修复代码高亮背景颜色在亮色/暗色模式切换时不变化的问题。

## 问题分析

- Hero.jsx 第 172 行 `const isDark = document.documentElement.classList.contains('dark');` 只在组件渲染时执行一次
- 用户切换暗黑模式时，html 元素的 class 会变化，但组件不会重新渲染
- `customStyle` 内联样式优先级高于 CSS，覆盖了 CSS 中的暗黑模式样式

## 修复目标

- 移除 Hero.jsx 中 `customStyle` 的 `background` 属性
- 移除 `lineNumberStyle` 中的 `color` 属性
- 依靠 CSS 的 `.dark .prose-elegant pre > div` 来控制背景色
- 依靠 CSS 的 `.dark .prose-elegant pre > div .linenumber` 来控制行号颜色

## 技术栈

- 前端框架：React 19 + Vite
- 样式：Tailwind CSS v4 + 自定义 CSS
- 代码高亮：react-syntax-highlighter (Prism)

## 技术方案

### 方案选择：CSS 控制背景色（推荐）

**原理**：移除 Hero.jsx 中的内联背景色设置，依靠 CSS 的暗黑模式选择器来控制代码块背景色和行号颜色。

**优点**：

- 简单直接，代码量最少
- CSS 自动响应暗黑模式切换，无需 JavaScript 监听
- 性能最优，无额外计算

**实现步骤**：

1. 移除 `customStyle` 中的 `background` 属性
2. 移除 `lineNumberStyle` 中的 `color` 属性
3. 保留 `style` 属性中的主题选择（vscDarkPlus vs vs），因为主题包含语法高亮颜色
4. CSS 中的 `!important` 确保优先级足够高

## 涉及文件

- `d:\AI Demo\BaizeBlog\src\components\Hero.jsx` - 移除内联背景色
- `d:\AI Demo\BaizeBlog\src\index.css` - 确保暗黑模式样式正确（已存在）