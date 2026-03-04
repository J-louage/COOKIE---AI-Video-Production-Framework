import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, Layers, DollarSign } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

export function QuickStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { Film, Users, Layers, DollarSign };
