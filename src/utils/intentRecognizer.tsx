// Intent Recognition System for AI Waiter Chatbot
// Uses simulated training data to understand user intent

import { menuData } from '../data/menuData';
import { MenuItem } from '../types/menu';
import {
	trainingData,
	entityPatterns,
	TrainingExample,
} from '../data/chatbotTrainingData';

export interface RecognizedIntent {
	intent: string;
	confidence: number;
	entities: {
		dishName?: string;
		dishId?: string;
		quantity?: number;
		category?: string;
		dietary?: string;
		modification?: string;
		allergen?: string;
		occasion?: string;
	};
	matchedDish?: MenuItem;
}

// ============================================
// EXTRACT QUANTITY FROM USER INPUT
// ============================================

export function extractQuantity(input: string): number {
	const lowerInput = input.toLowerCase();

	// Check for numeric quantities
	const numericMatch = lowerInput.match(
		/(\d+)\s*(x|order|orders|piece|pieces|portion|portions)?/i,
	);
	if (numericMatch) {
		return parseInt(numericMatch[1]);
	}

	// Check for word quantities
	const wordNumbers = entityPatterns.quantities.numbers;
	for (const [word, number] of Object.entries(wordNumbers)) {
		if (lowerInput.includes(word)) {
			return number;
		}
	}

	return 1; // Default quantity
}

// ============================================
// EXTRACT DISH NAME FROM USER INPUT
// ============================================

export function extractDishName(input: string): {
	dish: MenuItem | null;
	confidence: number;
} {
	const lowerInput = input.toLowerCase();
	let bestMatch: { dish: MenuItem | null; confidence: number } = {
		dish: null,
		confidence: 0,
	};

	// Direct dish name matching
	menuData.forEach((dish) => {
		const dishNameLower = dish.name.toLowerCase();

		// Exact match
		if (lowerInput.includes(dishNameLower)) {
			bestMatch = { dish, confidence: 1.0 };
			return;
		}

		// Partial match
		const dishWords = dishNameLower.split(' ');
		let matchCount = 0;
		dishWords.forEach((word) => {
			if (lowerInput.includes(word) && word.length > 3) {
				matchCount++;
			}
		});

		const confidence = matchCount / dishWords.length;
		if (confidence > bestMatch.confidence && confidence > 0.5) {
			bestMatch = { dish, confidence };
		}
	});

	// Check for dish variations from entity patterns
	if (bestMatch.confidence < 0.8) {
		for (const [dishName, variations] of Object.entries(
			entityPatterns.dishes,
		)) {
			for (const variation of variations) {
				if (lowerInput.includes(variation)) {
					const foundDish = menuData.find((d) => d.name === dishName);
					if (foundDish) {
						const confidence = 0.9; // High confidence for known variations
						if (confidence > bestMatch.confidence) {
							bestMatch = { dish: foundDish, confidence };
						}
					}
				}
			}
		}
	}

	return bestMatch;
}

// ============================================
// EXTRACT CATEGORY FROM USER INPUT
// ============================================

export function extractCategory(input: string): string | null {
	const lowerInput = input.toLowerCase();

	for (const [category, keywords] of Object.entries(
		entityPatterns.categories,
	)) {
		for (const keyword of keywords) {
			if (lowerInput.includes(keyword)) {
				return category;
			}
		}
	}

	return null;
}

// ============================================
// EXTRACT DIETARY PREFERENCE
// ============================================

export function extractDietary(input: string): string | null {
	const lowerInput = input.toLowerCase();

	for (const [dietary, keywords] of Object.entries(entityPatterns.dietary)) {
		for (const keyword of keywords) {
			if (lowerInput.includes(keyword)) {
				return dietary;
			}
		}
	}

	return null;
}

// ============================================
// EXTRACT MODIFICATIONS
// ============================================

export function extractModifications(input: string): string[] {
	const modifications: string[] = [];
	const lowerInput = input.toLowerCase();

	// Check for "no X" pattern
	const noMatch = lowerInput.match(/no\s+(\w+)/gi);
	if (noMatch) {
		modifications.push(...noMatch.map((m) => m.trim()));
	}

	// Check for "without X" pattern
	const withoutMatch = lowerInput.match(/without\s+(\w+)/gi);
	if (withoutMatch) {
		modifications.push(
			...withoutMatch.map((m) => m.replace('without', 'no').trim()),
		);
	}

	// Check for "extra X" pattern
	const extraMatch = lowerInput.match(/extra\s+(\w+)/gi);
	if (extraMatch) {
		modifications.push(...extraMatch.map((m) => m.trim()));
	}

	// Check for preparation preferences
	if (/crispy|crunchy|well.done/i.test(lowerInput)) {
		modifications.push('extra crispy');
	}
	if (/rare|pink/i.test(lowerInput)) {
		modifications.push('rare');
	}
	if (/medium/i.test(lowerInput)) {
		modifications.push('medium');
	}

	return modifications;
}

