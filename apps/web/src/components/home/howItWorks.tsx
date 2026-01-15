"use client";

import { motion } from "framer-motion";

const styles = {
	section: "py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-[#1a1a24]/30 to-transparent",
	container: "max-w-7xl mx-auto",
	title: "text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent",
	grid: "grid md:grid-cols-4 gap-8",
	step: "text-center",
	stepIcon1: "w-20 h-20 bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30",
	stepIcon2: "w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30",
	stepIcon3: "w-20 h-20 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30",
	stepIcon4: "w-20 h-20 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30",
	stepNumber: "text-3xl font-bold text-white",
	stepTitle: "text-xl font-semibold mb-3 text-[#f8f9fa]",
	stepDescription: "text-[#a0a0b0]",
};

export default function HowItWorks() {
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
					How It Works
				</motion.h2>
				<div className={styles.grid}>
					{/* Step 1 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className={styles.step}
					>
						<div className={styles.stepIcon1}>
							<span className={styles.stepNumber}>1</span>
						</div>
						<h3 className={styles.stepTitle}>
							Upload PDF
						</h3>
						<p className={styles.stepDescription}>
							Select or drag and drop your PDF document into the platform.
						</p>
					</motion.div>

					{/* Step 2 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className={styles.step}
					>
						<div className={styles.stepIcon2}>
							<span className={styles.stepNumber}>2</span>
						</div>
						<h3 className={styles.stepTitle}>
							AI Processing
						</h3>
						<p className={styles.stepDescription}>
							Our AI analyzes the content and extracts key information.
						</p>
					</motion.div>

					{/* Step 3 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className={styles.step}
					>
						<div className={styles.stepIcon3}>
							<span className={styles.stepNumber}>3</span>
						</div>
						<h3 className={styles.stepTitle}>
							Generate Quiz
						</h3>
						<p className={styles.stepDescription}>
							Choose to take an interactive quiz or create one for export.
						</p>
					</motion.div>

					{/* Step 4 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className={styles.step}
					>
						<div className={styles.stepIcon4}>
							<span className={styles.stepNumber}>4</span>
						</div>
						<h3 className={styles.stepTitle}>
							Get Results
						</h3>
						<p className={styles.stepDescription}>
							Receive instant scores, explanations, or export your quiz.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
