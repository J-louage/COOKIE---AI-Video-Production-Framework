import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AssetTree } from "@/components/assets/asset-tree";
import { EmptyState } from "@/components/empty-state";
import {
  loadCharacterIdentity,
  loadCharacterReferenceImages,
} from "@/lib/data/characters";
import { FileQuestion } from "lucide-react";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const identity = loadCharacterIdentity(characterId);

  if (!identity) {
    return (
      <PageShell title="Character Not Found">
        <EmptyState
          icon={FileQuestion}
          title="This character doesn't exist yet"
          description="The character directory was not found, or it doesn't have an identity.json file."
        />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            To create a character, run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/cookie-create-character</code> in Claude Code.
          </p>
          <Link
            href="/characters"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Characters
          </Link>
        </div>
      </PageShell>
    );
  }

  const references = loadCharacterReferenceImages(characterId);

  return (
    <PageShell
      title={identity.name || characterId}
      description={identity.role || ""}
      actions={<Badge variant="outline">{identity.type}</Badge>}
    >
      <div className="space-y-6">
        {identity.description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {identity.description}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Physical Traits */}
          {identity.physical && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Physical Traits</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {Object.entries(identity.physical).map(([key, val]) => {
                    if (key === "distinguishing_features") return null;
                    return (
                      <div key={key} className="flex justify-between">
                        <dt className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </dt>
                        <dd>{String(val) || "—"}</dd>
                      </div>
                    );
                  })}
                </dl>
                {identity.physical.distinguishing_features?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Distinguishing Features
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {identity.physical.distinguishing_features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Voice Config */}
          {identity.voice && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Voice Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Voice ID</dt>
                    <dd className="font-mono text-xs">
                      {identity.voice.elevenlabs_voice_id || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Language</dt>
                    <dd>{identity.voice.language}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Speaking Style</dt>
                    <dd>{identity.voice.speaking_style || "—"}</dd>
                  </div>
                  <Separator className="my-2" />
                  {[
                    ["Stability", identity.voice.stability],
                    ["Clarity", identity.voice.clarity],
                    ["Style", identity.voice.style],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{String(label)}</span>
                        <span>{Number(val).toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Number(val) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Styles & Outfits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Styles & Outfits</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Active Style</dt>
                  <dd>
                    <Badge variant="secondary">{identity.active_style}</Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Active Outfit</dt>
                  <dd>{identity.active_outfit || "—"}</dd>
                </div>
              </dl>
              {identity.available_styles?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Available Styles
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {identity.available_styles.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Prompt Tokens */}
        {identity.prompt_tokens && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Prompt Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(identity.prompt_tokens).map(([key, val]) => {
                if (!val) return null;
                return (
                  <div key={key}>
                    <p className="mb-1 text-xs font-medium capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </p>
                    <pre className="rounded bg-muted p-2 text-xs whitespace-pre-wrap">
                      {val}
                    </pre>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Reference Images */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Reference Images</h2>
          <AssetTree
            assets={references}
            basePath={`characters/${characterId}/styles`}
          />
        </div>
      </div>
    </PageShell>
  );
}
