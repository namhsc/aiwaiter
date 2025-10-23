import { MenuItem } from '../types/menu';
import { menuData } from '../data/menuData';
import { getCheckoutResponseText } from './paymentHelpers';

// Helper function to generate payment instructions
const getPaymentInstructions = (): string => {
	return `━━━━━━━━━━━━━━━━━━━━━━\n\n**Payment Methods Available:** 💳\n\n💵 **Cash**\n   Pay directly to your server\n   Exact change appreciated\n\n💳 **Credit / Debit Card**\n   Visa, Mastercard, Amex accepted\n   Contactless available\n\n📱 **QR Code Payment**\n   Scan & pay with your mobile\n   Supports: Apple Pay, Google Pay\n   Alipay, WeChat Pay accepted\n\n━━━━━━━━━━━━━━━━━━━━━━`;
};

// Helper function to extract quantity from message
const extractQuantity = (message: string): number => {
	const quantityPatterns = [
		/(\d+)\s*(x|piece|pieces|order|orders)?/i,
		/(one|two|three|four|five|six|seven|eight|nine|ten)/i,
	];

	const numberWords: { [key: string]: number } = {
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		six: 6,
		seven: 7,
		eight: 8,
		nine: 9,
		ten: 10,
	};

	for (const pattern of quantityPatterns) {
		const match = message.match(pattern);
		if (match) {
			const word = match[1].toLowerCase();
			return numberWords[word] || parseInt(match[1]) || 1;
		}
	}

	return 1;
};

// Helper function to extract menu IDs from response text
export const extractMenuIds = (text: string): string[] => {
	// Pattern to match IDs in parentheses like (mn1), (mn2), (st3), etc.
	// Updated pattern to be more flexible
	const idPattern = /\(([a-z]{2}\d+)\)/g;
	const matches = text.match(idPattern);

	console.log('extractMenuIds - Input text:', text);
	console.log('extractMenuIds - Pattern matches:', matches);

	if (!matches) {
		console.log('No matches found with pattern:', idPattern);
		return [];
	}

	// Extract the IDs without parentheses
	const ids = matches.map((match) => match.slice(1, -1));
	console.log('extractMenuIds - Extracted IDs:', ids);
	return ids;
};

// Test function to verify menu ID extraction
export const testMenuIdExtraction = () => {
	const testResponse = `Certainly! Our most popular dishes are:  
-  Wiener Schnitzel (mn1)  – Breaded veal cutlet with potato salad and lingonberry jam  
-  Pork Knuckle (mn2)  – Crispy roasted pork knuckle with sauerkraut  
-  Vegetarian Pasta (mn3)  – Penne with seasonal vegetables and tomato sauce  
-  Roasted Duck (mn5)  – Slow-roasted duck breast with red cabbage  

Would you like me to recommend drinks or desserts to pair with any of these? 😊`;

	console.log('Testing Menu ID Extraction:');
	console.log('Test Response:', testResponse);

	const extractedIds = extractMenuIds(testResponse);
	console.log('Extracted IDs:', extractedIds);

	const suggestedItems = getMenuItemsByIds(extractedIds);
	console.log(
		'Suggested Items:',
		suggestedItems.map((item) => ({
			id: item.id,
			name: item.name,
			price: item.price,
			category: item.category,
		})),
	);

	return { extractedIds, suggestedItems };
};

// Test function that can be called from browser console
export const testMenuIdExtractionInBrowser = () => {
	const testResponse = `Certainly! Our most popular dishes are:  
-  Wiener Schnitzel (mn1)  – Breaded veal cutlet with potato salad and lingonberry jam  
-  Pork Knuckle (mn2)  – Crispy roasted pork knuckle with sauerkraut  
-  Vegetarian Pasta (mn3)  – Penne with seasonal vegetables and tomato sauce  
-  Roasted Duck (mn5)  – Slow-roasted duck breast with red cabbage  

Would you like me to recommend drinks or desserts to pair with any of these? 😊`;

	console.log('=== TESTING MENU ID EXTRACTION ===');
	console.log('Test Response:', testResponse);

	const extractedIds = extractMenuIds(testResponse);
	console.log('Extracted IDs:', extractedIds);

	const suggestedItems = getMenuItemsByIds(extractedIds);
	console.log('Suggested Items:', suggestedItems);

	// Test with different patterns
	const testPatterns = [
		'Try our (mn1) and (mn2) today!',
		'Popular items: (st1), (mn3), (ds1)',
		'No IDs in this message',
		'Mixed content with (mn5) and regular text',
	];

	testPatterns.forEach((pattern, index) => {
		console.log(`\n--- Test Pattern ${index + 1} ---`);
		console.log('Text:', pattern);
		const ids = extractMenuIds(pattern);
		console.log('Extracted IDs:', ids);
		const items = getMenuItemsByIds(ids);
		console.log('Found Items:', items.length);
	});

	return { extractedIds, suggestedItems };
};

// Helper function to get menu items by IDs
export const getMenuItemsByIds = (ids: string[]): MenuItem[] => {
	return ids
		.map((id) => menuData.find((item) => item.id === id))
		.filter((item): item is MenuItem => item !== undefined);
};

// Helper function to find menu items by fuzzy matching
const findMenuItems = (message: string): MenuItem[] => {
	const lowerMessage = message.toLowerCase();
	const foundItems: MenuItem[] = [];

	// Direct name matching
	menuData.forEach((item) => {
		const itemNameLower = item.name.toLowerCase();
		if (lowerMessage.includes(itemNameLower)) {
			foundItems.push(item);
		}
	});

	if (foundItems.length > 0) return foundItems;

	// Partial matching - key words from dish names
	const keywords = [
		{
			words: ['schnitzel', 'veal', 'cutlet'],
			item: 'Wiener Schnitzel',
		},
		{
			words: ['bratwurst', 'sausage', 'nuremberg'],
			item: 'Bratwurst Platter',
		},
		{
			words: ['pretzel', 'bavarian pretzel'],
			item: 'Bavarian Pretzel',
		},
		{
			words: ['sauerbraten', 'pot roast', 'beef marinated'],
			item: 'Sauerbraten',
		},
		{
			words: ['rouladen', 'beef roll', 'beef rolls'],
			item: 'Rinderrouladen',
		},
		{
			words: ['spätzle', 'spaetzle', 'noodles'],
			item: 'Käsespätzle',
		},
		{
			words: ['potato salad', 'kartoffelsalat'],
			item: 'Kartoffelsalat',
		},
		{
			words: ['flammkuchen', 'flatbread', 'alsatian'],
			item: 'Flammkuchen',
		},
		{
			words: ['goulash', 'hungarian'],
			item: 'Hungarian Goulash',
		},
		{
			words: ['black forest', 'chocolate cake', 'cherry cake'],
			item: 'Black Forest Cake',
		},
		{
			words: ['strudel', 'apple strudel', 'apple pastry'],
			item: 'Apple Strudel',
		},
		{
			words: ['soufflé', 'souffle', 'golden'],
			item: "Le Chef's Golden Soufflé",
		},
		{ words: ['tiramisu'], item: 'Tiramisu Classico' },
		{
			words: ['beer', 'wheat beer', 'bavarian beer'],
			item: 'Bavarian Wheat Beer',
		},
		{
			words: ['riesling', 'white wine'],
			item: 'Riesling Wine',
		},
		{ words: ['espresso'], item: 'Espresso Doppio' },
		{
			words: ['water', 'sparkling water'],
			item: 'Sparkling Water',
		},
	];

	keywords.forEach(({ words, item: itemName }) => {
		words.forEach((word) => {
			if (lowerMessage.includes(word)) {
				const menuItem = menuData.find((i) => i.name === itemName);
				if (menuItem && !foundItems.find((f) => f.id === menuItem.id)) {
					foundItems.push(menuItem);
				}
			}
		});
	});

	return foundItems;
};

