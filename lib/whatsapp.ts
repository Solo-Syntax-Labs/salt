import { Order, SellRequest } from '@prisma/client'
import { formatCurrency, PRODUCT_VARIANTS } from './utils'
import { format } from 'date-fns'

function encode(msg: string): string {
  return encodeURIComponent(msg.trim())
}

export function buildCustomerWALink(order: Order): string {
  const variantLabel = PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const delivery = format(new Date(order.expectedDelivery), 'dd MMM yyyy')

  const msg = `
🧂 *Salt Order Confirmed — ${order.orderNumber}*

Hi ${order.customerName}, thank you for your order with Salt India!

📦 *Product:* ${variantLabel}
🔢 *Quantity:* ${order.quantity} units
💰 *Total Amount:* ${formatCurrency(order.totalPrice)}
📍 *Delivery Address:* ${order.address}
🗓️ *Expected Delivery:* ${delivery}

Your order is being reviewed by our team. We'll contact you to confirm payment and delivery.

Track your order anytime:
${process.env.NEXT_PUBLIC_SITE_URL}/track?order=${order.orderNumber}

For queries, reply to this message.
— Salt India Team
  `
  return `https://wa.me/${order.phone}?text=${encode(msg)}`
}

export function buildTeamWALink(order: Order): string {
  const variantLabel = PRODUCT_VARIANTS[order.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const delivery = format(new Date(order.expectedDelivery), 'dd MMM yyyy')

  const msg = `
🔔 *NEW ORDER — ${order.orderNumber}*

👤 *Customer:* ${order.customerName}
📞 *Phone:* +${order.phone}
📧 *Email:* ${order.email}

📦 *Product:* ${variantLabel}
🔢 *Quantity:* ${order.quantity} units
💰 *Total:* ${formatCurrency(order.totalPrice)}
📍 *Address:* ${order.address}
🗓️ *Delivery:* ${delivery}

Action required:
1. Confirm stock availability
2. Call customer to arrange payment
3. Assign delivery team

Admin: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/orders/${order.id}
  `
  return `https://wa.me/${process.env.TEAM_WHATSAPP_NUMBER}?text=${encode(msg)}`
}

export function buildStatusUpdateWALink(order: Order): string {
  const statusMessages: Record<string, string> = {
    CONFIRMED: `✅ Great news! Your order *${order.orderNumber}* has been confirmed. Our team is preparing your shipment.`,
    PROCESSING: `⚙️ Your order *${order.orderNumber}* is now being packed and prepared for dispatch.`,
    DISPATCHED: `🚛 Your order *${order.orderNumber}* has been dispatched! Our delivery team is on the way.`,
    IN_TRANSIT: `📍 Your order *${order.orderNumber}* is in transit and will arrive soon.`,
    DELIVERED: `🎉 Your order *${order.orderNumber}* has been delivered successfully. Thank you for choosing Salt India!`,
    CANCELLED: `❌ Your order *${order.orderNumber}* has been cancelled. Please contact us if you have questions.`,
  }

  const msg = `
Hi ${order.customerName},

${statusMessages[order.status] ?? `Your order ${order.orderNumber} status has been updated.`}

Track your order: ${process.env.NEXT_PUBLIC_SITE_URL}/track?order=${order.orderNumber}

— Salt India Team
  `
  return `https://wa.me/${order.phone}?text=${encode(msg)}`
}

export function buildSellerConfirmWALink(sell: SellRequest): string {
  const variantLabel = PRODUCT_VARIANTS[sell.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const available = format(new Date(sell.availableFrom), 'dd MMM yyyy')

  const msg = `
🧂 *Sell Request Received — ${sell.sellRequestNumber}*

Hi ${sell.sellerName}, we have received your sell request!

📦 *Product:* ${variantLabel}
🔢 *Quantity:* ${sell.quantity} units
💰 *Asking Price:* ${formatCurrency(sell.askingPricePerUnit)} per unit
📍 *Location:* ${sell.location}
🗓️ *Available From:* ${available}

Our team will review your request and contact you within 24 hours to discuss the next steps.

— Salt India Team
  `
  return `https://wa.me/${sell.phone}?text=${encode(msg)}`
}

export function buildTeamSellAlertWALink(sell: SellRequest): string {
  const variantLabel = PRODUCT_VARIANTS[sell.productVariant as keyof typeof PRODUCT_VARIANTS].label
  const available = format(new Date(sell.availableFrom), 'dd MMM yyyy')

  const msg = `
🔔 *NEW SELL REQUEST — ${sell.sellRequestNumber}*

👤 *Seller:* ${sell.sellerName}
📞 *Phone:* +${sell.phone}
📧 *Email:* ${sell.email}

📦 *Product:* ${variantLabel}
🔢 *Quantity:* ${sell.quantity} units
💰 *Asking Price:* ${formatCurrency(sell.askingPricePerUnit)} per unit
📍 *Location:* ${sell.location}
🗓️ *Available From:* ${available}
${sell.notes ? `📝 *Notes:* ${sell.notes}` : ''}

Action required:
1. Review stock details and location
2. Call seller to negotiate price
3. Update request status in admin

Admin: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/sell-requests/${sell.id}
  `
  return `https://wa.me/${process.env.TEAM_WHATSAPP_NUMBER}?text=${encode(msg)}`
}

export function buildSellStatusUpdateWALink(sell: SellRequest): string {
  const statusMessages: Record<string, string> = {
    REVIEWING: `🔍 Your sell request *${sell.sellRequestNumber}* is now under review. Our team will contact you soon.`,
    ACCEPTED: `✅ Great news! Your sell request *${sell.sellRequestNumber}* has been accepted. Our team will reach out to finalise the deal.`,
    REJECTED: `❌ After review, we are unable to proceed with sell request *${sell.sellRequestNumber}* at this time. Please contact us if you have questions.`,
  }

  const msg = `
Hi ${sell.sellerName},

${statusMessages[sell.status] ?? `Your sell request ${sell.sellRequestNumber} status has been updated.`}

— Salt India Team
  `
  return `https://wa.me/${sell.phone}?text=${encode(msg)}`
}
