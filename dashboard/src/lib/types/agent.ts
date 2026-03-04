export interface Agent {
  agent_id: string;
  name: string;
  module: string;
  file_path: string;
  role: string;
  priority: string;
  tools: string;
  memory_path: string;
}

export interface Workflow {
  workflow_id: string;
  name: string;
  module: string;
  phase: string;
  path: string;
  agent: string;
  priority: string;
  description: string;
}

export interface Task {
  task_id: string;
  name: string;
  path: string;
  priority: string;
  description: string;
}

export interface Skill {
  skill_id: string;
  name: string;
  path: string;
  used_by: string;
  description: string;
}

export interface MemorySidecar {
  agent: string;
  path: string;
  files: string[];
}
