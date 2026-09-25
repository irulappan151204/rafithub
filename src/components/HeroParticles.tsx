"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Lazy-loads Three.js only on the client so SSR is never impacted.
export default function HeroParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (shouldReduceMotion) return;
        if (!canvasRef.current) return;

        let animId: number;
        let renderer: import("three").WebGLRenderer | null = null;

        (async () => {
            const THREE = await import("three");
            const canvas = canvasRef.current;
            if (!canvas) return;

            // ── Scene setup ──────────────────────────────────────────────
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(70, canvas.offsetWidth / canvas.offsetHeight, 0.1, 300);
            camera.position.z = 80;

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
            renderer.setClearColor(0x000000, 0);

            // ── Particles — 2 layers for depth parallax ──────────────────
            const COUNT_NEAR = 900;
            const COUNT_FAR = 600;

            function makeParticles(count: number, spread: number, size: number, color: number, opacity: number) {
                const geo = new THREE.BufferGeometry();
                const pos = new Float32Array(count * 3);
                for (let i = 0; i < count; i++) {
                    pos[i * 3] = (Math.random() - 0.5) * spread;
                    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.8;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
                }
                geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
                const mat = new THREE.PointsMaterial({
                    color,
                    size,
                    transparent: true,
                    opacity,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                    sizeAttenuation: true,
                });
                return new THREE.Points(geo, mat);
            }

            // Green primary dots (closer layer)
            const nearParticles = makeParticles(COUNT_NEAR, 200, 0.55, 0x00f08a, 0.72);
            // Gold accent dots (far layer)
            const farParticles = makeParticles(COUNT_FAR, 260, 0.35, 0xf8d65d, 0.38);
            // Cyan tiny sparkles
            const microParticles = makeParticles(400, 180, 0.22, 0x6ee7f9, 0.28);

            scene.add(nearParticles, farParticles, microParticles);

            // ── Connecting lines between nearby near-particles ────────────
            const lineGeo = new THREE.BufferGeometry();
            const nearPos = nearParticles.geometry.attributes.position.array as Float32Array;
            const lineVerts: number[] = [];
            const maxDist = 18;
            for (let i = 0; i < COUNT_NEAR; i++) {
                for (let j = i + 1; j < COUNT_NEAR; j++) {
                    const dx = nearPos[i * 3] - nearPos[j * 3];
                    const dy = nearPos[i * 3 + 1] - nearPos[j * 3 + 1];
                    const dz = nearPos[i * 3 + 2] - nearPos[j * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
                        lineVerts.push(
                            nearPos[i * 3], nearPos[i * 3 + 1], nearPos[i * 3 + 2],
                            nearPos[j * 3], nearPos[j * 3 + 1], nearPos[j * 3 + 2]
                        );
                    }
                }
            }
            lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
            const lineMat = new THREE.LineBasicMaterial({ color: 0x00f08a, transparent: true, opacity: 0.06 });
            const lines = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(lines);

            // ── Mouse parallax ────────────────────────────────────────────
            let mouseX = 0;
            let mouseY = 0;
            const onMouseMove = (e: MouseEvent) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            window.addEventListener("mousemove", onMouseMove, { passive: true });

            // ── Resize handler ────────────────────────────────────────────
            const onResize = () => {
                if (!renderer || !canvas) return;
                const w = canvas.offsetWidth;
                const h = canvas.offsetHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };
            window.addEventListener("resize", onResize, { passive: true });

            // ── Render loop ───────────────────────────────────────────────
            let t = 0;
            const render = () => {
                animId = requestAnimationFrame(render);
                t += 0.0006;

                // Slow drift rotation on particle groups
                nearParticles.rotation.y = t * 0.4 + mouseX * 0.06;
                nearParticles.rotation.x = t * 0.18 - mouseY * 0.04;
                farParticles.rotation.y = -t * 0.22 + mouseX * 0.03;
                farParticles.rotation.x = -t * 0.1 - mouseY * 0.02;
                microParticles.rotation.y = t * 0.3 - mouseX * 0.05;

                lines.rotation.y = nearParticles.rotation.y;
                lines.rotation.x = nearParticles.rotation.x;

                // Gentle camera sway for depth parallax feel
                camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
                camera.position.y += (-mouseY * 3 - camera.position.y) * 0.04;
                camera.lookAt(0, 0, 0);

                renderer!.render(scene, camera);
            };
            render();
        })();

        return () => {
            cancelAnimationFrame(animId);
            renderer?.dispose();
        };
    }, [shouldReduceMotion]);

    if (shouldReduceMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            aria-hidden="true"
        />
    );
}
