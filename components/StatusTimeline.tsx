'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import { StatusBadge } from './StatusBadge'
import { format } from 'date-fns'
import { formatCurrency, PRODUCT_VARIANTS } from '@/lib/utils'

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'

interface StatusHistoryEntry {
  id: string
  status: OrderStatus
  note?: string | null
  changedBy?: string | null
  changedAt: string | Date
}

interface OrderData {
  id: string
  orderNumber: string
  customerName: string
  productVariant: string
  quantity: number
  totalPrice: number | { toNumber(): number }
  expectedDelivery: string | Date
  status: OrderStatus
  statusHistory: StatusHistoryEntry[]
}

const ORDER_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'DISPATCHED',
  'IN_TRANSIT',
  'DELIVERED',
]

const STEP_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  DISPATCHED: 'Dispatched',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

interface Props {
  order: OrderData
}

export function StatusTimeline({ order }: Props) {
  const isCancelled = order.status === 'CANCELLED'
  const currentIndex = isCancelled ? -1 : ORDER_STEPS.indexOf(order.status)
  const variantLabel =
    PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS]?.label ?? order.productVariant

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {order.orderNumber}
        </Typography>
        <StatusBadge status={order.status} size="medium" />
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2"><strong>Product:</strong> {variantLabel} × {order.quantity}</Typography>
        <Typography variant="body2"><strong>Total:</strong> {formatCurrency(order.totalPrice)}</Typography>
        <Typography variant="body2">
          <strong>Expected Delivery:</strong>{' '}
          {format(new Date(order.expectedDelivery), 'dd MMM yyyy')}
        </Typography>
      </Paper>

      {isCancelled ? (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.50', borderColor: 'error.main' }}>
          <Typography sx={{ color: 'error.main', fontWeight: 500 }}>This order has been cancelled.</Typography>
          {order.statusHistory
            .filter((h) => h.status === 'CANCELLED')
            .map((h) => (
              <Typography key={h.id} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {format(new Date(h.changedAt), 'dd MMM yyyy, hh:mm a')}
                {h.note && ` — ${h.note}`}
              </Typography>
            ))}
        </Paper>
      ) : (
        <Stepper activeStep={currentIndex} orientation="vertical">
          {ORDER_STEPS.map((step, i) => {
            const history = order.statusHistory.find((h) => h.status === step)
            const done = i <= currentIndex

            return (
              <Step key={step} completed={done}>
                <StepLabel
                  optional={
                    history ? (
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(history.changedAt), 'dd MMM yyyy, hh:mm a')}
                        {history.note && ` — ${history.note}`}
                      </Typography>
                    ) : null
                  }
                >
                  {STEP_LABELS[step]}
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {history?.note ?? ''}
                  </Typography>
                </StepContent>
              </Step>
            )
          })}
        </Stepper>
      )}
    </Box>
  )
}
