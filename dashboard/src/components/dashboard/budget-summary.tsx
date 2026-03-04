import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/helpers";

export function BudgetSummary({
  budget,
  spent,
  currency,
  alertPercent,
}: {
  budget: number;
  spent: number;
  currency: string;
  alertPercent: number;
}) {
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const isWarning = percent >= alertPercent;
  const isOver = percent > 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Project Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {formatCurrency(spent, currency)}
          </span>
          <span className="text-sm text-muted-foreground">
            of {formatCurrency(budget, currency)}
          </span>
        </div>
        <Progress
          value={Math.min(percent, 100)}
          className={`mt-3 ${isOver ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-yellow-500" : ""}`}
        />
        <p className="mt-1 text-xs text-muted-foreground">{percent}% used</p>
      </CardContent>
    </Card>
  );
}
