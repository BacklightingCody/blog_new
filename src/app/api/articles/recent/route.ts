import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取最新文章API - GET /api/articles/recent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // 构建后端URL并转发查询参数
    const backendUrl = new URL(`${backendApiUrl}/api/articles/recent`);
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    console.log('获取最新文章');

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
    console.error('获取最新文章API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取最新文章失败',
      },
      { status: 500 }
    );
  }
}