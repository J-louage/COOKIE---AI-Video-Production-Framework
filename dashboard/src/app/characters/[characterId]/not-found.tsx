import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/empty-state";
import { FileQuestion } from "lucide-react";

export default function CharacterNotFound() {
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
