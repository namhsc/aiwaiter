import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface InputBarProps {
	inputValue: string;
	onInputChange: (value: string) => void;
	onSendMessage: (text: string) => void;
	onVoiceInput: () => void;
	isSpeaking: boolean;
	isTyping: boolean;
	inputHighlight: boolean;
	flyingText: {
		text: string;
		from: { x: number; y: number };
	} | null;
	inputContainerRef: React.RefObject<HTMLDivElement>;
}

export function InputBar({
	inputValue,
	onInputChange,
	onSendMessage,
	onVoiceInput,
	isSpeaking,
	isTyping,
	inputHighlight,
	flyingText,
	inputContainerRef,
}: InputBarProps) {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = 'auto';
			const scrollHeight = inputRef.current.scrollHeight;
			const lineHeight = 24; // Approximate line height
			const maxHeight = lineHeight * 4; // 4 lines max
			inputRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
		}
	}, [inputValue]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (isTyping) return;
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSendMessage(inputValue);
		}
	};

	return (
		<div className="bg-white border-t border-[#C4941D]/20 px-4 py-4 shadow-2xl shrink-0">
			<div className="max-w-2xl mx-auto flex gap-2 items-center">
				<div ref={inputContainerRef} className="flex-1 relative">
					<motion.div
						animate={
							inputHighlight
								? {
										boxShadow: [
											'0 0 0px rgba(196, 148, 29, 0)',
											'0 0 20px rgba(196, 148, 29, 0.6)',
											'0 0 0px rgba(196, 148, 29, 0)',
										],
								  }
								: {}
						}
						transition={{ duration: 0.6 }}
						className="rounded-3xl"
					>
						<Textarea
							ref={inputRef}
							value={inputValue}
							onChange={(e) => onInputChange(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ask me anything..."
							className="rounded-3xl border-[#C4941D]/30 pr-12 min-h-[48px] max-h-[96px] bg-white shadow-sm focus:shadow-md transition-shadow resize-none overflow-y-auto py-3 scrollbar-hide"
							disabled={isSpeaking}
							rows={1}
						/>
					</motion.div>
				</div>

				<Button
					onClick={onVoiceInput}
					variant="outline"
					size="icon"
					className={`rounded-full w-12 h-12 shrink-0 shadow-md ${
						isSpeaking
							? 'bg-red-500 text-white border-red-500 animate-pulse'
							: 'border-[#C4941D]/30 hover:bg-[#C4941D]/10'
					}`}
				>
					{isSpeaking ? (
						<Volume2 className="w-5 h-5" />
					) : (
						<Mic className="w-5 h-5" />
					)}
				</Button>

				<Button
					onClick={() => onSendMessage(inputValue)}
					size="icon"
					className="rounded-full w-12 h-12 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] shrink-0 shadow-md hover:shadow-lg transition-shadow"
					disabled={!inputValue.trim() || isSpeaking || isTyping}
				>
					<Send className="w-5 h-5" />
				</Button>
			</div>

			{isSpeaking && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center text-sm text-red-500 mt-2 flex items-center justify-center gap-2"
				>
					<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
					Listening...
				</motion.div>
			)}

			{/* Flying Text Animation - Shrinks while flying */}
			<AnimatePresence>
				{flyingText && inputContainerRef.current && (
					<motion.div
						initial={{
							position: 'fixed',
							left: flyingText.from.x,
							top: flyingText.from.y,
							opacity: 1,
							scale: 1,
						}}
						animate={{
							left:
								inputContainerRef.current.getBoundingClientRect().left +
								inputContainerRef.current.getBoundingClientRect().width / 2,
							top:
								inputContainerRef.current.getBoundingClientRect().top +
								inputContainerRef.current.getBoundingClientRect().height / 2,
							opacity: [1, 0.95, 0.85, 0.7, 0.5, 0.3],
							scale: [1, 0.9, 0.75, 0.6, 0.45, 0.1],
						}}
						exit={{ opacity: 0, scale: 0.2 }}
						transition={{
							duration: 0.6,
							ease: [0.25, 0.1, 0.25, 1],
							opacity: {
								times: [0, 0.2, 0.4, 0.6, 0.8, 1],
							},
							scale: {
								times: [0, 0.2, 0.4, 0.6, 0.8, 1],
							},
						}}
						className="pointer-events-none z-[100] px-3 py-1.5 bg-gradient-to-br from-[#C4941D] to-[#D4A52D] text-white rounded-full text-xs shadow-lg whitespace-nowrap"
						style={{
							transform: 'translate(-50%, -50%)',
						}}
					>
						{flyingText.text}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
