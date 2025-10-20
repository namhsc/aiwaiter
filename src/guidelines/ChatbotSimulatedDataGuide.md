# Chatbot Simulated Data Guide

## Overview

This guide explains the comprehensive simulated data system created to improve the AI chatbot's understanding of user intent in a German restaurant context.

---

## 📂 Files Created

### 1. `/data/chatbotTrainingData.ts`
**Purpose:** Core training data with intent definitions, entity patterns, and response templates

**Contains:**
- **Intent Definitions** (14 intents)
- **135+ Training Examples** organized by intent
- **Entity Extraction Patterns** (dishes, quantities, dietary, modifications)
- **Response Templates** for natural conversation
- **Common User Patterns** for ordering, browsing, information

**Key Intents Covered:**
- `ORDER_DISH` - User wants to order
- `VIEW_MENU` - Show menu categories
- `GET_RECOMMENDATIONS` - Ask for suggestions
- `DIETARY_QUERY` - Dietary restrictions
- `DISH_INFO` - Information about dishes
- `WINE_PAIRING` - Pairing suggestions
- `VIEW_CART` - Check order
- `CHECKOUT` - Proceed to payment
- `MODIFY_ORDER` - Customize order
- `ALLERGEN_INFO` - Allergen questions
- `GREETING` - Initial contact
- `HELP` - Customer needs assistance
- `SPECIAL_OCCASION` - Birthday, celebration
- `COMPLIMENT/COMPLAINT` - Feedback

---

### 2. `/utils/intentRecognizer.ts`
**Purpose:** Intent recognition engine that processes user input

**Key Functions:**

#### `recognizeIntent(userInput: string): RecognizedIntent`
Main function that analyzes user input and returns:
```typescript
{
  intent: string,           // e.g., "ORDER_DISH"
  confidence: number,       // 0.0 to 1.0
  entities: {
    dishName?: string,
    dishId?: string,
    quantity?: number,
    category?: string,
    dietary?: string,
    modification?: string
  },
  matchedDish?: MenuItem
}
```

#### `extractQuantity(input: string): number`
Extracts quantities from text:
- "2 pretzels" → 2
- "a couple of schnitzels" → 2
- "one beer" → 1

#### `extractDishName(input: string): { dish: MenuItem | null; confidence: number }`
Finds menu items in text:
- "I want the Schnitzel" → Wiener Schnitzel (100%)
- "Give me some sausages" → Bratwurst Platter (90%)
- "That noodle thing" → Käsespätzle (60%)

#### `extractCategory(input: string): string | null`
Identifies menu categories:
- "Show me starters" → "starter"
- "What desserts do you have?" → "dessert"

#### `extractDietary(input: string): string | null`
Detects dietary preferences:
- "I'm vegetarian" → "vegetarian"
- "gluten-free options" → "gluten-free"

#### `extractModifications(input: string): string[]`
Captures order customizations:
- "no onions" → ["no onions"]
- "extra crispy" → ["extra crispy"]
- "without cheese" → ["no cheese"]

---

### 3. `/data/simulatedConversations.ts`
**Purpose:** 10 realistic conversation scenarios for testing

**Scenarios Included:**

1. **First-time Visitor** - New customer exploring menu
2. **Vegetarian Customer** - Dietary restrictions
3. **Quick Lunch Order** - Fast service needed
4. **Birthday Celebration** - Special occasion, family meal
5. **Picky Eater** - Multiple modifications
6. **Wine Pairing** - Beverage recommendations
7. **Gluten-Free Customer** - Allergen concerns
8. **Price-Conscious** - Budget questions, discounts
9. **Confused Customer** - Needs guidance
10. **Cart Management** - Adding/removing items

**Edge Cases:**
- Vague requests ("something good")
- Misspelled dishes ("snitzel")
- Multiple requests in one message
- Contradictory requests (changing mind)

---

## 🎯 How to Use This Data

### For Training the Chatbot

1. **Import the Intent Recognizer:**
```typescript
import { recognizeIntent } from './utils/intentRecognizer';

const userMessage = "I'll have 2 schnitzels";
const result = recognizeIntent(userMessage);

console.log(result);
// {
//   intent: "ORDER_DISH",
//   confidence: 0.9,
//   entities: {
//     dishName: "Wiener Schnitzel",
//     dishId: "mn1",
//     quantity: 2
//   },
//   matchedDish: { ... }
// }
```

