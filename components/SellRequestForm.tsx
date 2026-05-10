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

const MIN_DATE = new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0]

export function SellRequestForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [variant, setVariant] = useState<ProductVariantKey>('PACK_1KG')
  const [quantity, setQuantity] = useState<number>(PRODUCT_VARIANTS['PACK_1KG'].minOrderQty)
  const [askingPrice, setAskingPrice] = useState<number>(PRODUCT_VARIANTS['PACK_1KG'].defaultPrice)

  const selectedVariant = PRODUCT_VARIANTS[variant]
  const estimatedTotal = useMemo(
    () => askingPrice * quantity,
    [askingPrice, quantity]
  )

  function handleVariantChange(val: string) {
    const key = val as ProductVariantKey
    setVariant(key)
    setQuantity(PRODUCT_VARIANTS[key].minOrderQty)
    setAskingPrice(PRODUCT_VARIANTS[key].defaultPrice)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement)?.value ?? ''

    const availableFromRaw = getValue('availableFrom')
    const availableFrom = availableFromRaw ? new Date(availableFromRaw).toISOString() : ''
    const notes = getValue('notes')

    const payload = {
      sellerName: getValue('sellerName'),
      email: getValue('email'),
      phone: getValue('phone'),
      location: getValue('location'),
      productVariant: variant,
      quantity,
      askingPricePerUnit: askingPrice,
      availableFrom,
      notes: notes || undefined,
    }

    const res = await fetch('/api/sell-requests', {
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
        fieldErrors?.location?.[0] ??
        fieldErrors?.askingPricePerUnit?.[0] ??
        'Something went wrong. Please try again.'
      setError(msg)
      setLoading(false)
      return
    }

    router.push(`/sell/success?ref=${json.sellRequestNumber}`)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        select
        label="Product / Pack Size you want to sell"
        value={variant}
        onChange={(e) => handleVariantChange(e.target.value)}
        required
        fullWidth
      >
        {Object.entries(PRODUCT_VARIANTS).map(([key, v]) => (
          <MenuItem key={key} value={key}>
            {v.label}
            {v.category === 'small' ? ` (min ${v.minOrderQty} packs)` : ''}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label={`Quantity available (minimum ${selectedVariant.minOrderQty} ${selectedVariant.unit})`}
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        slotProps={{ htmlInput: { min: selectedVariant.minOrderQty, step: 1 } }}
        required
        fullWidth
      />

      <TextField
        label="Asking Price per unit (₹)"
        type="number"
        value={askingPrice}
        onChange={(e) => setAskingPrice(Number(e.target.value))}
        slotProps={{ htmlInput: { min: 1, step: 0.01 } }}
        required
        fullWidth
        helperText={`Estimated total value: ${formatCurrency(estimatedTotal)}`}
      />

      <TextField
        name="sellerName"
        label="Your Full Name"
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
        name="location"
        label="Location (City, State, PIN)"
        type="text"
        required
        fullWidth
        placeholder="e.g. Ahmedabad, Gujarat 380001"
        slotProps={{ htmlInput: { minLength: 10 } }}
        helperText="Where the stock is currently located"
      />

      <TextField
        name="availableFrom"
        label="Available From (Date)"
        type="date"
        required
        fullWidth
        slotProps={{ htmlInput: { min: MIN_DATE }, inputLabel: { shrink: true } }}
        helperText="Earliest date the stock can be dispatched"
      />

      <TextField
        name="notes"
        label="Additional Notes (optional)"
        multiline
        rows={3}
        fullWidth
        placeholder="e.g. Type of salt, packaging condition, storage facility details…"
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        fullWidth
        color="secondary"
        sx={{ py: 1.5, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Sell Request →'}
      </Button>

      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Our team will review your request and contact you within 24 hours to discuss pricing and logistics.
        </Typography>
      </Paper>
    </Box>
  )
}
