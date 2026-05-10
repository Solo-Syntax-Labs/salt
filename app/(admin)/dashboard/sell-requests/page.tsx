import { prisma } from '@/lib/db'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { AdminSellRequestTable } from '@/components/AdminSellRequestTable'

const STATUS_TABS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'PENDING' },
  { label: 'Reviewing', value: 'REVIEWING' },
  { label: 'Accepted',  value: 'ACCEPTED' },
  { label: 'Rejected',  value: 'REJECTED' },
]

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function SellRequestsPage({ searchParams }: Props) {
  const { status, page } = await searchParams
  const currentPage = Number(page ?? 1)
  const limit = 20

  const where = status ? { status: status as never } : {}

  const [sellRequests, total] = await prisma.$transaction([
    prisma.sellRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * limit,
      take: limit,
    }),
    prisma.sellRequest.count({ where }),
  ])

  const counts = await prisma.sellRequest.groupBy({
    by: ['status'],
    _count: { id: true },
  })
  const countMap = Object.fromEntries(
    counts.map((c: { status: string; _count: { id: number } }) => [c.status, c._count.id])
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Sell Requests</Typography>
        <Typography variant="body2" color="text.secondary">{total} total</Typography>
      </Box>

      <Tabs
        value={status ?? ''}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {STATUS_TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.value ? `${tab.label} (${countMap[tab.value] ?? 0})` : `All (${total})`}
            value={tab.value}
            href={tab.value ? `/dashboard/sell-requests?status=${tab.value}` : '/dashboard/sell-requests'}
            component="a"
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        ))}
      </Tabs>

      <AdminSellRequestTable sellRequests={sellRequests as never} />

      {total > limit && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {currentPage > 1 && (
            <a href={`/dashboard/sell-requests?${status ? `status=${status}&` : ''}page=${currentPage - 1}`}>← Prev</a>
          )}
          <Typography variant="body2" color="text.secondary">
            Page {currentPage} of {Math.ceil(total / limit)}
          </Typography>
          {currentPage < Math.ceil(total / limit) && (
            <a href={`/dashboard/sell-requests?${status ? `status=${status}&` : ''}page=${currentPage + 1}`}>Next →</a>
          )}
        </Box>
      )}
    </Box>
  )
}
