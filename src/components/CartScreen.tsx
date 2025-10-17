import { CartItem } from '../types/menu';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from 'react';

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onConfirmOrder: () => void;
  onOpenAI?: () => void;
}

export function CartScreen({ cart, onBack, onUpdateQuantity, onRemoveItem, onConfirmOrder, onOpenAI }: CartScreenProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.19; // 19% VAT (German tax)
  const total = subtotal + tax;

  const handleConfirm = () => {
    setShowConfirmDialog(true);
  };

  const handleProceedToPayment = () => {
    setShowConfirmDialog(false);
    onConfirmOrder();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32">
      {/* Header */}
      <div className="bg-white border-b border-[#C4941D]/20 px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-[#3E2723] rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="flex-1 text-center text-[#3E2723]">🛒 Your Cart</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-md mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-[#3E2723] mb-2">Your cart is empty</h2>
            <p className="text-[#8B7355] mb-6">Add some delicious items from the menu!</p>
            <Button
              onClick={onBack}
              className="bg-[#C4941D] text-white rounded-xl"
            >
              ← Back to Menu
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-4 border border-[#C4941D]/10"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#3E2723] mb-1">{item.name}</h3>
                    <div className="text-[#C4941D] mb-3">
                      ${item.price.toFixed(2)} each
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 rounded-full border-[#C4941D]/30"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-8 text-center text-[#3E2723]">{item.quantity}</div>
                        <Button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 rounded-full border-[#C4941D]/30"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={() => onRemoveItem(item.id)}
                        size="icon"
                        variant="ghost"
                        className="text-[#d4183d]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right shrink-0">
                    <div className="text-[#3E2723]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#FFF4E0] rounded-2xl p-6 border border-[#C4941D]/30 mt-6"
            >
              <h3 className="text-[#3E2723] mb-4">Order Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B7355]">Subtotal</span>
                  <span className="text-[#3E2723]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B7355]">Tax (19% VAT)</span>
                  <span className="text-[#3E2723]">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#C4941D]/30 my-2" />
                <div className="flex justify-between">
                  <span className="text-[#3E2723]">Total</span>
                  <span className="text-[#C4941D] text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Confirm Order Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C4941D]/20 p-4 shadow-2xl">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleConfirm}
              className="w-full h-14 rounded-xl bg-[#C4941D] text-white shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Confirm Order (${total.toFixed(2)})
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Send order to kitchen?</AlertDialogTitle>
            <AlertDialogDescription>
              Your order totals ${total.toFixed(2)} with {cart.length} item(s). 
              Once confirmed, your order will be sent to the kitchen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedToPayment}
              className="bg-[#C4941D]"
            >
              Confirm Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating AI Button */}
      {onOpenAI && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-6 z-30"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAI}
            className="w-16 h-16 bg-[#C4941D] text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
          >
            <div className="text-2xl">🤵</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#6B8E23] rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        </motion.div>
      )}

      {/* Add More Items Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 left-6 z-30"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-16 h-16 bg-white text-[#C4941D] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#C4941D]"
          title="Add more items"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </motion.div>
    </div>
  );
}
