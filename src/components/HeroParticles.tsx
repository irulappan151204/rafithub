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

        let animId = 0;
        let isDisposed = false;
        let renderer: import("three").WebGLRenderer | null = null;
        let removeListeners: (() => void) | null = null;

        (async () => {
            const THREE = await import("three");
            const canvas = canvasRef.current;
            if (!canvas || isDisposed) return;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                70,
                canvas.offsetWidth / Math.max(canvas.offsetHeight, 1),
                0.1,
                300
            );
            camera.position.z = 80;

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
            renderer.setClearColor(0x000000, 0);

            function makeParticles(
                count: number,
                spread: number,
                size: number,
                color: number,
                opacity: number
            ) {
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

            const nearParticles = makeParticles(700, 200, 0.55, 0x00f08a, 0.72);
            const farParticles = makeParticles(450, 260, 0.35, 0xf8d65d, 0.38);
            const microParticles = makeParticles(300, 180, 0.22, 0x6ee7f9, 0.28);

            scene.add(nearParticles, farParticles, microParticles);

            let mouseX = 0;
            let mouseY = 0;
            const onMouseMove = (e: MouseEvent) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            const onResize = () => {
                if (!renderer || !canvas) return;
                const w = canvas.offsetWidth;
                const h = Math.max(canvas.offsetHeight, 1);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            };

            window.addEventListener("mousemove", onMouseMove, { passive: true });
            window.addEventListener("resize", onResize, { passive: true });
            removeListeners = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("resize", onResize);
            };

            let t = 0;
            const render = () => {
                if (isDisposed || !renderer) return;
                animId = requestAnimationFrame(render);
                t += 0.0006;

                nearParticles.rotation.y = t * 0.4 + mouseX * 0.06;
                nearParticles.rotation.x = t * 0.18 - mouseY * 0.04;
                farParticles.rotation.y = -t * 0.22 + mouseX * 0.03;
                farParticles.rotation.x = -t * 0.1 - mouseY * 0.02;
                microParticles.rotation.y = t * 0.3 - mouseX * 0.05;

                camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
                camera.position.y += (-mouseY * 3 - camera.position.y) * 0.04;
                camera.lookAt(0, 0, 0);

                renderer.render(scene, camera);
            };
            render();
        })();

        return () => {
            isDisposed = true;
            cancelAnimationFrame(animId);
            removeListeners?.();
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
