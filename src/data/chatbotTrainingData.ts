// Chatbot Training Data - Simulated User Intent Data for German Restaurant
// This file contains training examples to help the AI understand user intent

export interface UserIntent {
  intent: string;
  confidence: number;
  entities?: {
    dishName?: string;
    quantity?: number;
    category?: string;
    dietary?: string;
    modification?: string;
  };
}

export interface TrainingExample {
  userInput: string;
  intent: string;
  entities: any;
  expectedResponse: string;
  context?: string;
}

// ============================================
// INTENT DEFINITIONS
// ============================================

export const intentDefinitions = {
  // Ordering Intents
  ORDER_DISH: 'User wants to order a specific dish',
  ADD_TO_CART: 'User wants to add item to cart',
  REMOVE_FROM_CART: 'User wants to remove item from cart',
  MODIFY_ORDER: 'User wants to modify their order',
  
  // Browsing Intents
  VIEW_MENU: 'User wants to see the menu',
  VIEW_CATEGORY: 'User wants to see a specific category',
  GET_RECOMMENDATIONS: 'User wants dish recommendations',
  
  // Information Intents
  DIETARY_QUERY: 'User has dietary restrictions or questions',
  DISH_INFO: 'User wants information about a dish',
  ALLERGEN_INFO: 'User asks about allergens',
  PRICE_QUERY: 'User asks about pricing',
  
  // Pairing Intents
  WINE_PAIRING: 'User wants wine pairing suggestions',
  SIDE_DISH_SUGGESTION: 'User wants side dish suggestions',
  
  // Cart & Payment Intents
  VIEW_CART: 'User wants to see their cart',
  CHECKOUT: 'User wants to proceed to checkout',
  APPLY_DISCOUNT: 'User wants to apply discount/voucher',
  
  // Service Intents
  GREETING: 'User greets the bot',
  HELP: 'User needs help',
  COMPLAINT: 'User has a complaint',
  COMPLIMENT: 'User gives positive feedback',
  
  // Special Intents
  SPECIAL_OCCASION: 'User mentions special occasion',
  RESERVATION: 'User wants to make reservation',
  CUSTOM_REQUEST: 'User has custom/special request'
};

// ============================================
// TRAINING EXAMPLES BY INTENT
// ============================================

