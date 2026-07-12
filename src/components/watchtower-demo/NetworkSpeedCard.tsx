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
import { networkSpeedData } from "./mockData";

function formatKbps(kbps: number): { value: string; unit: string } {
  if (kbps >= 1000) return { value: (kbps / 1000).toFixed(2), unit: "MB/s" };
  return { value: Math.round(kbps).toString(), unit: "KB/s" };
}

const INTERVAL_SECONDS = 1800;
const kbpsToGB = (kbps: number) => (kbps * INTERVAL_SECONDS) / (8 * 1_000_000);

export default function NetworkSpeedCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const midpoint = Math.floor(networkSpeedData.length / 2);
  const prevData = networkSpeedData.slice(0, midpoint);
  const graphData = networkSpeedData.slice(midpoint);

  const isHovering = activeIndex !== null;
  const currentAvgReceived = avg(graphData, "received");
  const currentAvgSent = avg(graphData, "sent");
  const prevAvgReceived = avg(prevData, "received");
  const prevAvgSent = avg(prevData, "sent");

  const displayIndex = isHovering ? activeIndex : graphData.length - 1;
  const displayPoint = graphData[displayIndex];
  const displayReceived = isHovering ? (displayPoint?.received ?? 0) : currentAvgReceived;
  const displaySent = isHovering ? (displayPoint?.sent ?? 0) : currentAvgSent;

  const receivedChange = isHovering
    ? computeChange(networkSpeedData, "received", midpoint + displayIndex)
    : periodChange(currentAvgReceived, prevAvgReceived);
  const sentChange = isHovering
    ? computeChange(networkSpeedData, "sent", midpoint + displayIndex)
    : periodChange(currentAvgSent, prevAvgSent);

  const formattedReceived = formatKbps(displayReceived);
  const formattedSent = formatKbps(displaySent);

  const visibleData = graphData.slice(0, displayIndex + 1);
  const totalIncomingGB = visibleData
    .reduce((sum, point) => sum + kbpsToGB(point.received ?? 0), 0)
    .toFixed(1);
  const totalOutgoingGB = visibleData
    .reduce((sum, point) => sum + kbpsToGB(point.sent ?? 0), 0)
    .toFixed(1);

  return (
    <WtCard
      title="Network speed"
      infoMessage="Current network throughput — incoming and outgoing traffic per second"
    >
      <div className="flex flex-col gap-[var(--wt-demo-space-150)] p-[var(--wt-demo-space-200)]">
        <div className="flex flex-wrap items-start gap-[var(--wt-demo-space-300)]">
          <StatHighlight
            label="Incoming"
            iconColor="var(--wt-demo-chart-network-incoming)"
            value={formattedReceived.value}
            unit={formattedReceived.unit}
            changePercent={typeof receivedChange === "number" ? receivedChange : undefined}
            changeLabel={receivedChange === "new" ? "New" : undefined}
            changeColor={changeColorForIncrease(receivedChange, "increase-is-good")}
          />
          <StatHighlight
            label="Outgoing"
            iconColor="var(--wt-demo-chart-network-outgoing)"
            value={formattedSent.value}
            unit={formattedSent.unit}
            changePercent={typeof sentChange === "number" ? sentChange : undefined}
            changeLabel={sentChange === "new" ? "New" : undefined}
            changeColor={changeColorForIncrease(sentChange, "increase-is-good")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-[var(--wt-demo-space-100)] text-xs">
          <span style={{ color: "var(--wt-demo-neutral-text-weak)" }}>Total incoming</span>
          <span className="font-mono font-medium" style={{ color: "var(--wt-demo-neutral-text-main)" }}>
            {totalIncomingGB} GB
          </span>
          <span style={{ color: "var(--wt-demo-neutral-text-weak)" }}>&bull;</span>
          <span style={{ color: "var(--wt-demo-neutral-text-weak)" }}>Total outgoing</span>
          <span className="font-mono font-medium" style={{ color: "var(--wt-demo-neutral-text-main)" }}>
            {totalOutgoingGB} GB
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
              domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : dataMax * 1.1)]}
            />
            <Area
              dot={false}
              dataKey="received"
              type="monotone"
              stroke="var(--wt-demo-chart-network-incoming)"
              fill="var(--wt-demo-chart-network-incoming-fill)"
              fillOpacity={0.5}
              strokeWidth={2}
              animationDuration={400}
            />
            <Area
              dot={false}
              dataKey="sent"
              type="monotone"
              stroke="var(--wt-demo-chart-network-outgoing)"
              fill="var(--wt-demo-chart-network-outgoing-fill)"
              fillOpacity={0.5}
              strokeWidth={2}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WtCard>
  );
}
