import { Voucher } from '../types/menu';

export const availableVouchers: Voucher[] = [
  {
    code: 'WELCOME10',
    description: '10% off your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 20,
    maxDiscount: 10,
    isActive: true,
    applicable: 'all'
  },
  {
    code: 'GOLD20',
    description: '20% off entire order',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    maxDiscount: 25,
    isActive: true,
    applicable: 'all'
  },
  {
    code: 'SAVE5',
    description: '€5 off your order',
    discountType: 'fixed',
    discountValue: 5,
    minOrderAmount: 25,
    isActive: true,
    applicable: 'all'
  },
  {
    code: 'DRINKS15',
    description: '15% off all beverages',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 10,
    isActive: true,
    applicable: 'drinks'
  },
  {
    code: 'DESSERT50',
    description: '50% off desserts',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 15,
    maxDiscount: 8,
    isActive: true,
    applicable: 'food'
  },
  {
    code: 'VIP30',
    description: '30% off for VIP members',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 60,
    maxDiscount: 35,
    isActive: true,
    applicable: 'all'
  },
  {
    code: 'EARLYBIRD',
    description: '€10 off early orders',
    discountType: 'fixed',
    discountValue: 10,
    minOrderAmount: 40,
    isActive: true,
    applicable: 'all'
  }
];

export function findVoucher(code: string): Voucher | undefined {
  return availableVouchers.find(
    v => v.code.toLowerCase() === code.toLowerCase() && v.isActive
  );
}

export function validateVoucher(
  voucher: Voucher,
  orderTotal: number,
  cartItems: any[]
): { valid: boolean; reason?: string } {
  if (!voucher.isActive) {
    return { valid: false, reason: 'This voucher is no longer active' };
  }

  if (voucher.minOrderAmount && orderTotal < voucher.minOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount is €${voucher.minOrderAmount.toFixed(2)}`
    };
  }

  if (voucher.validUntil && new Date() > voucher.validUntil) {
    return { valid: false, reason: 'This voucher has expired' };
  }

  if (voucher.applicable === 'drinks') {
    const hasDrinks = cartItems.some(item => item.category === 'drinks');
    if (!hasDrinks) {
      return { valid: false, reason: 'This voucher only applies to beverages' };
    }
  }

  if (voucher.applicable === 'specific' && voucher.specificItems) {
    const hasApplicableItems = cartItems.some(item =>
      voucher.specificItems?.includes(item.id)
    );
    if (!hasApplicableItems) {
      return { valid: false, reason: 'No applicable items in cart for this voucher' };
    }
  }

  return { valid: true };
}

export function calculateDiscount(
  voucher: Voucher,
  orderTotal: number,
  cartItems: any[]
): number {
  if (voucher.discountType === 'fixed') {
    return Math.min(voucher.discountValue, orderTotal);
  }

  if (voucher.discountType === 'percentage') {
    let applicableAmount = orderTotal;

    if (voucher.applicable === 'drinks') {
      applicableAmount = cartItems
        .filter(item => item.category === 'drinks')
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else if (voucher.applicable === 'food') {
      applicableAmount = cartItems
        .filter(item => item.category !== 'drinks')
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    } else if (voucher.applicable === 'specific' && voucher.specificItems) {
      applicableAmount = cartItems
        .filter(item => voucher.specificItems?.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    const discount = (applicableAmount * voucher.discountValue) / 100;

    if (voucher.maxDiscount) {
      return Math.min(discount, voucher.maxDiscount);
    }

    return discount;
  }

  if (voucher.discountType === 'free-item' && voucher.freeItemId) {
    const freeItem = cartItems.find(item => item.id === voucher.freeItemId);
    if (freeItem) {
      return freeItem.price;
    }
  }

  return 0;
}

export function getSuggestedVouchers(orderTotal: number): Voucher[] {
  return availableVouchers
    .filter(v => v.isActive)
    .filter(v => !v.minOrderAmount || orderTotal >= v.minOrderAmount)
    .sort((a, b) => {
      const aValue = a.discountType === 'fixed' ? a.discountValue : (orderTotal * a.discountValue) / 100;
      const bValue = b.discountType === 'fixed' ? b.discountValue : (orderTotal * b.discountValue) / 100;
      return bValue - aValue;
    })
    .slice(0, 3);
}
