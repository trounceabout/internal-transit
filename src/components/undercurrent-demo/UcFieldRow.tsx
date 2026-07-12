import type { ComponentType } from "react";

interface UcField {
  icon: ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  value: string;
}

interface UcFieldRowProps {
  fields: UcField[];
}

/* A labeled field row (Time/Level/Server/Category, etc.) — new bespoke
   component, no analog in the real Undercurrent design system's Figma
   reference for this case study's demo. One component instance serves all
   fields since each just needs its own icon/label/value triple. */
export default function UcFieldRow({ fields }: UcFieldRowProps) {
  return (
    <div className="flex flex-wrap gap-[var(--uc-demo-space-200)]">
      {fields.map((field) => {
        const Icon = field.icon;
        return (
          <div key={field.label} className="flex min-w-0 flex-col gap-1">
            <span
              className="text-xs"
              style={{ color: "var(--uc-demo-neutral-text-weak)" }}
            >
              {field.label}
            </span>
            <div className="flex items-center gap-1.5">
              <Icon
                size={16}
                className="shrink-0"
                style={{ color: "var(--uc-demo-neutral-text-weak)" }}
              />
              <span
                className="truncate text-sm"
                style={{ color: "var(--uc-demo-neutral-text-main)" }}
              >
                {field.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
