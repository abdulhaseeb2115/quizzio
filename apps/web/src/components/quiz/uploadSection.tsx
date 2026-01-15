"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const styles = {
	container: "bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#a855f7]/20 p-6 shadow-lg mb-6",
	header: "flex items-center justify-between mb-6",
	backLink: "text-sm text-[#a0a0b0] hover:text-[#a855f7] transition-colors flex items-center gap-2",
	backIcon: "w-4 h-4",
	content: "space-y-2",
	dragDropZone: "border-2 border-dashed rounded-xl px-12 py-6 flex flex-col items-center justify-center transition-all duration-300 min-h-[200px]",
	dragDropZoneActive: "border-[#a855f7] bg-[#a855f7]/10",
	dragDropZoneInactive: "border-[#a855f7]/30 bg-[#252532]/30 hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10",
	dragDropContent: "text-center",
	dragDropIconWrapper: "w-16 h-16 bg-gradient-to-br from-[#a855f7]/20 to-[#3b82f6]/20 rounded-xl flex items-center justify-center mb-4 mx-auto",
	dragDropIcon: "w-8 h-8 text-[#a855f7]",
	dragDropText: "text-[#f8f9fa] mb-2 font-medium",
	dragDropOr: "text-[#a0a0b0] text-sm mb-4",
	fileInputLabel: "inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-lg font-semibold cursor-pointer hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow",
	fileInput: "hidden",
	selectedFileContainer: "p-2 bg-[#a855f7]/10 rounded-lg border border-[#a855f7]/20",
	selectedFileContent: "flex items-center justify-between",
	selectedFileInfo: "flex items-center gap-3 flex-1 min-w-0",
	selectedFileIconWrapper: "w-10 h-10 bg-gradient-to-br from-[#a855f7]/20 to-[#3b82f6]/20 rounded-lg flex items-center justify-center shrink-0",
	selectedFileIcon: "w-5 h-5 text-[#a855f7]",
	selectedFileName: "flex-1 min-w-0",
	selectedFileNameText: "text-sm font-medium text-[#f8f9fa] truncate",
	selectedFileSize: "text-xs text-[#a0a0b0]",
	uploadProgressContainer: "",
	uploadProgressHeader: "flex items-center justify-between mb-2",
	uploadProgressText: "text-sm text-[#a0a0b0]",
	uploadProgressPercent: "text-sm text-[#f97316]",
	uploadProgressBar: "w-full bg-[#252532] rounded-full h-2 overflow-hidden",
	uploadProgressFill: "h-full bg-gradient-to-r from-[#f97316] to-[#ea580c] transition-all duration-300",
	successContainer: "p-2 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg flex items-center gap-3",
	successIconWrapper: "w-8 h-8 bg-[#f97316]/20 rounded-full flex items-center justify-center",
	successIcon: "w-5 h-5 text-[#f97316]",
	successText: "text-sm font-medium text-[#f97316]",
	successSubtext: "text-xs text-[#a0a0b0]",
	modeSelectionContainer: "p-4 bg-gradient-to-br from-[#a855f7]/10 to-[#3b82f6]/10 border border-[#a855f7]/30 rounded-lg",
	modeSelectionTitle: "text-sm font-semibold text-[#f8f9fa] mb-3 text-center",
	modeSelectionGrid: "grid grid-cols-2 gap-3",
	modeButton: "p-4 bg-[#252532] border-2 rounded-lg transition-all text-left",
	modeButtonSelectedGive: "border-[#a855f7] bg-[#a855f7]/10",
	modeButtonUnselectedGive: "border-[#a855f7]/30 hover:border-[#a855f7] hover:bg-[#a855f7]/10",
	modeButtonSelectedCreate: "border-[#3b82f6] bg-[#3b82f6]/10",
	modeButtonUnselectedCreate: "border-[#3b82f6]/30 hover:border-[#3b82f6] hover:bg-[#3b82f6]/10",
	modeButtonContent: "flex items-center gap-2 mb-2",
	modeButtonIconGive: "w-5 h-5 text-[#a855f7]",
	modeButtonIconCreate: "w-5 h-5 text-[#3b82f6]",
	modeButtonTitle: "font-semibold text-[#f8f9fa]",
	modeButtonDescription: "text-xs text-[#a0a0b0]",
	createQuizButtonContainer: "space-y-3",
	createQuizButton: "w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-xl font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow flex items-center justify-center gap-2",
	spinnerIcon: "animate-spin h-5 w-5 text-white",
	errorContainer: "p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg",
	errorContent: "flex items-start gap-3",
	errorIcon: "w-5 h-5 text-[#ef4444] shrink-0 mt-0.5",
	errorText: "flex-1",
	errorTitle: "text-sm font-medium text-[#ef4444] mb-1",
	errorMessage: "text-sm text-[#f8f9fa]",
	errorClose: "text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors",
	errorCloseIcon: "w-4 h-4",
	clearSessionButton: "mt-3 w-full py-2 border border-[#a855f7]/20 text-[#a0a0b0] rounded-lg font-medium hover:bg-[#252532] hover:border-[#a855f7]/40 transition-colors",
};

