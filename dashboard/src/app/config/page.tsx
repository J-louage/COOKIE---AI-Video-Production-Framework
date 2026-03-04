import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { loadGlobalConfig, loadFormatPresets, loadResolutionProfiles } from "@/lib/data/config";
import { loadProjectConfig } from "@/lib/data/project";

export default function ConfigPage() {
  const global = loadGlobalConfig();
  const project = loadProjectConfig();
  const formats = loadFormatPresets();
  const profiles = loadResolutionProfiles();

  return (
    <PageShell
      title="Configuration"
      description="Framework and project configuration hierarchy"
    >
      <div className="space-y-8">
        {/* Config Hierarchy */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Configuration Hierarchy</h2>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">global.yaml</Badge>
            <span className="text-muted-foreground">&rarr;</span>
            <Badge variant="outline">module config.yaml</Badge>
            <span className="text-muted-foreground">&rarr;</span>
            <Badge variant="secondary">project-config.yaml</Badge>
            <span className="text-muted-foreground">&rarr;</span>
            <Badge>episode-config.yaml</Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Lower configs override higher ones. Episode overrides take precedence.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Global Config */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Global Config</CardTitle>
            </CardHeader>
            <CardContent>
              {global ? (
                <dl className="space-y-2 text-sm">
                  {Object.entries(global).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="font-mono text-xs">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  global.yaml not found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Project Defaults */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Project Defaults</CardTitle>
            </CardHeader>
            <CardContent>
              {project?.defaults ? (
                <dl className="space-y-2 text-sm">
                  {Object.entries(project.defaults).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="font-mono text-xs">{String(val)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  project-config.yaml not found
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Resolution Profiles */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Resolution Profiles</h2>
          {profiles?.profiles ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>VEO</TableHead>
                    <TableHead>Nano Banana</TableHead>
                    <TableHead>Remotion</TableHead>
                    <TableHead>FFmpeg CRF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(profiles.profiles).map(([name, p]) => (
                    <TableRow key={name}>
                      <TableCell className="font-mono font-medium">
                        {name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.description}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.veo_resolution}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.nano_banana_resolution}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.remotion_width}x{p.remotion_height}
                      </TableCell>
                      <TableCell className="text-sm">{p.ffmpeg_crf}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not found</p>
          )}
        </div>

        <Separator />

        {/* Format Presets */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Format Presets</h2>
          {formats?.formats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(formats.formats).map(([name, f]) => (
                <Card key={name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono">{name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Aspect Ratio</dt>
                        <dd>{f.aspect_ratio}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Duration</dt>
                        <dd>
                          {f.min_duration}–{f.max_duration}s
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Resolution</dt>
                        <dd>{f.resolution}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Pacing</dt>
                        <dd>
                          {f.pacing} ({f.pacing_multiplier}x)
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Text Density</dt>
                        <dd>{f.text_density}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Hook Required</dt>
                        <dd>{f.requires_hook ? "Yes" : "No"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">CTA Required</dt>
                        <dd>{f.requires_cta ? "Yes" : "No"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not found</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
