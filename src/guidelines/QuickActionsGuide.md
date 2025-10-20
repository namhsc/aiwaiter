# Quick Actions System Guide

## Overview

The Quick Actions system provides one-tap ordering and navigation shortcuts that automatically expand into polite, natural restaurant phrases. This creates a seamless user experience where customers can order quickly without typing.

---

## 🎯 How It Works

### The Expansion System

1. **User sees Quick Action button** (e.g., "Menu")
2. **User clicks button**
3. **System expands** keyword into full phrase ("I would like to see the full menu, please.")
4. **Phrase is sent** to AI chatbot
5. **AI responds** with relevant information

```typescript
// Example
User clicks: "Schnitzel"
Expanded to: "I would like to order the Wiener Schnitzel, please."
AI responds: "Excellent choice! Added Wiener Schnitzel to your cart..."
```

---

## 📂 File Structure

### Core Files

1. **`/utils/quickActionExpander.ts`**
   - Main expansion engine
   - 150+ keyword-to-phrase mappings
   - Context-aware action selection
   - Category organization

2. **`/components/AIWaiterChat.tsx`**
   - Quick Action UI display
   - Context-aware button display
   - Integration with chat system

3. **`/utils/aiResponses.ts`**
   - Quick reply keywords list
   - AI response generation

---

## 🔍 Quick Action Categories

### 1. Menu Browsing (15 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Menu** | "I would like to see the full menu, please." |
| **Starters** | "Could you show me your starters and appetizers, please?" |
| **Mains** | "Could you show me your main courses, please?" |
| **Desserts** | "I would like to see your dessert menu, please." |
| **Drinks** | "Can you show me the drinks menu, please?" |
| **Wine** | "Could you show me your wine list, please?" |
| **Beer** | "What beers do you have available?" |

### 2. Recommendations (10 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Popular** | "What are your most popular dishes?" |
| **Recommend** | "What would you recommend?" |
| **Specials** | "What are today's specials?" |
| **Signature** | "What are your signature dishes?" |
| **Best** | "What is your best dish?" |
| **Chef Special** | "What is the chef's special today?" |

### 3. Quick Dish Orders (20+ actions)

| Quick Action | Expands To |
|-------------|------------|
| **Schnitzel** | "I would like to order the Wiener Schnitzel, please." |
| **Bratwurst** | "I would like to order the Bratwurst Platter." |
| **Pretzel** | "Could I get a Bavarian Pretzel, please?" |
| **Sauerbraten** | "Could I get the Sauerbraten, please?" |
| **Spätzle** | "I will have the Käsespätzle." |
| **Kartoffelsalat** | "I would like to order the Kartoffelsalat." |

### 4. Dietary & Allergens (10 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Vegetarian** | "Do you have vegetarian options?" |
| **Vegan** | "Do you have any vegan options?" |
| **Gluten-free** | "Could you show me gluten-free dishes, please?" |
| **Dairy-free** | "What options do you have that are dairy-free?" |
| **Allergens** | "Could you tell me about allergen information?" |

### 5. Cart & Payment (8 actions)

| Quick Action | Expands To |
|-------------|------------|
| **My cart** | "Could you show me my cart, please?" |
| **Checkout** | "I would like to proceed to checkout." |
| **Bill** | "Could I get the bill, please?" |
| **Total** | "What is my total?" |
| **Pay** | "I would like to pay now, please." |

### 6. Discounts & Deals (8 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Discounts** | "Are there any discounts available?" |
| **Vouchers** | "What vouchers are available?" |
| **Promo** | "Do you have any promotional offers?" |
| **Deals** | "Are there any deals or special offers?" |

### 7. Beverages (7 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Coffee** | "I would like a coffee, please." |
| **Water** | "Could I get some water, please?" |
| **Sparkling Water** | "I would like sparkling water." |
| **German Beer** | "What German beers do you have?" |
| **Wheat Beer** | "I would like a Bavarian Wheat Beer." |

### 8. Help & Information (10 actions)

| Quick Action | Expands To |
|-------------|------------|
| **Help** | "Can I get some help, please?" |
| **Hours** | "What are your opening hours?" |
| **Location** | "Where are you located?" |
| **Contact** | "How can I contact you?" |
| **Reservation** | "I would like to make a reservation." |

---

## 🎨 Context-Aware Display

Quick Actions change based on cart state:

