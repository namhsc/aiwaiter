# AI Chatbot Test Commands

Quick reference for testing the intelligent chatbot ordering system.

## 🎯 Instant Ordering (Auto-adds to cart)

```
I want the Wiener Schnitzel
I'll have the Bratwurst
Give me 2 Bavarian Pretzels
Add Black Forest Cake
Can I get the Riesling Wine?
I'll take 3 pretzels please
Order the Käsespätzle
```

## 📋 Menu Browsing

```
Show me the menu
What do you have?
Show me starters
What desserts are available?
Display the drinks menu
Show me main courses
What's on the menu?
```

## ⭐ Recommendations

```
What do you recommend?
What's popular?
What's your best dish?
Chef's recommendations
What's special today?
What's your signature dish?
```

## 🌱 Dietary Filtering

```
Show me vegetarian options
What's vegetarian?
I'm vegetarian
Do you have vegan options?
What can I eat if I'm vegetarian?
```

## 🏥 Allergen Queries

```
I'm allergic to gluten
Show me gluten-free options
What's dairy-free?
Is the Schnitzel gluten-free?
I have a nut allergy
What allergens are in the Bratwurst?
```

## 🍷 Pairing Requests

```
What pairs with Schnitzel?
Wine pairing suggestions
What drink goes with this?
Recommend a beverage
What beer do you suggest?
```

## 📊 Information Requests

```
Tell me about the Schnitzel
What's in the Black Forest Cake?
How much is the Bratwurst?
What are the calories in Schnitzel?
Describe the Sauerbraten
What's the price range?
```

## 🛒 Cart Management

```
What's in my cart?
Show my order
Check my cart
What did I order?
How much is my total?
What's my order total?
```

## 🎤 Voice Input Test
Click the microphone button - it will simulate one of these commands:
- "I'd like to order the Wiener Schnitzel please"
- "Can I have two Bavarian Pretzels?"
- "Add the Black Forest Cake to my order"
- "What do you recommend for dinner?"
- "Show me vegetarian options"

## 🔢 Quantity Testing

```
I want 2 Schnitzels
Give me three pretzels
I'll have 5 beers
Can I get four cakes?
Two Bratwurst please
```

## 💬 Conversation Flow Test

**Complete Order Flow:**
```
1. "Hi" → Welcome message
2. "What do you recommend?" → Shows recommendations
3. "I'll have the Schnitzel" → Auto-adds, suggests pairing
4. "Add the Riesling" → Auto-adds wine
5. "What's in my cart?" → Shows items + total
6. "I want dessert" → Shows dessert options
7. "Add Black Forest Cake" → Auto-adds cake
8. "That's all" → Ready for checkout
```

**Dietary Order Flow:**
```
1. "Hello" → Welcome
2. "I'm vegetarian" → Shows veggie options
3. "Tell me about the Käsespätzle" → Detailed info
4. "I'll take it" → Auto-adds
5. "What pairs with this?" → Pairing suggestions
6. "Add the wheat beer" → Auto-adds beer
7. "My cart please" → Shows order
```

**Allergen-Safe Flow:**
```
1. "Hi" → Welcome
2. "I'm allergic to gluten" → Shows gluten-free options
3. "What's the Hungarian Goulash?" → Dish details
4. "Add it to my order" → Auto-adds
5. "Show me gluten-free desserts" → Filtered desserts
6. "I'll have the Tiramisu" → Auto-adds (if gluten-free)
```

## 🚀 Quick Replies (Tap buttons)

- **"Show menu"** → Full menu display
- **"I want Schnitzel"** → Instant add Schnitzel
- **"What's popular?"** → Popular recommendations
- **"Vegetarian options"** → Filtered vegetarian
- **"My cart"** → Cart summary

## 🔄 Switching Methods

### Chat → Menu:
```
1. Add items via chat: "I want Schnitzel"
2. Tap back arrow
3. Browse menu visually
4. Tap "Add to Cart" on any dish
5. Items from both methods in same cart
```

### Menu → Chat:
```
1. Browse menu, add items normally
2. Tap floating AI button (🤵)
3. Chat opens with cart preserved
4. Continue ordering via chat
5. "What else should I order?" for suggestions
```

## 💡 Pro Tips

**Natural Phrases:**
- "I want..." ✅
- "I'll have..." ✅
- "Add..." ✅
- "Can I get..." ✅
- "Give me..." ✅

**Partial Names Work:**
- "Schnitzel" → Finds Wiener Schnitzel
- "Pretzel" → Finds Bavarian Pretzel
- "Black Forest" → Finds Black Forest Cake
- "Beer" → Finds Bavarian Wheat Beer
- "Wine" → Finds Riesling Wine

**Smart Suggestions:**
- Order main dish → AI suggests drinks
- Have mains + drinks → AI suggests desserts
- Empty cart → AI suggests popular items
- Ask about pairing → AI analyzes cart

## ❌ Edge Cases to Test

```
"Something spicy" → AI explains German cuisine isn't spicy
"Chicken" → AI will try to find chicken dishes
"Cheapest option" → AI shows price ranges
"Most expensive" → AI discusses pricing
"Tell me about the chef" → AI shares chef info
"What's taking so long?" → Conversational response
"I changed my mind" → AI helps modify order
"Thank you" → Polite acknowledgment
```

## 📱 Multi-Screen Testing

1. **Landing Screen** → Tap AI button → Opens chat
2. **Menu Screen** → Tap AI button → Opens chat with cart
3. **Cart Screen** → Tap AI button → Chat for modifications
4. **Payment Screen** → Tap AI button → Chat for questions

All screens maintain cart state across transitions.

## 🎨 Visual Feedback

When chatbot auto-adds items:
- ✅ Green text in response
- Item card displays below message  
- Tap card to add more
- Cart counter updates in header
- Pairing suggestions shown

## 📈 Success Metrics

**Good UX:**
- User can order in <3 messages
- Natural language understood correctly
- Suggestions are relevant
- Cart updates instantly
- Smooth screen transitions

**Test Each:**
- ✅ Direct ordering
- ✅ Menu browsing
- ✅ Recommendations
- ✅ Dietary filtering
- ✅ Cart checking
- ✅ Pairing suggestions
- ✅ Voice input
- ✅ Quick replies
- ✅ Screen switching

---

**Happy Testing! 🎉**

The chatbot is designed to understand natural language and make ordering effortless. Try conversational phrases and watch it intelligently respond and add items to your cart!
