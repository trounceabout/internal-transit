import "@/styles/watchtower-demo.css";
import BandwidthCard from "./BandwidthCard";
import CpuUtilizationCard from "./CpuUtilizationCard";
import DiskSpaceCard from "./DiskSpaceCard";
import NetworkSpeedCard from "./NetworkSpeedCard";
import RamUsageCard from "./RamUsageCard";

export default function WatchtowerModulesSandbox() {
  return (
    <div
      className="wt-demo mt-10"
    >
      <div className="grid grid-cols-1 gap-[var(--wt-demo-space-200)] sm:grid-cols-2 lg:grid-cols-6">
        <div className="h-50 lg:col-span-2">
          <CpuUtilizationCard />
        </div>
        <div className="h-50 lg:col-span-2">
          <RamUsageCard />
        </div>
        <div className="h-50 lg:col-span-2">
          <DiskSpaceCard />
        </div>
        <div className="h-71.25 sm:col-span-2 lg:col-span-3">
          <BandwidthCard />
        </div>
        <div className="h-71.25 sm:col-span-2 lg:col-span-3">
          <NetworkSpeedCard />
        </div>
      </div>
    </div>
  );
}
