import { NextRequest, NextResponse } from 'next/server';

/**
 * 获取单篇文章API - GET /api/articles/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`获取文章详情: ${id}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}`, {
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
    console.error('获取文章详情API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取文章详情失败',
      },
      { status: 500 }
    );
  }
}

/**
 * 更新文章API - PUT /api/articles/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}`, {
      method: 'PATCH', // 后端使用PATCH
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
    console.error('更新文章API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '更新文章失败',
      },
      { status: 500 }
    );
  }
}

/**
 * 删除文章API - DELETE /api/articles/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`删除文章: ${id}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/${id}`, {
      method: 'DELETE',
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
    console.error('删除文章API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '删除文章失败',
      },
      { status: 500 }
    );
  }
}