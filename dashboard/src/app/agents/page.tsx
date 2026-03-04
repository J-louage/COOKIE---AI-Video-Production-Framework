import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { loadAgents, loadTasks, loadSkills, loadMemorySidecars } from "@/lib/data/agents";
import { loadWorkflows, groupWorkflowsByPhase, PHASE_LABELS } from "@/lib/data/workflows";
import { priorityColor } from "@/lib/helpers";
import { Brain } from "lucide-react";

export default function AgentsPage() {
  const agents = loadAgents();
  const workflows = loadWorkflows();
  const tasks = loadTasks();
  const skills = loadSkills();
  const sidecars = loadMemorySidecars();

  const workflowsByPhase = groupWorkflowsByPhase(workflows);

  return (
    <PageShell
      title="Agents & Workflows"
      description={`${agents.length} agents · ${workflows.length} workflows · ${tasks.length} tasks · ${skills.length} skills`}
    >
      <div className="space-y-8">
        {/* Agents Table */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Agents</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Memory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((a) => (
                  <TableRow key={a.agent_id}>
                    <TableCell className="font-mono text-sm">
                      {a.agent_id}
                    </TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.module}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {a.role}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={priorityColor(a.priority)}
                      >
                        {a.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {a.memory_path ? (
                        <Brain className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Workflows by Phase */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Workflows</h2>
          <Accordion type="multiple" className="w-full">
            {Object.entries(workflowsByPhase).map(([phase, wfs]) => (
              <AccordionItem key={phase} value={phase}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{PHASE_LABELS[phase] || phase}</span>
                    <Badge variant="secondary" className="ml-2">
                      {wfs.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Agent</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wfs.map((w) => (
                          <TableRow key={w.workflow_id}>
                            <TableCell className="font-mono text-xs">
                              {w.workflow_id}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {w.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {w.agent}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={priorityColor(w.priority)}
                              >
                                {w.priority}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[300px]">
                              {w.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Tasks</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((t) => (
                  <TableRow key={t.task_id}>
                    <TableCell className="font-mono text-sm">
                      {t.task_id}
                    </TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={priorityColor(t.priority)}
                      >
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {t.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Skills</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.skill_id}>
                    <TableCell className="font-mono text-sm">
                      {s.skill_id}
                    </TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {s.used_by.split(",").map((a) => (
                          <Badge
                            key={a.trim()}
                            variant="outline"
                            className="text-xs"
                          >
                            {a.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {s.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Memory Sidecars */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Memory Sidecars</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sidecars.map((sc) => (
              <Card key={sc.agent}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    {sc.agent}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-xs text-muted-foreground mb-2">
                    {sc.path}
                  </p>
                  {sc.files.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {sc.files.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Empty</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
