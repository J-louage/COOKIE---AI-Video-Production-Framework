import { CostEstimate } from "@/lib/types/cost";
import { formatCurrency } from "@/lib/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

export function EpisodeCostTable({ estimate }: { estimate: CostEstimate }) {
  const scenes = estimate.scenes || [];
  const summary = estimate.summary;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scene</TableHead>
              <TableHead className="text-right">VEO</TableHead>
              <TableHead className="text-right">Nano Banana</TableHead>
              <TableHead className="text-right">ElevenLabs</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenes.map((s) => (
              <TableRow key={s.scene_id}>
                <TableCell className="font-mono text-sm">
                  {s.scene_id}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(s.veo_cost)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(s.nano_banana_cost)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(s.elevenlabs_cost)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(s.scene_total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {summary && (
            <TableFooter>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(summary.veo_total)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(summary.nano_banana_total)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(summary.elevenlabs_total)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(summary.subtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>
                  Retake Buffer ({summary.retake_buffer_percent}%)
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(summary.retake_buffer)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="font-bold">
                  Estimated Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(summary.estimated_total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
}
