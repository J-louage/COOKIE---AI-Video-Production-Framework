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

  // Derive character type from voice_config or voice
  const charType = identity.type
    || (identity.voice_config?.voice_type === "none" ? "visual-only" : identity.voice ? "visual-voice" : undefined);

  // Physical traits: support both physical_description and physical
  const physDesc = identity.physical_description;
  const physFlat = identity.physical;

  return (
    <PageShell
      title={identity.name || characterId}
      description={identity.role || ""}
      actions={charType ? <Badge variant="outline">{charType}</Badge> : undefined}
    >
      <div className="space-y-6">
        {identity.description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {identity.description}
          </p>
        )}

        {identity.personality && identity.personality.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {identity.personality.map((trait) => (
              <Badge key={trait} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Physical Description (actual data: nested objects) */}
          {physDesc && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Physical Description</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {physDesc.species && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Species</dt>
                      <dd>{physDesc.species}</dd>
                    </div>
                  )}
                  {physDesc.breed && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Breed</dt>
                      <dd>{physDesc.breed}</dd>
                    </div>
                  )}
                  {physDesc.age_range && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Age Range</dt>
                      <dd>{physDesc.age_range}</dd>
                    </div>
                  )}
                  {physDesc.build && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Build</dt>
                      <dd>{physDesc.build}</dd>
                    </div>
                  )}
                  {physDesc.size && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Size</dt>
                      <dd>{physDesc.size}</dd>
                    </div>
                  )}
                  {physDesc.height && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Height</dt>
                      <dd>{physDesc.height}</dd>
                    </div>
                  )}
                  {physDesc.coat && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Coat</p>
                      <div className="space-y-1 text-xs">
                        {physDesc.coat.color && <p>Color: {physDesc.coat.color}</p>}
                        {physDesc.coat.texture && <p>Texture: {physDesc.coat.texture}</p>}
                        {physDesc.coat.length && <p>Length: {physDesc.coat.length}</p>}
                        {physDesc.coat.hex_primary && (
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: physDesc.coat.hex_primary }} />
                            <span>{physDesc.coat.hex_primary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {physDesc.eyes && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Eyes</p>
                      <div className="space-y-1 text-xs">
                        {physDesc.eyes.color && <p>Color: {physDesc.eyes.color}</p>}
                        {physDesc.eyes.expression && <p>Expression: {physDesc.eyes.expression}</p>}
                        {physDesc.eyes.hex && (
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded" style={{ backgroundColor: physDesc.eyes.hex }} />
                            <span>{physDesc.eyes.hex}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </dl>
                {physDesc.distinguishing_features && physDesc.distinguishing_features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Distinguishing Features
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {physDesc.distinguishing_features.map((f) => (
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

          {/* Physical Traits (template-style flat) */}
          {!physDesc && physFlat && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Physical Traits</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {Object.entries(physFlat).map(([key, val]) => {
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
                {physFlat.distinguishing_features && physFlat.distinguishing_features.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Distinguishing Features
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {physFlat.distinguishing_features.map((f) => (
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
          {identity.voice_config && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Voice Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd>{identity.voice_config.voice_type || "—"}</dd>
                  </div>
                  {identity.voice_config.notes && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Notes</dt>
                      <dd className="text-xs text-muted-foreground">{identity.voice_config.notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* ElevenLabs Voice (template-style) */}
          {!identity.voice_config && identity.voice && (
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
                  {identity.voice.language && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Language</dt>
                      <dd>{identity.voice.language}</dd>
                    </div>
                  )}
                  {identity.voice.speaking_style && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Speaking Style</dt>
                      <dd>{identity.voice.speaking_style}</dd>
                    </div>
                  )}
                  <Separator className="my-2" />
                  {[
                    ["Stability", identity.voice.stability],
                    ["Clarity", identity.voice.clarity],
                    ["Style", identity.voice.style],
                  ].map(([label, val]) => (
                    val != null && (
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
                    )
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
                    <Badge variant="secondary">{identity.active_style || "—"}</Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Active Outfit</dt>
                  <dd>{identity.active_outfit || "—"}</dd>
                </div>
              </dl>

              {/* Actual data: styles array with outfits */}
              {identity.styles && identity.styles.length > 0 && (
                <div className="mt-3 space-y-3">
                  {identity.styles.map((style) => (
                    <div key={style.style_id}>
                      <p className="text-xs font-medium">
                        {style.style_name}
                        {style.description && (
                          <span className="font-normal text-muted-foreground ml-1">— {style.description}</span>
                        )}
                      </p>
                      {style.outfits && style.outfits.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {style.outfits.map((o) => (
                            <Badge key={o.outfit_id} variant="outline" className="text-xs">
                              {o.outfit_name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Template fallback: available_styles as string[] */}
              {!identity.styles && identity.available_styles && identity.available_styles.length > 0 && (
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
                const display = Array.isArray(val) ? val.join(", ") : String(val);
                return (
                  <div key={key}>
                    <p className="mb-1 text-xs font-medium capitalize text-muted-foreground">
                      {key.replace(/_/g, " ")}
                    </p>
                    <pre className="rounded bg-muted p-2 text-xs whitespace-pre-wrap">
                      {display}
                    </pre>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        {identity.metadata && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {identity.metadata.created_at && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{identity.metadata.created_at}</dd>
                  </div>
                )}
                {identity.metadata.version && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Version</dt>
                    <dd>{identity.metadata.version}</dd>
                  </div>
                )}
                {identity.metadata.status && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd><Badge variant="outline">{identity.metadata.status}</Badge></dd>
                  </div>
                )}
                {identity.metadata.project && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Project</dt>
                    <dd className="font-mono text-xs">{identity.metadata.project}</dd>
                  </div>
                )}
                {identity.metadata.notes && (
                  <div>
                    <dt className="text-muted-foreground mb-1">Notes</dt>
                    <dd className="text-xs text-muted-foreground">{identity.metadata.notes}</dd>
                  </div>
                )}
              </dl>
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
