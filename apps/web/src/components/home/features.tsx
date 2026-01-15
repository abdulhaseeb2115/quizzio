"use client";

import { motion } from "framer-motion";

const styles = {
	section: "py-24 px-4 sm:px-6 lg:px-8 relative",
	container: "max-w-7xl mx-auto",
	title: "text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent",
	grid: "grid md:grid-cols-3 gap-8",
	featureCard1: "bg-[#1a1a24] rounded-2xl p-8 border border-[#a855f7]/20 hover:border-[#a855f7]/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/20",
	featureCard2: "bg-[#1a1a24] rounded-2xl p-8 border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300 shadow-lg hover:shadow-blue-500/20",
	featureCard3: "bg-[#1a1a24] rounded-2xl p-8 border border-[#f97316]/20 hover:border-[#f97316]/40 transition-all duration-300 shadow-lg hover:shadow-orange-500/20",
	iconWrapper1: "w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30",
	iconWrapper2: "w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30",
	iconWrapper3: "w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30",
	icon: "w-8 h-8 text-white",
	featureTitle: "text-xl font-semibold mb-3 text-[#f8f9fa]",
	featureDescription: "text-[#a0a0b0]",
};

export default function Features() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className={styles.title}
				>
					Powerful Features
				</motion.h2>
				<div className={styles.grid}>
					{/* Feature 1 */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className={styles.featureCard1}
					>
						<div className={styles.iconWrapper1}>
							<svg
								className={styles.icon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
						<h3 className={styles.featureTitle}>
							Upload PDF
						</h3>
						<p className={styles.featureDescription}>
							Simply drag and drop or select your PDF document. Our AI
							processes it instantly and extracts all relevant content.
						</p>
					</motion.div>

					{/* Feature 2 */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className={styles.featureCard2}
					>
						<div className={styles.iconWrapper2}>
							<svg
								className={styles.icon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
						</div>
						<h3 className={styles.featureTitle}>
							AI Generation
						</h3>
						<p className={styles.featureDescription}>
							Advanced AI analyzes your document and generates comprehensive
							multiple-choice questions with accurate answers.
						</p>
					</motion.div>

					{/* Feature 3 */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className={styles.featureCard3}
					>
						<div className={styles.iconWrapper3}>
							<svg
								className={styles.icon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className={styles.featureTitle}>
							Interactive Quizzes
						</h3>
						<p className={styles.featureDescription}>
							Take quizzes interactively with instant scoring, or export
							them as PDFs for offline use.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
