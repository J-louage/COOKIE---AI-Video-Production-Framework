"use client";

/* eslint-disable @next/next/no-img-element */

export function MediaPreview({
  url,
  type,
  name,
}: {
  url: string;
  type: "video" | "image" | "audio";
  name: string;
}) {
  if (type === "image") {
    return (
      <img
        src={url}
        alt={name}
        className="max-h-48 rounded border object-contain"
      />
    );
  }

  if (type === "video") {
    return (
      <video
        src={url}
        controls
        className="max-h-48 rounded border"
        preload="metadata"
      />
    );
  }

  if (type === "audio") {
    return <audio src={url} controls className="w-full max-w-sm" preload="metadata" />;
  }

  return null;
}
