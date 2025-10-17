import { MenuItem } from '../types/menu';
import { menuData } from '../data/menuData';

export const generateAIResponse = (
  userMessage: string, 
  cart: any[], 
  onAddToCart?: (item: MenuItem) => void
): { text: string; suggestedItems?: MenuItem[] } => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good|bonjour|greetings)/)) {
    return {
      text: "Good evening! 🌟 Welcome to Lumière Dorée. I'm your AI Sommelier, here to guide you through an exceptional culinary journey.\n\nI can help you with:\n• 🍽️ Menu recommendations\n• 🍷 Perfect wine pairings\n• 🌱 Dietary preferences\n• 🛒 Quick ordering\n\nWhat sounds delightful to you today?",
    };
  }
  
  // Menu requests
  if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || lowerMessage.includes('show me')) {
    const starters = menuData.filter(i => i.category === 'starter').slice(0, 2);
    const mains = menuData.filter(i => i.category === 'main').slice(0, 2);
    return {
      text: "Our menu showcases the finest culinary artistry! ✨\n\n🥨 **Starters**\n" + 
            starters.map(i => `• ${i.name} - €${i.price.toFixed(2)}`).join('\n') + 
            "\n\n🍖 **Main Courses**\n" + 
            mains.map(i => `• ${i.name} - €${i.price.toFixed(2)}`).join('\n') + 
            "\n\nWould you like to see our desserts or drinks? Or shall I recommend something special?",
      suggestedItems: [...starters, ...mains]
    };
  }
  
  // Recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('popular') || lowerMessage.includes('special') || lowerMessage.includes('best')) {
    const popularItems = menuData.filter(item => item.popular);
    return {
      text: "Ah, excellent choice asking for recommendations! 🌟\n\n**Today's Exceptional Selections:**\n\n" +
            "🥩 **Wiener Schnitzel** (€18.90)\nOur signature dish! Perfectly crispy veal cutlet with potato salad and lingonberry jam.\n\n" +
            "🥘 **Rinderrouladen** (€22.90)\nTender beef rolls in rich gravy - a true German classic.\n\n" +
            "🍰 **Black Forest Cake** (€8.50)\nDivine chocolate layers with cherries - don't leave without trying this!\n\n" +
            "These pair beautifully with our Bavarian Wheat Beer or Riesling Wine. Shall I add any of these to your order?",
      suggestedItems: popularItems
    };
  }
  
  // Specific dish queries - Schnitzel
  if (lowerMessage.includes('schnitzel')) {
    const schnitzel = menuData.find(item => item.name.includes('Schnitzel'));
    if (schnitzel) {
      return {
        text: `Ah, the **Wiener Schnitzel** - excellent choice! 🥩✨\n\n${schnitzel.description}\n\n**Price:** €${schnitzel.price.toFixed(2)}\n**Perfect pairing:** I recommend our Riesling Wine to complement the delicate flavors.\n\n*Fun fact:* Our chef uses a traditional Viennese recipe passed down through generations. The secret is in the gentle pounding and precise breading technique!\n\nShall I add this masterpiece to your order?`,
        suggestedItems: [schnitzel]
      };
    }
  }
  
  // Specific dish queries - Bratwurst
  if (lowerMessage.includes('bratwurst') || lowerMessage.includes('sausage')) {
    const bratwurst = menuData.find(item => item.name.includes('Bratwurst'));
    if (bratwurst) {
      return {
        text: `The **Bratwurst Platter** - a true German tradition! 🌭\n\n${bratwurst.description}\n\n**Price:** €${bratwurst.price.toFixed(2)}\n**My pairing suggestion:** Our Bavarian Wheat Beer creates a perfect harmony.\n\nThese Nuremberg sausages are grilled to perfection with a beautiful char. Shall I prepare this for you?`,
        suggestedItems: [bratwurst]
      };
    }
  }
  
  // Vegetarian
  if (lowerMessage.includes('vegetarian') || lowerMessage.includes('veggie') || lowerMessage.includes('no meat')) {
    const veggieItems = menuData.filter(item => item.vegetarian);
    return {
      text: "Wonderful! We have exquisite vegetarian options: 🌱\n\n" +
            veggieItems.map(item => 
              `**${item.name}** (€${item.price.toFixed(2)})\n${item.description}`
            ).join('\n\n') +
            "\n\nAll prepared with the same Michelin-inspired care as our other dishes. Which one tempts you?",
      suggestedItems: veggieItems
    };
  }
  
  // Spicy
  if (lowerMessage.includes('spicy') || lowerMessage.includes('hot')) {
    return {
      text: "Our traditional German cuisine is generally mild and refined, focusing on rich flavors rather than heat. 🌶️\n\nHowever, I can arrange for:\n• Extra mustard with the Bratwurst\n• Horseradish on the side\n• Spiced accompaniments\n\nWould you like me to add any special requests to your order?",
    };
  }
  
  // Allergens
  if (lowerMessage.includes('allergen') || lowerMessage.includes('allergy') || lowerMessage.includes('gluten') || lowerMessage.includes('dairy') || lowerMessage.includes('lactose')) {
    const allergenType = lowerMessage.includes('gluten') ? 'gluten' : 
                        lowerMessage.includes('dairy') || lowerMessage.includes('lactose') ? 'dairy' : null;
    
    if (allergenType) {
      const safeItems = menuData.filter(item => !item.allergens.includes(allergenType));
      return {
        text: `I appreciate you letting me know about your dietary needs! 🏥\n\n**${allergenType.toUpperCase()}-FREE OPTIONS:**\n\n` +
              safeItems.slice(0, 4).map(item => 
                `• ${item.name} (€${item.price.toFixed(2)}) - ${item.allergens.length > 0 ? 'Contains: ' + item.allergens.join(', ') : 'No major allergens'}`
              ).join('\n') +
              `\n\nOur kitchen takes allergies very seriously. Would you like detailed allergen information for any specific dish?`,
        suggestedItems: safeItems.slice(0, 4)
      };
    }
    return {
      text: "Allergen safety is our top priority! 🏥\n\nEach dish on our menu displays allergen information. Common allergens in our kitchen include:\n• Gluten\n• Dairy\n• Eggs\n• Mustard\n\nWhich allergen should I help you avoid? I'll show you safe options.",
    };
  }
  
  // Cart/Order status
  if (lowerMessage.includes('order') || lowerMessage.includes('cart') || lowerMessage.includes('what did i') || lowerMessage.includes('my items')) {
    if (cart.length === 0) {
      return {
        text: "Your cart is currently empty! 🛒✨\n\nLet me help you start your culinary journey. What type of cuisine calls to you today?\n• Classic German comfort food\n• Lighter appetizers\n• Decadent desserts\n• Refreshing beverages",
      };
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `• ${item.name} ×${item.quantity} (€${(item.price * item.quantity).toFixed(2)})`).join('\n');
    return {
      text: `Here's your current order: 📋\n\n${itemsList}\n\n**Subtotal:** €${total.toFixed(2)}\n\nWould you like to:\n• Add more items\n• Modify quantities\n• Proceed to checkout\n• Get pairing suggestions`,
    };
  }
  
  // Wine/Drinks
  if (lowerMessage.includes('wine') || lowerMessage.includes('drink') || lowerMessage.includes('beer') || lowerMessage.includes('beverage')) {
    const drinks = menuData.filter(item => item.category === 'drinks');
    return {
      text: "Ah, an excellent inquiry! Our beverage selection is curated to perfection: 🍷\n\n" +
            drinks.map(item => 
              `**${item.name}** (€${item.price.toFixed(2)})\n${item.description}${item.popular ? ' ⭐ Guest favorite!' : ''}`
            ).join('\n\n') +
            "\n\nWhat type of pairing are you seeking? I can suggest the perfect complement to your meal!",
      suggestedItems: drinks
    };
  }
  
  // Dessert
  if (lowerMessage.includes('dessert') || lowerMessage.includes('cake') || lowerMessage.includes('sweet') || lowerMessage.includes('strudel') || lowerMessage.includes('soufflé')) {
    const desserts = menuData.filter(item => item.category === 'dessert');
    return {
      text: "Our desserts are truly spectacular! 🍰✨\n\n" +
            desserts.map(item => 
              `**${item.name}** (€${item.price.toFixed(2)})\n${item.description}${item.popular ? ' ⭐ Highly recommended!' : ''}`
            ).join('\n\n') +
            "\n\n*Chef's Note:* Don't miss our signature **Le Chef's Golden Soufflé** - prepared tableside with 24-karat gold dust!\n\nWhich sweet ending shall we prepare for you?",
      suggestedItems: desserts
    };
  }
  
  // Starters/Appetizers
  if (lowerMessage.includes('starter') || lowerMessage.includes('appetizer') || lowerMessage.includes('begin') || lowerMessage.includes('start with')) {
    const starters = menuData.filter(item => item.category === 'starter');
    return {
      text: "Let's begin your journey with our refined starters! 🥨\n\n" +
            starters.map(item => 
              `**${item.name}** (€${item.price.toFixed(2)})\n${item.description}`
            ).join('\n\n') +
            "\n\nEach starter is designed to awaken your palate. What catches your eye?",
      suggestedItems: starters
    };
  }
  
  // Price inquiry
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('expensive')) {
    return {
      text: "Our pricing reflects the quality and artistry of each dish: 💰\n\n" +
            "🥨 **Starters:** €6.90 - €9.50\n" +
            "🍖 **Main Courses:** €14.50 - €22.90\n" +
            "🍰 **Desserts:** €7.90 - €9.50\n" +
            "🍺 **Beverages:** €3.90 - €6.50\n\n" +
            "Every dish is prepared with Michelin-inspired standards. Which price range interests you?",
    };
  }
  
  // Ordering keywords
  if (lowerMessage.includes('want') || lowerMessage.includes('would like') || lowerMessage.includes('order') || lowerMessage.includes('get me') || lowerMessage.includes('add')) {
    // Try to find mentioned items
    const foundItems: MenuItem[] = [];
    menuData.forEach(item => {
      if (lowerMessage.includes(item.name.toLowerCase())) {
        foundItems.push(item);
      }
    });
    
    if (foundItems.length > 0) {
      const item = foundItems[0];
      return {
        text: `Perfect choice! I'll add **${item.name}** to your order. ✨\n\n${item.description}\n\n**Price:** €${item.price.toFixed(2)}\n\nWould you like me to suggest a perfect pairing? Or shall we continue exploring the menu?`,
        suggestedItems: foundItems
      };
    }
    
    return {
      text: "I'd be delighted to help you order! 🍽️\n\nYou can:\n• Tell me what type of dish you'd like\n• Ask for recommendations\n• Browse specific categories (starters, mains, desserts, drinks)\n\nWhat sounds appealing to you?",
    };
  }
  
  // Thanks
  if (lowerMessage.includes('thank')) {
    return {
      text: "You're most welcome! It's my pleasure to serve you. 😊✨\n\nIs there anything else I can help you with? Perhaps a wine pairing or dessert recommendation?",
    };
  }
  
  // Goodbye
  if (lowerMessage.includes('bye') || lowerMessage.includes('done') || lowerMessage.includes('that\'s all') || lowerMessage.includes('nothing else')) {
    return {
      text: "Thank you for dining with Lumière Dorée! 🙏✨\n\nI hope you enjoy your meal. Remember, I'm always here if you need anything else.\n\nBon appétit! 🍽️",
    };
  }
  
  // Chef inquiry
  if (lowerMessage.includes('chef') || lowerMessage.includes('marie') || lowerMessage.includes('laurent')) {
    return {
      text: "Ah, you're curious about Chef Marie Laurent! 👨‍🍳✨\n\nOur Executive Chef trained at Le Cordon Bleu in Paris and brings 15 years of Michelin-starred experience to every dish.\n\nHer philosophy: *'Food is poetry, technology is the pen. Together, we write stories worth savoring.'*\n\nHer signature creation, the **Golden Soufflé**, is a must-try! Would you like to hear about it?",
    };
  }
  
  // Pairing help
  if (lowerMessage.includes('pair') || lowerMessage.includes('goes with') || lowerMessage.includes('match')) {
    return {
      text: "I excel at creating perfect pairings! 🍷✨\n\nTell me what you're ordering, and I'll suggest:\n• The ideal wine or beer\n• Complementary side dishes\n• Dessert to complete your experience\n\nWhat dish would you like me to pair?",
    };
  }
  
  // Default intelligent response
  const responses = [
    "That's a great question! 🤔 I'm here to help you discover the perfect meal. Would you like to hear about our chef's recommendations or explore a specific category?",
    "I'd love to assist you with that! 😊 Let me guide you - are you interested in our traditional German classics, vegetarian options, or perhaps our signature dishes?",
    "Wonderful! I'm your personal guide through Lumière Dorée's culinary artistry. 🌟 Would you like recommendations, allergen information, or help with ordering?",
    "Excellent! Let me help make your dining experience extraordinary. Are you in the mood for something hearty, light, or perhaps you'd like to start with our exceptional wine selection? 🍷",
  ];
  
  return {
    text: responses[Math.floor(Math.random() * responses.length)],
  };
};

export const quickReplies = [
  "Show menu",
  "Chef's recommendations",
  "Vegetarian options",
  "Wine pairings",
  "My cart"
];
