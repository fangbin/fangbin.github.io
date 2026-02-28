# 快速入门指南

## 第一步：修改个人信息

### 1. 更新配置文件
编辑 `_config.yml`，修改以下信息：
```yaml
title: 你的网站标题
description: 网站描述
author: 你的姓名
email: your.email@example.com
```

### 2. 更新个人信息
在首页 `index.html` 中修改：
- 个人简介
- 社交媒体链接

### 3. 添加个人照片
将你的照片命名为 `profile.jpg`，放入 `images/` 文件夹

## 第二步：更新学术信息

### 1. 论文列表
编辑 `_data/publications.yml`，添加你的论文：
```yaml
- title: "论文标题"
  authors: "作者列表"
  journal: "期刊/会议名称"
  year: 2024
  doi: "DOI号（可选）"
  tags: ["标签1", "标签2"]
```

### 2. 教育背景
编辑 `_data/education.yml`：
```yaml
- degree: "学位"
  school: "学校名称"
  department: "院系"
  period: "年份"
  description: "描述"
```

### 3. 工作经历
编辑 `_data/work.yml`：
```yaml
- position: "职位"
  company: "公司/机构"
  period: "时间段"
  description: "工作描述"
```

## 第三步：发布到 GitHub

### 1. 创建 GitHub 仓库
- 登录 GitHub
- 创建新仓库，名称为 `yourusername.github.io`（将 yourusername 替换为你的 GitHub 用户名）

### 2. 推送代码
```bash
git init
git add .
git commit -m "Initial commit: Personal website"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

### 3. 启用 GitHub Pages
- 进入仓库 Settings → Pages
- Source 选择 "Deploy from a branch"
- Branch 选择 "main" 和 "/(root)"
- 点击 Save

### 4. 访问网站
几分钟后，访问 `https://yourusername.github.io` 查看你的个人主页

## 第四步：开始写博客

### 创建新文章
在 `_posts` 文件夹创建 Markdown 文件，命名格式：`YYYY-MM-DD-title.md`

### 文章模板
```markdown
---
layout: post
title: "文章标题"
date: 2024-01-20
categories: [分类]
tags: [标签1, 标签2]
---

文章内容使用 Markdown 语法编写...
```

## 可选：自定义域名

### 1. 修改 CNAME 文件
编辑 `CNAME` 文件，写入你的域名：
```
yourdomain.com
```

### 2. 配置 DNS
在你的域名服务商处添加 CNAME 记录：
- 类型：CNAME
- 名称：www（或 @）
- 值：yourusername.github.io

### 3. 等待生效
DNS 解析通常需要几分钟到几小时

## 本地预览（可选）

如果你想在本地预览网站：

### 1. 安装 Ruby
根据你的操作系统安装 Ruby：
- macOS: `brew install ruby`
- Linux: `sudo apt-get install ruby-full`
- Windows: 下载 RubyInstaller

### 2. 安装依赖
```bash
cd yourusername.github.io
gem install bundler
bundle install
```

### 3. 启动服务器
```bash
bundle exec jekyll serve
```

访问 `http://localhost:4000` 查看本地预览

## 常见问题

### Q: 网站没有更新？
A: GitHub Pages 构建可能需要几分钟，稍等片刻或清除浏览器缓存

### Q: 图片无法显示？
A: 检查图片路径是否正确，确保图片已上传到 `images/` 文件夹

### Q: 博客文章没有显示？
A: 确保文件名格式正确（YYYY-MM-DD-title.md），且 Front Matter 格式正确

### Q: 如何添加更多页面？
A: 在根目录创建新的 HTML 文件，使用 `layout: page` 布局

## 需要帮助？

- 查看 [README.md](README.md) 了解详细功能
- 访问 [Jekyll 文档](https://jekyllrb.com/docs/)
- 访问 [GitHub Pages 文档](https://docs.github.com/pages)

---

祝你使用愉快！🎉
