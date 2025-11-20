import { NextRequest, NextResponse } from 'next/server';

/**
 * 文章收藏API - POST /api/articles/[id]/bookmark
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`收藏文章: ${id}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/bookmark`, {
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
    console.error('文章收藏API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '收藏失败',
      },
      { status: 500 }
    );
  }
}