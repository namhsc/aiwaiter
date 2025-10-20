// Test Script for Intent Recognition System
// Run this to verify the intent recognizer works correctly

import { recognizeIntent } from './intentRecognizer';
import { trainingData } from '../data/chatbotTrainingData';
import { simulatedConversations } from '../data/simulatedConversations';

// ============================================
// TEST SUITE
// ============================================

export interface TestResult {
  passed: number;
  failed: number;
  total: number;
  passRate: number;
  failures: Array<{
    input: string;
    expected: string;
    actual: string;
    confidence: number;
  }>;
}

// ============================================
// TEST TRAINING DATA
// ============================================

export function testTrainingDataAccuracy(): TestResult {
  const result: TestResult = {
    passed: 0,
    failed: 0,
    total: 0,
    passRate: 0,
    failures: []
  };

  console.log('🧪 Testing Training Data Examples...\n');

  trainingData.forEach((example, index) => {
    result.total++;
    const recognized = recognizeIntent(example.userInput);
    
    const isCorrect = recognized.intent === example.intent;
    
    if (isCorrect && recognized.confidence >= 0.6) {
      result.passed++;
      console.log(`✅ Test ${index + 1}: PASS - "${example.userInput}"`);
      console.log(`   Intent: ${recognized.intent} (${(recognized.confidence * 100).toFixed(0)}%)\n`);
    } else {
      result.failed++;
      result.failures.push({
        input: example.userInput,
        expected: example.intent,
        actual: recognized.intent,
        confidence: recognized.confidence
      });
      console.log(`❌ Test ${index + 1}: FAIL - "${example.userInput}"`);
      console.log(`   Expected: ${example.intent}`);
      console.log(`   Got: ${recognized.intent} (${(recognized.confidence * 100).toFixed(0)}%)\n`);
    }
  });

  result.passRate = (result.passed / result.total) * 100;
  
  console.log('═'.repeat(60));
  console.log(`Training Data Test Results:`);
  console.log(`Total: ${result.total} | Passed: ${result.passed} | Failed: ${result.failed}`);
  console.log(`Pass Rate: ${result.passRate.toFixed(1)}%`);
  console.log('═'.repeat(60) + '\n');

  return result;
}

// ============================================
// TEST CONVERSATION SCENARIOS
// ============================================

export function testConversationScenarios(): TestResult {
  const result: TestResult = {
    passed: 0,
    failed: 0,
    total: 0,
    passRate: 0,
    failures: []
  };

  console.log('🗣️  Testing Conversation Scenarios...\n');

  simulatedConversations.forEach((conversation, convIndex) => {
    console.log(`\n📖 Scenario ${convIndex + 1}: ${conversation.scenario}`);
    console.log('─'.repeat(60));

    conversation.turns.forEach((turn, turnIndex) => {
      if (turn.speaker === 'user' && turn.expectedIntent) {
        result.total++;
        const recognized = recognizeIntent(turn.message);
        
        const isCorrect = recognized.intent === turn.expectedIntent;
        
        if (isCorrect && recognized.confidence >= 0.6) {
          result.passed++;
          console.log(`  ✅ Turn ${turnIndex + 1}: "${turn.message}"`);
          console.log(`     Intent: ${recognized.intent} (${(recognized.confidence * 100).toFixed(0)}%)`);
        } else {
          result.failed++;
          result.failures.push({
            input: turn.message,
            expected: turn.expectedIntent,
            actual: recognized.intent,
            confidence: recognized.confidence
          });
          console.log(`  ❌ Turn ${turnIndex + 1}: "${turn.message}"`);
          console.log(`     Expected: ${turn.expectedIntent}`);
          console.log(`     Got: ${recognized.intent} (${(recognized.confidence * 100).toFixed(0)}%)`);
        }
      }
    });
  });

  result.passRate = (result.passed / result.total) * 100;
  
  console.log('\n' + '═'.repeat(60));
  console.log(`Conversation Scenarios Test Results:`);
  console.log(`Total: ${result.total} | Passed: ${result.passed} | Failed: ${result.failed}`);
  console.log(`Pass Rate: ${result.passRate.toFixed(1)}%`);
  console.log('═'.repeat(60) + '\n');

  return result;
}

