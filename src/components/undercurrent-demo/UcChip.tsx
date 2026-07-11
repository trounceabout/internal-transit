interface UcChipProps {
  children: React.ReactNode;
}

/* Visual clone of Undercurrent's Chip. The real component has a "Regular"
   size only used in this demo (it also supports a smaller size, not needed
   here). Colors come from --uc-demo-active-*, same pattern as UcButton. */
export default function UcChip({ children }: UcChipProps) {
  return (
    <span
      className="inline-flex h-[var(--uc-demo-size-md)] shrink-0 items-center justify-center gap-[var(--uc-demo-space-100)] rounded-[var(--uc-demo-radius-sm)] border px-[var(--uc-demo-space-100)] py-[var(--uc-demo-space-100)] text-base whitespace-nowrap"
      style={{
        backgroundColor: 'var(--uc-demo-active-bg-main)',
        borderColor: 'var(--uc-demo-active-border-weak)',
        color: 'var(--uc-demo-active-text-main)',
      }}
    >
      {children}
    </span>
  );
}
