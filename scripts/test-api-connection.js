#!/usr/bin/env node

/**
 * API 连接测试脚本
 * 用于快速验证前后端是否能正常通信
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:3002';

// API 请求工具
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// 测试各个API端点
async function testEndpoints() {
  const tests = [
    {
      name: '健康检查',
      endpoint: '/health',
      method: 'GET',
    },
    {
      name: '获取文章列表',
      endpoint: '/articles',
      method: 'GET',
    },
    {
      name: '获取文章分类',
      endpoint: '/articles/categories',
      method: 'GET',
    },
    {
      name: '获取热门文章',
      endpoint: '/articles/popular',
      method: 'GET',
    },
    {
      name: '获取最新文章',
      endpoint: '/articles/recent',
      method: 'GET',
    },
  ];

  console.log('🧪 开始API连接测试...');
  console.log(`📡 API 地址: ${API_BASE_URL}\n`);

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    process.stdout.write(`🔍 ${test.name}... `);
    
    const result = await apiRequest(test.endpoint, {
      method: test.method,
    });

    if (result.success) {
      console.log('✅ 通过');
      passedTests++;
      
      // 显示一些数据信息
      if (test.endpoint === '/articles' && result.data?.data) {
        console.log(`   📊 找到 ${result.data.data.length} 篇文章`);
      } else if (test.endpoint === '/articles/categories' && result.data?.data) {
        console.log(`   📂 找到 ${result.data.data.length} 个分类: ${result.data.data.join(', ')}`);
      }
    } else {
      console.log('❌ 失败');
      console.log(`   错误: ${result.error || `HTTP ${result.status}`}`);
      if (result.data?.message) {
        console.log(`   详情: ${result.data.message}`);
      }
    }
  }

  console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！前后端连接正常。');
    return true;
  } else {
    console.log('⚠️  部分测试失败，请检查后端服务。');
    return false;
  }
}

// 测试特定文章获取
async function testArticleDetails() {
  console.log('\n🔍 测试文章详情获取...');
  
  // 先获取文章列表
  const listResult = await apiRequest('/articles?limit=1');
  
  if (!listResult.success || !listResult.data?.data?.length) {
    console.log('❌ 无法获取文章列表，跳过详情测试');
    return false;
  }

  const firstArticle = listResult.data.data[0];
  console.log(`📄 测试文章: ${firstArticle.title}`);

  // 测试通过ID获取
  const byIdResult = await apiRequest(`/articles/${firstArticle.id}`);
  if (byIdResult.success) {
    console.log('✅ 通过ID获取文章详情成功');
  } else {
    console.log('❌ 通过ID获取文章详情失败');
  }

  // 测试通过slug获取
  const bySlugResult = await apiRequest(`/articles/slug/${firstArticle.slug}`);
  if (bySlugResult.success) {
    console.log('✅ 通过slug获取文章详情成功');
  } else {
    console.log('❌ 通过slug获取文章详情失败');
  }

  return byIdResult.success && bySlugResult.success;
}

// 主函数
async function main() {
  try {
    const basicTestsPassed = await testEndpoints();
    
    if (basicTestsPassed) {
      await testArticleDetails();
    }

    console.log('\n🚀 测试完成！');
    
    if (basicTestsPassed) {
      console.log('\n💡 下一步建议:');
      console.log('   1. 启动前端开发服务器: npm run dev');
      console.log('   2. 访问 http://localhost:3000 查看博客');
      console.log('   3. 如果没有数据，运行: node scripts/import-test-data.js');
    } else {
      console.log('\n🔧 故障排除建议:');
      console.log('   1. 确保后端服务正在运行');
      console.log('   2. 检查后端端口是否正确 (默认3000)');
      console.log('   3. 检查CORS配置');
      console.log('   4. 查看后端日志获取更多信息');
    }

  } catch (error) {
    console.error('\n❌ 测试过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { testEndpoints, testArticleDetails };