export const trainingData: TrainingExample[] = [
  // ==================== ORDERING INTENT ====================
  {
    userInput: "I'll have the Schnitzel",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Wiener Schnitzel', quantity: 1 },
    expectedResponse: 'Perfect! I\'ve added Wiener Schnitzel to your cart. Would you like any sides or drinks with that?'
  },
  {
    userInput: "Can I get 2 pretzels please?",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Bavarian Pretzel', quantity: 2 },
    expectedResponse: 'Of course! I\'ve added 2 Bavarian Pretzels to your cart. Each comes with obatzda cheese dip. Anything else?'
  },
  {
    userInput: "I want to order bratwurst",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Bratwurst Platter', quantity: 1 },
    expectedResponse: 'Great choice! Added Bratwurst Platter (3 Nuremberg sausages with sauerkraut) to your cart.'
  },
  {
    userInput: "Add the Käsespätzle to my order",
    intent: 'ADD_TO_CART',
    entities: { dishName: 'Käsespätzle', quantity: 1 },
    expectedResponse: 'Added! Käsespätzle (egg noodles with melted cheese) is now in your cart.'
  },
  {
    userInput: "Give me 3 orders of potato salad",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Kartoffelsalat', quantity: 3 },
    expectedResponse: 'Got it! 3 portions of Kartoffelsalat added to your cart. Perfect for sharing!'
  },

  // ==================== MENU BROWSING ====================
  {
    userInput: "Show me the menu",
    intent: 'VIEW_MENU',
    entities: {},
    expectedResponse: 'Here\'s our full menu with German specialties! We have Starters, Main Courses, Desserts, and Drinks.'
  },
  {
    userInput: "What starters do you have?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'starter' },
    expectedResponse: 'Our starters include: Bavarian Pretzel, Kartoffelsalat (potato salad), and Flammkuchen. What sounds good?'
  },
  {
    userInput: "Let me see the desserts",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'dessert' },
    expectedResponse: 'Our delicious desserts: Black Forest Cake, Apple Strudel, and Kaiserschmarrn. All homemade!'
  },
  {
    userInput: "What drinks are available?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'drinks' },
    expectedResponse: 'We offer German wines, beers (wheat beer, pilsner), coffee, and mineral water. What would you like?'
  },

  // ==================== RECOMMENDATIONS ====================
  {
    userInput: "What do you recommend?",
    intent: 'GET_RECOMMENDATIONS',
    entities: {},
    expectedResponse: 'Our most popular dishes are Wiener Schnitzel and Rinderrouladen! Both are authentic German favorites.'
  },
  {
    userInput: "What's your best dish?",
    intent: 'GET_RECOMMENDATIONS',
    entities: {},
    expectedResponse: 'Our Wiener Schnitzel is legendary! It\'s a breaded veal cutlet served with potato salad and lingonberry jam.'
  },
  {
    userInput: "I'm really hungry, what should I order?",
    intent: 'GET_RECOMMENDATIONS',
    entities: { context: 'hungry' },
    expectedResponse: 'For a hearty meal, try our Sauerbraten or Rinderrouladen - both are filling and delicious! Or the Schweinshaxe if you\'re very hungry.'
  },
  {
    userInput: "What's popular here?",
    intent: 'GET_RECOMMENDATIONS',
    entities: {},
    expectedResponse: 'Our top sellers are: Wiener Schnitzel, Bratwurst Platter, and Rinderrouladen. Can\'t go wrong with any of these!'
  },

  // ==================== DIETARY QUERIES ====================
  {
    userInput: "Do you have vegetarian options?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'vegetarian' },
    expectedResponse: 'Yes! Our vegetarian options include: Käsespätzle, Bavarian Pretzel, Kartoffelsalat, and Flammkuchen (veggie version).'
  },
  {
    userInput: "I'm vegan, what can I eat?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'vegan' },
    expectedResponse: 'We can prepare Kartoffelsalat without bacon and offer fresh bread. I recommend asking about modifications to Spätzle.'
  },
  {
    userInput: "What's gluten-free?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'gluten-free' },
    expectedResponse: 'Our gluten-free options include: Sauerbraten (without gravy thickener), grilled sausages, and most side salads.'
  },
  {
    userInput: "I have a dairy allergy",
    intent: 'ALLERGEN_INFO',
    entities: { allergen: 'dairy' },
    expectedResponse: 'I understand. Please avoid: Käsespätzle, Pretzel with cheese dip, and cream-based desserts. I can recommend dairy-free alternatives.'
  },

  // ==================== KIDS & FAMILY OPTIONS (NEW) ====================
  {
    userInput: "What meals do you have for kids?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'kids' },
    expectedResponse: 'Great choice for the little ones! For kids, I recommend: smaller portions of Wiener Schnitzel, Käsespätzle (kids love the cheesy noodles!), or Bavarian Pretzel. We can also make half-portions of most main dishes. What would your child prefer?'
  },
  {
    userInput: "Do you have a kids menu?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'kids' },
    expectedResponse: 'Yes! Kids love our smaller portions of Schnitzel, Spätzle, and Bratwurst. We can also serve half-portions of any main course. What would the children like?'
  },
  {
    userInput: "What would you recommend for children?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'kids' },
    expectedResponse: 'For children, the Käsespätzle is always a hit - it\'s like German mac & cheese! Small Schnitzel portions and Pretzels are also very popular. Would you like me to add something for the kids?'
  },
  {
    userInput: "Could you show me options for children, please?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'kids' },
    expectedResponse: 'Of course! Our kid-friendly options include: Bavarian Pretzel, Käsespätzle, and small Schnitzel portions. All come in child-appropriate sizes. What sounds good?'
  },
  {
    userInput: "Could you recommend options for a family?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'family' },
    expectedResponse: 'Perfect for a family meal! I recommend our sharing platters: Bratwurst Platter (great for 2-3 people), large Flammkuchen, or multiple Schnitzels. We can also do family-sized portions of Spätzle. How many are dining?'
  },
  {
    userInput: "What dishes are good for sharing?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'sharing' },
    expectedResponse: 'Great for sharing! Try our: Bratwurst Platter, large Flammkuchen, Pretzel with cheese dip, and Kartoffelsalat. Perfect for the table! How many people?'
  },

  // ==================== DIET & HEALTHY OPTIONS (NEW) ====================
  {
    userInput: "Could you show me your diet-friendly and healthy options?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'healthy' },
    expectedResponse: 'Certainly! Our lighter, health-conscious options include: Kartoffelsalat (German potato salad), grilled Bratwurst (less oil), and we can serve any main with extra vegetables instead of heavy sides. We also offer fresh salads. What appeals to you?'
  },
  {
    userInput: "I would like to see your healthy options",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'healthy' },
    expectedResponse: 'Great choice! For healthy dining, try: Sauerbraten with vegetables, grilled sausages, Kartoffelsalat, or ask for any dish with lighter preparation. Would you like specifics?'
  },
  {
    userInput: "Could you show me lighter options, please?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'light' },
    expectedResponse: 'Of course! Lighter options: German potato salad, grilled Bratwurst, small portions of Schnitzel, and we can serve most mains without heavy sauces. What sounds good?'
  },
  {
    userInput: "What light meals do you have?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'light' },
    expectedResponse: 'For a light meal, I suggest: Kartoffelsalat, Bavarian Pretzel, or a small portion of any main dish. We can also prepare dishes with less oil. Interested?'
  },
  {
    userInput: "Could you show me low-carb options?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'low-carb' },
    expectedResponse: 'Perfect! Low-carb options: Wiener Schnitzel (skip the breading), Sauerbraten with vegetables only, grilled Bratwurst, and any meat dish without the bread or noodles. Sound good?'
  },
  {
    userInput: "What high-protein dishes do you recommend?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'high-protein' },
    expectedResponse: 'Great for high-protein! Try: Wiener Schnitzel (veal), Sauerbraten (beef pot roast), Rinderrouladen (beef rolls), or Bratwurst (pure meat). All excellent protein sources!'
  },
  {
    userInput: "Do you have keto-friendly dishes?",
    intent: 'DIETARY_QUERY',
    entities: { dietary: 'keto' },
    expectedResponse: 'Yes! Keto-friendly options: Schnitzel without breading, Bratwurst, Sauerbraten with vegetables, and any grilled meat. Just skip the bread, noodles, and potato sides. Works for you?'
  },

  // ==================== SOUPS & SALADS (NEW) ====================
  {
    userInput: "What soups do you have today?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'soups' },
    expectedResponse: 'Today\'s soup: Traditional German potato soup with bacon and vegetables. It\'s hearty and delicious! Would you like to add it to your order?'
  },
  {
    userInput: "What salad options do you have?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'salads' },
    expectedResponse: 'We have our famous Kartoffelsalat (German potato salad) - a must-try! We can also prepare fresh green salads with German dressing. Which interests you?'
  },
  {
    userInput: "I would like to see your salads, please",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'salads' },
    expectedResponse: 'Our signature salad is Kartoffelsalat - authentic German potato salad with bacon and herbs. We also offer fresh mixed greens. What would you prefer?'
  },

  // ==================== QUICK & CONVENIENCE (NEW) ====================
  {
    userInput: "What can I get quickly?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'quick' },
    expectedResponse: 'For quick service, I recommend: Bavarian Pretzel (ready now!), Bratwurst Platter (10 mins), or Flammkuchen (15 mins). All delicious and fast! What would you like?'
  },
  {
    userInput: "What dishes are prepared quickly?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'quick' },
    expectedResponse: 'Our fastest dishes: Pretzel (immediate), Kartoffelsalat (ready now), Bratwurst (10 minutes), and Flammkuchen (15 minutes). Need something quick?'
  },

  // ==================== MEAL TIME SPECIALS (NEW) ====================
  {
    userInput: "What are your lunch specials today?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'lunch-specials' },
    expectedResponse: 'Today\'s lunch specials: Schnitzel with potato salad (€16.90), Bratwurst Platter with sauerkraut (€12.90), and Käsespätzle (€10.90). All include a drink! Which appeals to you?'
  },
  {
    userInput: "What do you recommend for lunch?",
    intent: 'GET_RECOMMENDATIONS',
    entities: { context: 'lunch' },
    expectedResponse: 'For lunch, our popular choices are: Bratwurst Platter (quick and filling), Käsespätzle (comfort food), or Flammkuchen (light but satisfying). What sounds good?'
  },

  // ==================== TRADITIONAL & AUTHENTIC (NEW) ====================
  {
    userInput: "What is the most traditional German dish?",
    intent: 'GET_RECOMMENDATIONS',
    entities: { preference: 'traditional' },
    expectedResponse: 'Our most traditional dishes are: Sauerbraten (marinated pot roast - authentic family recipe!), Rinderrouladen (beef rolls), and Wiener Schnitzel. Can\'t get more German than these! Which interests you?'
  },
  {
    userInput: "What Bavarian dishes do you offer?",
    intent: 'VIEW_CATEGORY',
    entities: { category: 'bavarian' },
    expectedResponse: 'Authentic Bavarian specialties: Bavarian Pretzel with Obatzda, Käsespätzle, Bratwurst (Nuremberg-style), and of course Weissbier! What would you like to try?'
  },
  {
    userInput: "What is the most authentic dish?",
    intent: 'GET_RECOMMENDATIONS',
    entities: { preference: 'authentic' },
    expectedResponse: 'For authentic German cuisine, try: Sauerbraten (marinated for 3 days!), Rinderrouladen (grandmother\'s recipe), or Spätzle (homemade noodles). All traditional! Interested?'
  },

  // ==================== DISH INFORMATION ====================
  {
    userInput: "What is Sauerbraten?",
    intent: 'DISH_INFO',
    entities: { dishName: 'Sauerbraten' },
    expectedResponse: 'Sauerbraten is a traditional German pot roast! Beef marinated for days in vinegar, served with red cabbage and dumplings.'
  },
  {
    userInput: "Tell me about the Schnitzel",
    intent: 'DISH_INFO',
    entities: { dishName: 'Wiener Schnitzel' },
    expectedResponse: 'Our Wiener Schnitzel is a breaded veal cutlet, pan-fried to golden perfection. Served with potato salad and lingonberry jam.'
  },
  {
    userInput: "What comes with the bratwurst?",
    intent: 'DISH_INFO',
    entities: { dishName: 'Bratwurst Platter' },
    expectedResponse: 'The Bratwurst Platter includes 3 Nuremberg sausages, sauerkraut, mustard, and fresh bread. Very traditional!'
  },
  {
    userInput: "How big is the pretzel?",
    intent: 'DISH_INFO',
    entities: { dishName: 'Bavarian Pretzel' },
    expectedResponse: 'Our Bavarian Pretzel is large (about 200g), perfect for sharing! Comes with creamy obatzda cheese dip.'
  },

  // ==================== PRICE QUERIES ====================
  {
    userInput: "How much is the Schnitzel?",
    intent: 'PRICE_QUERY',
    entities: { dishName: 'Wiener Schnitzel' },
    expectedResponse: 'The Wiener Schnitzel is €18.90. It\'s a generous portion with sides included.'
  },
  {
    userInput: "What's the price of desserts?",
    intent: 'PRICE_QUERY',
    entities: { category: 'dessert' },
    expectedResponse: 'Our desserts range from €6.50 to €8.90. All are homemade and delicious!'
  },

  // ==================== PAIRINGS ====================
  {
    userInput: "What wine goes with Schnitzel?",
    intent: 'WINE_PAIRING',
    entities: { dishName: 'Wiener Schnitzel' },
    expectedResponse: 'Perfect pairing! I recommend a crisp Riesling or Grüner Veltliner. The acidity complements the richness beautifully.'
  },
  {
    userInput: "What should I drink with this?",
    intent: 'WINE_PAIRING',
    entities: {},
    context: 'has_items_in_cart',
    expectedResponse: 'Based on your order, I suggest a German wheat beer or a light white wine. Would you like specific recommendations?'
  },
  {
    userInput: "Any good side dishes?",
    intent: 'SIDE_DISH_SUGGESTION',
    entities: {},
    expectedResponse: 'Try our Kartoffelsalat (potato salad), red cabbage, or sauerkraut as sides. They\'re all authentic German recipes!'
  },

  // ==================== CART & CHECKOUT ====================
  {
    userInput: "What's in my cart?",
    intent: 'VIEW_CART',
    entities: {},
    expectedResponse: 'Let me show you your current order... [Display cart contents with quantities and total]'
  },
  {
    userInput: "I want to checkout",
    intent: 'CHECKOUT',
    entities: {},
    expectedResponse: 'Great! Your total is [amount]. Proceeding to payment now. Would you like to apply any discount codes?'
  },
  {
    userInput: "Do you have any discounts?",
    intent: 'APPLY_DISCOUNT',
    entities: {},
    expectedResponse: 'Yes! We have vouchers: WELCOME10 (10% off), GOLD20 (20% off €50+), and SAVE5 (€5 off €25+). Which would you like to apply?'
  },
  {
    userInput: "Remove the pretzel from my order",
    intent: 'REMOVE_FROM_CART',
    entities: { dishName: 'Bavarian Pretzel' },
    expectedResponse: 'Done! Bavarian Pretzel removed from your cart.'
  },

  // ==================== MODIFICATIONS ====================
  {
    userInput: "Can I get the Schnitzel without the lingonberry?",
    intent: 'MODIFY_ORDER',
    entities: { dishName: 'Wiener Schnitzel', modification: 'no lingonberry' },
    expectedResponse: 'Absolutely! I\'ll note: Wiener Schnitzel without lingonberry jam. Anything else?'
  },
  {
    userInput: "Make that extra crispy please",
    intent: 'MODIFY_ORDER',
    entities: { modification: 'extra crispy' },
    expectedResponse: 'Noted! Extra crispy. Our chef will make sure it\'s perfectly golden!'
  },
  {
    userInput: "No onions on mine",
    intent: 'MODIFY_ORDER',
    entities: { modification: 'no onions' },
    expectedResponse: 'Got it - no onions. I\'ll add that to your order notes.'
  },

  // ==================== GREETINGS ====================
  {
    userInput: "Hello!",
    intent: 'GREETING',
    entities: {},
    expectedResponse: 'Guten Tag! Welcome to Lumière Dorée. I\'m your AI waiter. How can I help you today?'
  },
  {
    userInput: "Good evening",
    intent: 'GREETING',
    entities: {},
    expectedResponse: 'Good evening! Ready to explore authentic German cuisine? What sounds good to you?'
  },
  {
    userInput: "Hey there",
    intent: 'GREETING',
    entities: {},
    expectedResponse: 'Hello! Welcome! Would you like to see our menu or hear about today\'s specials?'
  },

  // ==================== HELP ====================
  {
    userInput: "I need help",
    intent: 'HELP',
    entities: {},
    expectedResponse: 'I\'m here to help! You can ask me about our menu, order dishes, get recommendations, or check your cart. What do you need?'
  },
  {
    userInput: "How does this work?",
    intent: 'HELP',
    entities: {},
    expectedResponse: 'It\'s easy! Just tell me what you\'d like to order, ask questions about dishes, or say "show me the menu". I\'ll take care of the rest!'
  },

  // ==================== SPECIAL OCCASIONS ====================
  {
    userInput: "It's my birthday today!",
    intent: 'SPECIAL_OCCASION',
    entities: { occasion: 'birthday' },
    expectedResponse: 'Happy Birthday! 🎉 Let me recommend our celebratory desserts - Black Forest Cake is perfect! Would you like a special table arrangement?'
  },
  {
    userInput: "This is a romantic dinner",
    intent: 'SPECIAL_OCCASION',
    entities: { occasion: 'romantic' },
    expectedResponse: 'How lovely! For a romantic dinner, I suggest our Rinderrouladen with candlelight ambiance. And perhaps some German wine?'
  },

  // ==================== QUANTITY VARIATIONS ====================
  {
    userInput: "Two Schnitzels please",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Wiener Schnitzel', quantity: 2 },
    expectedResponse: 'Excellent! 2 Wiener Schnitzels added to your cart. Great for sharing!'
  },
  {
    userInput: "Can I get a couple of beers?",
    intent: 'ORDER_DISH',
    entities: { dishName: 'Beer', quantity: 2 },
    expectedResponse: 'Sure! 2 German beers coming up. Would you prefer wheat beer or pilsner?'
  },

  // ==================== VAGUE REQUESTS ====================
  {
    userInput: "I want something traditional",
    intent: 'GET_RECOMMENDATIONS',
    entities: { preference: 'traditional' },
    expectedResponse: 'For authentic German tradition, try Wiener Schnitzel, Sauerbraten, or Schweinshaxe. All are time-honored classics!'
  },
  {
    userInput: "Something light",
    intent: 'GET_RECOMMENDATIONS',
    entities: { preference: 'light' },
    expectedResponse: 'For a lighter meal, I recommend Kartoffelsalat, Flammkuchen, or a fresh salad with grilled chicken.'
  },
  {
    userInput: "Surprise me!",
    intent: 'GET_RECOMMENDATIONS',
    entities: { preference: 'random' },
    expectedResponse: 'How adventurous! Let me suggest our Rinderrouladen - beef rolls with a delicious surprise filling. Chef\'s favorite!'
  },

  // ==================== COMPLAINTS ====================
  {
    userInput: "This is taking too long",
    intent: 'COMPLAINT',
    entities: { issue: 'wait_time' },
    expectedResponse: 'I sincerely apologize for the wait. Let me check on your order status and ensure it\'s prioritized.'
  },

  // ==================== COMPLIMENTS ====================
  {
    userInput: "This looks amazing!",
    intent: 'COMPLIMENT',
    entities: {},
    expectedResponse: 'Thank you! Our chef takes great pride in every dish. Enjoy your meal! 😊'
  },
  {
    userInput: "Best Schnitzel I've ever had",
    intent: 'COMPLIMENT',
    entities: { dishName: 'Wiener Schnitzel' },
    expectedResponse: 'That\'s wonderful to hear! I\'ll pass your compliments to the chef. Would you like to try any of our desserts?'
  }
];

