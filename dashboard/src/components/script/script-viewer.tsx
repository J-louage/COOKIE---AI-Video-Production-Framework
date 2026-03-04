"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ParsedMarkdown } from "@/lib/parsers/markdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

interface SceneBlock {
  id: string;
  title: string;
  metadata: Record<string, string>;
  visual: string;
  audio: string;
  textOverlay: string;
}

interface ScriptSections {
  header: Record<string, string>;
  scenes: SceneBlock[];
  durationRows: { scene: string; duration: string; cumulative: string }[];
  durationFooter: string;
  metadata: Record<string, string>;
}

function parseTableRows(block: string): Record<string, string> {
  const rows: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || trimmed.startsWith("|--") || trimmed.startsWith("| Field")) continue;
    const cells = trimmed.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2) {
      rows[cells[0]] = cells[1];
    }
  }
  return rows;
}

function parseDirectionBlock(content: string, label: string): string {
  const marker = `**${label}:**`;
  const idx = content.indexOf(marker);
  if (idx === -1) return "";
  const after = content.slice(idx + marker.length);
  // find the next **...: or end
  const nextMarker = after.search(/\n\*\*[A-Za-z ]+:\*\*/);
  const raw = nextMarker === -1 ? after : after.slice(0, nextMarker);
  return raw.trim();
}

function parseSceneBlock(block: string): SceneBlock {
  // Extract heading: ### SC-001 — The Booking
  const headingMatch = block.match(/^###\s+(SC-\d+)\s*[—–-]\s*(.+)/m);
  const id = headingMatch?.[1] ?? "SC-???";
  const title = headingMatch?.[2]?.trim() ?? "Untitled";
  const metadata = parseTableRows(block);
  const visual = parseDirectionBlock(block, "Visual Direction");
  const audio = parseDirectionBlock(block, "Audio Direction");
  const textOverlay = parseDirectionBlock(block, "Text Overlay");
  return { id, title, metadata, visual, audio, textOverlay };
}

function parseDurationTable(block: string): {
  rows: { scene: string; duration: string; cumulative: string }[];
  footer: string;
} {
  const rows: { scene: string; duration: string; cumulative: string }[] = [];
  let footer = "";
  for (const line of block.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && !trimmed.startsWith("|--") && !trimmed.startsWith("| Scene")) {
      const cells = trimmed.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 3) {
        rows.push({ scene: cells[0], duration: cells[1], cumulative: cells[2] });
      }
    }
    // Line like "Target: 30s | Actual: 30s | Variance: 0% ✅"
    if (/target:/i.test(trimmed) && /variance:/i.test(trimmed)) {
      footer = trimmed;
    }
  }
  return { rows, footer };
}

function parseScriptSections(content: string): ScriptSections | null {
  try {
    // Split on ## headings
    const sections = content.split(/^## /m).filter(Boolean);
    const findSection = (name: string) =>
      sections.find((s) => s.trim().startsWith(name));

    const headerRaw = findSection("Header");
    const scenesRaw = findSection("Scenes");
    const durationRaw = findSection("Duration Summary");
    const metadataRaw = findSection("Metadata");

    if (!headerRaw || !scenesRaw) return null;

    const header = parseTableRows(headerRaw);

    // Split scenes by ### headings
    const sceneBlocks = scenesRaw
      .split(/(?=^### )/m)
      .filter((s) => s.trim().startsWith("### "));
    const scenes = sceneBlocks.map(parseSceneBlock);

    const { rows: durationRows, footer: durationFooter } = durationRaw
      ? parseDurationTable(durationRaw)
      : { rows: [], footer: "" };

    const metadata = metadataRaw ? parseTableRows(metadataRaw) : {};

    return { header, scenes, durationRows, durationFooter, metadata };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Badge variant helper
// ---------------------------------------------------------------------------

function sceneTypeBadgeVariant(type: string) {
  switch (type.toLowerCase()) {
    case "hook":
      return "default" as const;
    case "outro":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScriptViewer({ script }: { script: ParsedMarkdown }) {
  const fm = script.frontmatter;
  const parsed = useMemo(() => parseScriptSections(script.content), [script.content]);
  const [expandedScenes, setExpandedScenes] = useState<string[]>([]);

  // Fallback: render as before
  if (!parsed) {
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

  const { header, scenes, durationRows, durationFooter, metadata } = parsed;

  return (
    <div className="space-y-6">
      {/* ---- Header Card ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {header["Title"] ?? "Untitled Script"}
            {header["Format"] && (
              <Badge variant="secondary" className="text-xs font-normal">
                {header["Format"]}
              </Badge>
            )}
            {header["Aspect Ratio"] && (
              <Badge variant="outline" className="text-xs font-normal">
                {header["Aspect Ratio"]}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            {Object.entries(header)
              .filter(([k]) => !["Title", "Format", "Aspect Ratio"].includes(k))
              .map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}:</span>{" "}
                  <span className="font-medium">{value}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* ---- Scenes Accordion ---- */}
      <Card>
        <CardHeader>
          <CardTitle>Scenes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            value={expandedScenes}
            onValueChange={setExpandedScenes}
          >
            {scenes.map((scene) => (
              <AccordionItem key={scene.id} value={scene.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {scene.id}
                    </span>
                    <span className="font-medium">{scene.title}</span>
                    {scene.metadata["Duration"] && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {scene.metadata["Duration"]}
                      </Badge>
                    )}
                    {scene.metadata["Scene Type"] && (
                      <Badge
                        variant={sceneTypeBadgeVariant(scene.metadata["Scene Type"])}
                        className="text-xs font-normal"
                      >
                        {scene.metadata["Scene Type"]}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-1">
                    {/* Scene metadata */}
                    {Object.keys(scene.metadata).length > 0 && (
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Metadata
                        </h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
                          {Object.entries(scene.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground">{key}:</span>{" "}
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Direction */}
                    {scene.visual && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Visual Direction
                          </h4>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {scene.visual}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Audio Direction */}
                    {scene.audio && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Audio Direction
                          </h4>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {scene.audio}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Text Overlay */}
                    {scene.textOverlay && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Text Overlay
                          </h4>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {scene.textOverlay}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* ---- Duration Summary ---- */}
      {durationRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Duration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scene</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Cumulative</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {durationRows.map((row) => (
                  <TableRow key={row.scene}>
                    <TableCell className="font-medium">{row.scene}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>{row.cumulative}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {durationFooter && (
              <p className="mt-3 text-sm text-muted-foreground">
                {durationFooter}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ---- Script Metadata ---- */}
      {Object.keys(metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Script Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="text-muted-foreground">{key}:</span>{" "}
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
