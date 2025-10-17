import { useState, useRef, useEffect } from 'react';
import { ChatMessage, MenuItem } from '../types/menu';
import { generateAIResponse, quickReplies } from '../utils/aiResponses';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, ArrowLeft, Volume2, Plus, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIWaiterChatProps {
  onBack: () => void;
  cart: any[];
  onAddToCart: (item: MenuItem) => void;
  onViewCart: () => void;
}

export function AIWaiterChat({ onBack, cart, onAddToCart, onViewCart }: AIWaiterChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Good evening! 🌟 Welcome to Lumière Dorée. I'm your AI Sommelier, and I'm delighted to be your personal guide tonight.\n\nI can help you with:\n• Menu recommendations\n• Wine & food pairings\n• Dietary preferences\n• Quick ordering\n\nWhat would make your dining experience perfect?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState<MenuItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, suggestedItems]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

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
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleVoiceInput = () => {
    // Simulate voice recording
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      handleSendMessage("I'd like to order the Wiener Schnitzel please");
    }, 2000);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleAddItemToCart = (item: MenuItem) => {
    onAddToCart(item);
    
    // Add confirmation message
    const confirmMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Perfect! I've added **${item.name}** to your cart. 🛒✨\n\nWould you like me to suggest a perfect pairing or would you like to continue exploring the menu?`,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmMessage]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-[#FFF9F0] flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b border-[#C4941D]/20 px-4 py-4 shadow-sm flex items-center gap-3 shrink-0">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-[#3E2723] rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="w-10 h-10 border-2 border-[#C4941D]">
            <AvatarFallback className="bg-[#C4941D] text-white">
              🤵
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-[#3E2723]">AI Sommelier</div>
            <div className="text-xs text-[#8B7355]">Your personal dining guide</div>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onViewCart}
            className="flex items-center gap-1 bg-[#C4941D] text-white px-3 py-1.5 rounded-full text-sm shadow-md active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </button>
        )}

        <div className="w-2 h-2 bg-[#6B8E23] rounded-full animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                <div className="w-8 h-8 rounded-full bg-[#C4941D] flex items-center justify-center text-white mr-2 shrink-0 mt-1">
                  🤵
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-[#C4941D] text-white rounded-br-sm'
                    : 'bg-white text-[#3E2723] shadow-sm rounded-bl-sm border border-[#C4941D]/10'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text.split('**').map((part, i) => 
                    i % 2 === 0 ? part : <strong key={i} className={message.sender === 'user' ? 'text-white' : 'text-[#C4941D]'}>{part}</strong>
                  )}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-[#8B7355]'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#8B7355] flex items-center justify-center text-white ml-2 shrink-0 mt-1">
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
            <div className="w-8 h-8 rounded-full bg-[#C4941D] flex items-center justify-center text-white mr-2 shrink-0">
              🤵
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-[#C4941D]/10">
              <div className="flex gap-1">
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
            <div className="text-xs text-[#8B7355] uppercase tracking-wider px-2">
              ✨ Tap to add to cart
            </div>
            {suggestedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-[#C4941D]/10 p-3 flex gap-3 items-center"
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-[#3E2723] text-sm">{item.name}</h4>
                    <div className="text-[#C4941D] text-sm shrink-0">${item.price.toFixed(2)}</div>
                  </div>
                  <p className="text-xs text-[#8B7355] line-clamp-1">{item.description}</p>
                </div>
                <Button
                  onClick={() => handleAddItemToCart(item)}
                  size="icon"
                  className="bg-[#C4941D] text-white rounded-full w-9 h-9 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 overflow-x-auto bg-white/50 shrink-0">
        <div className="flex gap-2 pb-2">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              onClick={() => handleQuickReply(reply)}
              variant="outline"
              size="sm"
              className="rounded-full border border-[#C4941D]/30 bg-white text-[#3E2723] whitespace-nowrap"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-[#C4941D]/20 px-4 py-3 shadow-lg shrink-0">
        <div className="max-w-md mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask me anything..."
              className="rounded-full border border-[#C4941D]/30 pr-12 h-12 bg-white"
              disabled={isSpeaking}
            />
          </div>

          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 shrink-0 ${
              isSpeaking ? 'bg-[#d4183d] text-white border-[#d4183d] animate-pulse' : 'border border-[#C4941D]/30'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            onClick={() => handleSendMessage(inputValue)}
            size="icon"
            className="rounded-full w-12 h-12 bg-[#C4941D] shrink-0"
            disabled={!inputValue.trim() || isSpeaking}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {isSpeaking && (
          <div className="text-center text-sm text-[#d4183d] mt-2">
            🎤 Listening...
          </div>
        )}
      </div>
    </div>
  );
}
