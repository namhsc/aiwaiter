import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, User } from 'lucide-react';
import { Button } from '../ui/button';

interface GuestCount {
	adults: number;
	children: number;
	seniors: number;
}

interface GuestCountSelectorProps {
	guestCount: GuestCount;
	onUpdateGuestCount: (type: 'adults' | 'children' | 'seniors', delta: number) => void;
}

export function GuestCountSelector({
	guestCount,
	onUpdateGuestCount,
}: GuestCountSelectorProps) {
	const getGuestSummary = () => {
		const parts: string[] = [];
		if (guestCount.adults > 0) {
			parts.push(
				`${guestCount.adults} adult${guestCount.adults !== 1 ? 's' : ''}`,
			);
		}
		if (guestCount.children > 0) {
			parts.push(
				`${guestCount.children} child${guestCount.children !== 1 ? 'ren' : ''}`,
			);
		}
		if (guestCount.seniors > 0) {
			parts.push(
				`${guestCount.seniors} senior${guestCount.seniors !== 1 ? 's' : ''}`,
			);
		}
		return parts.join(', ');
	};

	return (
		<motion.div
			initial={{
				opacity: 1,
				height: 'auto',
				padding: '0 0 10px 0',
			}}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex items-center gap-2 mb-2">
				<User className="w-3.5 h-3.5 text-[#8B7355]" />
				<span className="text-xs text-[#8B7355]">
					Total: {getGuestSummary() || 'No guests selected'}
				</span>
			</div>
			<div className="bg-white/60 rounded-lg">
				<div className="">
					{/* Labels Row */}
					<div className="flex gap-2">
						<div className="flex-1 text-center">
							<span className="text-sm font-medium text-[#3E2723]">
								Adult
							</span>
						</div>
						<div className="flex-1 text-center">
							<span className="text-sm font-medium text-[#3E2723]">
								Child
							</span>
						</div>
						<div className="flex-1 text-center">
							<span className="text-sm font-medium text-[#3E2723]">
								Senior
							</span>
						</div>
					</div>

					{/* Controls Row */}
					<div className="flex gap-4 w-full">
						{/* Adult Controls */}
						<div className="flex-1 flex items-center justify-center gap-2 bg-transparent rounded-xl hover:border-[#C4941D]/40 transition-all duration-200">
							<Button
								onClick={() => onUpdateGuestCount('adults', -1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.adults <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-xl font-bold text-[#C4941D] min-w-[24px] text-center w-6">
								{guestCount.adults}
							</span>
							<Button
								onClick={() => onUpdateGuestCount('adults', 1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>

						{/* Child Controls */}
						<div className="flex-1 flex items-center justify-center gap-2 bg-transparent rounded-xl hover:border-[#C4941D]/40 transition-all duration-200">
							<Button
								onClick={() => onUpdateGuestCount('children', -1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.children <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-xl font-bold text-[#C4941D] min-w-[24px] text-center w-6">
								{guestCount.children}
							</span>
							<Button
								onClick={() => onUpdateGuestCount('children', 1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>

						{/* Senior Controls */}
						<div className="flex-1 flex items-center justify-center gap-2 bg-transparent rounded-xl hover:border-[#C4941D]/40 transition-all duration-200">
							<Button
								onClick={() => onUpdateGuestCount('seniors', -1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
								disabled={guestCount.seniors <= 0}
							>
								<Minus className="w-3 h-3" />
							</Button>
							<span className="text-xl font-bold text-[#C4941D] min-w-[24px] text-center w-6">
								{guestCount.seniors}
							</span>
							<Button
								onClick={() => onUpdateGuestCount('seniors', 1)}
								variant="outline"
								size="sm"
								className="w-6 h-6 p-0 rounded-full border-[#C4941D]/40 bg-white hover:bg-[#C4941D] hover:text-white hover:border-[#C4941D] transition-all duration-200"
							>
								<Plus className="w-3 h-3" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
