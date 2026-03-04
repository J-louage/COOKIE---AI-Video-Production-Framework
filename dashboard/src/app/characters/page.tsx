import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { listCharactersWithIdentity, loadBrandConfig, loadBrandColors, loadBrandFonts } from "@/lib/data/characters";
import { Users } from "lucide-react";

export default function CharactersPage() {
  const characters = listCharactersWithIdentity();
  const brand = loadBrandConfig();
  const brandColors = loadBrandColors();
  const brandFonts = loadBrandFonts();

  return (
    <PageShell title="Characters" description="Character identities and brand config">
      {/* Character Gallery */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Characters</h2>
        {characters.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No characters yet"
            description="Run /cookie-create-character to create your first character."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {characters.map((char) => {
              const id = char.identity;
              // Derive type from voice_config or type field
              const charType = id?.type
                || (id?.voice_config?.voice_type === "none" ? "visual-only" : undefined);
              // Get style names from styles array or available_styles
              const styleNames = id?.styles?.map((s) => s.style_name)
                || id?.available_styles
                || [];

              return (
                <Link key={char.id} href={`/characters/${char.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {id?.name || char.id}
                        </CardTitle>
                        {charType && (
                          <Badge variant="outline">{charType}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {char.id}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {id?.role && (
                        <p className="text-sm text-muted-foreground">
                          {id.role}
                        </p>
                      )}
                      {id?.description && (
                        <p className="mt-1 text-sm line-clamp-2">
                          {id.description}
                        </p>
                      )}
                      {styleNames.length > 0 && (
                        <div className="mt-2 flex gap-1">
                          {styleNames.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Brand Config */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Brand Configuration</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Brand Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name</dt>
                  <dd>{brand?.brand_name || "Not set"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tagline</dt>
                  <dd>{brand?.tagline || "Not set"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tone</dt>
                  <dd>{brand?.tone_of_voice || "Not set"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent>
              {brandColors?.palette ? (
                <div className="space-y-2">
                  {Object.entries(brandColors.palette).map(([name, val]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded border"
                        style={{
                          backgroundColor: val.hex || "transparent",
                        }}
                      />
                      <span className="text-sm capitalize">{name}</span>
                      <span className="ml-auto font-mono text-xs text-muted-foreground">
                        {val.hex || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not configured</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Brand Fonts</CardTitle>
            </CardHeader>
            <CardContent>
              {brandFonts ? (
                <dl className="space-y-2 text-sm">
                  {Object.entries(brandFonts).map(([role, config]) => (
                    <div key={role} className="flex justify-between">
                      <dt className="capitalize text-muted-foreground">
                        {role}
                      </dt>
                      <dd className="font-mono">
                        {config.family || "Not set"}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Not configured</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
