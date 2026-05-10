'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { format } from 'date-fns'
import { formatCurrency, PRODUCT_VARIANTS } from '@/lib/utils'
import { buildCustomerWALink, buildTeamWALink, buildStatusUpdateWALink } from '@/lib/whatsapp'
import { WhatsAppButton } from './WhatsAppButton'
import { StatusBadge } from './StatusBadge'
import { StatusTimeline } from './StatusTimeline'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED',
]

interface StatusHistoryEntry {
  id: string
  status: OrderStatus
  note?: string | null
  changedBy?: string | null
  changedAt: string | Date
}

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
  notes?: string | null
  createdAt: string | Date
  updatedAt: string | Date
  statusHistory: StatusHistoryEntry[]
}

interface Props {
  order: Order
}

export function AdminOrderDetail({ order: initialOrder }: Props) {
  const [order, setOrder] = useState(initialOrder)
  const [newStatus, setNewStatus] = useState<OrderStatus>(initialOrder.status)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const variantLabel =
    PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS]?.label ?? order.productVariant

  async function handleStatusUpdate() {
    if (newStatus === order.status && !note.trim()) return
    setLoading(true)
    setSuccess('')
    setError('')

    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, note: note.trim() || undefined }),
    })

    const json = await res.json()

    if (res.ok) {
      setOrder(json.order)
      setNote('')
      setSuccess(`Status updated to ${newStatus}`)
    } else {
      setError('Failed to update status. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
            {order.orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Placed {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
          </Typography>
        </Box>
        <StatusBadge status={order.status} size="medium" />
      </Box>

      <Grid container spacing={3}>
        {/* Left: Order info */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Customer */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Customer</Typography>
            <Typography variant="body2"><strong>Name:</strong> {order.customerName}</Typography>
            <Typography variant="body2"><strong>Email:</strong> {order.email}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> +{order.phone}</Typography>
            <Typography variant="body2"><strong>Address:</strong> {order.address}</Typography>
          </Paper>

          {/* Order details */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Order Details</Typography>
            <Typography variant="body2"><strong>Product:</strong> {variantLabel}</Typography>
            <Typography variant="body2"><strong>Quantity:</strong> {order.quantity} units</Typography>
            <Typography variant="body2"><strong>Price per unit:</strong> {formatCurrency(order.pricePerUnit)}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
              <strong>Total:</strong> {formatCurrency(order.totalPrice)}
            </Typography>
            <Typography variant="body2">
              <strong>Expected Delivery:</strong> {format(new Date(order.expectedDelivery), 'dd MMM yyyy')}
            </Typography>
          </Paper>

          {/* WhatsApp actions */}
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>WhatsApp Actions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <WhatsAppButton
                href={buildCustomerWALink(order as unknown as Parameters<typeof buildCustomerWALink>[0])}
                label="Message Customer"
                variant="customer"
                size="medium"
              />
              <WhatsAppButton
                href={buildTeamWALink(order as unknown as Parameters<typeof buildTeamWALink>[0])}
                label="Alert Team"
                variant="team"
                size="medium"
              />
              {order.status !== 'PENDING' && (
                <WhatsAppButton
                  href={buildStatusUpdateWALink(order as unknown as Parameters<typeof buildStatusUpdateWALink>[0])}
                  label="Send Status Update"
                  variant="customer"
                  size="medium"
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right: Status update + timeline */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Update Status</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                select
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Note (optional)"
                multiline
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g. Payment confirmed via UPI"
              />
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                variant="contained"
                onClick={handleStatusUpdate}
                disabled={loading}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Status'}
              </Button>
            </Box>
          </Paper>

          <Divider sx={{ my: 2 }} />

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Order Timeline</Typography>
            <StatusTimeline order={order} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
