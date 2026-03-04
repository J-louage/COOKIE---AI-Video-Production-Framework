import { SceneSpec, Scene, Clip } from "@/lib/types/ssd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDuration, formatCurrency, priorityColor } from "@/lib/helpers";

function ClipCard({ clip }: { clip: Clip }) {
  const veoRaw = clip.veo_config || clip.veo;
  // Normalize to a common shape for display
  const veo = veoRaw as { model?: string; duration_seconds?: number; duration?: number; resolution?: string; camera_movement?: string; speed?: string; prompt?: string } | undefined;
  return (
    <div className="rounded border p-3 text-sm space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">{clip.clip_id}</span>
        {clip.clip_type && <Badge variant="outline" className="text-xs">{clip.clip_type}</Badge>}
      </div>
      {clip.description && <p className="text-xs text-muted-foreground">{clip.description}</p>}
      {veo && (
        <dl className="space-y-1 text-xs">
          {veo.model && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Model:</dt>
              <dd>{veo.model}</dd>
            </div>
          )}
          {(veo.duration_seconds || veo.duration) && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Duration:</dt>
              <dd>{veo.duration_seconds || veo.duration}s</dd>
            </div>
          )}
          {veo.resolution && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Resolution:</dt>
              <dd>{veo.resolution}</dd>
            </div>
          )}
          {(veo.camera_movement || veo.speed) && (
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Camera:</dt>
              <dd>{veo.camera_movement || veo.speed}</dd>
            </div>
          )}
          {veo.prompt && (
            <div className="mt-1">
              <dt className="text-muted-foreground mb-0.5">Prompt:</dt>
              <dd className="rounded bg-muted p-1.5 text-xs font-mono whitespace-pre-wrap">{veo.prompt}</dd>
            </div>
          )}
        </dl>
      )}
      {clip.cost_estimate && (
        <div className="text-xs text-muted-foreground">
          Cost: ${(clip.cost_estimate.total || 0).toFixed(2)}
        </div>
      )}
    </div>
  );
}

