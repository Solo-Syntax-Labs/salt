import Chip from '@mui/material/Chip'

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: 'warning' | 'info' | 'secondary' | 'primary' | 'default' | 'success' | 'error' }> = {
  PENDING:    { label: 'Pending',    color: 'warning' },
  CONFIRMED:  { label: 'Confirmed',  color: 'info' },
  PROCESSING: { label: 'Processing', color: 'secondary' },
  DISPATCHED: { label: 'Dispatched', color: 'primary' },
  IN_TRANSIT: { label: 'In Transit', color: 'default' },
  DELIVERED:  { label: 'Delivered',  color: 'success' },
  CANCELLED:  { label: 'Cancelled',  color: 'error' },
}

interface Props {
  status: OrderStatus
  size?: 'small' | 'medium'
}

export function StatusBadge({ status, size = 'small' }: Props) {
  const { label, color } = STATUS_CONFIG[status] ?? { label: status, color: 'default' }
  return <Chip label={label} color={color} size={size} />
}
