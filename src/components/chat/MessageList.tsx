import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MenuItem } from '../../types/menu';

interface ChatMessage {
	id: string;
	text: string;
	sender: 'user' | 'ai';
	timestamp: Date;
	suggestions?: MenuItem[];
}

interface MessageListProps {
	messages: ChatMessage[];
	isTyping: boolean;
	suggestedItems: MenuItem[];
	onAddItemToCart: (item: MenuItem) => void;
	onIncrementQuantity: (item: MenuItem) => void;
	onDecrementQuantity: (itemId: string) => void;
	getItemQuantity: (itemId: string) => number;
	cart: any[];
	renderHTML: (text: string) => React.ReactNode;
}

export function MessageList({
	messages,
	isTyping,
	suggestedItems,
	onAddItemToCart,
	onIncrementQuantity,
	onDecrementQuantity,
	getItemQuantity,
	cart,
	renderHTML,
}: MessageListProps) {
	return (
		<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative">
			<AnimatePresence>
				{messages.map((message, index) => (
					<motion.div
						key={message.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className={`flex ${
							message.sender === 'user' ? 'justify-end' : 'justify-start'
						}`}
					>
						<div
							className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
								message.sender === 'user'
									? 'bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-br-sm'
									: 'bg-white text-[#3E2723] rounded-bl-sm border border-[#C4941D]/10'
							}`}
						>
							<div
								className="text-sm leading-relaxed break-words"
								style={{ whiteSpace: 'pre-wrap' }}
							>
								{message.sender === 'ai'
									? renderHTML(message.text)
									: message.text.split('**').map((part, i) =>
											i % 2 === 0 ? (
												<span key={i} style={{ whiteSpace: 'pre-wrap' }}>
													{part}
												</span>
											) : (
												<strong
													key={i}
													className="text-white"
													style={{ whiteSpace: 'pre-wrap' }}
												>
													{part}
												</strong>
											),
									  )}
							</div>
							<div
								className={`text-xs mt-1.5 ${
									message.sender === 'user'
										? 'text-white/80'
										: 'text-[#8B7355]'
								}`}
							>
								{message.timestamp.toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</div>

							{/* Suggestions */}
							{message.suggestions && message.suggestions.length > 0 && (
								<div className="mt-3 space-y-2">
									<div className="text-xs font-medium text-[#8B7355] mb-2">
										💡 Suggested for you:
									</div>
									<div className="grid grid-cols-1 gap-2">
										{message.suggestions.map((item) => {
											const existingItem = cart.find(
												(cartItem) => cartItem.id === item.id,
											);
											const quantity = existingItem
												? existingItem.quantity
												: 0;

											return (
												<div
													key={item.id}
													className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
												>
													<ImageWithFallback
														src={item.image}
														alt={item.name}
														className="w-12 h-12 mr-2 rounded-lg object-cover"
													/>
													<div className="flex-1 min-w-0">
														<div className="text-sm font-medium text-gray-900 truncate">
															{item.name}
														</div>
														<div className="text-xs text-gray-500 truncate">
															{item.description}
														</div>
														<div className="flex items-center justify-between mt-1">
															<div className="text-sm font-semibold text-[#C4941D]">
																${item.price.toFixed(2)}
															</div>

															{quantity > 0 ? (
																<motion.div
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	className="flex items-center gap-2"
																>
																	<motion.button
																		onClick={(e) => {
																			e.stopPropagation();
																			onDecrementQuantity(item.id);
																		}}
																		whileHover={{ scale: 1.1 }}
																		whileTap={{ scale: 0.9 }}
																		className="w-6 h-6 rounded-full bg-[#C4941D] text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
																	>
																		<Minus className="w-3 h-3 group-hover:scale-110 transition-transform" />
																	</motion.button>

																	<motion.div
																		className="flex items-center justify-center min-w-[24px] h-6"
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		transition={{ delay: 0.1 }}
																	>
																		<span className="text-sm font-semibold text-[#C4941D] text-center">
																			{quantity}
																		</span>
																	</motion.div>

																	<motion.button
																		onClick={(e) => {
																			e.stopPropagation();
																			onIncrementQuantity(item);
																		}}
																		whileHover={{ scale: 1.1 }}
																		whileTap={{ scale: 0.9 }}
																		className="w-6 h-6 rounded-full bg-[#C4941D] text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
																	>
																		<Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
																	</motion.button>
																</motion.div>
															) : (
																<motion.button
																	onClick={(e) => {
																		e.stopPropagation();
																		onIncrementQuantity(item);
																	}}
																	whileHover={{ scale: 1.05 }}
																	whileTap={{ scale: 0.95 }}
																	className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] text-white rounded-full px-3 py-1 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1 group"
																>
																	<Plus className="w-3 h-3 group-hover:rotate-90 transition-transform duration-200" />
																	<span>Add</span>
																</motion.button>
															)}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{/* Typing Indicator */}
			{isTyping && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex justify-start"
				>
					<div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md border border-[#C4941D]/10">
						<div className="flex gap-1.5">
							<div
								className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce"
								style={{ animationDelay: '0ms' }}
							/>
							<div
								className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce"
								style={{ animationDelay: '150ms' }}
							/>
							<div
								className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce"
								style={{ animationDelay: '300ms' }}
							/>
						</div>
					</div>
				</motion.div>
			)}

			{/* Suggested Items */}
			{suggestedItems.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-2"
				>
					<div className="flex items-center gap-2 text-xs text-[#8B7355] uppercase tracking-wider px-2">
						<Sparkles className="w-3.5 h-3.5" />
						Suggested for you - Tap to add
					</div>
					{suggestedItems.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white rounded-xl shadow-md border border-[#C4941D]/10 p-3 flex gap-3 items-center hover:shadow-lg transition-all cursor-pointer hover:border-[#C4941D]/30 active:scale-[0.98]"
						>
							<ImageWithFallback
								src={item.image}
								alt={item.name}
								className="w-16 h-16 rounded-lg object-cover shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2 mb-1">
									<h4 className="text-[#3E2723] text-sm">{item.name}</h4>
									<div className="text-[#C4941D] shrink-0">
										€{item.price.toFixed(2)}
									</div>
								</div>
								<p className="text-xs text-[#8B7355] line-clamp-1">
									{item.description}
								</p>
							</div>
							<div className="flex gap-1 shrink-0">
								<button
									onClick={(e: any) => {
										e.stopPropagation();
										onAddItemToCart(item);
									}}
									className="bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-full w-9 h-9 shadow-md hover:shadow-lg flex items-center justify-center"
								>
									<Plus className="w-4 h-4" />
								</button>
							</div>
						</motion.div>
					))}
				</motion.div>
			)}
		</div>
	);
}