// ============================================
// ENTITY EXTRACTION PATTERNS
// ============================================

export const entityPatterns = {
  // Dish names and variations
  dishes: {
    'Wiener Schnitzel': ['schnitzel', 'veal cutlet', 'breaded veal', 'wiener'],
    'Bratwurst Platter': ['bratwurst', 'sausage', 'sausages', 'wurst'],
    'Bavarian Pretzel': ['pretzel', 'bretzel', 'brezel'],
    'Sauerbraten': ['sauerbraten', 'pot roast', 'marinated beef'],
    'Rinderrouladen': ['rouladen', 'beef rolls', 'beef roll'],
    'Käsespätzle': ['spätzle', 'spaetzle', 'cheese noodles', 'kasespaetzle'],
    'Kartoffelsalat': ['potato salad', 'kartoffelsalat'],
    'Flammkuchen': ['flammkuchen', 'german pizza', 'flatbread'],
    'Black Forest Cake': ['black forest', 'chocolate cake', 'schwarzwälder'],
    'Apple Strudel': ['strudel', 'apple pastry', 'apfelstrudel']
  },

  // Quantities
  quantities: {
    patterns: [
      /(\d+)\s*(x|order|orders|piece|pieces)?/i,
      /(one|two|three|four|five|six|seven|eight|nine|ten)/i,
      /(a|an)\s+/i,
      /(couple|pair)\s+of/i
    ],
    numbers: {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'a': 1, 'an': 1, 'couple': 2, 'pair': 2
    }
  },

  // Categories
  categories: {
    'starter': ['starter', 'appetizer', 'app', 'beginning'],
    'main': ['main', 'entree', 'main course', 'dinner'],
    'dessert': ['dessert', 'sweet', 'after', 'cake'],
    'drinks': ['drink', 'beverage', 'beer', 'wine', 'water', 'coffee'],
    // NEW: Special Categories
    'kids': ['kids', 'children', 'child', 'kid', 'for kids', 'for children'],
    'family': ['family', 'group', 'sharing', 'share', 'for sharing', 'family meal'],
    'soups': ['soup', 'soups'],
    'salads': ['salad', 'salads'],
    'quick': ['quick', 'fast', 'quick meal', 'express', 'ready fast'],
    'lunch-specials': ['lunch special', 'lunch specials', 'lunch deal'],
    'bavarian': ['bavarian', 'bayern', 'bavaria'],
    'traditional': ['traditional', 'authentic', 'classic', 'regional']
  },

  // Dietary preferences
  dietary: {
    'vegetarian': ['vegetarian', 'veggie', 'no meat', 'meatless'],
    'vegan': ['vegan', 'plant-based', 'no animal products'],
    'gluten-free': ['gluten-free', 'gluten free', 'no gluten', 'celiac'],
    'dairy-free': ['dairy-free', 'no dairy', 'lactose intolerant', 'no cheese'],
    // NEW: Health & Diet Options
    'healthy': ['healthy', 'health-conscious', 'diet', 'diet-friendly', 'diet dishes'],
    'light': ['light', 'lighter', 'light meal', 'light options'],
    'low-carb': ['low-carb', 'low carb', 'keto', 'keto-friendly'],
    'high-protein': ['high-protein', 'high protein', 'protein']
  },

  // Modifications
  modifications: {
    'no': /no\s+(\w+)/i,
    'extra': /extra\s+(\w+)/i,
    'without': /without\s+(\w+)/i,
    'add': /add\s+(\w+)/i,
    'crispy': /crispy|crunchy|well.done/i,
    'rare': /rare|pink/i,
    'medium': /medium/i
  },

  // Special occasions
  occasions: {
    'birthday': ['birthday', 'bday', 'b-day'],
    'anniversary': ['anniversary'],
    'romantic': ['date', 'romantic', 'anniversary'],
    'celebration': ['celebration', 'celebrating', 'special occasion']
  }
};

