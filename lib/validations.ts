import { z } from 'zod'
import { PRODUCT_VARIANTS } from './utils'

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address: z.string().min(20, 'Please enter a complete delivery address'),
  productVariant: z.enum([
    'PACK_500G',
    'PACK_1KG',
    'PACK_10KG',
    'BULK_1TON',
    'BULK_2TON',
  ]),
  quantity: z.number().int().positive(),
  expectedDelivery: z.string().datetime(),
}).superRefine((data, ctx) => {
  const variant = PRODUCT_VARIANTS[data.productVariant]
  if (data.quantity < variant.minOrderQty) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['quantity'],
      message: `Minimum order for ${variant.label} is ${variant.minOrderQty} ${variant.unit}`,
    })
  }
})

export type OrderFormData = z.infer<typeof orderSchema>

export const sellRequestSchema = z.object({
  sellerName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  location: z.string().min(10, 'Please enter your city, state and PIN code'),
  productVariant: z.enum([
    'PACK_500G',
    'PACK_1KG',
    'PACK_10KG',
    'BULK_1TON',
    'BULK_2TON',
  ]),
  quantity: z.number().int().positive(),
  askingPricePerUnit: z.number().positive('Asking price must be greater than 0'),
  availableFrom: z.string().datetime(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  const variant = PRODUCT_VARIANTS[data.productVariant]
  if (data.quantity < variant.minOrderQty) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['quantity'],
      message: `Minimum quantity for ${variant.label} is ${variant.minOrderQty} ${variant.unit}`,
    })
  }
})

export type SellRequestFormData = z.infer<typeof sellRequestSchema>
