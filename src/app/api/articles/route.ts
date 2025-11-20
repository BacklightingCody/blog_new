import { NextRequest, NextResponse } from 'next/server';

/**
 * 文章列表API - GET /api/articles
 * 支持分页、搜索、分类过滤等功能
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构建后端API URL
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const backendUrl = new URL(`${backendApiUrl}/api/articles`);
    
    // 转发所有查询参数
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    console.log('转发请求到:', backendUrl.toString());

    // 调用后端API
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('文章列表API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取文章列表失败',
      },
      { status: 500 }
    );
  }
}

/**
 * 创建文章API - POST /api/articles
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('创建文章API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '创建文章失败',
      },
      { status: 500 }
    );
  }
}