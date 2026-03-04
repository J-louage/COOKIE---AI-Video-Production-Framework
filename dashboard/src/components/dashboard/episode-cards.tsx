import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EpisodeSummary } from "@/lib/data/episodes";
import { statusColor, productionProgress } from "@/lib/helpers";
import { EmptyState } from "../empty-state";
import { Film } from "lucide-react";

export function EpisodeCards({ episodes }: { episodes: EpisodeSummary[] }) {
  if (episodes.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title="No episodes yet"
        description="Run /cookie-director to start your first episode."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {episodes.map((ep) => {
        const config = ep.config;
        const status = config?.status || "not-started";
        const progress = config?.production_state
          ? productionProgress(config.production_state)
          : 0;

        return (
          <Link key={ep.id} href={`/episodes/${ep.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    {config?.title || ep.id}
                  </CardTitle>
                  <Badge variant="secondary" className={statusColor(status)}>
                    {status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{ep.id}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Production Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="mt-1" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
