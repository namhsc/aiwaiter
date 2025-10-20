# Intelligent AI Chatbot System - Architecture Overview

## 🎯 System Goal
Create an intelligent conversational ordering system that allows customers to order naturally through chat while seamlessly switching between chatbot and traditional menu-based ordering, with all interactions sharing a unified cart.

## 🏗️ Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                     App.tsx (State Manager)              │
│  • Unified Cart State                                    │
│  • Screen Navigation                                     │
│  • Cart Operations (add, update, remove)                │
└──────────┬──────────────────────────────────────────────┘
           │
           ├─────────────────┬──────────────────┬──────────┬──────────────┐
           │                 │                  │          │              │
┌──────────▼────────┐ ┌─────▼──────┐ ┌────────▼────┐ ┌───▼───┐ ┌────────▼────────┐
│  LandingScreen    │ │ MenuScreen │ │AIWaiterChat │ │ Cart  │ │ PaymentScreen   │
│  • Welcome        │ │ • Browse   │ │ • Chat UI   │ │Screen │ │ • Checkout      │
│  • QR Entry       │ │ • Visual   │ │ • NLP       │ │       │ │ • Methods       │
│  • AI Entry ──────┼─┼─ Select   │ │ • Auto-add  │ │       │ │                 │
└───────────────────┘ └────┬───────┘ └──────┬──────┘ └───┬───┘ └─────────────────┘
                           │                 │            │
                     ┌─────▼─────────────────▼────────────▼──────┐
                     │      Floating AI Button (🤵)              │
                     │      • Available on all main screens      │
                     │      • Instant access to chatbot          │
                     │      • Cart preserved across transitions   │
                     └───────────────────────────────────────────┘
                                        │
                     ┌──────────────────▼──────────────────────┐
                     │   /utils/aiResponses.ts                 │
                     │   • Natural Language Processing         │
                     │   • Menu Item Fuzzy Matching            │
                     │   • Quantity Extraction                 │
                     │   • Intelligent Recommendations         │
                     │   • Context-Aware Responses             │
                     └──────────────┬──────────────────────────┘
                                    │
                     ┌──────────────▼──────────────────────────┐
                     │   /data/menuData.ts                     │
                     │   • 16 Menu Items                       │
                     │   • Nutritional Data                    │
                     │   • Allergen Information                │
                     │   • Categories & Pricing                │
                     └─────────────────────────────────────────┘
```

## 🧠 Natural Language Processing Engine

### File: `/utils/aiResponses.ts`

**Key Functions:**

1. **`extractQuantity(message: string): number`**
   - Parses numbers: "2", "3", "10"
   - Understands words: "one", "two", "three"
   - Default: 1 if no quantity specified

2. **`findMenuItems(message: string): MenuItem[]`**
   - Direct name matching: "Wiener Schnitzel"
   - Partial matching: "Schnitzel" → finds "Wiener Schnitzel"
   - Keyword matching: "sausage" → finds "Bratwurst Platter"
   - Returns array of matching items

3. **`hasOrderingIntent(message: string): boolean`**
   - Detects ordering keywords: want, order, add, get me, I'll have
   - Returns true if user is trying to order

4. **`getPairingRecommendations(items: MenuItem[]): MenuItem[]`**
   - Schnitzel → Suggests Riesling Wine, Bavarian Beer
   - Bratwurst → Suggests Bavarian Beer
   - Käsespätzle → Suggests Bavarian Pretzel
   - Returns complementary items

5. **`detectCategory(message: string): string | null`**
   - Identifies category mentions: starter, main, dessert, drinks
   - Returns category or null

6. **`generateAIResponse(userMessage, cart, onAddToCart)`**
   - Main intelligence engine
   - Processes message through multiple pattern matchers
   - Auto-adds items when ordering intent detected
   - Returns response with text, suggested items, and auto-added items

### Response Object Structure

```typescript
{
  text: string;              // AI response message
  suggestedItems?: MenuItem[]; // Items to display as cards
  autoAddedItems?: MenuItem[]; // Items automatically added to cart
}
```

## 🔄 Ordering Flow

### Traditional Menu Ordering
```
User → Browse Menu → Tap Item Card → View Details → Tap "Add to Cart" → Item Added
```

### Chatbot Ordering (Intelligent)
```
User → Type "I want Schnitzel" → AI Detects Intent → Auto-adds to Cart → Suggests Pairing
```

### Hybrid Ordering
```
User → Chat: "Show me desserts" → AI: Displays desserts → User taps card → Item added
```

## 🎨 UI/UX Features

### Chatbot Interface (`/components/AIWaiterChat.tsx`)

**Visual Elements:**
- Message bubbles (user: gold, AI: white)
- Typing indicator (3 animated dots)
- Suggested item cards (tap to add)
- Voice input button (simulated)
- Quick reply buttons
- Auto-scroll to latest message
- Cart counter in header

**Interactions:**
- Text input with Enter key support
- Voice button (simulates recording)
- Quick reply shortcuts
- Item card tap-to-add
- Back navigation
- View cart button

### Floating AI Button

**Available On:**
- Landing Screen
- Menu Screen  
- Cart Screen
- Payment Screen

**Design:**
- Golden circle (#C4941D)
- Waiter emoji (🤵)
- White border
- Green pulse indicator (online status)
- Tap to open chatbot

### Cart Synchronization

All ordering methods share the same cart:
```typescript
// App.tsx - Single source of truth
const [cart, setCart] = useState<CartItem[]>([]);

