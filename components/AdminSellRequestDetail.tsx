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
import Chip from '@mui/material/Chip'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import { format } from 'date-fns'
import { formatCurrency, PRODUCT_VARIANTS } from '@/lib/utils'
import { buildSellerConfirmWALink, buildTeamSellAlertWALink, buildSellStatusUpdateWALink } from '@/lib/whatsapp'
import { WhatsAppButton } from './WhatsAppButton'

type SellRequestStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED'

const STATUS_OPTIONS: SellRequestStatus[] = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED']

const STATUS_CONFIG: Record<SellRequestStatus, { label: string; color: 'warning' | 'info' | 'success' | 'error' }> = {
  PENDING:   { label: 'Pending',   color: 'warning' },
  REVIEWING: { label: 'Reviewing', color: 'info' },
  ACCEPTED:  { label: 'Accepted',  color: 'success' },
  REJECTED:  { label: 'Rejected',  color: 'error' },
}

const LIFECYCLE_STEPS: SellRequestStatus[] = ['PENDING', 'REVIEWING', 'ACCEPTED']

interface SellStatusHistoryEntry {
  id: string
  status: SellRequestStatus
  note?: string | null
  changedBy?: string | null
  changedAt: string | Date
}

interface SellRequestData {
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
  notes?: string | null
  createdAt: string | Date
  statusHistory: SellStatusHistoryEntry[]
}

interface Props {
  sell: SellRequestData
}

export function AdminSellRequestDetail({ sell: initialSell }: Props) {
  const [sell, setSell] = useState(initialSell)
  const [newStatus, setNewStatus] = useState<SellRequestStatus>(initialSell.status)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const variantLabel =
    PRODUCT_VARIANTS[sell.productVariant as keyof typeof PRODUCT_VARIANTS]?.label ?? sell.productVariant
  const { label: statusLabel, color: statusColor } = STATUS_CONFIG[sell.status]

  const isRejected = sell.status === 'REJECTED'
  const currentStepIndex = isRejected ? -1 : LIFECYCLE_STEPS.indexOf(sell.status)

  async function handleStatusUpdate() {
    if (newStatus === sell.status && !note.trim()) return
    setLoading(true)
    setSuccess('')
    setError('')

    const res = await fetch(`/api/sell-requests/${sell.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, note: note.trim() || undefined }),
    })

    const json = await res.json()

    if (res.ok) {
      setSell(json.sell)
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
            {sell.sellRequestNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Submitted {format(new Date(sell.createdAt), 'dd MMM yyyy, hh:mm a')}
          </Typography>
        </Box>
        <Chip label={statusLabel} color={statusColor} size="medium" />
      </Box>

      <Grid container spacing={3}>
        {/* Left: Seller + stock info + WA actions */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Seller Details</Typography>
            <Typography variant="body2"><strong>Name:</strong> {sell.sellerName}</Typography>
            <Typography variant="body2"><strong>Email:</strong> {sell.email}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> +{sell.phone}</Typography>
            <Typography variant="body2"><strong>Location:</strong> {sell.location}</Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Stock Details</Typography>
            <Typography variant="body2"><strong>Product:</strong> {variantLabel}</Typography>
            <Typography variant="body2"><strong>Quantity:</strong> {sell.quantity} units</Typography>
            <Typography variant="body2">
              <strong>Asking Price:</strong> {formatCurrency(sell.askingPricePerUnit)} per unit
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
              <strong>Total Value:</strong>{' '}
              {formatCurrency(
                (typeof sell.askingPricePerUnit === 'number'
                  ? sell.askingPricePerUnit
                  : sell.askingPricePerUnit.toNumber()) * sell.quantity
              )}
            </Typography>
            <Typography variant="body2">
              <strong>Available From:</strong> {format(new Date(sell.availableFrom), 'dd MMM yyyy')}
            </Typography>
            {sell.notes && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Notes:</strong> {sell.notes}
              </Typography>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>WhatsApp Actions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <WhatsAppButton
                href={buildSellerConfirmWALink(sell as Parameters<typeof buildSellerConfirmWALink>[0])}
                label="Message Seller"
                variant="customer"
                size="medium"
              />
              <WhatsAppButton
                href={buildTeamSellAlertWALink(sell as Parameters<typeof buildTeamSellAlertWALink>[0])}
                label="Alert Team"
                variant="team"
                size="medium"
              />
              {sell.status !== 'PENDING' && (
                <WhatsAppButton
                  href={buildSellStatusUpdateWALink(sell as Parameters<typeof buildSellStatusUpdateWALink>[0])}
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
                onChange={(e) => setNewStatus(e.target.value as SellRequestStatus)}
                fullWidth
                size="small"
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{STATUS_CONFIG[s].label}</MenuItem>
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
                placeholder="e.g. Contacted seller, reviewing stock quality"
              />
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                variant="contained"
                color="secondary"
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
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Request Timeline</Typography>

            {isRejected ? (
              <Box sx={{ p: 1.5, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
                <Typography sx={{ color: 'error.main', fontWeight: 500, fontSize: 14 }}>
                  This sell request was rejected.
                </Typography>
                {sell.statusHistory.filter((h) => h.status === 'REJECTED').map((h) => (
                  <Typography key={h.id} variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {format(new Date(h.changedAt), 'dd MMM yyyy, hh:mm a')}
                    {h.note && ` — ${h.note}`}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Stepper activeStep={currentStepIndex} orientation="vertical">
                {LIFECYCLE_STEPS.map((step, i) => {
                  const history = sell.statusHistory.find((h) => h.status === step)
                  const done = i <= currentStepIndex
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
                        {STATUS_CONFIG[step].label}
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
