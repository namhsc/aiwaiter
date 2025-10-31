import React from 'react';
import { UtensilsCrossed, Sparkles, ShoppingCart, Users, RefreshCcw } from 'lucide-react';
import { RestaurantLogo } from '../RestaurantLogo';

interface GuestCount {
	adults: number;
	children: number;
	seniors: number;
}

interface RestaurantHeaderProps {
	showMenuOverlay: boolean;
	onToggleMenu: () => void;
	onViewCart: () => void;
	cartItemCount: number;
	onEndDemo?: () => void;
	tableNumber?: string;
	guestCount: GuestCount;
	onOpenGuestDialog: () => void;
}

export function RestaurantHeader({
	showMenuOverlay,
	onToggleMenu,
	onViewCart,
	cartItemCount,
	onEndDemo,
	tableNumber,
	guestCount,
	onOpenGuestDialog,
}: RestaurantHeaderProps) {
	const totalGuests = guestCount.adults + guestCount.children + guestCount.seniors;

	return (
		<>
			<div className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] border-b border-[#B8860B]/30 px-4 py-3 shadow-lg flex items-center gap-3 shrink-0">
				{onEndDemo ? (
					<button
						onClick={onEndDemo}
						className="w-12 h-12 shrink-0 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
						aria-label="Kết thúc Demo"
						title="Kết thúc Demo - Xóa dữ liệu"
					>
						<RestaurantLogo />
					</button>
				) : (
					<div className="w-12 h-12 shrink-0">
						<RestaurantLogo />
					</div>
				)}

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
					{/* Menu/AI Waiter Button */}
					{!showMenuOverlay ? (
						<button
							onClick={onToggleMenu}
							className="flex items-center gap-1.5 bg-[#8B7355] text-white px-2.5 py-1.5 h-8 rounded-lg shadow-md hover:bg-[#6B5B47] active:scale-95 transition-all"
						>
							<UtensilsCrossed className="w-3.5 h-3.5" />
							<span className="text-xs font-semibold">Menu</span>
						</button>
					) : (
						<button
							onClick={onToggleMenu}
							className="flex items-center gap-1.5 bg-white text-[#8B7355] border border-white/30 px-2.5 py-1.5 h-8 rounded-lg shadow-md hover:bg-white/30 active:scale-95 transition-all"
						>
							<Sparkles className="w-3.5 h-3.5 text-[#8B7355]" />
							<span className="text-xs font-semibold text-[#8B7355]">
								AI Waiter
							</span>
						</button>
					)}

					{/* Cart Button */}
					{cartItemCount > 0 && (
						<button
							onClick={onViewCart}
							className="flex items-center gap-1.5 bg-white text-[#C4941D] px-2.5 py-1.5 h-8 rounded-lg shadow-md hover:bg-white/90 active:scale-95 transition-all"
						>
							<ShoppingCart className="w-3.5 h-3.5" />
							<span className="text-xs font-semibold">{cartItemCount}</span>
						</button>
					)}
				</div>
			</div>

			{/* Guest Count and Table Info */}
			<div className="px-4 py-2 bg-white/80 border-b border-[#C4941D]/10 flex items-center justify-between shrink-0">
				<button
					onClick={onOpenGuestDialog}
					className="flex items-center gap-2 text-[#8B7355] hover:text-[#C4941D] transition-colors cursor-pointer"
				>
					<span className="text-base font-medium">
						Total Guests: {totalGuests} 
					</span>
					<RefreshCcw className="w-3 h-3 text-[#8B7355]" />
				</button>
				{tableNumber && (
					<div className="flex items-center gap-1 text-[#8B7355]">
						<span className="text-base font-medium">Table #{tableNumber}</span>
					</div>
				)}
			</div>
		</>
	);
}