// Check if message contains ordering intent
const hasOrderingIntent = (message: string): boolean => {
	const lowerMessage = message.toLowerCase();

	// EXCLUDE non-ordering intents first (checkout, bill, cart queries, menu browsing)
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

	if (excludePatterns.some((pattern) => pattern.test(lowerMessage))) {
		return false;
	}

	const orderingKeywords = [
		'want',
		'would like',
		"i'll have",
		"i'll take",
		'order',
		'get me',
		'add',
		'can i have',
		'could i get',
		'please give me',
		'bring me',
		"i'd like",
		'give me',
		'serve me',
		'need',
		'looking for',
	];

	return orderingKeywords.some((keyword) => lowerMessage.includes(keyword));
};

// Get smart pairing recommendations
const getPairingRecommendations = (items: MenuItem[]): MenuItem[] => {
	const pairings: { [key: string]: string[] } = {
		'Wiener Schnitzel': [
			'Riesling Wine',
			'Bavarian Wheat Beer',
			'Kartoffelsalat',
		],
		'Bratwurst Platter': ['Bavarian Wheat Beer', 'Kartoffelsalat'],
		Sauerbraten: ['Riesling Wine', 'Käsespätzle'],
		Rinderrouladen: ['Riesling Wine', 'Käsespätzle'],
		Käsespätzle: ['Bavarian Wheat Beer', 'Bavarian Pretzel'],
		'Hungarian Goulash': ['Bavarian Wheat Beer'],
	};

	const recommendations: MenuItem[] = [];
	items.forEach((item) => {
		const pairingNames = pairings[item.name] || [];
		pairingNames.forEach((name) => {
			const pairingItem = menuData.find((i) => i.name === name);
			if (
				pairingItem &&
				!recommendations.find((r) => r.id === pairingItem.id)
			) {
				recommendations.push(pairingItem);
			}
		});
	});

	return recommendations;
};

// Smart category detection
const detectCategory = (message: string): string | null => {
	const lowerMessage = message.toLowerCase();

	// NEW: Kids & Family
	if (lowerMessage.match(/kids|children|child|for kids|kid menu|kids meal/))
		return 'kids';
	if (lowerMessage.match(/family|group|sharing|share|for sharing|family meal/))
		return 'family';

	// NEW: Soups & Salads
	if (lowerMessage.match(/\bsoup\b|\bsoups\b/)) return 'soups';
	if (lowerMessage.match(/\bsalad\b|\bsalads\b/)) return 'salads';

	// NEW: Quick & Convenience
	if (lowerMessage.match(/quick|fast|express|ready fast|quick meal/))
		return 'quick';

	// NEW: Meal Time Specials
	if (lowerMessage.match(/lunch special|lunch deal/)) return 'lunch-specials';

	// NEW: Traditional & Bavarian
	if (lowerMessage.match(/bavarian|bayern|bavaria/)) return 'bavarian';
	if (lowerMessage.match(/traditional|authentic|classic|regional/))
		return 'traditional';

	// Original categories
	if (lowerMessage.match(/starter|appetizer|begin|first course|to start/))
		return 'starter';
	if (lowerMessage.match(/main|entree|entrée|main course|dinner|lunch/))
		return 'main';
	if (lowerMessage.match(/dessert|sweet|cake|pastry|after dinner/))
		return 'dessert';
	if (lowerMessage.match(/drink|beverage|beer|wine|water|coffee|espresso/))
		return 'drinks';

	return null;
};

