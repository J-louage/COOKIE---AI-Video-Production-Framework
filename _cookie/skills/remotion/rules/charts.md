# Charts

Animated data visualizations in Remotion use SVG-based chart components with `interpolate()` to animate values over time. All chart rendering is done with standard React and SVG, no external charting library required.

---

## Animated Bar Chart

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

interface BarData {
  label: string;
  value: number;
  color: string;
}

export const BarChart: React.FC<{
  data: BarData[];
  maxValue?: number;
  barWidth?: number;
  gap?: number;
  animationDuration?: number;
  staggerDelay?: number;
}> = ({
  data,
  maxValue,
  barWidth = 60,
  gap = 20,
  animationDuration = 30,
  staggerDelay = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  const chartHeight = height * 0.6;
  const chartWidth = data.length * (barWidth + gap) - gap;
  const startX = (width - chartWidth) / 2;
  const baseY = height * 0.8;

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {/* Axis line */}
        <line
          x1={startX - 10}
          y1={baseY}
          x2={startX + chartWidth + 10}
          y2={baseY}
          stroke="#666"
          strokeWidth={2}
        />

        {data.map((d, i) => {
          const delay = i * staggerDelay;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 120, mass: 0.8 },
          });

          const barHeight = (d.value / max) * chartHeight * progress;
          const x = startX + i * (barWidth + gap);
          const y = baseY - barHeight;

          return (
            <g key={d.label}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={d.color}
                rx={4}
              />
              {/* Value label */}
              <text
                x={x + barWidth / 2}
                y={y - 10}
                textAnchor="middle"
                fill="white"
                fontSize={18}
                fontWeight="bold"
                opacity={progress}
              >
                {Math.round(d.value * progress)}
              </text>
              {/* Category label */}
              <text
                x={x + barWidth / 2}
                y={baseY + 30}
                textAnchor="middle"
                fill="#aaa"
                fontSize={14}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
```

---

## Animated Line Chart

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

interface DataPoint {
  x: number;
  y: number;
}

export const LineChart: React.FC<{
  data: DataPoint[];
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  animationFrames?: number;
}> = ({
  data,
  color = "#4F46E5",
  strokeWidth = 3,
  showDots = true,
  animationFrames = 60,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const padding = { top: 60, right: 60, bottom: 60, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxX = Math.max(...data.map((d) => d.x));
  const maxY = Math.max(...data.map((d) => d.y));
  const minY = Math.min(...data.map((d) => d.y));

  const points = data.map((d) => ({
    px: padding.left + (d.x / maxX) * chartW,
    py: padding.top + chartH - ((d.y - minY) / (maxY - minY)) * chartH,
  }));

  // Animate by revealing the path progressively
  const progress = interpolate(frame, [0, animationFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const visibleCount = Math.ceil(points.length * progress);
  const visiblePoints = points.slice(0, visibleCount);

  const pathData = visiblePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.px} ${p.py}`)
    .join(" ");

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={padding.left}
            y1={padding.top + chartH * (1 - frac)}
            x2={width - padding.right}
            y2={padding.top + chartH * (1 - frac)}
            stroke="#333"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Line */}
        <path d={pathData} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {showDots &&
          visiblePoints.map((p, i) => (
            <circle key={i} cx={p.px} cy={p.py} r={5} fill={color} stroke="white" strokeWidth={2} />
          ))}
      </svg>
    </AbsoluteFill>
  );
};
```

---

## Animated Pie Chart

```tsx
import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from "remotion";

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

