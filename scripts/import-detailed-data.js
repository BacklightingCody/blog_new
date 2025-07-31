#!/usr/bin/env node

/**
 * 导入详细测试数据脚本
 * 包含丰富的Markdown内容和完整的文章数据
 */

const fs = require('fs');
const path = require('path');

// 配置
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';

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

// 加载详细测试数据
function loadDetailedTestData() {
  const dataPath = path.join(__dirname, '../test-data/detailed-articles.json');
  
  if (!fs.existsSync(dataPath)) {
    throw new Error(`测试数据文件不存在: ${dataPath}`);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
}

// 使用新的批量导入API
async function importDetailedData(testData) {
  console.log('\n📦 使用批量导入API导入详细数据...');
  
  try {
    const result = await apiRequest('/articles/import', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    
    if (result.success) {
      console.log('✅ 详细数据导入成功');
      console.log(`📊 导入结果:`);
      console.log(`   - 用户: ${result.data.users.created} 创建, ${result.data.users.errors.length} 错误`);
      console.log(`   - 标签: ${result.data.tags.created} 创建, ${result.data.tags.errors.length} 错误`);
      console.log(`   - 文章: ${result.data.articles.created} 创建, ${result.data.articles.errors.length} 错误`);
      
      // 显示错误详情
      if (result.data.users.errors.length > 0) {
        console.log('⚠️  用户导入错误:', result.data.users.errors);
      }
      if (result.data.tags.errors.length > 0) {
        console.log('⚠️  标签导入错误:', result.data.tags.errors);
      }
      if (result.data.articles.errors.length > 0) {
        console.log('⚠️  文章导入错误:', result.data.articles.errors);
      }
      
      return result.data;
    } else {
      throw new Error(result.error || '导入失败');
    }
  } catch (error) {
    console.error('❌ 详细数据导入失败:', error.message);
    throw error;
  }
}

// 清理所有数据
async function clearAllData() {
  console.log('\n🧹 清理现有数据...');
  
  try {
    const result = await apiRequest('/articles/clear-all', {
      method: 'DELETE',
    });
    
    if (result.success) {
      console.log('✅ 数据清理成功');
      return result.data;
    } else {
      console.log('⚠️  数据清理失败，继续导入...');
    }
  } catch (error) {
    console.log('⚠️  数据清理失败，继续导入...', error.message);
  }
}

// 验证导入结果
async function verifyImportedData() {
  console.log('\n🔍 验证导入的数据...');
  
  try {
    // 检查文章
    const articlesResponse = await apiRequest('/articles?limit=10');
    if (articlesResponse.success) {
      console.log(`✅ 文章验证成功: 找到 ${articlesResponse.data.articles.length} 篇文章`);
      
      // 显示文章标题
      articlesResponse.data.articles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title} (${article.readTime}分钟阅读)`);
      });
    }
    
    // 检查标签
    const tagsResponse = await apiRequest('/tags/articles');
    if (tagsResponse.success) {
      console.log(`✅ 标签验证成功: 找到 ${tagsResponse.data.length} 个标签`);
    }
    
    // 检查用户
    const usersResponse = await apiRequest('/users');
    if (usersResponse.success) {
      console.log(`✅ 用户验证成功: 找到 ${usersResponse.data.length} 个用户`);
    }
    
  } catch (error) {
    console.error('❌ 数据验证失败:', error.message);
  }
}

// 主函数
async function main() {
  console.log('🚀 开始导入详细测试数据...');
  console.log(`📡 API 地址: ${API_BASE_URL}`);

  try {
    // 检查API连接
    console.log('\n🔍 检查API连接...');
    try {
      await apiRequest('/articles?limit=1');
      console.log('✅ API 连接正常');
    } catch (error) {
      console.log('⚠️  API连接检查失败，但继续尝试导入...');
    }

    // 加载详细测试数据
    const testData = loadDetailedTestData();
    console.log(`📊 加载详细测试数据: ${testData.users.length} 用户, ${testData.tags.length} 标签, ${testData.articles.length} 文章`);

    // 询问是否清理现有数据
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await clearAllData();
    }

    // 使用批量导入API
    const results = await importDetailedData(testData);

    // 验证导入结果
    await verifyImportedData();

    console.log('\n🎉 详细数据导入完成!');
    console.log('\n📝 导入的文章包含:');
    console.log('   - 丰富的Markdown内容');
    console.log('   - 代码示例和语法高亮');
    console.log('   - 图片和媒体内容');
    console.log('   - 完整的元数据');
    console.log('   - 标签和分类信息');
    
    console.log('\n🌐 你现在可以访问前端应用来查看导入的数据');
    console.log('   - 前端: http://localhost:3001');
    console.log('   - 后端API: http://localhost:3002');
    console.log('   - 文章列表: http://localhost:3001/articles');

  } catch (error) {
    console.error('\n❌ 导入过程中发生错误:', error.message);
    console.log('\n🔧 故障排除建议:');
    console.log('   1. 确保后端服务正在运行 (端口3002)');
    console.log('   2. 检查数据库连接');
    console.log('   3. 查看后端日志获取详细错误信息');
    console.log('   4. 尝试使用 --clear 参数清理现有数据');
    console.log('   5. 检查test-data/detailed-articles.json文件是否存在');
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { main, loadDetailedTestData, importDetailedData };
