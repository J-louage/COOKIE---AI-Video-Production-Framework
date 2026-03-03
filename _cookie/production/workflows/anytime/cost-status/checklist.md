# Cost Status Checklist

## Data Loading
- [ ] Episode cost estimate loaded from _cost/estimates/
- [ ] Episode cost actuals loaded from _cost/actuals/
- [ ] Missing files handled gracefully (noted, not errored)

## Episode Cost Calculation
- [ ] Total spent calculated (sum of all actual transactions)
- [ ] Estimated total loaded from estimate
- [ ] Remaining budget calculated (estimated - spent)
- [ ] Percentage used calculated ((spent / estimated) * 100)
- [ ] Variance calculated (spent - estimated)

## Per-Tool Breakdown
- [ ] VEO: estimated vs actual cost and percentage
- [ ] Nano Banana: estimated vs actual cost and percentage
- [ ] ElevenLabs: estimated vs actual cost and percentage
- [ ] Over-estimate tools flagged with warning indicator

## Retake Summary
- [ ] Total retake count calculated
- [ ] Total retake cost calculated
- [ ] Retake percentage of total spend calculated
- [ ] Scenes complete vs total scenes counted

## Project Budget (if applicable)
- [ ] Project-config.yaml loaded for budget settings
- [ ] Total project spend calculated across all episodes
- [ ] Project budget utilization percentage calculated
- [ ] Budget status determined (on-track, warning, halt)
- [ ] Alert and halt thresholds checked

## Display
- [ ] Formatted report displayed with aligned columns
- [ ] Status indicators shown (on track, warning, over estimate)
- [ ] All currency values shown in USD with 2 decimal places
