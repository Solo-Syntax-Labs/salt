import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
  })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, note, changedBy } = await req.json()

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: { status, note, changedBy: changedBy ?? 'admin' },
        },
      },
      include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
    })

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
