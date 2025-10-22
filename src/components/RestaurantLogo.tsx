import React from 'react';
import { motion } from 'motion/react';

interface RestaurantLogoProps {
	className?: string;
	animate?: boolean;
}

export function RestaurantLogo({
	className = '',
	animate = false,
}: RestaurantLogoProps) {
	const LogoWrapper = animate ? motion.div : 'div';
	const animationProps = animate
		? {
				initial: { scale: 0, rotate: -180 },
				animate: { scale: 1, rotate: 0 },
				transition: { type: 'spring', stiffness: 200, damping: 15 },
		  }
		: {};

	return (
		<LogoWrapper
			className={className}
			{...(animate
				? {
						initial: { scale: 0, rotate: -180 },
						animate: { scale: 1, rotate: 0 },
						transition: { type: "spring" as const, stiffness: 200, damping: 15 },
				  }
				: {})}
		>
			<svg
				viewBox="0 0 120 120"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="w-full h-full"
			>
				{/* Outer Golden Circle */}
				<circle
					cx="60"
					cy="60"
					r="58"
					stroke="url(#goldGradient)"
					strokeWidth="2"
					fill="white"
				/>

				{/* Inner Decorative Circle */}
				<circle
					cx="60"
					cy="60"
					r="50"
					stroke="url(#goldGradient)"
					strokeWidth="0.5"
					fill="none"
					opacity="0.6"
				/>

				{/* Elegant Chef's Hat/Dome */}
				<g transform="translate(60, 45)">
					{/* Hat base */}
					<path
						d="M -20 5 L 20 5 L 18 10 L -18 10 Z"
						fill="url(#goldGradient)"
					/>
					{/* Hat dome */}
					<path
						d="M -18 5 Q -18 -15, 0 -20 Q 18 -15, 18 5 Z"
						fill="url(#goldGradient)"
						opacity="0.9"
					/>
					{/* Hat highlights */}
					<ellipse cx="-5" cy="-5" rx="4" ry="6" fill="white" opacity="0.3" />
				</g>

				{/* Decorative Fork and Knife */}
				<g transform="translate(60, 75)">
					{/* Fork - left side */}
					<g transform="translate(-15, 0)">
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="15"
							stroke="url(#goldGradient)"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<line
							x1="-3"
							y1="0"
							x2="-3"
							y2="8"
							stroke="url(#goldGradient)"
							strokeWidth="1"
							strokeLinecap="round"
						/>
						<line
							x1="3"
							y1="0"
							x2="3"
							y2="8"
							stroke="url(#goldGradient)"
							strokeWidth="1"
							strokeLinecap="round"
						/>
					</g>

					{/* Knife - right side */}
					<g transform="translate(15, 0)">
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="15"
							stroke="url(#goldGradient)"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
						<path d="M -2 0 L 0 -3 L 2 0 Z" fill="url(#goldGradient)" />
					</g>
				</g>

				{/* Decorative Stars/Sparkles */}
				<g opacity="0.8">
					<path
						d="M 30 30 L 31 32 L 33 31 L 31 33 L 32 35 L 30 34 L 28 35 L 29 33 L 27 31 L 29 32 Z"
						fill="url(#goldGradient)"
					/>
					<path
						d="M 90 30 L 91 32 L 93 31 L 91 33 L 92 35 L 90 34 L 88 35 L 89 33 L 87 31 L 89 32 Z"
						fill="url(#goldGradient)"
					/>
					<path
						d="M 60 95 L 61 97 L 63 96 L 61 98 L 62 100 L 60 99 L 58 100 L 59 98 L 57 96 L 59 97 Z"
						fill="url(#goldGradient)"
					/>
				</g>

				{/* Letter L and D monogram */}
				<g transform="translate(60, 60)">
					<text
						x="0"
						y="0"
						textAnchor="middle"
						dominantBaseline="central"
						fill="url(#goldGradient)"
						style={{
							fontFamily: 'Georgia, serif',
							fontSize: '24px',
							fontWeight: '600',
							letterSpacing: '2px',
						}}
					>
						LD
					</text>
				</g>

				{/* Gradient Definitions */}
				<defs>
					<linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#D4AF37" />
						<stop offset="50%" stopColor="#C4941D" />
						<stop offset="100%" stopColor="#B8881A" />
					</linearGradient>

					<radialGradient id="goldRadial" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
						<stop offset="100%" stopColor="#C4941D" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* Background glow effect */}
				<circle cx="60" cy="60" r="55" fill="url(#goldRadial)" opacity="0.3" />
			</svg>
		</LogoWrapper>
	);
}
