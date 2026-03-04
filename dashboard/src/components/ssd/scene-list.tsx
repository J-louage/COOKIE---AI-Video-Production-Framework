import { SceneSpec, Scene } from "@/lib/types/ssd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDuration, formatCurrency, priorityColor } from "@/lib/helpers";

function SceneCard({ scene }: { scene: Scene }) {
  return (
    <AccordionItem value={scene.scene_id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex w-full items-center gap-3 text-left">
          <span className="font-mono text-xs text-muted-foreground">
            {scene.scene_id}
          </span>
          <span className="flex-1 font-medium">{scene.title}</span>
          <Badge variant="outline" className="mr-2">
            {scene.scene_type}
          </Badge>
          <Badge variant="secondary" className={priorityColor(scene.priority)}>
            {scene.priority}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDuration(scene.duration_seconds)}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4 pl-2 pt-2 sm:grid-cols-2">
          <div>
            <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              Description
            </h4>
            <p className="text-sm">{scene.description || "—"}</p>
          </div>

          {scene.veo && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                VEO Config
              </h4>
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Mode:</dt>
                  <dd>{scene.veo.input_mode}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Duration:</dt>
                  <dd>{scene.veo.duration}s</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Resolution:</dt>
                  <dd>{scene.veo.resolution}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Aspect:</dt>
                  <dd>{scene.veo.aspect_ratio}</dd>
                </div>
              </dl>
              {scene.veo.prompt && (
                <div className="mt-2">
                  <h5 className="text-xs text-muted-foreground">Prompt</h5>
                  <p className="mt-1 rounded bg-muted p-2 text-xs font-mono">
                    {scene.veo.prompt}
                  </p>
                </div>
              )}
            </div>
          )}

          {scene.audio && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                Audio
              </h4>
              <dl className="space-y-1 text-sm">
                {scene.audio.narration && (
                  <div>
                    <dt className="text-muted-foreground">Narration:</dt>
                    <dd className="italic">&quot;{scene.audio.narration.text}&quot;</dd>
                  </div>
                )}
                {scene.audio.music?.track && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Music:</dt>
                    <dd>{scene.audio.music.track}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {scene.estimated_cost && (
            <div>
              <h4 className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                Est. Cost
              </h4>
              <dl className="space-y-1 text-sm">
                {scene.estimated_cost.veo > 0 && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">VEO:</dt>
                    <dd>{formatCurrency(scene.estimated_cost.veo)}</dd>
                  </div>
                )}
                {scene.estimated_cost.nano_banana > 0 && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Nano Banana:</dt>
                    <dd>{formatCurrency(scene.estimated_cost.nano_banana)}</dd>
                  </div>
                )}
                {scene.estimated_cost.elevenlabs > 0 && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">ElevenLabs:</dt>
                    <dd>{formatCurrency(scene.estimated_cost.elevenlabs)}</dd>
                  </div>
                )}
                <div className="flex gap-2 font-medium">
                  <dt>Total:</dt>
                  <dd>{formatCurrency(scene.estimated_cost.scene_total)}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function SceneList({ ssd }: { ssd: SceneSpec }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <Badge variant="outline">{ssd.primary_format}</Badge>
        <Badge variant="outline">{ssd.primary_aspect_ratio}</Badge>
        <Badge variant="outline">{ssd.resolution_profile}</Badge>
        <span className="text-muted-foreground">
          {ssd.scene_count} scenes · {formatDuration(ssd.total_duration_seconds)}
        </span>
      </div>

      <Accordion type="multiple" className="w-full">
        {(ssd.scenes || []).map((scene) => (
          <SceneCard key={scene.scene_id} scene={scene} />
        ))}
      </Accordion>
    </div>
  );
}
