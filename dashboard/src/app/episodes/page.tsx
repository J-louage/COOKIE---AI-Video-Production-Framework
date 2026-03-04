import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
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
import { listEpisodesWithConfig } from "@/lib/data/episodes";
import { statusColor, productionProgress } from "@/lib/helpers";
import { Film } from "lucide-react";

export default function EpisodesPage() {
  const episodes = listEpisodesWithConfig();

  return (
    <PageShell title="Episodes" description="All production episodes">
      {episodes.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No episodes yet"
          description="Run /cookie-director to start your first episode."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((ep) => {
                const c = ep.config;
                const status = c?.status || "not-started";
                const progress = c?.production_state
                  ? productionProgress(c.production_state)
                  : 0;
                return (
                  <TableRow key={ep.id}>
                    <TableCell className="font-mono text-sm">
                      <Link
                        href={`/episodes/${ep.id}`}
                        className="text-primary hover:underline"
                      >
                        {ep.id}
                      </Link>
                    </TableCell>
                    <TableCell>{c?.title || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor(status)}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c?.script?.source || "—"}
                    </TableCell>
                    <TableCell className="w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-2" />
                        <span className="text-xs text-muted-foreground w-8">
                          {progress}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </PageShell>
  );
}
