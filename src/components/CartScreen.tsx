import React from 'react';
import { CartItem, Voucher } from '../types/menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import {
	ArrowLeft,
	Plus,
	Minus,
	Trash2,
	ShoppingBag,
	Sparkles,
	Ticket,
	X,
	Tag,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RestaurantLogo } from './RestaurantLogo';
import { getSuggestedVouchers } from '../data/voucherData';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { useState } from 'react';

interface CartScreenProps {
	cart: CartItem[];
	onBack: () => void;
	onUpdateQuantity: (itemId: string, newQuantity: number) => void;
	onRemoveItem: (itemId: string) => void;
	onConfirmOrder: () => void;
	onOpenAI?: () => void;
	appliedVoucher: Voucher | null;
	onApplyVoucher: (code: string) => { success: boolean; message: string };
	onRemoveVoucher: () => void;
	discountAmount: number;
}

export function CartScreen({
	cart,
	onBack,
	onUpdateQuantity,
	onRemoveItem,
	onConfirmOrder,
	onOpenAI,
	appliedVoucher,
	onApplyVoucher,
	onRemoveVoucher,
	discountAmount,
}: CartScreenProps) {
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const [voucherCode, setVoucherCode] = useState('');
	const [showVoucherInput, setShowVoucherInput] = useState(false);

	const subtotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const afterDiscount = subtotal - discountAmount;
	const tax = afterDiscount * 0.19; // 19% VAT (German tax)
	const total = afterDiscount + tax;

	const suggestedVouchers = getSuggestedVouchers(subtotal);

	const handleApplyVoucher = () => {
		if (!voucherCode.trim()) {
			return;
		}

		const result = onApplyVoucher(voucherCode.trim().toUpperCase());

		if (result.success) {
			setVoucherCode('');
			setShowVoucherInput(false);
		}
	};

	const handleQuickApplyVoucher = (code: string) => {
		onApplyVoucher(code);
	};

	const handleRemoveVoucher = () => {
		onRemoveVoucher();
	};

	const handleConfirm = () => {
		setShowConfirmDialog(true);
	};

	const handleProceedToPayment = () => {
		setShowConfirmDialog(false);
		onConfirmOrder();
	};

	return (
		<div className="min-h-screen bg-[#FFF9F0] flex justify-center">
			{/* Mobile-First Container */}
			<div className="w-full max-w-[480px] min-h-screen bg-[#FFF9F0] pb-32">
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
						<Button
							onClick={onBack}
							variant="ghost"
							size="icon"
							className="text-[#3E2723] rounded-full hover:bg-[#C4941D]/10"
						>
							<ArrowLeft className="w-5 h-5" />
						</Button>
						<h2 className="flex-1 text-[#3E2723] text-lg font-semibold text-center">
							🛒 Your Cart
						</h2>
						<div className="w-10" /> {/* Spacer for centering */}
					</div>
				</div>

				{/* Cart Items */}
				<div className="px-4 py-6">
					{cart.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center py-16"
						>
							<div className="text-6xl mb-4">🛒</div>
							<h2 className="text-[#3E2723] mb-2">Your cart is empty</h2>
							<p className="text-[#8B7355] mb-6">
								Add some delicious items from the menu!
							</p>
							<Button
								onClick={onBack}
								className="bg-[#C4941D] text-white rounded-xl"
							>
								← Back to Menu
							</Button>
						</motion.div>
					) : (
						<div className="space-y-4">
							{cart.map((item, index) => (
								<motion.div
									key={item.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="bg-white rounded-2xl shadow-sm p-4 border border-[#C4941D]/10"
								>
									<div className="flex gap-3">
										{/* Image */}
										<ImageWithFallback
											src={item.image}
											alt={item.name}
											className="w-20 h-20 rounded-xl object-cover shrink-0"
										/>

										{/* Details */}
										<div className="flex-1 min-w-0">
											<h3 className="text-[#3E2723] mb-1">{item.name}</h3>
											<div className="text-[#C4941D] mb-3">
												€{item.price.toFixed(2)} each
											</div>

											{/* Quantity Controls */}
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Button
														onClick={() =>
															onUpdateQuantity(item.id, item.quantity - 1)
														}
														size="icon"
														variant="outline"
														className="w-8 h-8 rounded-full border-[#C4941D]/30"
													>
														<Minus className="w-4 h-4" />
													</Button>
													<div className="w-8 text-center text-[#3E2723]">
														{item.quantity}
													</div>
													<Button
														onClick={() =>
															onUpdateQuantity(item.id, item.quantity + 1)
														}
														size="icon"
														variant="outline"
														className="w-8 h-8 rounded-full border-[#C4941D]/30"
													>
														<Plus className="w-4 h-4" />
													</Button>
												</div>

												<Button
													onClick={() => onRemoveItem(item.id)}
													size="icon"
													variant="ghost"
													className="text-[#d4183d]"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>

										{/* Item Total */}
										<div className="text-right shrink-0">
											<div className="text-[#3E2723]">
												€{(item.price * item.quantity).toFixed(2)}
											</div>
										</div>
									</div>
								</motion.div>
							))}

							{/* Voucher Section */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="bg-white rounded-2xl p-5 border-2 border-[#C4941D]/20 mt-6 shadow-sm"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<Ticket className="w-5 h-5 text-[#C4941D]" />
										<h3 className="text-[#3E2723]">Promo & Vouchers</h3>
									</div>
									{!appliedVoucher && (
										<Button
											onClick={() => setShowVoucherInput(!showVoucherInput)}
											variant="ghost"
											size="sm"
											className="text-[#C4941D] h-auto p-0"
										>
											{showVoucherInput ? 'Cancel' : '+ Add'}
										</Button>
									)}
								</div>

								{/* Applied Voucher Display */}
								{appliedVoucher && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-gradient-to-r from-[#C4941D]/10 to-[#D4A52D]/10 rounded-xl p-3 border border-[#C4941D]/30"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="bg-[#C4941D] text-white text-xs px-2 py-0.5 rounded">
														{appliedVoucher.code}
													</span>
													<Sparkles className="w-3 h-3 text-[#C4941D]" />
												</div>
												<p className="text-xs text-[#8B7355]">
													{appliedVoucher.description}
												</p>
												<p className="text-sm text-green-600 mt-1">
													-€{discountAmount.toFixed(2)} discount applied
												</p>
											</div>
											<Button
												onClick={handleRemoveVoucher}
												variant="ghost"
												size="icon"
												className="h-6 w-6 text-[#8B7355] hover:text-[#d4183d]"
											>
												<X className="w-4 h-4" />
											</Button>
										</div>
									</motion.div>
								)}

								{/* Voucher Input */}
								{!appliedVoucher && showVoucherInput && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										className="space-y-3"
									>
										<div className="flex gap-2">
											<Input
												value={voucherCode}
												onChange={(e) =>
													setVoucherCode(e.target.value.toUpperCase())
												}
												placeholder="Enter voucher code"
												className="flex-1 border-[#C4941D]/30 rounded-xl"
												onKeyPress={(e) =>
													e.key === 'Enter' && handleApplyVoucher()
												}
											/>
											<Button
												onClick={handleApplyVoucher}
												className="bg-[#C4941D] text-white rounded-xl px-6"
											>
												Apply
											</Button>
										</div>
									</motion.div>
								)}

								{/* Suggested Vouchers */}
								{!appliedVoucher &&
									suggestedVouchers.length > 0 &&
									!showVoucherInput && (
										<div className="mt-3 space-y-2">
											<p className="text-xs text-[#8B7355]">
												Available for you:
											</p>
											{suggestedVouchers.map((voucher) => (
												<motion.button
													key={voucher.code}
													onClick={() => handleQuickApplyVoucher(voucher.code)}
													whileTap={{ scale: 0.98 }}
													className="w-full text-left p-2 bg-[#FFF9F0] hover:bg-[#FFF4E0] rounded-lg border border-[#C4941D]/20 transition-colors"
												>
													<div className="flex items-center justify-between">
														<div>
															<div className="flex items-center gap-2">
																<Tag className="w-3 h-3 text-[#C4941D]" />
																<span className="text-xs text-[#C4941D]">
																	{voucher.code}
																</span>
															</div>
															<p className="text-xs text-[#8B7355] mt-0.5">
																{voucher.description}
															</p>
														</div>
														<span className="text-xs text-[#C4941D]">
															Tap to apply
														</span>
													</div>
												</motion.button>
											))}
										</div>
									)}
							</motion.div>

							{/* Order Summary */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-[#FFF4E0] rounded-2xl p-6 border border-[#C4941D]/30 mt-4"
							>
								<h3 className="text-[#3E2723] mb-4">Order Summary</h3>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-[#8B7355]">Subtotal</span>
										<span className="text-[#3E2723]">
											€{subtotal.toFixed(2)}
										</span>
									</div>
									{discountAmount > 0 && (
										<div className="flex justify-between text-green-600">
											<span className="flex items-center gap-1">
												<Sparkles className="w-3 h-3" />
												Discount
											</span>
											<span>-€{discountAmount.toFixed(2)}</span>
										</div>
									)}
									<div className="flex justify-between">
										<span className="text-[#8B7355]">Tax (19% VAT)</span>
										<span className="text-[#3E2723]">€{tax.toFixed(2)}</span>
									</div>
									<div className="border-t border-[#C4941D]/30 my-2" />
									<div className="flex justify-between">
										<span className="text-[#3E2723]">Total</span>
										<span className="text-[#C4941D] text-lg">
											€{total.toFixed(2)}
										</span>
									</div>
									{discountAmount > 0 && (
										<div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
											<p className="text-xs text-green-700 text-center">
												🎉 You saved €{discountAmount.toFixed(2)}!
											</p>
										</div>
									)}
								</div>
							</motion.div>
						</div>
					)}
				</div>

				{/* Confirm Order Button */}
				{cart.length > 0 && (
					<div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-[#C4941D]/20 p-4 shadow-2xl">
						<div>
							<Button
								onClick={handleConfirm}
								className="w-full h-14 rounded-xl bg-[#C4941D] text-white shadow-lg"
							>
								<ShoppingBag className="w-5 h-5 mr-2" />
								Confirm Order (€{total.toFixed(2)})
							</Button>
						</div>
					</div>
				)}

				{/* Confirmation Dialog */}
				<AlertDialog
					open={showConfirmDialog}
					onOpenChange={setShowConfirmDialog}
				>
					<AlertDialogContent className="max-w-sm mx-4">
						<AlertDialogHeader>
							<AlertDialogTitle>Send order to kitchen?</AlertDialogTitle>
							<AlertDialogDescription>
								Your order totals €{total.toFixed(2)} with {cart.length}{' '}
								item(s). Once confirmed, your order will be sent to the kitchen.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleProceedToPayment}
								className="bg-[#C4941D]"
							>
								Confirm Order
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				
			</div>
		</div>
	);
}
