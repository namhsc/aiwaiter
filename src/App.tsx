import React, { useEffect, useState } from 'react';
import { AIWaiterChat } from './components/AIWaiterChat';
import { CartScreen } from './components/CartScreen';
import { PaymentScreen } from './components/PaymentScreen';
// import { FeedbackScreen } from "./components/FeedbackScreen";
import { MenuItem, CartItem, Voucher } from './types/menu';
import {
	findVoucher,
	validateVoucher,
	calculateDiscount,
} from './data/voucherData';
import useDualSocket from './hook/useDualSocket';
import { menuData } from './data/menuData';
import { GuestCountDialog } from './components/GuestCountDialog';

type Screen = 'ai-chat' | 'cart' | 'payment' | 'feedback' | 'complete';

// Detect browser language
const detectLanguage = (): string => {
	const browserLang = navigator.language || (navigator as any).userLanguage;
	const langCode = browserLang.split('-')[0].toLowerCase();

	// Supported languages: en, de, zh, vi
	const supportedLanguages = ['en', 'de', 'zh', 'vi'];

	if (supportedLanguages.includes(langCode)) {
		return langCode;
	}

	// Default to English if language not supported
	return 'en';
};

export default function App() {
	const [currentScreen, setCurrentScreen] = useState<Screen>('ai-chat');
	const [language] = useState(detectLanguage());
	const [tableNumber] = useState(String(Math.floor(Math.random() * 20) + 1));
	const [cart, setCart] = useState<CartItem[]>([]);
	const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
	const [chatOpenedFrom, setChatOpenedFrom] = useState<'landing' | 'cart'>(
		'landing',
	);
	const [guestCount, setGuestCount] = useState({
		adults: 1,
		children: 0,
		seniors: 0,
	});

	// State để kiểm soát việc hiển thị popup chọn số khách
	const [showGuestDialog, setShowGuestDialog] = useState(false);

	// Kiểm tra localStorage khi component mount
	useEffect(() => {
		const savedGuestCount = localStorage.getItem('guestCount');
		const hasConfirmedGuestCount =
			localStorage.getItem('hasConfirmedGuestCount') === 'true';

		if (savedGuestCount) {
			try {
				const parsed = JSON.parse(savedGuestCount);
				setGuestCount(parsed);
			} catch (e) {
				// Nếu parse lỗi, giữ giá trị mặc định
				console.error('Error parsing saved guest count:', e);
			}
		}

		// Chỉ hiển thị popup nếu người dùng mới (chưa confirm số khách)
		setShowGuestDialog(!hasConfirmedGuestCount);
	}, []);

	// Hàm xử lý khi thay đổi số khách trong popup (cập nhật ngay lập tức)
	const handleGuestCountChange = (guestCount: {
		adults: number;
		children: number;
		seniors: number;
	}) => {
		setGuestCount(guestCount);
		localStorage.setItem('guestCount', JSON.stringify(guestCount));
	};

	// Hàm xử lý khi xác nhận số khách
	const handleGuestCountConfirm = (guestCount: {
		adults: number;
		children: number;
		seniors: number;
	}) => {
		setGuestCount(guestCount);
		localStorage.setItem('guestCount', JSON.stringify(guestCount));
		// Lưu trạng thái "đã xác nhận" vào localStorage để đánh dấu là khách hàng chọn thêm món
		localStorage.setItem('hasConfirmedGuestCount', 'true');
		setShowGuestDialog(false);
	};

	const addToCart = (item: MenuItem, numberItem: number = 1) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

			if (existingItem) {
				return prevCart.map((cartItem) =>
					cartItem.id === item.id
						? { ...cartItem, quantity: cartItem.quantity + numberItem }
						: cartItem,
				);
			} else {
				return [...prevCart, { ...item, quantity: numberItem }];
			}
		});
	};

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			removeItem(itemId);
			return;
		}

		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === itemId ? { ...item, quantity: newQuantity } : item,
			),
		);
	};

	const removeItem = (itemId: string) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
	};

	const handleConfirmOrder = () => {
		setCurrentScreen('payment');
	};

	const handlePaymentComplete = () => {
		setCurrentScreen('ai-chat');
	};

	const handlePaymentWithMessage = (method: string, total: number) => {
		// Get method display name in English
		const methodNames = {
			cash: 'cash',
			card: 'credit/debit card',
			qr: 'QR Pay',
		};

		// Send payment message to AI chat as if user is speaking, in English
		const paymentMessage = `I would like to pay by ${
			methodNames[method as keyof typeof methodNames] || method
		} with a total amount of €${total.toFixed(2)}.`;
		sendMessage(paymentMessage);
		setCurrentScreen('ai-chat');
	};

	// const handleFeedbackComplete = () => {
	//   setCurrentScreen("complete");
	// };

	const handleStartOver = () => {
		setCart([]);
		setAppliedVoucher(null);
		setCurrentScreen('ai-chat');
	};

	const applyVoucher = (
		code: string,
	): { success: boolean; message: string } => {
		const voucher = findVoucher(code);

		if (!voucher) {
			return { success: false, message: 'Invalid voucher code' };
		}

		const validation = validateVoucher(voucher, cartTotal, cart);

		if (!validation.valid) {
			return {
				success: false,
				message: validation.reason || 'Voucher cannot be applied',
			};
		}

		setAppliedVoucher(voucher);
		return { success: true, message: `${voucher.description} applied!` };
	};

	const removeVoucher = () => {
		setAppliedVoucher(null);
	};

	const cartTotal = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const discountAmount = appliedVoucher
		? calculateDiscount(appliedVoucher, cartTotal, cart)
		: 0;

	// Helper function to get item quantity in cart
	const getItemQuantity = (itemId: string) => {
		const cartItem = cart.find((item) => item.id === itemId);
		return cartItem ? cartItem.quantity : 0;
	};

	// Helper functions for quantity control
	const handleIncrementQuantity = (item: MenuItem, numberItem: number = 1) => {
		const currentQuantity = getItemQuantity(item.id);
		if (currentQuantity === 0) {
			addToCart(item, numberItem);
		} else {
			updateQuantity(item.id, currentQuantity + numberItem);
		}
	};

	const finalTotal = Math.max(0, cartTotal - discountAmount);

	// Hàm xử lý khi click logo nhà hàng kết thúc Demo - xóa tất cả localStorage
	const handleEndDemoClick = () => {
		// Xóa tất cả dữ liệu trong localStorage
		localStorage.clear();

		// Reload trang để reset về trạng thái ban đầu
		window.location.reload();
	};

	const {
		messages,
		sendMessage,
		typing,
		setTyping,
		messMngtCard,
		setDataSocketPlus,
		streamingMessage,
		isStreaming,
	} = useDualSocket();

	// Lưu lịch sử chat vào localStorage khi khách hàng đặt thêm món (đã confirm số khách)
	useEffect(() => {
		const hasConfirmedGuestCount =
			localStorage.getItem('hasConfirmedGuestCount') === 'true';

		// Chỉ lưu lịch sử chat nếu khách hàng đã confirm số khách (khách hàng chọn thêm món)
		if (hasConfirmedGuestCount && messages.length > 0) {
			try {
				localStorage.setItem('chatHistory', JSON.stringify(messages));
			} catch (e) {
				console.error('Error saving chat history:', e);
			}
		}
	}, [messages]);

	useEffect(() => {
		if (!messMngtCard.length) return;

		const messCardNew = messMngtCard[0];

		const { content } = messCardNew;
		let inner = JSON.parse(content);

		inner = inner
			.replace(/'/g, '"') // thay ' → "
			.replace(/\bNone\b/g, 'null'); // thay None → null

		const parsed = JSON.parse(inner);
		const listDish = parsed.selected_dishes;
		const listId = listDish.map((item: any) => item.id_dish);
		const listDishAddCard = menuData.filter((item) => listId.includes(item.id));

		setCart(
			listDishAddCard.map((item) => {
				const findQuality = listDish.find(
					(dish: any) => dish.id_dish === item.id,
				);
				return { ...item, quantity: findQuality.quantity || 1 };
			}),
		);

		setGuestCount({
			adults: parsed?.num_people?.adults || 1,
			children: parsed?.num_people?.children || 0,
			seniors: parsed?.num_people?.seniors || 0,
		});
	}, [messMngtCard]);

	useEffect(() => {
		setDataSocketPlus({
			guests: {
				...guestCount,
				total: guestCount.adults + guestCount.children + guestCount.seniors,
			},
			cart: cart.map((item) => ({
				id_dish: item.id,
				name: item.name,
				quantity: item.quantity,
			})),
		});
	}, [guestCount, cart]);

	return (
		<div className="min-h-screen">
			{/* Guest Count Dialog - Hiển thị khi khởi động */}
			<GuestCountDialog
				open={showGuestDialog}
				onConfirm={handleGuestCountConfirm}
				onChange={handleGuestCountChange}
				initialGuestCount={guestCount}
			/>

			{/* Main Screens */}
			{currentScreen === 'ai-chat' && (
				<AIWaiterChat
					onBack={() => setCurrentScreen('ai-chat')}
					cart={cart}
					onAddToCart={addToCart}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeItem}
					onViewCart={() => setCurrentScreen('cart')}
					openedFrom={chatOpenedFrom}
					tableNumber={tableNumber}
					sendMessage={sendMessage}
					messagesAI={messages}
					isTyping={typing}
					setIsTyping={setTyping}
					getItemQuantity={getItemQuantity}
					handleIncrementQuantity={handleIncrementQuantity}
					guestCount={guestCount}
					setGuestCount={setGuestCount}
					streamingMessage={streamingMessage}
					isStreaming={isStreaming}
					onEndDemo={handleEndDemoClick}
				/>
			)}

			{currentScreen === 'cart' && (
				<CartScreen
					cart={cart}
					onBack={() => setCurrentScreen('ai-chat')}
					onUpdateQuantity={updateQuantity}
					onRemoveItem={removeItem}
					onConfirmOrder={handleConfirmOrder}
					onOpenAI={() => {
						setChatOpenedFrom('cart');
						setCurrentScreen('ai-chat');
					}}
					appliedVoucher={appliedVoucher}
					onApplyVoucher={applyVoucher}
					onRemoveVoucher={removeVoucher}
					discountAmount={discountAmount}
				/>
			)}

			{currentScreen === 'payment' && (
				<PaymentScreen
					subtotal={cartTotal}
					discount={discountAmount}
					total={finalTotal + finalTotal * 0.19}
					onComplete={handlePaymentComplete}
					onBack={() => setCurrentScreen('cart')}
					onPaymentWithMessage={handlePaymentWithMessage}
					onOpenAI={() => {
						setChatOpenedFrom('cart');
						setCurrentScreen('ai-chat');
					}}
					appliedVoucher={appliedVoucher}
				/>
			)}

			{/* {currentScreen === "feedback" && (
        <FeedbackScreen onComplete={handleFeedbackComplete} />
      )} */}

			{currentScreen === 'complete' && (
				<div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center px-4">
					<div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
						<div className="text-6xl">🎉</div>
						<h1 className="text-[#3E2723]">Experience Complete!</h1>
						<p className="text-[#8B7355]">
							Thank you for experiencing Lumière Dorée. We hope you enjoyed your
							digital dining journey!
						</p>

						<div className="bg-[#FFF4E0] rounded-2xl p-6 space-y-3 border border-[#C4941D]/30">
							<div className="text-[#3E2723]">Demo Summary</div>
							<div className="text-sm text-[#8B7355] space-y-1">
								<div>✓ Scanned QR code at Table #{tableNumber}</div>
								<div>✓ Interacted with AI Waiter</div>
								<div>✓ Ordered via AI Chat</div>
								<div>✓ Placed mock order</div>
								<div>✓ Completed payment flow</div>
								<div>✓ Provided feedback</div>
							</div>
						</div>

						<div className="flex justify-center">
							<button
								onClick={handleStartOver}
								className="px-12 h-14 rounded-xl bg-[#C4941D] text-white shadow-lg"
							>
								Start Over 🔄
							</button>
						</div>

						<div className="text-xs text-[#8B7355]">
							Lumière Dorée - Where Culinary Art Meets Digital Intelligence
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
