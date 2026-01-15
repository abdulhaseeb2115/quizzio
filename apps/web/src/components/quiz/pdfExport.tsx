"use client";

import { motion } from "framer-motion";

const styles = {
	container: "bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#3b82f6]/20 p-6 shadow-lg mb-6",
	title: "text-xl font-semibold mb-4 text-[#f8f9fa]",
	description: "text-sm text-[#a0a0b0] mb-4",
	buttonsGrid: "grid md:grid-cols-2 gap-4",
	buttonQuestions: "py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-lg font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 flex items-center justify-center gap-2",
	buttonAnswers: "py-4 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white rounded-lg font-semibold hover:from-[#2563eb] hover:to-[#9333ea] transition-all duration-300 flex items-center justify-center gap-2",
	buttonIcon: "w-5 h-5",
};

interface PdfExportProps {
	printToPDF: (type: "questions" | "answers") => void;
}

export default function PdfExport({ printToPDF }: PdfExportProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={styles.container}
		>
			<h2 className={styles.title}>
				Export Quiz
			</h2>
			<p className={styles.description}>
				Download your quiz as PDF files for printing or sharing.
			</p>
			<div className={styles.buttonsGrid}>
				<button
					onClick={() => printToPDF("questions")}
					className={styles.buttonQuestions}
				>
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
							d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
						/>
					</svg>
					Print Questions PDF
				</button>
				<button
					onClick={() => printToPDF("answers")}
					className={styles.buttonAnswers}
				>
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
							d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
						/>
					</svg>
					Print Answers PDF
				</button>
			</div>
		</motion.div>
	);
}