// Methods passed to all components
addToCart(item: MenuItem)
updateQuantity(itemId: string, newQuantity: number)
removeItem(itemId: string)
```

## 🧩 Integration Points

### Landing → Chat
```typescript
<LandingScreen
  onOpenAI={() => setCurrentScreen('ai-chat')}
/>
```

### Menu ↔ Chat
```typescript
<MenuScreen
  onOpenAI={() => setCurrentScreen('ai-chat')}
  cart={cart}
  onAddToCart={addToCart}
/>

<AIWaiterChat
  onBack={() => setCurrentScreen('menu')}
  cart={cart}
  onAddToCart={addToCart}
/>
```

### Cart ↔ Chat
```typescript
<CartScreen
  cart={cart}
  onOpenAI={() => setCurrentScreen('ai-chat')}
/>
```

### Payment ↔ Chat
```typescript
<PaymentScreen
  onOpenAI={() => setCurrentScreen('ai-chat')}
  onAddMoreItems={() => setCurrentScreen('menu')}
/>
```

## 🤖 Intelligence Features

### 1. **Auto-Adding with Confirmation**
When user says: "I want the Schnitzel"
- AI extracts "Wiener Schnitzel" from message
- Calls `onAddToCart(schnitzel)` automatically
- Responds with confirmation + details
- Suggests pairings

### 2. **Quantity Understanding**
"2 Bavarian Pretzels" → Adds 2x to cart
"I'll have three beers" → Adds 3x to cart

### 3. **Context Awareness**
- Empty cart → Suggests popular items
- Has main, no dessert → Suggests desserts
- Has food, no drink → Suggests beverages
- Complete meal → Offers checkout

### 4. **Smart Recommendations**
- Based on popularity flags in menuData
- Based on current cart contents
- Based on pairing database
- Based on dietary preferences mentioned

### 5. **Dietary Intelligence**
- Filters vegetarian items
- Excludes allergens (gluten, dairy, nuts)
- Shows nutritional information
- Warns about allergens

### 6. **Conversation Memory**
- Remembers cart contents throughout conversation
- Uses cart to inform suggestions
- Tracks ordering progress
- Provides contextual help

## 📊 Data Flow

### User Message → Response
```
1. User types: "I'll have the Schnitzel"
2. AIWaiterChat captures input
3. Calls generateAIResponse(message, cart, onAddToCart)
4. aiResponses.ts processes:
   - hasOrderingIntent("I'll have...") → true
   - findMenuItems("Schnitzel") → [Wiener Schnitzel]
   - extractQuantity("I'll have") → 1
   - onAddToCart(Wiener Schnitzel)
5. Returns response object:
   {
     text: "Excellent choice! Added Wiener Schnitzel...",
     suggestedItems: [Riesling Wine, Bavarian Beer],
     autoAddedItems: [Wiener Schnitzel]
   }