### Empty Cart State
```typescript
['Menu', 'Popular', 'Specials', 'Vegetarian', 'Discounts', 'Recommend']
```
**Purpose:** Encourage menu exploration and discovery

### Cart Has Items (1-2 items)
```typescript
['Bill', 'Desserts', 'Drinks', 'Discounts', 'Checkout', 'My cart']
```
**Purpose:** Complete order with complementary items

### Active Ordering (3+ items)
```typescript
['My cart', 'Bill', 'Drinks', 'Desserts', 'Discounts', 'Checkout']
```
**Purpose:** Review cart and proceed to checkout

---

## 💻 Implementation Details

### 1. Quick Action Expansion

```typescript
import { expandQuickAction } from './utils/quickActionExpander';

const userClicks = "Menu";
const expanded = expandQuickAction(userClicks);
// Returns: "I would like to see the full menu, please."
```

### 2. Context-Aware Selection

```typescript
import { getContextualQuickActions } from './utils/quickActionExpander';

// When cart is empty
const actions = getContextualQuickActions('cart-empty');
// Returns: ['Menu', 'Popular', 'Specials', 'Vegetarian', 'Discounts', 'Recommend']

// When cart has items
const actions = getContextualQuickActions('cart-full');
// Returns: ['Bill', 'Desserts', 'Drinks', 'Discounts', 'Checkout', 'My cart']
```

### 3. Integration in Chat Component

```typescript
// In AIWaiterChat.tsx
const handleQuickReply = (reply: string) => {
  // Expand the quick action keyword
  const expandedPhrase = expandQuickAction(reply);
  
  // Send expanded phrase to chat
  handleSendMessage(expandedPhrase);
};

// Get context-aware actions
const getQuickReplies = (): string[] => {
  if (cart.length === 0) {
    return getContextualQuickActions('cart-empty');
  } else if (cart.length > 0 && cart.length < 3) {
    return getContextualQuickActions('cart-full');
  }
  return getContextualQuickActions('ordering');
};
```

---

## 🎯 Usage Examples

### Example 1: First Time User

**User Journey:**
1. Opens chat → Sees: `Menu` `Popular` `Specials` `Vegetarian` `Discounts` `Recommend`
2. Clicks **"Popular"**
3. Expanded: "What are your most popular dishes?"
4. AI shows popular dishes with images
5. User clicks **"Schnitzel"**
6. Expanded: "I would like to order the Wiener Schnitzel, please."
7. AI adds to cart and suggests pairings

### Example 2: Quick Lunch Order

**User Journey:**
1. Clicks **"Menu"** → Sees full menu
2. Clicks **"Bratwurst"** → Added to cart
3. Quick Actions change to: `Bill` `Desserts` `Drinks` `Discounts`
4. Clicks **"Drinks"** → Sees beverage menu
5. Selects beer → Added to cart
6. Clicks **"Bill"** → Proceeds to checkout

### Example 3: Dietary Restrictions

**User Journey:**
1. Clicks **"Vegetarian"**
2. Expanded: "Do you have vegetarian options?"
3. AI filters and shows vegetarian dishes
4. User browses and orders
5. Clicks **"Checkout"** when ready

---

## 🚀 Benefits

### For Users
✅ **Faster ordering** - One tap vs typing full sentences
✅ **No typos** - Pre-validated phrases
✅ **Discover options** - See available actions at a glance
✅ **Context-aware** - Relevant suggestions based on order state
✅ **Professional** - Polite, well-formed phrases

### For Restaurant
✅ **Higher conversion** - Easier to order = more orders
✅ **Better UX** - Professional, intuitive interface
✅ **Reduced errors** - Standardized request format
✅ **Guided experience** - Customers know what to do next
✅ **Mobile-friendly** - Perfect for touch interfaces

---

## 📊 Complete Action List

**Total Quick Actions:** 150+ keyword mappings

**Organized by:**
- Menu Browsing: 15
- Recommendations: 10
- Quick Orders: 20+
- Dietary: 10
- Cart & Payment: 8
- Discounts: 8
- Beverages: 7
- Portions: 8
- Customization: 10
- Help: 10
- Modifications: 10
- Special Occasions: 5
- And more...

---

## 🔧 Customization

### Adding New Quick Actions

1. **Add to expansion mappings** (`quickActionExpander.ts`):
```typescript
const expansions: { [key: string]: string } = {
  // ... existing expansions
  'new-action': 'Expanded polite phrase here.',
};
```

