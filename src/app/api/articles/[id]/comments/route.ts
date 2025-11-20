import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取文章评论列表API - GET /api/articles/[id]/comments
 * 发表文章评论API - POST /api/articles/[id]/comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const { searchParams } = new URL(request.url);
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // 构建后端URL并转发查询参数
    const backendUrl = new URL(`${backendApiUrl}/api/articles/${id}/comments`);
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    console.log(`获取文章评论: ${id}`);

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
    console.error('获取文章评论API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取评论失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`发表评论到文章: ${id}`);

    // 添加默认用户ID（实际项目中应该从认证信息获取）
    const commentData = {
      ...body,
      userId: body.userId || 1, // 默认用户ID
    };

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('发表评论API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '发表评论失败',
      },
      { status: 500 }
    );
  }
}