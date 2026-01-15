"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
	const pathname = usePathname();

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/quiz", label: "Quiz" },
	];

	return (
		<motion.nav
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl shadow-lg shadow-[#a855f7]/5"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Logo />
					</motion.div>
					<div className="flex items-center gap-2">
						{navLinks.map((link, index) => {
							const isActive = pathname === link.href;
							return (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 + 0.3 }}
								>
									<Link href={link.href}>
										<motion.div
											className="relative px-4 py-2 rounded-lg"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 17,
											}}
										>
											{isActive && (
												<motion.div
													layoutId="activeTab"
													className="absolute inset-0 bg-gradient-to-r from-[#a855f7]/20 to-[#3b82f6]/20 rounded-lg border border-[#a855f7]/40"
													initial={false}
													transition={{
														type: "spring",
														stiffness: 500,
														damping: 30,
													}}
												/>
											)}
											<span
												className={`relative z-10 text-sm font-semibold transition-all duration-300 ${
													isActive
														? "text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
														: "text-[#a0a0b0] hover:text-[#c084fc]"
												}`}
											>
												{link.label}
											</span>
											{!isActive && (
												<motion.div
													className="absolute inset-0 rounded-lg bg-[#a855f7]/0 hover:bg-[#a855f7]/10 transition-colors duration-300"
													initial={false}
												/>
											)}
										</motion.div>
									</Link>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
			{/* Subtle bottom glow */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/50 to-transparent" />
		</motion.nav>
	);
}
