import { StyleGuide } from "@/lib/data/episodes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ColorSwatch({ name, color }: { name: string; color: string }) {
  if (!color) return null;
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded border"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium capitalize">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{color}</p>
      </div>
    </div>
  );
}

export function StyleGuideViewer({ guide }: { guide: StyleGuide }) {
  const colors = guide.color_palette || {};

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(colors).map(([name, value]) => (
            <ColorSwatch key={name} name={name} color={String(value)} />
          ))}
          {Object.keys(colors).length === 0 && (
            <p className="text-sm text-muted-foreground">No colors defined</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Typography</CardTitle>
        </CardHeader>
        <CardContent>
          {guide.typography ? (
            <dl className="space-y-2 text-sm">
              {Object.entries(guide.typography).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="font-mono">{String(val)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">No typography defined</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Cinematic Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {guide.cinematic_style && <p>{guide.cinematic_style}</p>}
          {guide.lighting_preference && (
            <p>
              <span className="text-muted-foreground">Lighting:</span>{" "}
              {guide.lighting_preference}
            </p>
          )}
          {guide.camera_style && (
            <p>
              <span className="text-muted-foreground">Camera:</span>{" "}
              {guide.camera_style}
            </p>
          )}
          {guide.style_tokens && (
            <div>
              <p className="text-xs text-muted-foreground">Style Tokens</p>
              <code className="mt-1 block rounded bg-muted p-2 text-xs">
                {guide.style_tokens}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Negative Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {(guide.negative_prompts || []).map((p) => (
              <Badge key={p} variant="outline" className="text-xs">
                {p}
              </Badge>
            ))}
            {(!guide.negative_prompts || guide.negative_prompts.length === 0) && (
              <p className="text-sm text-muted-foreground">None</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
