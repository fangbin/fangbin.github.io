# 博客写作指南

本文档说明如何在独立的文件夹中添加和管理博客文章。

## 📁 文件夹结构

博客文章现在分为两个独立的文件夹：

```
_tech/           # 技术博客文件夹
├── 2024-01-20-jekyll-tutorial.md
└── 2024-02-01-research-notes.md

_essays/         # 随笔杂文文件夹
└── 2024-01-15-welcome.md

_posts/          # 通用博客文件夹（可选）
└── 其他文章...
```

## 📝 快速开始

### 技术博客

1. **创建文件**：在 `_tech` 文件夹中创建 Markdown 文件
2. **命名格式**：`YYYY-MM-DD-title.md`
3. **URL 格式**：`/blog/tech/YYYY/MM/DD/title/`

### 随笔杂文

1. **创建文件**：在 `_essays` 文件夹中创建 Markdown 文件
2. **命名格式**：`YYYY-MM-DD-title.md`
3. **URL 格式**：`/blog/essays/YYYY/MM/DD/title/`

## 📋 文章模板

### 技术博客模板

在 `_tech` 文件夹中创建：

```markdown
---
layout: post
title: "技术文章标题"
date: 2024-03-01
tags: [技术标签, 编程语言]
author: Your Name
---

## 前言

简要介绍文章背景...

## 正文

### 1. 第一部分

内容...

```python
# 代码示例
print("Hello, World!")
```

### 2. 第二部分

内容...

## 总结

总结内容...
```

**注意**：技术博客会自动添加 `category: 技术博客`，无需手动指定。

### 随笔杂文模板

在 `_essays` 文件夹中创建：

```markdown
---
layout: post
title: "随笔文章标题"
date: 2024-03-01
tags: [生活, 感悟]
author: Your Name
---

## 引言

开头引入...

## 正文

内容...

## 结语

结语内容...
```

**注意**：随笔杂文会自动添加 `category: 随笔杂文`，无需手动指定。

## 🎯 分类说明

### 技术博客 (`_tech`)

**适用内容**：
- 编程教程
- 技术分享
- 项目实践
- 研究笔记
- 工具使用
- 问题解决

**URL 示例**：
- 文件：`_tech/2024-03-01-python-tutorial.md`
- 访问：`https://yourusername.github.io/blog/tech/2024/03/01/python-tutorial/`

### 随笔杂文 (`_essays`)

**适用内容**：
- 生活感悟
- 学习心得
- 读书笔记
- 个人见解
- 旅行游记
- 心情记录

**URL 示例**：
- 文件：`_essays/2024-03-01-life-thoughts.md`
- 访问：`https://yourusername.github.io/blog/essays/2024/03/01/life-thoughts/`

## 🏷️ 标签使用

标签用于更细粒度的文章分类：

- 使用 2-5 个标签
- 标签要具体、有意义
- 保持标签的一致性

### 常用标签示例

**技术博客**：
- `Python`, `JavaScript`, `Jekyll`
- `教程`, `实践`, `优化`
- `机器学习`, `深度学习`

**随笔杂文**：
- `生活`, `感悟`, `读书`
- `学习`, `成长`, `思考`

## 📂 文件夹优势

✅ **物理分离**
- 技术博客和随笔杂文完全分开
- 文件夹结构清晰
- 便于管理和维护

✅ **独立 URL**
- 技术博客：`/blog/tech/...`
- 随笔杂文：`/blog/essays/...`
- URL 结构清晰，便于分享

✅ **自动分类**
- 无需在 Front Matter 中指定 categories
- 系统自动识别文章类型
- 减少手动配置

## ✍️ Markdown 语法

### 标题
```markdown
# H1 标题
## H2 标题
### H3 标题
```

### 强调
```markdown
**粗体**
*斜体*
`代码`
```

### 列表
```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

### 代码块
````markdown
```python
def hello():
    print("Hello, World!")
```
````

### 链接和图片
```markdown
[链接文字](URL)
![图片描述](图片路径)
```

## 💡 写作建议

1. **选择文件夹**：根据文章性质选择 `_tech` 或 `_essays`
2. **标题**：简洁明了，概括文章主题
3. **标签**：使用 2-5 个相关标签
4. **摘要**：文章开头写一段简短摘要（会自动提取）
5. **结构**：使用标题组织内容，层次清晰
6. **代码**：技术文章建议包含代码示例
7. **图片**：合理使用图片增强可读性

## 🚀 发布流程

1. 选择合适的文件夹（`_tech` 或 `_essays`）
2. 创建 Markdown 文件（格式：YYYY-MM-DD-title.md）
3. 编写文章内容
4. 本地预览：`bundle exec jekyll serve`
5. 确认无误后提交到 Git
6. 推送到 GitHub
7. 等待自动部署（1-3 分钟）

## 📊 文章访问

- **全部文章**：`/blog/`
- **技术博客**：`/blog/tech/`
- **随笔杂文**：`/blog/essays/`

## 🔍 SEO 优化

Jekyll 会自动为每篇文章生成：
- SEO 友好的 URL
- Meta 标签
- Open Graph 标签
- RSS Feed

## ⚠️ 注意事项

1. **文件命名**：必须使用 `YYYY-MM-DD-title.md` 格式
2. **文件夹选择**：
   - 技术相关 → `_tech`
   - 生活感悟 → `_essays`
3. **分类自动添加**：无需手动设置 categories
4. **兼容性**：原 `_posts` 文件夹仍然可用

## 🔄 迁移说明

如果要将现有文章从 `_posts` 迁移到新结构：

**技术博客**：
```bash
mv _posts/tech-article.md _tech/tech-article.md
```

**随笔杂文**：
```bash
mv _posts/essay-article.md _essays/essay-article.md
```

---

**现在你可以更有条理地管理博客文章了！** ✍️
