import type { ComponentType, SVGProps } from "react";
import { Bell as BellDotIcon } from "pixelarticons/react/Bell";
import { Waves2 as SurfboardIcon } from "pixelarticons/react/Waves2";
import { SettingsCog as DashboardSquare01Icon } from "pixelarticons/react/SettingsCog";
import { Settings2 as Settings02Icon } from "pixelarticons/react/Settings2";
import { Map as CompassIcon } from "pixelarticons/react/Map";
import { Key as KeyIcon } from "pixelarticons/react/Key";
import { CastleTower as CastleTowerIcon } from "pixelarticons/react/CastleTower";

// Maps each project entry's `icon` string (from its MDX frontmatter) to the
// actual imported pixelarticons component — content collections can't hold a
// JS/component reference, only plain data. Shared by the home page's Work
// list and each project's case-study page.
export const projectIconMap: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  BellDotIcon,
  SurfboardIcon,
  DashboardSquare01Icon,
  Settings02Icon,
  CompassIcon,
  KeyIcon,
  CastleTowerIcon,
};
