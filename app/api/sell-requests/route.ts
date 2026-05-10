import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sellRequestSchema } from '@/lib/validations'
import { sendSellRequestEmails } from '@/lib/email'
import { SellRequestStatus } from '@prisma/client'

function generateSellRequestNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `SELL-${year}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = sellRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    const sell = await prisma.sellRequest.create({
      data: {
        sellRequestNumber: generateSellRequestNumber(),
        sellerName: data.sellerName,
        email: data.email,
        phone: `91${data.phone}`,
        location: data.location,
        productVariant: data.productVariant,
        quantity: data.quantity,
        askingPricePerUnit: data.askingPricePerUnit,
        availableFrom: new Date(data.availableFrom),
        notes: data.notes,
        statusHistory: {
          create: {
            status: 'PENDING',
            changedBy: 'system',
            note: 'Sell request submitted by seller',
          },
        },
      },
    })

    sendSellRequestEmails(sell).catch(console.error)

    return NextResponse.json(
      { success: true, sellRequestNumber: sell.sellRequestNumber, id: sell.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('Sell request creation error:', err)
    return NextResponse.json({ error: 'Failed to create sell request' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const where = status ? { status: status as SellRequestStatus } : {}

  const [sellRequests, total] = await prisma.$transaction([
    prisma.sellRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.sellRequest.count({ where }),
  ])

  return NextResponse.json({ sellRequests, total, page, limit })
}