// ============================================
// CONVERSATION CONTEXT TRACKING
// ============================================

export interface ConversationContext {
  lastIntent?: string;
  currentCategory?: string;
  discussedDishes: string[];
  cartItems: string[];
  dietaryRestrictions: string[];
  modifications: string[];
  specialOccasion?: string;
  step?: 'browsing' | 'ordering' | 'confirming' | 'checkout';
}

// ============================================
// RESPONSE TEMPLATES
// ============================================

export const responseTemplates = {
  ORDER_CONFIRMATION: [
    "Perfect! I've added {dish} to your cart. Would you like anything else?",
    "Great choice! {dish} is now in your cart. Anything to drink?",
    "Added {dish}! Can I get you any sides or desserts?",
    "Excellent! {dish} added. Would you like to see wine pairings?"
  ],

  DISH_RECOMMENDATION: [
    "I highly recommend our {dish}. It's {description}.",
    "You must try the {dish} - it's one of our most popular dishes!",
    "For that, I suggest {dish}. {description}.",
    "The {dish} would be perfect! {description}."
  ],

  CLARIFICATION_NEEDED: [
    "I want to make sure I get this right. Did you mean {dish}?",
    "Just to confirm - you'd like {quantity} {dish}?",
    "To clarify, you want {dish}, correct?",
    "Let me verify: {dish} with {modification}?"
  ],

  CART_SUMMARY: [
    "Your cart has: {items}. Total: €{total}",
    "So far you've ordered: {items}. Anything else?",
    "Current order: {items}. Ready to checkout?"
  ],

  CHECKOUT_PROMPTS: [
    "Your total is €{total}. Ready to proceed to payment?",
    "That'll be €{total}. Would you like to apply any voucher codes?",
    "Order total: €{total}. Shall we proceed to checkout?"
  ],

  ERROR_HANDLING: [
    "I'm not sure I understood. Could you rephrase that?",
    "I didn't quite catch that. Which dish were you interested in?",
    "Could you tell me more about what you're looking for?",
    "I'm here to help! Try asking about our menu or specific dishes."
  ]
};

