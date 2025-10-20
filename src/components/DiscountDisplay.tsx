import { motion } from 'motion/react';
import { Tag, Percent, DollarSign, Calendar, Users } from 'lucide-react';
import { AppliedDiscount, CartSummary } from '../types/menu';

interface DiscountDisplayProps {
	cartSummary: CartSummary;
	showDetails?: boolean;
}

export function DiscountDisplay({
	cartSummary,
	showDetails = false,
}: DiscountDisplayProps) {
	const { subtotal, discountAmount, tax, total, appliedDiscount } = cartSummary;

	if (!appliedDiscount) {
		return null;
	}

	const savingsPercentage = ((discountAmount / subtotal) * 100).toFixed(1);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-3"
		>
			{/* Discount Applied Card */}
			<div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
							<Tag className="w-4 h-4 text-green-600" />
						</div>
						<div>
							<h3 className="font-medium text-green-800">
								{appliedDiscount.voucher.name}
							</h3>
							<p className="text-sm text-green-600">
								Mã: {appliedDiscount.voucher.code}
							</p>
						</div>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-green-800">
							-${discountAmount.toFixed(2)}
						</div>
						<div className="text-sm text-green-600">
							Tiết kiệm {savingsPercentage}%
						</div>
					</div>
				</div>

				{showDetails && (
					<div className="border-t border-green-200 pt-3 space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-green-700">Mô tả:</span>
							<span className="text-green-600">
								{appliedDiscount.voucher.description}
							</span>
						</div>

						<div className="flex items-center justify-between text-sm">
							<span className="text-green-700">Loại giảm giá:</span>
							<div className="flex items-center gap-1">
								{appliedDiscount.voucher.type === 'percentage' ? (
									<Percent className="w-3 h-3" />
								) : (
									<DollarSign className="w-3 h-3" />
								)}
								<span className="text-green-600">
									{appliedDiscount.voucher.type === 'percentage'
										? `${appliedDiscount.voucher.value}%`
										: `$${appliedDiscount.voucher.value}`}
								</span>
							</div>
						</div>

						{appliedDiscount.voucher.minOrderAmount && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-green-700">Đơn hàng tối thiểu:</span>
								<span className="text-green-600">
									${appliedDiscount.voucher.minOrderAmount}
								</span>
							</div>
						)}

						<div className="flex items-center justify-between text-sm">
							<span className="text-green-700">Áp dụng lúc:</span>
							<span className="text-green-600">
								{appliedDiscount.appliedAt.toLocaleTimeString('vi-VN', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</span>
						</div>

						{appliedDiscount.voucher.usageLimit && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-green-700">Số lần sử dụng:</span>
								<div className="flex items-center gap-1">
									<Users className="w-3 h-3" />
									<span className="text-green-600">
										{appliedDiscount.voucher.usedCount}/
										{appliedDiscount.voucher.usageLimit}
									</span>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Price Breakdown */}
			<div className="bg-[#FFF4E0] rounded-xl p-4 border border-[#C4941D]/30">
				<h4 className="text-[#3E2723] font-medium mb-3">Tổng kết đơn hàng</h4>

				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-[#8B7355]">Tạm tính:</span>
						<span className="text-[#3E2723]">${subtotal.toFixed(2)}</span>
					</div>

					<div className="flex justify-between text-green-600">
						<span>Giảm giá ({appliedDiscount.voucher.code}):</span>
						<span>-${discountAmount.toFixed(2)}</span>
					</div>

					<div className="flex justify-between">
						<span className="text-[#8B7355]">Thuế (19% VAT):</span>
						<span className="text-[#3E2723]">${tax.toFixed(2)}</span>
					</div>

					<div className="border-t border-[#C4941D]/30 my-2" />

					<div className="flex justify-between">
						<span className="text-[#3E2723] font-medium">Tổng cộng:</span>
						<span className="text-[#C4941D] text-lg font-bold">
							${total.toFixed(2)}
						</span>
					</div>
				</div>

				{/* Savings Highlight */}
				<div className="mt-3 p-2 bg-green-100 rounded-lg">
					<div className="text-center text-green-800 text-sm">
						🎉 Bạn đã tiết kiệm ${discountAmount.toFixed(2)}!
					</div>
				</div>
			</div>
		</motion.div>
	);
}

