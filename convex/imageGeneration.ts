"use node";

import { v } from "convex/values";
import sharp from "sharp";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

const IMAGE_MODEL = "grok-imagine-image-2.0";
const DEFAULT_BASE_URL = "https://aihubmix.com";

type ImageTaskResponse = {
  status?: string;
  error?: { message?: string } | string;
  output?: Array<{
    b64_json?: string;
    content_url?: string;
    revised_prompt?: string;
  }>;
};

export const generate = action({
  args: {
    prompt: v.string(),
    referenceImages: v.optional(v.array(v.string())),
    sessionId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { prompt, referenceImages, sessionId },
  ): Promise<{
    id: string;
    prompt: string;
    width: number;
    height: number;
    originalUrl: string;
    previewUrl: string;
    lightboxUrl: string;
    originalBytes: number;
    previewBytes: number;
    lightboxBytes: number;
  }> => {
    const apiKey = process.env.AIHUBMIX_API_KEY ?? process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing AIHubMix API key.");
    }

    const baseUrl = (
      process.env.AIHUBMIX_BASE_URL ?? DEFAULT_BASE_URL
    ).replace(/\/$/, "");

    const normalizedReferences = referenceImages?.length
      ? await Promise.all(referenceImages.map(toReferenceImage))
      : undefined;

    const response = await fetch(`${baseUrl}/ai/v1/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        n: 1,
        resolution: "1K",
        response_format: "b64_json",
        ...(normalizedReferences?.length
          ? { images: normalizedReferences }
          : {}),
      }),
    });

    const task = (await response.json()) as ImageTaskResponse;

    if (!response.ok) {
      const message =
        typeof task.error === "string"
          ? task.error
          : (task.error?.message ?? `HTTP ${response.status}`);
      throw new Error(`Image generation failed: ${message}`);
    }

    if (task.status !== "completed" || !task.output?.length) {
      const message =
        typeof task.error === "string"
          ? task.error
          : (task.error?.message ?? `Task status: ${task.status ?? "unknown"}`);
      throw new Error(`Image generation failed: ${message}`);
    }

    const output = task.output[0];
    const original = await resolveOriginalImage(output, apiKey);

    const metadata = await sharp(original.bytes).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    const preview = await sharp(original.bytes)
      .resize({
        width: 512,
        height: 512,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 72 })
      .toBuffer();

    const lightbox = await sharp(original.bytes)
      .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    const [storageId, previewStorageId, lightboxStorageId] = await Promise.all([
      ctx.storage.store(
        new Blob([new Uint8Array(original.bytes)], { type: original.mimeType }),
      ),
      ctx.storage.store(
        new Blob([new Uint8Array(preview)], { type: "image/webp" }),
      ),
      ctx.storage.store(
        new Blob([new Uint8Array(lightbox)], { type: "image/webp" }),
      ),
    ]);

    const id = await ctx.runMutation(internal.imageStore.save, {
      prompt,
      storageId,
      previewStorageId,
      lightboxStorageId,
      mimeType: original.mimeType,
      width,
      height,
      originalBytes: original.bytes.byteLength,
      previewBytes: preview.byteLength,
      lightboxBytes: lightbox.byteLength,
      ...(sessionId ? { sessionId } : {}),
    });

    const [originalUrl, previewUrl, lightboxUrl] = await Promise.all([
      ctx.storage.getUrl(storageId),
      ctx.storage.getUrl(previewStorageId),
      ctx.storage.getUrl(lightboxStorageId),
    ]);

    if (!originalUrl || !previewUrl || !lightboxUrl) {
      throw new Error("Image was generated but its Convex URL could not be read.");
    }

    return {
      id,
      prompt,
      width,
      height,
      originalUrl,
      previewUrl,
      lightboxUrl,
      originalBytes: original.bytes.byteLength,
      previewBytes: preview.byteLength,
      lightboxBytes: lightbox.byteLength,
    };
  },
});

async function resolveOriginalImage(
  output: NonNullable<ImageTaskResponse["output"]>[number],
  apiKey: string,
): Promise<{ bytes: Buffer; mimeType: string }> {
  if (output.b64_json) {
    const bytes = Buffer.from(output.b64_json, "base64");
    return { bytes, mimeType: await detectMimeType(bytes) };
  }

  if (!output.content_url) {
    throw new Error("Image task completed without an image.");
  }

  const response = await fetch(output.content_url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`Image download failed: HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  return { bytes, mimeType: await detectMimeType(bytes) };
}

async function toReferenceImage(image: string): Promise<string> {
  if (image.startsWith("data:")) return image;

  const response = await fetch(image);
  if (!response.ok) {
    throw new Error(`Reference image download failed: HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const mimeType = response.headers.get("content-type")?.split(";")[0] ||
    (await detectMimeType(bytes));
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

async function detectMimeType(bytes: Buffer): Promise<string> {
  const metadata = await sharp(bytes).metadata();
  switch (metadata.format) {
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "png":
    default:
      return "image/png";
  }
}