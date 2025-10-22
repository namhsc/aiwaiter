import React from 'react';
import { motion } from 'motion/react';
import { Users, User, Baby, UserCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface GuestSelectorProps {
	onConfirm: (guestData: {
		adults: number;
		children: number;
		senior: number;
	}) => void;
}

export function GuestSelector({ onConfirm }: GuestSelectorProps) {
	const [adults, setAdults] = useState(2);
	const [children, setChildren] = useState(0);
	const [senior, setSenior] = useState(0);

	const totalGuests = adults + children + senior;

	const handleIncrement = (
		type: 'adults' | 'children' | 'senior',
		setter: (val: number) => void,
		currentVal: number,
	) => {
		if (currentVal < 20) {
			setter(currentVal + 1);
		}
	};

	const handleDecrement = (
		type: 'adults' | 'children' | 'senior',
		setter: (val: number) => void,
		currentVal: number,
	) => {
		if (type === 'adults' && currentVal > 1) {
			setter(currentVal - 1);
		} else if (type !== 'adults' && currentVal > 0) {
			setter(currentVal - 1);
		}
	};

	const handleConfirm = () => {
		onConfirm({ adults, children, senior });
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
						<Users className="w-4 h-4 text-[#C4941D]" />
					</div>
					<span className="text-[#3E2723]">Number of Guests</span>
				</div>
				<div className="bg-[#FFF4E0] text-[#C4941D] px-3 py-1 rounded-full text-xs border border-[#C4941D]/30">
					Total Guests: {totalGuests}
				</div>
			</div>

			{/* Guest Type Selectors */}
			<div className="space-y-3">
				{/* Adults */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-[#FFF9F0] flex items-center justify-center">
							<User className="w-4 h-4 text-[#8B7355]" />
						</div>
						<span className="text-[#3E2723] text-sm">Adults</span>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleDecrement('adults', setAdults, adults)}
							disabled={adults <= 1}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
						>
							<span className="text-lg leading-none">−</span>
						</button>
						<span className="w-8 text-center text-[#3E2723]">{adults}</span>
						<button
							onClick={() => handleIncrement('adults', setAdults, adults)}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors active:scale-95"
						>
							<span className="text-lg leading-none">+</span>
						</button>
					</div>
				</div>

				{/* Children */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-[#FFF9F0] flex items-center justify-center">
							<Baby className="w-4 h-4 text-[#8B7355]" />
						</div>
						<span className="text-[#3E2723] text-sm">Children</span>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleDecrement('children', setChildren, children)}
							disabled={children <= 0}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
						>
							<span className="text-lg leading-none">−</span>
						</button>
						<span className="w-8 text-center text-[#3E2723]">{children}</span>
						<button
							onClick={() => handleIncrement('children', setChildren, children)}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors active:scale-95"
						>
							<span className="text-lg leading-none">+</span>
						</button>
					</div>
				</div>

				{/* Senior */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-[#FFF9F0] flex items-center justify-center">
							<UserCircle className="w-4 h-4 text-[#8B7355]" />
						</div>
						<span className="text-[#3E2723] text-sm">Senior</span>
					</div>
					<div className="flex items-center gap-3">
						<button
							onClick={() => handleDecrement('senior', setSenior, senior)}
							disabled={senior <= 0}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
						>
							<span className="text-lg leading-none">−</span>
						</button>
						<span className="w-8 text-center text-[#3E2723]">{senior}</span>
						<button
							onClick={() => handleIncrement('senior', setSenior, senior)}
							className="w-8 h-8 rounded-full border-2 border-[#C4941D]/30 text-[#C4941D] flex items-center justify-center hover:bg-[#C4941D]/10 transition-colors active:scale-95"
						>
							<span className="text-lg leading-none">+</span>
						</button>
					</div>
				</div>
			</div>

			{/* Confirm Button */}
			<Button
				onClick={handleConfirm}
				className="w-full h-11 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
			>
				<Check className="w-4 h-4 mr-2" />
				Confirm Guest Count
			</Button>
		</motion.div>
	);
}