2. **Use Training Examples:**
```typescript
import { trainingData } from './data/chatbotTrainingData';

// Filter by intent
const orderingExamples = trainingData.filter(
  ex => ex.intent === 'ORDER_DISH'
);

// Test against examples
trainingData.forEach(example => {
  const result = recognizeIntent(example.userInput);
  console.log(`Expected: ${example.intent}, Got: ${result.intent}`);
});
```

3. **Test Entity Extraction:**
```typescript
import { 
  extractQuantity, 
  extractDishName,
  extractModifications 
} from './utils/intentRecognizer';

const text = "I want 2 schnitzels without onions";

console.log(extractQuantity(text));        // 2
console.log(extractDishName(text));        // Wiener Schnitzel
console.log(extractModifications(text));   // ["no onions"]
```

---

### For Testing Conversations

1. **Run Simulated Conversations:**
```typescript
import { simulatedConversations } from './data/simulatedConversations';

simulatedConversations.forEach(conversation => {
  console.log(`Testing: ${conversation.scenario}`);
  
  conversation.turns.forEach(turn => {
    if (turn.speaker === 'user') {
      const result = recognizeIntent(turn.message);
      
      const passed = result.intent === turn.expectedIntent;
      console.log(`✓ ${passed ? 'PASS' : 'FAIL'}: ${turn.message}`);
    }
  });
});
```

2. **Calculate Coverage:**
```typescript
import { calculateMetrics } from './data/simulatedConversations';

const metrics = calculateMetrics();
console.log(`
  Total Conversations: ${metrics.totalConversations}
  Total Turns: ${metrics.totalTurns}
  Intents Covered: ${metrics.intentCoverage.length}
  Avg Turns/Conversation: ${metrics.averageTurnsPerConversation}
`);
```

---

### Integrating with AI Response System

Update your `aiResponses.ts` to use intent recognition:

