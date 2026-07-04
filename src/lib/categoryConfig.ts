import type { IconSvgElement } from "@hugeicons/react";
import {
  AnvilIcon,
  Brain02Icon,
  PencilRulerIcon,
  IdeaIcon,
  MaskTheater02Icon,
  Joystick03Icon,
  BrushIcon,
  CampfireIcon,
} from "@hugeicons/core-free-icons";

// Maps each category tag to a HugeIcon and Tailwind color classes.
// hoverText and bg must be complete literal strings so Tailwind includes them in the build.
// Shared by the blog index, the home page's Writing section, and the article template
// (which also reuses `text` for its headline's category-colored accent word).
export const categoryConfig: Record<
  string,
  { icon: IconSvgElement; text: string; hoverText: string; bg: string }
> = {
  design: {
    icon: PencilRulerIcon,
    text: "text-indigo-500",
    hoverText: "group-hover:text-indigo-700",
    bg: "bg-indigo-500/15",
  },
  philosophy: {
    icon: Brain02Icon,
    text: "text-purple-500",
    hoverText: "group-hover:text-purple-700",
    bg: "bg-purple-500/15",
  },
  craft: {
    icon: AnvilIcon,
    text: "text-orange-500",
    hoverText: "group-hover:text-orange-700",
    bg: "bg-orange-500/15",
  },
  creativity: {
    icon: IdeaIcon,
    text: "text-yellow-700",
    hoverText: "group-hover:text-yellow-700",
    bg: "bg-yellow-700/15",
  },
  culture: {
    icon: MaskTheater02Icon,
    text: "text-teal-500",
    hoverText: "group-hover:text-teal-700",
    bg: "bg-teal-500/15",
  },
  games: {
    icon: Joystick03Icon,
    text: "text-green-500",
    hoverText: "group-hover:text-green-700",
    bg: "bg-green-500/15",
  },
  art: {
    icon: BrushIcon,
    text: "text-fuchsia-500",
    hoverText: "group-hover:text-fuchsia-700",
    bg: "bg-fuchsia-500/15",
  },
  outdoors: {
    icon: CampfireIcon,
    text: "text-amber-500",
    hoverText: "group-hover:text-amber-700",
    bg: "bg-amber-500/15",
  },
};
