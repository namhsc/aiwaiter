/**
 * Test hasOrderingIntent logic
 */

// Mock implementation
const hasOrderingIntent = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // EXCLUDE non-ordering intents first
  const excludePatterns = [
    /checkout/,
    /\b(pay|payment|paying)\b/,
    /\b(bill|check)\b/,
    /\b(cart|basket)\b/,
    /proceed to/,
    /ready to pay/,
    /show me/,
    /could you show/,
    /can you show/,
    /may i see/,
    /what.*menu/,
    /see.*menu/,
    /like to see/,
    /browse/,
    /view.*cart/,
    /what are your/,
    /what do you have/,
    /do you have/,
    /are there/,
  ];
  
  if (excludePatterns.some(pattern => pattern.test(lowerMessage))) {
    return false;
  }
  
  const orderingKeywords = [
    "want",
    "would like",
    "i'll have",
    "i'll take",
    "order",
    "get me",
    "add",
    "can i have",
    "could i get",
    "please give me",
    "bring me",
    "i'd like",
    "give me",
    "serve me",
    "need",
    "looking for",
  ];

  return orderingKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );
};

// Test cases
const testCases = [
  // Should be TRUE (ordering intent)
  { input: "I want the Schnitzel", expected: true },
  { input: "I would like to order the Pretzel", expected: true },
  { input: "I'll have 2 Black Forest Cakes", expected: true },
  { input: "Add the Bratwurst to my order", expected: true },
  { input: "Can I have the wine?", expected: true },
  
  // Should be FALSE (NOT ordering intent)
  { input: "I would like to proceed to checkout", expected: false },
  { input: "Could I get the bill, please?", expected: false },
  { input: "Could you show me your desserts?", expected: false },
  { input: "I would like to see your dessert menu, please", expected: false },
  { input: "Can you show me the drinks menu, please?", expected: false },
  { input: "What is in my cart?", expected: false },
  { input: "Show me the menu", expected: false },
  { input: "I am ready to pay", expected: false },
  { input: "Do you have any current discounts?", expected: false },
  { input: "What are your best selling dishes?", expected: false },
  { input: "What do you have for vegetarians?", expected: false },
  { input: "Are there any gluten-free options?", expected: false },
];

console.log("Testing hasOrderingIntent logic:\n");
let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
  const result = hasOrderingIntent(input);
  const status = result === expected ? "✅ PASS" : "❌ FAIL";
  
  if (result === expected) {
    passed++;
  } else {
    failed++;
    console.log(`${status}: "${input}"`);
    console.log(`  Expected: ${expected}, Got: ${result}\n`);
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log("🎉 All tests passed!");
}
