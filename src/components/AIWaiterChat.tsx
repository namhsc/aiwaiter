import { useState, useRef, useEffect } from 'react';
import { ChatMessage, MenuItem } from '../types/menu';
import { menuData } from '../data/menuData';
import {
	expandQuickAction,
	getSpecialNoteActions,
	getRecommendActions,
} from '../utils/quickActionExpander';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from './ui/dialog';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { ChatMessageAI } from '../hook/useDualSocket';
import React from 'react';

// Import new components
import { RestaurantHeader } from './chat/RestaurantHeader';
import { QuickActions } from './chat/QuickActions';
import { MessageList } from './chat/MessageList';
import { MenuOverlay } from './chat/MenuOverlay';
import { InputBar } from './chat/InputBar';

// Import utilities
import { renderHTML, getWelcomeMessage, getContext } from '../utils/chatUtils';
import { useMenuDrag } from '../hooks/useMenuDrag';


interface AIWaiterChatProps {
	onBack: () => void;
	cart: any[];
	onAddToCart: (item: MenuItem) => void;
	onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
	onRemoveItem?: (itemId: string) => void;
	onViewCart: () => void;
	openedFrom?: 'landing' | 'cart';
	tableNumber?: string;
	sendMessage: (text: string) => void;
	messagesAI: ChatMessageAI[];
	isTyping: boolean;
	setIsTyping: (isDone: boolean) => void;
	getItemQuantity: (itemId: string) => number;
	handleIncrementQuantity: (item: MenuItem) => void;
	guestCount: {
		adults: number;
		children: number;
		seniors: number;
	};
	setGuestCount: React.Dispatch<
		React.SetStateAction<{
			adults: number;
			children: number;
			seniors: number;
		}>
	>;
}

