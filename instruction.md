# Hero Section — Media File Setup Instructions

This guide explains how to add and change the Hero section's background media.

---

## 📁 File Locations

All hero media files go in:

```
public/assets/hero/
```

---

## 🖥️ Desktop Image Files (Required)

The desktop hero shows a **static background image** with responsive `srcSet`.

| File | Resolution | Format | Max Size |
|---|---|---|---|
| `hero-desktop.jpg` | 1920×1080 | JPEG | 300KB (fallback) |
| `hero-desktop-sm.webp` | 1024×576 | WebP | 100KB |
| `hero-desktop-md.webp` | 1440×810 | WebP | 150KB |
| `hero-desktop-lg.webp` | 1920×1080 | WebP | 200KB |

### How to create these files:

1. Start with a high-quality source image (3000px+ wide recommended)
2. Export 3 WebP versions at different sizes using any image editor or CLI tool:

**Using ImageMagick (CLI):**
```bash
# Convert and resize
magick source.jpg -resize 1024x576 -quality 80 hero-desktop-sm.webp
magick source.jpg -resize 1440x810 -quality 80 hero-desktop-md.webp
magick source.jpg -resize 1920x1080 -quality 80 hero-desktop-lg.webp

# JPEG fallback
magick source.jpg -resize 1920x1080 -quality 85 hero-desktop.jpg
```

**Using Squoosh (web-based):**
Visit [squoosh.app](https://squoosh.app), upload your image, choose WebP format, resize, and download.

### Image content guidelines:
- Use a **landscape** gym/fitness image
- Subject should be on the **right side** (text overlays the left)
- Dark-toned images work best (gradient overlay covers ~40-60%)
- Avoid bright/white areas on the left half

---

## 📱 Mobile Video Files (Required)

The mobile hero shows an **autoplay background video** (muted, looping).

| File | Resolution | Format | Max Size | Codec |
|---|---|---|---|---|
| `hero-mobile.mp4` | 720×1280 (portrait) | MP4 | 3MB | H.264 |
| `hero-mobile.webm` | 720×1280 (portrait) | WebM | 2.5MB | VP9 |
| `hero-mobile-poster.webp` | 720×1280 | WebP | 50KB | — |

### How to create these files:

1. Start with a short gym/workout video clip (5-10 seconds, loopable)
2. Export using FFmpeg:

```bash
# MP4 (H.264) — keep under 3MB
ffmpeg -i source.mp4 -vf "scale=720:1280" -c:v libx264 -crf 28 -preset slow -an -t 8 hero-mobile.mp4

# WebM (VP9) — keep under 2.5MB
ffmpeg -i source.mp4 -vf "scale=720:1280" -c:v libvpx-vp9 -crf 35 -b:v 0 -an -t 8 hero-mobile.webm

# Poster image (first frame)
ffmpeg -i hero-mobile.mp4 -vframes 1 -q:v 2 hero-mobile-poster.webp
```

### Video content guidelines:
- **Portrait orientation** (9:16 aspect ratio)
- **5-10 second** seamless loop
- **No audio** — video is always muted
- Dynamic gym content (training, equipment, etc.)
- `playsInline` is already set for iOS Safari compatibility

---

## 🔄 How to Change Media Later

### Replacing the desktop image:
1. Create new images following the specs above
2. Name them exactly: `hero-desktop.jpg`, `hero-desktop-sm.webp`, `hero-desktop-md.webp`, `hero-desktop-lg.webp`
3. Drop them into `public/assets/hero/` (overwrite existing files)
4. Clear browser cache and refresh

### Replacing the mobile video:
1. Create new video files following the specs above
2. Name them exactly: `hero-mobile.mp4`, `hero-mobile.webm`, `hero-mobile-poster.webp`
3. Drop them into `public/assets/hero/` (overwrite existing files)
4. Clear browser cache and refresh

### Switching mobile from video to image:
If you want a **static image** on mobile instead of video, edit `src/components/Hero.tsx`:

```tsx
// In the MobileHeroMedia component, replace the <video> with:
function MobileHeroMedia() {
    return (
        <img
            src="/assets/hero/hero-mobile.webp"
            alt="Rafithub gym mobile view"
            loading="eager"
            width={720}
            height={1280}
            className="hero-mobile-video"
        />
    );
}
```

### Switching desktop from image to video:
Edit `src/components/Hero.tsx`:

```tsx
// In the DesktopHeroMedia component, replace the <picture> with:
function DesktopHeroMedia() {
    return (
        <video
            autoPlay muted loop playsInline
            preload="metadata"
            poster="/assets/hero/hero-desktop-poster.webp"
            className="hero-desktop-image"
        >
            <source src="/assets/hero/hero-desktop.webm" type="video/webm" />
            <source src="/assets/hero/hero-desktop.mp4" type="video/mp4" />
        </video>
    );
}
```

---

## ✅ Final Checklist

After adding your media files, verify:

- [ ] All 4 desktop image files exist in `public/assets/hero/`
- [ ] All 3 mobile video files exist in `public/assets/hero/`
- [ ] Desktop image loads at `≥769px` viewport width
- [ ] Mobile video loads at `≤768px` viewport width
- [ ] Video autoplays (muted) on iOS and Android
- [ ] Text is readable over the media in both dark and light themes
- [ ] No layout shift when the page loads
- [ ] File sizes are within the recommended limits
