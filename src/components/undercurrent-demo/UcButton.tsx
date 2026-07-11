interface UcButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

/* Visual clone of Undercurrent's Button (primary/secondary variants only —
   the real component also has link/ghost, not needed for this demo). Colors
   come entirely from the --uc-demo-active-* custom properties set by the
   sandbox root, so swapping the color swatch re-themes every button at once
   with no props or JS logic here. */
export default function UcButton({ children, variant = 'primary' }: UcButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="button"
      className="inline-flex h-[var(--uc-demo-size-lg)] flex-1 items-center justify-center gap-[var(--uc-demo-space-100)] rounded-[var(--uc-demo-radius-full)] px-[var(--uc-demo-space-200)] py-[var(--uc-demo-space-100)] font-medium text-sm"
      style={{
        backgroundColor: isPrimary
          ? 'var(--uc-demo-active-bg-strong)'
          : 'var(--uc-demo-active-bg-main)',
        color: isPrimary
          ? 'var(--uc-demo-active-text-weak)'
          : 'var(--uc-demo-active-text-main)',
      }}
    >
      {children}
    </button>
  );
}
