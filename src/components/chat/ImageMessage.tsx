import React from 'react';
import { motion } from 'motion/react';

interface ImageMessageProps {
	url: string;
	alt?: string;
	className?: string;
}

export function ImageMessage({ url, alt = "Shared image", className = "" }: ImageMessageProps) {
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasError, setHasError] = React.useState(false);

	return (
		<motion.div 
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className={`my-3 flex justify-center ${className}`}
		>
			<div className="relative group">
				{!hasError && (
					<img
						src={url}
						alt={alt}
						className="max-w-full max-h-64 rounded-lg shadow-md object-contain transition-transform duration-200 group-hover:scale-105"
						onError={() => {
							setHasError(true);
							setIsLoading(false);
						}}
						onLoad={() => {
							setIsLoading(false);
						}}
					/>
				)}
				
				{/* Loading indicator */}
				{isLoading && !hasError && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
						<div className="w-6 h-6 border-2 border-[#C4941D] border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}
				
				{/* Error state */}
				{hasError && (
					<div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 text-gray-500 text-sm">
						Không thể tải ảnh
					</div>
				)}
			</div>
		</motion.div>
	);
}