```typescript
import { recognizeIntent } from './utils/intentRecognizer';

export const generateAIResponse = (
  userMessage: string,
  cart: any[]
) => {
  // Step 1: Recognize intent
  const intent = recognizeIntent(userMessage);
  
  // Step 2: Handle based on intent
  switch (intent.intent) {
    case 'ORDER_DISH':
      if (intent.matchedDish) {
        // Add to cart logic
        return {
          text: `Perfect! I've added ${intent.matchedDish.name} to your cart.`,
          suggestedItems: [intent.matchedDish]
        };
      }
      break;
      
    case 'VIEW_MENU':
      return {
        text: "Here's our full menu!",
        suggestedItems: menuData
      };
      
    case 'GET_RECOMMENDATIONS':
      const popular = menuData.filter(item => item.popular);
      return {
        text: "Our most popular dishes are:",
        suggestedItems: popular
      };
      
    case 'DIETARY_QUERY':
      if (intent.entities.dietary === 'vegetarian') {
        const veggie = menuData.filter(item => item.vegetarian);
        return {
          text: "Here are our vegetarian options:",
          suggestedItems: veggie
        };
      }
      break;
      
    // ... handle other intents
  }
};
```

---

## 🧪 Testing Checklist

### Intent Recognition Accuracy
- [ ] ORDER_DISH correctly identifies dish orders
- [ ] Handles variations ("schnitzel", "wiener schnitzel", "veal cutlet")
- [ ] Extracts correct quantities (1, 2, "a couple", etc.)
- [ ] VIEW_MENU triggers on "show menu", "see menu", etc.
- [ ] DIETARY_QUERY catches vegetarian, vegan, gluten-free
- [ ] MODIFY_ORDER detects "no X", "extra Y", "without Z"
- [ ] CHECKOUT recognized from "bill", "pay", "checkout"

### Entity Extraction
- [ ] Dish names matched correctly (with fuzzy matching)
- [ ] Quantities extracted (numeric and word forms)
- [ ] Categories identified (starter, main, dessert, drinks)
- [ ] Modifications captured (all "no X" patterns)
- [ ] Dietary preferences detected
- [ ] Special occasions recognized

### Conversation Flow
- [ ] All 10 scenarios complete successfully
- [ ] Edge cases handled gracefully
- [ ] Context maintained across turns
- [ ] Appropriate responses generated

### Response Quality
- [ ] Responses match intent
- [ ] Natural, conversational tone
- [ ] Relevant suggestions provided
- [ ] Errors handled politely

---

## 📊 Training Data Statistics

### Coverage
- **Total Training Examples:** 135+
- **Unique Intents:** 14
- **Dish Variations:** 40+ (multiple ways to say each dish)
- **Quantity Patterns:** 15+ ways to specify amounts
- **Dietary Keywords:** 20+ dietary-related terms
- **Modification Patterns:** 30+ customization phrases

### Intent Distribution
```
ORDER_DISH:           25 examples
VIEW_MENU:           10 examples
GET_RECOMMENDATIONS: 15 examples
DIETARY_QUERY:       12 examples
DISH_INFO:           15 examples
PRICE_QUERY:         8 examples
WINE_PAIRING:        8 examples
VIEW_CART:           6 examples
CHECKOUT:            8 examples
MODIFY_ORDER:        10 examples
GREETING:            8 examples
HELP:                5 examples
SPECIAL_OCCASION:    3 examples
COMPLIMENT:          2 examples
```

---

## 🎓 Best Practices

### When Adding New Training Data
1. Cover multiple phrasings of same intent
2. Include common misspellings
3. Test edge cases (vague, ambiguous)
4. Add both formal and casual language
5. Include real customer language patterns

### When Testing
1. Test each intent independently
2. Run full conversation scenarios
3. Check confidence scores (should be >0.7)
4. Verify entity extraction accuracy
5. Test with real user inputs

### When Updating Intent Recognition
1. Add new patterns to entity extraction
2. Update training examples
3. Test against existing scenarios
4. Monitor confidence scores
5. Refine patterns based on failures

---

## 🔧 Customization Guide

### Adding a New Intent

1. **Define the Intent** in `chatbotTrainingData.ts`:
```typescript
export const intentDefinitions = {
  // ... existing intents
  NEW_INTENT: 'Description of when this intent applies'
};
```

2. **Add Training Examples:**
```typescript
{
  userInput: "Example user message",
  intent: 'NEW_INTENT',
  entities: { /* relevant entities */ },
  expectedResponse: "Expected bot response"
}
```

3. **Update Intent Recognizer** in `intentRecognizer.ts`:
```typescript
// Add pattern matching
if (/keyword|pattern/i.test(lowerInput)) {
  result.intent = 'NEW_INTENT';
  result.confidence = 0.9;
  return result;
}
```

4. **Add Response Handler** in your AI response system:
```typescript
case 'NEW_INTENT':
  return {
    text: "Appropriate response",
    // ... additional data
  };
```

5. **Create Test Conversation** in `simulatedConversations.ts`

---

### Adding New Dish Variations

In `chatbotTrainingData.ts`:
```typescript
dishes: {
  'Dish Name': [
    'variation1',
    'variation2',
    'common_misspelling'
  ]
}
```

---

## 📈 Success Metrics

Track these metrics to measure chatbot performance:

1. **Intent Recognition Accuracy:** >90% for common intents
2. **Entity Extraction Accuracy:** >85% for dishes, quantities
3. **Conversation Completion Rate:** >95% scenarios complete
4. **Average Confidence Score:** >0.8
5. **User Satisfaction:** Measured through feedback

---

## 🚀 Next Steps

1. **Integrate intent recognition** into main chatbot
2. **Run automated tests** using simulated conversations
3. **Monitor real conversations** for new patterns
4. **Continuously update** training data
5. **Refine entity extraction** based on failures
6. **Add ML model** for better accuracy (optional)

---

## 💡 Tips for Success

✅ **Do:**
- Test with real user inputs
- Cover edge cases
- Use confident intent recognition (>0.7)
- Provide fallbacks for unknown intents
- Log unrecognized patterns for improvement

❌ **Don't:**
- Assume perfect recognition
- Ignore low-confidence matches
- Forget to handle ambiguity
- Skip testing conversations
- Overlook context importance

---

## 🎉 Summary

You now have:
- ✅ 135+ training examples across 14 intents
- ✅ Comprehensive entity extraction system
- ✅ 10 realistic conversation scenarios
- ✅ Intent recognition engine
- ✅ Edge case handling
- ✅ Response templates
- ✅ Testing framework

**This simulated data refocuses the chatbot on understanding user intent in the German restaurant context, enabling natural, accurate order processing!**

---

*Last Updated: October 20, 2025*
*Version: 1.0 - Initial Simulated Data System*
