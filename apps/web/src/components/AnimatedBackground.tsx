"use client";

import { useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";

interface AnimatedBackgroundProps {
	heroMode?: boolean;
}

export default function AnimatedBackground({
	heroMode = false,
}: AnimatedBackgroundProps) {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			await loadFull(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesConfig: ISourceOptions = useMemo(
		() => ({
			fullScreen: {
				enable: false,
			},
			background: {
				color: {
					value: "transparent",
				},
			},
			fpsLimit: 120,
			interactivity: {
				events: {
					onClick: {
						enable: true,
						mode: "push",
					},
					onHover: {
						enable: true,
						mode: "repulse",
					},
					resize: true,
				},
				modes: {
					push: {
						quantity: 4,
					},
					repulse: {
						distance: 200,
						duration: 0.4,
					},
				},
			},
			particles: {
				color: {
					value: heroMode
						? ["#a855f7", "#3b82f6", "#f97316", "#9333ea"]
						: ["#a855f7", "#3b82f6", "#9333ea"],
				},
				links: {
					color: "#a855f7",
					distance: 150,
					enable: true,
					opacity: 0.3,
					width: 1,
				},
				move: {
					direction: "none",
					enable: true,
					outModes: {
						default: "bounce",
					},
					random: false,
					speed: 1,
					straight: false,
				},
				number: {
					density: {
						enable: true,
						area: 800,
					},
					value: heroMode ? 80 : 60,
				},
				opacity: {
					value: 0.5,
					animation: {
						enable: true,
						speed: 0.5,
						minimumValue: 0.1,
						sync: false,
					},
				},
				shape: {
					type: "circle",
				},
				size: {
					value: { min: 1, max: 3 },
					animation: {
						enable: true,
						speed: 2,
						minimumValue: 0.5,
						sync: false,
					},
				},
			},
			detectRetina: true,
		}),
		[heroMode]
	);

	if (!init) {
		return (
			<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none w-full h-full bg-[#0a0a0f]" />
		);
	}

	return (
		<div
			className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
			style={{
				width: "100vw",
				height: "100vh",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
				}}
			>
				<Particles
					id="tsparticles"
					options={particlesConfig}
					style={{
						width: "100%",
						height: "100%",
						position: "absolute",
						top: 0,
						left: 0,
					}}
				/>
			</div>
			{/* Gradient overlay for depth */}
			<div
				className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent ${
					heroMode ? "to-transparent" : "to-[#0a0a0f]/50"
				}`}
				style={{ pointerEvents: "none" }}
			/>
		</div>
	);
}
