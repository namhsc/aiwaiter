import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Tag, AlertCircle } from 'lucide-react';
import { Voucher, AppliedDiscount } from '../types/menu';
import {
	findVoucherByCode,
	calculateDiscountAmount,
} from '../data/voucherData';

interface VoucherInputProps {
	onApplyVoucher: (discount: AppliedDiscount) => void;
	onRemoveVoucher: () => void;
	appliedDiscount?: AppliedDiscount;
	subtotal: number;
	disabled?: boolean;
}

export function VoucherInput({
	onApplyVoucher,
	onRemoveVoucher,
	appliedDiscount,
	subtotal,
	disabled = false,
}: VoucherInputProps) {
	const [voucherCode, setVoucherCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleApplyVoucher = async () => {
		if (!voucherCode.trim()) {
			setError('Vui lòng nhập mã voucher');
			return;
		}

		setIsLoading(true);
		setError('');

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		const voucher = findVoucherByCode(voucherCode.trim());

		if (!voucher) {
			setError('Mã voucher không hợp lệ hoặc đã hết hạn');
			setIsLoading(false);
			return;
		}

		if (subtotal < (voucher.minOrderAmount || 0)) {
			setError(
				`Đơn hàng tối thiểu $${voucher.minOrderAmount} để áp dụng voucher này`,
			);
			setIsLoading(false);
			return;
		}

		const discountAmount = calculateDiscountAmount(voucher, subtotal);

		if (discountAmount <= 0) {
			setError('Không thể áp dụng voucher cho đơn hàng này');
			setIsLoading(false);
			return;
		}

		const appliedDiscount: AppliedDiscount = {
			voucher,
			discountAmount,
			appliedAt: new Date(),
		};

		onApplyVoucher(appliedDiscount);
		setVoucherCode('');
		setIsLoading(false);
	};

	const handleRemoveVoucher = () => {
		onRemoveVoucher();
		setVoucherCode('');
		setError('');
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) {
			handleApplyVoucher();
		}
	};

	return (
		<div className="space-y-3">
			{!appliedDiscount ? (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-3"
				>
					<div className="flex gap-2">
						<div className="flex-1">
							<Input
								value={voucherCode}
								onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
								onKeyPress={handleKeyPress}
								placeholder="Nhập mã voucher..."
								disabled={disabled || isLoading}
								className="border-[#C4941D]/30 focus:border-[#C4941D] rounded-xl"
							/>
						</div>
						<Button
							onClick={handleApplyVoucher}
							disabled={disabled || isLoading || !voucherCode.trim()}
							className="bg-[#C4941D] text-white rounded-xl px-6"
						>
							{isLoading ? (
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							) : (
								'Áp dụng'
							)}
						</Button>
					</div>

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg"
						>
							<AlertCircle className="w-4 h-4" />
							{error}
						</motion.div>
					)}

					<div className="text-xs text-[#8B7355]">
						💡 Một số mã voucher phổ biến: WELCOME10, SAVE20, FIXED5
					</div>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-green-50 border border-green-200 rounded-xl p-4"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle2 className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<Tag className="w-4 h-4 text-green-600" />
									<span className="font-medium text-green-800">
										{appliedDiscount.voucher.code}
									</span>
								</div>
								<p className="text-sm text-green-600">
									{appliedDiscount.voucher.description}
								</p>
							</div>
						</div>
						<div className="text-right">
							<div className="text-green-800 font-medium">
								-${appliedDiscount.discountAmount.toFixed(2)}
							</div>
							<Button
								onClick={handleRemoveVoucher}
								size="sm"
								variant="ghost"
								className="text-green-600 hover:text-green-800 p-1 h-auto"
							>
								<XCircle className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}

