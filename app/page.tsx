'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import VerifiedIcon from '@mui/icons-material/Verified'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import Link from 'next/link'
import { PRODUCT_VARIANTS, formatCurrency } from '@/lib/utils'

const HIGHLIGHTS = [
  { icon: <LocalShippingIcon fontSize="large" color="primary" />, title: 'Pan-India Delivery', desc: 'We deliver to all major states across India — retail and bulk.' },
  { icon: <VerifiedIcon fontSize="large" color="primary" />, title: 'Quality Assured', desc: 'Iodised salt meeting FSSAI standards. Certificate available on request.' },
  { icon: <SupportAgentIcon fontSize="large" color="primary" />, title: 'Dedicated Support', desc: 'Reach us on WhatsApp instantly. Our team responds within hours.' },
]

export default function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a56db 0%, #0e9f6e 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
            🧂 Salt India
          </Typography>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 400, opacity: 0.92 }}>
            Premium Quality Salt — Retail &amp; Bulk Supply
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 520, mx: 'auto' }}>
            From 500g retail packs to 2-ton bulk bags. Order online, pay manually, delivered across India.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/order"
              variant="contained"
              size="large"
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700, '&:hover': { bgcolor: 'grey.100' }, textTransform: 'none', px: 4 }}
            >
              Place an Order
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.200', bgcolor: 'rgba(255,255,255,0.1)' }, textTransform: 'none', px: 4 }}
            >
              View Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Highlights */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {HIGHLIGHTS.map((h) => (
            <Grid key={h.title} size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined" sx={{ height: '100%', textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Box sx={{ mb: 1 }}>{h.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{h.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{h.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Product snapshot */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>Our Products</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
          Retail packs for distributors · Bulk bags for industries &amp; processors
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(PRODUCT_VARIANTS).map(([key, v]) => (
            <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="overline" color="primary">{v.category === 'bulk' ? 'Bulk' : 'Retail'}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{v.label}</Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700, my: 1 }}>
                    {formatCurrency(v.defaultPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Min. order: {v.minOrderQty} {v.unit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            component={Link}
            href="/order"
            variant="contained"
            size="large"
            sx={{ textTransform: 'none', px: 5, fontWeight: 600 }}
          >
            Place Your Order →
          </Button>
        </Box>
      </Container>

      {/* Sell CTA */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 5, md: 8 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Have salt to sell?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Submit a sell request with your stock details and asking price. Our team will review and contact you within 24 hours.
          </Typography>
          <Button
            component={Link}
            href="/sell"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
          >
            Submit a Sell Request 🌿
          </Button>
        </Container>
      </Box>

      {/* Track */}
      <Box sx={{ bgcolor: 'white', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Already ordered?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Track your order status in real-time with your order number.
          </Typography>
          <Button component={Link} href="/track" variant="outlined" size="large" sx={{ textTransform: 'none' }}>
            Track My Order
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.400', py: 4, textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Salt India. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          Manual payment · Pan-India delivery · FSSAI compliant
        </Typography>
      </Box>
    </Box>
  )
}
