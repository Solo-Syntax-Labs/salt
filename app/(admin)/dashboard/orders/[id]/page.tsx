import { notFound } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { prisma } from '@/lib/db'
import { AdminOrderDetail } from '@/components/AdminOrderDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
  })

  if (!order) notFound()

  return (
    <Box>
      <Button
        component={Link}
        href="/dashboard"
        startIcon={<ArrowBackIcon />}
        sx={{ textTransform: 'none', mb: 3 }}
      >
        Back to Orders
      </Button>
      <AdminOrderDetail order={order as never} />
    </Box>
  )
}
