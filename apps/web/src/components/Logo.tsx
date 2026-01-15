"use client";

import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="inline-block group">
			<span className="relative text-2xl font-bold bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#3b82f6] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
				Quizzio
				<span className="absolute inset-0 text-2xl font-bold bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#3b82f6] bg-clip-text text-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300">
					Quizzio
				</span>
			</span>
		</Link>
	);
}
