"use client";

import { AssetNode } from "@/lib/file-reader";
import { Folder, File } from "lucide-react";
import { isMediaFile, mediaUrl, formatBytes } from "@/lib/helpers";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MediaPreview } from "./media-preview";

function AssetFileItem({ node, basePath }: { node: AssetNode; basePath: string }) {
  const mediaType = node.extension ? isMediaFile(node.extension) : null;
  const url = mediaUrl(`${basePath}/${node.relativePath}`);

  return (
    <div className="py-1">
      <div className="flex items-center gap-2 text-sm">
        <File className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{node.name}</span>
        {node.size !== undefined && (
          <span className="text-xs text-muted-foreground">
            {formatBytes(node.size)}
          </span>
        )}
      </div>
      {mediaType && (
        <div className="ml-6 mt-1">
          <MediaPreview url={url} type={mediaType} name={node.name} />
        </div>
      )}
    </div>
  );
}

function AssetDirItem({ node, basePath }: { node: AssetNode; basePath: string }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center gap-2 py-1 text-sm font-medium hover:text-primary">
        <Folder className="h-3.5 w-3.5 text-muted-foreground" />
        {node.name}
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-4 border-l pl-3">
        {(node.children || []).map((child) =>
          child.type === "directory" ? (
            <AssetDirItem key={child.name} node={child} basePath={basePath} />
          ) : (
            <AssetFileItem key={child.name} node={child} basePath={basePath} />
          )
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AssetTree({
  assets,
  basePath,
}: {
  assets: AssetNode[];
  basePath: string;
}) {
  if (assets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No assets generated yet.</p>
    );
  }

  return (
    <div className="space-y-1">
      {assets.map((node) =>
        node.type === "directory" ? (
          <AssetDirItem key={node.name} node={node} basePath={basePath} />
        ) : (
          <AssetFileItem key={node.name} node={node} basePath={basePath} />
        )
      )}
    </div>
  );
}
