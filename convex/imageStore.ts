import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const save = internalMutation({
  args: {
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
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const createdAt = Date.now();
    const id = await ctx.db.insert("generatedImages", {
      ...args,
      createdAt,
    });
    return id;
  },
});