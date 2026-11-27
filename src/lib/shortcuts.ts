// shortcuts.ts — one global keyboard listener for the whole site.
//
// Instead of each page registering its own key handlers, buttons declare
// their key with a `data-shortcut` attribute (see ActionButton.astro). When
// a key is pressed we look for a matching element on the *current* page and
// click it. Because it looks at the live DOM on every keypress, it keeps
// working across client-side navigations with no re-binding.

// Maps KeyboardEvent.key (lowercased) to the data-shortcut value.
const KEY_ALIASES: Record<string, string> = {
  escape: "esc",
};

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  );
}

function isInteractiveTarget(el: EventTarget | null): boolean {
  return (
    el instanceof HTMLElement && (el.tagName === "A" || el.tagName === "BUTTON")
  );
}

export function initShortcuts() {
  // Module scripts only run once per full page load, but guard anyway so a
  // second import can never stack two listeners (which would double-click).
  const w = window as unknown as { __shortcutsBound?: boolean };
  if (w.__shortcutsBound) return;
  w.__shortcutsBound = true;

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.repeat) return;
    // Leave browser/OS shortcuts (Cmd+W, Ctrl+X ...) alone.
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingTarget(event.target)) return;
    // While a modal dialog (e.g. the lightbox) is open, keys belong to it:
    // Esc should close the dialog, not trigger the page's "Back" action.
    if (document.querySelector('[aria-modal="true"][aria-hidden="false"]')) {
      return;
    }

    const raw = event.key.toLowerCase();
    const key = KEY_ALIASES[raw] ?? raw;

    // A focused link/button already "clicks" itself on Enter, so firing our
    // handler too would trigger the action twice.
    if (key === "enter" && isInteractiveTarget(event.target)) return;

    const target = document.querySelector<HTMLElement>(
      `[data-shortcut="${CSS.escape(key)}"]`,
    );
    if (!target) return;

    event.preventDefault();
    target.click();
  });
}
