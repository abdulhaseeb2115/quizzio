"use client";

import { motion } from "framer-motion";

const styles = {
	container: "bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#3b82f6]/20 p-6 shadow-lg mb-6 space-y-4",
	generateButton: "w-full py-3 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white rounded-lg font-semibold hover:from-[#2563eb] hover:to-[#9333ea] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
	errorContainer: "p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg",
	errorContent: "flex items-start gap-3",
	errorIcon: "w-5 h-5 text-[#ef4444] shrink-0 mt-0.5",
	errorText: "flex-1",
	errorTitle: "text-sm font-medium text-[#ef4444] mb-1",
	errorMessage: "text-sm text-[#f8f9fa]",
	errorClose: "text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors",
	errorCloseIcon: "w-4 h-4",
};

interface CreateQuizSectionProps {
	quizGenerated: boolean;
	isTyping: boolean;
	generateCreateQuizError: string | null;
	generateCreateQuiz: () => void;
	setGenerateCreateQuizError: (error: string | null) => void;
}

export default function CreateQuizSection({
	quizGenerated,
	isTyping,
	generateCreateQuizError,
	generateCreateQuiz,
	setGenerateCreateQuizError,
}: CreateQuizSectionProps) {
	if (quizGenerated) return null;

	return (
		<div className={styles.container}>
			<button
				onClick={generateCreateQuiz}
				disabled={isTyping}
				className={styles.generateButton}
			>
				{isTyping ? "Generating..." : "Generate Quiz"}
			</button>

			{/* Error Message for Create Quiz Generation */}
			{generateCreateQuizError && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className={styles.errorContainer}
				>
					<div className={styles.errorContent}>
						<svg
							className={styles.errorIcon}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className={styles.errorText}>
							<p className={styles.errorTitle}>
								Error generating quiz
							</p>
							<p className={styles.errorMessage}>
								{generateCreateQuizError}
							</p>
						</div>
						<button
							onClick={() => setGenerateCreateQuizError(null)}
							className={styles.errorClose}
						>
							<svg
								className={styles.errorCloseIcon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</motion.div>
			)}
		</div>
	);
}
