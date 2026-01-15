"use client";

import AnimatedBackground from "@/components/AnimatedBackground";
import Hero from "@/components/home/hero";
import About from "@/components/home/about";
import CTA from "@/components/home/cta";

const styles = {
	container: "relative min-h-screen overflow-y-auto",
};

export default function Home() {
	return (
		<>
			<AnimatedBackground heroMode={true} />
			<div className={styles.container}>
				<Hero />
				<About />
				<CTA />
			</div>
		</>
	);
}
