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
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/empty-state";
import { loadProjectConfig } from "@/lib/data/project";
import { loadPricing, loadAllCostEstimates } from "@/lib/data/costs";
import { formatCurrency } from "@/lib/helpers";
import { DollarSign } from "lucide-react";
import { CostCharts } from "@/components/costs/cost-charts";

export default function CostsPage() {
  const project = loadProjectConfig();
  const pricing = loadPricing();
  const estimates = loadAllCostEstimates();

  const budget = project?.budget?.total_project_budget || 0;
  const currency = project?.budget?.currency || "USD";

  const totals = estimates.reduce(
    (acc, e) => {
      const s = e.estimate.summary;
      acc.veo += s?.veo_total || 0;
      acc.nanoBanana += s?.nano_banana_total || 0;
      acc.elevenlabs += s?.elevenlabs_total || 0;
      acc.total += s?.estimated_total || 0;
      return acc;
    },
    { veo: 0, nanoBanana: 0, elevenlabs: 0, total: 0 }
  );

  const percent = budget > 0 ? Math.round((totals.total / budget) * 100) : 0;

  return (
    <PageShell title="Cost Dashboard" description="Budget tracking and cost breakdowns">
      <div className="space-y-6">
        {/* Budget Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(budget, currency)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Estimated Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(totals.total, currency)}
              </p>
              {budget > 0 && (
                <div className="mt-2">
                  <Progress value={Math.min(percent, 100)} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {percent}% of budget
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Per-Episode Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  project?.budget?.per_episode_budget || 0,
                  currency
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Episodes Estimated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{estimates.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {estimates.length > 0 && (
          <CostCharts
            estimates={estimates}
            totals={totals}
            currency={currency}
          />
        )}

        {/* Per-Episode Breakdown */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Per-Episode Estimates</h2>
          {estimates.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No cost estimates yet"
              description="Cost estimates are generated from SSDs."
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Episode</TableHead>
                    <TableHead className="text-right">VEO</TableHead>
                    <TableHead className="text-right">Nano Banana</TableHead>
                    <TableHead className="text-right">ElevenLabs</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estimates.map((e) => (
                    <TableRow key={e.episodeId}>
                      <TableCell className="font-mono text-sm">
                        {e.episodeId}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(e.estimate.summary?.veo_total || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          e.estimate.summary?.nano_banana_total || 0
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          e.estimate.summary?.elevenlabs_total || 0
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          e.estimate.summary?.estimated_total || 0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pricing Reference */}
        {pricing && (
          <div>
            <h2 className="mb-4 text-lg font-semibold">Pricing Reference</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* VEO Pricing */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">VEO Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-xs">
                    {Object.entries(pricing.veo).map(([model, speeds]) => (
                      <div key={model}>
                        <dt className="font-mono font-medium">{model}</dt>
                        {Object.entries(speeds).map(([speed, resolutions]) => (
                          <div key={speed} className="ml-2">
                            <span className="text-muted-foreground">
                              {speed}:
                            </span>
                            {Object.entries(
                              resolutions as Record<
                                string,
                                { per_second: number }
                              >
                            ).map(([res, price]) => (
                              <span key={res} className="ml-2">
                                {res}={formatCurrency(price.per_second)}/s
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>

              {/* Nano Banana Pricing */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Nano Banana Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-xs">
                    {Object.entries(pricing.nano_banana).map(
                      ([model, resolutions]) => (
                        <div key={model}>
                          <dt className="font-mono font-medium">{model}</dt>
                          <div className="ml-2 flex flex-wrap gap-2">
                            {Object.entries(
                              resolutions as Record<string, number>
                            ).map(([res, price]) => (
                              <span key={res}>
                                {res}={formatCurrency(price)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </dl>
                </CardContent>
              </Card>

              {/* ElevenLabs Pricing */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">ElevenLabs Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {formatCurrency(pricing.elevenlabs.per_1000_characters)} per
                    1,000 characters
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
