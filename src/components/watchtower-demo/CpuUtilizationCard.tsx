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
import { cpuData } from "./mockData";

const VCPU_COUNT = 4;
const ELEVATED_THRESHOLD = 65;

export default function CpuUtilizationCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const midpoint = Math.floor(cpuData.length / 2);
  const prevData = cpuData.slice(0, midpoint);
  const graphData = cpuData.slice(midpoint);

  const currentAvg = avg(graphData, "cpu");
  const prevAvg = avg(prevData, "cpu");
  const periodChangePercent = periodChange(currentAvg, prevAvg);

  const isHovering = activeIndex !== null;
  const currentValue = isHovering ? (graphData[activeIndex]?.cpu ?? 0) : currentAvg;
  const changePercent = isHovering
    ? computeChange(cpuData, "cpu", midpoint + activeIndex)
    : periodChangePercent;
  const changeColor = changeColorForIncrease(changePercent, "increase-is-bad");

  const cpuUser = Math.round(currentValue * 0.5);
  const cpuSystem = Math.round(currentValue * 0.28);
  const cpuIdle = Math.round(100 - currentValue);

  return (
    <WtCard
      title="CPU Utilization"
      infoMessage="How much of your processing power is being utilized"
      backgroundImage="var(--wt-demo-cpu-card-bg)"
    >
      <div className="flex flex-col gap-[var(--wt-demo-space-150)] p-[var(--wt-demo-space-200)]">
        <StatHighlight
          value={`${Math.round(currentValue)}%`}
          valueColor={
            currentValue > ELEVATED_THRESHOLD ? "var(--wt-demo-elevated-text)" : undefined
          }
          unit={`${VCPU_COUNT} vCPUs${isHovering ? "" : " avg"}`}
          changePercent={typeof changePercent === "number" ? changePercent : undefined}
          changeLabel={changePercent === "new" ? "New" : undefined}
          changeColor={changeColor}
        />
        <div
          className="flex flex-wrap items-center gap-[var(--wt-demo-space-100)] text-xs"
          style={{ color: "var(--wt-demo-neutral-text-weak)" }}
        >
          <span>
            User{" "}
            <span className="font-mono font-medium" style={{ color: "var(--wt-demo-neutral-text-main)" }}>
              {cpuUser}%
            </span>
          </span>
          <span>&bull;</span>
          <span>
            System{" "}
            <span className="font-mono font-medium" style={{ color: "var(--wt-demo-neutral-text-main)" }}>
              {cpuSystem}%
            </span>
          </span>
          <span>&bull;</span>
          <span>
            Idle{" "}
            <span className="font-mono font-medium" style={{ color: "var(--wt-demo-neutral-text-main)" }}>
              {cpuIdle}%
            </span>
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
            <YAxis hide domain={[0, (dataMax: number) => Math.max(dataMax + 1, 101)]} />
            <Area
              dot={false}
              dataKey="cpu"
              type="monotone"
              stroke="var(--wt-demo-chart-cpu-stroke)"
              fill="var(--wt-demo-chart-cpu-fill)"
              strokeWidth={2}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WtCard>
  );
}
