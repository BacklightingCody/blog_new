#!/usr/bin/env node

/**
 * 测试数据导入脚本
 * 用于将测试数据导入到后端API
 */

const fs = require('fs');
const path = require('path');

// 配置
const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';
const TEST_DATA_PATH = path.join(__dirname, '../test-data/articles.json');

// 读取测试数据
function loadTestData() {
  try {
    const data = fs.readFileSync(TEST_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ 读取测试数据失败:', error.message);
    process.exit(1);
  }
}

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

// 使用新的批量导入API
async function importAllData(testData) {
  console.log('\n📦 使用批量导入API...');

  try {
    const result = await apiRequest('/articles/import', {
      method: 'POST',
      body: JSON.stringify(testData),
    });

    if (result.success) {
      console.log('✅ 批量导入成功');
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
    console.error('❌ 批量导入失败:', error.message);
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

// 主函数
async function main() {
  console.log('🚀 开始导入测试数据...');
  console.log(`📡 API 地址: ${API_BASE_URL}`);

  try {
    // 检查API连接（跳过健康检查，直接测试文章接口）
    console.log('\n🔍 检查API连接...');
    try {
      await apiRequest('/articles?limit=1');
      console.log('✅ API 连接正常');
    } catch (error) {
      console.log('⚠️  健康检查失败，但继续尝试导入...');
    }

    // 加载测试数据
    const testData = loadTestData();
    console.log(`📊 加载测试数据: ${testData.users.length} 用户, ${testData.tags.length} 标签, ${testData.articles.length} 文章`);

    // 询问是否清理现有数据
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      await clearAllData();
    }

    // 使用批量导入API
    const results = await importAllData(testData);

    console.log('\n🎉 数据导入完成!');
    console.log('\n🌐 你现在可以访问前端应用来查看导入的数据');
    console.log('   - 前端: http://localhost:3001');
    console.log('   - 后端API: http://localhost:3000');

  } catch (error) {
    console.error('\n❌ 导入过程中发生错误:', error.message);
    console.log('\n🔧 故障排除建议:');
    console.log('   1. 确保后端服务正在运行');
    console.log('   2. 检查数据库连接');
    console.log('   3. 查看后端日志获取详细错误信息');
    console.log('   4. 尝试使用 --clear 参数清理现有数据');
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { main, loadTestData };
