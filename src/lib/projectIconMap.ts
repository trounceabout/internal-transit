import type { IconSvgElement } from "@hugeicons/react";
import {
  BellDotIcon,
  SurfboardIcon,
  DashboardSquare01Icon,
  Settings02Icon,
  CompassIcon,
} from "@hugeicons/core-free-icons";

// Maps each project entry's `icon` string (from its MDX frontmatter) to the
// actual imported HugeIcons component — content collections can't hold a
// JS/component reference, only plain data. Shared by the home page's Work
// list and each project's case-study page.
export const projectIconMap: Record<string, IconSvgElement> = {
  BellDotIcon,
  SurfboardIcon,
  DashboardSquare01Icon,
  Settings02Icon,
  CompassIcon,
};
