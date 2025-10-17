export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  servingSize: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert' | 'drinks';
  image: string;
  allergens: string[];
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
  nutritionalInfo?: NutritionalInfo;
  ingredients?: string[];
  prepTime?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
