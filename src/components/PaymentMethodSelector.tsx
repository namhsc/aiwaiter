import { motion } from "motion/react";
import { CreditCard, Banknote, QrCode, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PaymentMethodSelectorProps {
  onConfirm: (method: { id: string; name: string }) => void;
  grandTotal: number;
}

export function PaymentMethodSelector({ onConfirm, grandTotal }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { 
      id: 'cash', 
      name: 'Cash', 
      subtitle: 'Pay directly to your server',
      description: 'Exact change appreciated',
      icon: Banknote,
      emoji: '💵'
    },
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      subtitle: 'Visa, Mastercard, Amex accepted',
      description: 'Contactless available',
      icon: CreditCard,
      emoji: '💳'
    },
    { 
      id: 'qr', 
      name: 'QR Code', 
      subtitle: 'Scan & pay with your mobile',
      description: 'Apple Pay, Google Pay, Alipay, WeChat Pay',
      icon: QrCode,
      emoji: '📱'
    }
  ];

  const handleConfirm = () => {
    const selected = paymentMethods.find(m => m.id === selectedMethod);
    if (selected) {
      onConfirm({ id: selected.id, name: selected.name });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-[#C4941D]/20 p-5 space-y-4 w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF4E0] flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#C4941D]" />
          </div>
          <span className="text-[#3E2723]">Payment Method</span>
        </div>
        <div className="bg-[#FFF4E0] text-[#C4941D] px-3 py-1 rounded-full text-xs border border-[#C4941D]/30">
          Total: €{grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Payment Method Options */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedMethod === method.id
                  ? 'border-[#C4941D] bg-[#FFF4E0] shadow-md'
                  : 'border-[#C4941D]/20 bg-white hover:border-[#C4941D]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  selectedMethod === method.id 
                    ? 'bg-[#C4941D] text-white' 
                    : 'bg-[#FFF9F0] text-[#8B7355]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{method.emoji}</span>
                    <span className="text-[#3E2723]">{method.name}</span>
                  </div>
                  <p className="text-xs text-[#8B7355] mb-1">{method.subtitle}</p>
                  <p className="text-xs text-[#8B7355]/80">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <div className="w-6 h-6 rounded-full bg-[#C4941D] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* QR Code Preview (if QR selected) */}
      {selectedMethod === 'qr' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#FFF9F0] rounded-xl p-4 border border-[#C4941D]/20"
        >
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LumiereDoreePay_${grandTotal.toFixed(2)}`}
                alt="Payment QR Code"
                className="w-32 h-32"
              />
            </div>
          </div>
          <p className="text-center text-xs text-[#8B7355] mt-3">
            Scan to complete payment
          </p>
        </motion.div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!selectedMethod}
        className="w-full h-11 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-xl shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4 mr-2" />
        Confirm Payment Method
      </Button>

      <p className="text-xs text-center text-[#8B7355]/80">
        Your payment information is secure and encrypted 🔒
      </p>
    </motion.div>
  );
}