2. **Add to getAllQuickActions()** if it should be visible:
```typescript
{ 
  keyword: 'New Action', 
  expandedPhrase: 'Expanded phrase', 
  category: 'browsing' 
}
```

3. **Update context-aware lists** if needed:
```typescript
'cart-empty': ['Menu', 'Popular', 'New Action']
```

### Adding New Dish Shortcuts

```typescript
'dish-name': 'I would like to order the Dish Name, please.',
'dish-variation': 'I would like to order the Dish Name, please.',
```

---

## 🎨 Visual Design

### Button Styling
- **Shape:** Rounded pills (fully rounded corners)
- **Colors:** White background with gold (#C4941D) borders
- **Hover:** Gradient gold background (from #C4941D to #D4A52D) with white text
- **Shadow:** Subtle shadow on hover
- **Icon:** Sparkles (✨) icon with "Quick Actions" label

### Layout
- **Position:** Fixed at bottom of chat, above input
- **Scroll:** Horizontal scroll for many actions
- **Responsive:** Touch-friendly on mobile
- **Label:** "Quick Actions" with "Tap to send" instruction

---

## 📱 Mobile Optimization

✅ **Touch targets:** 44px minimum height
✅ **Horizontal scroll:** Smooth scrolling
✅ **No wrap:** Buttons don't wrap to new lines
✅ **Clear spacing:** Adequate spacing between buttons
✅ **Fast tap:** Instant response on tap

---

## 🧪 Testing

### Test Basic Expansion
```typescript
import { expandQuickAction } from './utils/quickActionExpander';

console.log(expandQuickAction('Menu'));
// "I would like to see the full menu, please."

console.log(expandQuickAction('Schnitzel'));
// "I would like to order the Wiener Schnitzel, please."
```

### Test Context-Aware Actions
```typescript
import { getContextualQuickActions } from './utils/quickActionExpander';

console.log(getContextualQuickActions('cart-empty'));
// ['Menu', 'Popular', 'Specials', 'Vegetarian', 'Discounts', 'Recommend']
```

### Test in Chat
1. Open AI Chat
2. Verify Quick Action buttons appear
3. Click each action
4. Verify expanded phrase appears as user message
5. Verify AI responds appropriately
6. Add items to cart
7. Verify Quick Actions change

---

## 📈 Success Metrics

**Target Goals:**
- Quick Action usage: >60% of orders
- Expansion accuracy: 100%
- User satisfaction: >90%
- Order completion rate: >85%
- Average time to order: <2 minutes

---

## 💡 Best Practices

### For Users
✅ Use Quick Actions for speed
✅ Combine with typing for specific requests
✅ Watch how actions change with cart
✅ Try different categories

### For Developers
✅ Keep expansions polite and natural
✅ Test all mappings thoroughly
✅ Update context-aware logic
✅ Monitor usage analytics
✅ Add new actions based on user behavior

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Personalized quick actions based on order history
- [ ] Time-based suggestions (breakfast/lunch/dinner)
- [ ] Seasonal quick actions
- [ ] Multi-language support
- [ ] Voice-activated quick actions

### Phase 3
- [ ] AI-generated custom quick actions
- [ ] A/B testing for effectiveness
- [ ] Analytics dashboard
- [ ] Smart recommendations
- [ ] Integration with loyalty program

---

## 📞 Quick Reference

### Most Used Quick Actions

**Browsing:**
- Menu, Starters, Mains, Desserts, Drinks

**Ordering:**
- Schnitzel, Bratwurst, Pretzel

**Dietary:**
- Vegetarian, Vegan, Gluten-free

**Checkout:**
- My cart, Bill, Checkout

**Help:**
- Popular, Recommend, Help

---

## ✅ Implementation Checklist

- [x] Create quickActionExpander.ts
- [x] Implement expansion function (150+ mappings)
- [x] Create context-aware selection
- [x] Integrate with AIWaiterChat.tsx
- [x] Update aiResponses.ts with keywords
- [x] Style Quick Action buttons
- [x] Test expansion accuracy
- [x] Test context switching
- [x] Mobile optimization
- [x] Documentation complete

---

*Quick Actions System - Making ordering effortless!* ✨

*Version: 2.0*
*Last Updated: October 20, 2025*
*Status: ✅ Production Ready*
