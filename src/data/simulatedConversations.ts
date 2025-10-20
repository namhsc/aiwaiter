// Simulated Conversation Examples for Testing AI Chatbot
// Real-world conversation flows that the chatbot should handle

export interface ConversationTurn {
  speaker: 'user' | 'ai';
  message: string;
  expectedIntent?: string;
  expectedEntities?: any;
}

export interface SimulatedConversation {
  id: string;
  scenario: string;
  description: string;
  turns: ConversationTurn[];
}

// ============================================
// CONVERSATION SCENARIOS
// ============================================

export const simulatedConversations: SimulatedConversation[] = [
  // ==================== SCENARIO 1: FIRST-TIME VISITOR ====================
  {
    id: 'conv_001',
    scenario: 'First-time visitor browsing menu',
    description: 'New customer who wants to explore the menu and order',
    turns: [
      {
        speaker: 'user',
        message: 'Hello!',
        expectedIntent: 'GREETING'
      },
      {
        speaker: 'ai',
        message: 'Good evening! Welcome to Lumière Dorée. How can I help you today?'
      },
      {
        speaker: 'user',
        message: 'I\'ve never been here. What do you recommend?',
        expectedIntent: 'GET_RECOMMENDATIONS'
      },
      {
        speaker: 'ai',
        message: 'Our most popular dish is the Wiener Schnitzel - a breaded veal cutlet served with potato salad. Also very popular is the Rinderrouladen!'
      },
      {
        speaker: 'user',
        message: 'What is Rinderrouladen?',
        expectedIntent: 'DISH_INFO',
        expectedEntities: { dishName: 'Rinderrouladen' }
      },
      {
        speaker: 'ai',
        message: 'Rinderrouladen is a traditional German dish - tender beef rolls stuffed with bacon, onions, and pickles, served in rich gravy.'
      },
      {
        speaker: 'user',
        message: 'Sounds great! I\'ll have that.',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Rinderrouladen', quantity: 1 }
      },
      {
        speaker: 'ai',
        message: 'Excellent choice! Rinderrouladen added to your cart. Would you like any drinks with that?'
      },
      {
        speaker: 'user',
        message: 'What beer do you have?',
        expectedIntent: 'VIEW_CATEGORY',
        expectedEntities: { category: 'drinks' }
      },
      {
        speaker: 'ai',
        message: 'We have authentic German beers: Bavarian Wheat Beer and Classic Pilsner. Both are excellent!'
      },
      {
        speaker: 'user',
        message: 'I\'ll take the wheat beer',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Bavarian Wheat Beer', quantity: 1 }
      }
    ]
  },

  // ==================== SCENARIO 2: VEGETARIAN CUSTOMER ====================
  {
    id: 'conv_002',
    scenario: 'Vegetarian customer with dietary restrictions',
    description: 'Customer looking for vegetarian options',
    turns: [
      {
        speaker: 'user',
        message: 'Hi, do you have vegetarian options?',
        expectedIntent: 'DIETARY_QUERY',
        expectedEntities: { dietary: 'vegetarian' }
      },
      {
        speaker: 'ai',
        message: 'Yes! We have several vegetarian dishes: Käsespätzle (cheese noodles), Bavarian Pretzel, and Flammkuchen (vegetarian version).'
      },
      {
        speaker: 'user',
        message: 'What\'s in the Käsespätzle?',
        expectedIntent: 'DISH_INFO',
        expectedEntities: { dishName: 'Käsespätzle' }
      },
      {
        speaker: 'ai',
        message: 'Käsespätzle is traditional egg noodles with melted Emmental cheese and crispy onions. It\'s vegetarian and very popular!'
      },
      {
        speaker: 'user',
        message: 'Perfect! I want that. Does it have any allergens?',
        expectedIntent: 'ALLERGEN_INFO'
      },
      {
        speaker: 'ai',
        message: 'Käsespätzle contains gluten (wheat), eggs, and dairy. Let me know if you have any allergies!'
      },
      {
        speaker: 'user',
        message: 'No that\'s fine. Add it to my order please.',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Käsespätzle', quantity: 1 }
      }
    ]
  },

  // ==================== SCENARIO 3: QUICK LUNCH ORDER ====================
  {
    id: 'conv_003',
    scenario: 'Quick lunch order',
    description: 'Customer in a hurry wants fast service',
    turns: [
      {
        speaker: 'user',
        message: 'I need something quick for lunch',
        expectedIntent: 'GET_RECOMMENDATIONS',
        expectedEntities: { preference: 'quick' }
      },
      {
        speaker: 'ai',
        message: 'For a quick lunch, try our Bratwurst Platter or Bavarian Pretzel with soup - both are served within 10 minutes!'
      },
      {
        speaker: 'user',
        message: 'Give me 2 bratwurst platters',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Bratwurst Platter', quantity: 2 }
      },
      {
        speaker: 'ai',
        message: 'Great! 2 Bratwurst Platters added. Ready to checkout?'
      },
      {
        speaker: 'user',
        message: 'Yes, what\'s my total?',
        expectedIntent: 'CHECKOUT'
      }
    ]
  },

  // ==================== SCENARIO 4: BIRTHDAY CELEBRATION ====================
  {
    id: 'conv_004',
    scenario: 'Birthday celebration',
    description: 'Special occasion dining with multiple guests',
    turns: [
      {
        speaker: 'user',
        message: 'It\'s my daughter\'s birthday today!',
        expectedIntent: 'SPECIAL_OCCASION',
        expectedEntities: { occasion: 'birthday' }
      },
      {
        speaker: 'ai',
        message: 'Happy Birthday to your daughter! 🎉 What would you like to order for the celebration?'
      },
      {
        speaker: 'user',
        message: 'We\'re 4 people. What do you recommend for a family meal?',
        expectedIntent: 'GET_RECOMMENDATIONS',
        expectedEntities: { preference: 'family' }
      },
      {
        speaker: 'ai',
        message: 'For a family of 4, I suggest: 2 Wiener Schnitzel, 1 Bratwurst Platter, and 1 Käsespätzle. Plus our Black Forest Cake for dessert!'
      },
      {
        speaker: 'user',
        message: 'Perfect! Add all of those.',
        expectedIntent: 'ORDER_DISH'
      },
      {
        speaker: 'ai',
        message: 'Wonderful! All items added. I\'ve also noted it\'s a birthday celebration. Anything else?'
      },
      {
        speaker: 'user',
        message: 'Can you add a bottle of wine for the adults?',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { category: 'drinks' }
      }
    ]
  },

  // ==================== SCENARIO 5: PICKY EATER WITH MODIFICATIONS ====================
  {
    id: 'conv_005',
    scenario: 'Customer with specific modifications',
    description: 'Customer who wants customizations to their order',
    turns: [
      {
        speaker: 'user',
        message: 'I want the Schnitzel but no lingonberry',
        expectedIntent: 'MODIFY_ORDER',
        expectedEntities: { dishName: 'Wiener Schnitzel', modification: 'no lingonberry' }
      },
      {
        speaker: 'ai',
        message: 'No problem! Wiener Schnitzel without lingonberry jam. Anything else?'
      },
      {
        speaker: 'user',
        message: 'Can you make it extra crispy?',
        expectedIntent: 'MODIFY_ORDER',
        expectedEntities: { modification: 'extra crispy' }
      },
      {
        speaker: 'ai',
        message: 'Absolutely! Extra crispy Schnitzel - noted for the chef.'
      },
      {
        speaker: 'user',
        message: 'And no onions on the potato salad',
        expectedIntent: 'MODIFY_ORDER',
        expectedEntities: { modification: 'no onions' }
      },
      {
        speaker: 'ai',
        message: 'Got it - potato salad without onions. Your custom order is ready!'
      }
    ]
  },

  // ==================== SCENARIO 6: WINE PAIRING REQUEST ====================
  {
    id: 'conv_006',
    scenario: 'Wine pairing consultation',
    description: 'Customer wants wine recommendations with their meal',
    turns: [
      {
        speaker: 'user',
        message: 'I ordered the Sauerbraten. What wine pairs well?',
        expectedIntent: 'WINE_PAIRING',
        expectedEntities: { dishName: 'Sauerbraten' }
      },
      {
        speaker: 'ai',
        message: 'Excellent choice! Sauerbraten pairs beautifully with a German Spätburgunder (Pinot Noir) or a Dornfelder. Both complement the rich gravy.'
      },
      {
        speaker: 'user',
        message: 'I\'ll take the Pinot Noir',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'German Red Wine' }
      }
    ]
  },

  // ==================== SCENARIO 7: GLUTEN-FREE CUSTOMER ====================
  {
    id: 'conv_007',
    scenario: 'Gluten-free dietary needs',
    description: 'Customer with celiac disease needs gluten-free options',
    turns: [
      {
        speaker: 'user',
        message: 'I have celiac disease. What can I eat?',
        expectedIntent: 'DIETARY_QUERY',
        expectedEntities: { dietary: 'gluten-free' }
      },
      {
        speaker: 'ai',
        message: 'We have gluten-free options! Our Sauerbraten (without sauce), grilled sausages, and salads are all gluten-free. We take allergies seriously.'
      },
      {
        speaker: 'user',
        message: 'Great. Can the bratwurst be prepared gluten-free?',
        expectedIntent: 'ALLERGEN_INFO'
      },
      {
        speaker: 'ai',
        message: 'Yes! Our bratwurst sausages are naturally gluten-free. Just skip the bread and we\'ll serve with extra sauerkraut.'
      },
      {
        speaker: 'user',
        message: 'Perfect. I\'ll have that.',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Bratwurst Platter' }
      }
    ]
  },

  // ==================== SCENARIO 8: PRICE-CONSCIOUS CUSTOMER ====================
  {
    id: 'conv_008',
    scenario: 'Budget-conscious ordering',
    description: 'Customer asking about prices and discounts',
    turns: [
      {
        speaker: 'user',
        message: 'How much is the Schnitzel?',
        expectedIntent: 'PRICE_QUERY',
        expectedEntities: { dishName: 'Wiener Schnitzel' }
      },
      {
        speaker: 'ai',
        message: 'The Wiener Schnitzel is €18.90. It\'s a generous portion with potato salad and lingonberry jam included.'
      },
      {
        speaker: 'user',
        message: 'Do you have any discounts?',
        expectedIntent: 'APPLY_DISCOUNT'
      },
      {
        speaker: 'ai',
        message: 'Yes! We have voucher codes: WELCOME10 (10% off first order), GOLD20 (20% off €50+), and SAVE5 (€5 off €25+).'
      },
      {
        speaker: 'user',
        message: 'I\'ll take the Schnitzel and apply WELCOME10',
        expectedIntent: 'ORDER_DISH'
      }
    ]
  },

  // ==================== SCENARIO 9: CONFUSED CUSTOMER ====================
  {
    id: 'conv_009',
    scenario: 'Customer needs help understanding menu',
    description: 'Customer unfamiliar with German cuisine',
    turns: [
      {
        speaker: 'user',
        message: 'I don\'t know what to order. I\'ve never had German food.',
        expectedIntent: 'HELP'
      },
      {
        speaker: 'ai',
        message: 'No worries! Let me help. German cuisine is hearty and delicious. Would you prefer meat, vegetarian, or something light?'
      },
      {
        speaker: 'user',
        message: 'I like meat',
        expectedIntent: 'GET_RECOMMENDATIONS'
      },
      {
        speaker: 'ai',
        message: 'Great! Start with our Wiener Schnitzel (like a crispy chicken cutlet but with veal) or Bratwurst (German sausages). Both are crowd favorites!'
      },
      {
        speaker: 'user',
        message: 'The schnitzel sounds good. What comes with it?',
        expectedIntent: 'DISH_INFO',
        expectedEntities: { dishName: 'Wiener Schnitzel' }
      },
      {
        speaker: 'ai',
        message: 'It comes with creamy potato salad and sweet lingonberry jam. The jam adds a nice contrast to the crispy meat!'
      },
      {
        speaker: 'user',
        message: 'Okay I\'ll try it!',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Wiener Schnitzel' }
      }
    ]
  },

  // ==================== SCENARIO 10: CART MANAGEMENT ====================
  {
    id: 'conv_010',
    scenario: 'Managing cart items',
    description: 'Customer adding, viewing, and removing items from cart',
    turns: [
      {
        speaker: 'user',
        message: 'Add a pretzel to my order',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Bavarian Pretzel', quantity: 1 }
      },
      {
        speaker: 'ai',
        message: 'Bavarian Pretzel added to your cart!'
      },
      {
        speaker: 'user',
        message: 'Actually, make that 2 pretzels',
        expectedIntent: 'MODIFY_ORDER',
        expectedEntities: { dishName: 'Bavarian Pretzel', quantity: 2 }
      },
      {
        speaker: 'ai',
        message: 'Updated! You now have 2 Bavarian Pretzels in your cart.'
      },
      {
        speaker: 'user',
        message: 'What\'s in my cart now?',
        expectedIntent: 'VIEW_CART'
      },
      {
        speaker: 'ai',
        message: 'Your cart: 2x Bavarian Pretzel (€15.00). Total: €15.00'
      },
      {
        speaker: 'user',
        message: 'Remove one pretzel',
        expectedIntent: 'REMOVE_FROM_CART',
        expectedEntities: { dishName: 'Bavarian Pretzel', quantity: 1 }
      },
      {
        speaker: 'ai',
        message: 'Removed! You now have 1 Bavarian Pretzel in cart.'
      }
    ]
  }
];

