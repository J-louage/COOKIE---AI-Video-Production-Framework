import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductionStateChecklist } from "@/components/episodes/production-state";
import { ScriptViewer } from "@/components/script/script-viewer";
import { SceneList } from "@/components/ssd/scene-list";
import { StyleGuideViewer } from "@/components/episodes/style-guide-viewer";
import { AssetTree } from "@/components/assets/asset-tree";
import { EpisodeCostTable } from "@/components/costs/episode-cost-table";
import { EmptyState } from "@/components/empty-state";
import {
  loadEpisodeConfig,
  loadEpisodeScript,
  loadEpisodeSSD,
  loadEpisodeStyleGuide,
  loadEpisodeCostEstimate,
  loadEpisodeAssets,
} from "@/lib/data/episodes";
import { statusColor, productionProgress } from "@/lib/helpers";
import { FileText, Clapperboard, Palette, FolderOpen, DollarSign, Settings, LayoutList, FileQuestion } from "lucide-react";

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const config = loadEpisodeConfig(episodeId);

  if (!config) {
    return (
      <PageShell title="Episode Not Found">
        <EmptyState
          icon={FileQuestion}
          title="This episode doesn't exist yet"
          description="The episode directory was not found, or it doesn't have an episode-config.yaml file."
        />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            To create an episode, run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/cookie-director</code> in Claude Code and describe your project.
          </p>
          <Link
            href="/episodes"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Episodes
          </Link>
        </div>
      </PageShell>
    );
  }

  const script = loadEpisodeScript(episodeId);
  const ssd = loadEpisodeSSD(episodeId);
  const styleGuide = loadEpisodeStyleGuide(episodeId);
  const costEstimate = loadEpisodeCostEstimate(episodeId);
  const assets = loadEpisodeAssets(episodeId);
  const progress = productionProgress(config.production_state);

  // Resolve characters from either field name
  const characters = config.characters || config.episode_characters || [];

  return (
    <PageShell
      title={config.title || episodeId}
      description={`${config.episode_id || episodeId} · ${config.format || "—"} format`}
      actions={
        <Badge variant="secondary" className={statusColor(config.status)}>
          {config.status}
        </Badge>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview" className="gap-1.5">
            <LayoutList className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="script" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Script
          </TabsTrigger>
          <TabsTrigger value="ssd" className="gap-1.5">
            <Clapperboard className="h-3.5 w-3.5" />
            SSD
          </TabsTrigger>
          <TabsTrigger value="style" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Style Guide
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="costs" className="gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            Costs
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            Config
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {config.production_state && Object.keys(config.production_state).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Production Progress — {progress}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductionStateChecklist state={config.production_state} />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Episode Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{config.metadata?.created || config.created_at || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Format</dt>
                    <dd>{config.format || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd>{config.target_duration ? `${config.target_duration}s` : "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phase</dt>
                    <dd>{config.metadata?.phase || "—"}</dd>
                  </div>
                  {config.concept?.tone && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tone</dt>
                      <dd>{config.concept.tone}</dd>
                    </div>
                  )}
                  {config.concept?.music && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Music</dt>
                      <dd>{config.concept.music}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overrides</CardTitle>
              </CardHeader>
              <CardContent>
                {config.overrides && Object.keys(config.overrides).length > 0 ? (
                  <dl className="space-y-2 text-sm">
                    {Object.entries(config.overrides).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-muted-foreground">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd>
                          {val !== null ? (
                            <Badge variant="outline" className="text-xs">
                              {String(val)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">default</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">No overrides set</p>
                )}
              </CardContent>
            </Card>
          </div>

          {config.concept?.premise && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{config.concept.premise}</p>
                {config.concept.scenes && config.concept.scenes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Planned Scenes</p>
                    <div className="flex flex-wrap gap-1">
                      {config.concept.scenes.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {characters.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {characters.map((c) => (
                    <Link key={c.character_id} href={`/characters/${c.character_id}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        {c.character_id}
                        {c.role && <span className="ml-1 text-muted-foreground">({c.role})</span>}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {config.brand && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {config.brand.name && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Name</dt>
                      <dd>{config.brand.name}</dd>
                    </div>
                  )}
                  {config.brand.tagline && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Tagline</dt>
                      <dd>{config.brand.tagline}</dd>
                    </div>
                  )}
                  {config.brand.style && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Style</dt>
                      <dd>{config.brand.style}</dd>
                    </div>
                  )}
                  {config.brand.colors && Object.keys(config.brand.colors).length > 0 && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Colors</dt>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(config.brand.colors).map(([name, hex]) => (
                          <div key={name} className="flex items-center gap-1">
                            <div
                              className="h-4 w-4 rounded border"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="text-xs">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Script Tab */}
        <TabsContent value="script">
          {script ? (
            <ScriptViewer script={script} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No script yet"
              description="Run /cookie-screenwriter to generate the canonical script."
            />
          )}
        </TabsContent>

        {/* SSD Tab */}
        <TabsContent value="ssd">
          {ssd ? (
            <SceneList ssd={ssd} />
          ) : (
            <EmptyState
              icon={Clapperboard}
              title="No Scene Specification Document"
              description="Run /cookie-create-ssd to generate the SSD."
            />
          )}
        </TabsContent>

        {/* Style Guide Tab */}
        <TabsContent value="style">
          {styleGuide ? (
            <StyleGuideViewer guide={styleGuide} />
          ) : (
            <EmptyState
              icon={Palette}
              title="No style guide yet"
              description="Run /cookie-create-style to define the visual style."
            />
          )}
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets">
          <AssetTree
            assets={assets}
            basePath={`episodes/${episodeId}/assets`}
          />
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs">
          {costEstimate ? (
            <EpisodeCostTable estimate={costEstimate} />
          ) : ssd?.cost_summary ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cost Summary (from SSD)</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {ssd.cost_summary.total_generation_cost != null && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Total Generation Cost</dt>
                      <dd className="font-medium">${ssd.cost_summary.total_generation_cost.toFixed(2)}</dd>
                    </div>
                  )}
                  {ssd.cost_summary.budget_remaining != null && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Budget Remaining</dt>
                      <dd>${ssd.cost_summary.budget_remaining.toFixed(2)}</dd>
                    </div>
                  )}
                  {ssd.cost_summary.budget_utilization && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Budget Utilization</dt>
                      <dd>{ssd.cost_summary.budget_utilization}</dd>
                    </div>
                  )}
                  {ssd.cost_summary.scenes && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Per-Scene Costs</p>
                      {Object.entries(ssd.cost_summary.scenes).map(([sceneId, data]) => (
                        <div key={sceneId} className="flex justify-between py-1 border-b last:border-0">
                          <span className="font-mono text-xs">{sceneId}</span>
                          <span className="text-xs">${(data.subtotal || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={DollarSign}
              title="No cost estimate yet"
              description="Run /cookie-cost-estimate after creating the SSD."
            />
          )}
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="config">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Episode Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded bg-muted p-4 text-xs">
                {JSON.stringify(config, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
