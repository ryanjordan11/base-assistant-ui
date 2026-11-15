const DEFAULT_FILENAME = "grok-imagine-image";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const requestedName = searchParams.get("filename") ?? DEFAULT_FILENAME;

  if (!imageUrl) {
    return new Response("Missing image URL.", { status: 400 });
  }

  const convexUrl = (
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL
  )?.replace(/\/$/, "");

  if (
    !convexUrl ||
    !imageUrl.startsWith(`${convexUrl}/api/storage/`)
  ) {
    return new Response("Image URL is not allowed.", { status: 400 });
  }

  const upstream = await fetch(imageUrl);
  if (!upstream.ok) {
    return new Response("Image not found.", { status: upstream.status });
  }

  const image = await upstream.blob();
  const filename = sanitizeFilename(requestedName);

  return new Response(image, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": image.type || "application/octet-stream",
    },
  });
}

function sanitizeFilename(filename: string) {
  const stem = filename.includes(".")
    ? filename.slice(0, filename.lastIndexOf("."))
    : filename;
  const extension = filename.includes(".")
    ? filename.slice(filename.lastIndexOf("."))
    : ".png";

  return `${stem.replace(/[^a-zA-Z0-9-_]/g, "-") || DEFAULT_FILENAME}${extension}`;
}