export const generateAIResponse = (
	userMessage: string,
	cart: any[],
	onAddToCart?: (item: MenuItem) => void,
): {
	text: string;
	suggestedItems?: MenuItem[];
	autoAddedItems?: MenuItem[];
} => {
	const lowerMessage = userMessage.toLowerCase();
	const autoAddedItems: MenuItem[] = [];

	// Check if response contains menu IDs and extract suggested items
	const menuIds = extractMenuIds(userMessage);
	const suggestedItemsFromIds = getMenuItemsByIds(menuIds);

	// PAYMENT METHOD HANDLING
	// Check if user is specifying payment method after checkout
	if (
		lowerMessage.match(/pay\s*€?\d+\.?\d*\s*(using|with|via|by)/i) ||
		(lowerMessage.match(/pay|payment/) &&
			(lowerMessage.includes('cash') ||
				lowerMessage.includes('credit') ||
				lowerMessage.includes('debit') ||
				lowerMessage.includes('card') ||
				lowerMessage.includes('qr')))
	) {
		let paymentMethod = '';
		let methodEmoji = '';
		let methodDetails = '';

		if (lowerMessage.includes('cash')) {
			paymentMethod = 'Cash';
			methodEmoji = '💵';
			methodDetails =
				'Our server will bring your bill to the table. Exact change is appreciated but not required.';
		} else if (
			lowerMessage.includes('credit') ||
			lowerMessage.includes('debit') ||
			lowerMessage.includes('card')
		) {
			paymentMethod = 'Credit/Debit Card';
			methodEmoji = '💳';
			methodDetails =
				'Perfect! Our server will bring a secure payment terminal to your table. We accept Visa, Mastercard, and Amex. Contactless payment is available.';
		} else if (lowerMessage.includes('qr')) {
			paymentMethod = 'QR Code';
			methodEmoji = '📱';
			methodDetails =
				'Excellent choice! A QR code has been displayed above. Simply scan it with your mobile payment app (Apple Pay, Google Pay, Alipay, or WeChat Pay) to complete your payment securely.';
		}

		if (paymentMethod) {
			return {
				text: `${methodEmoji} **${paymentMethod} Selected**\n\n${methodDetails}\n\n✅ **Next Steps:**\n• Your order has been sent to the kitchen\n• Your food will be prepared fresh\n• Estimated time: 15-20 minutes\n\n🌟 Thank you for dining at **Lumière Dorée**! Our team will ensure your meal is extraordinary.\n\n💡 While you wait, would you like to:\n• Add drinks or dessert?\n• Learn about our chef's specials?\n• Get recommendations for your next visit?`,
			};
		}
	}

	// GUEST COUNT HANDLING
	// Check if user is specifying number of guests
	if (
		lowerMessage.match(/(\d+)\s*(adult|child|children|senior|guest)/i) ||
		lowerMessage.match(/we have|party of|table for/i)
	) {
		// Extract guest counts
		const adultMatch = lowerMessage.match(/(\d+)\s*adult/i);
		const childMatch = lowerMessage.match(/(\d+)\s*child(?:ren)?/i);
		const seniorMatch = lowerMessage.match(/(\d+)\s*senior/i);
		const totalMatch = lowerMessage.match(
			/(\d+)\s*guest|party of (\d+)|table for (\d+)/i,
		);

		const adults = adultMatch ? parseInt(adultMatch[1]) : 0;
		const children = childMatch ? parseInt(childMatch[1]) : 0;
		const seniors = seniorMatch ? parseInt(seniorMatch[1]) : 0;
		const total = adults + children + seniors;

		let guestSummary: string[] = [];
		if (adults > 0)
			guestSummary.push(`${adults} adult${adults > 1 ? 's' : ''}`);
		if (children > 0)
			guestSummary.push(`${children} child${children > 1 ? 'ren' : ''}`);
		if (seniors > 0)
			guestSummary.push(`${seniors} senior${seniors > 1 ? 's' : ''}`);

		const guestText =
			guestSummary.length > 0
				? guestSummary.join(', ')
				: `${total} guest${total > 1 ? 's' : ''}`;

		const kidsRecommendation =
			children > 0
				? `\\n\\n👶 **Kids Menu:** Since you have ${children} child${
						children > 1 ? 'ren' : ''
				  }, may I recommend our Kids Meals? They're specially designed for younger palates!`
				: '';

		return {
			text: `Perfect! I've noted your party size: **${guestText}** (${total} total). 🎉\\n\\nI'll make sure to recommend dishes and portion sizes suitable for your group!${kidsRecommendation}\\n\\n✨ **What would you like to explore?**\\n• \"Show me your popular dishes\"\\n• \"What do you recommend for ${total} people?\"\\n• \"I'd like to start with appetizers\"\\n\\nHow can I help you with your order?`,
			suggestedItems:
				children > 0
					? menuData
							.filter(
								(item) =>
									item.name.toLowerCase().includes('kids') ||
									item.category === 'starter',
							)
							.slice(0, 3)
					: menuData.filter((item) => item.popular).slice(0, 3),
		};
	}

	// INTELLIGENT ORDER PROCESSING
	// Check if user is trying to order something
	if (hasOrderingIntent(lowerMessage)) {
		const foundItems = findMenuItems(lowerMessage);
		const quantity = extractQuantity(lowerMessage);

		if (foundItems.length > 0) {
			const item = foundItems[0];

			// Auto-add to cart if callback provided
			if (onAddToCart) {
				for (let i = 0; i < quantity; i++) {
					onAddToCart(item);
				}
				autoAddedItems.push(item);
			}

			// Get pairing suggestions
			const pairings = getPairingRecommendations([item]);

			const quantityText = quantity > 1 ? ` (×${quantity})` : '';
			const pairingText =
				pairings.length > 0
					? `\n\n🍷 **Perfect Pairing Suggestion:**\nMay I recommend our **${
							pairings[0].name
					  }** ($${pairings[0].price.toFixed(2)})? It complements the ${
							item.name
					  } beautifully!`
					: '';

			return {
				text: `Excellent choice! ✨\n\nI've added **${
					item.name
				}**${quantityText} to your cart.\n\n📋 ${
					item.description
				}\n💰 **Price:** $${item.price.toFixed(
					2,
				)}${pairingText}\n\nWould you like to add anything else, or shall we proceed to checkout?`,
				suggestedItems: pairings.length > 0 ? pairings : foundItems.slice(1, 3),
				autoAddedItems,
			};
		} else {
			// User wants to order but we couldn't identify the item
			return {
				text: `I'd love to help you order! 🍽️ I didn't quite catch which dish you'd like.\n\nYou can say:\n• "I'll have the Wiener Schnitzel"\n• "2 Bavarian Pretzels please"\n• "Add Black Forest Cake to my order"\n\nOr ask me:\n• "What do you recommend?"\n• "Show me your starters"\n• "What's vegetarian?"\n\nHow can I assist you?`,
			};
		}
	}

	// Greetings
	if (lowerMessage.match(/^(hi|hello|hey|good|bonjour|greetings|hola|howdy)/)) {
		const popularItems = menuData.filter((item) => item.popular);
		return {
			text: `Good evening! 🌟 Welcome to Lumière Dorée. I'm your AI Waiter, and I'm absolutely delighted to be your personal dining guide tonight.\n\n✨ **I'm here to help you with:**\n• 🍽️ Personalized menu recommendations\n• 🍷 Expert wine & food pairings\n• 🌱 Dietary preferences & allergen info\n• 🛒 Quick & easy ordering\n• 💬 Any questions about our dishes\n\n**Just tell me what you're craving, or try:**\n• "Show me the menu"\n• "I'd like something with chicken"\n• "What's your best dessert?"\n• "I'll have the Schnitzel"\n\nWhat sounds delightful to you today?`,
			suggestedItems: popularItems.slice(0, 3),
		};
	}

	// Menu requests
	if (
		lowerMessage.match(
			/menu|what do you have|show me|what.*serve|see.*food|browse/,
		)
	) {
		const category = detectCategory(lowerMessage);

		if (category) {
			const items = menuData.filter((i) => i.category === category);
			const categoryNames: { [key: string]: string } = {
				starter: 'Starters & Appetizers',
				main: 'Main Courses',
				dessert: 'Desserts',
				drinks: 'Beverages',
			};

			return {
				text:
					`Here are our exquisite **${categoryNames[category]}**: ✨\n\n` +
					items
						.map(
							(i) =>
								`**${i.name}** - $${i.price.toFixed(2)}\n${i.description}${
									i.popular ? ' ⭐' : ''
								}`,
						)
						.join('\n\n') +
					`\n\n💡 **Tip:** Just say "I'll have the ${items[0].name}" to order instantly!\n\nWhat catches your eye?`,
				suggestedItems: items,
			};
		}

		const starters = menuData
			.filter((i) => i.category === 'starter')
			.slice(0, 2);
		const mains = menuData.filter((i) => i.category === 'main').slice(0, 2);
		const desserts = menuData
			.filter((i) => i.category === 'dessert')
			.slice(0, 2);

		return {
			text:
				`Our menu showcases the finest culinary artistry! ✨\n\n🥨 **Starters**\n` +
				starters.map((i) => `• ${i.name} - $${i.price.toFixed(2)}`).join('\n') +
				`\n\n🍖 **Main Courses**\n` +
				mains.map((i) => `• ${i.name} - $${i.price.toFixed(2)}`).join('\n') +
				`\n\n🍰 **Desserts**\n` +
				desserts.map((i) => `• ${i.name} - ${i.price.toFixed(2)}`).join('\n') +
				`\n\nWould you like to see drinks, or shall I make a recommendation?`,
			suggestedItems: [...starters, ...mains],
		};
	}

	// Recommendations - Most intelligent part
	if (
		lowerMessage.match(
			/recommend|suggest|popular|special|best|favorite|chef.*choice|what.*good|signature/,
		)
	) {
		const popularItems = menuData.filter((item) => item.popular);

		// Check what's already in cart for smart recommendations
		const cartCategories = cart.map((item) => item.category);
		const hasMain = cartCategories.includes('main');
		const hasStarter = cartCategories.includes('starter');
		const hasDessert = cartCategories.includes('dessert');
		const hasDrink = cartCategories.includes('drinks');

		if (cart.length > 0 && !hasDessert) {
			const desserts = menuData.filter(
				(i) => i.category === 'dessert' && i.popular,
			);
			return {
				text: `Based on your current selections, I have the perfect recommendation! 🌟\n\n**Complete your meal with:**\n\n🍰 **${
					desserts[0].name
				}** ($${desserts[0].price.toFixed(2)})\n${
					desserts[0].description
				}\n\n✨ This pairs beautifully with what you've ordered!\n\n*Just say "add it" or "I'll take the cake" to order!*\n\nWould you like to hear about other desserts or beverages?`,
				suggestedItems: desserts.slice(0, 3),
			};
		}

		if (cart.length > 0 && !hasDrink) {
			const drinks = menuData.filter((i) => i.category === 'drinks');
			const pairings = getPairingRecommendations(cart);
			const recommendedDrink =
				pairings.find((p) => p.category === 'drinks') || drinks[0];

			return {
				text: `Perfect timing! Let me suggest the ideal beverage pairing: 🍷\n\n**${
					recommendedDrink.name
				}** ($${recommendedDrink.price.toFixed(2)})\n${
					recommendedDrink.description
				}\n\n✨ This complements your order beautifully!\n\n*Just say "add it" to include this in your order!*\n\nWould you like to see other drink options?`,
				suggestedItems: drinks.slice(0, 3),
			};
		}

		return {
			text:
				`Ah, excellent! Let me share our **Chef's Top Selections**: 🌟\n\n` +
				`🥩 **Wiener Schnitzel** ($18.90)\nOur signature dish! Perfectly crispy veal cutlet with potato salad and lingonberry jam. *Chef's note: Traditional Viennese recipe passed down through generations.*\n\n` +
				`🥘 **Rinderrouladen** ($22.90)\nTender beef rolls in rich gravy - a true German classic that melts in your mouth.\n\n` +
				`🍰 **Black Forest Cake** ($8.50)\nDivine chocolate layers with cherries - don't leave without trying this masterpiece!\n\n` +
				`💡 **Pro tip:** Say "I'll have the Schnitzel" to order instantly!\n\n` +
				`These pair beautifully with our Bavarian Wheat Beer or Riesling Wine. What tempts you?`,
			suggestedItems: popularItems,
		};
	}

	// Specific item inquiries
	const queriedItems = findMenuItems(lowerMessage);
	if (queriedItems.length > 0 && !hasOrderingIntent(lowerMessage)) {
		const item = queriedItems[0];
		const pairings = getPairingRecommendations([item]);
		const pairingText =
			pairings.length > 0
				? `\n\n🍷 **Perfect Pairing:** ${
						pairings[0].name
				  } ($${pairings[0].price.toFixed(2)})`
				: '';

		return {
			text: `Great question about the **${item.name}**! 🍽️✨\n\n${
				item.description
			}\n\n💰 **Price:** $${item.price.toFixed(2)}\n🌿 **Vegetarian:** ${
				item.vegetarian ? 'Yes' : 'No'
			}\n⏱️ **Prep Time:** ${
				item.prepTime || '10-15 mins'
			}\n⚠️ **Allergens:** ${
				item.allergens.length > 0 ? item.allergens.join(', ') : 'None'
			}${pairingText}\n\n${
				item.popular
					? '⭐ **Guest Favorite!** This is one of our most beloved dishes!\n\n'
					: ''
			}💡 **To order:** Just say "I'll have the ${
				item.name
			}" or "Add it to my cart"!\n\nWould you like to know more or shall I add this to your order?`,
			suggestedItems:
				pairings.length > 0
					? [...pairings, ...queriedItems.slice(1)]
					: queriedItems,
		};
	}

	// Vegetarian
	if (lowerMessage.match(/vegetarian|veggie|no meat|plant.*based|vegan/)) {
		const veggieItems = menuData.filter((item) => item.vegetarian);
		return {
			text:
				`Wonderful! We have exquisite vegetarian options: 🌱✨\n\n` +
				veggieItems
					.map(
						(item) =>
							`**${item.name}** ($${item.price.toFixed(2)})\n${
								item.description
							}${item.popular ? ' ⭐' : ''}`,
					)
					.join('\n\n') +
				`\n\n✨ All prepared with the same Michelin-inspired care as our other dishes!\n\nWhich one tempts you?`,
			suggestedItems: veggieItems,
		};
	}

	// NEW: Kids & Family Options
	if (lowerMessage.match(/kids|children|child|for kids|kid menu|kids meal/)) {
		const kidFriendly = [
			menuData.find((i) => i.name === 'Käsespätzle'),
			menuData.find((i) => i.name === 'Bavarian Pretzel'),
			menuData.find((i) => i.name === 'Wiener Schnitzel'),
		].filter(Boolean);

		return {
			text:
				'Great choice for the little ones! 👶✨\n\nOur **kid-friendly options:**\n\n' +
				'🧀 **Käsespätzle** ($12.90)\nKids love these cheesy German noodles - like a gourmet mac & cheese!\n\n' +
				'🥨 **Bavarian Pretzel** ($6.90)\nSoft, warm pretzel with cheese dip - perfect for small hands!\n\n' +
				'🍗 **Wiener Schnitzel** (Small Portion Available)\nWe can serve a child-sized portion of our famous Schnitzel!\n\n' +
				"💡 **Note:** We're happy to make half-portions of most main dishes for children. Just ask!\n\nWhat would the children like?",
			suggestedItems: kidFriendly as MenuItem[],
		};
	}

	if (
		lowerMessage.match(/family|group|sharing|share|for sharing|family meal/)
	) {
		const sharingItems = [
			menuData.find((i) => i.name === 'Bratwurst Platter'),
			menuData.find((i) => i.name === 'Flammkuchen'),
			menuData.find((i) => i.name === 'Bavarian Pretzel'),
		].filter(Boolean);

		return {
			text:
				'Perfect for a family meal! 👨‍👩‍👧‍👦✨\n\n**Great for sharing:**\n\n' +
				'🌭 **Bratwurst Platter** ($15.90)\n3 Nuremberg sausages - perfect for 2-3 people!\n\n' +
				'🍕 **Flammkuchen** ($14.90)\nLarge German-style flatbread - great for the table!\n\n' +
				'🥨 **Bavarian Pretzel** ($6.90)\nWarm pretzel with cheese dip - everyone loves it!\n\n' +
				'💡 **Tip:** We can prepare family-sized portions of Käsespätzle and most mains. Just ask!\n\n' +
				'How many are dining today?',
			suggestedItems: sharingItems as MenuItem[],
		};
	}

	// NEW: Diet & Healthy Options
	if (
		lowerMessage.match(
			/diet|healthy|health|diet-friendly|diet dishes|light|lighter|low.?cal/,
		)
	) {
		const healthyItems = [
			menuData.find((i) => i.name === 'Kartoffelsalat'),
			menuData.find((i) => i.name === 'Bratwurst Platter'),
			menuData.find((i) => i.name === 'Sauerbraten'),
		].filter(Boolean);

		return {
			text:
				'Excellent choice for health-conscious dining! 💪✨\n\n**Our lighter, healthy options:**\n\n' +
				'🥗 **Kartoffelsalat** ($8.90)\nGerman potato salad - light and refreshing!\n\n' +
				'🌭 **Bratwurst (Grilled)** ($15.90)\nWe can prepare with less oil - pure, quality meat!\n\n' +
				'🥩 **Sauerbraten** ($22.90)\nLean beef pot roast - can be served with extra vegetables instead of heavy sides\n\n' +
				'💡 **Custom Requests:** We can prepare most dishes with:\n• Extra vegetables\n• Less oil/butter\n• Lighter sauces\n• Smaller portions\n\n' +
				'What appeals to you?',
			suggestedItems: healthyItems as MenuItem[],
		};
	}

	if (lowerMessage.match(/low.?carb|keto|high.?protein/)) {
		const lowCarbItems = [
			menuData.find((i) => i.name === 'Wiener Schnitzel'),
			menuData.find((i) => i.name === 'Sauerbraten'),
			menuData.find((i) => i.name === 'Bratwurst Platter'),
		].filter(Boolean);

		return {
			text:
				'Perfect for low-carb/keto! 🥩✨\n\n**High-protein, low-carb options:**\n\n' +
				'🍗 **Wiener Schnitzel** (without breading) ($18.90)\nPure veal cutlet - skip the breading for keto!\n\n' +
				'🥩 **Sauerbraten** ($22.90)\nMarinated beef pot roast - order without dumplings, extra veggies instead\n\n' +
				'🌭 **Bratwurst** ($15.90)\nPure meat sausages - skip the bread and sauerkraut sides\n\n' +
				"💡 **Keto-Friendly Tip:** Order any meat dish without bread, noodles, or potato sides. We'll add extra vegetables!\n\n" +
				'Which protein sounds good?',
			suggestedItems: lowCarbItems as MenuItem[],
		};
	}

	// NEW: Soups & Salads - FIXED
	if (lowerMessage.match(/\bsalad\b|\bsalads\b/)) {
		const saladItems = [
			menuData.find((i) => i.name === 'Kartoffelsalat'),
		].filter(Boolean);

		return {
			text:
				`Fresh salad options! 🥗✨\n\n` +
				`**Kartoffelsalat** ($8.90)\nAuthentic German potato salad with bacon, herbs, and tangy dressing - a must-try!\n\n` +
				`We can also prepare fresh green salads with German dressing as a side.\n\nWould you like to add this?`,
			suggestedItems: saladItems as MenuItem[],
		};
	}

	if (lowerMessage.match(/\bsoup\b|\bsoups\b/)) {
		return {
			text:
				`Warm soup selection! 🍲✨\n\n` +
				`**Today's Special: Traditional German Potato Soup**\n` +
				`Hearty potato soup with bacon, vegetables, and fresh herbs. Served with crusty bread.\n\n` +
				`💡 Available as a starter or light meal!\n\nWould you like to add soup to your order?`,
		};
	}

	// NEW: Quick & Convenience
	if (lowerMessage.match(/quick|fast|express|ready fast|quick meal/)) {
		const quickItems = [
			menuData.find((i) => i.name === 'Bavarian Pretzel'),
			menuData.find((i) => i.name === 'Bratwurst Platter'),
			menuData.find((i) => i.name === 'Flammkuchen'),
		].filter(Boolean);

		return {
			text:
				`Fast service options! ⚡✨\n\n**Ready quickly:**\n\n` +
				`🥨 **Bavarian Pretzel** - Ready NOW! ($6.90)\n` +
				`🌭 **Bratwurst Platter** - 10 minutes ($15.90)\n` +
				`🍕 **Flammkuchen** - 15 minutes ($14.90)\n\n` +
				`All prepared fresh but served quickly!\n\n` +
				`💡 **Quick order:** Say "Pretzel now" or "Fast Bratwurst"\n\nWhat would you like?`,
			suggestedItems: quickItems as MenuItem[],
		};
	}

	// NEW: Lunch Specials
	if (lowerMessage.match(/lunch special|lunch deal/)) {
		const lunchItems = [
			menuData.find((i) => i.name === 'Wiener Schnitzel'),
			menuData.find((i) => i.name === 'Bratwurst Platter'),
			menuData.find((i) => i.name === 'Käsespätzle'),
		].filter(Boolean);

		return {
			text:
				`Today's Lunch Specials! 🍽️✨\n\n` +
				`**Special Pricing (includes drink):**\n\n` +
				`🍗 **Schnitzel Lunch** - $16.90 (save $2!)\n` +
				`🌭 **Bratwurst Special** - $12.90 (save $3!)\n` +
				`🧀 **Käsespätzle Lunch** - $10.90 (save $2!)\n\n` +
				`Available until 3 PM daily!\n\n` +
				`💡 **Quick order:** Say "Lunch Schnitzel" or "Bratwurst special"\n\nWhich appeals to you?`,
			suggestedItems: lunchItems as MenuItem[],
		};
	}

	// NEW: Traditional & Bavarian
	if (lowerMessage.match(/traditional|authentic|classic|regional/)) {
		const traditionalItems = [
			menuData.find((i) => i.name === 'Sauerbraten'),
			menuData.find((i) => i.name === 'Rinderrouladen'),
			menuData.find((i) => i.name === 'Wiener Schnitzel'),
		].filter(Boolean);

		return {
			text:
				`Authentic German tradition! 🇩🇪✨\n\n**Most traditional dishes:**\n\n` +
				`🥩 **Sauerbraten** ($22.90)\nMarinated pot roast - authentic family recipe, marinated for 3 days!\n\n` +
				`🥩 **Rinderrouladen** ($22.90)\nBeef rolls with pickles and mustard - grandmother's recipe!\n\n` +
				`🍗 **Wiener Schnitzel** ($18.90)\nClassic Viennese breaded veal - prepared the traditional way!\n\n` +
				`All recipes passed down through generations! 👨‍🍳\n\n` +
				`Which classic sounds good?`,
			suggestedItems: traditionalItems as MenuItem[],
		};
	}

	if (lowerMessage.match(/bavarian|bayern|bavaria/)) {
		const bavarianItems = [
			menuData.find((i) => i.name === 'Bavarian Pretzel'),
			menuData.find((i) => i.name === 'Käsespätzle'),
			menuData.find((i) => i.name === 'Bratwurst Platter'),
		].filter(Boolean);

		return {
			text:
				`Authentic Bavarian specialties! 🥨✨\n\n` +
				`🥨 **Bavarian Pretzel** ($6.90)\nWith Obatzda cheese dip - pure Bavaria!\n\n` +
				`🧀 **Käsespätzle** ($12.90)\nBavarian egg noodles with melted cheese\n\n` +
				`🌭 **Bratwurst** ($15.90)\nNuremberg-style sausages - traditional recipe!\n\n` +
				`💡 **Pro tip:** Pair with our Bavarian Wheat Beer for the full experience!\n\n` +
				`What Bavarian treat would you like?`,
			suggestedItems: bavarianItems as MenuItem[],
		};
	}

	// Spicy
	if (lowerMessage.match(/spicy|hot|heat|pepper/)) {
		return {
			text: `Our traditional German cuisine focuses on rich, refined flavors rather than heat. 🌶️\n\nHowever, I can arrange:\n• 🔥 Extra mustard with the Bratwurst\n• 🔥 Horseradish on the side\n• 🔥 Spiced accompaniments\n• 🔥 Special kitchen requests\n\nWould you like to order any dish with these additions? Just let me know!`,
		};
	}

	// Allergens
	if (lowerMessage.match(/allergen|allergy|gluten|dairy|lactose|nut|egg/)) {
		const allergenType = lowerMessage.includes('gluten')
			? 'gluten'
			: lowerMessage.includes('dairy') || lowerMessage.includes('lactose')
			? 'dairy'
			: lowerMessage.includes('nut')
			? 'nuts'
			: lowerMessage.includes('egg')
			? 'eggs'
			: null;

		if (allergenType) {
			const safeItems = menuData.filter(
				(item) => !item.allergens.includes(allergenType),
			);
			return {
				text:
					`I appreciate you letting me know! Food safety is our priority. 🏥✨\n\n**${allergenType.toUpperCase()}-FREE OPTIONS:**\n\n` +
					safeItems
						.slice(0, 4)
						.map(
							(item) =>
								`**${item.name}** ($${item.price.toFixed(2)})\n${
									item.description
								}\n*Allergens: ${
									item.allergens.length > 0 ? item.allergens.join(', ') : 'None'
								}*`,
						)
						.join('\n\n') +
					`\n\n💡 **To order:** Just say "I'll have the ${safeItems[0].name}"\n\nOur kitchen takes allergies very seriously. Would you like detailed info on any specific dish?`,
				suggestedItems: safeItems.slice(0, 4),
			};
		}
		return {
			text: `Allergen safety is our top priority! 🏥\n\nEach dish displays allergen information. Common allergens in our kitchen:\n• Gluten\n• Dairy\n• Eggs\n• Mustard\n• Nuts\n\nWhich allergen should I help you avoid? I'll show you safe, delicious options!`,
		};
	}

	// Cart/Order status (view cart, not checkout - checkout is handled separately below)
	if (
		lowerMessage.match(
			/(?:my|show|view|see).*(?:cart|order|basket)|what.*(?:did i|have i).*order|what.*i.*(?:have|get|order)|my.*item/,
		)
	) {
		if (cart.length === 0) {
			const popularItems = menuData.filter((item) => item.popular);
			return {
				text: `Your cart is currently empty! 🛒✨\n\nLet me help you start your culinary journey:\n\n🌟 **Popular Choices:**\n• Wiener Schnitzel - Our signature!\n• Bavarian Pretzel - Perfect starter\n• Black Forest Cake - Divine dessert\n\n💡 **Quick order:** Just say "I want the Schnitzel" and I'll add it!\n\nWhat type of cuisine calls to you today?`,
				suggestedItems: popularItems,
			};
		}

		const total = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		const itemsList = cart
			.map(
				(item) =>
					`• ${item.name} ×${item.quantity} ($${(
						item.price * item.quantity
					).toFixed(2)})`,
			)
			.join('\n');

		// Smart suggestions based on cart
		const cartHasDessert = cart.some(
			(item: any) => item.category === 'dessert',
		);
		const cartHasDrink = cart.some((item: any) => item.category === 'drinks');

		let suggestion = '';
		if (!cartHasDessert) {
			suggestion =
				'\n\n💡 **Suggestion:** Complete your meal with our Black Forest Cake ($8.50)! Just say "add dessert"!';
		} else if (!cartHasDrink) {
			suggestion =
				'\n\n💡 **Suggestion:** Pair your meal with Bavarian Wheat Beer ($4.90)! Just say "add beer"!';
		}

		return {
			text: `Here's your current order: 📋\n\n${itemsList}\n\n**Subtotal:** $${total.toFixed(
				2,
			)}${suggestion}\n\nWould you like to:\n• Add more items (just tell me what!)\n• Proceed to checkout\n• Get pairing suggestions\n• Modify your order`,
		};
	}

	// Wine/Drinks
	if (
		lowerMessage.match(/wine|drink|beer|beverage|alcohol|cocktail|coffee|water/)
	) {
		const drinks = menuData.filter((item) => item.category === 'drinks');
		return {
			text:
				`Excellent inquiry! Our beverage selection is curated to perfection: 🍷✨\n\n` +
				drinks
					.map(
						(item) =>
							`**${item.name}** ($${item.price.toFixed(2)})\n${
								item.description
							}${item.popular ? ' ⭐ Guest favorite!' : ''}`,
					)
					.join('\n\n') +
				`\n\n💡 **Quick order:** Say "I'll have the Riesling" to add it instantly!\n\nWhat type of pairing are you seeking?`,
			suggestedItems: drinks,
		};
	}

	// Dessert
	if (
		lowerMessage.match(
			/dessert|cake|sweet|strudel|soufflé|souffle|chocolate|pastry/,
		)
	) {
		const desserts = menuData.filter((item) => item.category === 'dessert');
		return {
			text:
				`Our desserts are truly spectacular! 🍰✨\n\n` +
				desserts
					.map(
						(item) =>
							`**${item.name}** ($${item.price.toFixed(2)})\n${
								item.description
							}${item.popular ? ' ⭐ Highly recommended!' : ''}`,
					)
					.join('\n\n') +
				`\n\n✨ *Chef's Note:* Don't miss our signature **Le Chef's Golden Soufflé** - prepared tableside with 24-karat gold dust!\n\n💡 **Quick order:** Say "I want the Black Forest Cake" to order instantly!\n\nWhich sweet ending shall we prepare for you?`,
			suggestedItems: desserts,
		};
	}

	// Starters/Appetizers
	if (
		lowerMessage.match(
			/starter|appetizer|begin|first.*course|to start|small.*plate/,
		)
	) {
		const starters = menuData.filter((item) => item.category === 'starter');
		return {
			text:
				`Let's begin your journey with our refined starters! 🥨✨\n\n` +
				starters
					.map(
						(item) =>
							`**${item.name}** ($${item.price.toFixed(2)})\n${
								item.description
							}${item.popular ? ' ⭐' : ''}`,
					)
					.join('\n\n') +
				`\n\n💡 **Quick order:** Just say "I'll have the Bavarian Pretzel" to add it!\n\nEach starter is designed to awaken your palate. What catches your eye?`,
			suggestedItems: starters,
		};
	}

	// Main courses
	if (lowerMessage.match(/main|entree|entrée|dinner|lunch|hearty|filling/)) {
		const mains = menuData.filter((item) => item.category === 'main');
		return {
			text:
				`Our main courses are the heart of Lumière Dorée! 🍖✨\n\n` +
				mains
					.map(
						(item) =>
							`**${item.name}** ($${item.price.toFixed(2)})\n${
								item.description
							}${item.popular ? ' ⭐ Guest favorite!' : ''}`,
					)
					.join('\n\n') +
				`\n\n💡 **Quick order:** Say "I want the Schnitzel" to order instantly!\n\nWhich one calls to you?`,
			suggestedItems: mains,
		};
	}

	// Price inquiry
	if (lowerMessage.match(/price|cost|how much|expensive|cheap|budget/)) {
		return {
			text:
				`Our pricing reflects the quality and artistry of each dish: 💰\n\n` +
				`🥨 **Starters:** $6.90 - $9.50\n` +
				`🍖 **Main Courses:** $14.50 - $22.90\n` +
				`🍰 **Desserts:** $7.90 - $9.50\n` +
				`🍺 **Beverages:** $3.90 - $6.50\n\n` +
				`Every dish is prepared with Michelin-inspired standards.\n\n💡 **Tip:** Say "Show me mains under $20" or "I want something affordable" for specific recommendations!\n\nWhich price range interests you?`,
		};
	}

	// Thanks
	if (lowerMessage.match(/thank|thanks|appreciate|grateful/)) {
		return {
			text: `You're most welcome! It's my pleasure to serve you. 😊✨\n\n*Remember: You can order simply by saying "I want the Schnitzel" or ask me anything!*\n\nIs there anything else I can help you with?`,
		};
	}

	// Goodbye
	if (lowerMessage.match(/bye|done|that.*all|nothing else|finish|complete/)) {
		if (cart.length > 0) {
			return {
				text: `Thank you for your order! 🙏✨\n\nYour items are ready to be sent to the kitchen. You can:\n• View your cart\n• Add more items (just tell me!)\n• Proceed to checkout\n\nI'm here if you need anything else. Bon appétit! 🍽️`,
			};
		}
		return {
			text: `Thank you for visiting Lumière Dorée! 🙏✨\n\nI hope to serve you soon. Remember, you can return anytime and just say "I want the Schnitzel" to order!\n\nBon appétit! 🍽️`,
		};
	}

	/*
	 * FIXED SECTIONS for aiResponses.ts
	 *
	 * Replace lines 619-676 in aiResponses.ts with the content below
	 * These sections had double-escaped newlines (\n) which caused formatting issues
	 * Now fixed to use single-escaped newlines (\n) for proper rendering
	 */

	// Best Seller / Top Seller
	if (lowerMessage.match(/best.?sell|top.?sell/)) {
		const bestSellers = [
			menuData.find((i) => i.name === 'Wiener Schnitzel'),
			menuData.find((i) => i.name === 'Black Forest Cake'),
			menuData.find((i) => i.name === 'Bavarian Pretzel'),
			menuData.find((i) => i.name === 'Rinderrouladen'),
		].filter(Boolean);

		return {
			text: `Our absolute **Best Sellers**! 🏆✨\n\nThese are our guests' top favorites:\n\n🥇 **Wiener Schnitzel** ($18.90)\nCrispy veal cutlet - ordered 500+ times monthly! Our #1 dish!\n\n🥈 **Black Forest Cake** ($8.50)\nChocolate perfection - 95% of guests order this dessert!\n\n🥉 **Bavarian Pretzel** ($6.90)\nPerfect starter - best-selling appetizer by far!\n\n💡 **Guest Insight:** 8 out of 10 tables order at least one of these!\n\n💡 **Quick order:** Say "I'll have the Schnitzel" to join the majority!\n\nWhich best seller would you like to try?`,
			suggestedItems: bestSellers as MenuItem[],
		};
	}

	// Discount / Vouchers / Offers
	if (lowerMessage.match(/\b(discount|voucher|promo|offer|deal|coupon)s?\b/)) {
		return {
			text: `Excellent timing! We have fantastic offers available! 🎁✨\n\n**Current Promotions:**\n\n🎟️ **WELCOME10** - 10% off your first order\n🎟️ **DINNER20** - €20 off orders over €100\n🎟️ **DESSERT50** - 50% off desserts with main course\n🎟️ **COMBO15** - 15% off when ordering 3+ items\n\n**Loyalty Program:**\n✨ Every €50 spent = 1 free dessert\n✨ Birthday month = 20% off entire order\n\n💡 **How to use:** Vouchers are automatically applied at checkout when eligible!\n\nWould you like to start ordering to use these offers?`,
		};
	}

	// Bill / Check (but not checkout)
	if (
		lowerMessage.match(/\b(bill|check)\b/) &&
		!lowerMessage.match(/checkout/)
	) {
		if (cart.length === 0) {
			return {
				text: `Your cart is currently empty! 🛒\n\nYou'll need to order first before I can prepare your bill.\n\n💡 **Quick start:** Say "What do you recommend?" or "I'll have the Schnitzel"\n\nWould you like to see the menu?`,
				suggestedItems: menuData.filter((item) => item.popular).slice(0, 3),
			};
		}

		const subtotal = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		const tax = subtotal * 0.19;
		const total = subtotal + tax;
		const itemsList = cart
			.map(
				(item) =>
					`• ${item.name} ×${item.quantity} - €${(
						item.price * item.quantity
					).toFixed(2)}`,
			)
			.join('\n');

		return {
			text: `Here's your bill summary: 🧾✨\n\n**Your Order:**\n${itemsList}\n\n**Subtotal:** €${subtotal.toFixed(
				2,
			)}\n**Tax (19% VAT):** €${tax.toFixed(
				2,
			)}\n**═════════════**\n**Total:** €${total.toFixed(
				2,
			)}\n\n💡 **Payment methods available:**\n• Credit/Debit Card\n• Apple Pay / Google Pay\n• Cash\n• Digital Wallets\n\nReady to proceed to checkout? Just say "Checkout" or "Pay now"!`,
		};
	}

	// Checkout / Payment
	if (
		lowerMessage.match(/checkout|pay\s*now|payment|proceed.*pay|ready.*pay/)
	) {
		if (cart.length === 0) {
			return {
				text: `Your cart is empty! 🛒\n\nPlease add items to your order first.\n\n💡 **Quick order:** Say "I want the Schnitzel" or "Show me the menu"\n\nWhat would you like to order?`,
				suggestedItems: menuData.filter((item) => item.popular).slice(0, 3),
			};
		}

		const total = cart.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		const tax = total * 0.19;
		const grandTotal = total + tax;

		// Use payment helper for formatted checkout response
		return {
			text: `Perfect! Let's proceed to checkout! 💳✨\n\n**Order Summary:**\n📦 ${
				cart.length
			} item(s) - ${cart.reduce(
				(sum, item) => sum + item.quantity,
				0,
			)} total dishes\n💰 Total: €${grandTotal.toFixed(
				2,
			)} (incl. 19% VAT)\n\n**Next Steps:**\n1️⃣ Click the **Cart** button (top right) to review\n2️⃣ Confirm your order\n3️⃣ Choose payment method\n4️⃣ Your order goes straight to the kitchen!\n\n✨ **Estimated prep time:** 25-35 minutes\n\n💡 **Want to add anything else?** Just tell me before checking out!\n\nReady to view your cart?`,
		};
	}

	// Chef inquiry
	if (lowerMessage.match(/chef|marie|laurent|cook|kitchen/)) {
		return {
			text: `Ah, you're curious about Chef Marie Laurent! 👨‍🍳✨\n\nOur Executive Chef trained at Le Cordon Bleu in Paris and brings 15 years of Michelin-starred experience to every dish.\n\nHer philosophy: *"Food is poetry, technology is the pen. Together, we write stories worth savoring."*\n\nHer signature creation, the **Golden Soufflé**, is a must-try!\n\n💡 **Want to try it?** Just say "I'll have the Golden Soufflé"!\n\nWould you like to hear about her other specialties?`,
		};
	}

	// Pairing help
	if (lowerMessage.match(/pair|goes with|match|complement/)) {
		if (cart.length > 0) {
			const pairings = getPairingRecommendations(cart);
			if (pairings.length > 0) {
				return {
					text:
						`Perfect! Based on your current order, here are ideal pairings: 🍷✨\n\n` +
						pairings
							.slice(0, 3)
							.map(
								(item) =>
									`**${item.name}** ($${item.price.toFixed(2)})\n${
										item.description
									}`,
							)
							.join('\n\n') +
						`\n\n💡 **Quick add:** Just say "add the ${pairings[0].name}" or "I'll take the wine"!\n\nWould you like to add any of these?`,
					suggestedItems: pairings,
				};
			}
		}

		return {
			text: `I excel at creating perfect pairings! 🍷✨\n\nTell me what you're ordering, and I'll suggest:\n• The ideal wine or beer\n• Complementary side dishes\n• Dessert to complete your experience\n\n💡 **Try saying:** "What pairs with Schnitzel?" or "I have the beef, what should I drink?"\n\nWhat would you like me to pair?`,
		};
	}

	// Nutritional info
	if (lowerMessage.match(/calorie|nutrition|healthy|protein|carb|fat|diet/)) {
		return {
			text: `I can provide detailed nutritional information for any dish! 🥗\n\n💡 **Try asking:**\n• "What are the calories in Schnitzel?"\n• "Show me low-calorie options"\n• "What's the healthiest main course?"\n\nOr browse the menu - each item shows nutritional details!\n\nWhich dish would you like to know about?`,
		};
	}

	// Default intelligent response with context
	const responses = [
		`That's interesting! 🤔 I'm here to help you discover the perfect meal.\n\n💡 **Try saying:**\n• "I want the Schnitzel" (instant order)\n• "What do you recommend?"\n• "Show me vegetarian options"\n• "What's in the cart?"\n\nHow can I assist you?`,
		`I'd love to help with that! 😊\n\n✨ **I can help you:**\n• Order instantly: "I'll have the pretzel"\n• Get recommendations: "What's good?"\n• Check allergens: "Is it gluten-free?"\n• See your cart: "What did I order?"\n\nWhat interests you?`,
		`Wonderful question! Let me guide you through Lumière Dorée's culinary artistry. 🌟\n\n💡 **Quick tips:**\n• Order by saying: "I want [dish name]"\n• Ask: "What's your best dessert?"\n• Request: "Show me the menu"\n\nWhat can I help you with?`,
	];

	// If response contains menu IDs, return suggested items
	if (suggestedItemsFromIds.length > 0) {
		return {
			text: userMessage, // Return the original response text
			suggestedItems: suggestedItemsFromIds,
		};
	}

	return {
		text: responses[Math.floor(Math.random() * responses.length)],
		suggestedItems: menuData.filter((item) => item.popular).slice(0, 3),
	};
};

// Quick action keywords that will be expanded into full sentences
// These are shown as buttons in the chat interface
// Note: The actual buttons displayed are context-aware and selected by getContextualQuickActions()
export const quickReplies = [
	// Core Navigation
	'Menu',
	'Popular',
	'Specials',

	// Special Categories (NEW)
	'Kids Meals',
	'Diet Dishes',
	'Healthy',
	'Light Options',
	'Salads',
	'Soups',

	// Dietary
	'Vegetarian',
	'Vegan',
	'Gluten-free',

	// Quick Orders
	'Schnitzel',
	'Desserts',
	'Drinks',

	// Service
	'Discounts',
	'Recommend',
	'My cart',
	'Bill',
	'Help',

	// Additional Options
	'Lunch Specials',
	'Family Meal',
	'Traditional',
	'Quick Meal',
	'Sharing',
];
