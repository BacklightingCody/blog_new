import { NextRequest, NextResponse } from 'next/server';

/**
 * 根据slug获取文章API - GET /api/articles/slug/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = (await params).slug;
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    console.log(`根据slug获取文章: ${slug}`);

    // 调用后端API
    const response = await fetch(`${backendApiUrl}/api/articles/slug/${encodeURIComponent(slug)}`, {
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
    console.error('根据slug获取文章API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取文章失败',
      },
      { status: 500 }
    );
  }
}