'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') ?? ''

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 }, textAlign: 'center' }}>
      <CheckCircleOutlinedIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Order Placed!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Thank you for your order. Our team will review it and contact you within a few hours to confirm payment and delivery.
      </Typography>

      {orderNumber && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
          <Typography variant="overline" color="text.secondary">Your Order Number</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'primary.main', mt: 0.5 }}>
            {orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Save this number to track your order
          </Typography>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orderNumber && (
          <Button
            component={Link}
            href={`/track?order=${orderNumber}`}
            variant="contained"
            size="large"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Track My Order
          </Button>
        )}
        <Button
          component={Link}
          href="/"
          variant="outlined"
          size="large"
          sx={{ textTransform: 'none' }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
