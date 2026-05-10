import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { format } from 'date-fns'
import { formatCurrency, PRODUCT_VARIANTS } from '@/lib/utils'
import { buildCustomerWALink, buildTeamWALink, buildStatusUpdateWALink } from '@/lib/whatsapp'
import { WhatsAppButton } from './WhatsAppButton'
import { StatusBadge } from './StatusBadge'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: string
  productVariant: string
  quantity: number
  pricePerUnit: number | { toNumber(): number }
  totalPrice: number | { toNumber(): number }
  expectedDelivery: string | Date
  status: OrderStatus
  createdAt: string | Date
}

interface Props {
  orders: Order[]
}

export function AdminOrderTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">No orders found.</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  style={{ color: '#1a56db', fontFamily: 'monospace', fontWeight: 600, textDecoration: 'none' }}
                >
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.customerName}</Typography>
                <Typography variant="caption" color="text.secondary">{order.email}</Typography>
              </TableCell>
              <TableCell>
                {PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS]?.label ?? order.productVariant}
              </TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(order.createdAt), 'dd MMM')}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <WhatsAppButton
                    href={buildCustomerWALink(order as Parameters<typeof buildCustomerWALink>[0])}
                    label="Customer"
                    variant="customer"
                  />
                  <WhatsAppButton
                    href={buildTeamWALink(order as Parameters<typeof buildTeamWALink>[0])}
                    label="Team"
                    variant="team"
                  />
                  {order.status !== 'PENDING' && (
                    <WhatsAppButton
                      href={buildStatusUpdateWALink(order as Parameters<typeof buildStatusUpdateWALink>[0])}
                      label="Update"
                      variant="customer"
                    />
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
