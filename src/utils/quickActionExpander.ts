// Smart Quick Action Expander for Restaurant AI Assistant
// Converts short keywords into polite, natural, complete English sentences

export interface QuickAction {
  keyword: string;
  expandedPhrase: string;
  category?: 'ordering' | 'browsing' | 'help' | 'payment' | 'special';
}

/**
 * Expands a quick action keyword into a full, polite restaurant phrase
 * @param quickAction - The short keyword clicked by the user
 * @returns The expanded, natural English sentence
 */
export function expandQuickAction(quickAction: string): string {
  const lowerAction = quickAction.toLowerCase().trim();
  
  // Define comprehensive quick action mappings
  const expansions: { [key: string]: string } = {
    // Menu & Browsing
    'menu': 'I would like to see the full menu, please.',
    'show menu': 'Could you show me the menu, please?',
    'browse': 'I would like to browse your menu.',
    'see menu': 'May I see the menu, please?',
    'full menu': 'Show me the complete menu.',
    
    // Category-specific browsing
    'starters': 'Could you show me your starters and appetizers, please?',
    'appetizers': 'I would like to see your appetizers.',
    'mains': 'Could you show me your main courses, please?',
    'main course': 'I would like to see the main courses.',
    'main courses': 'Could you show me the main courses, please?',
    'desserts': 'I would like to see your dessert menu, please.',
    'dessert': 'Could you show me your desserts?',
    'drinks': 'Can you show me the drinks menu, please?',
    'beverages': 'I would like to see your beverage selection.',
    'wine': 'Could you show me your wine list, please?',
    'beer': 'What beers do you have available?',
    'wine list': 'Show me your wine selection, please.',
    
    // NEW: Special Categories & Dietary Options
    'kids': 'Do you have a kids menu or smaller portions?',
    'kids menu': 'Could you show me options for children, please?',
    'kids meals': 'What meals do you have for kids?',
    'children': 'What would you recommend for children?',
    'for kids': 'What dishes are suitable for kids?',
    
    'diet': 'Could you show me your diet-friendly and healthy options?',
    'diet dishes': 'What healthy and diet-friendly dishes do you have?',
    'healthy': 'I would like to see your healthy options.',
    'healthy options': 'Could you show me healthy menu choices, please?',
    'light meal': 'What light meals do you have?',
    'light options': 'Could you show me lighter options, please?',
    'low-calorie': 'What low-calorie dishes do you offer?',
    'low calorie': 'Could you show me low-calorie options?',
    'diet-friendly': 'What diet-friendly dishes do you have?',
    
    'protein': 'What high-protein dishes do you recommend?',
    'high-protein': 'Could you show me high-protein options?',
    'low-carb': 'What low-carb dishes do you have?',
    'low carb': 'Could you show me low-carb options?',
    'keto': 'Do you have keto-friendly dishes?',
    'keto-friendly': 'What dishes are keto-friendly?',
    
    'soup': 'What soups do you have today?',
    'soups': 'Could you show me your soup selection?',
    'salad': 'I would like to see your salads, please.',
    'salads': 'What salad options do you have?',
    'soup & salad': 'Could I see your soups and salads?',
    
    // Portion & Serving Sizes
    'small portion': 'Do you have smaller portions available?',
    'small portions': 'Could I get a smaller portion, please?',
    'large portion': 'Do you offer large portions?',
    'large portions': 'I would like a large portion, please.',
    'half portion': 'Can I get a half portion?',
    'sharing platter': 'What platters are good for sharing?',
    'sharing': 'What dishes are good for sharing?',
    'for sharing': 'Could you recommend dishes for sharing?',
    
    // Group & Family Options
    'family': 'What dishes are good for a family meal?',
    'family meal': 'Could you recommend options for a family?',
    'family portions': 'Do you have family-sized portions?',
    'group': 'What would you recommend for a group?',
    'group order': 'We are ordering for a group. What do you suggest?',
    'party platter': 'Do you have party platters?',
    'catering': 'Do you offer catering options?',
    
    // Meal Time Specific
    'lunch': 'What do you recommend for lunch?',
    'lunch special': 'Do you have lunch specials?',
    'lunch specials': 'What are your lunch specials today?',
    'dinner': 'What do you recommend for dinner?',
    'dinner special': 'What are your dinner specials?',
    'brunch': 'What brunch options do you have?',
    
    // Quick & Convenience
    'quick': 'What can I get quickly?',
    'quick meal': 'What dishes are prepared quickly?',
    'fast': 'What is your fastest dish?',
    'ready fast': 'What can be ready fast?',
    'express': 'Do you have express meal options?',
    'to-go': 'Can I order this to-go?',
    'takeaway': 'I would like to order takeaway.',
    'takeout': 'Can I get this for takeout?',
    
    // Combo & Deals
    'combo': 'Do you have combo meals?',
    'combo meals': 'What combo deals do you have?',
    'meal deal': 'Are there any meal deals?',
    'set menu': 'Do you have a set menu?',
    'prix fixe': 'Do you offer a prix fixe menu?',
    'tasting menu': 'Could I see your tasting menu?',
    
    // Traditional & Authentic
    'traditional': 'What is the most traditional German dish?',
    'authentic': 'What is the most authentic dish?',
    'classic': 'What are your classic dishes?',
    'regional': 'What regional specialties do you have?',
    'bavarian': 'What Bavarian dishes do you offer?',
    'german classics': 'What are the German classics on your menu?',
    
    // Ordering
    'order': 'I would like to place an order.',
    'i want to order': 'I would like to place an order, please.',
    'place order': 'I want to place an order.',
    'start order': 'I would like to start ordering, please.',
    
    // Specific dishes (common quick orders)
    'schnitzel': 'I would like to order the Wiener Schnitzel, please.',
    'i want schnitzel': 'I will have the Wiener Schnitzel.',
    'wiener schnitzel': 'I would like the Wiener Schnitzel.',
    'pretzel': 'Could I get a Bavarian Pretzel, please?',
    'bavarian pretzel': 'I would like a Bavarian Pretzel with cheese dip.',
    'bratwurst': 'I would like to order the Bratwurst Platter.',
    'sausage': 'I will have the Bratwurst Platter, please.',
    'rouladen': 'I would like to order the Rinderrouladen, please.',
    'rinderrouladen': 'I would like to order the Rinderrouladen, please.',
    'beef rolls': 'I would like to order the Rinderrouladen, please.',
    'sauerbraten': 'Could I get the Sauerbraten, please?',
    'spaetzle': 'I will have the Käsespätzle.',
    'käsespätzle': 'I will have the Käsespätzle.',
    'cheese spaetzle': 'I will have the Käsespätzle.',
    'potato salad': 'I would like to order the Kartoffelsalat.',
    'kartoffelsalat': 'I would like to order the Kartoffelsalat.',
    'black forest cake': 'Could I get the Black Forest Cake for dessert?',
    'apple strudel': 'I will have the Apple Strudel, please.',
    'strudel': 'I will have the Apple Strudel, please.',
    'flammkuchen': 'I would like to order the Flammkuchen.',
    'german pizza': 'I would like to order the Flammkuchen.',
    
    // Recommendations
    'recommend': 'What would you recommend?',
    'recommendations': 'Could you give me some recommendations, please?',
    'suggest': 'What do you suggest I try?',
    'popular': 'What are your most popular dishes?',
    'what\'s popular?': 'What are your most popular dishes?',
    'what\'s popular': 'What are your most popular dishes?',
    'best': 'What is your best dish?',
    'special': 'What are today\'s specials?',
    'specials': 'What are today\'s specials?',
    'today\'s specials': 'What are the specials today?',
    'chef special': 'What is the chef\'s special today?',
    'signature': 'What are your signature dishes?',
    'top dishes': 'What are your top dishes?',
    'favorites': 'What are the customer favorites?',
    
    // Dietary & Allergens
    'vegetarian': 'Do you have vegetarian options?',
    'vegetarian options': 'Could you show me your vegetarian dishes, please?',
    'vegan': 'Do you have any vegan options?',
    'vegan options': 'Could you show me vegan dishes?',
    'gluten-free': 'Do you have gluten-free options?',
    'gluten free': 'Could you show me gluten-free dishes, please?',
    'dairy-free': 'What options do you have that are dairy-free?',
    'allergens': 'Could you tell me about allergen information?',
    'allergy': 'I have a food allergy. Can you help me?',
    'no meat': 'What options do you have without meat?',
    'plant-based': 'Do you have plant-based options?',
    
    // Cart & Order Status
    'cart': 'What is in my cart?',
    'my cart': 'Could you show me my cart, please?',
    'check cart': 'What items are in my cart?',
    'view cart': 'I would like to see my cart.',
    'order status': 'What is the status of my order?',
    'my order': 'Could you show me my current order?',
    'review order': 'Let me review my order.',
    
    // Payment & Checkout
    'checkout': 'I would like to proceed to checkout.',
    'pay': 'I would like to pay now, please.',
    'payment': 'How can I make a payment?',
    'bill': 'Could I get the bill, please?',
    'check': 'May I have the check, please?',
    'total': 'What is my total?',
    'pay now': 'I am ready to pay now.',
    'finish order': 'I would like to finish my order.',
    
    // Discounts & Vouchers
    'discount': 'Do you have any current discounts?',
    'discounts': 'Are there any discounts available?',
    'voucher': 'Do you have any vouchers I can use?',
    'vouchers': 'What vouchers are available?',
    'promo': 'Do you have any promotional offers?',
    'deal': 'Are there any deals or special offers?',
    'offers': 'What offers do you have today?',
    'coupons': 'Do you have any coupon codes?',
    'save money': 'How can I save money on my order?',
    
    // Help & Information
    'help': 'Can I get some help, please?',
    'info': 'Could you give me some information?',
    'information': 'I need some information about your restaurant.',
    'about': 'Tell me about your restaurant.',
    'hours': 'What are your opening hours?',
    'opening hours': 'What are your opening hours today?',
    'location': 'Where are you located?',
    'contact': 'How can I contact you?',
    'reservation': 'I would like to make a reservation.',
    'book': 'Can I book a table?',
    'book table': 'I would like to book a table, please.',
    'how it works': 'How does ordering work here?',
    
    // Pairing & Suggestions
    'pairing': 'What would pair well with my order?',
    'wine pairing': 'Could you suggest a wine pairing?',
    'what goes with': 'What goes well with this dish?',
    'pair': 'What would you recommend to pair with my meal?',
    'side': 'What sides do you recommend?',
    'sides': 'Could you suggest some side dishes?',
    'add side': 'I would like to add a side dish.',
    'drink suggestion': 'What drinks do you recommend?',
    
    // Beverages
    'coffee': 'I would like a coffee, please.',
    'water': 'Could I get some water, please?',
    'sparkling water': 'I would like sparkling water.',
    'still water': 'I would like still water, please.',
    'german beer': 'What German beers do you have?',
    'wheat beer': 'I would like a Bavarian Wheat Beer.',
    'pilsner': 'I would like a German Pilsner.',
    
    // Portions & Sharing
    'large': 'Do you have a large portion?',
    'small': 'I would prefer a small portion.',
    'sharing': 'What dishes are good for sharing?',
    'for two': 'What would you recommend for two people?',
    'for kids': 'Do you have options for children?',
    'kids menu': 'Could I see the kids menu?',
    'family meal': 'What do you recommend for a family?',
    
    // Preparation & Customization
    'no onion': 'Could you make that without onions?',
    'no garlic': 'I would like that without garlic, please.',
    'extra': 'Could I get extra on the side?',
    'sauce on side': 'Could I have the sauce on the side?',
    'well done': 'I would like that well done.',
    'rare': 'Could you cook that rare, please?',
    'medium': 'I would like that medium, please.',
    'crispy': 'Please make it extra crispy.',
    'no sauce': 'Hold the sauce, please.',
    
    // Time & Urgency
    'quick': 'What can I get quickly?',
    'fast': 'What dishes are prepared fast?',
    'light': 'I would like something light.',
    'light meal': 'I would like a light meal.',
    'heavy': 'I want something hearty and filling.',
    'hungry': 'I am very hungry! What do you recommend?',
    'filling': 'What is your most filling dish?',
    
    // Feedback & Service
    'feedback': 'I would like to provide some feedback.',
    'compliment': 'I would like to compliment the chef.',
    'complaint': 'I have a concern I would like to address.',
    'waiter': 'Can I speak to a waiter?',
    'manager': 'Could I speak with the manager?',
    'question': 'I have a question.',
    
    // Quantity variations
    '1': 'I would like to order one, please.',
    '2': 'I would like to order two, please.',
    '3': 'I would like to order three, please.',
    'one': 'I will have one, please.',
    'two': 'I will have two, please.',
    'three': 'I will have three, please.',
    
    // Modifications
    'no': 'No, thank you.',
    'yes': 'Yes, please.',
    'add': 'Please add that to my order.',
    'remove': 'Could you remove that, please?',
    'change': 'I would like to change my order.',
    'modify': 'Can I modify my order?',
    'clear cart': 'I would like to clear my cart and start over.',
    'start over': 'I would like to start over with a new order.',
    'cancel': 'I would like to cancel my current order.',
    
    // Greetings (in case used as quick actions)
    'hello': 'Hello! I would like to order, please.',
    'hi': 'Hi! I am ready to order.',
    'good morning': 'Good morning! I would like to see the menu.',
    'good evening': 'Good evening! I am here to order dinner.',
    'good afternoon': 'Good afternoon! May I see the menu?',
    
    // Meal times
    'breakfast': 'What do you recommend for breakfast?',
    'lunch': 'What do you recommend for lunch?',
    'dinner': 'What do you recommend for dinner?',
    'brunch': 'What brunch options do you have?',
    
    // Special occasions
    'birthday': 'I am celebrating a birthday. What do you recommend?',
    'celebration': 'We are celebrating today. What special dishes do you recommend?',
    'date': 'What would you recommend for a romantic dinner?',
    'romantic': 'What would be good for a romantic dinner?',
    'family': 'What dishes are good for a family meal?',
    'anniversary': 'We are celebrating our anniversary.',
    
    // More specific actions
    'surprise me': 'Surprise me with your best dish!',
    'chef\'s choice': 'What would the chef recommend?',
    'traditional': 'What is the most traditional German dish?',
    'authentic': 'What is the most authentic dish?',
    'must try': 'What is a must-try dish here?',
    'new': 'What are your newest dishes?',
    'seasonal': 'What seasonal items do you have?',
  };
  
  // Direct match
  if (expansions[lowerAction]) {
    return expansions[lowerAction];
  }
  
  // Pattern matching for common phrases
  if (lowerAction.includes('how much')) {
    return 'How much does this cost?';
  }
  
  if (lowerAction.includes('contains')) {
    return 'What does this dish contain?';
  }
  
  if (lowerAction.match(/^i (want|need|would like)/)) {
    return lowerAction.charAt(0).toUpperCase() + lowerAction.slice(1) + '.';
  }
  
  // If no match found, return the original with basic formatting
  // Capitalize first letter and add period if missing
  const formatted = lowerAction.charAt(0).toUpperCase() + lowerAction.slice(1);
  return formatted.endsWith('?') || formatted.endsWith('.') ? formatted : formatted + '.';
}

