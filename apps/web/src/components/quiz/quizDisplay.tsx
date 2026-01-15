"use client";

import { motion, AnimatePresence } from "framer-motion";

const styles = {
	container: "bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#a855f7]/20 p-6 shadow-lg mb-6",
	title: "text-2xl font-semibold mb-6 text-[#f8f9fa]",
	questionsContainer: "space-y-6",
	questionCard: "p-5 bg-[#252532] border-2 rounded-xl",
	questionCardCorrect: "border-[#10b981] bg-[#10b981]/10",
	questionCardIncorrect: "border-[#ef4444] bg-[#ef4444]/10",
	questionCardDefault: "border-[#a855f7]/30",
	questionHeader: "flex items-start gap-3 mb-4",
	questionNumber: "w-8 h-8 bg-gradient-to-br from-[#a855f7] to-[#3b82f6] rounded-lg flex items-center justify-center text-white font-bold shrink-0",
	questionContent: "flex-1",
	questionText: "font-semibold text-[#f8f9fa] mb-3",
	optionsContainer: "space-y-2",
	optionButton: "w-full text-left p-3 rounded-lg border-2 transition-all",
	optionButtonCorrect: "border-[#10b981] bg-[#10b981]/20 text-[#f8f9fa]",
	optionButtonIncorrect: "border-[#ef4444] bg-[#ef4444]/20 text-[#f8f9fa]",
	optionButtonDefault: "border-[#252532] bg-[#1a1a24] text-[#a0a0b0]",
	optionButtonSelected: "border-[#a855f7] bg-[#a855f7]/20 text-[#f8f9fa]",
	optionButtonUnselected: "border-[#252532] hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10 text-[#f8f9fa]",
	optionButtonDisabled: "cursor-default",
	optionButtonEnabled: "cursor-pointer",
	optionLabel: "font-semibold text-[#3b82f6] mr-2",
	correctBadge: "ml-2 text-[#10b981] font-semibold",
	incorrectBadge: "ml-2 text-[#ef4444] font-semibold",
	explanationContainer: "mt-3 p-3 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg",
	explanationText: "text-sm text-[#f8f9fa]",
	explanationLabel: "font-semibold",
	submitButton: "mt-6 w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-xl font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
	resultsContainer: "mt-6 p-6 bg-gradient-to-br from-[#a855f7]/10 to-[#3b82f6]/10 border-2 border-[#a855f7]/30 rounded-xl text-center",
	resultsTitle: "text-2xl font-bold text-[#f8f9fa] mb-2",
	resultsScore: "text-4xl font-bold text-[#a855f7] mb-2",
	resultsPercent: "text-sm text-[#a0a0b0]",
};

interface QuizDisplayProps {
	quizQuestions: any[];
	userAnswers: { [key: number]: number };
	quizSubmitted: boolean;
	quizResults: any;
	isTyping: boolean;
	handleAnswerSelect: (questionIndex: number, optionIndex: number) => void;
	submitQuiz: () => void;
}

export default function QuizDisplay({
	quizQuestions,
	userAnswers,
	quizSubmitted,
	quizResults,
	isTyping,
	handleAnswerSelect,
	submitQuiz,
}: QuizDisplayProps) {
	if (quizQuestions.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={styles.container}
		>
			<h2 className={styles.title}>
				Quiz Questions
			</h2>
			<div className={styles.questionsContainer}>
				{quizQuestions.map((q, idx) => {
					const userAnswer = userAnswers[idx];
					const result = quizResults?.results?.find(
						(r: any) => r.question_index === idx
					);
					const isCorrect = result?.is_correct;
					const showResult = quizSubmitted && result;

					return (
						<motion.div
							key={idx}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: idx * 0.1 }}
							className={`${styles.questionCard} ${
								showResult
									? isCorrect
										? styles.questionCardCorrect
										: styles.questionCardIncorrect
									: styles.questionCardDefault
							}`}
						>
							<div className={styles.questionHeader}>
								<div className={styles.questionNumber}>
									{idx + 1}
								</div>
								<div className={styles.questionContent}>
									<p className={styles.questionText}>
										{q.question}
									</p>
									<div className={styles.optionsContainer}>
										{q.options.map((option: string, optIdx: number) => {
											const optionLabels = ["A", "B", "C", "D"];
											const isSelected = userAnswer === optIdx;
											const isCorrectOption =
												result?.correct_answer === optIdx;

											return (
												<button
													key={optIdx}
													onClick={() =>
														handleAnswerSelect(idx, optIdx)
													}
													disabled={quizSubmitted}
													className={`${styles.optionButton} ${
														quizSubmitted
															? isCorrectOption
																? styles.optionButtonCorrect
																: isSelected && !isCorrectOption
																? styles.optionButtonIncorrect
																: styles.optionButtonDefault
															: isSelected
															? styles.optionButtonSelected
															: styles.optionButtonUnselected
													} ${
														quizSubmitted
															? styles.optionButtonDisabled
															: styles.optionButtonEnabled
													}`}
												>
													<span className={styles.optionLabel}>
														{optionLabels[optIdx]}.
													</span>
													{option}
													{quizSubmitted && isCorrectOption && (
														<span className={styles.correctBadge}>
															✓ Correct
														</span>
													)}
													{quizSubmitted &&
														isSelected &&
														!isCorrectOption && (
															<span className={styles.incorrectBadge}>
																✗ Your answer
															</span>
														)}
												</button>
											);
										})}
									</div>
									{quizSubmitted && result?.explanation && (
										<div className={styles.explanationContainer}>
											<p className={styles.explanationText}>
												<span className={styles.explanationLabel}>
													Explanation:{" "}
												</span>
												{quizResults.explanations[idx]}
											</p>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Submit Button */}
			{!quizSubmitted && (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={submitQuiz}
					disabled={
						Object.keys(userAnswers).length !== quizQuestions.length ||
						isTyping
					}
					className={styles.submitButton}
				>
					Submit Quiz
				</motion.button>
			)}

			{/* Results Display */}
			<AnimatePresence>
				{quizSubmitted && quizResults && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.5 }}
						className={styles.resultsContainer}
					>
						<h3 className={styles.resultsTitle}>
							Your Score
						</h3>
						<p className={styles.resultsScore}>
							{quizResults.total_score} / {quizResults.total_questions}
						</p>
						<p className={styles.resultsPercent}>
							{Math.round(
								(quizResults.total_score /
									quizResults.total_questions) *
									100
							)}
							% Correct
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
