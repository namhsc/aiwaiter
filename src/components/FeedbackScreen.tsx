import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Sparkles } from 'lucide-react';

interface FeedbackScreenProps {
	onComplete: () => void;
}

const loveOptions = [
	{ id: 'food', label: 'Food Quality', emoji: '🍽️' },
	{ id: 'ai', label: 'AI Waiter', emoji: '🤖' },
	{ id: 'service', label: 'Fast Service', emoji: '⚡' },
	{ id: 'value', label: 'Great Value', emoji: '💰' },
	{ id: 'atmosphere', label: 'Atmosphere', emoji: '😊' },
	{ id: 'everything', label: 'Everything!', emoji: '✨' },
];

export function FeedbackScreen({ onComplete }: FeedbackScreenProps) {
	const [rating, setRating] = useState<number>(0);
	const [hoveredRating, setHoveredRating] = useState<number>(0);
	const [feedback, setFeedback] = useState('');
	const [selectedLove, setSelectedLove] = useState<string[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const toggleLove = (id: string) => {
		setSelectedLove((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
		);
	};

	const handleSubmit = () => {
		if (rating === 0) return;

		setIsSubmitted(true);

		// Auto-close after showing thanks
		setTimeout(() => {
			onComplete();
		}, 2500);
	};

	return (
		<div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				<AnimatePresence mode="wait">
					{!isSubmitted ? (
						<motion.div
							key="feedback"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
						>
							{/* Header */}
							<div className="text-center space-y-2">
								<div className="text-5xl mb-2">🍽️</div>
								<h1 className="text-[#3E2723]">How was your experience?</h1>
								<p className="text-[#8B7355]">
									We'd love to hear about your dining experience
								</p>
							</div>

							{/* Star Rating */}
							<div className="space-y-3">
								<label className="text-sm text-[#3E2723]">Rating</label>
								<div className="flex justify-center gap-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<motion.button
											key={star}
											whileTap={{ scale: 0.9 }}
											onClick={() => setRating(star)}
											className="focus:outline-none"
										>
											<Star
												className={`w-12 h-12 transition-colors ${
													star <= (hoveredRating || rating)
														? 'fill-[#C4941D] text-[#C4941D]'
														: 'text-[#8B7355]/30'
												}`}
											/>
										</motion.button>
									))}
								</div>
								{rating > 0 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="text-center text-sm text-[#8B7355]"
									>
										{rating === 5 && '🌟 Excellent!'}
										{rating === 4 && '😊 Great!'}
										{rating === 3 && '👍 Good'}
										{rating === 2 && '😐 Okay'}
										{rating === 1 && '😞 Needs improvement'}
									</motion.div>
								)}
							</div>

							{/* Feedback Text */}
							<div className="space-y-2">
								<label className="text-sm text-[#3E2723]">
									Share your thoughts (optional)
								</label>
								<Textarea
									value={feedback}
									onChange={(e) => setFeedback(e.target.value)}
									placeholder="Tell us about your dining experience, the AI waiter, or anything else..."
									className="min-h-[100px] rounded-xl border border-[#C4941D]/30 resize-none bg-[#FFF9F0] focus:bg-white transition-colors"
								/>
							</div>

							{/* What did you love most */}
							<div className="space-y-3">
								<label className="text-sm text-[#3E2723]">
									What did you love most? (Optional)
								</label>
								<div className="flex flex-wrap gap-2">
									{loveOptions.map((option) => (
										<motion.div key={option.id} whileTap={{ scale: 0.95 }}>
											<Badge
												onClick={() => toggleLove(option.id)}
												className={`cursor-pointer text-sm px-3 py-2 rounded-full transition-all ${
													selectedLove.includes(option.id)
														? 'bg-[#C4941D] text-white border-[#C4941D]'
														: 'bg-[#FFF4E0] text-[#3E2723] border border-[#C4941D]/30 hover:border-[#C4941D]/60'
												}`}
												variant="outline"
											>
												<span className="mr-1.5">{option.emoji}</span>
												{option.label}
											</Badge>
										</motion.div>
									))}
								</div>
							</div>

							{/* Quote */}
							<div className="bg-[#FFF4E0] rounded-2xl p-5 border border-[#C4941D]/30 space-y-3">
								<div className="flex justify-center">
									<Sparkles className="w-6 h-6 text-[#C4941D]" />
								</div>
								<p className="text-center text-[#3E2723] italic leading-relaxed">
									"Food is poetry, technology is the pen. Together, we write
									delicious innovation."
								</p>
								<p className="text-center text-xs text-[#8B7355]">
									- Chef Marie Laurent
								</p>
							</div>

							{/* Submit Button */}
							<Button
								onClick={handleSubmit}
								disabled={rating === 0}
								className="w-full h-14 rounded-xl bg-[#C4941D] text-white shadow-lg disabled:opacity-50"
							>
								Submit Feedback
							</Button>

							<div className="text-center">
								<button
									onClick={onComplete}
									className="text-sm text-[#8B7355] underline"
								>
									Skip for now
								</button>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="thanks"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6"
						>
							{/* Thanks Animation */}
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: 'spring', delay: 0.2 }}
								className="w-24 h-24 mx-auto bg-[#C4941D] rounded-full flex items-center justify-center"
							>
								<Heart className="w-12 h-12 text-white fill-white" />
							</motion.div>

							<div className="space-y-2">
								<h1 className="text-[#3E2723]">Thank you! ❤️</h1>
								<p className="text-[#8B7355]">
									Your feedback helps us improve your experience
								</p>
							</div>

							<div className="bg-[#FFF4E0] rounded-2xl p-4 border border-[#C4941D]/30">
								<div className="text-[#C4941D]">
									{'⭐'.repeat(rating)} ({rating}/5)
								</div>
							</div>

							<div className="text-[#8B7355] text-sm">
								We hope to see you again at Lumière Dorée! 🍽️
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