/**
 * Get all available quick actions organized by category
 */
export function getAllQuickActions(): QuickAction[] {
  return [
    // Main Browsing
    { keyword: 'Menu', expandedPhrase: 'I would like to see the full menu, please.', category: 'browsing' },
    { keyword: 'Starters', expandedPhrase: 'Could you show me your starters and appetizers, please?', category: 'browsing' },
    { keyword: 'Mains', expandedPhrase: 'Could you show me your main courses, please?', category: 'browsing' },
    { keyword: 'Desserts', expandedPhrase: 'I would like to see your dessert menu, please.', category: 'browsing' },
    { keyword: 'Drinks', expandedPhrase: 'Can you show me the drinks menu, please?', category: 'browsing' },
    
    // NEW: Special Categories
    { keyword: 'Kids Meals', expandedPhrase: 'What meals do you have for kids?', category: 'browsing' },
    { keyword: 'Diet Dishes', expandedPhrase: 'Could you show me your diet-friendly and healthy options?', category: 'browsing' },
    { keyword: 'Healthy', expandedPhrase: 'I would like to see your healthy options.', category: 'browsing' },
    { keyword: 'Light Options', expandedPhrase: 'Could you show me lighter options, please?', category: 'browsing' },
    { keyword: 'Soups', expandedPhrase: 'What soups do you have today?', category: 'browsing' },
    { keyword: 'Salads', expandedPhrase: 'What salad options do you have?', category: 'browsing' },
    { keyword: 'Lunch Specials', expandedPhrase: 'What are your lunch specials today?', category: 'special' },
    { keyword: 'Family Meal', expandedPhrase: 'Could you recommend options for a family?', category: 'browsing' },
    { keyword: 'Sharing', expandedPhrase: 'What dishes are good for sharing?', category: 'browsing' },
    { keyword: 'Traditional', expandedPhrase: 'What is the most traditional German dish?', category: 'browsing' },
    { keyword: 'Quick Meal', expandedPhrase: 'What can I get quickly?', category: 'browsing' },
    
    // Recommendations & Popular
    { keyword: 'Popular', expandedPhrase: 'What are your most popular dishes?', category: 'browsing' },
    { keyword: 'Recommend', expandedPhrase: 'What would you recommend?', category: 'browsing' },
    { keyword: 'Specials', expandedPhrase: 'What are today\'s specials?', category: 'special' },
    { keyword: 'Signature', expandedPhrase: 'What are your signature dishes?', category: 'special' },
    { keyword: 'Best', expandedPhrase: 'What is your best dish?', category: 'browsing' },
    
    // Quick Dish Orders
    { keyword: 'Schnitzel', expandedPhrase: 'I would like to order the Wiener Schnitzel, please.', category: 'ordering' },
    { keyword: 'Bratwurst', expandedPhrase: 'I would like to order the Bratwurst Platter.', category: 'ordering' },
    { keyword: 'Pretzel', expandedPhrase: 'Could I get a Bavarian Pretzel, please?', category: 'ordering' },
    
    // Dietary
    { keyword: 'Vegetarian', expandedPhrase: 'Do you have vegetarian options?', category: 'browsing' },
    { keyword: 'Vegan', expandedPhrase: 'Do you have any vegan options?', category: 'browsing' },
    { keyword: 'Gluten-free', expandedPhrase: 'Could you show me gluten-free dishes, please?', category: 'browsing' },
    { keyword: 'Low-Carb', expandedPhrase: 'Could you show me low-carb options?', category: 'browsing' },
    { keyword: 'High-Protein', expandedPhrase: 'Could you show me high-protein options?', category: 'browsing' },
    
    // Cart & Payment
    { keyword: 'My cart', expandedPhrase: 'Could you show me my cart, please?', category: 'ordering' },
    { keyword: 'Checkout', expandedPhrase: 'I would like to proceed to checkout.', category: 'payment' },
    { keyword: 'Bill', expandedPhrase: 'Could I get the bill, please?', category: 'payment' },
    
    // Discounts
    { keyword: 'Discounts', expandedPhrase: 'Are there any discounts available?', category: 'special' },
    { keyword: 'Vouchers', expandedPhrase: 'What vouchers are available?', category: 'special' },
    
    // Help
    { keyword: 'Help', expandedPhrase: 'Can I get some help, please?', category: 'help' },
  ];
}