function SceneCard({ scene }: { scene: Scene }) {
  const duration = scene.duration || scene.duration_seconds || 0;
  const audioRaw = scene.audio_config || scene.audio;
  const audio = audioRaw as { music?: { mood?: string; track?: string; volume?: number; fade_in?: number; fade_out?: number }; sfx?: Array<{ effect?: string; sound?: string; start?: number; duration?: number; volume?: number }> ; narration?: { text?: string; character_ref?: string } } | undefined;
  const remotion = scene.remotion_config || scene.remotion;
  const clips = scene.clips || [];

  // Compute scene cost from clips
  const sceneCost = scene.estimated_cost?.scene_total
    || clips.reduce((s, c) => s + (c.cost_estimate?.total || 0), 0);

  return (
    <AccordionItem value={scene.scene_id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex w-full items-center gap-3 text-left">
          <span className="font-mono text-xs text-muted-foreground">
            {scene.scene_id}
          </span>
          <span className="flex-1 font-medium">{scene.title}</span>
          {scene.scene_type && (
            <Badge variant="outline" className="mr-2">
              {scene.scene_type}
            </Badge>
          )}
          {scene.priority && (
            <Badge variant="secondary" className={priorityColor(scene.priority)}>
              {scene.priority}
            </Badge>
          )}
          {duration > 0 && (
            <span className="text-sm text-muted-foreground">
              {formatDuration(duration)}
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pl-2 pt-2">
          {scene.description && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                Description
              </h4>
              <p className="text-sm">{scene.description}</p>
            </div>
          )}

          {scene.composition_note && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                Composition Note
              </h4>
              <p className="text-sm text-muted-foreground">{scene.composition_note}</p>
            </div>
          )}

          {/* Clips */}
          {clips.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Clips ({clips.length})
              </h4>
              <div className="space-y-2">
                {clips.map((clip) => (
                  <ClipCard key={clip.clip_id} clip={clip} />
                ))}
              </div>
            </div>
          )}

          {/* Scene-level VEO (template-style) */}
          {scene.veo && !clips.length && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                VEO Config
              </h4>
              <dl className="space-y-1 text-sm">
                {scene.veo.input_mode && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Mode:</dt>
                    <dd>{scene.veo.input_mode}</dd>
                  </div>
                )}
                {scene.veo.duration && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Duration:</dt>
                    <dd>{scene.veo.duration}s</dd>
                  </div>
                )}
                {scene.veo.resolution && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Resolution:</dt>
                    <dd>{scene.veo.resolution}</dd>
                  </div>
                )}
                {scene.veo.prompt && (
                  <div className="mt-2">
                    <h5 className="text-xs text-muted-foreground">Prompt</h5>
                    <p className="mt-1 rounded bg-muted p-2 text-xs font-mono">
                      {scene.veo.prompt}
                    </p>
                  </div>
                )}
              </dl>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Audio */}
            {audio && (
              <div>
                <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  Audio
                </h4>
                <dl className="space-y-1 text-sm">
                  {audio.music?.mood && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Music mood:</dt>
                      <dd>{audio.music.mood}</dd>
                    </div>
                  )}
                  {audio.music?.track && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Track:</dt>
                      <dd>{audio.music.track}</dd>
                    </div>
                  )}
                  {audio.sfx && audio.sfx.length > 0 && (
                    <div>
                      <dt className="text-muted-foreground">SFX:</dt>
                      <dd>
                        {audio.sfx.map((s, i) => (
                          <span key={i} className="text-xs">
                            {("effect" in s ? s.effect : undefined) || ("sound" in s ? s.sound : undefined) || "sfx"}{i < audio.sfx!.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Remotion */}
            {remotion && (
              <div>
                <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  Remotion
                </h4>
                <dl className="space-y-1 text-sm">
                  {"composition_id" in remotion && remotion.composition_id && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Composition:</dt>
                      <dd className="font-mono text-xs">{remotion.composition_id}</dd>
                    </div>
                  )}
                  {"fps" in remotion && remotion.fps && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">FPS:</dt>
                      <dd>{remotion.fps}</dd>
                    </div>
                  )}
                  {"width" in remotion && remotion.width && "height" in remotion && remotion.height && (
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground">Size:</dt>
                      <dd>{remotion.width}x{remotion.height}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          {/* Cost */}
          {sceneCost > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground">Scene Cost: </span>
              <span className="font-medium">{formatCurrency(sceneCost)}</span>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function SceneList({ ssd }: { ssd: SceneSpec }) {
  const meta = ssd.metadata;
  const gc = ssd.global_config;

  // Resolve display fields from metadata or top-level fallbacks
  const format = meta?.format || ssd.primary_format || "—";
  const aspectRatio = meta?.aspect_ratio || ssd.primary_aspect_ratio || "—";
  const resolution = gc?.default_resolution || ssd.resolution_profile || "—";
  const sceneCount = meta?.total_scenes || ssd.scene_count || ssd.scenes?.length || 0;
  const totalDuration = meta?.total_duration || ssd.total_duration_seconds || 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <Badge variant="outline">{format}</Badge>
        <Badge variant="outline">{aspectRatio}</Badge>
        <Badge variant="outline">{resolution}</Badge>
        <span className="text-muted-foreground">
          {sceneCount} scenes · {formatDuration(totalDuration)}
        </span>
        {meta?.total_cost_estimate != null && (
          <span className="text-muted-foreground">
            · Est. {formatCurrency(meta.total_cost_estimate)}
          </span>
        )}
      </div>

      <Accordion type="multiple" className="w-full">
        {(ssd.scenes || []).map((scene) => (
          <SceneCard key={scene.scene_id} scene={scene} />
        ))}
      </Accordion>
    </div>
  );
}
