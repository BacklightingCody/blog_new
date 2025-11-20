import { NextRequest, NextResponse } from 'next/server';

/**
 * 评论点赞API - POST /api/articles/[id]/comments/[commentId]/like
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const body = await request.json().catch(() => ({}));
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`点赞评论: 文章${id}/评论${commentId}`);

    // 添加默认用户ID
    const likeData = {
      userId: body.userId || 1,
    };

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(likeData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('评论点赞API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '评论点赞失败',
      },
      { status: 500 }
    );
  }
}