export function AIWaiterChat({
	onBack,
	cart,
	onAddToCart,
	onUpdateQuantity,
	onRemoveItem,
	onViewCart,
	openedFrom = 'landing',
	tableNumber,
	sendMessage,
	messagesAI,
	isTyping,
	setIsTyping,
	handleIncrementQuantity,
	getItemQuantity,
	guestCount,
	setGuestCount,
}: AIWaiterChatProps) {

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [suggestedItems, setSuggestedItems] = useState<MenuItem[]>([]);
	const [showOnboarding, setShowOnboarding] = useState(true);
	const [usedActions, setUsedActions] = useState<Set<string>>(new Set());
	const [flyingText, setFlyingText] = useState<{
		text: string;
		from: { x: number; y: number };
	} | null>(null);
	const [inputHighlight, setInputHighlight] = useState(false);
	const [showQuickActions, setShowQuickActions] = useState(
		openedFrom !== 'cart',
	);
	const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
	const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
	const [showMenuOverlay, setShowMenuOverlay] = useState(false);
	const [activeMenuTab, setActiveMenuTab] = useState<string>('starter');

	// Use custom hook for menu drag functionality
	const {
		isDragging,
		menuDragY,
		handleDragStart,
		handleDragMove,
		handleDragEnd,
	} = useMenuDrag();

	// Helper functions for guest count management
	const updateGuestCount = (
		type: 'adults' | 'children' | 'seniors',
		delta: number,
	) => {
		setGuestCount((prev) => ({
			...prev,
			[type]: Math.max(0, prev[type] + delta),
		}));
	};

	const handleDecrementQuantity = (itemId: string) => {
		const currentQuantity = getItemQuantity(itemId);
		if (currentQuantity > 1 && onUpdateQuantity) {
			onUpdateQuantity(itemId, currentQuantity - 1);
		} else if (currentQuantity === 1 && onRemoveItem) {
			onRemoveItem(itemId);
		}
	};

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputContainerRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	// Reset used actions when chat is reopened
	useEffect(() => {
		setUsedActions(new Set());
		// Hide Quick Actions when coming back from cart, show them otherwise
		setShowQuickActions(openedFrom !== 'cart');
	}, [openedFrom]);


	// Update welcome message when messagesAI changes
	useEffect(() => {
		if (!messagesAI.length) {
			setMessages([
				{
					id: '1',
					text: getWelcomeMessage(tableNumber),
					sender: 'ai',
					timestamp: new Date(),
				},
			]);
		} else {
			setMessages([
				{
					id: '1',
					text: getWelcomeMessage(tableNumber),
					sender: 'ai',
					timestamp: new Date(),
				},
				...messagesAI.map((itemMess: ChatMessageAI) => {
					const { content } = itemMess;

					const inforCretor = JSON.parse(content.author);

					// Trích xuất suggestion IDs từ nội dung
					const matches = content.content.match(/\(([^)]+)\)/g) || [];
					const suggestionIds = matches.map((m) => m.slice(1, -1));

					// Tìm món ăn tương ứng với suggestion IDs
					const suggestions = suggestionIds
						.map((id) => menuData.find((item) => item.id === id))
						.filter(Boolean) as MenuItem[];

					return {
						id: content.id,
						text: content.content.replace(/\s*\([^)]*\)/g, ''),
						sender: (inforCretor.type === 'user' ? 'user' : 'ai') as
							| 'user'
							| 'ai',
						timestamp: new Date(content.created_at),
						suggestions: suggestions.length > 0 ? suggestions : undefined,
					};
				}),
			]);
		}
	}, [messagesAI, tableNumber]);

	// Get context based on cart state
	const context = getContext(cart.length);

	// Get special note actions (dietary, kids, etc.)
	const getSpecialNotes = (): string[] => {
		const allActions = getSpecialNoteActions(context);
		return allActions.filter((action) => !usedActions.has(action));
	};

	// Get recommendation actions (popular, specials, etc.)
	const getRecommendations = (): string[] => {
		const allActions = getRecommendActions(context);
		return allActions.filter((action) => !usedActions.has(action));
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, suggestedItems]);


	// Function to toggle Quick Actions
	const handleToggleQuickActions = () => {
		setShowQuickActions((prev) => {
			if (!prev) {
				// If showing Quick Actions, reset used actions
				setUsedActions(new Set());
			}
			return !prev;
		});
	};

	const handleSendMessage = (text: string) => {
		if (!text.trim()) return;

		// Hide menu overlay if it's open
		if (showMenuOverlay) {
			setShowMenuOverlay(false);
			setShowQuickActions(true);
		}

		// Hide onboarding after first message
		if (showOnboarding) setShowOnboarding(false);

		// Hide Quick Actions when sending message and mark that user has sent a message
		setShowQuickActions(false);
		setHasUserSentMessage(true);
		sendMessage(text);
		setInputValue('');
		setIsTyping(true);
		setSuggestedItems([]);

		return;
	};

	const handleVoiceInput = () => {
		// Hide menu overlay if it's open when starting voice input
		if (showMenuOverlay) {
			setShowMenuOverlay(false);
			setShowQuickActions(true);
		}

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

	const handleQuickReply = (reply: string, buttonElement: HTMLElement) => {
		// Hide menu overlay if it's open when using quick replies
		if (showMenuOverlay) {
			setShowMenuOverlay(false);
			setShowQuickActions(true);
		}

		// Special handling for "Checkout" action - open payment dialog instead
		if (reply.toLowerCase() === 'checkout') {
			if (cart.length === 0) {
				// If cart is empty, send regular message
				const expandedPhrase = expandQuickAction(reply);
				handleSendMessage(expandedPhrase);
				setUsedActions((prev) => new Set([...prev, reply]));
			} else {
				// If cart has items, open payment dialog
				setPaymentDialogOpen(true);
				// Don't mark as used - user can open it multiple times
			}
			return;
		}

		// Expand the quick action keyword into a full polite phrase
		const expandedPhrase = expandQuickAction(reply);

		// Get button position for animation
		const buttonRect = buttonElement.getBoundingClientRect();
		const buttonCenter = {
			x: buttonRect.left + buttonRect.width / 2,
			y: buttonRect.top + buttonRect.height / 2,
		};

		// Start flying animation
		setFlyingText({
			text: expandedPhrase,
			from: buttonCenter,
		});

		// Mark this action as used (will trigger fade out)
		setUsedActions((prev) => new Set([...prev, reply]));

		// After animation completes, insert text into input
		setTimeout(() => {
			// Append the expanded phrase to existing input value (concatenate)
			setInputValue((prev) =>
				prev.trim() ? prev + ' ' + expandedPhrase : expandedPhrase,
			);

			// Clear flying text
			setFlyingText(null);

			// Trigger input highlight effect
			setInputHighlight(true);
			setTimeout(() => setInputHighlight(false), 600);

			// Focus input will be handled by InputBar component
		}, 600); // Match animation duration
	};

	const handleAddItemToCart = (item: MenuItem) => {
		const currentQuantity = getItemQuantity(item.id);

		onAddToCart(item);

		const newQuantity = currentQuantity + 1;

		// Add confirmation message
		const confirmMessage: ChatMessage = {
			id: Date.now().toString(),
			text: `Perfect! I've added **${item.name}** to your cart. 🛒✨

  Would you like me to suggest a perfect pairing or continue exploring the menu?`,
			sender: 'ai',
			timestamp: new Date(),
		};

		setTimeout(() => {
			setMessages((prev) => [...prev, confirmMessage]);
		}, 500);
	};

	const handlePaymentMethodConfirm = (method: { id: string; name: string }) => {
		// Close the dialog immediately
		setPaymentDialogOpen(false);

		// Show Quick Actions again when returning to chat
		setShowQuickActions(true);

		// Calculate total
		const total = cart.reduce(
			(sum: number, item: any) => sum + item.price * item.quantity,
			0,
		);
		const tax = total * 0.19;
		const grandTotal = total + tax;

		// Add a confirmation message immediately
		const confirmMessage: ChatMessage = {
			id: Date.now().toString(),
			text: `✅ **Payment method selected!** I've noted that you'd like to pay €${grandTotal.toFixed(2)} using ${method.name}.

Your payment request has been sent to our team. They will assist you with the payment process shortly.

Is there anything else I can help you with?`,
			sender: 'ai',
			timestamp: new Date(),
		};

		// Add confirmation message immediately
		setMessages((prev) => [...prev, confirmMessage]);

		// Create a natural language message for the AI
		const paymentMessage = `I would like to pay €${grandTotal.toFixed(
			2,
		)} using ${method.name}`;

		// Send the payment message after a short delay to make it feel natural
		setTimeout(() => {
			handleSendMessage(paymentMessage);
		}, 800);
	};


	return (
		<div className="fixed inset-0 bg-gradient-to-br from-[#FFF9F0] via-[#FFF9F0] to-[#FFF4E0] flex justify-center z-50">
			{/* Mobile-First Container with Max Width */}
			<div className="w-full max-w-[480px] flex flex-col bg-gradient-to-br from-[#FFF9F0] via-[#FFF9F0] to-[#FFF4E0]">
				{/* Restaurant Header */}
				<RestaurantHeader
					showMenuOverlay={showMenuOverlay}
					onToggleMenu={() => {
						setShowMenuOverlay(!showMenuOverlay);
						setShowQuickActions(showMenuOverlay);
					}}
					onViewCart={onViewCart}
					cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
				/>

				{/* Quick Actions */}
				<QuickActions
					showQuickActions={showQuickActions && !showMenuOverlay}
					onToggleQuickActions={handleToggleQuickActions}
					onQuickReply={handleQuickReply}
					usedActions={usedActions}
					specialNotes={getSpecialNotes()}
					recommendations={getRecommendations()}
					guestCount={guestCount}
					onUpdateGuestCount={updateGuestCount}
				/>

				{/* Messages */}
				<div ref={messagesContainerRef} className="flex-1 overflow-y-auto relative">
					<MessageList
						messages={messages}
						isTyping={isTyping}
						suggestedItems={suggestedItems}
						onAddItemToCart={handleAddItemToCart}
						onIncrementQuantity={handleIncrementQuantity}
						onDecrementQuantity={handleDecrementQuantity}
						getItemQuantity={getItemQuantity}
						cart={cart}
						renderHTML={renderHTML}
					/>
					<div ref={messagesEndRef} />

					{/* Menu Overlay */}
					<MenuOverlay
						showMenuOverlay={showMenuOverlay}
						onClose={() => {
									setShowMenuOverlay(false);
									setShowQuickActions(true);
								}}
						activeMenuTab={activeMenuTab}
						onTabChange={setActiveMenuTab}
						menuItems={menuData}
						getItemQuantity={getItemQuantity}
						onIncrementQuantity={handleIncrementQuantity}
						onDecrementQuantity={handleDecrementQuantity}
						isDragging={isDragging}
						menuDragY={menuDragY}
						onDragStart={handleDragStart}
						onDragMove={handleDragMove}
						onDragEnd={() => {
							handleDragEnd();
							if (menuDragY > 100) {
								setShowMenuOverlay(false);
								setShowQuickActions(true);
							}
						}}
					/>
																				</div>

				{/* Input Bar */}
				<InputBar
					inputValue={inputValue}
					onInputChange={(value) => {
						setInputValue(value);
										// Show Quick Actions when user starts typing, but only if they haven't sent a message yet
						if (value.trim() && !showQuickActions && !hasUserSentMessage) {
											setShowQuickActions(true);
										}
									}}
					onSendMessage={handleSendMessage}
					onVoiceInput={handleVoiceInput}
					isSpeaking={isSpeaking}
					isTyping={isTyping}
					inputHighlight={inputHighlight}
					flyingText={flyingText}
					inputContainerRef={inputContainerRef as React.RefObject<HTMLDivElement>}
				/>

				{/* Payment Method Selector Dialog */}
				<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
					<DialogContent className="sm:max-w-[425px] p-0 gap-0 bg-transparent border-none">
						<DialogTitle className="sr-only">Select Payment Method</DialogTitle>
						<DialogDescription className="sr-only">
							Choose your preferred payment method: Cash, Credit/Debit Card, or
							QR Code
						</DialogDescription>
						<PaymentMethodSelector
							onConfirm={handlePaymentMethodConfirm}
							grandTotal={
								cart.reduce(
									(sum: number, item: any) => sum + item.price * item.quantity,
									0,
								) * 1.19
							}
						/>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
