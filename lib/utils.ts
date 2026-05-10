export const PRODUCT_VARIANTS = {
  PACK_500G: {
    label: '500g Pack',
    category: 'small',
    minOrderQty: 1000,
    unit: 'packs',
    defaultPrice: 15,
  },
  PACK_1KG: {
    label: '1kg Pack',
    category: 'small',
    minOrderQty: 1000,
    unit: 'packs',
    defaultPrice: 28,
  },
  PACK_10KG: {
    label: '10kg Pack',
    category: 'small',
    minOrderQty: 1000,
    unit: 'packs',
    defaultPrice: 240,
  },
  BULK_1TON: {
    label: '1 Ton Bulk Bag',
    category: 'bulk',
    minOrderQty: 1,
    unit: 'bags',
    defaultPrice: 28000,
  },
  BULK_2TON: {
    label: '2 Ton Bulk Bag',
    category: 'bulk',
    minOrderQty: 1,
    unit: 'bags',
    defaultPrice: 54000,
  },
} as const

export type ProductVariantKey = keyof typeof PRODUCT_VARIANTS

export function getMinQty(variant: ProductVariantKey): number {
  return PRODUCT_VARIANTS[variant].minOrderQty
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `SALT-${year}-${random}`
}

export function formatCurrency(amount: number | { toNumber(): number }): string {
  const num = typeof amount === 'number' ? amount : amount.toNumber()
  return `₹${num.toLocaleString('en-IN')}`
}
