import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { orderSchema } from '@/lib/validations'
import { generateOrderNumber, PRODUCT_VARIANTS } from '@/lib/utils'
import { sendOrderEmails } from '@/lib/email'
import { OrderStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const variant = PRODUCT_VARIANTS[data.productVariant]
    const totalPrice = variant.defaultPrice * data.quantity

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: data.customerName,
        email: data.email,
        phone: `91${data.phone}`,
        address: data.address,
        productVariant: data.productVariant,
        quantity: data.quantity,
        pricePerUnit: variant.defaultPrice,
        totalPrice,
        expectedDelivery: new Date(data.expectedDelivery),
        statusHistory: {
          create: {
            status: 'PENDING',
            changedBy: 'system',
            note: 'Order placed by customer',
          },
        },
      },
    })

    sendOrderEmails(order).catch(console.error)

    return NextResponse.json(
      { success: true, orderNumber: order.orderNumber, orderId: order.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('Order creation error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const orderNumber = searchParams.get('orderNumber')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  if (orderNumber) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json({ order })
  }

  const where = status ? { status: status as OrderStatus } : {}

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ orders, total, page, limit })
}
