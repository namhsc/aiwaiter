import { useState } from 'react';
import { MenuItem } from '../types/menu';
import { menuData } from '../data/menuData';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { ShoppingCart, Plus, Minus, AlertCircle, Leaf, Sparkles, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RestaurantLogo } from './RestaurantLogo';

interface MenuScreenProps {
  onAddToCart: (item: MenuItem) => void;
  cartItemCount: number;
  cartTotal: number;
  onViewCart: () => void;
  onOpenAI: () => void;
  cart?: { id: string; quantity: number }[];
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
}

export function MenuScreen({ onAddToCart, cartItemCount, cartTotal, onViewCart, onOpenAI, cart = [], onUpdateQuantity, onRemoveItem }: MenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState<string>('starter');
  const [showAIBanner, setShowAIBanner] = useState(true);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
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
    if (currentQuantity === 1 && onRemoveItem) {
      onRemoveItem(itemId);
    } else if (currentQuantity > 1 && onUpdateQuantity) {
      onUpdateQuantity(itemId, currentQuantity - 1);
    }
  };

  const categories = [
    { id: 'starter', name: 'Starters', emoji: '🥨' },
    { id: 'main', name: 'Main', emoji: '🍖' },
    { id: 'dessert', name: 'Dessert', emoji: '🍰' },
    { id: 'drinks', name: 'Drinks', emoji: '🍺' }
  ];

  const filteredItems = menuData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32">
      {/* Header */}
      <div className="bg-white border-b border-[#C4941D]/20 px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <div className="w-12 h-12">
            <RestaurantLogo />
          </div>
          <div className="text-center">
            <h1 className="text-xl text-[#3E2723] leading-none" style={{ fontFamily: 'Georgia, serif' }}>
              Lumière <span className="text-[#C4941D]">Dorée</span>
            </h1>
            <p className="text-center text-[#8B7355] text-xs mt-1">Fine Dining Menu</p>
          </div>
        </div>
      </div>

      {/* AI Waiter Promotional Banner */}
      {showAIBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md mx-auto px-4 pt-4"
        >
          <div className="bg-[#FFF4E0] border-2 border-[#C4941D] rounded-2xl p-4 relative shadow-sm">
            <button
              onClick={() => setShowAIBanner(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[#8B7355]"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex gap-3 items-start">
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-[#C4941D] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 pr-4">
                <h3 className="text-[#3E2723] mb-1">
                  Try our AI Waiter! <span className="text-lg">🤵</span>
                </h3>
                <p className="text-sm text-[#8B7355] mb-3 leading-relaxed">
                  Chat with our AI to get personalized recommendations, ask about ingredients, and add items to your cart instantly!
                </p>
                
                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      onOpenAI();
                      setShowAIBanner(false);
                    }}
                    className="bg-[#C4941D] text-white rounded-lg h-9 px-4"
                  >
                    Start Chatting
                  </Button>
                  <Button
                    onClick={() => setShowAIBanner(false)}
                    variant="outline"
                    className="border-[#C4941D] text-[#C4941D] rounded-lg h-9 px-4"
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="max-w-md mx-auto px-4 py-4 sticky top-[104px] bg-[#FFF9F0]/95 backdrop-blur z-10">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-[#C4941D]/20 h-12">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="data-[state=active]:bg-[#C4941D] data-[state=active]:text-white text-xs text-[#8B7355]"
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#C4941D]/10"
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative flex-shrink-0">
                <ImageWithFallback 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                {item.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-[#C4941D] text-white border-0">
                    ⭐ Popular
                  </Badge>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[#3E2723] line-clamp-1">{item.name}</h3>
                  <div className="text-[#C4941D] shrink-0">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                
                <p className="text-sm text-[#8B7355] line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Badges & Allergens */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.vegetarian && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] rounded-md border border-[#6B8E23]/30">
                      <Leaf className="w-3 h-3 text-[#6B8E23]" />
                      <span className="text-xs text-[#6B8E23]">Veggie</span>
                    </div>
                  )}
                  {item.allergens.length > 0 && (
                    <span className="text-xs text-[#8B7355]">
                      Contains: {item.allergens.join(', ')}
                    </span>
                  )}
                </div>

                {/* Add Button or Quantity Selector */}
                {getItemQuantity(item.id) === 0 ? (
                  <Button
                    onClick={() => onAddToCart(item)}
                    size="sm"
                    className="w-full bg-[#C4941D] text-white rounded-lg h-9"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-3 h-9">
                    <button
                      onClick={() => handleDecrement(item.id)}
                      className="w-9 h-9 rounded-full border-2 border-[#C4941D] bg-white text-[#C4941D] flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-[#3E2723] min-w-[2rem] text-center">
                      {getItemQuantity(item.id)}
                    </span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="w-9 h-9 rounded-full border-2 border-[#C4941D] bg-white text-[#C4941D] flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
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
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#C4941D] p-4 shadow-2xl z-20"
        >
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C4941D]/10 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#C4941D]" />
              </div>
              <div>
                <div className="text-sm text-[#8B7355]">{cartItemCount} items</div>
                <div className="text-lg text-[#3E2723]">${cartTotal.toFixed(2)}</div>
              </div>
            </div>
            <Button
              onClick={onViewCart}
              className="bg-[#C4941D] text-white rounded-xl px-6 h-11"
            >
              View Cart →
            </Button>
          </div>
        </motion.div>
      )}

      {/* Floating AI Button */}
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
    </div>
  );
}
