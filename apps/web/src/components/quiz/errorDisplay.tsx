"use client";

import { motion } from "framer-motion";

const styles = {
	container: "bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#ef4444]/30 p-6 shadow-lg mb-6",
	content: "flex items-start gap-3",
	icon: "w-6 h-6 text-[#ef4444] shrink-0 mt-0.5",
	text: "flex-1",
	title: "text-lg font-semibold text-[#ef4444] mb-2",
	message: "text-sm text-[#f8f9fa] mb-4",
	tryAgainButton: "px-4 py-2 bg-[#ef4444] text-white rounded-lg font-medium hover:bg-[#dc2626] transition-colors",
	closeButton: "text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors",
	closeIcon: "w-5 h-5",
};

interface ErrorDisplayProps {
	generateQuizError: string | null;
	setGenerateQuizError: (error: string | null) => void;
	generateQuiz: () => void;
}

export default function ErrorDisplay({
	generateQuizError,
	setGenerateQuizError,
	generateQuiz,
}: ErrorDisplayProps) {
	if (!generateQuizError) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className={styles.container}
		>
			<div className={styles.content}>
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
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<div className={styles.text}>
					<h3 className={styles.title}>
						Error Generating Quiz
					</h3>
					<p className={styles.message}>
						{generateQuizError}
					</p>
					<button
						onClick={() => {
							setGenerateQuizError(null);
							generateQuiz();
						}}
						className={styles.tryAgainButton}
					>
						Try Again
					</button>
				</div>
				<button
					onClick={() => setGenerateQuizError(null)}
					className={styles.closeButton}
				>
					<svg
						className={styles.closeIcon}
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
	);
}
