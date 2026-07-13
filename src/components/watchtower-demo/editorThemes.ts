import type { ThemeRegistrationRaw } from "shiki";

/**
 * Shiki themes translated from ~/.config/zed/themes/linear-dark.json's
 * `syntax` block — Zed's theme JSON isn't TextMate-compatible, so each
 * token role is manually mapped to the TextMate scope(s) Shiki's TSX
 * grammar actually emits. Only the `syntax` (token color) values are
 * translated here; editor chrome (background, gutter, line numbers, wrap
 * guides) lives in watchtower-demo-editor.css instead, since Shiki only
 * needs to own token foreground colors — this component renders its own
 * line numbers/guides rather than using Shiki's HTML output wholesale.
 */
export const linearDarkTheme: ThemeRegistrationRaw = {
  name: "linear-dark",
  type: "dark",
  fg: "#c1c3c8",
  bg: "#1f2023",
  settings: [
    {
      scope: ["comment", "comment.line", "comment.block"],
      settings: { foreground: "#8b8e98", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
      ],
      settings: { foreground: "#7e89ec", fontStyle: "italic" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "#5da6b8" },
    },
    {
      scope: ["entity.name.tag", "support.class.component"],
      settings: { foreground: "#83acf8" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#1abdda" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "#a2d484" },
    },
    {
      scope: ["entity.name.type", "support.type", "entity.other.inherited-class"],
      settings: { foreground: "#88e6d6", fontStyle: "italic" },
    },
    {
      scope: ["entity.other.attribute-name", "entity.other.attribute-name.jsx"],
      settings: { foreground: "#cba0ff", fontStyle: "italic" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.language.boolean"],
      settings: { foreground: "#ffbf71" },
    },
    {
      scope: ["variable", "variable.other.readwrite", "variable.parameter"],
      settings: { foreground: "#e1e2e5" },
    },
    {
      scope: [
        "variable.other.property",
        "meta.object-literal.key",
        "support.type.property-name",
      ],
      settings: { foreground: "#f3b7e9" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition",
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
      ],
      settings: { foreground: "#5da6b8" },
    },
  ],
};

/**
 * Derived light companion — no linear-light.json exists to translate
 * directly, so these values are hand-recalibrated from linear-dark's hues
 * for contrast against a light background (same approach
 * watchtower-demo.css already uses to derive its own light overrides from
 * its dark block). Each color keeps the dark theme's hue/role but is
 * darkened enough to clear ~4.5:1 contrast against a near-white editor
 * background, matching this codebase's existing WCAG-aware token practice
 * (see global.css's --portfolio-muted rationale).
 */
export const linearLightTheme: ThemeRegistrationRaw = {
  name: "linear-light",
  type: "light",
  fg: "#282a30",
  bg: "#ffffff",
  settings: [
    {
      scope: ["comment", "comment.line", "comment.block"],
      settings: { foreground: "#6b6f76", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
      ],
      settings: { foreground: "#5459c9", fontStyle: "italic" },
    },
    {
      scope: ["keyword.operator"],
      settings: { foreground: "#2b7186" },
    },
    {
      scope: ["entity.name.tag", "support.class.component"],
      settings: { foreground: "#2f6fd6" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#0e8fa8" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "#3a7d3f" },
    },
    {
      scope: ["entity.name.type", "support.type", "entity.other.inherited-class"],
      settings: { foreground: "#1a8f80", fontStyle: "italic" },
    },
    {
      scope: ["entity.other.attribute-name", "entity.other.attribute-name.jsx"],
      settings: { foreground: "#8452c9", fontStyle: "italic" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.language.boolean"],
      settings: { foreground: "#b5690a" },
    },
    {
      scope: ["variable", "variable.other.readwrite", "variable.parameter"],
      settings: { foreground: "#282a30" },
    },
    {
      scope: [
        "variable.other.property",
        "meta.object-literal.key",
        "support.type.property-name",
      ],
      settings: { foreground: "#a83e94" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition",
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
      ],
      settings: { foreground: "#2b7186" },
    },
  ],
};
