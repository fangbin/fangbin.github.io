# fangbin.github.io 个人网站项目架构分析

## 一、项目整体结构

```
githubpage/
├── fangbin.github.io/          # 主仓库（Jekyll 主页 + 部署后的博客）
│   ├── index.html              # 中文主页
│   ├── index-en.html           # 英文主页
│   ├── _config.yml             # Jekyll 配置
│   ├── _layouts/               # Jekyll 布局模板
│   ├── _includes/              # Jekyll 包含文件
│   ├── _data/                  # 数据文件
│   ├── assets/                 # 静态资源
│   └── amytis-style/           # 博客部署目录（由 amytis-blog 构建）
│
├── amytis-blog/                # 博客本地开发环境
│   ├── content/                # 博客内容
│   ├── src/                    # Next.js 源码
│   ├── out/                    # 构建输出
│   ├── site.config.ts          # 博客配置
│   └── package.json            # 依赖管理
│
└── publish.sh                  # 发布脚本
```

---

## 二、主页部分

### 2.1 技术栈
- **框架**: Jekyll（GitHub Pages 原生支持）
- **模板引擎**: Liquid
- **Markdown 解析**: kramdown
- **代码高亮**: rouge

### 2.2 目录结构详解

```
fangbin.github.io/
├── _config.yml                 # Jekyll 主配置文件
├── _layouts/                   # 布局模板
│   ├── default.html            # 默认布局（包含 header/footer）
│   ├── page.html               # 普通页面布局
│   └── post.html               # 文章页面布局
├── _includes/                  # 可复用组件
│   ├── head.html               # HTML head 部分
│   ├── header.html             # 导航栏（含语言切换）
│   └── footer.html             # 页脚
├── _data/                      # 数据文件
│   ├── education.yml           # 教育背景（中文）
│   ├── education_en.yml        # 教育背景（英文）
│   ├── work.yml                # 工作经历（中文）
│   ├── work_en.yml             # 工作经历（英文）
│   ├── publications.yml        # 发表论文
│   └── awards.yml              # 荣誉奖项
├── assets/
│   ├── css/main.css            # 主样式文件
│   └── js/main.js              # 主脚本文件
├── images/                     # 图片资源
├── index.html                  # 中文主页
├── index-en.html               # 英文主页
└── amytis-style/               # 博客静态文件（构建产物）
```

### 2.3 核心配置说明

**_config.yml 关键配置：**
```yaml
# 构建设置
markdown: kramdown
highlighter: rouge

# 插件
plugins:
  - jekyll-feed      # RSS 订阅
  - jekyll-seo-tag   # SEO 优化
  - jekyll-paginate  # 分页

# 排除目录（不处理）
exclude:
  - amytis-style     # 博客目录单独管理
```

### 2.4 模板系统

| 布局文件 | 用途 | 继承关系 |
|---------|------|---------|
| `default.html` | 基础布局，包含 head/header/footer | 被其他布局继承 |
| `page.html` | 普通页面 | 继承 default |
| `post.html` | 博客文章 | 继承 default |

### 2.5 内容组织方式

- **主页内容**: 直接在 `index.html` / `index-en.html` 中使用 Liquid 模板
- **数据驱动**: 通过 `_data/*.yml` 文件管理结构化数据
- **多语言支持**: 通过 `page.lang` 变量区分中英文页面

---

## 三、静态博客部分

### 3.1 技术栈
- **框架**: Next.js 16（静态导出模式）
- **样式**: Tailwind CSS v4
- **运行时**: Bun
- **搜索**: Pagefind
- **图表**: D3.js + Mermaid

### 3.2 目录结构详解

```
amytis-blog/
├── content/                    # 内容目录
│   ├── flows/                  # 随笔/日记
│   │   └── 2024/02/            # 按日期组织
│   ├── notes/                  # 笔记
│   ├── about.mdx               # 关于页面
│   └── about.zh.mdx            # 关于页面（中文）
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [slug]/             # 动态路由页面
│   │   ├── posts/              # 文章列表
│   │   ├── flows/              # 随笔列表
│   │   ├── notes/              # 笔记列表
│   │   ├── books/              # 书籍列表
│   │   ├── movies/             # 电影列表
│   │   ├── tags/               # 标签页面
│   │   ├── archive/            # 归档页面
│   │   ├── graph/              # 知识图谱
│   │   └── layout.tsx          # 根布局
│   ├── components/             # React 组件
│   ├── lib/                    # 工具函数
│   └── types/                  # TypeScript 类型
├── out/                        # 构建输出目录
├── site.config.ts              # 站点配置
├── next.config.ts              # Next.js 配置
└── package.json                # 依赖配置
```

### 3.3 核心配置说明

