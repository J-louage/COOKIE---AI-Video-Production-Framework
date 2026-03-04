import { ProductionState, PRODUCTION_STATE_LABELS } from "@/lib/types/episode";
import { CheckCircle2, Circle } from "lucide-react";

export function ProductionStateChecklist({ state }: { state: ProductionState }) {
  const keys = Object.keys(state) as (keyof ProductionState)[];
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {keys.map((key) => (
        <div key={key} className="flex items-center gap-2 text-sm">
          {state[key] ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/40" />
          )}
          <span className={state[key] ? "" : "text-muted-foreground"}>
            {PRODUCTION_STATE_LABELS[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
