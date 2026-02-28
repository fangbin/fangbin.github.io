# GitHub Pages 个人主页

一个基于 Jekyll 的个人学术主页网站，支持博客功能，使用 main 分支作为发布分支。

## ✨ 功能特点

- 🎨 **简洁大方的设计**：现代化UI设计，视觉效果优美
- 📱 **移动端适配**：完全响应式设计，支持各种设备
- 📝 **博客系统**：支持 Markdown 写作，自动生成文章页面
- 🏷️ **分类标签**：文章支持分类和标签功能
- 📄 **个人信息**：展示教育背景、工作经历、发表论文
- ⚡ **性能优化**：懒加载、资源优化，加载速度快
- 🔍 **SEO优化**：完善的 meta 标签和 sitemap

## 📁 项目结构

```
fangbin.github.io/
├── _config.yml              # Jekyll 配置文件
├── _posts/                  # 博客文章（Markdown格式）
├── _layouts/                # 页面模板
│   ├── default.html         # 默认布局
│   ├── post.html            # 文章布局
│   └── page.html            # 页面布局
├── _includes/               # 可复用组件
│   ├── head.html            # HTML头部
│   ├── header.html          # 导航栏
│   └── footer.html          # 页脚
├── _data/                   # 数据文件
│   ├── publications.yml     # 论文列表
│   ├── education.yml        # 教育背景
│   └── work.yml             # 工作经历
├── assets/
│   ├── css/main.css         # 主样式文件
│   └── js/main.js           # 主脚本文件
├── images/                  # 图片资源
├── docs/                    # 文档资源
├── blog/                    # 博客页面
├── index.html               # 首页
├── feed.xml                 # RSS 订阅
├── sitemap.xml              # 网站地图
└── robots.txt               # 爬虫规则
```

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/yourusername.github.io.git
cd yourusername.github.io
```

### 2. 本地预览

确保已安装 Ruby（版本 2.5.0 或更高）和 Bundler：

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 或者使用自动重载
bundle exec jekyll serve --livereload
```

访问 `http://localhost:4000` 查看网站。

### 3. 发布到 GitHub Pages

1. 在 GitHub 创建名为 `yourusername.github.io` 的仓库
2. 推送代码到 main 分支
3. 在仓库 Settings → Pages 中选择 main 分支作为发布分支
4. 访问 `https://yourusername.github.io`

## 📝 使用指南

### 添加博客文章

在 `_posts` 文件夹中创建新的 Markdown 文件，文件名格式：`YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "文章标题"
date: 2024-01-20
categories: [技术]
tags: [Jekyll, 博客]
author: Your Name
---

文章内容...
```

### 更新个人信息

编辑 `_config.yml` 文件：

```yaml
title: 个人主页
description: 个人学术主页
author: Your Name
email: your.email@example.com
```

### 更新论文列表

编辑 `_data/publications.yml`：

```yaml
- title: "论文标题"
  authors: "作者列表"
  journal: "期刊名称"
  year: 2024
  doi: "10.1000/xxx"
  tags: ["机器学习"]
```

### 更新教育背景

编辑 `_data/education.yml`：

```yaml
- degree: "博士学位"
  school: "某某大学"
  period: "2020 - 2024"
  description: "研究方向"
```

### 更新工作经历

编辑 `_data/work.yml`：

```yaml
- position: "职位名称"
  company: "公司名称"
  period: "2020 - 至今"
  description: "工作描述"
```

### 添加图片

将图片放入 `images/` 文件夹，然后在文章或页面中引用：

```markdown
![图片描述](/images/photo.jpg)
```

## 🎨 自定义样式

### 修改颜色主题

编辑 `assets/css/main.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
  --accent-color: #e74c3c;
  /* ... */
}
```

### 修改字体

在 `_includes/head.html` 中更改 Google Fonts 链接。

## 🔧 高级配置

### 启用 Google Analytics

在 `_includes/head.html` 中添加 Google Analytics 代码。

### 启用评论系统

可以使用 Disqus、Utterances 或其他评论系统。

### 自定义域名

1. 在仓库根目录创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处配置 DNS 解析

## 📄 文件说明

| 文件/文件夹 | 说明 |
|------------|------|
| `_config.yml` | Jekyll 主配置文件 |
| `Gemfile` | Ruby 依赖管理 |
| `_posts/` | 博客文章存放位置 |
| `_data/` | 结构化数据（YAML格式） |
| `assets/` | 静态资源（CSS、JS） |
| `images/` | 图片资源 |
| `docs/` | 文档资源（PDF等） |

## 🌐 SEO 优化

网站已包含以下 SEO 优化：

- ✅ Meta 标签（title、description、keywords）
- ✅ Open Graph 标签（社交媒体分享）
- ✅ Sitemap.xml（搜索引擎索引）
- ✅ Robots.txt（爬虫规则）
- ✅ RSS Feed（订阅功能）
- ✅ 结构化数据

## 📱 移动端适配

- 响应式布局，支持各种屏幕尺寸
- 移动端导航菜单
- 图片自适应
- 触摸友好的交互

## ⚡ 性能优化

- CSS 和 JS 文件精简
- 图片懒加载
- 资源预连接（preconnect）
- 字体优化加载
- 缓存友好

## 📖 学习资源

- [Jekyll 官方文档](https://jekyllrb.com/docs/)
- [GitHub Pages 文档](https://docs.github.com/pages)
- [Liquid 模板语言](https://shopify.github.io/liquid/)
- [Markdown 语法](https://www.markdownguide.org/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License

---

**祝你使用愉快！如有问题欢迎提 Issue。**
