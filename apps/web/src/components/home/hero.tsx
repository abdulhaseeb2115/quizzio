"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const styles = {
	section: "min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20",
	container: "max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center",
	leftContent: "space-y-6",
	title: "text-5xl sm:text-6xl md:text-7xl font-bold leading-tight",
	titleSpan: "bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#f97316] bg-clip-text text-transparent animate-gradient",
	subtitle: "text-xl sm:text-2xl text-[#a0a0b0]",
	description: "text-lg text-[#a0a0b0] leading-relaxed",
	ctaButton: "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#a855f7] to-[#3b82f6] rounded-xl hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow shadow-lg shadow-purple-500/50",
	ctaIcon: "ml-2 w-5 h-5",
	rightContent: "flex items-center justify-center",
	imageWrapper: "relative",
	image: "w-full h-auto max-w-lg rounded-2xl overflow-hidden rotate-6 object-contain drop-shadow-2xl",
};

export default function Hero() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				{/* Left Side - Text Content */}
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className={styles.leftContent}
				>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className={styles.title}
					>
						<span className={styles.titleSpan}>
							Quizzio
						</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className={styles.subtitle}
					>
						Transform PDFs into Interactive Quizzes
					</motion.p>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className={styles.description}
					>
						Upload any PDF document and instantly generate comprehensive
						multiple-choice quizzes. Perfect for educators, students, and
						professionals who want to test knowledge efficiently.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
					>
						<Link
							href="/quiz"
							className={styles.ctaButton}
						>
							Start Creating Quizzes
							<svg
								className={styles.ctaIcon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</Link>
					</motion.div>
				</motion.div>

				{/* Right Side - Hero Image */}
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className={styles.rightContent}
				>
					<motion.div
						animate={{
							y: [0, -20, 0],
							rotate: [0, 2, 0],
						}}
						transition={{
							duration: 6,
							repeat: Infinity,
							repeatType: "reverse",
							ease: "easeInOut",
						}}
						className={styles.imageWrapper}
					>
						<Image
							src="/hero.png"
							alt="Quizzio Hero"
							width={600}
							height={600}
							className={styles.image}
							priority
						/>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
