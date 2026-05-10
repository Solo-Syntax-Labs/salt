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

function SellSuccessContent() {
  const params = useSearchParams()
  const ref = params.get('ref') ?? ''

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 }, textAlign: 'center' }}>
      <CheckCircleOutlinedIcon sx={{ fontSize: 72, color: 'secondary.main', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Sell Request Submitted!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Thank you for your submission. Our team will review your request and contact you within 24 hours.
      </Typography>

      {ref && (
        <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
          <Typography variant="overline" color="text.secondary">Your Reference Number</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'secondary.main', mt: 0.5 }}>
            {ref}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Save this number for your records
          </Typography>
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          component={Link}
          href="/"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Back to Home
        </Button>
        <Button
          component={Link}
          href="/sell"
          variant="outlined"
          size="large"
          sx={{ textTransform: 'none' }}
        >
          Submit Another Request
        </Button>
      </Box>
    </Container>
  )
}

export default function SellSuccessPage() {
  return (
    <Suspense>
      <SellSuccessContent />
    </Suspense>
  )
}
