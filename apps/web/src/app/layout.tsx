import type { Metadata } from "next";
import { Inter, Ubuntu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const ubuntu = Ubuntu({
	variable: "--font-ubuntu",
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Quizzio - AI-Powered Quiz Generator from PDFs",
	description:
		"Quizzio transforms your PDF documents into interactive quizzes. Upload any PDF and generate comprehensive multiple-choice questions instantly. Perfect for educators, students, and professionals. Create quizzes or take interactive tests with instant scoring.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.variable} ${ubuntu.variable} antialiased bg-[#0a0a0f] text-[#f8f9fa] max-h-screen`}
			>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
