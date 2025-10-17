import { MenuItem } from '../types/menu';

export const menuData: MenuItem[] = [
  // Starters
  {
    id: 'st1',
    name: 'Bavarian Pretzel',
    description: 'Traditional soft pretzel served with obatzda cheese dip',
    price: 7.50,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1652689097457-45a35c6dd88d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBwcmV0emVsJTIwYmVlcnxlbnwxfHx8fDE3NjA2MTI1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['gluten', 'dairy'],
    vegetarian: true,
    popular: true,
    nutritionalInfo: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 14,
      fiber: 3,
      sodium: 680,
      servingSize: '200g (1 pretzel + dip)'
    },
    ingredients: ['Wheat flour', 'Obatzda cheese', 'Butter', 'Salt', 'Yeast'],
    prepTime: '8 mins'
  },
  {
    id: 'st2',
    name: 'Kartoffelsalat',
    description: 'Classic German potato salad with bacon and mustard vinaigrette',
    price: 6.90,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1593895648796-9139c6bee45c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG8lMjBzYWxhZHxlbnwxfHx8fDE3NjA2MTI1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['mustard'],
    nutritionalInfo: {
      calories: 290,
      protein: 8,
      carbs: 35,
      fat: 12,
      fiber: 4,
      sodium: 520,
      servingSize: '250g'
    },
    ingredients: ['Potatoes', 'Bacon', 'Onions', 'Mustard', 'Vinegar', 'Parsley'],
    prepTime: '5 mins'
  },
  {
    id: 'st3',
    name: 'Flammkuchen',
    description: 'Alsatian flatbread with crème fraîche, onions, and bacon',
    price: 9.50,
    category: 'starter',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    allergens: ['gluten', 'dairy'],
    nutritionalInfo: {
      calories: 420,
      protein: 14,
      carbs: 42,
      fat: 18,
      fiber: 2,
      sodium: 740,
      servingSize: '300g (1 flatbread)'
    },
    ingredients: ['Flatbread dough', 'Crème fraîche', 'Onions', 'Bacon', 'Chives'],
    prepTime: '12 mins'
  },
  
  // Main Courses
  {
    id: 'mn1',
    name: 'Wiener Schnitzel',
    description: 'Breaded veal cutlet served with potato salad and lingonberry jam',
    price: 18.90,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBzY2huaXR6ZWwlMjBwbGF0ZXxlbnwxfHx8fDE3NjA2MTI1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['gluten', 'eggs'],
    popular: true,
    nutritionalInfo: {
      calories: 680,
      protein: 42,
      carbs: 52,
      fat: 28,
      fiber: 4,
      sodium: 890,
      servingSize: '450g'
    },
    ingredients: ['Veal cutlet', 'Breadcrumbs', 'Eggs', 'Potatoes', 'Lingonberry jam', 'Lemon'],
    prepTime: '20 mins'
  },
  {
    id: 'mn2',
    name: 'Bratwurst Platter',
    description: 'Three grilled Nuremberg sausages with sauerkraut and mustard',
    price: 15.50,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1547424450-75ec164925ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBzYXVzYWdlJTIwYnJhdHd1cnN0fGVufDF8fHx8MTc2MDYxMjU3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['mustard'],
    nutritionalInfo: {
      calories: 620,
      protein: 28,
      carbs: 18,
      fat: 46,
      fiber: 6,
      sodium: 1420,
      servingSize: '380g'
    },
    ingredients: ['Nuremberg sausages', 'Sauerkraut', 'Mustard', 'Onions', 'Caraway seeds'],
    prepTime: '15 mins'
  },
  {
    id: 'mn3',
    name: 'Rinderrouladen',
    description: 'Beef rolls stuffed with bacon, onions, and pickles in rich gravy',
    price: 22.90,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1733700469173-15d46efc2c09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwcm91bGFkZW4lMjBtZWF0fGVufDF8fHx8MTc2MDYxMjU3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: [],
    popular: true,
    nutritionalInfo: {
      calories: 580,
      protein: 38,
      carbs: 24,
      fat: 34,
      fiber: 3,
      sodium: 1120,
      servingSize: '400g'
    },
    ingredients: ['Beef rolls', 'Bacon', 'Onions', 'Pickles', 'Beef gravy', 'Red cabbage'],
    prepTime: '25 mins'
  },
  {
    id: 'mn4',
    name: 'Spätzle mit Käse',
    description: 'Traditional egg noodles with melted cheese and crispy onions',
    price: 14.50,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    allergens: ['gluten', 'eggs', 'dairy'],
    vegetarian: true,
    nutritionalInfo: {
      calories: 540,
      protein: 24,
      carbs: 62,
      fat: 22,
      fiber: 3,
      sodium: 820,
      servingSize: '350g'
    },
    ingredients: ['Egg noodles', 'Emmental cheese', 'Crispy onions', 'Butter', 'Chives'],
    prepTime: '18 mins'
  },
  {
    id: 'mn5',
    name: 'Sauerbraten',
    description: 'Marinated pot roast with red cabbage and potato dumplings',
    price: 21.90,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400',
    allergens: [],
    nutritionalInfo: {
      calories: 720,
      protein: 44,
      carbs: 58,
      fat: 32,
      fiber: 5,
      sodium: 980,
      servingSize: '480g'
    },
    ingredients: ['Marinated beef', 'Red cabbage', 'Potato dumplings', 'Gravy', 'Vinegar', 'Spices'],
    prepTime: '30 mins'
  },
  
  // Desserts
  {
    id: 'ds1',
    name: 'Black Forest Cake',
    description: 'Chocolate sponge cake with cherries and whipped cream',
    price: 8.50,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZvcmVzdCUyMGNha2V8ZW58MXx8fHwxNzYwNTEwNTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['gluten', 'eggs', 'dairy'],
    popular: true,
    nutritionalInfo: {
      calories: 420,
      protein: 6,
      carbs: 54,
      fat: 22,
      fiber: 2,
      sodium: 280,
      servingSize: '150g (1 slice)'
    },
    ingredients: ['Chocolate cake', 'Cherries', 'Whipped cream', 'Kirsch liqueur', 'Dark chocolate'],
    prepTime: '10 mins'
  },
  {
    id: 'ds2',
    name: 'Apfelstrudel',
    description: 'Apple strudel with vanilla sauce and powdered sugar',
    price: 7.90,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1708782343593-c89fbb1e176c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcHBsZSUyMHN0cnVkZWwlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MDYxMTMyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['gluten', 'dairy'],
    nutritionalInfo: {
      calories: 340,
      protein: 4,
      carbs: 48,
      fat: 14,
      fiber: 3,
      sodium: 180,
      servingSize: '180g'
    },
    ingredients: ['Apples', 'Phyllo pastry', 'Raisins', 'Cinnamon', 'Vanilla sauce', 'Powdered sugar'],
    prepTime: '12 mins'
  },
  {
    id: 'ds3',
    name: 'Kaiserschmarrn',
    description: 'Shredded pancake with plum compote and powdered sugar',
    price: 9.50,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    allergens: ['gluten', 'eggs', 'dairy'],
    nutritionalInfo: {
      calories: 480,
      protein: 12,
      carbs: 64,
      fat: 18,
      fiber: 4,
      sodium: 320,
      servingSize: '220g'
    },
    ingredients: ['Eggs', 'Flour', 'Milk', 'Butter', 'Plum compote', 'Powdered sugar'],
    prepTime: '15 mins'
  },
  
  // Drinks
  {
    id: 'dr1',
    name: 'Bavarian Wheat Beer',
    description: 'Traditional Weissbier (0.5L)',
    price: 5.90,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1735057547306-c3c872689ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBiZWVyJTIwc3RlaW58ZW58MXx8fHwxNzYwNjEyNTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    allergens: ['gluten'],
    popular: true,
    nutritionalInfo: {
      calories: 180,
      protein: 2,
      carbs: 16,
      fat: 0,
      fiber: 0,
      sodium: 12,
      servingSize: '500ml'
    },
    ingredients: ['Water', 'Barley malt', 'Wheat malt', 'Hops', 'Yeast'],
    prepTime: '2 mins'
  },
  {
    id: 'dr2',
    name: 'Riesling Wine',
    description: 'German white wine from Mosel Valley (Glass)',
    price: 6.50,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
    allergens: ['sulfites'],
    nutritionalInfo: {
      calories: 120,
      protein: 0,
      carbs: 4,
      fat: 0,
      fiber: 0,
      sodium: 8,
      servingSize: '150ml'
    },
    ingredients: ['Riesling grapes', 'Sulfites'],
    prepTime: '2 mins'
  },
  {
    id: 'dr3',
    name: 'Apfelschorle',
    description: 'Apple juice mixed with sparkling water',
    price: 3.90,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    allergens: [],
    nutritionalInfo: {
      calories: 60,
      protein: 0,
      carbs: 14,
      fat: 0,
      fiber: 0,
      sodium: 6,
      servingSize: '300ml'
    },
    ingredients: ['Apple juice', 'Sparkling water'],
    prepTime: '1 min'
  },
  {
    id: 'dr4',
    name: 'German Hot Chocolate',
    description: 'Rich hot chocolate with whipped cream',
    price: 4.50,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=400',
    allergens: ['dairy'],
    nutritionalInfo: {
      calories: 280,
      protein: 8,
      carbs: 32,
      fat: 14,
      fiber: 2,
      sodium: 140,
      servingSize: '250ml'
    },
    ingredients: ['Dark chocolate', 'Milk', 'Whipped cream', 'Sugar', 'Vanilla'],
    prepTime: '5 mins'
  }
];
