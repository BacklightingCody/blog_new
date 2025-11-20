import { NextRequest, NextResponse } from 'next/server';

/**
 * 回复评论API - POST /api/articles/[id]/comments/[commentId]/reply
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const body = await request.json();
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`回复评论: 文章${id}/评论${commentId}`);

    // 对于回复功能，我们创建一个新的评论，并在后续可以扩展parentId字段
    // 目前先直接创建评论，后续可以扩展支持回复层级
    const replyData = {
      content: body.content,
      userId: body.userId || 1,
      // parentId: commentId, // 如果后端支持回复层级，可以添加这个字段
    };

    // 调用后端API创建新评论
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('回复评论API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '回复评论失败',
      },
      { status: 500 }
    );
  }
}