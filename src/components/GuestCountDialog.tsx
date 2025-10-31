import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Users, User, Baby, CircleDot, Plus, Minus, Check } from 'lucide-react';

interface GuestCount {
	adults: number;
	children: number;
	seniors: number;
}

interface GuestCountDialogProps {
	open: boolean;
	onConfirm: (guestCount: GuestCount) => void;
	onChange?: (guestCount: GuestCount) => void;
	initialGuestCount?: GuestCount;
}

export function GuestCountDialog({
	open,
	onConfirm,
	onChange,
	initialGuestCount = { adults: 1, children: 0, seniors: 0 },
}: GuestCountDialogProps) {
	const [guestCount, setGuestCount] = useState<GuestCount>(initialGuestCount);

	// Đồng bộ state với initialGuestCount khi popup mở hoặc initialGuestCount thay đổi
	useEffect(() => {
		if (open && initialGuestCount) {
			setGuestCount(initialGuestCount);
		}
	}, [open, initialGuestCount]);

	const totalGuests =
		guestCount.adults + guestCount.children + guestCount.seniors;

	const updateGuestCount = (
		type: 'adults' | 'children' | 'seniors',
		delta: number,
	) => {
		setGuestCount((prev) => {
			const newCount = {
				...prev,
				[type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta),
			};
			// Cập nhật ngay lập tức qua callback onChange
			if (onChange) {
				onChange(newCount);
			}
			return newCount;
		});
	};

	const handleConfirm = () => {
		if (totalGuests > 0) {
			onConfirm(guestCount);
		}
	};

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent
				hideCloseButton
				className="sm:max-w-[425px] bg-white border-[#C4941D]/20 rounded-2xl p-6 gap-0"
			>
				<DialogTitle className="sr-only">Number of Guests</DialogTitle>
				<DialogDescription className="sr-only">
					Select the number of guests for your dining experience
				</DialogDescription>

				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-2">
						<Users className="w-5 h-5 text-[#C4941D]" />
						<h2 className="text-lg font-semibold text-[#3E2723]">
							Number of Guests
						</h2>
					</div>
					<div className="px-4 py-1 rounded-full border border-[#C4941D] bg-white">
						<span className="text-sm font-medium text-[#3E2723]">
							Total Guests: {totalGuests}
						</span>
					</div>
				</div>

				{/* Guest Categories */}
				<div className="space-y-4 mb-6">
					{/* Adults */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<User className="w-5 h-5 text-[#C4941D]" />
							<span className="text-base font-medium text-[#3E2723]">
								{guestCount.adults > 1 ? 'Adults' : 'Adult'}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={() => updateGuestCount('adults', -1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.adults <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-base font-bold text-[#3E2723] min-w-[32px] text-center w-6">
								{guestCount.adults}
							</span>
							<Button
								onClick={() => updateGuestCount('adults', 1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>
					</div>

					{/* Children */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Baby className="w-5 h-5 text-[#C4941D]" />
							<span className="text-base font-medium text-[#3E2723]">
								{guestCount.children > 1 ? 'Children' : 'Child'}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={() => updateGuestCount('children', -1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.children <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-base font-bold text-[#3E2723] min-w-[32px] text-center w-6">
								{guestCount.children}
							</span>
							<Button
								onClick={() => updateGuestCount('children', 1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>
					</div>

					{/* Seniors */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<CircleDot className="w-5 h-5 text-[#C4941D]" />
							<span className="text-base font-medium text-[#3E2723]">
								{guestCount.seniors > 1 ? 'Seniors' : 'Senior'}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={() => updateGuestCount('seniors', -1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.seniors <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-base font-bold text-[#3E2723] min-w-[32px] text-center w-6">
								{guestCount.seniors}
							</span>
							<Button
								onClick={() => updateGuestCount('seniors', 1)}
								variant="outline"
								size="sm"
								className="w-8 h-8 p-0 rounded-full border-[#C4941D] bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>
					</div>
				</div>

				{/* Confirm Button */}
				<Button
					onClick={handleConfirm}
					className="w-full h-12 rounded-xl bg-[#C4941D] hover:bg-[#B8851A] text-white font-medium flex items-center justify-center gap-2 shadow-lg"
				>
					<Check className="w-5 h-5" />
					Confirm Guest Count
				</Button>
			</DialogContent>
		</Dialog>
	);
}
