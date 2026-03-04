"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ParsedMarkdown } from "@/lib/parsers/markdown";
import { Badge } from "@/components/ui/badge";

export function ScriptViewer({ script }: { script: ParsedMarkdown }) {
  const fm = script.frontmatter;
  return (
    <div className="space-y-4">
      {Object.keys(fm).length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-md border bg-muted/50 p-3">
          {Object.entries(fm).map(([key, value]) => (
            <Badge key={key} variant="outline" className="font-mono text-xs">
              {key}: {String(value)}
            </Badge>
          ))}
        </div>
      )}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {script.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
