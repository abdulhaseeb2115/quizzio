"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1a24] to-[#0a0a0f] border-t border-[#a855f7]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-3 max-w-2xl">
            <Logo />
            <p className="text-sm text-[#a0a0b0] text-center md:text-left leading-relaxed">
              Quizzio transforms your PDF documents into interactive quizzes. Upload any PDF and generate comprehensive multiple-choice questions instantly. Perfect for educators, students, and professionals.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[#a0a0b0] hover:text-[#a855f7] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/quiz"
              className="text-sm text-[#a0a0b0] hover:text-[#a855f7] transition-colors"
            >
              Quiz
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#a855f7]/20">
          <p className="text-xs text-[#a0a0b0] text-center">
            © {new Date().getFullYear()} Quizzio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
