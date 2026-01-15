"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import axios from "axios";
import AnimatedBackground from "@/components/AnimatedBackground";
import UploadSection from "@/components/quiz/uploadSection";
import ErrorDisplay from "@/components/quiz/errorDisplay";
import QuizDisplay from "@/components/quiz/quizDisplay";
import CreateQuizSection from "@/components/quiz/createQuizSection";
import PdfExport from "@/components/quiz/pdfExport";

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

	const styles = {
		container: "relative min-h-screen pt-16 pb-8",
		innerContainer: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
	};

	return (
		<>
			<AnimatedBackground />

			<div className={styles.container}>
				<div className={styles.innerContainer}>
					<UploadSection
						file={file}
						fileInputRef={fileInputRef}
						dragActive={dragActive}
						uploading={uploading}
						uploadProgress={uploadProgress}
						sessionId={sessionId}
						showQuizModeSelection={showQuizModeSelection}
						quizMode={quizMode}
						selectedMode={selectedMode}
						createQuizError={createQuizError}
						isTyping={isTyping}
						loadingStep={loadingStep}
						loadingSteps={loadingSteps}
						quizQuestions={quizQuestions}
						handleDrag={handleDrag}
						handleDrop={handleDrop}
						handleFileChange={handleFileChange}
						handleModeSelection={handleModeSelection}
						createQuiz={createQuiz}
						clearSession={clearSession}
						setCreateQuizError={setCreateQuizError}
					/>

					{quizMode === "give_quiz" && (
						<ErrorDisplay
							generateQuizError={generateQuizError}
							setGenerateQuizError={setGenerateQuizError}
							generateQuiz={generateQuiz}
						/>
					)}

					{quizMode === "give_quiz" && (
						<QuizDisplay
							quizQuestions={quizQuestions}
							userAnswers={userAnswers}
							quizSubmitted={quizSubmitted}
							quizResults={quizResults}
							isTyping={isTyping}
							handleAnswerSelect={handleAnswerSelect}
							submitQuiz={submitQuiz}
						/>
					)}

					{quizMode === "create_quiz" && (
						<CreateQuizSection
							quizGenerated={quizGenerated}
							isTyping={isTyping}
							generateCreateQuizError={generateCreateQuizError}
							generateCreateQuiz={generateCreateQuiz}
							setGenerateCreateQuizError={setGenerateCreateQuizError}
						/>
					)}

					{quizMode === "create_quiz" && quizGenerated && (
						<PdfExport printToPDF={printToPDF} />
					)}
				</div>
			</div>
		</>
	);
}
