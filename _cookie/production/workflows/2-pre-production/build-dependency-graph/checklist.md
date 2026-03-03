# Build Dependency Graph Checklist

## Required Checks
- [ ] SSD loaded and parsed completely
- [ ] All required assets identified and categorized by type
- [ ] Every asset assigned a unique asset ID
- [ ] Asset types covered: character refs, first frames, last frames, video clips, narration, music, SFX, screen recordings, text overlays
- [ ] Dependency graph built as a directed acyclic graph (DAG)
- [ ] No circular dependencies in the graph
- [ ] All dependency relationships are valid and complete

## Quality Standards
- [ ] Character reference images scheduled before video generation
- [ ] First frames scheduled before their dependent video clips
- [ ] Multi-clip scenes have sequential clip dependencies
- [ ] Narration generation identified as parallel to video generation
- [ ] Music/SFX sourcing identified as parallel to video generation
- [ ] Screen recordings identified as parallel to AI generation
- [ ] Execution waves properly grouped for maximum parallelism
- [ ] Critical path identified (longest sequential chain)

## Output Verification
- [ ] Dependency graph saved to episodes/{episode_id}/planning/dependency-graph.yaml
- [ ] Graph includes nodes with asset ID, type, status, estimated duration, cost
- [ ] Graph includes edges with dependency types
- [ ] Execution waves defined with asset groupings
- [ ] Execution plan includes sequential vs parallel time estimates
- [ ] Cost estimate included per wave
- [ ] Recommended execution order documented
