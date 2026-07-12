import { Flag } from "lucide-react";

interface UcAlertProps {
  title: string;
  body: string;
  dismissLabel: string;
}

/* Visual clone of Undercurrent's Alert. The real component wraps MUI's
   Alert and uses MUI's `severity` prop (info/success/warning/error), where
   info→highlight and error→danger under the hood — an artifact of MUI's
   own Alert props contract. This clone has no MUI dependency and re-themes
   entirely through --uc-demo-active-*, same as every sibling component, so
   there's no severity prop here — the active color variant IS the color,
   with no extra name-mapping layer to reproduce. */
export default function UcAlert({ title, body, dismissLabel }: UcAlertProps) {
  return (
    <div
      className="flex w-full items-start gap-[var(--uc-demo-space-100)] rounded-[var(--uc-demo-radius-md)] border p-[var(--uc-demo-space-200)]"
      style={{
        backgroundColor: "var(--uc-demo-neutral-bg-main)",
        borderColor: "var(--uc-demo-active-border-medium)",
      }}
    >
      <Flag
        size={24}
        className="shrink-0 pt-2"
        style={{ color: "var(--uc-demo-active-icon-main)" }}
      />
      <div className="flex flex-1 flex-col items-stretch gap-[var(--uc-demo-space-200)] sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-1 flex-col gap-0">
          <span
            className="font-medium"
            style={{ color: "var(--uc-demo-neutral-text-main)" }}
          >
            {title}
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--uc-demo-neutral-text-main)" }}
          >
            {body}
          </span>
        </div>
        <div className="flex items-stretch gap-[var(--uc-demo-space-100)]">
          <button
            type="button"
            className="inline-flex h-[var(--uc-demo-size-lg)] w-full items-center justify-center rounded-[var(--uc-demo-radius-full)] px-[var(--uc-demo-space-150)] text-sm font-medium sm:w-auto"
            style={{
              backgroundColor: "var(--uc-demo-neutral-bg-weak)",
              color: "var(--uc-demo-neutral-text-main)",
            }}
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
