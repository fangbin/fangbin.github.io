---
layout: post
title: "Jekyll博客搭建教程"
date: 2024-01-20
categories: [技术博客]
tags: [Jekyll, GitHub Pages, 教程]
author: Your Name
---

本教程将介绍如何使用 Jekyll 和 GitHub Pages 搭建个人博客。

## 什么是 Jekyll？

Jekyll 是一个静态网站生成器，它可以将 Markdown 文件转换为静态 HTML 页面。GitHub Pages 原生支持 Jekyll，因此非常适合搭建个人博客。

## 为什么选择 Jekyll？

- **简单**：只需 Markdown 文件，无需数据库
- **快速**：静态页面加载速度快
- **安全**：没有动态脚本，安全性高
- **免费**：GitHub Pages 提供免费托管
- **版本控制**：使用 Git 管理内容

## 项目结构

一个典型的 Jekyll 博客项目结构如下：

```
yourusername.github.io/
├── _config.yml          # 配置文件
├── _posts/              # 博客文章
│   └── 2024-01-15-article.md
├── _layouts/            # 页面模板
│   ├── default.html
│   └── post.html
├── _includes/           # 可复用组件
│   ├── header.html
│   └── footer.html
├── _data/               # 数据文件
│   └── members.yml
├── assets/              # 静态资源
│   ├── css/
│   └── js/
├── images/              # 图片
├── docs/                # 文档
└── index.html           # 首页
```

## 快速开始

### 1. 创建仓库

在 GitHub 创建名为 `username.github.io` 的仓库。

### 2. 安装 Jekyll

```bash
gem install jekyll bundler
jekyll new myblog
cd myblog
```

### 3. 本地预览

```bash
bundle exec jekyll serve
```

访问 `http://localhost:4000` 查看网站。

### 4. 发布到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/username.github.io.git
git push -u origin main
```

## 自定义配置

编辑 `_config.yml` 文件来自定义你的站点：

```yaml
title: 我的博客
email: your.email@example.com
description: 分享技术与生活
baseurl: ""
url: "https://username.github.io"
```

## 写作技巧

### 使用 Front Matter

每篇文章都需要 Front Matter：

```yaml
---
layout: post
title: "文章标题"
date: 2024-01-20
categories: [技术]
tags: [Jekyll]
---
```

### 图片优化

推荐做法：

1. 压缩图片文件
2. 使用适当的尺寸
3. 添加 `loading="lazy"` 属性

```html
<img src="/images/photo.jpg" alt="描述" loading="lazy">
```

## 总结

Jekyll + GitHub Pages 是搭建个人博客的绝佳选择，简单、快速、免费！

---

如果你有任何问题，欢迎在评论区讨论。