// ============================================
// EDGE CASES AND CHALLENGING SCENARIOS
// ============================================

export const edgeCases: SimulatedConversation[] = [
  {
    id: 'edge_001',
    scenario: 'Vague or ambiguous requests',
    description: 'Customer uses unclear language',
    turns: [
      {
        speaker: 'user',
        message: 'Something good',
        expectedIntent: 'GET_RECOMMENDATIONS'
      },
      {
        speaker: 'user',
        message: 'That thing with cheese',
        expectedIntent: 'DISH_INFO'
      },
      {
        speaker: 'user',
        message: 'The usual',
        expectedIntent: 'UNKNOWN'
      }
    ]
  },
  {
    id: 'edge_002',
    scenario: 'Misspelled dish names',
    description: 'Customer misspells menu items',
    turns: [
      {
        speaker: 'user',
        message: 'I want the snitzel',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Wiener Schnitzel' }
      },
      {
        speaker: 'user',
        message: 'Give me the bratwerst',
        expectedIntent: 'ORDER_DISH',
        expectedEntities: { dishName: 'Bratwurst Platter' }
      }
    ]
  },
  {
    id: 'edge_003',
    scenario: 'Multiple requests in one message',
    description: 'Customer asks for several things at once',
    turns: [
      {
        speaker: 'user',
        message: 'I want 2 schnitzels, a pretzel, and what beers do you have?',
        expectedIntent: 'MULTIPLE_INTENTS'
      }
    ]
  },
  {
    id: 'edge_004',
    scenario: 'Contradictory requests',
    description: 'Customer changes mind or contradicts themselves',
    turns: [
      {
        speaker: 'user',
        message: 'Add the Schnitzel',
        expectedIntent: 'ORDER_DISH'
      },
      {
        speaker: 'user',
        message: 'Wait, no, I don\'t want that',
        expectedIntent: 'REMOVE_FROM_CART'
      }
    ]
  }
];

// ============================================
// CONVERSATION METRICS
// ============================================

export interface ConversationMetrics {
  totalConversations: number;
  totalTurns: number;
  intentCoverage: string[];
  averageTurnsPerConversation: number;
}

export function calculateMetrics(): ConversationMetrics {
  const allIntents = new Set<string>();
  let totalTurns = 0;
  
  simulatedConversations.forEach(conv => {
    totalTurns += conv.turns.length;
    conv.turns.forEach(turn => {
      if (turn.expectedIntent) {
        allIntents.add(turn.expectedIntent);
      }
    });
  });
  
  return {
    totalConversations: simulatedConversations.length,
    totalTurns,
    intentCoverage: Array.from(allIntents),
    averageTurnsPerConversation: totalTurns / simulatedConversations.length
  };
}

export default {
  simulatedConversations,
  edgeCases,
  calculateMetrics
};
