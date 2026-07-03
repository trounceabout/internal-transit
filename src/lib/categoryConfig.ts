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
// hoverText must be a complete literal string so Tailwind includes it in the build.
// Shared by the blog index and the home page's Writing section.
export const categoryConfig: Record<
    string,
    { icon: IconSvgElement; text: string; hoverText: string }
> = {
    design: {
        icon: PencilRulerIcon,
        text: "text-indigo-700",
        hoverText: "group-hover:text-indigo-700",
    },
    philosophy: {
        icon: Brain02Icon,
        text: "text-purple-700",
        hoverText: "group-hover:text-purple-700",
    },
    craft: {
        icon: AnvilIcon,
        text: "text-orange-700",
        hoverText: "group-hover:text-orange-700",
    },
    creativity: {
        icon: IdeaIcon,
        text: "text-yellow-700",
        hoverText: "group-hover:text-yellow-700",
    },
    culture: {
        icon: MaskTheater02Icon,
        text: "text-teal-700",
        hoverText: "group-hover:text-teal-700",
    },
    games: {
        icon: Joystick03Icon,
        text: "text-green-700",
        hoverText: "group-hover:text-green-700",
    },
    art: {
        icon: BrushIcon,
        text: "text-fuchsia-700",
        hoverText: "group-hover:text-fuchsia-700",
    },
    outdoors: {
        icon: CampfireIcon,
        text: "text-amber-700",
        hoverText: "group-hover:text-amber-700",
    },
};
