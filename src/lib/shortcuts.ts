// shortcuts.ts — one global keyboard listener for the whole site.
//
// Instead of each page registering its own key handlers, buttons declare
// their key with a `data-shortcut` attribute (see ActionButton.astro). When
// a key is pressed we look for a matching element on the *current* page and
// click it. Because it looks at the live DOM on every keypress, it keeps
// working across client-side navigations with no re-binding.
//
// The same file also moves focus between the page's action buttons (arrow keys,
// mouse hover, and focusing the page's first button on load). The focused
// button is the filled one — see ActionButton.astro.

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

// Which way each arrow key moves through the buttons. Down and Right both go
// forward and Up and Left both go back, so the Overview's vertical menu and the
// horizontal bottom bar behave as one list.
const ARROW_STEP: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
};

function modalIsOpen(): boolean {
  return (
    document.querySelector('[aria-modal="true"][aria-hidden="false"]') !== null
  );
}

// On a case study the action buttons only drive the page while the Overview is
// showing; past it the page is for reading, so arrow keys scroll and a leftover
// focused button is left alone.
function actionFocusIsLive(): boolean {
  const { page, section } = document.body.dataset;
  return !(page === "case-study" && section !== "overview");
}

// Every action button the visitor can currently see and reach, in page order
// (the Overview menu first, then the bottom bar).
function visibleActionButtons(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(".action-button")].filter(
    (el) =>
      !el.closest("[hidden]") && getComputedStyle(el).visibility !== "hidden",
  );
}

// Focus the page's `autofocus` button so it starts out filled. Skipped if
// something else already has focus, or the button is scrolled out of view (a
// reload partway down a case study), where a hidden focus would just swallow
// the arrow keys.
function focusDefaultAction() {
  const active = document.activeElement;
  if (active && active !== document.body) return;
  const target = visibleActionButtons().find((el) =>
    el.hasAttribute("data-autofocus"),
  );
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
  target.focus({ preventScroll: true });
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
    if (modalIsOpen()) return;

    const raw = event.key.toLowerCase();
    const key = KEY_ALIASES[raw] ?? raw;

    // A focused link/button already "clicks" itself on Enter, so firing our
    // handler too would trigger the action twice.
    if (key === "enter" && isInteractiveTarget(event.target)) return;

    // Several buttons can share a key across a page's different states (e.g.
    // case-study actions that swap per section), so take the first one that
    // isn't hidden.
    const target = [
      ...document.querySelectorAll<HTMLElement>(
        `[data-shortcut="${CSS.escape(key)}"]`,
      ),
    ].find((el) => !el.closest("[hidden]"));
    if (!target) return;

    event.preventDefault();
    target.click();
  });

  // Arrow keys move the focus (and so the filled look) between action buttons,
  // but only once a button already has focus, so they scroll the page as usual
  // otherwise. On a case study they're also left alone past the Overview, where
  // the page is for reading and a focused button is just a leftover.
  document.addEventListener("keydown", (event) => {
    const step = ARROW_STEP[event.key];
    if (!step) return;
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
      return;
    if (isTypingTarget(event.target) || modalIsOpen()) return;
    if (!actionFocusIsLive()) return;

    const current = (
      document.activeElement as HTMLElement | null
    )?.closest<HTMLElement>(".action-button");
    if (!current) return;
    const buttons = visibleActionButtons();
    const index = buttons.indexOf(current);
    if (index < 0) return;

    // Stop at the ends rather than wrapping, but still swallow the key so the
    // page doesn't scroll while you're in the list.
    event.preventDefault();
    buttons[Math.min(Math.max(index + step, 0), buttons.length - 1)].focus();
  });

  // Hovering a button focuses it, so the filled look follows the mouse and only
  // one button is ever filled. (Mouse only: touch has no hover.)
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const button = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      ".action-button",
    );
    if (!button || button === document.activeElement) return;
    if (button.closest("[hidden]")) return;
    button.focus({ preventScroll: true });
  });

  // The filled look is the focus state, so clicking blank space (which would
  // drop focus to the page body) must not un-fill the button. Take the focus
  // straight back, unless it moved to something else or the window itself lost
  // focus (switching tabs or apps).
  document.addEventListener("focusout", (event) => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      ".action-button",
    );
    if (!button || event.relatedTarget || !actionFocusIsLive()) return;
    setTimeout(() => {
      if (!document.hasFocus() || !button.isConnected) return;
      if (document.activeElement && document.activeElement !== document.body) {
        return;
      }
      button.focus({ preventScroll: true });
    }, 0);
  });

  // Runs on first load and after every client-side navigation.
  document.addEventListener("astro:page-load", focusDefaultAction);
}
