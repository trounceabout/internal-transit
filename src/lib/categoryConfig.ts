import type { ComponentType, SVGProps } from "react";
import { Anvil as AnvilIcon } from "pixelarticons/react/Anvil";
import { Meditation as Brain02Icon } from "pixelarticons/react/Meditation";
import { RulerDimension as PencilRulerIcon } from "pixelarticons/react/RulerDimension";
import { Lightbulb as IdeaIcon } from "pixelarticons/react/Lightbulb";
import { MasksTheater as MaskTheater02Icon } from "pixelarticons/react/MasksTheater";
import { Joystick as Joystick03Icon } from "pixelarticons/react/Joystick";
import { Brush as BrushIcon } from "pixelarticons/react/Brush";
import { Campfire as CampfireIcon } from "pixelarticons/react/Campfire";

// Maps each category tag to a pixelarticons icon and color classes.
// text/hoverText use the portfolio-category-* tokens (global.css) — light/dark
// pairs validated against WCAG AA, replacing the raw Tailwind palette classes
// this used to hold (same shade in both themes, which failed contrast for
// all 8 categories in at least one theme). bg stays a literal Tailwind tint
// class since it's a decorative background, not text — no contrast concern.
// hoverText and bg must be complete literal strings so Tailwind includes them in the build.
// Shared by the blog index, the home page's Writing section, and the article template
// (which also reuses `text` for its headline's category-colored accent word).
export const categoryConfig: Record<
  string,
  {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    text: string;
    hoverText: string;
    bg: string;
  }
> = {
  design: {
    icon: PencilRulerIcon,
    text: "text-portfolio-category-design",
    hoverText: "group-hover:text-portfolio-category-design-hover",
    bg: "bg-indigo-500/15",
  },
  philosophy: {
    icon: Brain02Icon,
    text: "text-portfolio-category-philosophy",
    hoverText: "group-hover:text-portfolio-category-philosophy-hover",
    bg: "bg-purple-500/15",
  },
  craft: {
    icon: AnvilIcon,
    text: "text-portfolio-category-craft",
    hoverText: "group-hover:text-portfolio-category-craft-hover",
    bg: "bg-orange-500/15",
  },
  creativity: {
    icon: IdeaIcon,
    text: "text-portfolio-category-creativity",
    hoverText: "group-hover:text-portfolio-category-creativity-hover",
    bg: "bg-yellow-700/15",
  },
  culture: {
    icon: MaskTheater02Icon,
    text: "text-portfolio-category-culture",
    hoverText: "group-hover:text-portfolio-category-culture-hover",
    bg: "bg-teal-500/15",
  },
  games: {
    icon: Joystick03Icon,
    text: "text-portfolio-category-games",
    hoverText: "group-hover:text-portfolio-category-games-hover",
    bg: "bg-green-500/15",
  },
  art: {
    icon: BrushIcon,
    text: "text-portfolio-category-art",
    hoverText: "group-hover:text-portfolio-category-art-hover",
    bg: "bg-fuchsia-500/15",
  },
  outdoors: {
    icon: CampfireIcon,
    text: "text-portfolio-category-outdoors",
    hoverText: "group-hover:text-portfolio-category-outdoors-hover",
    bg: "bg-amber-500/15",
  },
};
