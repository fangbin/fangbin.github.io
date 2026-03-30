# 博客文章发布指南

## 文章存放位置

博客文章存放在 `amytis-blog/content/posts/` 目录下，使用 **MDX** 格式（Markdown + JSX）。

## 创建新文章

### 1. 创建文件

在 `/Users/ericbinder/Documents/repos/githubpage/amytis-blog/content/posts/` 目录下创建新文件：

```
文件名格式: YYYY-MM-DD-slug.mdx
示例: 2024-03-15-my-new-post.mdx
```

### 2. 文章模板

```mdx
---
title: 文章标题
date: 2024-03-15
authors: ["Your Name"]
tags: ["标签1", "标签2"]
excerpt: 文章摘要（可选）
---

正文内容从这里开始...

## 标题示例

正文段落...

### 代码示例

\`\`\`javascript
console.log("Hello World");
\`\`\`

### 图片

![图片描述](./images/example.png)

> 引用示例
```

### 3. 添加图片

文章图片存放在 `amytis-blog/public/posts/images/` 目录，引用方式：

```mdx
![图片描述](/posts/images/your-image.png)
```

## 本地预览

### 预览博客

```bash
cd /Users/ericbinder/Documents/repos/githubpage/amytis-blog
bun run dev
```

访问 http://localhost:3000/amytis-style/

### 预览主页 + 博客

```bash
# 终端1：启动 Jekyll
cd /Users/ericbinder/Documents/repos/githubpage/fangbin.github.io
bundle exec jekyll serve

# 终端2：构建并复制博客
cd /Users/ericbinder/Documents/repos/githubpage/amytis-blog
bun run build
cp -r out /Users/ericbinder/Documents/repos/githubpage/fangbin.github.io/_site/amytis-style
```

访问 http://127.0.0.1:4000/

## 发布流程

### 方法一：完整构建发布

```bash
# 1. 构建博客
cd /Users/ericbinder/Documents/repos/githubpage/amytis-blog
bun run build

# 2. 更新主页仓库中的博客目录
cd /Users/ericbinder/Documents/repos/githubpage/fangbin.github.io
rm -rf amytis-style
cp -r /Users/ericbinder/Documents/repos/githubpage/amytis-blog/out amytis-style

# 3. 提交并推送
git add amytis-style
git commit -m "更新博客文章: 文章标题"
git push
```

### 方法二：快捷脚本（推荐）

创建发布脚本 `publish.sh`：

```bash
#!/bin/bash
cd /Users/ericbinder/Documents/repos/githubpage/amytis-blog
bun run build
cd /Users/ericbinder/Documents/repos/githubpage/fangbin.github.io
rm -rf amytis-style
cp -r /Users/ericbinder/Documents/repos/githubpage/amytis-blog/out amytis-style
git add amytis-style
git commit -m "$1"
git push
```

使用方式：
```bash
./publish.sh "发布新文章: XXX"
```

## 文章目录结构

```
amytis-blog/
├── content/
│   └── posts/
│       ├── 2024-01-15-welcome.mdx
│       ├── 2024-02-20-jekyll-tutorial.mdx
│       └── 2024-03-15-my-new-post.mdx    # 新文章
├── public/
│   └── posts/
│       └── images/
│           └── example.png               # 文章图片
└── site.config.ts                        # 站点配置
```

## 常用命令速查

| 操作 | 命令 |
|------|------|
| 本地开发博客 | `cd amytis-blog && bun run dev` |
| 构建博客 | `cd amytis-blog && bun run build` |
| 本地预览主页 | `cd fangbin.github.io && bundle exec jekyll serve` |
| 发布更新 | `git add . && git commit -m "msg" && git push` |

## 注意事项

1. **文件编码**：使用 UTF-8 编码
2. **文件名**：只使用小写字母、数字和连字符
3. **Front Matter**：必须有 `title` 和 `date` 字段
4. **推送后**：GitHub Actions 自动构建，约 1-2 分钟后生效
