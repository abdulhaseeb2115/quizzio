"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const styles = {
	section: "py-24 px-4 sm:px-6 lg:px-8 relative",
	container: "max-w-4xl mx-auto text-center",
	card: "bg-gradient-to-br from-[#1a1a24] to-[#252532] rounded-3xl p-12 border border-[#a855f7]/20 shadow-2xl",
	title: "text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent",
	description: "text-xl text-[#a0a0b0] mb-8",
	button: "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#a855f7] to-[#3b82f6] rounded-xl hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow shadow-lg shadow-purple-500/50",
	buttonIcon: "ml-2 w-5 h-5",
};

export default function CTA() {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className={styles.card}
				>
					<h2 className={styles.title}>
						Ready to Create Your First Quiz?
					</h2>
					<p className={styles.description}>
						Transform your PDFs into engaging quizzes in seconds. No account
						required, completely free to use.
					</p>
					<Link
						href="/quiz"
						className={styles.button}
					>
						Get Started Now
						<svg
							className={styles.buttonIcon}
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
			</div>
		</section>
	);
}
