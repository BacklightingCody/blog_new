# 🚀 快速开始指南

## 📋 前置要求

1. **Node.js 18+** - [下载安装](https://nodejs.org/)
2. **PostgreSQL 12+** - [下载安装](https://www.postgresql.org/download/)
3. **pnpm** (推荐) 或 npm

## 🛠️ 环境配置

### 1. 数据库设置

#### 安装PostgreSQL后：

```sql
-- 创建数据库
CREATE DATABASE blog_db;

-- 创建用户（可选）
CREATE USER blog_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
```

#### 或使用默认postgres用户：
```bash
# Windows (使用psql)
psql -U postgres
CREATE DATABASE blog_db;

# macOS/Linux
sudo -u postgres psql
CREATE DATABASE blog_db;
```

### 2. 后端配置

```bash
cd backend_new

# 安装依赖
npm install
```

**重要：编辑 `.env.development` 文件**
```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/blog_article?schema=public"
JWT_SECRET="dev-super-secret-jwt-key-change-this"
```

**注意：** 项目使用 `.env.development` 和 `.env.production` 分别管理开发和生产环境配置。

### 3. 数据库迁移

```bash
# 开发环境 - 生成Prisma客户端
npm run prisma:generate:dev

# 开发环境 - 推送数据库结构
npm run prisma:push:dev

# 查看数据库（可选）
npm run prisma:studio

# 或者使用简化命令（会使用默认环境）
npm run prisma:generate
npm run prisma:push
```

### 4. 启动后端

```bash
npm run start:dev
```

看到以下输出表示成功：
```
[Nest] LOG [NestApplication] Nest application successfully started +Xms
```

### 5. 前端配置

```bash
cd ../blog_new

# 安装依赖
npm install

# 启动前端
npm run dev
```

## 🧪 测试连接

### 1. 测试API连接
```bash
cd blog_new
node scripts/test-api-connection.js
```

### 2. 导入测试数据
```bash
# 导入JSON测试数据
node scripts/import-test-data.js

# 或导入Markdown文件
node scripts/import-markdown.js
```

### 3. 访问应用
- 前端: http://localhost:3001
- 后端API: http://localhost:3000
- API文档: http://localhost:3000/api

## 🔧 常见问题

### 数据库连接失败
```
Error: P1012 - the URL must start with the protocol postgresql://
```

**解决方案：**
1. 确保PostgreSQL正在运行
2. 检查`.env.development`文件中的`DATABASE_URL`
3. 确认数据库名称、用户名、密码正确

### 端口冲突
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案：**
1. 更改端口：在`.env.development`中设置`PORT=3001`
2. 或停止占用端口的进程

### Prisma生成失败
```
Error: Schema parsing error
```

**解决方案：**
```bash
# 重新生成Prisma客户端
npm run prisma:generate:dev

# 如果还有问题，重置数据库
npm run prisma:reset
```

### 前端API调用失败
```
Failed to fetch
```

**解决方案：**
1. 确保后端正在运行
2. 检查CORS配置
3. 确认API地址正确

## 📝 开发工作流

### 1. 日常开发
```bash
# 启动后端（终端1）
cd backend_new
npm run start:dev

# 启动前端（终端2）
cd blog_new
npm run dev
```

### 2. 添加新文章
```bash
# 方式1：使用Markdown文件
# 1. 在 blog_new/content/ 目录创建 .md 文件
# 2. 运行导入脚本
node scripts/import-markdown.js

# 方式2：使用JSON数据
# 1. 编辑 blog_new/test-data/articles.json
# 2. 运行导入脚本
node scripts/import-test-data.js
```

### 3. 数据库管理
```bash
# 查看数据库
npm run prisma:studio

# 重置数据库
npm run prisma:reset

# 推送数据库结构变更
npm run prisma:push:dev

# 清理所有数据
curl -X DELETE http://localhost:3000/articles/clear-all
```

## 🎯 下一步

1. **自定义内容**: 编辑测试数据或添加Markdown文件
2. **样式调整**: 修改Tailwind CSS样式
3. **功能扩展**: 添加用户认证、评论系统等
4. **部署准备**: 配置生产环境数据库和环境变量

## 📞 获取帮助

如果遇到问题：
1. 查看控制台错误信息
2. 检查数据库连接
3. 确认所有依赖已安装
4. 参考详细文档：`IMPLEMENTATION_GUIDE.md`

---

**快速验证清单：**
- [ ] PostgreSQL已安装并运行
- [ ] 数据库`blog_article`已创建
- [ ] 后端`.env.development`文件已配置
- [ ] 后端依赖已安装
- [ ] Prisma已生成和迁移
- [ ] 后端服务已启动（端口3000）
- [ ] 前端依赖已安装
- [ ] 前端服务已启动（端口3001）
- [ ] API连接测试通过
- [ ] 测试数据已导入
- [ ] 可以访问前端页面
