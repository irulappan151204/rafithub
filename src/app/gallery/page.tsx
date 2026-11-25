import GalleryClient from "./GalleryClient";
import { getPublicGallery } from "@/server/services/cms";

export default async function GalleryPage() {
  const gallery = await getPublicGallery();
  return (
    <GalleryClient
      images={gallery.map((g) => ({
        id: g.id,
        src: g.imageUrl,
        alt: g.caption,
        category: g.category,
      }))}
    />
  );
}
