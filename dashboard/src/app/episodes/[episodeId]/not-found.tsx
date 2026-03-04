import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/empty-state";
import { FileQuestion } from "lucide-react";

export default function EpisodeNotFound() {
  return (
    <PageShell title="Episode Not Found">
      <EmptyState
        icon={FileQuestion}
        title="This episode doesn't exist yet"
        description="The episode directory was not found, or it doesn't have an episode-config.yaml file."
      />
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          To create an episode, run <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/cookie-director</code> in Claude Code and describe your project.
        </p>
        <Link
          href="/episodes"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Episodes
        </Link>
      </div>
    </PageShell>
  );
}
