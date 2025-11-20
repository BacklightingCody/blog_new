import { NextRequest, NextResponse } from 'next/server';

/**
 * 文章点赞API - POST /api/articles/[id]/like
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`点赞文章: ${id}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/like`, {
      method: 'PATCH', // 后端使用PATCH
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
    console.error('文章点赞API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '点赞失败',
      },
      { status: 500 }
    );
  }
}