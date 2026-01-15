"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
	return (
		<>
			<AnimatedBackground heroMode={true} />
			<div className="relative min-h-screen overflow-y-auto">
				{/* Hero Section */}
				<section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
					<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Side - Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="space-y-6"
						>
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
							>
								<span className="bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#f97316] bg-clip-text text-transparent animate-gradient">
									Quizzio
								</span>
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="text-xl sm:text-2xl text-[#a0a0b0]"
							>
								Transform PDFs into Interactive Quizzes
							</motion.p>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className="text-lg text-[#a0a0b0] leading-relaxed"
							>
								Upload any PDF document and instantly generate comprehensive
								multiple-choice quizzes. Perfect for educators, students, and
								professionals who want to test knowledge efficiently.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.8 }}
							>
								<Link
									href="/quiz"
									className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#a855f7] to-[#3b82f6] rounded-xl hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow shadow-lg shadow-purple-500/50"
								>
									Start Creating Quizzes
									<svg
										className="ml-2 w-5 h-5"
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
						</motion.div>

						{/* Right Side - Hero Image */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="flex items-center justify-center"
						>
							<motion.div
								animate={{
									y: [0, -20, 0],
									rotate: [0, 2, 0],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									repeatType: "reverse",
									ease: "easeInOut",
								}}
								className="relative"
							>
								<Image
									src="/hero.png"
									alt="Quizzio Hero"
									width={600}
									height={600}
									className="w-full h-auto max-w-lg rounded-2xl overflow-hidden rotate-6 object-contain drop-shadow-2xl"
									priority
								/>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 px-4 sm:px-6 lg:px-8 relative">
					<div className="max-w-7xl mx-auto">
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent"
						>
							Powerful Features
						</motion.h2>
						<div className="grid md:grid-cols-3 gap-8">
							{/* Feature 1 */}
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="bg-[#1a1a24] rounded-2xl p-8 border border-[#a855f7]/20 hover:border-[#a855f7]/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
									<svg
										className="w-8 h-8 text-white"
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
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									Upload PDF
								</h3>
								<p className="text-[#a0a0b0]">
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
								className="bg-[#1a1a24] rounded-2xl p-8 border border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
									<svg
										className="w-8 h-8 text-white"
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
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									AI Generation
								</h3>
								<p className="text-[#a0a0b0]">
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
								className="bg-[#1a1a24] rounded-2xl p-8 border border-[#f97316]/20 hover:border-[#f97316]/40 transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
							>
								<div className="w-16 h-16 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
									<svg
										className="w-8 h-8 text-white"
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
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									Interactive Quizzes
								</h3>
								<p className="text-[#a0a0b0]">
									Take quizzes interactively with instant scoring, or export
									them as PDFs for offline use.
								</p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-[#1a1a24]/30 to-transparent">
					<div className="max-w-7xl mx-auto">
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent"
						>
							How It Works
						</motion.h2>
						<div className="grid md:grid-cols-4 gap-8">
							{/* Step 1 */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}
								className="text-center"
							>
								<div className="w-20 h-20 bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
									<span className="text-3xl font-bold text-white">1</span>
								</div>
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									Upload PDF
								</h3>
								<p className="text-[#a0a0b0]">
									Select or drag and drop your PDF document into the platform.
								</p>
							</motion.div>

							{/* Step 2 */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="text-center"
							>
								<div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
									<span className="text-3xl font-bold text-white">2</span>
								</div>
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									AI Processing
								</h3>
								<p className="text-[#a0a0b0]">
									Our AI analyzes the content and extracts key information.
								</p>
							</motion.div>

							{/* Step 3 */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="text-center"
							>
								<div className="w-20 h-20 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
									<span className="text-3xl font-bold text-white">3</span>
								</div>
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									Generate Quiz
								</h3>
								<p className="text-[#a0a0b0]">
									Choose to take an interactive quiz or create one for export.
								</p>
							</motion.div>

							{/* Step 4 */}
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="text-center"
							>
								<div className="w-20 h-20 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
									<span className="text-3xl font-bold text-white">4</span>
								</div>
								<h3 className="text-xl font-semibold mb-3 text-[#f8f9fa]">
									Get Results
								</h3>
								<p className="text-[#a0a0b0]">
									Receive instant scores, explanations, or export your quiz.
								</p>
							</motion.div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-24 px-4 sm:px-6 lg:px-8 relative">
					<div className="max-w-4xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="bg-gradient-to-br from-[#1a1a24] to-[#252532] rounded-3xl p-12 border border-[#a855f7]/20 shadow-2xl"
						>
							<h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent">
								Ready to Create Your First Quiz?
							</h2>
							<p className="text-xl text-[#a0a0b0] mb-8">
								Transform your PDFs into engaging quizzes in seconds. No account
								required, completely free to use.
							</p>
							<Link
								href="/quiz"
								className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#a855f7] to-[#3b82f6] rounded-xl hover:from-[#9333ea] hover:to-[#2563eb] transition-all duration-300 hover-glow shadow-lg shadow-purple-500/50"
							>
								Get Started Now
								<svg
									className="ml-2 w-5 h-5"
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
			</div>
		</>
	);
}