// ============================================
// TEST SPECIFIC INTENTS
// ============================================

export function testSpecificIntent(intent: string): void {
  console.log(`\n🎯 Testing Intent: ${intent}\n`);
  
  const examples = trainingData.filter(ex => ex.intent === intent);
  
  if (examples.length === 0) {
    console.log(`❌ No training examples found for intent: ${intent}`);
    return;
  }

  let passed = 0;
  
  examples.forEach((example, index) => {
    const recognized = recognizeIntent(example.userInput);
    const isCorrect = recognized.intent === intent;
    
    console.log(`${isCorrect ? '✅' : '❌'} Example ${index + 1}: "${example.userInput}"`);
    console.log(`   Recognized as: ${recognized.intent} (${(recognized.confidence * 100).toFixed(0)}%)`);
    
    if (recognized.entities.dishName) {
      console.log(`   Dish: ${recognized.entities.dishName}`);
    }
    if (recognized.entities.quantity) {
      console.log(`   Quantity: ${recognized.entities.quantity}`);
    }
    console.log('');
    
    if (isCorrect) passed++;
  });

  console.log('─'.repeat(60));
  console.log(`Results: ${passed}/${examples.length} correct (${((passed/examples.length)*100).toFixed(1)}%)\n`);
}

// ============================================
// TEST ENTITY EXTRACTION
// ============================================

export function testEntityExtraction(): void {
  console.log('\n🔍 Testing Entity Extraction...\n');

  const testCases = [
    { input: 'I want 2 schnitzels', expected: { dish: 'Wiener Schnitzel', quantity: 2 } },
    { input: 'Give me a pretzel', expected: { dish: 'Bavarian Pretzel', quantity: 1 } },
    { input: 'Can I get three bratwurst?', expected: { dish: 'Bratwurst Platter', quantity: 3 } },
    { input: 'I\'ll have the spaetzle without onions', expected: { dish: 'Käsespätzle', modification: 'no onions' } },
    { input: 'Show me vegetarian options', expected: { dietary: 'vegetarian' } },
    { input: 'Do you have gluten-free dishes?', expected: { dietary: 'gluten-free' } },
  ];

  let passed = 0;

  testCases.forEach((testCase, index) => {
    const recognized = recognizeIntent(testCase.input);
    let isCorrect = true;

    console.log(`Test ${index + 1}: "${testCase.input}"`);
    
    if (testCase.expected.dish) {
      const dishMatch = recognized.entities.dishName === testCase.expected.dish;
      console.log(`  Dish: ${recognized.entities.dishName || 'NONE'} ${dishMatch ? '✅' : '❌'}`);
      isCorrect = isCorrect && dishMatch;
    }
    
    if (testCase.expected.quantity) {
      const quantityMatch = recognized.entities.quantity === testCase.expected.quantity;
      console.log(`  Quantity: ${recognized.entities.quantity || 'NONE'} ${quantityMatch ? '✅' : '❌'}`);
      isCorrect = isCorrect && quantityMatch;
    }
    
    if (testCase.expected.dietary) {
      const dietaryMatch = recognized.entities.dietary === testCase.expected.dietary;
      console.log(`  Dietary: ${recognized.entities.dietary || 'NONE'} ${dietaryMatch ? '✅' : '❌'}`);
      isCorrect = isCorrect && dietaryMatch;
    }
    
    if (testCase.expected.modification) {
      const hasModification = recognized.entities.modification?.includes(testCase.expected.modification);
      console.log(`  Modification: ${recognized.entities.modification || 'NONE'} ${hasModification ? '✅' : '❌'}`);
      isCorrect = isCorrect && !!hasModification;
    }

    if (isCorrect) passed++;
    console.log('');
  });

  console.log('─'.repeat(60));
  console.log(`Entity Extraction: ${passed}/${testCases.length} correct (${((passed/testCases.length)*100).toFixed(1)}%)\n`);
}

// ============================================
// TEST CUSTOM INPUTS
// ============================================