**next.config.ts 关键配置：**
```typescript
const nextConfig = {
  basePath: "/amytis-style",    // 部署子路径
  trailingSlash: true,          // URL 尾部斜杠
  output: "export",             // 静态导出模式
  images: {
    loader: "custom",           // 自定义图片处理
  },
};
```

**site.config.ts 关键配置：**
```typescript
export const siteConfig = {
  baseUrl: "https://fangbin.github.io/amytis-style",
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },
  // 功能模块
  features: {
    posts: { enabled: true },    // 文章
    series: { enabled: true },   // 系列
    books: { enabled: true },    // 书籍
    flow: { enabled: true },     // 随笔
    notes: { enabled: true },    // 笔记
    movies: { enabled: true },   // 电影
  },
};
```

### 3.4 内容管理方式

| 内容类型 | 目录 | URL 路径 | 说明 |
|---------|------|---------|------|
| 随笔 | `content/flows/` | `/flows/` | 按日期组织的短内容 |
| 文章 | `content/posts/` | `/posts/` | 长篇博客文章 |
| 笔记 | `content/notes/` | `/notes/` | 学习笔记 |
| 书籍 | `content/books/` | `/books/` | 书籍章节 |
| 电影 | `content/movies/` | `/movies/` | 电影评论 |

---

## 四、发布流程

### 4.1 publish.sh 脚本解析

```bash
#!/bin/bash
# 1. 进入博客开发目录
cd /Users/ericbinder/Documents/repos/githubpage/amytis-blog

# 2. 构建博客（输出到 out/ 目录）
bun run build

# 3. 进入主页仓库
cd /Users/ericbinder/Documents/repos/githubpage/fangbin.github.io

# 4. 删除旧的博客目录
rm -rf amytis-style

# 5. 复制构建产物到 amytis-style 目录
cp -r /Users/ericbinder/Documents/repos/githubpage/amytis-blog/out amytis-style

# 6. 提交并推送
git add amytis-style
git commit -m "add content"
git push
```

### 4.2 工作流程图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   amytis-blog   │     │     build       │     │      out/       │
│   (本地开发)     │────▶│   bun run build │────▶│   (构建产物)     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         │ cp -r
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │◀────│   git push      │◀────│ fangbin.github  │
│   (线上部署)     │     │                 │     │  /amytis-style  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 五、两系统关系

### 5.1 URL 路由关系

| URL | 来源 | 说明 |
|-----|------|------|
| `https://fangbin.github.io/` | Jekyll 主页 | 中文主页 |
| `https://fangbin.github.io/index-en.html` | Jekyll 主页 | 英文主页 |
| `https://fangbin.github.io/amytis-style/` | Next.js 博客 | 博客首页 |
| `https://fangbin.github.io/amytis-style/posts/` | Next.js 博客 | 文章列表 |
| `https://fangbin.github.io/amytis-style/flows/` | Next.js 博客 | 随笔列表 |

### 5.2 导航关联

主页 header.html 中的导航：
```html
<!-- 中文页面 -->
<li><a href="/">首页</a></li>
<li><a href="/amytis-style/">博客</a></li>
<li><a href="/">ZH</a></li>
<li><a href="/index-en.html">EN</a></li>
```

---

## 六、开发与维护指南

### 6.1 主页修改

```bash
cd fangbin.github.io

# 本地预览
bundle exec jekyll serve

# 修改内容
# - 编辑 index.html / index-en.html
# - 编辑 _data/*.yml 数据文件
# - 编辑 assets/css/main.css 样式

# 提交部署
git add .
git commit -m "update content"
git push
```

### 6.2 博客修改

```bash
cd amytis-blog

# 本地开发
bun run dev

# 修改内容
# - 在 content/ 目录添加/编辑 .mdx 文件
# - 编辑 site.config.ts 配置

# 发布
cd ..
./publish.sh
```

### 6.3 常用命令对照

| 操作 | Jekyll 主页 | Next.js 博客 |
|------|------------|--------------|
| 本地开发 | `bundle exec jekyll serve` | `bun run dev` |
| 构建 | 自动 | `bun run build` |
| 新建文章 | 手动创建 | `bun run new` |
| 新建随笔 | 手动创建 | `bun run new-flow` |
| 新建笔记 | 手动创建 | `bun run new-note` |

---

## 七、技术特点总结

| 特性 | Jekyll 主页 | Next.js 博客 |
|------|------------|--------------|
| **构建方式** | GitHub Pages 自动构建 | 本地构建后推送 |
| **部署模式** | 服务端渲染 | 静态导出 |
| **内容格式** | HTML + Liquid | MDX |
| **样式方案** | 原生 CSS | Tailwind CSS |
| **搜索功能** | 无 | Pagefind |
| **国际化** | 手动维护两份页面 | 配置驱动 |
| **更新频率** | 低（个人信息） | 高（博客内容） |
