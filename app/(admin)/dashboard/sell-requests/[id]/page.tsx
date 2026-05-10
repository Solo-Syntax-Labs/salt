import { notFound } from 'next/navigation'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { prisma } from '@/lib/db'
import { AdminSellRequestDetail } from '@/components/AdminSellRequestDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SellRequestDetailPage({ params }: Props) {
  const { id } = await params

  const sell = await prisma.sellRequest.findUnique({
    where: { id },
    include: { statusHistory: { orderBy: { changedAt: 'asc' } } },
  })

  if (!sell) notFound()

  return (
    <Box>
      <Button
        component={Link}
        href="/dashboard/sell-requests"
        startIcon={<ArrowBackIcon />}
        sx={{ textTransform: 'none', mb: 3 }}
      >
        Back to Sell Requests
      </Button>
      <AdminSellRequestDetail sell={sell as never} />
    </Box>
  )
}
