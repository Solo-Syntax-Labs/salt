import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sell = await prisma.sellRequest.findUnique({
    where: { id },
    include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
  })

  if (!sell) return NextResponse.json({ error: 'Sell request not found' }, { status: 404 })
  return NextResponse.json({ sell })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, note, changedBy } = await req.json()

    const sell = await prisma.sellRequest.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: { status, note, changedBy: changedBy ?? 'admin' },
        },
      },
      include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
    })

    return NextResponse.json({ success: true, sell })
  } catch (err) {
    console.error('Sell request status update error:', err)
    return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 })
  }
}
