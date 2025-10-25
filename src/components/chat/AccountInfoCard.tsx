import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface AccountInfoCardProps {
  accountNumber: string;
  bankName: string;
  accountHolder: string;
  amount: string;
  content: string;
  tableNumber?: string;
}

export function AccountInfoCard({ 
  accountNumber, 
  bankName, 
  accountHolder, 
  amount, 
  content,
  tableNumber 
}: AccountInfoCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const accountInfo = [
    { label: 'Số tài khoản', value: accountNumber, field: 'account' },
    { label: 'Ngân hàng', value: bankName, field: 'bank' },
    { label: 'Chủ tài khoản', value: accountHolder, field: 'holder' },
    { label: 'Số tiền', value: amount, field: 'amount' },
    { label: 'Nội dung', value: content, field: 'content' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-4 bg-gradient-to-br from-[#FFF4E0] to-[#FFF9F0] border border-[#C4941D]/30 rounded-xl p-4 shadow-sm"
    >

      
      <div className="space-y-3">
        {accountInfo.map(({ label, value, field }) => (
          <div key={field} className="flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-xs text-[#8B7355] mb-1">{label}</p>
              <p className="text-sm font-medium text-[#3E2723] break-all">{value}</p>
            </div>
            <button
              onClick={() => copyToClipboard(value, field)}
              className="ml-3 p-1.5 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              title={`Copy ${label}`}
            >
              {copiedField === field ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3 text-[#8B7355]" />
              )}
            </button>
          </div>
        ))}
      </div>
      

    </motion.div>
  );
}

