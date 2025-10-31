import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, StickyNote, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface QuickActionsProps {
	showQuickActions: boolean;
	onToggleQuickActions: () => void;
	onQuickReply: (reply: string, buttonElement: HTMLElement) => void;
	usedActions: Set<string>;
	specialNotes: string[];
	recommendations: string[];
}

export function QuickActions({
	showQuickActions,
	onToggleQuickActions,
	onQuickReply,
	usedActions,
	specialNotes,
	recommendations,
}: QuickActionsProps) {
	return (
		<>
			{/* Show Quick Actions Button */}
			<AnimatePresence>
				{!showQuickActions &&
					(specialNotes.length > 0 || recommendations.length > 0) && (
						<motion.div
							key="show-quick-actions-button"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className="px-4 py-2 border-b border-[#C4941D]/10 bg-gradient-to-b from-white/60 to-transparent">
								<button
									onClick={onToggleQuickActions}
									className="w-full flex items-center justify-center gap-2 py-2 text-[#8B7355] hover:text-[#C4941D] transition-colors group"
								>
									<ChevronDown className="w-4 h-4 group-hover:animate-bounce" />
									<span className="text-xs">Show Quick Actions</span>
								</button>
							</div>
						</motion.div>
					)}
			</AnimatePresence>

			{/* Quick Actions - Split into 2 Categories */}
			<AnimatePresence>
				{showQuickActions &&
					(specialNotes.length > 0 || recommendations.length > 0) && (
						<motion.div
							key="quick-actions"
							initial={{ height: 'auto', opacity: 1 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{
								duration: 0.3,
								ease: [0.4, 0, 0.2, 1],
							}}
							className="overflow-hidden px-4 py-3 bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-sm border-b border-[#C4941D]/10 shrink-0"
						>
							<div className="">
								<div className="max-w-2xl mx-auto">
									{/* Special Note Actions */}
									{specialNotes.length > 0 && (
										<motion.div
											initial={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex items-center gap-2 mb-2">
												<StickyNote className="w-3.5 h-3.5 text-[#8B7355]" />
												<span className="text-xs text-[#8B7355]">
													Special Note
												</span>
											</div>
											<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
												{specialNotes.map((reply, index) => (
													<motion.div
														key={index}
														initial={{ opacity: 1, scale: 1 }}
														animate={
															usedActions.has(reply)
																? {
																		opacity: 0,
																		scale: 0,
																  }
																: { opacity: 1, scale: 1 }
														}
														transition={{
															duration: 0.5,
															ease: [0.4, 0.0, 0.2, 1],
														}}
													>
														<Button
															onClick={(e: any) =>
																onQuickReply(reply, e.currentTarget)
															}
															variant="outline"
															size="sm"
															className="rounded-full border-amber-400/40 bg-amber-50 text-[#3E2723] whitespace-nowrap hover:bg-amber-100 hover:border-amber-500 transition-all shadow-sm hover:shadow-md text-xs shrink-0"
														>
															{reply}
														</Button>
													</motion.div>
												))}
											</div>
										</motion.div>
									)}

									{/* Recommend Actions */}
									{recommendations.length > 0 && (
										<motion.div
											initial={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex items-center gap-2 mb-2">
												<Sparkles className="w-3.5 h-3.5 text-[#C4941D]" />
												<span className="text-xs text-[#8B7355]">
													Recommend
												</span>
											</div>
											<div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
												{recommendations.map((reply, index) => (
													<motion.div
														key={index}
														initial={{ opacity: 1, scale: 1 }}
														animate={
															usedActions.has(reply)
																? {
																		opacity: 0,
																		scale: 0,
																  }
																: { opacity: 1, scale: 1 }
														}
														transition={{
															duration: 0.5,
															ease: [0.4, 0.0, 0.2, 1],
														}}
													>
														<Button
															onClick={(e: any) =>
																onQuickReply(reply, e.currentTarget)
															}
															variant="outline"
															size="sm"
															className="rounded-full border-[#C4941D]/30 bg-white text-[#3E2723] whitespace-nowrap hover:bg-gradient-to-br hover:from-[#C4941D] hover:to-[#D4A52D] hover:text-white hover:border-[#C4941D] transition-all shadow-sm hover:shadow-md text-xs shrink-0"
														>
															{reply}
														</Button>
													</motion.div>
												))}
											</div>
										</motion.div>
									)}
								</div>
							</div>
						</motion.div>
					)}
			</AnimatePresence>
		</>
	);
}
