'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Link from 'next/link'
import { PRODUCT_VARIANTS, formatCurrency } from '@/lib/utils'

export default function ProductsPage() {
  const retail = Object.entries(PRODUCT_VARIANTS).filter(([, v]) => v.category === 'small')
  const bulk = Object.entries(PRODUCT_VARIANTS).filter(([, v]) => v.category === 'bulk')

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        🧂 Our Products
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        All prices are per unit. Payment is manual — our team will contact you after placing an order.
      </Typography>

      <Alert severity="info" sx={{ mb: 5 }}>
        <strong>Retail packs</strong> have a minimum order of 1,000 units. <strong>Bulk bags</strong> have no minimum — order as many as you need.
      </Alert>

      {/* Retail packs */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Retail Packs</Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {retail.map(([key, v]) => (
          <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label="Retail" size="small" color="primary" variant="outlined" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>{v.label}</Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, my: 1 }}>
                  {formatCurrency(v.defaultPrice)}
                </Typography>
                <Typography variant="body2" color="text.secondary">per pack</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">
                  <strong>Min. Order:</strong> {v.minOrderQty} {v.unit}
                </Typography>
                <Typography variant="body2">
                  <strong>Min. Order Value:</strong> {formatCurrency(v.defaultPrice * v.minOrderQty)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  href={`/order?variant=${key}`}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Order Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bulk bags */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Bulk Bags</Typography>
      <Grid container spacing={3}>
        {bulk.map(([key, v]) => (
          <Grid key={key} size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label="Bulk" size="small" color="secondary" />
                  <Chip label="Best Value" size="small" color="warning" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>{v.label}</Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, my: 1 }}>
                  {formatCurrency(v.defaultPrice)}
                </Typography>
                <Typography variant="body2" color="text.secondary">per bag</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2">
                  <strong>Min. Order:</strong> {v.minOrderQty} {v.unit}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Ideal for industries, factories, and large distributors.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  href={`/order?variant=${key}`}
                  variant="contained"
                  fullWidth
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Order Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="body2" color="text.secondary">
          Need a custom quantity or have questions?{' '}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_SITE_URL ? '' : '919000000000'}`} target="_blank" rel="noopener noreferrer">
            Contact us on WhatsApp
          </a>
        </Typography>
      </Box>
    </Container>
  )
}
