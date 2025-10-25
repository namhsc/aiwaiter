/**
 * Payment Helper Functions
 * Provides payment instructions and checkout text formatting
 */

export function getPaymentInstructions(): string {
  return `━━━━━━━━━━━━━━━━━━━━━━\n\n**Payment Methods Available:** 💳\n\n💵 **Cash**\n   Pay directly to your server\n   Exact change appreciated\n\n💳 **Credit / Debit Card**\n   Visa, Mastercard, Amex accepted\n   Contactless available\n\n📱 **QR Code Payment**\n   Scan & pay with your mobile\n   Supports: Apple Pay, Google Pay\n   Alipay, WeChat Pay accepted\n\n━━━━━━━━━━━━━━━━━━━━━━`;
}

export function getCheckoutResponseText(cart: any[], grandTotal: number): string {
  const paymentInfo = getPaymentInstructions();
  
  return `Perfect! Let's proceed to checkout! 💳✨\n\n**Order Summary:**\n📦 ${cart.length} item(s) - ${cart.reduce((sum: number, item: any) => sum + item.quantity, 0)} total dishes\n💰 **Total: €${grandTotal.toFixed(2)}** (incl. 19% VAT)\n\n${paymentInfo}\n\n✨ **Ready to complete your order?**\n   Click the **Cart** button (top right) to finalize!\n\n💡 Want to add anything else before checkout? Just let me know!`;
}