// ============================================
// INTENT CONFIDENCE SCORING
// ============================================

export const calculateIntentConfidence = (
  userInput: string,
  trainingExamples: TrainingExample[]
): { intent: string; confidence: number } => {
  // Simple keyword matching for demonstration
  // In production, use ML models or NLP services
  
  let bestMatch = { intent: 'UNKNOWN', confidence: 0 };
  
  const lowerInput = userInput.toLowerCase();
  
  trainingExamples.forEach(example => {
    const exampleWords = example.userInput.toLowerCase().split(' ');
    const inputWords = lowerInput.split(' ');
    
    const matchingWords = exampleWords.filter(word => 
      inputWords.includes(word) && word.length > 2
    );
    
    const confidence = matchingWords.length / Math.max(exampleWords.length, inputWords.length);
    
    if (confidence > bestMatch.confidence) {
      bestMatch = { intent: example.intent, confidence };
    }
  });
  
  return bestMatch;
};

// ============================================
// COMMON USER PATTERNS
// ============================================

export const commonUserPatterns = {
  ordering: [
    "I'll have {dish}",
    "Can I get {dish}?",
    "I want {dish}",
    "{quantity} {dish} please",
    "Add {dish} to my order",
    "Let me get {dish}"
  ],
  
  browsing: [
    "Show me {category}",
    "What {category} do you have?",
    "Let me see {category}",
    "Do you have {dish}?"
  ],
  
  information: [
    "What is {dish}?",
    "Tell me about {dish}",
    "How much is {dish}?",
    "What comes with {dish}?"
  ],
  
  recommendations: [
    "What do you recommend?",
    "What's popular?",
    "What's good here?",
    "Surprise me"
  ]
};

export default {
  intentDefinitions,
  trainingData,
  entityPatterns,
  responseTemplates,
  commonUserPatterns,
  calculateIntentConfidence
};
