import { animate, stagger } from "motion";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function runFadeUpStagger(selector = "[data-animate]") {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => {
      el.style.opacity = "1";
    });
    return;
  }

  animate(
    elements,
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.5, delay: stagger(0.06), ease: [0.22, 1, 0.36, 1] },
  );
}
