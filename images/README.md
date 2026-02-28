# GitHub Pages 个人主页

这是一个基于 Jekyll 的个人学术主页，支持博客功能。

## 项目结构

```
.
├── _config.yml          # Jekyll 配置文件
├── _posts/              # 博客文章（Markdown格式）
├── _layouts/            # 页面模板
├── _includes/           # 可复用组件
├── _data/               # 数据文件（论文、教育、工作经历）
├── assets/
│   ├── css/             # 样式文件
│   └── js/              # JavaScript文件
├── images/              # 图片资源
├── docs/                # 文档资源
├── blog/                # 博客页面
└── index.html           # 首页
```

## 快速开始

### 本地预览

1. 安装 Ruby 和 Bundler
2. 运行以下命令：

```bash
cd fangbin.github.io
bundle install
bundle exec jekyll serve
```

3. 访问 `http://localhost:4000`

### 添加博客文章

在 `_posts` 文件夹中创建新的 Markdown 文件，文件名格式为 `YYYY-MM-DD-title.md`。

文章头部需要包含 Front Matter：

```yaml
---
layout: post
title: "文章标题"
date: 2024-01-20
categories: [分类1, 分类2]
tags: [标签1, 标签2]
author: Your Name
---
```

### 更新个人信息

编辑 `_config.yml` 文件中的基本信息。

更新论文列表、教育背景和工作经历，编辑 `_data` 文件夹中的 YAML 文件。

## 功能特点

- ✅ 响应式设计，适配移动端
- ✅ 博客系统，支持分类和标签
- ✅ 自动生成文章页面
- ✅ 简洁大方的设计风格
- ✅ 加载速度优化
- ✅ SEO 优化

## 发布到 GitHub Pages

1. 创建名为 `username.github.io` 的 GitHub 仓库
2. 将项目推送到 main 分支
3. 在仓库设置中启用 GitHub Pages，选择 main 分支
4. 访问 `https://username.github.io`

## 自定义

### 修改样式

编辑 `assets/css/main.css` 文件。

### 修改模板

编辑 `_layouts` 和 `_includes` 文件夹中的 HTML 文件。

### 添加页面

在根目录创建新的 HTML 文件，使用 `layout: default` 或 `layout: page` 布局。

## 许可证

MIT License
