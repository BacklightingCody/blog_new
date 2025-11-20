import { NextRequest, NextResponse } from 'next/server'

const getBackendBase = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const url = `${getBackendBase()}/chat/sessions/${params.id}/messages`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('authorization') || '',
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}