/**
 * Get suggested quick actions based on context
 * @param context - Current state like 'browsing', 'cart-empty', 'cart-full', etc.
 */
export function getContextualQuickActions(context: 'initial' | 'browsing' | 'cart-empty' | 'cart-full' | 'ordering'): string[] {
  const actions = {
    initial: [
      'Menu', 'Popular', 'Specials', 
      'Kids Meals', 'Diet Dishes', 'Healthy',
      'Vegetarian', 'Discounts', 'Recommend'
    ],
    browsing: [
      'Schnitzel', 'Kids Meals', 'Light Options',
      'Drinks', 'Desserts', 'Popular', 
      'Vegetarian', 'Salads', 'My cart'
    ],
    'cart-empty': [
      'Menu', 'Popular', 'Specials', 
      'Kids Meals', 'Diet Dishes', 'Lunch Specials',
      'Vegetarian', 'Discounts', 'Recommend'
    ],
    'cart-full': [
      'Bill', 'Desserts', 'Drinks', 
      'Salads', 'Kids Meals', 'Discounts', 
      'Checkout', 'My cart'
    ],
    ordering: [
      'My cart', 'Bill', 'Drinks', 
      'Desserts', 'Salads', 'Kids Meals',
      'Discounts', 'Checkout'
    ]
  };
  
  return actions[context] || actions.initial;
}

export default {
  expandQuickAction,
  getAllQuickActions,
  getContextualQuickActions
};
