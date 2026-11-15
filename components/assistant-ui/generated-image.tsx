"use client";

import { useState } from "react";
import {
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  Maximize2Icon,
} from "lucide-react";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GeneratedImage = {
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
};

type GenerateImageOutput = {
  images: GeneratedImage[];
};

type GenerateImageArgs = {
  prompt?: string;
  edit?: boolean;
};

export function GeneratedImageTool({
  part,
}: {
  part: ToolCallMessagePartProps<GenerateImageArgs, unknown>;
}) {
  const output = part.result as GenerateImageOutput | undefined;
  const isRunning = part.status?.type === "running";
  const isError = part.isError;

  if (isRunning) {
    return (
      <div
        className={cn(
          "aui-generated-image flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center",
        )}
      >
        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Generating image…</p>
          {part.args?.prompt ? (
            <p className="line-clamp-2 max-w-sm text-xs text-muted-foreground">
              {part.args.prompt}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="aui-generated-image w-full rounded-xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
          <ImageIcon className="size-4" />
          Image generation failed
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {typeof part.result === "string" ? part.result : "Please try again."}
        </p>
      </div>
    );
  }

  if (!output?.images?.length) {
    return null;
  }

  return (
    <div className="aui-generated-image flex w-full flex-col gap-2">
      {output.images.map((image) => (
        <GeneratedImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}

function GeneratedImageCard({ image }: { image: GeneratedImage }) {
  const [open, setOpen] = useState(false);
  const downloadHref = `/api/images/download?url=${encodeURIComponent(image.originalUrl)}&filename=${encodeURIComponent(`grok-imagine-${image.id}.png`)}`;

  return (
    <>
      <div className="group/image relative w-fit max-w-full overflow-hidden rounded-xl border bg-muted/20">
        <button
          aria-label={`Expand image: ${image.prompt}`}
          className="block cursor-zoom-in focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          onClick={() => setOpen(true)}
          type="button"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={image.prompt}
            className="max-h-80 w-auto max-w-full object-contain"
            decoding="async"
            height={image.height}
            loading="lazy"
            src={image.previewUrl}
            width={image.width}
          />
          <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover/image:opacity-100">
            <Maximize2Icon className="size-3" />
            Expand
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild className="w-fit" size="sm" variant="outline">
          <a download={`grok-imagine-${image.id}.png`} href={downloadHref}>
            <DownloadIcon />
            Download
          </a>
        </Button>
        <span className="text-xs text-muted-foreground">
          {image.width} × {image.height}
        </span>
      </div>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-w-5xl p-3 sm:max-w-5xl">
          <DialogTitle className="sr-only">Generated image</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={image.prompt}
            className="max-h-[80vh] w-auto max-w-full rounded-md object-contain"
            src={image.lightboxUrl}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}