import { NextRequest, NextResponse } from "next/server";
import { AuthorizationError, requireStaff } from "@/lib/auth/server";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  isStorageConfigured,
  uploadImageObject,
} from "@/lib/storage";
import { recordAuditLog } from "@/server/services/audit";

const VALID_FOLDERS = new Set(["hero", "trainers", "gallery", "classes", "members", "seo"]);

export async function POST(request: NextRequest) {
  try {
    const staff = await requireStaff({ permission: "upload:media" });

    if (!isStorageConfigured()) {
      return NextResponse.json(
        {
          error:
            "Neon Object Storage env vars (AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are not configured. Run `neon deploy` first.",
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const rawFolder = String(formData.get("folder") ?? "gallery");
    const isPublic = formData.get("visibility") !== "private";

    if (!VALID_FOLDERS.has(rawFolder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing image file" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await uploadImageObject({
      folder: rawFolder as "hero" | "trainers" | "gallery" | "classes" | "members" | "seo",
      buffer: Buffer.from(arrayBuffer),
      contentType: file.type,
      isPublic,
    });

    await recordAuditLog({
      userId: staff.user.id,
      action: "UPLOAD_MEDIA",
      entity: "StorageObject",
      entityId: uploaded.key,
      diff: { bucket: uploaded.bucket, size: file.size, type: file.type },
    });

    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
