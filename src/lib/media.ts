// Shared "media frame" box-shadow recipe — rounded-corner screenshots, loop
// videos, and the Loom embed box all use this exact shadow so every piece of
// inline media in a case study reads as one visual family. Points at the
// theme-aware --media-frame-shadow custom property (global.css :root/.dark)
// rather than a literal value, so it swaps automatically when the reader
// toggles light/dark — a hardcoded string here would be frozen at render
// time and couldn't react to the client-side theme toggle in Footer.astro.
export const MEDIA_FRAME_SHADOW = "var(--media-frame-shadow)";
