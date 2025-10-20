import { useState, useRef, useEffect } from 'react';
import { ChatMessage, MenuItem } from '../types/menu';
import { generateAIResponse, quickReplies } from '../utils/aiResponses';
import {
	expandQuickAction,
	getContextualQuickActions,
} from '../utils/quickActionExpander';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
	Send,
	Mic,
	Volume2,
	Plus,
	ShoppingCart,
	Menu,
	Sparkles,
	Zap,
	TrendingUp,
	Info,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DishDetailsDialog } from './DishDetailsDialog';
import { toast } from 'sonner@2.0.3';

interface AIWaiterChatProps {
	onBack: () => void;
	cart: any[];
	onAddToCart: (item: MenuItem) => void;
	onViewCart: () => void;
	onBrowseMenu?: () => void;
}

export function AIWaiterChat({
	onBack,
	cart,
	onAddToCart,
	onViewCart,
	onBrowseMenu,
}: AIWaiterChatProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: '1',
			text: 'Good evening! 🌟 Welcome to **Lumière Dorée**. I\'m your AI Waiter, powered by advanced intelligence to make your dining experience extraordinary.\n\n✨ **I can instantly help you:**\n• 🍽️ Order in seconds - just say "I want the Schnitzel"\n• 🎯 Get personalized recommendations\n• 🌱 Filter by dietary needs & allergies\n• 🍷 Suggest perfect wine pairings\n• 💬 Answer any questions about our menu\n\n**Try these commands:**\n💡 "What do you recommend?"\n💡 "I\'ll have 2 Bavarian Pretzels"\n💡 "Show me vegetarian options"\n💡 "Add Black Forest Cake"\n\nWhat sounds delightful to you today?',
			sender: 'ai',
			timestamp: new Date(),
		},
	]);
	const [inputValue, setInputValue] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [suggestedItems, setSuggestedItems] = useState<MenuItem[]>([]);
	const [showOnboarding, setShowOnboarding] = useState(true);
	const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
	const [dishDialogOpen, setDishDialogOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Dynamic quick replies based on cart state
	const getQuickReplies = (): string[] => {
		if (cart.length === 0) {
			return getContextualQuickActions('cart-empty');
		} else if (cart.length > 0 && cart.length < 3) {
			return getContextualQuickActions('cart-full');
		}
		return getContextualQuickActions('ordering');
	};

	const getItemQuantity = (itemId: string) => {
		const cartItem = cart.find((item: any) => item.id === itemId);
		return cartItem ? cartItem.quantity : 0;
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, suggestedItems]);

	const handleSendMessage = (text: string) => {
		if (!text.trim()) return;

		// Hide onboarding after first message
		if (showOnboarding) setShowOnboarding(false);

		// Add user message
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			text: text.trim(),
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsTyping(true);
		setSuggestedItems([]);

		// Simulate AI thinking and response
		setTimeout(() => {
			const response = generateAIResponse(text, cart, onAddToCart);
			const aiMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				text: response.text,
				sender: 'ai',
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
			if (response.suggestedItems) {
				setSuggestedItems(response.suggestedItems);
			}
			// Don't show suggested items if items were auto-added (they're already in cart)
			if (response.autoAddedItems && response.autoAddedItems.length > 0) {
				// Items were auto-added, so don't show them as suggestions
				const nonAddedItems =
					response.suggestedItems?.filter(
						(item) =>
							!response.autoAddedItems?.some((added) => added.id === item.id),
					) || [];
				setSuggestedItems(nonAddedItems);
			}
			setIsTyping(false);
		}, 600 + Math.random() * 600);
	};

	const handleVoiceInput = () => {
		// Simulate voice recording with random voice commands
		const voiceCommands = [
			"I'd like to order the Wiener Schnitzel please",
			'Can I have two Bavarian Pretzels?',
			'Add the Black Forest Cake to my order',
			'What do you recommend for dinner?',
			'Show me vegetarian options',
		];

		setIsSpeaking(true);
		setTimeout(() => {
			setIsSpeaking(false);
			const randomCommand =
				voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
			handleSendMessage(randomCommand);
		}, 1800);
	};

	const handleQuickReply = (reply: string) => {
		// Expand the quick action keyword into a full polite phrase
		const expandedPhrase = expandQuickAction(reply);
		handleSendMessage(expandedPhrase);
	};

	const handleAddItemToCart = (item: MenuItem) => {
		const currentQuantity = getItemQuantity(item.id);

		onAddToCart(item);

		const newQuantity = currentQuantity + 1;

		// Show toast notification
		toast.success('✅ Added to cart successfully!', {
			description: `${item.name} × ${newQuantity} now in cart · €${(
				item.price * newQuantity
			).toFixed(2)}`,
			duration: 3000,
		});

		// Add confirmation message
		const confirmMessage: ChatMessage = {
			id: Date.now().toString(),
			text: `Perfect! I've added **${item.name}** to your cart. 🛒✨\n\nWould you like me to suggest a perfect pairing or continue exploring the menu?`,
			sender: 'ai',
			timestamp: new Date(),
		};

		setTimeout(() => {
			setMessages((prev) => [...prev, confirmMessage]);
		}, 500);
	};

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-[#FFF9F0] via-[#FFF9F0] to-[#FFF4E0] flex flex-col z-50">
			{/* Enhanced Header */}
			<div className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] border-b border-[#B8860B]/30 px-4 py-4 shadow-lg flex items-center gap-3 shrink-0">
				<Avatar className="w-12 h-12 border-3 border-white shadow-lg">
					<AvatarFallback className="bg-white text-2xl">🤵</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="flex items-center gap-2">
						<div className="text-white">AI Waiter</div>
						<Badge className="bg-white/20 text-white border-white/30 text-xs">
							<Sparkles className="w-3 h-3 mr-1" />
							Intelligent
						</Badge>
					</div>
					<div className="flex items-center gap-2 text-xs text-white/90">
						<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
						Online & ready to assist
					</div>
				</div>

				{cart.length > 0 && (
					<button
						onClick={onViewCart}
						className="flex items-center gap-2 bg-white text-[#C4941D] px-4 py-2 rounded-full shadow-md active:scale-95 transition-transform"
					>
						<ShoppingCart className="w-4 h-4" />
						<span className="font-semibold">
							{cart.reduce((sum, item) => sum + item.quantity, 0)}
						</span>
					</button>
				)}

				{onBrowseMenu && (
					<button
						onClick={onBrowseMenu}
						className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-full backdrop-blur-sm border border-white/20 active:scale-95 transition-transform text-sm"
					>
						<Menu className="w-4 h-4" />
						Menu
					</button>
				)}
			</div>

			{/* AI Feature Highlight Banner - Shows initially */}
			<AnimatePresence>
				{showOnboarding && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="bg-gradient-to-r from-[#C4941D]/10 to-[#D4A52D]/10 border-b border-[#C4941D]/20 px-4 py-3 shrink-0"
					>
						<div className="max-w-2xl mx-auto">
							<div className="flex items-start gap-3">
								<div className="bg-[#C4941D] text-white rounded-full p-2 shrink-0">
									<Zap className="w-4 h-4" />
								</div>
								<div className="flex-1">
									<div className="text-sm text-[#3E2723] mb-1">
										<strong>🚀 Pro Tip:</strong> Order instantly by typing what
										you want!
									</div>
									<div className="text-xs text-[#8B7355]">
										Try: "I want the Schnitzel" or "2 beers please" - I'll add
										them to your cart automatically.
									</div>
								</div>
								<button
									onClick={() => setShowOnboarding(false)}
									className="text-[#8B7355] text-sm active:scale-95 transition-transform"
								>
									✕
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
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
							{message.sender === 'ai' && (
								<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4941D] to-[#D4A52D] flex items-center justify-center text-white mr-2 shrink-0 mt-1 shadow-md">
									🤵
								</div>
							)}

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
									{message.text.split('**').map((part, i) =>
										i % 2 === 0 ? (
											<span key={i} style={{ whiteSpace: 'pre-wrap' }}>
												{part}
											</span>
										) : (
											<strong
												key={i}
												className={
													message.sender === 'user'
														? 'text-white'
														: 'text-[#C4941D]'
												}
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
							</div>

							{message.sender === 'user' && (
								<div className="w-9 h-9 rounded-full bg-[#8B7355] flex items-center justify-center text-white ml-2 shrink-0 mt-1 shadow-md">
									👤
								</div>
							)}
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
						<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4941D] to-[#D4A52D] flex items-center justify-center text-white mr-2 shrink-0 shadow-md">
							🤵
						</div>
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
								className="bg-white rounded-xl shadow-md border border-[#C4941D]/10 p-3 flex gap-3 items-center hover:shadow-lg transition-shadow"
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
									<Button
										onClick={(e) => {
											e.stopPropagation();
											setSelectedDish(item);
											setDishDialogOpen(true);
										}}
										size="icon"
										variant="outline"
										className="w-9 h-9 rounded-full border-[#C4941D]/30 text-[#C4941D]"
									>
										<Info className="w-4 h-4" />
									</Button>
									<Button
										onClick={() => handleAddItemToCart(item)}
										size="icon"
										className="bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-full w-9 h-9 shadow-md hover:shadow-lg"
									>
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</motion.div>
						))}
					</motion.div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Quick Replies - Context-Aware & Enhanced */}
			<div className="px-4 py-3 bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-sm border-t border-[#C4941D]/10 shrink-0">
				<div className="max-w-2xl mx-auto">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2 text-xs text-[#8B7355]">
							<Sparkles className="w-3.5 h-3.5" />
							Quick Actions
						</div>
						<div className="text-xs text-[#8B7355]/70">Tap to send</div>
					</div>
					<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
						{getQuickReplies().map((reply, index) => (
							<Button
								key={index}
								onClick={() => handleQuickReply(reply)}
								variant="outline"
								size="sm"
								className="rounded-full border-[#C4941D]/30 bg-white text-[#3E2723] whitespace-nowrap hover:bg-gradient-to-br hover:from-[#C4941D] hover:to-[#D4A52D] hover:text-white hover:border-[#C4941D] transition-all shadow-sm hover:shadow-md"
							>
								{reply}
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Input Bar - Enhanced */}
			<div className="bg-white border-t border-[#C4941D]/20 px-4 py-4 shadow-2xl shrink-0">
				<div className="max-w-2xl mx-auto flex gap-2">
					<div className="flex-1 relative">
						<Input
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' && handleSendMessage(inputValue)
							}
							placeholder="Ask me anything ..."
							className="rounded-full border-[#C4941D]/30 pr-12 h-12 bg-white shadow-sm focus:shadow-md transition-shadow"
							disabled={isSpeaking}
						/>
					</div>

					<Button
						onClick={handleVoiceInput}
						variant="outline"
						size="icon"
						className={`rounded-full w-12 h-12 shrink-0 shadow-md ${
							isSpeaking
								? 'bg-red-500 text-white border-red-500 animate-pulse'
								: 'border-[#C4941D]/30 hover:bg-[#C4941D]/10'
						}`}
					>
						{isSpeaking ? (
							<Volume2 className="w-5 h-5" />
						) : (
							<Mic className="w-5 h-5" />
						)}
					</Button>

					<Button
						onClick={() => handleSendMessage(inputValue)}
						size="icon"
						className="rounded-full w-12 h-12 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] shrink-0 shadow-md hover:shadow-lg transition-shadow"
						disabled={!inputValue.trim() || isSpeaking}
					>
						<Send className="w-5 h-5" />
					</Button>
				</div>

				{isSpeaking && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center text-sm text-red-500 mt-2 flex items-center justify-center gap-2"
					>
						<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
						Listening...
					</motion.div>
				)}

				{!isSpeaking && inputValue.trim() === '' && (
					<div className="text-center text-xs text-[#8B7355] mt-2">
						💡 Type your order or tap the microphone to speak
					</div>
				)}
			</div>

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
