import React from 'react';
import { ImageMessage } from '../components/chat/ImageMessage';
import { AccountInfoCard } from '../components/chat/AccountInfoCard';

// Function to detect image URLs in text
const detectImageUrls = (text: string): string[] => {
	// Regex để nhận diện link ảnh, bao gồm cả link có @ ở đầu
	const imageUrlRegex = /@?(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|svg|webp|bmp|ico)(?:\?[^\s]*)?)/gi;
	const matches = text.match(imageUrlRegex);
	return matches ? matches.map(url => url.startsWith('@') ? url.substring(1) : url) : [];
};

// Function to extract payment info from QR code URL
const extractPaymentInfo = (url: string) => {
	// Extract amount from QR code data
	const amountMatch = url.match(/LumiereDoreePay[^_]*_([\d.]+)/);
	const amount = amountMatch ? `€${amountMatch[1]}` : '€45.67';
	
	// Extract table number from QR code data
	const tableMatch = url.match(/Table(\d+)/);
	const tableNumber = tableMatch ? tableMatch[1] : '5';
	
	return { amount, tableNumber };
};

// Function to render image from URL
const renderImage = (url: string, index: number): React.ReactNode => {
	// Check if this is a QR code for payment (more specific detection)
	const isPaymentQRCode = url.includes('qrserver.com') && 
		(url.includes('LumiereDoreePay') || url.includes('payment') || url.includes('pay'));
	
	if (isPaymentQRCode) {
		const { amount, tableNumber } = extractPaymentInfo(url);
		
		return (
			<React.Fragment key={`qr-with-account-${index}`}>
				<ImageMessage url={url} />
				<AccountInfoCard
					accountNumber="1234567890"
					bankName="Vietcombank"
					accountHolder="LUMIERE DORE RESTAURANT"
					amount={amount}
					content={`Thanh toan ban an - Table #${tableNumber}`}
					tableNumber={tableNumber}
				/>
			</React.Fragment>
		);
	}
	
	return <ImageMessage key={`image-${index}`} url={url} />;
};

// Function to render HTML content safely
export const renderHTML = (text: string): React.ReactNode => {
	// First detect image URLs
	const imageUrls = detectImageUrls(text);
	
	// If there are image URLs, split text and render images
	if (imageUrls.length > 0) {
		let processedText = text;
		const elements: React.ReactNode[] = [];
		let lastIndex = 0;
		
		// Tìm tất cả các vị trí của URL (bao gồm cả @ ở đầu)
		const urlPositions: { url: string; startIndex: number; endIndex: number }[] = [];
		imageUrls.forEach((url) => {
			// Loại bỏ @ nếu có
			const cleanUrl = url.startsWith('@') ? url.substring(1) : url;
			
			// Tìm URL với @ ở đầu
			const withAt = `@${cleanUrl}`;
			const withAtIndex = processedText.indexOf(withAt);
			if (withAtIndex !== -1) {
				urlPositions.push({
					url: cleanUrl,
					startIndex: withAtIndex,
					endIndex: withAtIndex + withAt.length
				});
			} else {
				// Tìm URL không có @
				const urlIndex = processedText.indexOf(cleanUrl);
				if (urlIndex !== -1) {
					urlPositions.push({
						url: cleanUrl,
						startIndex: urlIndex,
						endIndex: urlIndex + cleanUrl.length
					});
				}
			}
		});
		
		// Sắp xếp theo thứ tự xuất hiện
		urlPositions.sort((a, b) => a.startIndex - b.startIndex);
		
		urlPositions.forEach(({ url, startIndex, endIndex }, index) => {
			// Add text before the URL
			const textBefore = processedText.substring(lastIndex, startIndex);
			if (textBefore.trim()) {
				elements.push(
					<span key={`text-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
						{textBefore}
					</span>
				);
			}
			
			// Add the image
			elements.push(renderImage(url, index));
			
			// Update lastIndex to continue from after the URL
			lastIndex = endIndex;
		});
		
		// Add remaining text after the last URL
		const remainingText = processedText.substring(lastIndex);
		if (remainingText.trim()) {
			elements.push(
				<span key="text-final" style={{ whiteSpace: 'pre-wrap' }}>
					{remainingText}
				</span>
			);
		}
		
		// Process each element for bold formatting and HTML tags
		return elements.map((element, index) => {
			if (typeof element === 'string') {
				return processTextFormatting(element, `element-${index}`);
			}
			return element;
		});
	}
	
	// If no images, process normally
	return processTextFormatting(text, 'main');
};

// Helper function to process text formatting
const processTextFormatting = (text: string, key: string): React.ReactNode => {
	// First handle **bold** syntax
	let processedText = text.split('**').map((part, i) =>
		i % 2 === 0 ? (
			<span key={`${key}-${i}`} style={{ whiteSpace: 'pre-wrap' }}>
				{part}
			</span>
		) : (
			<strong
				key={`${key}-${i}`}
				className="text-[#C4941D]"
				style={{ whiteSpace: 'pre-wrap' }}
			>
				{part}
			</strong>
		),
	);

	// Then process HTML tags
	const processHTML = (content: React.ReactNode): React.ReactNode => {
		if (typeof content === 'string') {
			// Handle <strong> tags
			const strongRegex = /<strong>(.*?)<\/strong>/g;
			const parts = content.split(strongRegex);

			return parts.map((part, index) => {
				if (index % 2 === 1) {
					// This is the content inside <strong> tags
					return (
						<strong key={`${key}-strong-${index}`} className="text-[#C4941D] font-semibold">
							{part}
						</strong>
					);
				}
				return part;
			});
		}

		if (React.isValidElement(content)) {
			return React.cloneElement(
				content,
				{},
				processHTML((content.props as any).children),
			);
		}

		if (Array.isArray(content)) {
			return content.map((item, index) => (
				<React.Fragment key={`${key}-fragment-${index}`}>{processHTML(item)}</React.Fragment>
			));
		}

		return content;
	};

	return processHTML(processedText);
};

// Generate time-based greeting
export const getTimeBasedGreeting = () => {
	const now = new Date();
	const hour = now.getHours();

	if (hour >= 5 && hour < 12) {
		return 'Good morning! ';
	} else if (hour >= 12 && hour < 17) {
		return 'Good afternoon! ';
	} else if (hour >= 17 && hour < 21) {
		return 'Good evening! ';
	} else {
		return 'Good evening! ';
	}
};

// Generate welcome message
export const getWelcomeMessage = (tableNumber?: string) => {
	return `${getTimeBasedGreeting()} Welcome to **Lumière Dorée**${
		tableNumber ? `, Table #${tableNumber}` : ''
	}.

I'm your AI Waiter, powered by advanced intelligence to make your dining experience extraordinary.

✨ **I can instantly help you:**
• 🍽️ Order in seconds 
• 🎯 Get personalized recommendations
• 🌱 Filter by dietary needs & allergies
• 🍷 Suggest perfect wine pairings
• 💬 Answer any questions about our menu

What sounds delightful to you today?`;
};

// Get context based on cart state
export const getContext = (cartLength: number):
	| 'initial'
	| 'browsing'
	| 'cart-empty'
	| 'cart-full'
	| 'ordering' => {
	if (cartLength === 0) {
		return 'cart-empty';
	} else if (cartLength > 0 && cartLength < 3) {
		return 'cart-full';
	}
	return 'ordering';
};
