import { EpisodeStatus, ProductionState } from "./types/episode";

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function statusColor(status: EpisodeStatus): string {
  const map: Record<EpisodeStatus, string> = {
    "not-started": "bg-gray-100 text-gray-700",
    planning: "bg-blue-100 text-blue-700",
    "pre-production": "bg-yellow-100 text-yellow-700",
    "in-production": "bg-orange-100 text-orange-700",
    "post-production": "bg-purple-100 text-purple-700",
    complete: "bg-green-100 text-green-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

export function productionProgress(state: ProductionState): number {
  const entries = Object.values(state);
  if (entries.length === 0) return 0;
  const done = entries.filter(Boolean).length;
  return Math.round((done / entries.length) * 100);
}

export function mediaUrl(relativePath: string): string {
  return `/api/media/${relativePath}`;
}

export function isMediaFile(ext: string): "video" | "image" | "audio" | null {
  if ([".mp4", ".webm", ".mov", ".avi"].includes(ext)) return "video";
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext))
    return "image";
  if ([".mp3", ".wav", ".ogg", ".m4a", ".aac"].includes(ext)) return "audio";
  return null;
}

export function priorityColor(priority: string): string {
  const map: Record<string, string> = {
    P0: "bg-red-100 text-red-700",
    P1: "bg-yellow-100 text-yellow-700",
    P2: "bg-gray-100 text-gray-700",
    essential: "bg-red-100 text-red-700",
    important: "bg-yellow-100 text-yellow-700",
    supplementary: "bg-gray-100 text-gray-700",
  };
  return map[priority] || "bg-gray-100 text-gray-700";
}
