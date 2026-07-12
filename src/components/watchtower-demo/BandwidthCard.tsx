import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BottomBar, TopBar } from "./Bars";
import HoverDateTooltip from "./HoverDateTooltip";
import StatHighlight from "./StatHighlight";
import WtCard from "./WtCard";
import { avg, changeColorForIncrease, computeChange, periodChange } from "./graphMeasurements";
import { bandwidthData } from "./mockData";

function formatMB(mb: number): { value: string; unit: string } {
  if (mb >= 1000) return { value: (mb / 1000).toFixed(2), unit: "GB" };
  return { value: mb.toFixed(2), unit: "MB" };
}

export default function BandwidthCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const midpoint = Math.floor(bandwidthData.length / 2);
  const prevData = bandwidthData.slice(0, midpoint);
  const graphData = bandwidthData.slice(midpoint);

  const chartData = graphData.reduce<typeof graphData>((acc, point) => {
    const previousCumulative = acc.at(-1)?.totalCumulative ?? 0;
    const totalCumulative =
      previousCumulative + (point.incoming ?? 0) + (point.outgoing ?? 0);
    return [...acc, { ...point, totalCumulative }];
  }, []);

  const isHovering = activeIndex !== null;
  const avgIncoming = avg(graphData, "incoming");
  const avgOutgoing = avg(graphData, "outgoing");
  const prevAvgIncoming = avg(prevData, "incoming");
  const prevAvgOutgoing = avg(prevData, "outgoing");

  const displayIndex = activeIndex ?? chartData.length - 1;
  const displayPoint = chartData[displayIndex];

  const displayIncoming = isHovering ? (displayPoint?.incoming ?? 0) : avgIncoming;
  const displayOutgoing = isHovering ? (displayPoint?.outgoing ?? 0) : avgOutgoing;

  const incomingChange = isHovering
    ? computeChange(bandwidthData, "incoming", midpoint + displayIndex)
    : periodChange(avgIncoming, prevAvgIncoming);
  const outgoingChange = isHovering
    ? computeChange(bandwidthData, "outgoing", midpoint + displayIndex)
    : periodChange(avgOutgoing, prevAvgOutgoing);

  const totalUsedMB = displayPoint?.totalCumulative ?? 0;
  const formattedIncoming = formatMB(displayIncoming);
  const formattedOutgoing = formatMB(displayOutgoing);
  const formattedTotal = formatMB(totalUsedMB);

  return (
    <WtCard title="Bandwidth">
      <div className="flex flex-wrap items-start gap-[var(--wt-demo-space-300)] p-[var(--wt-demo-space-200)]">
        <StatHighlight
          label="Incoming"
          iconColor="var(--wt-demo-chart-bandwidth-incoming)"
          value={formattedIncoming.value}
          unit={formattedIncoming.unit}
          changePercent={typeof incomingChange === "number" ? incomingChange : undefined}
          changeLabel={incomingChange === "new" ? "New" : undefined}
          changeColor={changeColorForIncrease(incomingChange, "increase-is-good")}
        />
        <StatHighlight
          label="Outgoing"
          iconColor="var(--wt-demo-chart-bandwidth-outgoing)"
          value={formattedOutgoing.value}
          unit={formattedOutgoing.unit}
          changePercent={typeof outgoingChange === "number" ? outgoingChange : undefined}
          changeLabel={outgoingChange === "new" ? "New" : undefined}
          changeColor={changeColorForIncrease(outgoingChange, "increase-is-good")}
        />
        <StatHighlight
          label="Total"
          iconColor="var(--wt-demo-chart-bandwidth-cumulative)"
          value={formattedTotal.value}
          unit={formattedTotal.unit}
        />
      </div>

      <div className="relative min-h-0 flex-1 pt-[var(--wt-demo-space-100)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            maxBarSize={18}
            reverseStackOrder
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activeTooltipIndex != null) {
                setActiveIndex(Number(state.activeTooltipIndex));
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Tooltip content={<HoverDateTooltip />} />
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
              yAxisId="bars"
              hide
              domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : dataMax * 1.05)]}
            />
            <YAxis
              yAxisId="cumulative"
              orientation="right"
              hide
              domain={[0, (dataMax: number) => (dataMax === 0 ? 1 : dataMax * 1.1)]}
            />
            <Bar
              yAxisId="bars"
              dataKey="incoming"
              fill="var(--wt-demo-chart-bandwidth-incoming)"
              animationDuration={400}
              stackId="a"
              shape={<TopBar />}
            />
            <Bar
              yAxisId="bars"
              dataKey="outgoing"
              fill="var(--wt-demo-chart-bandwidth-outgoing)"
              animationDuration={400}
              stackId="a"
              shape={<BottomBar />}
            />
            <Line
              yAxisId="cumulative"
              dot={false}
              dataKey="totalCumulative"
              type="monotone"
              stroke="var(--wt-demo-chart-bandwidth-cumulative)"
              strokeWidth={2}
              animationDuration={400}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </WtCard>
  );
}