interface UploadSectionProps {
	file: File | null;
	fileInputRef: React.RefObject<HTMLInputElement>;
	dragActive: boolean;
	uploading: boolean;
	uploadProgress: number;
	sessionId: string | null;
	showQuizModeSelection: boolean;
	quizMode: "give_quiz" | "create_quiz" | null;
	selectedMode: "give_quiz" | "create_quiz" | null;
	createQuizError: string | null;
	isTyping: boolean;
	loadingStep: number;
	loadingSteps: string[];
	quizQuestions: any[];
	handleDrag: (e: React.DragEvent) => void;
	handleDrop: (e: React.DragEvent) => void;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleModeSelection: (mode: "give_quiz" | "create_quiz") => void;
	createQuiz: () => void;
	clearSession: () => void;
	setCreateQuizError: (error: string | null) => void;
}

export default function UploadSection({
	file,
	fileInputRef,
	dragActive,
	uploading,
	uploadProgress,
	sessionId,
	showQuizModeSelection,
	quizMode,
	selectedMode,
	createQuizError,
	isTyping,
	loadingStep,
	loadingSteps,
	quizQuestions,
	handleDrag,
	handleDrop,
	handleFileChange,
	handleModeSelection,
	createQuiz,
	clearSession,
	setCreateQuizError,
}: UploadSectionProps) {
	return (
		<div className={styles.container}>
			{/* Header */}
			<div className={styles.header}>
				<Link href="/" className={styles.backLink}>
					<svg
						className={styles.backIcon}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Home
				</Link>
				<Logo />
			</div>

			{/* Upload Area */}
			<div className={styles.content}>
				{/* Drag & Drop Zone */}
				<div
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					className={`${styles.dragDropZone} ${
						dragActive
							? styles.dragDropZoneActive
							: styles.dragDropZoneInactive
					}`}
				>
					<div className={styles.dragDropContent}>
						<div className={styles.dragDropIconWrapper}>
							<svg
								className={styles.dragDropIcon}
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
						<p className={styles.dragDropText}>
							Drag & drop your PDF here
						</p>
						<p className={styles.dragDropOr}>or</p>
						<label
							htmlFor="pdf-input"
							className={styles.fileInputLabel}
						>
							Choose File
						</label>
						<input
							ref={fileInputRef}
							id="pdf-input"
							type="file"
							accept="application/pdf"
							className={styles.fileInput}
							onChange={handleFileChange}
						/>
					</div>
				</div>

				{/* Selected File */}
				{file && (
					<div className={styles.selectedFileContainer}>
						<div className={styles.selectedFileContent}>
							<div className={styles.selectedFileInfo}>
								<div className={styles.selectedFileIconWrapper}>
									<svg
										className={styles.selectedFileIcon}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<div className={styles.selectedFileName}>
									<p className={styles.selectedFileNameText}>
										{file.name}
									</p>
									<p className={styles.selectedFileSize}>
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Upload Progress */}
				{uploading && (
					<div className={styles.uploadProgressContainer}>
						<div className={styles.uploadProgressHeader}>
							<span className={styles.uploadProgressText}>Uploading...</span>
							<span className={styles.uploadProgressPercent}>
								{uploadProgress}%
							</span>
						</div>
						<div className={styles.uploadProgressBar}>
							<div
								className={styles.uploadProgressFill}
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
					</div>
				)}

				{/* Success Indicator */}
				{sessionId && !uploading && !showQuizModeSelection && (
					<div className={styles.successContainer}>
						<div className={styles.successIconWrapper}>
							<svg
								className={styles.successIcon}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<div>
							<p className={styles.successText}>
								PDF uploaded successfully
							</p>
							<p className={styles.successSubtext}>
								{quizMode
									? `Mode: ${
											quizMode === "give_quiz"
												? "Give Quiz"
												: "Create Quiz"
									  }`
									: "You can now ask questions"}
							</p>
						</div>
					</div>
				)}

				{/* Quiz Mode Selection */}
				{showQuizModeSelection && sessionId && (
					<div className={styles.modeSelectionContainer}>
						<p className={styles.modeSelectionTitle}>
							Choose a mode:
						</p>
						<div className={styles.modeSelectionGrid}>
							<button
								onClick={() => handleModeSelection("give_quiz")}
								className={`${styles.modeButton} ${
									selectedMode === "give_quiz"
										? styles.modeButtonSelectedGive
										: styles.modeButtonUnselectedGive
								}`}
							>
								<div className={styles.modeButtonContent}>
									<svg
										className={styles.modeButtonIconGive}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
										/>
									</svg>
									<span className={styles.modeButtonTitle}>
										Give me a quiz
									</span>
								</div>
								<p className={styles.modeButtonDescription}>
									Interactive MCQs with scoring
								</p>
							</button>
							<button
								onClick={() => handleModeSelection("create_quiz")}
								className={`${styles.modeButton} ${
									selectedMode === "create_quiz"
										? styles.modeButtonSelectedCreate
										: styles.modeButtonUnselectedCreate
								}`}
							>
								<div className={styles.modeButtonContent}>
									<svg
										className={styles.modeButtonIconCreate}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<span className={styles.modeButtonTitle}>
										Create a quiz
									</span>
								</div>
								<p className={styles.modeButtonDescription}>
									Generate & export as PDFs
								</p>
							</button>
						</div>
					</div>
				)}

				{/* Create Quiz Button - Shows after mode selection */}
				{selectedMode &&
					(!quizMode ||
						(quizMode === "give_quiz" && quizQuestions.length === 0)) && (
						<div className={styles.createQuizButtonContainer}>
							<motion.button
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								onClick={createQuiz}
								disabled={isTyping || quizMode === "give_quiz"}
								className={styles.createQuizButton}
							>
								{isTyping ||
								(quizMode === "give_quiz" &&
									quizQuestions.length === 0) ? (
									<>
										<svg
											className={styles.spinnerIcon}
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										{loadingSteps[loadingStep] || "Creating Quiz"}
									</>
								) : (
									"Create Quiz"
								)}
							</motion.button>

							{/* Error Message */}
							{createQuizError && (
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
												Error creating quiz
											</p>
											<p className={styles.errorMessage}>
												{createQuizError}
											</p>
										</div>
										<button
											onClick={() => setCreateQuizError(null)}
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
					)}

				{/* Clear Session Button */}
				{sessionId && (
					<button
						onClick={clearSession}
						className={styles.clearSessionButton}
					>
						Clear Session
					</button>
				)}
			</div>
		</div>
	);
}
