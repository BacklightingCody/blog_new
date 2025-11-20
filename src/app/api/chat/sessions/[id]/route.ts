import { NextRequest, NextResponse } from 'next/server'

const getBackendBase = () => process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${getBackendBase()}/chat/sessions/${params.id}`, {
      headers: { 'Content-Type': 'application/json', Authorization: req.headers.get('authorization') || '' },
      cache: 'no-store'
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const res = await fetch(`${getBackendBase()}/chat/sessions/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: req.headers.get('authorization') || '' },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${getBackendBase()}/chat/sessions/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: req.headers.get('authorization') || '' }
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e?.message || 'proxy error' }, { status: 500 })
  }
}


