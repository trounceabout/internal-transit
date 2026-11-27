// caseStudy.ts — behavior for the case-study page: keeping the side nav and the
// bottom-nav actions in sync with whichever section the reader is in, and the
// Overview's entrance animation.
//
// The page is one long scroll made of full-screen sections (#overview,
// #deep-dive, #walkthrough, #gallery) that CSS scroll-snap aligns to. Nothing
// here controls the scrolling itself — it only *observes* it.
import { animate, stagger } from "motion";
import { prefersReducedMotion } from "@/lib/animations";

// Everything we attach to window/document is removed through this controller
// when the reader navigates away, so listeners never pile up across
// client-side navigations.
let controller: AbortController | null = null;

export function initCaseStudy() {
  controller?.abort();
  controller = null;

  const root = document.querySelector<HTMLElement>("[data-case-study]");
  if (!root) return;

  controller = new AbortController();
  const { signal } = controller;

  const sections = [...root.querySelectorAll<HTMLElement>("[data-section]")];
  const subItems = [...root.querySelectorAll<HTMLElement>("[data-sub]")];
  const subnav = document.querySelector<HTMLElement>("[data-subnav]");
  // Top-level links appear twice: in the desktop side nav and in the mobile
  // chip bar (only one is visible at a time). Keep both in sync.
  const sectionLinks = [
    ...document.querySelectorAll<HTMLElement>(
      "[data-subnav] [data-section-link], [data-subnav-mobile] [data-section-link]",
    ),
  ];
  const subLinks = subnav
    ? [...subnav.querySelectorAll<HTMLElement>("[data-sub-link]")]
    : [];
  const bottomActions = [
    ...document.querySelectorAll<HTMLElement>(".bottom-nav [data-sections]"),
  ];

  let activeSection = "";
  let activeSub = "";

  function setActiveSection(id: string) {
    if (id === activeSection) return;
    activeSection = id;
    if (subnav) subnav.dataset.activeSection = id;
    sectionLinks.forEach((link) => {
      const isCurrent = link.dataset.sectionLink === id;
      link.setAttribute("aria-current", String(isCurrent));
      // In the mobile chip bar, slide the row so the current chip stays in
      // view (scrolling the bar itself, never the page).
      const bar = link.closest<HTMLElement>("[data-subnav-mobile]");
      if (isCurrent && bar) {
        bar.scrollTo({
          left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2,
          behavior: "smooth",
        });
      }
    });
    // Bottom-nav actions that only apply to certain sections.
    bottomActions.forEach((el) => {
      const allowed = (el.dataset.sections ?? "").split(" ");
      el.hidden = !allowed.includes(id);
    });
    // Sub-items only make sense inside the deep dive.
    if (id !== "deep-dive") setActiveSub("");
  }

  function setActiveSub(id: string) {
    if (id === activeSub) return;
    activeSub = id;
    subLinks.forEach((link) => {
      link.setAttribute("aria-current", String(link.dataset.subLink === id));
    });
  }

  // The "current" section is the one covering a line about 40% down the
  // viewport; the current sub-item is the last one whose top has passed it.
  function update() {
    const line = window.innerHeight * 0.4;

    const current =
      sections.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      }) ?? sections[0];
    if (current) setActiveSection(current.dataset.section ?? "");

    if (activeSection === "deep-dive") {
      let found = subItems[0]?.dataset.sub ?? "";
      for (const el of subItems) {
        if (el.getBoundingClientRect().top <= line)
          found = el.dataset.sub ?? "";
      }
      setActiveSub(found);
    }
  }

  // Scroll events can fire many times per frame; coalesce into one update.
  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", onScroll, { passive: true, signal });
  update();

  playOverviewEntrance(root);
}

// ─── Overview entrance ─────────────────────────────────────────────────────
// Basic first pass: the icon tile springs in, the headline's words rise and
// de-blur one after another, then the description and facts fade up.
function playOverviewEntrance(root: HTMLElement) {
  const q = (name: string) => [
    ...root.querySelectorAll<HTMLElement>(`[data-ov="${name}"]`),
  ];
  const tile = q("tile");
  const name = q("name");
  const words = q("word");
  const rest = [...q("desc"), ...q("meta")];

  const all = [...tile, ...name, ...words, ...rest];
  if (all.length === 0) return;

  if (prefersReducedMotion()) {
    all.forEach((el) => {
      el.style.opacity = "1";
    });
    return;
  }

  animate(
    tile,
    { opacity: [0, 1], scale: [0.7, 1] },
    { type: "spring", stiffness: 260, damping: 18 },
  );
  animate(
    name,
    { opacity: [0, 1], x: [-12, 0] },
    { duration: 0.5, delay: 0.15 },
  );
  animate(
    words,
    { opacity: [0, 1], y: [28, 0], filter: ["blur(8px)", "blur(0px)"] },
    {
      duration: 0.7,
      delay: stagger(0.07, { startDelay: 0.25 }),
      ease: [0.22, 1, 0.36, 1],
    },
  );
  animate(
    rest,
    { opacity: [0, 1], y: [16, 0] },
    {
      duration: 0.6,
      delay: stagger(0.1, { startDelay: 0.25 + words.length * 0.07 }),
      ease: [0.22, 1, 0.36, 1],
    },
  );
}
