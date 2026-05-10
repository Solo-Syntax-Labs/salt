import nodemailer from 'nodemailer'
import { Order, SellRequest } from '@prisma/client'
import { formatCurrency, PRODUCT_VARIANTS } from './utils'
import { format } from 'date-fns'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendOrderEmails(order: Order) {
  const variantLabel =
    PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const delivery = format(new Date(order.expectedDelivery), 'dd MMM yyyy')
  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/track?order=${order.orderNumber}`

  await Promise.allSettled([
    transporter.sendMail({
      from: `"Salt India" <${process.env.GMAIL_USER}>`,
      to: order.email,
      subject: `Order Received — ${order.orderNumber} | Salt India`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">Thank you for your order, ${order.customerName}!</h2>
          <p>We have received your order and our team will contact you shortly to confirm payment and delivery.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Order Number</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.orderNumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Product</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${variantLabel} × ${order.quantity}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total Amount</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCurrency(order.totalPrice)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Delivery Address</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.address}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Expected Delivery</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${delivery}</td></tr>
          </table>
          <p><a href="${trackUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Track Your Order</a></p>
          <p style="color: #6b7280; font-size: 14px;">For queries, contact us at ${process.env.TEAM_EMAIL}</p>
          <p style="color: #6b7280; font-size: 14px;">— Salt India Team</p>
        </div>
      `,
    }),

    transporter.sendMail({
      from: `"Salt India Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.TEAM_EMAIL,
      subject: `🧂 New Order: ${order.orderNumber} — ${variantLabel} × ${order.quantity}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Order Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Order #</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.orderNumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Customer</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.customerName}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">+${order.phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.email}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Product</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${variantLabel}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.quantity} units</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Total</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCurrency(order.totalPrice)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Address</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${order.address}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Expected Delivery</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${delivery}</td></tr>
          </table>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${order.id}" style="display: inline-block; background: #dc2626; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">View in Admin Dashboard →</a></p>
        </div>
      `,
    }),
  ])
}

export async function sendSellRequestEmails(sell: SellRequest) {
  const variantLabel =
    PRODUCT_VARIANTS[sell.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const available = format(new Date(sell.availableFrom), 'dd MMM yyyy')

  await Promise.allSettled([
    transporter.sendMail({
      from: `"Salt India" <${process.env.GMAIL_USER}>`,
      to: sell.email,
      subject: `Sell Request Received — ${sell.sellRequestNumber} | Salt India`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0e9f6e;">We've received your sell request, ${sell.sellerName}!</h2>
          <p>Our team will review the details and contact you within 24 hours to discuss the next steps.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Request Number</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.sellRequestNumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Product</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${variantLabel} × ${sell.quantity}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Asking Price</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCurrency(sell.askingPricePerUnit)} per unit</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Location</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.location}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Available From</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${available}</td></tr>
          </table>
          <p style="color: #6b7280; font-size: 14px;">For queries, contact us at ${process.env.TEAM_EMAIL}</p>
          <p style="color: #6b7280; font-size: 14px;">— Salt India Team</p>
        </div>
      `,
    }),

    transporter.sendMail({
      from: `"Salt India Orders" <${process.env.GMAIL_USER}>`,
      to: process.env.TEAM_EMAIL,
      subject: `🌿 New Sell Request: ${sell.sellRequestNumber} — ${variantLabel} × ${sell.quantity}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0e9f6e;">New Sell Request Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Request #</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.sellRequestNumber}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Seller</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.sellerName}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">+${sell.phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.email}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Product</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${variantLabel}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.quantity} units</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Asking Price</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${formatCurrency(sell.askingPricePerUnit)} per unit</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Location</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.location}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Available From</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${available}</td></tr>
            ${sell.notes ? `<tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Notes</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${sell.notes}</td></tr>` : ''}
          </table>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/sell-requests/${sell.id}" style="display: inline-block; background: #0e9f6e; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">View in Admin Dashboard →</a></p>
        </div>
      `,
    }),
  ])
}
