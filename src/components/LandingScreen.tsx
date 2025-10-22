import React, { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { RestaurantLogo } from './RestaurantLogo';

interface LandingScreenProps {
	language: string;
	tableNumber: string;
	onEnter: () => void;
	onOpenAI: () => void;
}

export function LandingScreen({
	language,
	tableNumber,
	onEnter,
	onOpenAI,
}: LandingScreenProps) {

	const translations = {
		en: {
			tagline: 'FINE DINING REIMAGINED',
			subtitle: 'Where Culinary Art Meets Digital Intelligence',
			seatedAt: "You're seated at",
			meetAI: 'Meet Your AI Waiter',
			aiDescription:
				"I'll guide you through our menu, answer questions, and help you order with AI voice or chat. Ready to begin?",
			selectLang: 'Select your language',
			begin: 'Begin Your Experience',
			aiChat: 'AI Chat',
			voiceOrder: 'Voice Order',
			personalized: 'Personalized',
			signature: "Don't miss our signature Le Chef's Golden Soufflé",
		},
		de: {
			tagline: 'FINE DINING NEU GEDACHT',
			subtitle: 'Wo Kulinarische Kunst auf Digitale Intelligenz trifft',
			seatedAt: 'Sie sitzen an',
			meetAI: 'Treffen Sie Ihren KI-Kellner',
			aiDescription:
				'Ich führe Sie durch unser Menü, beantworte Fragen und helfe Ihnen bei der Bestellung per KI-Sprache oder Chat. Bereit anzufangen?',
			selectLang: 'Sprache wählen',
			begin: 'Beginnen Sie Ihr Erlebnis',
			aiChat: 'KI-Chat',
			voiceOrder: 'Sprachbestellung',
			personalized: 'Personalisiert',
			signature:
				"Verpassen Sie nicht unser Signature-Gericht Le Chef's Golden Soufflé",
		},
		zh: {
			tagline: '重新定义精致餐饮',
			subtitle: '烹饪艺术与数字智能的完美结合',
			seatedAt: '您的座位是',
			meetAI: '认识您的AI服务员',
			aiDescription:
				'我将引导您浏览菜单，回答问题，并通过AI语音或聊天帮助您点餐。准备好开始了吗？',
			selectLang: '选择您的语言',
			begin: '开始您的体验',
			aiChat: 'AI聊天',
			voiceOrder: '语音点餐',
			personalized: '个性化',
			signature: "不要错过我们的招牌菜 Le Chef's Golden Soufflé",
		},
		vi: {
			tagline: 'ẨM THỰC CAO CẤP TÁI HIỆN',
			subtitle: 'Nơi Nghệ Thuật Ẩm Thực Gặp Gỡ Trí Tuệ Số',
			seatedAt: 'Bạn đang ngồi tại',
			meetAI: 'Gặp Gỡ Người Phục Vụ AI',
			aiDescription:
				'Tôi sẽ hướng dẫn bạn qua thực đơn, trả lời câu hỏi và giúp bạn đặt món bằng giọng nói hoặc chat AI. Sẵn sàng bắt đầu?',
			selectLang: 'Chọn ngôn ngữ của bạn',
			begin: 'Bắt Đầu Trải Nghiệm',
			aiChat: 'Chat AI',
			voiceOrder: 'Đặt Món Bằng Giọng Nói',
			personalized: 'Cá Nhân Hóa',
			signature:
				"Đừng bỏ lỡ món đặc trưng Le Chef's Golden Soufflé của chúng tôi",
		},
	};

	const t =
		translations[language as keyof typeof translations] || translations.en;

	return (
		<div
			className="min-h-screen flex items-center justify-center px-4 py-8"
			style={{ background: '#FFF9F0' }}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-lg"
			>
				<div className="space-y-6">
					{/* Logo & Branding */}
					<div className="text-center space-y-3">
						<div className="w-24 h-24 mx-auto">
							<RestaurantLogo animate={true} />
						</div>

						<div>
							<h1
								className="text-4xl text-[#3E2723] mb-1"
								style={{ fontFamily: 'Georgia, serif' }}
							>
								Lumière <span className="text-[#C4941D]">Dorée</span>
							</h1>
							<p className="text-xs tracking-[0.2em] text-[#8B7355] uppercase">
								{t.tagline}
							</p>
						</div>

						<p className="text-sm text-[#C4941D]">{t.subtitle}</p>
					</div>

					{/* Table Number Card */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="flex justify-center"
					>
						<div className="bg-[#4A3428] text-white px-8 py-4 rounded-xl text-center shadow-md">
							<p className="text-xs text-[#D4AF37] mb-1">{t.seatedAt}</p>
							<span className="text-2xl">Table #{tableNumber}</span>
						</div>
					</motion.div>


					{/* Action Button */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.35 }}
					>
						<Button
							onClick={onOpenAI}
							className="w-full h-14 rounded-xl bg-gradient-to-r from-[#C4941D] to-[#D4A52D] text-white shadow-lg hover:shadow-xl transition-shadow"
						>
							<Sparkles className="w-5 h-5 mr-2" />
							{t.begin}
							<Sparkles className="w-4 h-4 ml-2" />
						</Button>
					</motion.div>

					{/* AI Feature Highlight - Clickable */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						onClick={onOpenAI}
						className="bg-gradient-to-br from-[#FFF4E0] to-[#FFF9F0] rounded-2xl p-5 border-2 border-[#C4941D]/30 shadow-sm cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
					>
						<div className="flex gap-3">
							<div className="relative">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C4941D] to-[#D4A52D] flex items-center justify-center shrink-0 text-2xl shadow-md">
									🤵
								</div>
								<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-[#3E2723]">{t.meetAI}</h3>
									<span className="bg-[#C4941D] text-white text-[10px] px-2 py-0.5 rounded-full">
										AI
									</span>
								</div>
								<p className="text-sm text-[#8B7355] leading-relaxed">
									{t.aiDescription}
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
