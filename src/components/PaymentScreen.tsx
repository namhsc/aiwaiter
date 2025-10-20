import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Banknote, QrCode, CheckCircle2, Lock, Plus, Sparkles } from 'lucide-react';
import { Voucher } from '../types/menu';

interface PaymentScreenProps {
  subtotal: number;
  discount: number;
  total: number;
  onComplete: () => void;
  onOpenAI?: () => void;
  onAddMoreItems?: () => void;
  appliedVoucher: Voucher | null;
}

export function PaymentScreen({ subtotal, discount, total, onComplete, onOpenAI, onAddMoreItems, appliedVoucher }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const paymentMethods = [
    { id: 'cash', name: 'Cash', subtitle: 'Pay at the table', icon: Banknote },
    { id: 'card', name: 'Credit/Debit Card', subtitle: 'Secure card payment', icon: CreditCard },
    { id: 'qr', name: 'QR Pay', subtitle: 'Scan to pay', icon: QrCode }
  ];

  const handlePayment = () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      // Auto-advance after showing success
      setTimeout(() => {
        onComplete();
      }, 2500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <div className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="bg-[#3E2723] rounded-b-3xl p-8 text-center space-y-2">
                <h1 className="text-white text-2xl">Payment</h1>
                <p className="text-white/80 text-sm">Complete your order 📦</p>
              </div>

              <div className="px-4 space-y-6">
                {/* Total Amount Card with Discount Display */}
                <div className="bg-white rounded-2xl border-2 border-[#C4941D] p-6 shadow-sm">
                  {discount > 0 && appliedVoucher ? (
                    <div className="space-y-3">
                      {/* Discount Badge */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#C4941D]" />
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          {appliedVoucher.code} Applied
                        </span>
                      </div>

                      {/* Original Price with Strikethrough */}
                      <div className="text-center">
                        <div className="text-[#8B7355] text-sm mb-1">Original Total</div>
                        <div className="text-gray-400 line-through text-2xl">
                          €{(subtotal * 1.19).toFixed(2)}
                        </div>
                      </div>

                      {/* Discount Amount */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-green-600 text-sm">Discount:</span>
                          <span className="text-green-700 text-lg">
                            {appliedVoucher.discountType === 'percentage' 
                              ? `-${appliedVoucher.discountValue}%` 
                              : `-€${discount.toFixed(2)}`}
                          </span>
                        </div>
                        {appliedVoucher.discountType === 'percentage' && (
                          <div className="text-center text-green-600 text-xs mt-1">
                            Save €{discount.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Final Discounted Price - Highlighted */}
                      <div className="text-center pt-2 border-t border-[#C4941D]/20">
                        <div className="text-[#C4941D] text-sm mb-1">You Pay</div>
                        <div className="text-[#C4941D] text-4xl">
                          €{total.toFixed(2)}
                        </div>
                        <div className="mt-2 bg-green-100 border border-green-200 rounded-lg py-1.5 px-3 inline-block">
                          <span className="text-green-700 text-xs">
                            🎉 You saved €{discount.toFixed(2)}!
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-[#C4941D] text-sm mb-2">Total Amount</div>
                      <div className="text-[#C4941D] text-4xl">
                        €{total.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <h2 className="text-[#3E2723] text-sm">Select Payment Method</h2>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 rounded-xl border ${
                          selectedMethod === method.id
                            ? 'border-[#C4941D] bg-[#FFF4E0]'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#3E2723]" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-[#3E2723] font-medium text-sm">{method.name}</div>
                            <div className="text-[#8B7355] text-xs">{method.subtitle}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Payment Instructions */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#FFF4E0] border border-[#C4941D]/30 rounded-xl p-4"
                  >
                    {selectedMethod === 'cash' && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">💵</span>
                          <p className="text-[#3E2723] text-sm">
                            Please prepare exact change or our staff will assist you with cash payment at your table
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">💳</span>
                          <p className="text-[#3E2723] text-sm">
                            A secure payment terminal will be brought to your table. All major credit and debit cards accepted.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'qr' && (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="bg-white p-4 rounded-xl shadow-sm">
                            <img 
                              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LumiereDoreePay_Order_${total.toFixed(2)}_Table7"
                              alt="QR Code for Payment"
                              className="w-40 h-40"
                            />
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xl">📱</span>
                          <p className="text-[#3E2723] text-sm text-center">
                            Scan the QR code above with your mobile payment app to complete the transaction.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full h-14 rounded-xl bg-[#C4941D] text-white shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Pay ${total.toFixed(2)}`
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#C4941D] pb-6">
                  <Lock className="w-3 h-3" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-[#3E2723]">Payment Successful! 🎉</h1>
                <p className="text-[#8B7355]">
                  Your payment of ${total.toFixed(2)} has been processed
                </p>
              </div>

              <div className="bg-[#E8F5E9] rounded-2xl p-4 border border-[#6B8E23]/30">
                <div className="text-[#6B8E23]">
                  ✓ Order confirmed and sent to kitchen
                </div>
              </div>

              <div className="text-[#8B7355] text-sm">
                Thank you for dining at Lumière Dorée! 🍽️
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Only show floating buttons before payment is complete */}
      {!isComplete && (
        <>
          {/* Floating AI Button */}
          {onOpenAI && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="fixed bottom-6 right-6 z-30"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAI}
                className="w-16 h-16 bg-[#C4941D] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
              >
                <div className="text-2xl">🤵</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6B8E23] rounded-full border-2 border-white animate-pulse" />
              </motion.button>
            </motion.div>
          )}

          {/* Add More Items Button */}
          {onAddMoreItems && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="fixed bottom-6 left-6 z-30"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onAddMoreItems}
                className="w-16 h-16 bg-white text-[#C4941D] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#C4941D]"
                title="Add more items"
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