export function testCustomInput(input: string): void {
  console.log('\n🔬 Testing Custom Input...\n');
  console.log(`Input: "${input}"\n`);
  
  const recognized = recognizeIntent(input);
  
  console.log('Results:');
  console.log(`  Intent: ${recognized.intent}`);
  console.log(`  Confidence: ${(recognized.confidence * 100).toFixed(1)}%`);
  console.log('\n  Entities:');
  
  if (recognized.entities.dishName) {
    console.log(`    - Dish: ${recognized.entities.dishName} (ID: ${recognized.entities.dishId})`);
  }
  if (recognized.entities.quantity) {
    console.log(`    - Quantity: ${recognized.entities.quantity}`);
  }
  if (recognized.entities.category) {
    console.log(`    - Category: ${recognized.entities.category}`);
  }
  if (recognized.entities.dietary) {
    console.log(`    - Dietary: ${recognized.entities.dietary}`);
  }
  if (recognized.entities.modification) {
    console.log(`    - Modification: ${recognized.entities.modification}`);
  }
  if (recognized.entities.occasion) {
    console.log(`    - Occasion: ${recognized.entities.occasion}`);
  }
  
  if (recognized.matchedDish) {
    console.log(`\n  Matched Dish:`);
    console.log(`    - Name: ${recognized.matchedDish.name}`);
    console.log(`    - Price: €${recognized.matchedDish.price}`);
    console.log(`    - Category: ${recognized.matchedDish.category}`);
  }
  
  console.log('');
}

// ============================================
// RUN ALL TESTS
// ============================================

export function runAllTests(): void {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 RUNNING COMPLETE TEST SUITE');
  console.log('═'.repeat(60) + '\n');

  const trainingResult = testTrainingDataAccuracy();
  const conversationResult = testConversationScenarios();
  testEntityExtraction();

  console.log('\n' + '═'.repeat(60));
  console.log('📊 OVERALL RESULTS');
  console.log('═'.repeat(60));
  console.log(`Training Data Pass Rate: ${trainingResult.passRate.toFixed(1)}%`);
  console.log(`Conversation Pass Rate: ${conversationResult.passRate.toFixed(1)}%`);
  console.log(`Overall Tests: ${trainingResult.total + conversationResult.total}`);
  console.log(`Overall Passed: ${trainingResult.passed + conversationResult.passed}`);
  console.log(`Overall Failed: ${trainingResult.failed + conversationResult.failed}`);
  
  const overallPassRate = ((trainingResult.passed + conversationResult.passed) / 
                           (trainingResult.total + conversationResult.total)) * 100;
  console.log(`Overall Pass Rate: ${overallPassRate.toFixed(1)}%`);
  
  if (overallPassRate >= 90) {
    console.log('\n🎉 EXCELLENT! Intent recognition is working great!');
  } else if (overallPassRate >= 75) {
    console.log('\n👍 GOOD! Some improvements needed.');
  } else {
    console.log('\n⚠️  NEEDS WORK! Review failed cases and improve patterns.');
  }
  
  console.log('═'.repeat(60) + '\n');

  // Show failed cases
  if (trainingResult.failures.length > 0 || conversationResult.failures.length > 0) {
    console.log('❌ Failed Cases to Review:\n');
    
    [...trainingResult.failures, ...conversationResult.failures].slice(0, 10).forEach((failure, index) => {
      console.log(`${index + 1}. "${failure.input}"`);
      console.log(`   Expected: ${failure.expected} | Got: ${failure.actual} (${(failure.confidence * 100).toFixed(0)}%)\n`);
    });
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

export const exampleUsage = () => {
  console.log('\n📚 Example Usage:\n');
  console.log('// Test all training data');
  console.log('testTrainingDataAccuracy();\n');
  
  console.log('// Test conversation scenarios');
  console.log('testConversationScenarios();\n');
  
  console.log('// Test specific intent');
  console.log('testSpecificIntent("ORDER_DISH");\n');
  
  console.log('// Test entity extraction');
  console.log('testEntityExtraction();\n');
  
  console.log('// Test custom input');
  console.log('testCustomInput("I want 2 schnitzels");\n');
  
  console.log('// Run all tests');
  console.log('runAllTests();\n');
};

export default {
  testTrainingDataAccuracy,
  testConversationScenarios,
  testSpecificIntent,
  testEntityExtraction,
  testCustomInput,
  runAllTests,
  exampleUsage
};
