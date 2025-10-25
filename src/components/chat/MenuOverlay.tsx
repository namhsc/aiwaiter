import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Leaf } from 'lucide-react';
import { Tabs, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MenuItem } from '../../types/menu';

interface MenuOverlayProps {
	showMenuOverlay: boolean;
	onClose: () => void;
	activeMenuTab: string;
	onTabChange: (tab: string) => void;
	menuItems: MenuItem[];
	getItemQuantity: (itemId: string) => number;
	onIncrementQuantity: (item: MenuItem) => void;
	onDecrementQuantity: (itemId: string) => void;
	isDragging: boolean;
	menuDragY: number;
	onDragStart: (event: React.MouseEvent | React.TouchEvent) => void;
	onDragMove: (event: React.MouseEvent | React.TouchEvent) => void;
	onDragEnd: () => void;
}

export function MenuOverlay({
	showMenuOverlay,
	onClose,
	activeMenuTab,
	onTabChange,
	menuItems,
	getItemQuantity,
	onIncrementQuantity,
	onDecrementQuantity,
	isDragging,
	menuDragY,
	onDragStart,
	onDragMove,
	onDragEnd,
}: MenuOverlayProps) {
	const tabs = [
		{
			value: 'starter',
			label: 'Starters',
			emoji: '🥨',
		},
		{ value: 'main', label: 'Main', emoji: '🍖' },
		{ value: 'dessert', label: 'Dessert', emoji: '🍰' },
		{ value: 'drinks', label: 'Drinks', emoji: '🍺' },
	];

	return (
		<AnimatePresence>
			{showMenuOverlay && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="absolute inset-0 bg-black/20 z-40"
					onClick={onClose}
				>
					<motion.div
						initial={{ y: '100%' }}
						animate={{ y: isDragging ? menuDragY : 0 }}
						exit={{ y: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className="absolute top-0 left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden touch-pan-y flex flex-col"
						onClick={(e) => e.stopPropagation()}
						onMouseDown={onDragStart}
						onTouchStart={onDragStart}
						onMouseMove={onDragMove}
						onTouchMove={onDragMove}
						onMouseUp={onDragEnd}
						onTouchEnd={onDragEnd}
					>
						{/* Menu Content with Tabs */}
						<div className="flex flex-col h-full">
							<Tabs
								value={activeMenuTab}
								onValueChange={onTabChange}
								className="flex flex-col h-full"
							>
								{/* Tab Headers - Simple Layout */}
								<div className="px-4 pt-4 pb-3 bg-white flex-shrink-0">
									<div className="flex gap-1">
										{tabs.map((tab) => (
											<button
												key={tab.value}
												onClick={() => onTabChange(tab.value)}
												className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
													activeMenuTab === tab.value
														? 'bg-[#C4941D] text-white'
														: 'text-[#8B7355] hover:bg-[#C4941D]/10'
												}`}
											>
												<div className="flex items-center justify-center gap-1">
													<span className="text-sm">{tab.emoji}</span>
													<span className="text-xs">{tab.label}</span>
												</div>
											</button>
										))}
									</div>
								</div>

								{/* Tab Content - Scrollable Area */}
								<div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-[#C4941D]/30 scrollbar-track-transparent">
									{tabs.map((tab) => (
										<TabsContent
											key={tab.value}
											value={tab.value}
											className="mt-0 h-full"
										>
											<div className="space-y-1 pb-6 h-full">
												{menuItems
													.filter((item) => item.category === tab.value)
													.map((item, index) => (
														<div
															key={item.id}
															className="bg-white rounded-lg shadow-sm border border-[#C4941D]/10 hover:shadow-md transition-shadow"
														>
															<div className="flex gap-3 p-3">
																{/* Image */}
																<div className="relative flex-shrink-0">
																	<ImageWithFallback
																		src={item.image}
																		alt={item.name}
																		className="w-16 h-16 rounded-lg object-cover"
																	/>
																	{item.popular && (
																		<Badge className="absolute -top-1 -right-1 bg-[#C4941D] text-white border-0 text-xs">
																			⭐
																		</Badge>
																	)}
																</div>

																{/* Details */}
																<div className="flex-1 min-w-0">
																	<h3 className="text-[#3E2723] line-clamp-1 text-sm font-medium mb-1">
																		{item.name}
																	</h3>

																	<p className="text-xs text-[#8B7355] line-clamp-2 mb-2">
																		{item.description}
																	</p>

																	{/* Badges */}
																	<div className="flex items-center gap-2 mb-3">
																		{item.vegetarian && (
																			<div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded text-xs text-green-700">
																				<Leaf className="w-3 h-3" />
																				Veggie
																			</div>
																		)}
																	</div>

																	{/* Redesigned Quantity Controls */}
																	<div className="flex items-center justify-between">
																		{/* Price Display */}
																		<div className="flex flex-col">
																			<span className="text-lg font-bold text-[#C4941D]">
																				€{item.price.toFixed(2)}
																			</span>
																			{item.prepTime && (
																				<span className="text-xs text-[#8B7355]">
																					{item.prepTime}
																				</span>
																			)}
																		</div>

																		{/* Quantity Controls */}
																		{getItemQuantity(item.id) === 0 ? (
																			<motion.button
																				onClick={(e) => {
																					e.stopPropagation();
																					onIncrementQuantity(item);
																				}}
																				whileHover={{ scale: 1.05 }}
																				whileTap={{ scale: 0.95 }}
																				className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
																			>
																				<Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
																				<span>Add</span>
																			</motion.button>
																		) : (
																			<motion.div
																				initial={{
																					opacity: 0,
																					scale: 0.8,
																				}}
																				animate={{
																					opacity: 1,
																					scale: 1,
																				}}
																				className="flex items-center gap-3"
																			>
																				<motion.button
																					onClick={(e) => {
																						e.stopPropagation();
																						onDecrementQuantity(item.id);
																					}}
																					whileHover={{ scale: 1.1 }}
																					whileTap={{ scale: 0.9 }}
																					className="w-9 h-9 rounded-full bg-[#C4941D] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group"
																				>
																					<Minus className="w-4 h-4 group-hover:scale-110 transition-transform" />
																				</motion.button>

																				<motion.div
																					className="flex items-center justify-center min-w-[40px] h-9 p-2 w-5"
																					initial={{ scale: 0 }}
																					animate={{ scale: 1 }}
																					transition={{ delay: 0.1 }}
																				>
																					<span className="text-lg font-semibold text-[#C4941D] text-center">
																						{getItemQuantity(item.id)}
																					</span>
																				</motion.div>

																				<motion.button
																					onClick={(e) => {
																						e.stopPropagation();
																						onIncrementQuantity(item);
																					}}
																					whileHover={{ scale: 1.1 }}
																					whileTap={{ scale: 0.9 }}
																					className="w-9 h-9 rounded-full bg-[#C4941D] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center group"
																				>
																					<Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
																				</motion.button>
																			</motion.div>
																		)}
																	</div>
																</div>
															</div>
														</div>
													))}
											</div>
										</TabsContent>
									))}
								</div>
							</Tabs>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
