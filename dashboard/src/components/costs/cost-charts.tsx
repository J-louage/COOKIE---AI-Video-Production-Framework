"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";

interface CostEstimateEntry {
  episodeId: string;
  estimate: {
    summary?: {
      veo_total?: number;
      nano_banana_total?: number;
      elevenlabs_total?: number;
      estimated_total?: number;
    };
  };
}

const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

export function CostCharts({
  estimates,
  totals,
  currency,
}: {
  estimates: CostEstimateEntry[];
  totals: { veo: number; nanoBanana: number; elevenlabs: number; total: number };
  currency: string;
}) {
  const barData = estimates.map((e) => ({
    name: e.episodeId,
    VEO: e.estimate.summary?.veo_total || 0,
    "Nano Banana": e.estimate.summary?.nano_banana_total || 0,
    ElevenLabs: e.estimate.summary?.elevenlabs_total || 0,
  }));

  const pieData = [
    { name: "VEO", value: totals.veo },
    { name: "Nano Banana", value: totals.nanoBanana },
    { name: "ElevenLabs", value: totals.elevenlabs },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Cost by Episode</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value: number | undefined) =>
                  `${currency === "USD" ? "$" : ""}${(value ?? 0).toFixed(2)}`
                }
              />
              <Legend />
              <Bar dataKey="VEO" fill={COLORS[0]} stackId="a" />
              <Bar dataKey="Nano Banana" fill={COLORS[1]} stackId="a" />
              <Bar dataKey="ElevenLabs" fill={COLORS[2]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Cost by Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={(props: PieLabelRenderProps) =>
                  `${props.name ?? ""} ${(((props.percent ?? 0)) * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) =>
                  `${currency === "USD" ? "$" : ""}${(value ?? 0).toFixed(2)}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
