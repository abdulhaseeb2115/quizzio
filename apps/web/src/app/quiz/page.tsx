"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import AnimatedBackground from "@/components/AnimatedBackground";

function isAxiosErrorWithDetail(
	err: unknown
): err is { response: { data: { detail?: string } } } {
	if (
		typeof err === "object" &&
		err !== null &&
		"response" in err &&
		typeof (err as { response?: unknown }).response === "object" &&
		(err as { response?: unknown }).response !== null
	) {
		const response = (err as { response: unknown }).response;
		if (
			"data" in (response as object) &&
			typeof (response as { data?: unknown }).data === "object" &&
			(response as { data?: unknown }).data !== null
		) {
			return true;
		}
	}
	return false;
}

function isAxiosErrorWithError(
	err: unknown
): err is { response: { data: { error?: string } } } {
	if (
		typeof err === "object" &&
		err !== null &&
		"response" in err &&
		typeof (err as { response?: unknown }).response === "object" &&
		(err as { response?: unknown }).response !== null
	) {
		const response = (err as { response?: unknown }).response;
		if (
			"data" in (response as object) &&
			typeof (response as { data?: unknown }).data === "object" &&
			(response as { data?: unknown }).data !== null
		) {
			return true;
		}
	}
	return false;
}

export default function Tool() {
	const [file, setFile] = useState<File | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [query, setQuery] = useState<string>("");
	const [messages, setMessages] = useState<{ role: string; text: string }[]>(
		[]
	);
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const chatRef = useRef<HTMLDivElement | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [quizMode, setQuizMode] = useState<"give_quiz" | "create_quiz" | null>(
		null
	);
	const [selectedMode, setSelectedMode] = useState<
		"give_quiz" | "create_quiz" | null
	>(null);
	const [showQuizModeSelection, setShowQuizModeSelection] = useState(false);
	const [createQuizError, setCreateQuizError] = useState<string | null>(null);
	const [generateQuizError, setGenerateQuizError] = useState<string | null>(
		null
	);
	const [generateCreateQuizError, setGenerateCreateQuizError] = useState<
		string | null
	>(null);
	const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
	const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
	const [quizSubmitted, setQuizSubmitted] = useState(false);
	const [quizResults, setQuizResults] = useState<any>(null);
	const [quizGenerated, setQuizGenerated] = useState(false);
	const [createQuizData, setCreateQuizData] = useState<{
		questions: any[];
		answers: any[];
	} | null>(null);
	const [loadingStep, setLoadingStep] = useState(0);
	const loadingSteps = [
		"Reading document",
		"Extracting Important Info",
		"Creating Quiz",
	];

	useEffect(() => {
		// when user refreshes or closes the tab, try to delete the session on backend
		const handleUnload = () => {
			if (sessionId) {
				try {
					navigator.sendBeacon(
						`http://localhost:8000/delete-session/${sessionId}`
					);
				} catch {
					fetch(`http://localhost:8000/delete-session/${sessionId}`, {
						method: "POST",
						keepalive: true,
					});
				}
			}
		};
		window.addEventListener("beforeunload", handleUnload);
		return () => window.removeEventListener("beforeunload", handleUnload);
	}, [sessionId]);

	useEffect(() => {
		// scroll to bottom on new messages
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	// Auto-upload when file is selected and no session exists
	useEffect(() => {
		if (file && !sessionId && !uploading) {
			uploadPdf();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	// Handle loading steps progression
	useEffect(() => {
		if (!isTyping) {
			setLoadingStep(0);
			return;
		}

		// Start from step 0 when typing begins
		setLoadingStep(0);

		// Progress through steps
		const step1Timeout = setTimeout(() => {
			setLoadingStep(1);
		}, 2000); // After 2 seconds, move to step 1

		const step2Timeout = setTimeout(() => {
			setLoadingStep(2);
		}, 4000); // After 4 seconds, move to step 2

		return () => {
			clearTimeout(step1Timeout);
			clearTimeout(step2Timeout);
		};
	}, [isTyping]);

	const uploadPdf = async () => {
		if (!file) return alert("Choose a PDF first");
		setUploading(true);
		setUploadProgress(0);

		const fd = new FormData();
		fd.append("file", file);

		// Simulate progress
		const progressInterval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 90) {
					clearInterval(progressInterval);
					return 90;
				}
				return prev + 10;
			});
		}, 200);

		try {
			const res = await axios.post("http://localhost:8000/upload-pdf", fd, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			clearInterval(progressInterval);
			setUploadProgress(100);
			setSessionId(res.data.session_id);
			setMessages([
				{
					role: "system",
					text: "PDF uploaded successfully. Choose a mode to continue.",
				},
			]);
			setShowQuizModeSelection(true);
			setTimeout(() => {
				setUploading(false);
				setUploadProgress(0);
			}, 500);
		} catch (err: unknown) {
			clearInterval(progressInterval);
			console.error(err);
			setUploading(false);
			setUploadProgress(0);
			if (isAxiosErrorWithDetail(err)) {
				alert(err.response.data.detail || "Upload failed");
			} else {
				alert("Upload failed");
			}
		}
	};

	const sendQuery = async () => {
		if (!sessionId) return alert("Upload a PDF first");
		if (!query.trim()) return;
		const userMsg = { role: "user", text: query };
		setMessages((m) => [...m, userMsg]);
		setQuery("");
		setIsTyping(true);

		try {
			const form = new FormData();
			form.append("session_id", sessionId);
			form.append("query", userMsg.text);
			const res = await axios.post("http://localhost:8000/ask", form);
			setIsTyping(false);
			const bot = { role: "bot", text: res.data.answer };
			setMessages((m) => [...m, bot]);
		} catch (err: unknown) {
			console.error(err);
			setIsTyping(false);
			let errorMsg = "Request failed";
			if (isAxiosErrorWithError(err)) {
				errorMsg = err.response.data.error || errorMsg;
			}
			setMessages((m) => [...m, { role: "bot", text: "Error: " + errorMsg }]);
		}
	};

	const clearSession = async () => {
		if (!sessionId) return;
		try {
			await axios.delete(`http://localhost:8000/delete-session/${sessionId}`);
		} catch {
			// ignore
		}
		setSessionId(null);
		setMessages([]);
		setFile(null);
		setQuizMode(null);
		setShowQuizModeSelection(false);
		setQuizQuestions([]);
		setUserAnswers({});
		setQuizSubmitted(false);
		setQuizResults(null);
		setQuizGenerated(false);
		setCreateQuizData(null);
		setSelectedMode(null);
		setCreateQuizError(null);
		setGenerateQuizError(null);
		setGenerateCreateQuizError(null);
		setLoadingStep(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleModeSelection = (mode: "give_quiz" | "create_quiz") => {
		setSelectedMode(mode);
		setShowQuizModeSelection(false);
	};

	const createQuiz = async () => {
		if (!sessionId || !selectedMode) return;
		setIsTyping(true);
		setCreateQuizError(null);
		try {
			await axios.post("http://localhost:8000/api/quiz/mode", {
				session_id: sessionId,
				mode: selectedMode,
			});
			setQuizMode(selectedMode);

			if (selectedMode === "give_quiz") {
				// Generate quiz immediately for give_quiz mode
				// Pass selectedMode directly since quizMode state might not be updated yet
				await generateQuiz(selectedMode);
			} else {
				// For create_quiz, just show the generate button
				setMessages([
					{
						role: "system",
						text: "Quiz mode set to 'Create Quiz'. Click 'Generate Quiz' to create questions.",
					},
				]);
			}
		} catch (err: unknown) {
			console.error(err);
			let errorMessage = "Failed to create quiz. Please try again.";
			if (isAxiosErrorWithDetail(err)) {
				errorMessage = err.response.data.detail || errorMessage;
			} else if (isAxiosErrorWithError(err)) {
				errorMessage = err.response.data.error || errorMessage;
			}
			setCreateQuizError(errorMessage);
		} finally {
			setIsTyping(false);
		}
	};

	const generateQuiz = async (mode?: "give_quiz" | "create_quiz") => {
		// Use passed mode or fall back to quizMode state
		const currentMode = mode || quizMode;
		if (!sessionId || !currentMode) return;
		setIsTyping(true);
		setGenerateQuizError(null);
		try {
			const res = await axios.post(
				"http://localhost:8000/api/quiz/generate/give",
				{
					session_id: sessionId,
				}
			);
			setQuizQuestions(res.data.questions);
			setQuizGenerated(true);
			setMessages([
				{
					role: "system",
					text: `Quiz generated! Answer all ${res.data.questions.length} questions.`,
				},
			]);
		} catch (err: unknown) {
			console.error(err);
			let errorMessage = "Failed to generate quiz. Please try again.";
			if (isAxiosErrorWithDetail(err)) {
				errorMessage = err.response.data.detail || errorMessage;
			} else if (isAxiosErrorWithError(err)) {
				errorMessage = err.response.data.error || errorMessage;
			}
			setGenerateQuizError(errorMessage);
		} finally {
			setIsTyping(false);
		}
	};

	const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
		if (quizSubmitted) return;
		setUserAnswers((prev) => ({
			...prev,
			[questionIndex]: optionIndex,
		}));
	};

	const submitQuiz = async () => {
		if (!sessionId) return;

		// Check if all questions are answered
		if (Object.keys(userAnswers).length !== quizQuestions.length) {
			alert("Please answer all questions before submitting.");
			return;
		}

		setIsTyping(true);
		try {
			const res = await axios.post("http://localhost:8000/api/quiz/submit", {
				session_id: sessionId,
				answers: userAnswers,
			});
			setQuizResults(res.data);
			setQuizSubmitted(true);
			setMessages([
				{
					role: "system",
					text: `Quiz submitted! Your score: ${res.data.total_score}/${res.data.total_questions}`,
				},
			]);
		} catch (err: unknown) {
			console.error(err);
			if (isAxiosErrorWithDetail(err)) {
				alert(err.response.data.detail || "Failed to submit quiz");
			} else {
				alert("Failed to submit quiz");
			}
		} finally {
			setIsTyping(false);
		}
	};

	const generateCreateQuiz = async () => {
		if (!sessionId) return;
		setIsTyping(true);
		setGenerateCreateQuizError(null);
		try {
			const res = await axios.post(
				"http://localhost:8000/api/quiz/generate/create",
				{
					session_id: sessionId,
				}
			);
			setCreateQuizData(res.data);
			setQuizGenerated(true);
			setMessages([
				{
					role: "system",
					text: "Quiz generated! Print the PDFs below.",
				},
			]);
		} catch (err: unknown) {
			console.error(err);
			let errorMessage = "Failed to generate quiz. Please try again.";
			if (isAxiosErrorWithDetail(err)) {
				errorMessage = err.response.data.detail || errorMessage;
			} else if (isAxiosErrorWithError(err)) {
				errorMessage = err.response.data.error || errorMessage;
			}
			setGenerateCreateQuizError(errorMessage);
		} finally {
			setIsTyping(false);
		}
	};

	const printToPDF = (type: "questions" | "answers") => {
		if (!createQuizData) return;

		const data =
			type === "questions" ? createQuizData.questions : createQuizData.answers;
		const title =
			type === "questions" ? "Quiz Questions" : "Quiz Answers & Explanations";

		// Generate HTML
		let html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
	<style>
		@media print {
			body { margin: 0; }
			.no-print { display: none; }
		}
		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			line-height: 1.6;
			color: #333;
			max-width: 800px;
			margin: 0 auto;
			padding: 20px;
		}
		h1 {
			color: #9333ea;
			text-align: center;
			border-bottom: 3px solid #9333ea;
			padding-bottom: 10px;
			margin-bottom: 30px;
		}
		.question, .answer {
			margin-bottom: 30px;
			page-break-inside: avoid;
		}
		.question-number {
			font-weight: bold;
			color: #3b82f6;
			font-size: 1.1em;
			margin-bottom: 10px;
		}
		.question-text {
			font-size: 1.05em;
			margin-bottom: 15px;
			font-weight: 500;
		}
		.options {
			list-style: none;
			padding: 0;
			margin: 0;
		}
		.option {
			padding: 8px 12px;
			margin: 8px 0;
			background-color: #f8f9fa;
			border-left: 3px solid #9333ea;
			border-radius: 4px;
		}
		.option-label {
			font-weight: 600;
			color: #3b82f6;
			margin-right: 8px;
		}
		.correct-answer {
			background-color: #d1fae5;
			border-left: 4px solid #10b981;
			padding: 10px 15px;
			margin: 10px 0;
			border-radius: 4px;
			font-weight: 600;
		}
		.explanation {
			background-color: #fef3c7;
			border-left: 4px solid #f59e0b;
			padding: 10px 15px;
			margin: 10px 0;
			border-radius: 4px;
			font-style: italic;
		}
		.label {
			font-weight: 600;
			color: #10b981;
			margin-right: 8px;
		}
		.print-button {
			position: fixed;
			top: 20px;
			right: 20px;
			padding: 10px 20px;
			background: #9333ea;
			color: white;
			border: none;
			border-radius: 5px;
			cursor: pointer;
			font-weight: bold;
		}
	</style>
</head>
<body>
	<button class="print-button no-print" onclick="window.print()">Print / Save as PDF</button>
	<h1>${title}</h1>
`;

		if (type === "questions") {
			data.forEach((q: any) => {
				html += `
	<div class="question">
		<div class="question-number">Question ${q.question_index}</div>
		<div class="question-text">${q.question}</div>
		<ul class="options">
`;
				const optionLabels = ["A", "B", "C", "D"];
				q.options.forEach((option: string, idx: number) => {
					html += `
			<li class="option">
				<span class="option-label">${optionLabels[idx]}.</span>
				${option}
			</li>
`;
				});
				html += `
		</ul>
	</div>
`;
			});
		} else {
			const optionLabels = ["A", "B", "C", "D"];
			data.forEach((a: any) => {
				const correctLabel = optionLabels[a.correct_index];
				html += `
	<div class="answer">
		<div class="question-number">Question ${a.question_index}</div>
		<div class="question-text">${a.question}</div>
		<div class="correct-answer">
			<span class="label">Correct Answer:</span>
			${correctLabel}. ${a.correct_answer}
		</div>
		<div class="explanation">
			<span class="label">Explanation:</span>
			${a.explanation}
		</div>
	</div>
`;
			});
		}

		html += `
</body>
</html>
`;

		// Open print dialog
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(html);
			printWindow.document.close();
			printWindow.focus();
			// Wait for content to load, then trigger print
			setTimeout(() => {
				printWindow.print();
			}, 250);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			// Clear previous chat when new file is selected
			if (sessionId) {
				clearSession().then(() => {
					setFile(selectedFile);
				});
			} else {
				setFile(selectedFile);
			}
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const droppedFile = e.dataTransfer.files[0];
			if (droppedFile.type === "application/pdf") {
				if (sessionId) {
					clearSession().then(() => {
						setFile(droppedFile);
					});
				} else {
					setFile(droppedFile);
				}
			} else {
				alert("Please upload a PDF file");
			}
		}
	};

	return (
		<>
			<AnimatedBackground />

			<div className="relative min-h-screen pt-16 pb-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Upload Section - Full Width */}
					<div className="bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#a855f7]/20 p-6 shadow-lg mb-6">
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<Link
								href="/"
								className="text-sm text-[#a0a0b0] hover:text-[#a855f7] transition-colors flex items-center gap-2"
							>
								<svg
									className="w-4 h-4"
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
						<div className="space-y-2">
							{/* Drag & Drop Zone */}
							<div
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
								className={`border-2 border-dashed rounded-xl px-12 py-6 flex flex-col items-center justify-center transition-all duration-300 min-h-[200px] ${
									dragActive
										? "border-[#a855f7] bg-[#a855f7]/10"
										: "border-[#a855f7]/30 bg-[#252532]/30 hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10"
								}`}
							>
								<div className="text-center">
									<div className="w-16 h-16 bg-gradient-to-br from-[#a855f7]/20 to-[#3b82f6]/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
										<svg
											className="w-8 h-8 text-[#a855f7]"
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
									<p className="text-[#f8f9fa] mb-2 font-medium">
										Drag & drop your PDF here
									</p>
									<p className="text-[#a0a0b0] text-sm mb-4">or</p>
									<label
										htmlFor="pdf-input"
										className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-lg font-semibold cursor-pointer hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow"
									>
										Choose File
									</label>
									<input
										ref={fileInputRef}
										id="pdf-input"
										type="file"
										accept="application/pdf"
										className="hidden"
										onChange={handleFileChange}
									/>
								</div>
							</div>

							{/* Selected File */}
							{file && (
								<div className="p-2 bg-[#a855f7]/10 rounded-lg border border-[#a855f7]/20">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className="w-10 h-10 bg-gradient-to-br from-[#a855f7]/20 to-[#3b82f6]/20 rounded-lg flex items-center justify-center shrink-0">
												<svg
													className="w-5 h-5 text-[#a855f7]"
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
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-[#f8f9fa] truncate">
													{file.name}
												</p>
												<p className="text-xs text-[#a0a0b0]">
													{(file.size / 1024 / 1024).toFixed(2)} MB
												</p>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Upload Progress */}
							{uploading && (
								<div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm text-[#a0a0b0]">Uploading...</span>
										<span className="text-sm text-[#f97316]">
											{uploadProgress}%
										</span>
									</div>
									<div className="w-full bg-[#252532] rounded-full h-2 overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-[#f97316] to-[#ea580c] transition-all duration-300"
											style={{ width: `${uploadProgress}%` }}
										/>
									</div>
								</div>
							)}

							{/* Success Indicator */}
							{sessionId && !uploading && !showQuizModeSelection && (
								<div className="p-2 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg flex items-center gap-3">
									<div className="w-8 h-8 bg-[#f97316]/20 rounded-full flex items-center justify-center">
										<svg
											className="w-5 h-5 text-[#f97316]"
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
										<p className="text-sm font-medium text-[#f97316]">
											PDF uploaded successfully
										</p>
										<p className="text-xs text-[#a0a0b0]">
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
								<div className="p-4 bg-gradient-to-br from-[#a855f7]/10 to-[#3b82f6]/10 border border-[#a855f7]/30 rounded-lg">
									<p className="text-sm font-semibold text-[#f8f9fa] mb-3 text-center">
										Choose a mode:
									</p>
									<div className="grid grid-cols-2 gap-3">
										<button
											onClick={() => handleModeSelection("give_quiz")}
											className={`p-4 bg-[#252532] border-2 rounded-lg transition-all text-left ${
												selectedMode === "give_quiz"
													? "border-[#a855f7] bg-[#a855f7]/10"
													: "border-[#a855f7]/30 hover:border-[#a855f7] hover:bg-[#a855f7]/10"
											}`}
										>
											<div className="flex items-center gap-2 mb-2">
												<svg
													className="w-5 h-5 text-[#a855f7]"
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
												<span className="font-semibold text-[#f8f9fa]">
													Give me a quiz
												</span>
											</div>
											<p className="text-xs text-[#a0a0b0]">
												Interactive MCQs with scoring
											</p>
										</button>
										<button
											onClick={() => handleModeSelection("create_quiz")}
											className={`p-4 bg-[#252532] border-2 rounded-lg transition-all text-left ${
												selectedMode === "create_quiz"
													? "border-[#3b82f6] bg-[#3b82f6]/10"
													: "border-[#3b82f6]/30 hover:border-[#3b82f6] hover:bg-[#3b82f6]/10"
											}`}
										>
											<div className="flex items-center gap-2 mb-2">
												<svg
													className="w-5 h-5 text-[#3b82f6]"
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
												<span className="font-semibold text-[#f8f9fa]">
													Create a quiz
												</span>
											</div>
											<p className="text-xs text-[#a0a0b0]">
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
									<div className="space-y-3">
										<motion.button
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
											onClick={createQuiz}
											disabled={isTyping || quizMode === "give_quiz"}
											className="w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-xl font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-glow flex items-center justify-center gap-2"
										>
											{isTyping ||
											(quizMode === "give_quiz" &&
												quizQuestions.length === 0) ? (
												<>
													<svg
														className="animate-spin h-5 w-5 text-white"
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
												className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg"
											>
												<div className="flex items-start gap-3">
													<svg
														className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5"
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
													<div className="flex-1">
														<p className="text-sm font-medium text-[#ef4444] mb-1">
															Error creating quiz
														</p>
														<p className="text-sm text-[#f8f9fa]">
															{createQuizError}
														</p>
													</div>
													<button
														onClick={() => setCreateQuizError(null)}
														className="text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors"
													>
														<svg
															className="w-4 h-4"
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
									className="mt-3 w-full py-2 border border-[#a855f7]/20 text-[#a0a0b0] rounded-lg font-medium hover:bg-[#252532] hover:border-[#a855f7]/40 transition-colors"
								>
									Clear Session
								</button>
							)}
						</div>
					</div>

					{/* Error Display for Quiz Generation */}
					{quizMode === "give_quiz" && generateQuizError && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#ef4444]/30 p-6 shadow-lg mb-6"
						>
							<div className="flex items-start gap-3">
								<svg
									className="w-6 h-6 text-[#ef4444] shrink-0 mt-0.5"
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
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-[#ef4444] mb-2">
										Error Generating Quiz
									</h3>
									<p className="text-sm text-[#f8f9fa] mb-4">
										{generateQuizError}
									</p>
									<button
										onClick={() => {
											setGenerateQuizError(null);
											generateQuiz();
										}}
										className="px-4 py-2 bg-[#ef4444] text-white rounded-lg font-medium hover:bg-[#dc2626] transition-colors"
									>
										Try Again
									</button>
								</div>
								<button
									onClick={() => setGenerateQuizError(null)}
									className="text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors"
								>
									<svg
										className="w-5 h-5"
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

					{/* Quiz Display Section - Below Upload */}
					{quizMode === "give_quiz" && quizQuestions.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#a855f7]/20 p-6 shadow-lg mb-6"
						>
							<h2 className="text-2xl font-semibold mb-6 text-[#f8f9fa]">
								Quiz Questions
							</h2>
							<div className="space-y-6">
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
											className={`p-5 bg-[#252532] border-2 rounded-xl ${
												showResult
													? isCorrect
														? "border-[#10b981] bg-[#10b981]/10"
														: "border-[#ef4444] bg-[#ef4444]/10"
													: "border-[#a855f7]/30"
											}`}
										>
											<div className="flex items-start gap-3 mb-4">
												<div className="w-8 h-8 bg-gradient-to-br from-[#a855f7] to-[#3b82f6] rounded-lg flex items-center justify-center text-white font-bold shrink-0">
													{idx + 1}
												</div>
												<div className="flex-1">
													<p className="font-semibold text-[#f8f9fa] mb-3">
														{q.question}
													</p>
													<div className="space-y-2">
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
																	className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
																		quizSubmitted
																			? isCorrectOption
																				? "border-[#10b981] bg-[#10b981]/20 text-[#f8f9fa]"
																				: isSelected && !isCorrectOption
																				? "border-[#ef4444] bg-[#ef4444]/20 text-[#f8f9fa]"
																				: "border-[#252532] bg-[#1a1a24] text-[#a0a0b0]"
																			: isSelected
																			? "border-[#a855f7] bg-[#a855f7]/20 text-[#f8f9fa]"
																			: "border-[#252532] hover:border-[#a855f7]/50 hover:bg-[#a855f7]/10 text-[#f8f9fa]"
																	} ${
																		quizSubmitted
																			? "cursor-default"
																			: "cursor-pointer"
																	}`}
																>
																	<span className="font-semibold text-[#3b82f6] mr-2">
																		{optionLabels[optIdx]}.
																	</span>
																	{option}
																	{quizSubmitted && isCorrectOption && (
																		<span className="ml-2 text-[#10b981] font-semibold">
																			✓ Correct
																		</span>
																	)}
																	{quizSubmitted &&
																		isSelected &&
																		!isCorrectOption && (
																			<span className="ml-2 text-[#ef4444] font-semibold">
																				✗ Your answer
																			</span>
																		)}
																</button>
															);
														})}
													</div>
													{quizSubmitted && result?.explanation && (
														<div className="mt-3 p-3 bg-[#f97316]/10 border border-[#f97316]/30 rounded-lg">
															<p className="text-sm text-[#f8f9fa]">
																<span className="font-semibold">
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
									className="mt-6 w-full py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-xl font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
										className="mt-6 p-6 bg-gradient-to-br from-[#a855f7]/10 to-[#3b82f6]/10 border-2 border-[#a855f7]/30 rounded-xl text-center"
									>
										<h3 className="text-2xl font-bold text-[#f8f9fa] mb-2">
											Your Score
										</h3>
										<p className="text-4xl font-bold text-[#a855f7] mb-2">
											{quizResults.total_score} / {quizResults.total_questions}
										</p>
										<p className="text-sm text-[#a0a0b0]">
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
					)}

					{/* Create Quiz Generate Button */}
					{quizMode === "create_quiz" && !quizGenerated && (
						<div className="bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#3b82f6]/20 p-6 shadow-lg mb-6 space-y-4">
							<button
								onClick={generateCreateQuiz}
								disabled={isTyping}
								className="w-full py-3 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white rounded-lg font-semibold hover:from-[#2563eb] hover:to-[#9333ea] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isTyping ? "Generating..." : "Generate Quiz"}
							</button>

							{/* Error Message for Create Quiz Generation */}
							{generateCreateQuizError && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg"
								>
									<div className="flex items-start gap-3">
										<svg
											className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5"
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
										<div className="flex-1">
											<p className="text-sm font-medium text-[#ef4444] mb-1">
												Error generating quiz
											</p>
											<p className="text-sm text-[#f8f9fa]">
												{generateCreateQuizError}
											</p>
										</div>
										<button
											onClick={() => setGenerateCreateQuizError(null)}
											className="text-[#a0a0b0] hover:text-[#f8f9fa] transition-colors"
										>
											<svg
												className="w-4 h-4"
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

					{/* PDF Print Card - Separate Card */}
					{quizMode === "create_quiz" && quizGenerated && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="bg-[#1a1a24] backdrop-blur-md rounded-2xl border border-[#3b82f6]/20 p-6 shadow-lg mb-6"
						>
							<h2 className="text-xl font-semibold mb-4 text-[#f8f9fa]">
								Export Quiz
							</h2>
							<p className="text-sm text-[#a0a0b0] mb-4">
								Download your quiz as PDF files for printing or sharing.
							</p>
							<div className="grid md:grid-cols-2 gap-4">
								<button
									onClick={() => printToPDF("questions")}
									className="py-4 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] text-white rounded-lg font-semibold hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 flex items-center justify-center gap-2"
								>
									<svg
										className="w-5 h-5"
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
									className="py-4 bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white rounded-lg font-semibold hover:from-[#2563eb] hover:to-[#9333ea] transition-all duration-300 flex items-center justify-center gap-2"
								>
									<svg
										className="w-5 h-5"
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
					)}
				</div>
			</div>
		</>
	);
}
