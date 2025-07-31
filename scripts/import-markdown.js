#!/usr/bin/env node

/**
 * Markdown文件导入脚本
 * 支持从Markdown文件和JSON元数据导入文章
 */

const fs = require('fs');
const path = require('path');

// 配置
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';
const CONTENT_DIR = path.join(__dirname, '../content');

// API 请求工具
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ API 请求失败 [${endpoint}]:`, error.message);
    throw error;
  }
}

// 解析Markdown文件的Front Matter
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return {
      metadata: {},
      content: content,
    };
  }

  const frontMatter = match[1];
  const markdownContent = match[2];
  
  // 简单的YAML解析（仅支持基本键值对）
  const metadata = {};
  frontMatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // 移除引号
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      // 处理数组（简单的逗号分隔）
      if (cleanValue.includes(',')) {
        metadata[key] = cleanValue.split(',').map(item => item.trim());
      } else if (cleanValue === 'true' || cleanValue === 'false') {
        metadata[key] = cleanValue === 'true';
      } else if (!isNaN(cleanValue) && cleanValue !== '') {
        metadata[key] = Number(cleanValue);
      } else {
        metadata[key] = cleanValue;
      }
    }
  });

  return {
    metadata,
    content: markdownContent,
  };
}

// 从Markdown文件创建文章数据
function createArticleFromMarkdown(filePath, metadata, content) {
  const fileName = path.basename(filePath, '.md');
  const slug = metadata.slug || fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return {
    slug,
    title: metadata.title || fileName,
    summary: metadata.summary || metadata.description || null,
    content: content.trim(),
    html: null, // 将由前端渲染
    coverImage: metadata.coverImage || metadata.image || null,
    readTime: metadata.readTime || null,
    category: metadata.category || 'uncategorized',
    isPublished: metadata.published !== false,
    isDraft: metadata.draft === true,
    viewCount: metadata.viewCount || 0,
    likes: metadata.likes || 0,
    bookmarks: metadata.bookmarks || 0,
    comments: metadata.comments || 0,
    userId: metadata.userId || 1, // 默认用户ID
    createdAt: metadata.date || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: metadata.tags || [],
  };
}

// 扫描目录中的Markdown文件
function scanMarkdownFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`📁 内容目录不存在: ${dir}`);
    return files;
  }

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

// 导入单个Markdown文件
async function importMarkdownFile(filePath) {
  try {
    console.log(`📄 处理文件: ${path.relative(CONTENT_DIR, filePath)}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { metadata, content: markdownContent } = parseFrontMatter(content);
    
    const articleData = createArticleFromMarkdown(filePath, metadata, markdownContent);
    
    // 检查文章是否已存在
    let existingArticle = null;
    try {
      const response = await apiRequest(`/articles/slug/${articleData.slug}`);
      if (response.success) {
        existingArticle = response.data;
      }
    } catch (error) {
      // 文章不存在，继续创建
    }

    if (existingArticle) {
      // 更新现有文章
      const response = await apiRequest(`/articles/${existingArticle.id}`, {
        method: 'PATCH',
        body: JSON.stringify(articleData),
      });
      
      if (response.success) {
        console.log(`✅ 文章更新成功: ${articleData.title}`);
        return { action: 'updated', article: response.data };
      }
    } else {
      // 创建新文章
      const response = await apiRequest('/articles', {
        method: 'POST',
        body: JSON.stringify(articleData),
      });
      
      if (response.success) {
        console.log(`✅ 文章创建成功: ${articleData.title}`);
        return { action: 'created', article: response.data };
      }
    }
  } catch (error) {
    console.error(`❌ 处理文件失败: ${filePath}`, error.message);
    return { action: 'error', error: error.message };
  }
}

// 主函数
async function main() {
  console.log('📚 开始导入Markdown文件...');
  console.log(`📡 API 地址: ${API_BASE_URL}`);
  console.log(`📁 内容目录: ${CONTENT_DIR}`);

  try {
    // 检查API连接
    console.log('\n🔍 检查API连接...');
    await apiRequest('/health');
    console.log('✅ API 连接正常');

    // 扫描Markdown文件
    const markdownFiles = scanMarkdownFiles(CONTENT_DIR);
    console.log(`\n📊 找到 ${markdownFiles.length} 个Markdown文件`);

    if (markdownFiles.length === 0) {
      console.log('\n💡 提示: 请在 content/ 目录下放置Markdown文件');
      console.log('   文件格式示例:');
      console.log('   ```markdown');
      console.log('   ---');
      console.log('   title: "文章标题"');
      console.log('   category: "programming"');
      console.log('   tags: ["React", "TypeScript"]');
      console.log('   date: "2024-01-01"');
      console.log('   ---');
      console.log('   ');
      console.log('   # 文章内容');
      console.log('   ```');
      return;
    }

    // 导入所有文件
    const results = {
      created: 0,
      updated: 0,
      errors: 0,
      errorDetails: [],
    };

    for (const filePath of markdownFiles) {
      const result = await importMarkdownFile(filePath);
      
      if (result.action === 'created') {
        results.created++;
      } else if (result.action === 'updated') {
        results.updated++;
      } else if (result.action === 'error') {
        results.errors++;
        results.errorDetails.push(`${filePath}: ${result.error}`);
      }
    }

    console.log('\n🎉 Markdown导入完成!');
    console.log(`📊 导入统计:`);
    console.log(`   - 创建: ${results.created} 篇文章`);
    console.log(`   - 更新: ${results.updated} 篇文章`);
    console.log(`   - 错误: ${results.errors} 个文件`);

    if (results.errorDetails.length > 0) {
      console.log('\n❌ 错误详情:');
      results.errorDetails.forEach(error => console.log(`   ${error}`));
    }

    console.log('\n🌐 你现在可以访问前端应用来查看导入的文章');

  } catch (error) {
    console.error('\n❌ 导入过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { main, parseFrontMatter, createArticleFromMarkdown };
