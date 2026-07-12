import MeasureBar from "./MeasureBar";
import StatHighlight from "./StatHighlight";
import WtCard from "./WtCard";
import { diskSpace } from "./mockData";

const CRITICAL_THRESHOLD = 90;

export default function DiskSpaceCard() {
  const {
    usedGB,
    totalGB,
    percentUsed,
    growthGBPerDay,
    projectedFullDate,
    projectedDaysLeft,
  } = diskSpace;

  const isCritical = percentUsed >= CRITICAL_THRESHOLD;

  return (
    <WtCard
      title="Disk space"
      footerBgColor={isCritical ? "var(--wt-demo-danger-bg-strong)" : undefined}
      footer={
        <span className="text-sm leading-none">
          <span
            className="font-semibold"
            style={{
              color: isCritical ? "#ffffff" : "var(--wt-demo-neutral-text-weak)",
            }}
          >
            Full by {projectedFullDate}
          </span>
          <span style={{ color: isCritical ? "#ffffffcc" : "var(--wt-demo-neutral-text-weak)" }}>
            {" "}
            &middot; {projectedDaysLeft} days left
          </span>
        </span>
      }
    >
      <div className="flex flex-1 flex-col justify-between gap-[var(--wt-demo-space-150)] p-[var(--wt-demo-space-200)]">
        <StatHighlight
          value={`${percentUsed}%`}
          valueColor={isCritical ? "var(--wt-demo-danger-text)" : undefined}
          unit={`${usedGB}/${totalGB} GB`}
          changeLabel={`+${growthGBPerDay.toFixed(1)} GB/day`}
          changeDirection="up"
        />
        <MeasureBar percentage={percentUsed} />
      </div>
    </WtCard>
  );
}