6. AIWaiterChat displays:
   - AI message with confirmation
   - Suggested item cards below
   - Updates cart counter in header
```

### Cart Update Flow
```
Chatbot adds item → onAddToCart() → App.tsx updates cart state →
All screens re-render with new cart → Menu shows updated count →
Cart screen shows new item → Payment calculates new total
```

## 🔍 Pattern Matching Examples

### Greetings
```javascript
lowerMessage.match(/^(hi|hello|hey|good|bonjour)/)
→ Welcome message + quick tips
```

### Menu Requests
```javascript
lowerMessage.match(/menu|what do you have|show me/)
→ Category display or full menu
```

### Recommendations
```javascript
lowerMessage.match(/recommend|suggest|popular|best/)
→ Chef's specials + popular items
```

### Ordering Intent
```javascript
lowerMessage.includes('want') || 
lowerMessage.includes('order') ||
lowerMessage.includes("I'll have")
→ Extract item + auto-add to cart
```

### Dietary
```javascript
lowerMessage.match(/vegetarian|veggie|no meat/)
→ Filter and show vegetarian items
```

### Allergens
```javascript
lowerMessage.match(/gluten|dairy|nut|egg/)
→ Filter safe items + show allergen info
```

## 🎯 Key Design Decisions

### Why Auto-Add?
- **Speed**: Single message to order
- **Convenience**: No extra taps needed
- **Natural**: Mimics human waiter interaction
- **Transparent**: Always confirms what was added

### Why Keep Manual Option?
- **Visual Browsing**: Some prefer to see dishes
- **Detailed Info**: Menu cards show more details
- **Familiar UX**: Traditional ordering comfort
- **Accessibility**: Not everyone wants to chat

### Why Unified Cart?
- **Flexibility**: Mix both ordering methods
- **Consistency**: One source of truth
- **Simplicity**: No cart merging complexity
- **User Confidence**: Clear cart state

### Why Floating Button Everywhere?
- **Accessibility**: Always available
- **Discoverability**: Visible reminder
- **Convenience**: No navigation needed
- **Engagement**: Encourages AI usage

## 📈 Success Metrics

### Speed Metrics
- ✅ Order item in 1 message: "I want Schnitzel"
- ✅ Complete order in <5 messages
- ✅ Get recommendations in 1 message

### Accuracy Metrics
- ✅ Correct item matching (90%+ accuracy)
- ✅ Proper quantity extraction
- ✅ Relevant suggestions
- ✅ Accurate allergen filtering

### UX Metrics
- ✅ Smooth screen transitions
- ✅ Instant cart updates
- ✅ Clear confirmations
- ✅ Helpful error handling

## 🚀 Future Enhancements

### Advanced NLP
- Connect to OpenAI GPT-4 for true AI
- Handle complex multi-item orders
- Understand modifications: "No onions"
- Support multiple languages

### Enhanced Features
- Order history: "My usual order"
- Favorites: "Add my favorites"
- Modifications: "Extra sauce", "Well done"
- Split items: "Separate the pretzel"

### Integration
- Real-time kitchen updates
- Table service calls
- Payment processing
- Loyalty programs

## 📚 Documentation Files

1. **`/guidelines/ChatbotGuide.md`**
   - Complete feature overview
   - How the system works
   - Best practices for users

2. **`/guidelines/ChatbotTestCommands.md`**
   - Test command reference
   - Example conversations
   - Edge cases to test

3. **`/guidelines/IntelligentChatbotArchitecture.md`** (this file)
   - Technical architecture
   - Code organization
   - Design decisions

## 🎓 Summary

The intelligent chatbot system transforms restaurant ordering by:

1. **Understanding Natural Language**: Detects intent and extracts information
2. **Auto-Adding Items**: Instantly adds items to cart when detected
3. **Smart Recommendations**: Context-aware suggestions based on cart
4. **Dietary Intelligence**: Filters by preferences and allergens
5. **Seamless Integration**: Works alongside traditional menu ordering
6. **Unified Experience**: Single cart across all interfaces

**Result**: Customers can order naturally ("I want Schnitzel"), browse visually (menu cards), or mix both methods, all while maintaining a single, synchronized cart throughout their dining experience.
