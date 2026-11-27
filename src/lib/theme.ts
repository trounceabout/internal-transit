// theme.ts — theme switching shared by the top nav's sun/moon button.
//
// Theme is the `dark` class on <html>, persisted in localStorage. The initial
// value is applied by the inline script in BaseLayout (before first paint, to
// avoid a flash); this module only handles *toggling*.
import { prefersReducedMotion } from "@/lib/animations";

function applyToggle() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function toggleTheme() {
  // The View Transitions API snapshots the page before and after the
  // callback runs, so the .dark toggle inside it happens instantly and the
  // browser animates between the two snapshots. The data attribute tells
  // global.css which sweep-direction keyframes to play.
  const goingDark = !document.documentElement.classList.contains("dark");
  document.documentElement.dataset.themeSweepDirection = goingDark
    ? "dark"
    : "light";

  if (!document.startViewTransition || prefersReducedMotion()) {
    applyToggle();
    return;
  }
  document.startViewTransition(() => applyToggle());
}
