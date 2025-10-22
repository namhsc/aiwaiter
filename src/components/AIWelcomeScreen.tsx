import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles, MessageCircle, Menu, Zap, Brain, Star } from 'lucide-react';
import { RestaurantLogo } from './RestaurantLogo';

interface AIWelcomeScreenProps {
	onStartAIChat: () => void;
	onBrowseMenu: () => void;
	tableNumber: string;
}

export function AIWelcomeScreen({
	onStartAIChat,
	onBrowseMenu,
	tableNumber,
}: AIWelcomeScreenProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFF9F0] to-[#FFF4E0] flex flex-col">
			{/* Header */}
			<div className="px-6 pt-8 pb-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="w-20 h-20 mx-auto mb-4"
				>
					<RestaurantLogo />
				</motion.div>
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-3xl text-[#3E2723] mb-2"
					style={{ fontFamily: 'Georgia, serif' }}
				>
					Lumière <span className="text-[#C4941D]">Dorée</span>
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-[#8B7355] text-sm"
				>
					Table {tableNumber} • Fine Dining Experience
				</motion.p>
			</div>

			{/* Main Content */}
			<div className="flex-1 px-6 pb-8 flex flex-col justify-center max-w-md mx-auto w-full">
				{/* AI Feature Highlight */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4 }}
					className="mb-8"
				>
					{/* AI Icon */}
					<div className="relative mx-auto w-24 h-24 mb-6">
						<motion.div
							animate={{
								boxShadow: [
									'0 0 0 0 rgba(196, 148, 29, 0.4)',
									'0 0 0 20px rgba(196, 148, 29, 0)',
								],
							}}
							transition={{ duration: 2, repeat: Infinity }}
							className="absolute inset-0 rounded-full"
						/>
						<div className="relative w-24 h-24 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
							<span className="text-5xl">🤵</span>
							<div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
								<Sparkles className="w-3.5 h-3.5 text-white" />
							</div>
						</div>
					</div>

					{/* Title */}
					<h2 className="text-2xl text-[#3E2723] text-center mb-3">
						Meet Your <span className="text-[#C4941D]">AI Waiter</span>
					</h2>
					<p className="text-center text-[#8B7355] leading-relaxed mb-6">
						Experience the future of fine dining. Our intelligent AI assistant
						understands your preferences and makes ordering effortless.
					</p>

					{/* Feature Pills */}
					<div className="grid grid-cols-2 gap-3 mb-6">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 }}
							className="bg-white rounded-xl p-3 border border-[#C4941D]/20 shadow-sm"
						>
							<div className="flex items-center gap-2 mb-1">
								<div className="w-8 h-8 rounded-full bg-[#C4941D]/10 flex items-center justify-center">
									<Zap className="w-4 h-4 text-[#C4941D]" />
								</div>
							</div>
							<div className="text-sm text-[#3E2723]">Instant Ordering</div>
							<div className="text-xs text-[#8B7355]">2x faster than menu</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.7 }}
							className="bg-white rounded-xl p-3 border border-[#C4941D]/20 shadow-sm"
						>
							<div className="flex items-center gap-2 mb-1">
								<div className="w-8 h-8 rounded-full bg-[#C4941D]/10 flex items-center justify-center">
									<Brain className="w-4 h-4 text-[#C4941D]" />
								</div>
							</div>
							<div className="text-sm text-[#3E2723]">Smart Suggestions</div>
							<div className="text-xs text-[#8B7355]">Personalized picks</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
							className="bg-white rounded-xl p-3 border border-[#C4941D]/20 shadow-sm"
						>
							<div className="flex items-center gap-2 mb-1">
								<div className="w-8 h-8 rounded-full bg-[#C4941D]/10 flex items-center justify-center">
									<Star className="w-4 h-4 text-[#C4941D]" />
								</div>
							</div>
							<div className="text-sm text-[#3E2723]">Wine Pairings</div>
							<div className="text-xs text-[#8B7355]">
								Expert recommendations
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.9 }}
							className="bg-white rounded-xl p-3 border border-[#C4941D]/20 shadow-sm"
						>
							<div className="flex items-center gap-2 mb-1">
								<div className="w-8 h-8 rounded-full bg-[#C4941D]/10 flex items-center justify-center">
									<MessageCircle className="w-4 h-4 text-[#C4941D]" />
								</div>
							</div>
							<div className="text-sm text-[#3E2723]">Natural Chat</div>
							<div className="text-xs text-[#8B7355]">Talk like a waiter</div>
						</motion.div>
					</div>
				</motion.div>

				{/* CTA Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1 }}
					className="space-y-3"
				>
					{/* Primary CTA - AI Chat */}
					<Button
						onClick={onStartAIChat}
						className="w-full h-14 bg-gradient-to-r from-[#C4941D] to-[#D4A52D] text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
					>
						<MessageCircle className="w-5 h-5 mr-2" />
						Start AI Chat
						<Sparkles className="w-4 h-4 ml-2" />
					</Button>

					{/* Secondary CTA - Traditional Menu */}
					<Button
						onClick={onBrowseMenu}
						variant="outline"
						className="w-full h-12 border-2 border-[#C4941D]/30 text-[#3E2723] rounded-2xl hover:bg-[#C4941D]/5"
					>
						<Menu className="w-4 h-4 mr-2" />
						Browse Traditional Menu
					</Button>
				</motion.div>

				{/* Help Text */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
					className="text-center text-xs text-[#8B7355] mt-6 leading-relaxed"
				>
					💡 Try saying: "I want the Schnitzel" or "What do you recommend?" for
					instant results
				</motion.p>
			</div>

			{/* Footer */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.3 }}
				className="px-6 pb-6 text-center"
			>
				<div className="text-xs text-[#8B7355]">
					Lumière Dorée - Where Culinary Art Meets Digital Intelligence
				</div>
			</motion.div>
		</div>
	);
}
