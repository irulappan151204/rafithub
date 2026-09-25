"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
        alt: "Main gym floor",
        category: "Facility",
    },
    {
        src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=800&fit=crop",
        alt: "Group fitness class",
        category: "Classes",
    },
    {
        src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=600&fit=crop",
        alt: "Weight training area",
        category: "Facility",
    },
    {
        src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=800&fit=crop",
        alt: "Personal training",
        category: "Training",
    },
    {
        src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop",
        alt: "Boxing training",
        category: "Training",
    },
    {
        src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=800&fit=crop",
        alt: "Cardio zone",
        category: "Facility",
    },
    {
        src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop",
        alt: "Free weights section",
        category: "Facility",
    },
    {
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
        alt: "Yoga session",
        category: "Classes",
    },
    {
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        alt: "HIIT class",
        category: "Classes",
    },
    {
        src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop",
        alt: "Boxing ring",
        category: "Facility",
    },
    {
        src: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&h=600&fit=crop",
        alt: "Member workout",
        category: "Training",
    },
    {
        src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=800&fit=crop",
        alt: "CrossFit area",
        category: "Facility",
    },
];

const categories = ["All", "Facility", "Classes", "Training"];

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const filteredImages =
        selectedCategory === "All"
            ? galleryImages
            : galleryImages.filter((img) => img.category === selectedCategory);

    const openLightbox = (index: number) => {
        const actualIndex = galleryImages.findIndex(
            (img) => img.src === filteredImages[index].src
        );
        setCurrentImageIndex(actualIndex);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const goToPrevious = useCallback(() => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? galleryImages.length - 1 : prev - 1
        );
    }, []);

    const goToNext = useCallback(() => {
        setCurrentImageIndex((prev) =>
            prev === galleryImages.length - 1 ? 0 : prev + 1
        );
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        },
        [lightboxOpen, goToPrevious, goToNext]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
            <PageHero
                eyebrow="Gallery"
                title={<>Inside <span className="text-gradient-gold">Rafithub</span></>}
                description="Take a virtual tour of our world-class facilities, equipment, and the incredible community that makes Rafithub special."
                imageSrc="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1920&q=80"
                stats={[
                    { value: "12", label: "Scenes" },
                    { value: "3", label: "Filters" },
                    { value: "HD", label: "Preview" },
                    { value: "Live", label: "Energy" },
                ]}
            />

            {/* Category Filter */}
            <section className="container-custom px-4 md:px-8 mb-12">
                <FadeUp delay={0.1}>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeUp>
            </section>

            {/* Gallery Grid */}
            <section className="container-custom px-4 md:px-8 pb-20">
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((image, index) => (
                            <StaggerItem key={image.src}>
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => openLightbox(index)}
                                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-[var(--border)]"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay with permanent dark background for text readability */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1 }}
                                            className="w-14 h-14 bg-[var(--primary)] rounded-full flex items-center justify-center mb-3"
                                        >
                                            <svg
                                                className="w-6 h-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                                />
                                            </svg>
                                        </motion.div>
                                        {/* Text is always white on dark overlay */}
                                        <span className="text-white font-medium">{image.alt}</span>
                                        <span className="text-[var(--primary)] text-sm">{image.category}</span>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </AnimatePresence>
                </StaggerContainer>
            </section>

            {/* Lightbox Modal - Always Dark */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image lightbox"
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
                        >
                            <HiX className="w-8 h-8" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                            aria-label="Previous image"
                        >
                            <HiChevronLeft className="w-8 h-8" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                            aria-label="Next image"
                        >
                            <HiChevronRight className="w-8 h-8" />
                        </button>

                        {/* Image */}
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl aspect-video mx-4"
                        >
                            <Image
                                src={galleryImages[currentImageIndex].src}
                                alt={galleryImages[currentImageIndex].alt}
                                fill
                                sizes="(max-width: 1280px) 92vw, 1024px"
                                className="object-contain"
                            />
                        </motion.div>

                        {/* Image Info */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                            <p className="text-white font-medium">
                                {galleryImages[currentImageIndex].alt}
                            </p>
                            <p className="text-gray-300 text-sm">
                                {currentImageIndex + 1} / {galleryImages.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
