import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { OrderForm } from '@/components/OrderForm'

export const metadata = {
  title: 'Place an Order — Salt India',
}

export default function OrderPage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Place an Order</Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in your details below. Our team will confirm your order and arrange payment.
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 } }}>
        <OrderForm />
      </Paper>
    </Container>
  )
}
