import { PageShell } from "@/components/layout/page-shell";
import { QuickStats, Film, Users, Layers, DollarSign } from "@/components/dashboard/quick-stats";
import { BudgetSummary } from "@/components/dashboard/budget-summary";
import { EpisodeCards } from "@/components/dashboard/episode-cards";
import { loadProjectConfig } from "@/lib/data/project";
import { listEpisodesWithConfig } from "@/lib/data/episodes";
import { loadEpisodeSSD } from "@/lib/data/episodes";
import { listCharacterIds } from "@/lib/data/characters";
import { loadAllCostEstimates } from "@/lib/data/costs";
import { formatCurrency } from "@/lib/helpers";

export default function HomePage() {
  const project = loadProjectConfig();
  const episodes = listEpisodesWithConfig();
  const characterIds = listCharacterIds();
  const costEstimates = loadAllCostEstimates();

  // Count scenes from SSDs
  const totalScenes = episodes.reduce((sum, ep) => {
    const ssd = loadEpisodeSSD(ep.id);
    return sum + (ssd?.metadata?.total_scenes || ssd?.scene_count || ssd?.scenes?.length || 0);
  }, 0);

  const totalSpent = costEstimates.reduce(
    (sum, e) => sum + (e.estimate.summary?.estimated_total || 0),
    0
  );
  const budget = project?.budget?.total_project_budget || 0;

  const stats = [
    { label: "Episodes", value: episodes.length, icon: Film },
    { label: "Characters", value: characterIds.length, icon: Users },
    { label: "Total Scenes", value: totalScenes, icon: Layers },
    {
      label: "Est. Cost",
      value: formatCurrency(totalSpent, project?.budget?.currency),
      icon: DollarSign,
    },
  ];

  return (
    <PageShell
      title={project?.project_name || "COOKIE Project"}
      description={
        project?.project_id
          ? `Project ID: ${project.project_id} · v${project.metadata?.cookie_version || "1.0.0"}`
          : "AI Video Production Framework"
      }
    >
      <div className="space-y-6">
        <QuickStats stats={stats} />

        {budget > 0 && (
          <BudgetSummary
            budget={budget}
            spent={totalSpent}
            currency={project?.budget?.currency || "USD"}
            alertPercent={project?.budget?.alert_at_percent || 80}
          />
        )}

        <div>
          <h2 className="mb-4 text-lg font-semibold">Episodes</h2>
          <EpisodeCards episodes={episodes} />
        </div>
      </div>
    </PageShell>
  );
}
