import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import { SellRequestForm } from '@/components/SellRequestForm'

export const metadata = {
  title: 'Sell Salt — Submit a Sell Request | Salt India',
}

export default function SellPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          🌿 Sell Your Salt
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Have salt stock you want to sell? Submit a request with your details and our team will reach out within 24 hours.
        </Typography>
        <Alert severity="info" variant="outlined">
          Our team will review your request and contact you to negotiate pricing, verify stock quality, and arrange collection logistics.
        </Alert>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
        <SellRequestForm />
      </Paper>
    </Container>
  )
}
