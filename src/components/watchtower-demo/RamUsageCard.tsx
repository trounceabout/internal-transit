import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HoverDateTooltip from "./HoverDateTooltip";
import StatHighlight from "./StatHighlight";
import WtCard from "./WtCard";
import {
  avg,
  changeColorForIncrease,
  computeChange,
  formatTooltipTime,
  periodChange,
} from "./graphMeasurements";
import { RAM_TOTAL_BYTES, ramData } from "./mockData";

const GB = 1024 * 1024 * 1024;
const formatGB = (bytes: number) => (bytes / GB).toFixed(1);
const ELEVATED_THRESHOLD = 85;

export default function RamUsageCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const midpoint = Math.floor(ramData.length / 2);
  const prevData = ramData.slice(0, midpoint);
  const graphData = ramData.slice(midpoint);

  const currentAvg = avg(graphData, "memory");
  const prevAvg = avg(prevData, "memory");
  const periodChangePercent = periodChange(currentAvg, prevAvg);

  const isHovering = activeIndex !== null;
  const displayBytes = isHovering
    ? (graphData[activeIndex]?.memory ?? 0)
    : currentAvg;
  const changePercent = isHovering
    ? computeChange(ramData, "memory", midpoint + activeIndex)
    : periodChangePercent;
  const changeColor = changeColorForIncrease(changePercent, "increase-is-bad");

  const percentUsed = Math.round((displayBytes / RAM_TOTAL_BYTES) * 100);
  const unitLabel = `${formatGB(displayBytes)}/${formatGB(RAM_TOTAL_BYTES)} GB${
    isHovering ? "" : " avg"
  }`;

  return (
    <WtCard title="RAM usage">
      <div className="flex flex-col gap-[var(--wt-demo-space-150)] p-[var(--wt-demo-space-200)]">
        <StatHighlight
          value={`${percentUsed}%`}
          valueColor={
            percentUsed > ELEVATED_THRESHOLD ? "var(--wt-demo-elevated-text)" : undefined
          }
          unit={unitLabel}
          changePercent={typeof changePercent === "number" ? changePercent : undefined}
          changeLabel={changePercent === "new" ? "New" : undefined}
          changeColor={changeColor}
        />
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-[var(--wt-demo-space-50)]">
            <span style={{ color: "var(--wt-demo-neutral-text-weak)" }}>Swap</span>
            <span
              className="font-mono font-semibold"
              style={{ color: "var(--wt-demo-warning-text)" }}
            >
              1.2 of 4 GB
            </span>
          </div>
          <span className="font-mono" style={{ color: "var(--wt-demo-warning-text)" }}>
            Monitor closely
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 pt-[var(--wt-demo-space-100)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={graphData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex != null) {
                setActiveIndex(Number(state.activeTooltipIndex));
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Tooltip content={<HoverDateTooltip formatLabel={formatTooltipTime} />} />
            <CartesianGrid
              vertical={false}
              strokeDasharray="5 5"
              stroke="var(--wt-demo-neutral-border-weak)"
            />
            <XAxis
              type="number"
              hide
              dataKey="time"
              scale="time"
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              hide
              domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : dataMax * 1.05)]}
            />
            <Area
              dot={false}
              dataKey="memory"
              type="monotone"
              stroke="var(--wt-demo-chart-ram-stroke)"
              fill="var(--wt-demo-chart-ram-fill)"
              strokeWidth={2}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WtCard>
  );
}
