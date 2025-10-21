import { useState } from 'react';
import { AIWaiterChat } from './components/AIWaiterChat';
import { CartScreen } from './components/CartScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { GuestSelector } from './components/GuestSelector';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './components/ui/dialog';
import { MenuItem, CartItem, Voucher } from './types/menu';
import { findVoucher, validateVoucher, calculateDiscount } from './data/voucherData';

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
  const [chatOpenedFrom, setChatOpenedFrom] = useState<'landing' | 'cart'>('landing');
  
  // Guest selection state
  const [guestDialogOpen, setGuestDialogOpen] = useState(true);
  const [guestData, setGuestData] = useState<{ adults: number; children: number; senior: number } | null>(null);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const handleConfirmOrder = () => {
    setCurrentScreen('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentScreen('feedback');
  };

  const handleFeedbackComplete = () => {
    setCurrentScreen('complete');
  };

  const handleStartOver = () => {
    setCart([]);
    setAppliedVoucher(null);
    setGuestData(null);
    setGuestDialogOpen(true);
    setCurrentScreen('ai-chat');
  };

  const handleGuestConfirm = (data: { adults: number; children: number; senior: number }) => {
    setGuestData(data);
    setGuestDialogOpen(false);
  };

  const applyVoucher = (code: string): { success: boolean; message: string } => {
    const voucher = findVoucher(code);
    
    if (!voucher) {
      return { success: false, message: 'Invalid voucher code' };
    }

    const validation = validateVoucher(voucher, cartTotal, cart);
    
    if (!validation.valid) {
      return { success: false, message: validation.reason || 'Voucher cannot be applied' };
    }

    setAppliedVoucher(voucher);
    return { success: true, message: `${voucher.description} applied!` };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedVoucher ? calculateDiscount(appliedVoucher, cartTotal, cart) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <div className="min-h-screen">
      {/* Main Screens */}
      {currentScreen === 'ai-chat' && (
        <AIWaiterChat
          onBack={() => setCurrentScreen('ai-chat')}
          cart={cart}
          onAddToCart={addToCart}
          onViewCart={() => setCurrentScreen('cart')}
          openedFrom={chatOpenedFrom}
          tableNumber={tableNumber}
          guestData={guestData}
          onOpenGuestDialog={() => setGuestDialogOpen(true)}
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
          total={finalTotal + (finalTotal * 0.19)}
          onComplete={handlePaymentComplete}
          onOpenAI={() => {
            setChatOpenedFrom('cart');
            setCurrentScreen('ai-chat');
          }}
          appliedVoucher={appliedVoucher}
        />
      )}

      {currentScreen === 'feedback' && (
        <FeedbackScreen onComplete={handleFeedbackComplete} />
      )}

      {currentScreen === 'complete' && (
        <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h1 className="text-[#3E2723]">Experience Complete!</h1>
            <p className="text-[#8B7355]">
              Thank you for experiencing Lumière Dorée. We hope you enjoyed your digital dining journey!
            </p>
            
            <div className="bg-[#FFF4E0] rounded-2xl p-6 space-y-3 border border-[#C4941D]/30">
              <div className="text-[#3E2723]">
                Demo Summary
              </div>
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

      {/* Guest Selector Dialog - Overlay on top of chatbot */}
      <Dialog open={guestDialogOpen} onOpenChange={(open) => {
        // Prevent closing the dialog if no guest data selected yet
        if (!open && !guestData) {
          return;
        }
        setGuestDialogOpen(open);
      }}>
        <DialogContent 
          className="sm:max-w-[425px] p-0 gap-0 bg-transparent border-none" 
          hideCloseButton={true}
          onInteractOutside={(e) => {
            // Prevent closing by clicking outside if no guest data selected
            if (!guestData) {
              e.preventDefault();
            }
          }}
        >
          <DialogTitle className="sr-only">
            {guestData ? 'Update Number of Guests' : 'Welcome - Select Number of Guests'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {guestData 
              ? 'Update the number of guests in your party' 
              : 'Please select the number of guests in your party before starting your dining experience'
            }
          </DialogDescription>
          <GuestSelector onConfirm={handleGuestConfirm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
