import { Info } from "lucide-react";

interface UcNoteProps {
  children: React.ReactNode;
}

/* Visual clone of Undercurrent's Note (the "default" variant — bordered,
   transparent background). Uses lucide-react's Info icon, matching the
   real component's Figma reference. */
export default function UcNote({ children }: UcNoteProps) {
  return (
    <div
      className="flex w-full items-center gap-[var(--uc-demo-space-150)] rounded-[var(--uc-demo-radius-sm)] border px-[var(--uc-demo-space-200)] py-[var(--uc-demo-space-100)]"
      style={{ borderColor: "var(--uc-demo-active-border-weak)" }}
    >
      <Info
        size={16}
        className="shrink-0"
        style={{ color: "var(--uc-demo-neutral-text-main)" }}
      />
      <span
        className="text-sm leading-6"
        style={{ color: "var(--uc-demo-neutral-text-main)" }}
      >
        {children}
      </span>
    </div>
  );
}
