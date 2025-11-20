import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取单个评论API - GET /api/articles/[id]/comments/[commentId]
 * 更新评论API - PUT /api/articles/[id]/comments/[commentId]
 * 删除评论API - DELETE /api/articles/[id]/comments/[commentId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`获取评论详情: 文章${id}/评论${commentId}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments/${commentId}`, {
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
    console.error('获取评论详情API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取评论详情失败',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const body = await request.json();
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`更新评论: 文章${id}/评论${commentId}`);

    // 添加默认用户ID（实际项目中应该从认证信息获取）
    const updateData = {
      ...body,
      userId: body.userId || 1,
    };

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments/${commentId}`, {
      method: 'PATCH', // 后端使用PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('更新评论API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '更新评论失败',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`删除评论: 文章${id}/评论${commentId}`);

    // 删除时需要提供用户ID进行权限验证
    const deleteData = {
      userId: 1, // 默认用户ID，实际项目中应该从认证信息获取
    };

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('删除评论API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '删除评论失败',
      },
      { status: 500 }
    );
  }
}