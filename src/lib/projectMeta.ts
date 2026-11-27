// projectMeta.ts — small helpers shared by the pages that show a project's
// "meta" details (the Projects preview and the case-study Overview).
import type { ComponentType, SVGProps } from "react";
import { Reload } from "pixelarticons/react/Reload";
import { PencilRuler } from "pixelarticons/react/PencilRuler";

// Role and scope are stored as comma-separated lists; Figma shows them with
// " / " between items ("PRODUCT FRAMING / UX STRATEGY / ...").
export function slashList(value: string): string {
  return value.split(/,\s*/).join(" / ");
}

// The icon shown inside a project's "Type" chip. Types without an entry here
// fall back to the redesign (refresh) icon.
const typeIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Redesign: Reload,
  "Design system": PencilRuler,
};

export function typeIcon(type: string): ComponentType<SVGProps<SVGSVGElement>> {
  return typeIcons[type] ?? Reload;
}
