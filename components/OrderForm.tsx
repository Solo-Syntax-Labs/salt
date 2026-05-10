'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import { PRODUCT_VARIANTS, formatCurrency } from '@/lib/utils'

type ProductVariantKey = keyof typeof PRODUCT_VARIANTS

const MIN_DATE = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

export function OrderForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [variant, setVariant] = useState<ProductVariantKey>('PACK_1KG')
  const [quantity, setQuantity] = useState<number>(PRODUCT_VARIANTS['PACK_1KG'].minOrderQty)

  const selectedVariant = PRODUCT_VARIANTS[variant]
  const estimatedTotal = useMemo(
    () => selectedVariant.defaultPrice * quantity,
    [selectedVariant.defaultPrice, quantity]
  )

  function handleVariantChange(val: string) {
    const key = val as ProductVariantKey
    setVariant(key)
    setQuantity(PRODUCT_VARIANTS[key].minOrderQty)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement)?.value ?? ''

    const expectedDeliveryRaw = getValue('expectedDelivery')
    const expectedDelivery = expectedDeliveryRaw
      ? new Date(expectedDeliveryRaw).toISOString()
      : ''

    const payload = {
      customerName: getValue('customerName'),
      email: getValue('email'),
      phone: getValue('phone'),
      address: getValue('address'),
      productVariant: variant,
      quantity,
      expectedDelivery,
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (!res.ok) {
      const fieldErrors = json.error?.fieldErrors
      const msg =
        fieldErrors?.quantity?.[0] ??
        fieldErrors?.phone?.[0] ??
        fieldErrors?.address?.[0] ??
        'Something went wrong. Please try again.'
      setError(msg)
      setLoading(false)
      return
    }

    router.push(`/order/success?order=${json.orderNumber}`)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        select
        label="Product / Pack Size"
        value={variant}
        onChange={(e) => handleVariantChange(e.target.value)}
        required
        fullWidth
      >
        {Object.entries(PRODUCT_VARIANTS).map(([key, v]) => (
          <MenuItem key={key} value={key}>
            {v.label}
            {v.category === 'small' ? ` (min ${v.minOrderQty} packs)` : ''}
            {' — '}
            {formatCurrency(v.defaultPrice)} per {v.unit === 'packs' ? 'pack' : 'bag'}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label={`Quantity (minimum ${selectedVariant.minOrderQty} ${selectedVariant.unit})`}
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        slotProps={{ htmlInput: { min: selectedVariant.minOrderQty, step: 1 } }}
        required
        fullWidth
        helperText={`Estimated total: ${formatCurrency(estimatedTotal)}`}
      />

      <TextField
        name="customerName"
        label="Full Name"
        type="text"
        required
        fullWidth
        slotProps={{ htmlInput: { minLength: 2 } }}
      />

      <TextField
        name="email"
        label="Email Address"
        type="email"
        required
        fullWidth
      />

      <TextField
        name="phone"
        label="Mobile Number (10 digits)"
        type="tel"
        required
        fullWidth
        slotProps={{ htmlInput: { maxLength: 10, pattern: '[6-9][0-9]{9}' } }}
        helperText="Enter 10-digit Indian mobile number without country code"
      />

      <TextField
        name="address"
        label="Delivery Address"
        multiline
        rows={4}
        required
        fullWidth
        placeholder="Full address with city, state, and PIN code"
        slotProps={{ htmlInput: { minLength: 20 } }}
      />

      <TextField
        name="expectedDelivery"
        label="Expected Delivery Date"
        type="date"
        required
        fullWidth
        slotProps={{ htmlInput: { min: MIN_DATE }, inputLabel: { shrink: true } }}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        fullWidth
        sx={{ py: 1.5, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order →'}
      </Button>

      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Payment is manual. Our team will contact you after order review to arrange payment and confirm delivery.
        </Typography>
      </Paper>
    </Box>
  )
}
