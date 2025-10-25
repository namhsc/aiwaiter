import React, { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import {
	CreditCard,
	Banknote,
	QrCode,
	Lock,
	Sparkles,
	ArrowLeft,
} from 'lucide-react';
import { Voucher } from '../types/menu';
import { RestaurantLogo } from './RestaurantLogo';

interface PaymentScreenProps {
	subtotal: number;
	discount: number;
	total: number;
	onComplete: () => void;
	onBack?: () => void;
	onPaymentWithMessage?: (method: string, total: number) => void;
	onOpenAI?: () => void;
	appliedVoucher: Voucher | null;
}

export function PaymentScreen({
	subtotal,
	discount,
	total,
	onComplete,
	onBack,
	onPaymentWithMessage,
	onOpenAI,
	appliedVoucher,
}: PaymentScreenProps) {
	const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const paymentMethods = [
		{ id: 'cash', name: 'Cash', subtitle: 'Pay at the table', icon: Banknote },
		{
			id: 'card',
			name: 'Credit/Debit Card',
			subtitle: 'Secure card payment',
			icon: CreditCard,
		},
		{ id: 'qr', name: 'QR Pay', subtitle: 'Scan to pay', icon: QrCode },
	];

	const handlePayment = () => {
		if (!selectedMethod) return;

		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			setIsProcessing(false);

			// Send payment message to AI chat
			if (onPaymentWithMessage) {
				onPaymentWithMessage(selectedMethod, total);
			} else {
				// Fallback if no message handler available
				onComplete();
			}
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-[#FFF9F0] flex justify-center">
			<div className="w-full max-w-[480px] min-h-screen bg-[#FFF9F0]">
				{/* Header */}
				<div className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] border-b border-[#B8860B]/30 px-4 py-3 shadow-lg flex items-center gap-3 shrink-0">
					<div className="w-12 h-12 shrink-0">
						<RestaurantLogo />
					</div>
					<div className="flex-1">
						<h1 className="text-white" style={{ fontFamily: 'Georgia, serif' }}>
							Lumière <span className="text-[#FFF9F0]">Dorée</span>
						</h1>
						<div className="flex items-center gap-2 text-xs text-white/90">
							<div className="flex items-center gap-1">
								<div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
								<span className="text-[10px]">Online</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{/* AI Waiter Button */}
						{onOpenAI && (
							<button
								onClick={onOpenAI}
								className="flex items-center gap-1.5 bg-white text-[#C4941D] px-2.5 py-1.5 h-8 rounded-lg shadow-md hover:bg-white/90 active:scale-95 transition-all"
							>
								<Sparkles className="w-3.5 h-3.5" />
								<span className="text-xs font-semibold">AI Waiter</span>
							</button>
						)}
					</div>
				</div>

				{/* Page Title */}
				<div className="bg-white border-b border-[#C4941D]/20 px-4 py-3">
					<div className="flex items-center gap-3">
						{onBack && (
							<Button
								onClick={onBack}
								variant="ghost"
								size="icon"
								className="text-[#3E2723] rounded-full hover:bg-[#C4941D]/10"
							>
								<ArrowLeft className="w-5 h-5" />
							</Button>
						)}
						<h2 className="flex-1 text-[#3E2723] text-lg font-semibold text-center">
							💳 Payment
						</h2>
						<div className="w-10" /> {/* Spacer for centering */}
					</div>
				</div>

				<div className="px-4 py-6 space-y-6">
					{/* Total Amount Card with Discount Display */}
					<div className="bg-white rounded-2xl border-2 border-[#C4941D] p-6 shadow-sm">
						{discount > 0 && appliedVoucher ? (
							<div className="space-y-4">
								{/* Voucher Badge */}
								<div className="flex items-center justify-center gap-2">
									<Sparkles className="w-4 h-4 text-[#C4941D]" />
									<span className="text-xs bg-[#C4941D]/10 text-[#C4941D] px-3 py-1 rounded-full border border-[#C4941D]/30">
										{appliedVoucher.code}
									</span>
								</div>

								{/* Price Comparison - Simplified */}
								<div className="text-center space-y-2">
									<div className="flex items-center justify-center gap-3">
										<span className="text-gray-400 line-through text-lg">
											€{(subtotal * 1.19).toFixed(2)}
										</span>
										<span className="text-green-600 text-sm">
											{appliedVoucher.discountType === 'percentage'
												? `-${appliedVoucher.discountValue}%`
												: `-€${discount.toFixed(2)}`}
										</span>
									</div>

									{/* Final Price */}
									<div className="pt-3 border-t border-[#C4941D]/20">
										<div className="text-[#8B7355] text-xs mb-1">
											Total Amount
										</div>
										<div className="text-[#C4941D] text-4xl">
											€{total.toFixed(2)}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="text-center">
								<div className="text-[#8B7355] text-xs mb-2">Total Amount</div>
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
											<div className="text-[#3E2723] font-medium text-sm">
												{method.name}
											</div>
											<div className="text-[#8B7355] text-xs">
												{method.subtitle}
											</div>
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
											Please prepare exact change or our staff will assist you
											with cash payment at your table
										</p>
									</div>
								</div>
							)}

							{selectedMethod === 'card' && (
								<div className="space-y-2">
									<div className="flex items-start gap-2">
										<span className="text-xl">💳</span>
										<p className="text-[#3E2723] text-sm">
											A secure payment terminal will be brought to your table.
											All major credit and debit cards accepted.
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
											Scan the QR code above with your mobile payment app to
											complete the transaction.
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
			</div>
		</div>
	);
}
