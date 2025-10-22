/**
 * Quick Action Expander
 * Converts short quick action keywords into polite full phrases
 * Only includes mappings actively used in the UI
 */

export interface QuickAction {
  keyword: string;
  expandedPhrase: string;
  category: 'browsing' | 'ordering' | 'payment' | 'special' | 'help';
}

/**
 * Core phrase mappings for Quick Actions displayed in UI
 * Organized by category for easy maintenance
 */
const phraseMapping: { [key: string]: string } = {
  // === BROWSING ACTIONS ===
  // Menu Categories
  'menu': 'I would like to see the full menu, please.',
  'starters': 'Could you show me your starters and appetizers, please?',
  'mains': 'Could you show me your main courses, please?',
  'main courses': 'Could you show me the main courses, please?',
  'desserts': 'I would like to see your dessert menu, please.',
  'dessert': 'Could you show me your desserts?',
  'drinks': 'Can you show me the drinks menu, please?',
  
  // Special Categories
  'kids meals': 'What meals do you have for kids?',
  'diet dishes': 'Could you show me your diet-friendly and healthy options?',
  'healthy': 'I would like to see your healthy options.',
  'light options': 'Could you show me lighter options, please?',
  'salads': 'What salad options do you have?',
  'vegetarian': 'Do you have vegetarian options?',
  'gluten-free': 'Could you show me gluten-free dishes, please?',
  
  // === RECOMMENDATION ACTIONS ===
  'popular': 'What are your most popular dishes?',
  'best seller': 'What are your best selling dishes?',
  'specials': 'What are today\'s specials?',
  'recommend': 'What would you recommend?',
  
  // === ORDERING ACTIONS ===
  // Quick Dish Orders
  'schnitzel': 'I would like to order the Wiener Schnitzel, please.',
  
  // Cart & Order Management
  'my cart': 'Could you show me my cart, please?',
  
  // === PAYMENT ACTIONS ===
  'bill': 'Could I get the bill, please?',
  'checkout': 'I would like to proceed to checkout.',
  
  // === SPECIAL OFFERS ===
  'discount': 'Do you have any current discounts?',
  'discounts': 'Are there any discounts available?',
  
};

/**
 * Expands a quick action keyword into a polite full phrase
 * @param action - The quick action keyword (e.g., "Desserts", "Bill")
 * @returns The expanded polite phrase
 */
export function expandQuickAction(action: string): string {
  const lowerAction = action.toLowerCase().trim();
  
  // Direct mapping lookup
  if (phraseMapping[lowerAction]) {
    return phraseMapping[lowerAction];
  }
  
  // If no match found, return the original with basic formatting
  // Capitalize first letter and add period if missing
  const formatted = lowerAction.charAt(0).toUpperCase() + lowerAction.slice(1);
  return formatted.endsWith('?') || formatted.endsWith('.') ? formatted : formatted + '.';
}

/**
 * Get all available quick actions organized by category
 * Only includes actions actively used in the UI
 */
export function getAllQuickActions(): QuickAction[] {
  return [
    // Browsing Actions
    { keyword: 'Menu', expandedPhrase: 'I would like to see the full menu, please.', category: 'browsing' },
    { keyword: 'Starters', expandedPhrase: 'Could you show me your starters and appetizers, please?', category: 'browsing' },
    { keyword: 'Mains', expandedPhrase: 'Could you show me your main courses, please?', category: 'browsing' },
    { keyword: 'Desserts', expandedPhrase: 'I would like to see your dessert menu, please.', category: 'browsing' },
    { keyword: 'Drinks', expandedPhrase: 'Can you show me the drinks menu, please?', category: 'browsing' },
    { keyword: 'Kids Meals', expandedPhrase: 'What meals do you have for kids?', category: 'browsing' },
    { keyword: 'Diet Dishes', expandedPhrase: 'Could you show me your diet-friendly and healthy options?', category: 'browsing' },
    { keyword: 'Healthy', expandedPhrase: 'I would like to see your healthy options.', category: 'browsing' },
    { keyword: 'Light Options', expandedPhrase: 'Could you show me lighter options, please?', category: 'browsing' },
    { keyword: 'Salads', expandedPhrase: 'What salad options do you have?', category: 'browsing' },
    { keyword: 'Vegetarian', expandedPhrase: 'Do you have vegetarian options?', category: 'browsing' },
    { keyword: 'Gluten-free', expandedPhrase: 'Could you show me gluten-free dishes, please?', category: 'browsing' },
    
    // Recommendation Actions
    { keyword: 'Popular', expandedPhrase: 'What are your most popular dishes?', category: 'browsing' },
    { keyword: 'Best Seller', expandedPhrase: 'What are your best selling dishes?', category: 'special' },
    { keyword: 'Specials', expandedPhrase: 'What are today\'s specials?', category: 'special' },
    { keyword: 'Recommend', expandedPhrase: 'What would you recommend?', category: 'browsing' },
    
    // Quick Ordering
    { keyword: 'Schnitzel', expandedPhrase: 'I would like to order the Wiener Schnitzel, please.', category: 'ordering' },
    
    // Cart & Payment
    { keyword: 'My cart', expandedPhrase: 'Could you show me my cart, please?', category: 'ordering' },
    { keyword: 'Bill', expandedPhrase: 'Could I get the bill, please?', category: 'payment' },
    { keyword: 'Checkout', expandedPhrase: 'I would like to proceed to checkout.', category: 'payment' },
    
    // Special Offers
    { keyword: 'Discount', expandedPhrase: 'Do you have any current discounts?', category: 'special' },
  ];
}

