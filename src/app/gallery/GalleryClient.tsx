"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ScrollAnimations";
import PageHero from "@/components/PageHero";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

export interface PublicGalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export default function GalleryClient({ images }: { images: PublicGalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ["All", ...Array.from(new Set(images.map((i) => i.category)))];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    const actualIndex = images.findIndex((img) => img.id === filteredImages[index].id);
    setCurrentImageIndex(actualIndex >= 0 ? actualIndex : 0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = useCallback(() => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

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
        title={
          <>
            Inside <span className="text-gradient-gold">Rafithub</span>
          </>
        }
        description="Take a virtual tour of our facilities, equipment, and the community that makes Rafithub special."
        imageSrc="/assets/hero/hero-desktop-lg.webp"
        stats={[
          { value: String(images.length), label: "Photos" },
          { value: String(Math.max(categories.length - 1, 0)), label: "Categories" },
          { value: "HD", label: "Preview" },
          { value: "Madurai", label: "Facility" },
        ]}
      />

      {images.length === 0 ? (
        <section className="container-custom px-4 md:px-8 pb-24 text-center">
          <div className="card-glass max-w-xl mx-auto p-10">
            <h2 className="text-xl font-bold mb-2">Facility Photos Coming Soon</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Upload photos of the Rafithub floor, classes, and transformations from the Admin CMS.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="container-custom px-4 md:px-8 mb-12">
            <FadeUp delay={0.1}>
              <div className="flex justify-center gap-4 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category
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

          <section className="container-custom px-4 md:px-8 pb-20">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <StaggerItem key={image.id}>
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <span className="text-white font-medium">{image.alt}</span>
                        <span className="text-[var(--primary)] text-sm">{image.category}</span>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </AnimatePresence>
            </StaggerContainer>
          </section>
        </>
      )}

      <AnimatePresence>
        {lightboxOpen && images[currentImageIndex] && (
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
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-10"
            >
              <HiX className="w-8 h-8" />
            </button>
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
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-video mx-4"
            >
              <Image
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                fill
                sizes="(max-width: 1280px) 92vw, 1024px"
                className="object-contain"
              />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-medium">{images[currentImageIndex].alt}</p>
              <p className="text-gray-300 text-sm">
                {currentImageIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