// ============================================
// EXTRACT SPECIAL OCCASION
// ============================================

export function extractOccasion(input: string): string | null {
	const lowerInput = input.toLowerCase();

	for (const [occasion, keywords] of Object.entries(entityPatterns.occasions)) {
		for (const keyword of keywords) {
			if (lowerInput.includes(keyword)) {
				return occasion;
			}
		}
	}

	return null;
}

// ============================================
// RECOGNIZE INTENT USING TRAINING DATA
// ============================================

export function recognizeIntent(userInput: string): RecognizedIntent {
	const lowerInput = userInput.toLowerCase();

	// Initialize result
	const result: RecognizedIntent = {
		intent: 'UNKNOWN',
		confidence: 0,
		entities: {},
	};

	// Extract entities first
	const quantity = extractQuantity(lowerInput);
	const dishMatch = extractDishName(lowerInput);
	const category = extractCategory(lowerInput);
	const dietary = extractDietary(lowerInput);
	const modifications = extractModifications(lowerInput);
	const occasion = extractOccasion(lowerInput);

	result.entities.quantity = quantity;
	if (dishMatch.dish) {
		result.entities.dishName = dishMatch.dish.name;
		result.entities.dishId = dishMatch.dish.id;
		result.matchedDish = dishMatch.dish;
	}
	if (category) result.entities.category = category;
	if (dietary) result.entities.dietary = dietary;
	if (modifications.length > 0)
		result.entities.modification = modifications.join(', ');
	if (occasion) result.entities.occasion = occasion;

	// Pattern-based intent recognition

	// ORDERING INTENTS
	if (
		/i'?ll have|can i get|i want|give me|add|order/i.test(lowerInput) &&
		dishMatch.dish
	) {
		result.intent = 'ORDER_DISH';
		result.confidence = 0.9;
		return result;
	}

	// MENU BROWSING
	if (
		/show|see|view|browse|display/i.test(lowerInput) &&
		/menu/i.test(lowerInput)
	) {
		result.intent = 'VIEW_MENU';
		result.confidence = 0.95;
		return result;
	}

	if (category && /show|see|view|what.*have|do you have/i.test(lowerInput)) {
		result.intent = 'VIEW_CATEGORY';
		result.confidence = 0.9;
		return result;
	}

	// RECOMMENDATIONS
	if (/recommend|suggest|popular|best|what.*good|surprise/i.test(lowerInput)) {
		result.intent = 'GET_RECOMMENDATIONS';
		result.confidence = 0.85;
		return result;
	}

	// DIETARY QUERIES
	if (dietary) {
		result.intent = 'DIETARY_QUERY';
		result.confidence = 0.9;
		return result;
	}

	// DISH INFORMATION
	if (
		dishMatch.dish &&
		/what is|tell me about|how much|what.*come|ingredients/i.test(lowerInput)
	) {
		result.intent = 'DISH_INFO';
		result.confidence = 0.85;
		return result;
	}

	// PRICE QUERY
	if (/how much|price|cost|expensive/i.test(lowerInput)) {
		result.intent = 'PRICE_QUERY';
		result.confidence = 0.9;
		return result;
	}

	// PAIRING
	if (/wine|pair|drink.*with|go.*with/i.test(lowerInput)) {
		result.intent = 'WINE_PAIRING';
		result.confidence = 0.85;
		return result;
	}

	if (/side|sides/i.test(lowerInput)) {
		result.intent = 'SIDE_DISH_SUGGESTION';
		result.confidence = 0.85;
		return result;
	}

	// CART OPERATIONS
	if (/cart|order.*status|what.*ordered/i.test(lowerInput)) {
		result.intent = 'VIEW_CART';
		result.confidence = 0.9;
		return result;
	}

	if (/checkout|pay|payment|check/i.test(lowerInput)) {
		result.intent = 'CHECKOUT';
		result.confidence = 0.9;
		return result;
	}

	if (/remove|delete|take.*out/i.test(lowerInput) && dishMatch.dish) {
		result.intent = 'REMOVE_FROM_CART';
		result.confidence = 0.85;
		return result;
	}

	// DISCOUNT
	if (/discount|voucher|coupon|promo|deal|code/i.test(lowerInput)) {
		result.intent = 'APPLY_DISCOUNT';
		result.confidence = 0.9;
		return result;
	}

	// MODIFICATIONS
	if (modifications.length > 0 && dishMatch.dish) {
		result.intent = 'MODIFY_ORDER';
		result.confidence = 0.85;
		return result;
	}

	// GREETINGS
	if (/^(hi|hello|hey|good morning|good evening|greetings)/i.test(lowerInput)) {
		result.intent = 'GREETING';
		result.confidence = 0.95;
		return result;
	}

	// HELP
	if (/help|how.*work|what.*do|assist/i.test(lowerInput)) {
		result.intent = 'HELP';
		result.confidence = 0.9;
		return result;
	}

	// SPECIAL OCCASION
	if (occasion) {
		result.intent = 'SPECIAL_OCCASION';
		result.confidence = 0.85;
		return result;
	}

	// ALLERGEN INFO
	if (/allergy|allergic|allergen/i.test(lowerInput)) {
		result.intent = 'ALLERGEN_INFO';
		result.confidence = 0.9;
		return result;
	}

	// COMPLAINT
	if (/complain|wrong|problem|issue|too long|cold/i.test(lowerInput)) {
		result.intent = 'COMPLAINT';
		result.confidence = 0.8;
		return result;
	}

	// COMPLIMENT
	if (/amazing|delicious|great|excellent|best|love|perfect/i.test(lowerInput)) {
		result.intent = 'COMPLIMENT';
		result.confidence = 0.75;
		return result;
	}

	// If we found a dish but no clear intent, assume ordering
	if (dishMatch.dish && dishMatch.confidence > 0.7) {
		result.intent = 'ORDER_DISH';
		result.confidence = 0.7;
		return result;
	}

	// Try to match with training data as fallback
	const trainingMatch = findBestTrainingMatch(lowerInput);
	if (trainingMatch && trainingMatch.confidence > result.confidence) {
		result.intent = trainingMatch.intent;
		result.confidence = trainingMatch.confidence;
	}

	return result;
}

