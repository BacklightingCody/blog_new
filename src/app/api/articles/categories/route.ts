import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取文章分类API - GET /api/articles/categories
 */
export async function GET(request: NextRequest) {
  try {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log('获取文章分类列表');

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/categories`, {
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
    console.error('获取文章分类API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取文章分类失败',
      },
      { status: 500 }
    );
  }
}