export const PieChart: React.FC<{
  data: PieSlice[];
  radius?: number;
}> = ({ data, radius = 200 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Animate the total sweep angle
  const sweep = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });
  const totalAngle = 360 * sweep;

  let currentAngle = -90; // Start from top

  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        {data.map((slice) => {
          const sliceAngle = (slice.value / total) * totalAngle;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          currentAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = cx + radius * Math.cos(startRad);
          const y1 = cy + radius * Math.sin(startRad);
          const x2 = cx + radius * Math.cos(endRad);
          const y2 = cy + radius * Math.sin(endRad);

          const largeArc = sliceAngle > 180 ? 1 : 0;

          const pathData = [
            `M ${cx} ${cy}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          return (
            <path key={slice.label} d={pathData} fill={slice.color} stroke="white" strokeWidth={2} />
          );
        })}

        {/* Center hole for donut style */}
        <circle cx={cx} cy={cy} r={radius * 0.5} fill="#111" />
      </svg>
    </AbsoluteFill>
  );
};
```

---

## Animated Counter

A number that counts up from 0 to a target value.

```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export const AnimatedCounter: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  decimals?: number;
}> = ({
  target,
  prefix = "",
  suffix = "",
  fontSize = 96,
  color = "#FFFFFF",
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
  });

  const value = target * progress;
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <div style={{ fontSize, fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>
      {prefix}{display}{suffix}
    </div>
  );
};
```

---

## Horizontal Bar Chart

```tsx
export const HorizontalBarChart: React.FC<{
  data: Array<{ label: string; value: number; color: string }>;
  barHeight?: number;
  maxWidth?: number;
}> = ({ data, barHeight = 40, maxWidth = 800 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((d, i) => {
        const progress = spring({
          frame: frame - i * 5,
          fps,
          config: { damping: 15, stiffness: 100 },
        });
        const barW = (d.value / maxValue) * maxWidth * progress;

        return (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 120, textAlign: "right", color: "#ccc", fontSize: 18 }}>
              {d.label}
            </div>
            <div
              style={{
                width: barW,
                height: barHeight,
                backgroundColor: d.color,
                borderRadius: barHeight / 2,
              }}
            />
            <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>
              {Math.round(d.value * progress)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

---

## COOKIE SSD Integration

SSD scenes can configure data visualizations via the `chart` block, mapping to the appropriate chart component.

```yaml
scenes:
  - id: scene-stats
    chart:
      type: "bar"                  # "bar" | "horizontal-bar" | "line" | "pie" | "counter"
      animation_duration: 30
      stagger_delay: 5
      data:
        - label: "Q1"
          value: 120
          color: "#4F46E5"
        - label: "Q2"
          value: 185
          color: "#10B981"
        - label: "Q3"
          value: 95
          color: "#F59E0B"
      counter:                     # only used when type is "counter"
        target: 1250
        prefix: "$"
        suffix: ""
        decimals: 0
        font_size: 96
        color: "#FFFFFF"
```

### Mapping SSD to Chart Components

```tsx
import { BarChart } from "./BarChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { AnimatedCounter } from "./AnimatedCounter";

function renderChart(ssdConfig: any) {
  const chart = ssdConfig.chart;
  if (!chart) return null;

  switch (chart.type) {
    case "bar":
      return (
        <BarChart
          data={chart.data}
          animationDuration={chart.animation_duration}
          staggerDelay={chart.stagger_delay}
        />
      );
    case "horizontal-bar":
      return <HorizontalBarChart data={chart.data} />;
    case "line":
      return (
        <LineChart
          data={chart.data.map((d: any) => ({ x: d.value, y: d.value }))}
          color={chart.data[0]?.color}
          animationFrames={chart.animation_duration}
        />
      );
    case "pie":
      return <PieChart data={chart.data} />;
    case "counter":
      return (
        <AnimatedCounter
          target={chart.counter.target}
          prefix={chart.counter.prefix}
          suffix={chart.counter.suffix}
          decimals={chart.counter.decimals}
          fontSize={chart.counter.font_size}
          color={chart.counter.color}
        />
      );
    default:
      return null;
  }
}
```

---

## Pitfalls

1. **SVG coordinate system.** SVG Y-axis increases downward. For charts, invert Y values: `y = chartHeight - (value / maxValue) * chartHeight`.

2. **Pie chart arc direction.** SVG arc `A` command uses the large-arc flag and sweep flag. Get these wrong and slices render inside out.

3. **Tabular numbers.** Use `fontVariantNumeric: "tabular-nums"` for counters so digits don't shift as values change.

4. **spring() with negative frames.** When using stagger delays (`frame - i * 5`), spring handles negative frames gracefully (returns 0), but verify this in your version.

5. **Responsive charts.** Use `useVideoConfig()` for width/height and calculate chart dimensions as percentages, not hardcoded pixels.