// ============================================
// FIND BEST MATCH FROM TRAINING DATA
// ============================================

function findBestTrainingMatch(
	input: string,
): { intent: string; confidence: number } | null {
	const inputWords = input
		.toLowerCase()
		.split(' ')
		.filter((w) => w.length > 2);
	let bestMatch: { intent: string; confidence: number } | null = null;

	trainingData.forEach((example) => {
		const exampleWords = example.userInput
			.toLowerCase()
			.split(' ')
			.filter((w) => w.length > 2);

		// Calculate word overlap
		const matchingWords = inputWords.filter((word) =>
			exampleWords.includes(word),
		);
		const confidence =
			matchingWords.length / Math.max(inputWords.length, exampleWords.length);

		if (!bestMatch || confidence > bestMatch.confidence) {
			bestMatch = { intent: example.intent, confidence };
		}
	});

	return bestMatch;
}

// ============================================
// CONTEXT-AWARE INTENT REFINEMENT
// ============================================

export function refineIntentWithContext(
	recognizedIntent: RecognizedIntent,
	conversationContext: {
		lastIntent?: string;
		hasItemsInCart?: boolean;
		currentCategory?: string;
	},
): RecognizedIntent {
	// If user just viewed menu and now mentions a dish, likely ordering
	if (
		conversationContext.lastIntent === 'VIEW_MENU' &&
		recognizedIntent.matchedDish
	) {
		recognizedIntent.intent = 'ORDER_DISH';
		recognizedIntent.confidence = Math.max(recognizedIntent.confidence, 0.85);
	}

	// If user has items in cart and says "more", assume adding more items
	if (conversationContext.hasItemsInCart && /more|another|also/i.test('')) {
		// Context helps but need more info
	}

	// If currently viewing a category and user says a dish name, ordering
	if (conversationContext.currentCategory && recognizedIntent.matchedDish) {
		recognizedIntent.intent = 'ORDER_DISH';
		recognizedIntent.confidence = Math.max(recognizedIntent.confidence, 0.8);
	}

	return recognizedIntent;
}

// ============================================
// EXPORT MAIN FUNCTION
// ============================================

export default {
	recognizeIntent,
	extractQuantity,
	extractDishName,
	extractCategory,
	extractDietary,
	extractModifications,
	extractOccasion,
	refineIntentWithContext,
};
