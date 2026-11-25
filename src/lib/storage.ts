import "server-only";

import crypto from "node:crypto";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const ASSETS_BUCKET = process.env.NEON_ASSETS_BUCKET ?? "assets";
export const UPLOADS_BUCKET = process.env.NEON_UPLOADS_BUCKET ?? "uploads";

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

let cachedClient: S3Client | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_ENDPOINT_URL_S3
  );
}

export function getS3Client(): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      forcePathStyle: true,
      region: process.env.AWS_REGION ?? "ap-southeast-1",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
    });
  }
  return cachedClient;
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

export function buildPublicAssetUrl(key: string, bucket = ASSETS_BUCKET): string {
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? "").replace(/\/+$/, "");
  if (!endpoint) return key;
  return `${endpoint}/${bucket}/${key.replace(/^\/+/, "")}`;
}

export async function uploadImageObject(params: {
  folder: "hero" | "trainers" | "gallery" | "classes" | "members" | "seo";
  buffer: Buffer;
  contentType: string;
  isPublic?: boolean;
}): Promise<{ bucket: string; key: string; url: string }> {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(params.contentType)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, WebP, or AVIF.");
  }
  if (params.buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image exceeds 5 MB upload limit.");
  }

  const bucket = params.isPublic !== false ? ASSETS_BUCKET : UPLOADS_BUCKET;
  const ext = extensionForMime(params.contentType);
  const key = `${params.folder}/${crypto.randomUUID()}.${ext}`;
  const s3 = getS3Client();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
      CacheControl:
        bucket === ASSETS_BUCKET
          ? "public, max-age=31536000, immutable"
          : "private, max-age=3600",
    })
  );

  const url =
    bucket === ASSETS_BUCKET
      ? buildPublicAssetUrl(key, bucket)
      : await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
          expiresIn: 3600,
        });

  return { bucket, key, url };
}

export async function getPresignedAssetUrl(
  key: string,
  bucket = UPLOADS_BUCKET,
  expiresIn = 3600
): Promise<string> {
  const s3 = getS3Client();
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
}

export async function verifyObjectExists(key: string, bucket = ASSETS_BUCKET): Promise<boolean> {
  try {
    const s3 = getS3Client();
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function deleteObject(key: string, bucket = ASSETS_BUCKET): Promise<void> {
  const s3 = getS3Client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
