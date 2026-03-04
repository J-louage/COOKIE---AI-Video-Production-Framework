import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { FileText, Clapperboard, Palette, FolderOpen, DollarSign, Settings, LayoutList } from "lucide-react";

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const config = loadEpisodeConfig(episodeId);

  if (!config) {
    notFound();
  }

  const script = loadEpisodeScript(episodeId);
  const ssd = loadEpisodeSSD(episodeId);
  const styleGuide = loadEpisodeStyleGuide(episodeId);
  const costEstimate = loadEpisodeCostEstimate(episodeId);
  const assets = loadEpisodeAssets(episodeId);
  const progress = productionProgress(config.production_state);

  return (
    <PageShell
      title={config.title || episodeId}
      description={`${episodeId} · ${config.script?.source || "—"} source`}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Episode Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{config.created_at || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Script Source</dt>
                    <dd>{config.script?.source || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Music</dt>
                    <dd>{config.episode_music || "None"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overrides</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {Object.entries(config.overrides || {}).map(([key, val]) => (
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
              </CardContent>
            </Card>
          </div>

          {config.episode_characters.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {config.episode_characters.map((c) => (
                    <Badge key={c.character_id} variant="secondary">
                      {c.character_id}
                    </Badge>
                  ))}
                </div>
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
