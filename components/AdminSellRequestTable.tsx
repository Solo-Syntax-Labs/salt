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
import { buildSellerConfirmWALink, buildTeamSellAlertWALink, buildSellStatusUpdateWALink } from '@/lib/whatsapp'
import Chip from '@mui/material/Chip'
import { WhatsAppButton } from './WhatsAppButton'

type SellRequestStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'

interface SellRequest {
  id: string
  sellRequestNumber: string
  sellerName: string
  email: string
  phone: string
  location: string
  productVariant: string
  quantity: number
  askingPricePerUnit: number | { toNumber(): number }
  availableFrom: string | Date
  status: SellRequestStatus
  createdAt: string | Date
}

const SELL_STATUS_CONFIG: Record<SellRequestStatus, { label: string; color: 'warning' | 'info' | 'success' | 'error' }> = {
  PENDING:   { label: 'Pending',   color: 'warning' },
  REVIEWING: { label: 'Reviewing', color: 'info' },
  ACCEPTED:  { label: 'Accepted',  color: 'success' },
  REJECTED:  { label: 'Rejected',  color: 'error' },
}

function SellStatusChip({ status }: { status: SellRequestStatus }) {
  const { label, color } = SELL_STATUS_CONFIG[status] ?? { label: status, color: 'warning' }
  return <Chip label={label} color={color} size="small" />
}

interface Props {
  sellRequests: SellRequest[]
}

export function AdminSellRequestTable({ sellRequests }: Props) {
  if (sellRequests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">No sell requests found.</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 700 }}>Request #</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Seller</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Asking / unit</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellRequests.map((sell) => (
            <TableRow key={sell.id} hover>
              <TableCell>
                <Link
                  href={`/dashboard/sell-requests/${sell.id}`}
                  style={{ color: '#0e9f6e', fontFamily: 'monospace', fontWeight: 600, textDecoration: 'none' }}
                >
                  {sell.sellRequestNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{sell.sellerName}</Typography>
                <Typography variant="caption" color="text.secondary">{sell.email}</Typography>
              </TableCell>
              <TableCell>
                {PRODUCT_VARIANTS[sell.productVariant as keyof typeof PRODUCT_VARIANTS]?.label ?? sell.productVariant}
              </TableCell>
              <TableCell>{sell.quantity}</TableCell>
              <TableCell>{formatCurrency(sell.askingPricePerUnit)}</TableCell>
              <TableCell>
                <Typography variant="caption">{sell.location}</Typography>
              </TableCell>
              <TableCell>
                <SellStatusChip status={sell.status} />
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(sell.createdAt), 'dd MMM')}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  <WhatsAppButton
                    href={buildSellerConfirmWALink(sell as Parameters<typeof buildSellerConfirmWALink>[0])}
                    label="Seller"
                    variant="customer"
                  />
                  <WhatsAppButton
                    href={buildTeamSellAlertWALink(sell as Parameters<typeof buildTeamSellAlertWALink>[0])}
                    label="Team"
                    variant="team"
                  />
                  {sell.status !== 'PENDING' && (
                    <WhatsAppButton
                      href={buildSellStatusUpdateWALink(sell as Parameters<typeof buildSellStatusUpdateWALink>[0])}
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
