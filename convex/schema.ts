import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  generatedImages: defineTable({
    prompt: v.string(),
    storageId: v.id("_storage"),
    previewStorageId: v.id("_storage"),
    lightboxStorageId: v.id("_storage"),
    mimeType: v.string(),
    width: v.number(),
    height: v.number(),
    originalBytes: v.number(),
    previewBytes: v.number(),
    lightboxBytes: v.number(),
    createdAt: v.number(),
    sessionId: v.optional(v.string()),
  }).index("by_created_at", ["createdAt"]),
});