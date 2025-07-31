# 测试脚本使用指南

这个目录包含了用于测试和初始化博客系统的脚本。

## 脚本列表

### 1. test-api-connection.js
**用途**: 测试前后端API连接是否正常

**使用方法**:
```bash
# 使用默认API地址 (http://localhost:3000)
node scripts/test-api-connection.js

# 使用自定义API地址
API_URL=http://localhost:8080 node scripts/test-api-connection.js
```

**功能**:
- 检查API健康状态
- 测试文章列表获取
- 测试分类获取
- 测试热门文章获取
- 测试文章详情获取

### 2. import-test-data.js
**用途**: 导入测试数据到后端数据库

**使用方法**:
```bash
# 使用默认API地址
node scripts/import-test-data.js

# 清理现有数据后导入
node scripts/import-test-data.js --clear

# 使用自定义API地址
API_URL=http://localhost:8080 node scripts/import-test-data.js
```

**功能**:
- 使用批量导入API一次性导入所有数据
- 自动处理重复数据（更新现有记录）
- 支持清理现有数据
- 详细的导入结果报告

### 3. import-markdown.js
**用途**: 从Markdown文件导入文章

**使用方法**:
```bash
# 导入content目录下的所有Markdown文件
node scripts/import-markdown.js

# 使用自定义API地址
API_URL=http://localhost:8080 node scripts/import-markdown.js
```

**功能**:
- 解析Markdown文件的Front Matter元数据
- 支持标准Markdown语法
- 自动处理重复文章（更新现有内容）
- 支持批量导入多个文件

**文件格式**:
```markdown
---
title: "文章标题"
category: "programming"
tags: ["React", "TypeScript"]
date: "2024-01-01T10:00:00Z"
---

# 文章内容

这里是Markdown格式的文章内容...
```

## 快速开始流程

### 1. 启动后端服务
```bash
cd ../backend_new
npm run start:dev
```

### 2. 测试API连接
```bash
cd ../blog_new
node scripts/test-api-connection.js
```

### 3. 导入数据
```bash
# 方式1: 导入JSON测试数据
node scripts/import-test-data.js

# 方式2: 导入Markdown文件
node scripts/import-markdown.js

# 清理现有数据后导入
node scripts/import-test-data.js --clear
```

### 4. 启动前端服务
```bash
npm run dev
```

### 5. 访问应用
打开浏览器访问: http://localhost:3001

## 测试数据说明

测试数据位于 `test-data/articles.json`，包含：

- **用户**: 2个测试用户（admin, author）
- **标签**: 8个技术和生活标签
- **文章**: 4篇不同类型的文章
  - React 18 并发特性（编程类）
  - Next.js App Router 指南（编程类）
  - AI 提示工程（AI类）
  - 手工意大利面制作（食谱类）

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| API_URL | http://localhost:3000 | 后端API地址 |

## 故障排除

### API连接失败
1. 确保后端服务正在运行
2. 检查端口是否正确
3. 检查防火墙设置
4. 查看后端日志

### 数据导入失败
1. 确保数据库连接正常
2. 检查数据格式是否正确
3. 查看后端错误日志
4. 确认API端点是否存在

### 前端无法显示数据
1. 检查API连接
2. 确认数据已成功导入
3. 检查浏览器控制台错误
4. 验证API响应格式

## 开发建议

### 添加新的测试数据
1. 编辑 `test-data/articles.json`
2. 按照现有格式添加数据
3. 运行导入脚本

### 修改API地址
```bash
# 临时修改
export API_URL=http://your-api-server.com

# 或在命令前添加
API_URL=http://your-api-server.com node scripts/test-api-connection.js
```

### 清理测试数据
目前脚本不包含清理功能，如需清理：
1. 直接操作数据库
2. 或重新初始化数据库

## 注意事项

1. **数据重复**: 脚本会尝试处理重复数据，但建议在干净的数据库上运行
2. **网络超时**: 如果网络较慢，可能需要增加超时时间
3. **权限问题**: 确保脚本有足够权限访问文件和网络
4. **Node.js版本**: 建议使用Node.js 18+以支持fetch API

## 扩展功能

可以考虑添加的功能：
- 数据清理脚本
- 批量数据生成
- 性能测试
- 自动化测试套件
- 数据备份和恢复
