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

// Triggers the "Approach" section's grid background (see
// .ping-section--approach::before in ProjectLayout.astro) once the section
// scrolls into view, by adding a .grid-active class the CSS keyframe
// (gridSequence, in global.css) is keyed off of.
export function observeGridReveal(selector = ".ping-section--approach") {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  if (elements.length === 0) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => {
      el.classList.add("grid-active");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("grid-active");
        // Fire once per page view — don't replay the fade if the reader
        // scrolls back past this section again.
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.2 },
  );

  elements.forEach((el) => observer.observe(el));
}
