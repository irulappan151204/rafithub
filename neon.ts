import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  preview: {
    realtime: {
      allowedOrigins: [
        "http://localhost:3000",
        "https://www.rafithub.com",
        "https://rafithub.com",
      ],
    },
  },
  auth: true,
  buckets: {
    // Public read bucket for website media (trainers, gallery, hero)
    assets: { access: "public_read" },
    // Private bucket for sensitive member photos, documents, and receipts
    uploads: { access: "private" },
  },
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      return {};
    }
    if (!branch.exists) {
      return { ttl: "7d" };
    }
    return {};
  },
});
