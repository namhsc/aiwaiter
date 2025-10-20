import { useState, useRef, useEffect } from 'react';
import { ChatMessage, MenuItem } from '../types/menu';
import { generateAIResponse, quickReplies } from '../utils/aiResponses';
import { expandQuickAction, getContextualQuickActions, getSpecialNoteActions, getRecommendActions } from '../utils/quickActionExpander';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Volume2, Plus, ShoppingCart, Menu, Sparkles, Zap, TrendingUp, Info, StickyNote } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DishDetailsDialog } from './DishDetailsDialog';

interface AIWaiterChatProps {
  onBack: () => void;
  cart: any[];
  onAddToCart: (item: MenuItem) => void;
  onViewCart: () => void;
  openedFrom?: 'landing' | 'cart';
}

export function AIWaiterChat({ onBack, cart, onAddToCart, onViewCart, openedFrom = 'landing' }: AIWaiterChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Good evening! 🌟 Welcome to **Lumière Dorée**. I'm your AI Waiter, powered by advanced intelligence to make your dining experience extraordinary.\n\n✨ **I can instantly help you:**\n• 🍽️ Order in seconds - just say \"I want the Schnitzel\"\n• 🎯 Get personalized recommendations\n• 🌱 Filter by dietary needs & allergies\n• 🍷 Suggest perfect wine pairings\n• 💬 Answer any questions about our menu\n\n**Try these commands:**\n💡 \"What do you recommend?\"\n💡 \"I'll have 2 Bavarian Pretzels\"\n💡 \"Show me vegetarian options\"\n💡 \"Add Black Forest Cake\"\n\nWhat sounds delightful to you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState<MenuItem[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [dishDialogOpen, setDishDialogOpen] = useState(false);
  const [usedActions, setUsedActions] = useState<Set<string>>(new Set());
  const [flyingText, setFlyingText] = useState<{text: string, from: {x: number, y: number}} | null>(null);
  const [inputHighlight, setInputHighlight] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  // Reset used actions when chat is reopened to ensure Quick Actions are always visible
  useEffect(() => {
    setUsedActions(new Set());
  }, [openedFrom]);

  // Get context based on cart state
  const getContext = (): 'initial' | 'browsing' | 'cart-empty' | 'cart-full' | 'ordering' => {
    if (cart.length === 0) {
      return 'cart-empty';
    } else if (cart.length > 0 && cart.length < 3) {
      return 'cart-full';
    }
    return 'ordering';
  };

  // Get special note actions (dietary, kids, etc.)
  const getSpecialNotes = (): string[] => {
    const allActions = getSpecialNoteActions(getContext());
    return allActions.filter(action => !usedActions.has(action));
  };

  // Get recommendation actions (popular, specials, etc.)
  const getRecommendations = (): string[] => {
    const allActions = getRecommendActions(getContext());
    return allActions.filter(action => !usedActions.has(action));
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setSuggestedItems([]);
    setUsedActions(new Set()); // Reset used actions after sending message

    // Simulate AI thinking and response
    setTimeout(() => {
      const response = generateAIResponse(text, cart, onAddToCart);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      if (response.suggestedItems) {
        setSuggestedItems(response.suggestedItems);
      }
      // Don't show suggested items if items were auto-added (they're already in cart)
      if (response.autoAddedItems && response.autoAddedItems.length > 0) {
        // Items were auto-added, so don't show them as suggestions
        const nonAddedItems = response.suggestedItems?.filter(
          item => !response.autoAddedItems?.some(added => added.id === item.id)
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
      "Can I have two Bavarian Pretzels?",
      "Add the Black Forest Cake to my order",
      "What do you recommend for dinner?",
      "Show me vegetarian options"
    ];
    
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      handleSendMessage(randomCommand);
    }, 1800);
  };

  const handleQuickReply = (reply: string, buttonElement: HTMLElement) => {
    // Expand the quick action keyword into a full polite phrase
    const expandedPhrase = expandQuickAction(reply);
    
    // Get button position for animation
    const buttonRect = buttonElement.getBoundingClientRect();
    const buttonCenter = {
      x: buttonRect.left + buttonRect.width / 2,
      y: buttonRect.top + buttonRect.height / 2
    };
    
    // Start flying animation
    setFlyingText({
      text: expandedPhrase,
      from: buttonCenter
    });
    
    // Mark this action as used (will trigger fade out)
    setUsedActions(prev => new Set([...prev, reply]));
    
    // After animation completes, insert text into input
    setTimeout(() => {
      // Append the expanded phrase to existing input value (concatenate)
      setInputValue(prev => prev.trim() ? prev + ' ' + expandedPhrase : expandedPhrase);
      
      // Clear flying text
      setFlyingText(null);
      
      // Trigger input highlight effect
      setInputHighlight(true);
      setTimeout(() => setInputHighlight(false), 600);
      
      // Focus input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }, 500); // Match animation duration
  };

  const handleAddItemToCart = (item: MenuItem) => {
    const currentQuantity = getItemQuantity(item.id);
    
    onAddToCart(item);
    
    const newQuantity = currentQuantity + 1;
    
    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Perfect! I've added **${item.name}** to your cart. 🛒✨\n\nWould you like me to suggest a perfect pairing or continue exploring the menu?`,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmMessage]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FFF9F0] via-[#FFF9F0] to-[#FFF4E0] flex flex-col z-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[#C4941D] to-[#D4A52D] border-b border-[#B8860B]/30 px-4 py-4 shadow-lg flex items-center gap-3 shrink-0">
        <Avatar className="w-12 h-12 border-3 border-white shadow-lg">
          <AvatarFallback className="bg-white text-2xl">
            🤵
          </AvatarFallback>
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
            <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
        )}
      </div>

      {/* Quick Actions - Split into 2 Categories */}
      <AnimatePresence>
        {(getSpecialNotes().length > 0 || getRecommendations().length > 0) && (
          <motion.div
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-sm border-b border-[#C4941D]/10 shrink-0 space-y-3">
              <div className="max-w-2xl mx-auto">
                {/* Special Note Actions */}
                {getSpecialNotes().length > 0 && (
                  <motion.div
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <StickyNote className="w-3.5 h-3.5 text-[#8B7355]" />
                      <span className="text-xs text-[#8B7355]">Special Note</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {getSpecialNotes().map((reply, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 1, scale: 1 }}
                          animate={usedActions.has(reply) ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            onClick={(e) => handleQuickReply(reply, e.currentTarget)}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-amber-400/40 bg-amber-50 text-[#3E2723] whitespace-nowrap hover:bg-amber-100 hover:border-amber-500 transition-all shadow-sm hover:shadow-md text-xs shrink-0"
                          >
                            {reply}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recommend Actions */}
                {getRecommendations().length > 0 && (
                  <motion.div
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C4941D]" />
                      <span className="text-xs text-[#8B7355]">Recommend</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {getRecommendations().map((reply, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 1, scale: 1 }}
                          animate={usedActions.has(reply) ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            onClick={(e) => handleQuickReply(reply, e.currentTarget)}
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#C4941D]/30 bg-white text-[#3E2723] whitespace-nowrap hover:bg-gradient-to-br hover:from-[#C4941D] hover:to-[#D4A52D] hover:text-white hover:border-[#C4941D] transition-all shadow-sm hover:shadow-md text-xs shrink-0"
                          >
                            {reply}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
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
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                <div className="text-sm leading-relaxed break-words" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.text.split('**').map((part, i) => 
                    i % 2 === 0 ? (
                      <span key={i} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
                    ) : (
                      <strong key={i} className={message.sender === 'user' ? 'text-white' : 'text-[#C4941D]'} style={{ whiteSpace: 'pre-wrap' }}>{part}</strong>
                    )
                  )}
                </div>
                <div
                  className={`text-xs mt-1.5 ${
                    message.sender === 'user' ? 'text-white/80' : 'text-[#8B7355]'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <div className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#C4941D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                onClick={() => {
                  setSelectedDish(item);
                  setDishDialogOpen(true);
                }}
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
                    <div className="text-[#C4941D] shrink-0">€{item.price.toFixed(2)}</div>
                  </div>
                  <p className="text-xs text-[#8B7355] line-clamp-1">{item.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddItemToCart(item);
                    }}
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

      {/* Input Bar - Enhanced */}
      <div className="bg-white border-t border-[#C4941D]/20 px-4 py-4 shadow-2xl shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <div ref={inputContainerRef} className="flex-1 relative">
            <motion.div
              animate={inputHighlight ? {
                boxShadow: [
                  "0 0 0px rgba(196, 148, 29, 0)",
                  "0 0 20px rgba(196, 148, 29, 0.6)",
                  "0 0 0px rgba(196, 148, 29, 0)"
                ]
              } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-full"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="Ask me anything..."
                className="rounded-full border-[#C4941D]/30 pr-12 h-12 bg-white shadow-sm focus:shadow-md transition-shadow"
                disabled={isSpeaking}
              />
            </motion.div>
          </div>

          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 shrink-0 shadow-md ${
              isSpeaking ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'border-[#C4941D]/30 hover:bg-[#C4941D]/10'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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

      {/* Flying Text Animation */}
      <AnimatePresence>
        {flyingText && inputContainerRef.current && (
          <motion.div
            initial={{
              position: 'fixed',
              left: flyingText.from.x,
              top: flyingText.from.y,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              left: inputContainerRef.current.getBoundingClientRect().left + inputContainerRef.current.getBoundingClientRect().width / 2,
              top: inputContainerRef.current.getBoundingClientRect().top + inputContainerRef.current.getBoundingClientRect().height / 2,
              opacity: 0.8,
              scale: 0.9,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1]
            }}
            className="pointer-events-none z-[100] px-3 py-1.5 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-full text-xs shadow-lg whitespace-nowrap"
            style={{
              transform: 'translate(-50%, -50%)'
            }}
          >
            {flyingText.text}
          </motion.div>
        )}
      </AnimatePresence>

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
