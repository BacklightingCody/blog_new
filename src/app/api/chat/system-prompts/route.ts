import { NextRequest, NextResponse } from 'next/server'

const getBackendBase = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${getBackendBase()}/chat/system-prompts`, {
      headers: {
        Authorization: req.headers.get('authorization') || ''
      },
      cache: 'no-store'
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${getBackendBase()}/chat/system-prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('authorization') || ''
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}


