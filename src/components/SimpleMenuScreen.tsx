import React, { useState } from 'react';
import { MenuItem } from '../types/menu';
import { menuData } from '../data/menuData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Plus, Minus, Leaf, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DishDetailsDialog } from './DishDetailsDialog';

interface SimpleMenuScreenProps {
	onAddToCart: (item: MenuItem) => void;
	cartItemCount: number;
	cartTotal: number;
	onViewCart: () => void;
	onClose: () => void;
	cart?: { id: string; quantity: number }[];
	onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
	onRemoveItem?: (itemId: string) => void;
}

export function SimpleMenuScreen({
	onAddToCart,
	cartItemCount,
	cartTotal,
	onViewCart,
	onClose,
	cart = [],
	onUpdateQuantity,
	onRemoveItem,
}: SimpleMenuScreenProps) {
	const [activeCategory, setActiveCategory] = useState<string>('starter');
	const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
	const [dishDialogOpen, setDishDialogOpen] = useState(false);

	const getItemQuantity = (itemId: string) => {
		const cartItem = cart.find((item) => item.id === itemId);
		return cartItem ? cartItem.quantity : 0;
	};

	const handleIncrement = (item: MenuItem) => {
		const currentQuantity = getItemQuantity(item.id);
		if (currentQuantity === 0) {
			onAddToCart(item);
		} else if (onUpdateQuantity) {
			onUpdateQuantity(item.id, currentQuantity + 1);
		}
	};

	const handleDecrement = (itemId: string) => {
		const currentQuantity = getItemQuantity(itemId);
		const item = menuData.flat().find((i) => i.id === itemId);

		if (currentQuantity === 1 && onRemoveItem) {
			onRemoveItem(itemId);
		} else if (currentQuantity > 1 && onUpdateQuantity && item) {
			onUpdateQuantity(itemId, currentQuantity - 1);
		}
	};

	const categories = [
		{ id: 'starter', name: 'Starters', emoji: '🥨' },
		{ id: 'main', name: 'Main', emoji: '🍖' },
		{ id: 'dessert', name: 'Dessert', emoji: '🍰' },
		{ id: 'drinks', name: 'Drinks', emoji: '🍺' },
	];

	const filteredItems = menuData.filter(
		(item) => item.category === activeCategory,
	);

	return (
		<div className="h-full bg-[#FFF9F0] flex flex-col">
			{/* Header với nút đóng */}
			<div className="bg-white border-b border-[#C4941D]/20 px-4 py-3 shadow-sm flex items-center justify-between shrink-0">
				<h2 className="text-lg font-semibold text-[#3E2723]">Menu</h2>
				<Button
					onClick={onClose}
					variant="ghost"
					size="icon"
					className="w-8 h-8 rounded-full hover:bg-[#C4941D]/10"
				>
					<X className="w-5 h-5 text-[#8B7355]" />
				</Button>
			</div>

			{/* Category Tabs */}
			<div className="px-4 py-3 bg-white border-b border-[#C4941D]/10 shrink-0">
				<Tabs
					value={activeCategory}
					onValueChange={setActiveCategory}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4 bg-white border border-[#C4941D]/20 h-12 p-1 rounded-xl">
						{categories.map((cat) => (
							<TabsTrigger
								key={cat.id}
								value={cat.id}
								className="data-[state=active]:bg-[#C4941D] data-[state=active]:text-white text-xs text-[#8B7355] data-[state=inactive]:hover:bg-[#C4941D]/10 transition-colors rounded-lg"
							>
								<span className="mr-1">{cat.emoji}</span>
								{cat.name}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			</div>

			{/* Menu Items */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
				{filteredItems.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#C4941D]/10 cursor-pointer active:scale-[0.98] transition-transform"
						onClick={() => {
							setSelectedDish(item);
							setDishDialogOpen(true);
						}}
					>
						<div className="flex gap-3 p-3">
							{/* Image */}
							<div className="relative flex-shrink-0">
								<ImageWithFallback
									src={item.image}
									alt={item.name}
									className="w-20 h-20 rounded-lg object-cover"
								/>
								{item.popular && (
									<Badge className="absolute -top-1 -right-1 bg-[#C4941D] text-white border-0 text-[10px] px-1.5 py-0.5">
										⭐
									</Badge>
								)}
							</div>

							{/* Details */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2 mb-1">
									<h3 className="text-[#3E2723] text-sm font-medium line-clamp-1">
										{item.name}
									</h3>
									<div className="text-[#C4941D] font-semibold text-sm shrink-0">
										€{item.price.toFixed(2)}
									</div>
								</div>

								<p className="text-xs text-[#8B7355] line-clamp-2 mb-2">
									{item.description}
								</p>

								{/* Badges */}
								<div className="flex flex-wrap items-center gap-1 mb-2">
									{item.vegetarian && (
										<div className="flex items-center gap-1 px-2 py-0.5 bg-[#E8F5E9] rounded-md border border-[#6B8E23]/30">
											<Leaf className="w-2.5 h-2.5 text-[#6B8E23]" />
											<span className="text-[10px] text-[#6B8E23]">Veggie</span>
										</div>
									)}
									{item.allergens.length > 0 && (
										<span className="text-[10px] text-[#8B7355]">
											Contains: {item.allergens.join(', ')}
										</span>
									)}
								</div>

								{/* Add Button or Quantity Selector */}
								{getItemQuantity(item.id) === 0 ? (
									<Button
										onClick={(e) => {
											e.stopPropagation();
											onAddToCart(item);
										}}
										size="sm"
										className="w-full bg-[#C4941D] text-white rounded-lg h-8 text-xs"
									>
										<Plus className="w-3 h-3 mr-1" />
										Add to Cart
									</Button>
								) : (
									<div
										className="flex items-center justify-center gap-2 h-8"
										onClick={(e) => e.stopPropagation()}
									>
										<button
											onClick={() => handleDecrement(item.id)}
											className="w-7 h-7 rounded-full border-2 border-[#C4941D] bg-white text-[#C4941D] flex items-center justify-center active:scale-95 transition-transform"
										>
											<Minus className="w-3 h-3" />
										</button>
										<span className="text-[#3E2723] min-w-[1.5rem] text-center text-sm font-medium">
											{getItemQuantity(item.id)}
										</span>
										<button
											onClick={() => handleIncrement(item)}
											className="w-7 h-7 rounded-full border-2 border-[#C4941D] bg-white text-[#C4941D] flex items-center justify-center active:scale-95 transition-transform"
										>
											<Plus className="w-3 h-3" />
										</button>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Cart Summary Bar */}
			{cartItemCount > 0 && (
				<motion.div
					initial={{ y: 100 }}
					animate={{ y: 0 }}
					className="bg-white border-t-2 border-[#C4941D] p-3 shadow-lg shrink-0"
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="text-sm text-[#8B7355]">
								{cartItemCount} items
							</div>
							<div className="text-lg font-semibold text-[#3E2723]">
								€{cartTotal.toFixed(2)}
							</div>
						</div>
						<Button
							onClick={onViewCart}
							className="bg-[#C4941D] text-white rounded-lg px-4 h-9 text-sm"
						>
							View Cart →
						</Button>
					</div>
				</motion.div>
			)}

			{/* Dish Details Dialog */}
			<DishDetailsDialog
				dish={selectedDish}
				open={dishDialogOpen}
				onOpenChange={setDishDialogOpen}
				onAddToCart={(item) => onAddToCart(item)}
				cartQuantity={selectedDish ? getItemQuantity(selectedDish.id) : 0}
			/>
		</div>
	);
}