/**
 * Get suggested quick actions based on context
 * These are displayed in the contextual quick actions section
 * @param context - Current state like 'browsing', 'cart-empty', 'cart-full', etc.
 */
export function getContextualQuickActions(context: 'initial' | 'browsing' | 'cart-empty' | 'cart-full' | 'ordering'): string[] {
  const actions = {
    initial: [
      'Menu', 'Popular', 'Specials', 
      'Kids Meals', 'Diet Dishes', 'Healthy',
      'Vegetarian', 'Discount', 'Recommend'
    ],
    browsing: [
      'Schnitzel', 'Kids Meals', 'Light Options',
      'Drinks', 'Desserts', 'Popular', 
      'Vegetarian', 'Salads', 'My cart'
    ],
    'cart-empty': [
      'Menu', 'Popular', 'Specials', 
      'Kids Meals', 'Diet Dishes',
      'Vegetarian', 'Discount', 'Recommend'
    ],
    'cart-full': [
      'Bill', 'Desserts', 'Drinks', 
      'Salads', 'Kids Meals', 'Discount', 
      'Checkout', 'My cart'
    ],
    ordering: [
      'My cart', 'Bill', 'Drinks', 
      'Desserts', 'Salads', 'Kids Meals',
      'Discount', 'Checkout'
    ]
  };
  
  return actions[context] || actions.initial;
}

/**
 * Get special note quick actions (dietary, special needs, kids, etc.)
 * Displayed in the "Special Notes" section with sticky note icon
 */
export function getSpecialNoteActions(context: 'initial' | 'browsing' | 'cart-empty' | 'cart-full' | 'ordering'): string[] {
  const actions = {
    initial: ['Kids Meals', 'Diet Dishes', 'Vegetarian', 'Gluten-free', 'Allergies'],
    browsing: ['Kids Meals', 'Vegetarian', 'Light Options', 'Salads', 'Allergies'],
    'cart-empty': ['Kids Meals', 'Diet Dishes', 'Vegetarian', 'Healthy', 'Allergies'],
    'cart-full': ['Kids Meals', 'Salads', 'Light Options', 'Gluten-free', 'Allergies'],
    ordering: ['Kids Meals', 'Salads', 'Vegetarian', 'Light Options', 'Allergies']
  };
  
  return actions[context] || actions.initial;
}

/**
 * Get recommendation quick actions (popular, specials, best, etc.)
 * Displayed in the "Recommend" section with sparkles icon
 */
export function getRecommendActions(context: 'initial' | 'browsing' | 'cart-empty' | 'cart-full' | 'ordering'): string[] {
  const actions = {
    initial: ['Popular', 'Best Seller', 'Specials', 'Discount', 'Recommend'],
    browsing: ['Popular', 'Best Seller', 'Schnitzel', 'Desserts', 'Discount'],
    'cart-empty': ['Popular', 'Best Seller', 'Specials', 'Discount', 'Recommend'],
    'cart-full': ['Desserts', 'Drinks', 'Discount', 'Bill', 'Checkout'],
    ordering: ['Desserts', 'Drinks', 'Discount', 'Bill', 'Checkout']
  };
  
  return actions[context] || actions.initial;
}

export default {
  expandQuickAction,
  getAllQuickActions,
  getContextualQuickActions,
  getSpecialNoteActions,
  getRecommendActions
};
