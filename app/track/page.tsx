'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import { StatusTimeline } from '@/components/StatusTimeline'

function TrackContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState(params.get('order') ?? '')
  const [order, setOrder] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleTrack() {
    const trimmed = orderNumber.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setOrder(null)

    router.replace(`/track?order=${trimmed}`, { scroll: false })

    const res = await fetch(`/api/orders?orderNumber=${trimmed}`)
    const json = await res.json()

    if (!res.ok || !json.order) {
      setError('Order not found. Please check the order number and try again.')
    } else {
      setOrder(json.order)
    }
    setLoading(false)
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Track Your Order
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter your order number to see the current status.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        <TextField
          fullWidth
          label="Order Number"
          placeholder="e.g. SALT-2025-12345"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleTrack}
          disabled={loading}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', px: 3 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Track'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {order && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <StatusTimeline order={order as unknown as Parameters<typeof StatusTimeline>[0]['order']} />
        </Paper>
      )}
    </Container>
  )
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  )
}
