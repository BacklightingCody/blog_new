---
title: "示例文章：如何使用Markdown导入"
slug: "example-markdown-import"
category: "programming"
tags: ["Markdown", "导入", "示例"]
summary: "这是一个示例文章，展示如何使用Markdown格式创建和导入文章到博客系统中。"
coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop"
readTime: 5
date: "2024-01-20T10:00:00Z"
published: true
draft: false
userId: 1
---

# 示例文章：如何使用Markdown导入

这是一个示例文章，展示如何使用我们的Markdown导入功能。

## 文件格式说明

每个Markdown文件都应该包含两个部分：

### 1. Front Matter（元数据）

文件开头的YAML格式元数据，包含文章的基本信息：

```yaml
---
title: "文章标题"
slug: "article-slug"
category: "分类名称"
tags: ["标签1", "标签2"]
summary: "文章摘要"
coverImage: "封面图片URL"
readTime: 5
date: "2024-01-20T10:00:00Z"
published: true
draft: false
userId: 1
---
```

### 2. 文章内容

Front Matter之后就是标准的Markdown格式内容。

## 支持的Markdown语法

### 代码块

```javascript
function hello() {
  console.log("Hello, World!");
}
```

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

### 列表

- 无序列表项1
- 无序列表项2
  - 嵌套项目
  - 另一个嵌套项目

1. 有序列表项1
2. 有序列表项2
3. 有序列表项3

### 表格

| 功能 | 支持 | 说明 |
|------|------|------|
| 代码高亮 | ✅ | 使用prism-react-renderer |
| 图片 | ✅ | 支持全屏预览 |
| 视频 | ✅ | 支持播放控制 |
| 表格 | ✅ | 响应式表格 |

### 引用

> 这是一个引用块。
> 
> 可以包含多行内容。

### 链接和图片

这是一个[链接示例](https://example.com)。

![示例图片](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop "这是图片标题")

## 使用方法

1. 将Markdown文件放在 `content/` 目录下
2. 运行导入脚本：
   ```bash
   node scripts/import-markdown.js
   ```
3. 脚本会自动解析文件并导入到数据库

## 高级功能

### 自定义参数

你可以在图片标题中添加自定义参数：

```markdown
![图片描述](image.jpg "图片标题 | width=500 | height=300")
```

### 视频支持

```markdown
![视频描述](video.mp4 "视频标题 | autoplay=true | controls=true")
```

## 注意事项

1. **文件名**: 建议使用英文和连字符，避免特殊字符
2. **Slug**: 如果不指定slug，会自动从文件名生成
3. **分类**: 确保分类名称与系统中的分类一致
4. **标签**: 标签会自动创建（如果不存在）
5. **日期格式**: 使用ISO 8601格式（YYYY-MM-DDTHH:mm:ssZ）

## 总结

通过这个Markdown导入功能，你可以：

- 使用熟悉的Markdown语法编写文章
- 通过Front Matter管理文章元数据
- 批量导入多个文章文件
- 自动处理重复文章（更新现有内容）

这样就可以专注于内容创作，而不用担心技术细节！
