import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Section card grouping rows in the settings/profile architecture */
export function GlassSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass rounded-3xl p-5 sm:p-6", className)}>
      <header className="mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
        </div>
        {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
      </header>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

/* A tappable settings row: icon, title, description, optional right control, chevron */
export function GlassRow({
  icon: Icon,
  title,
  description,
  onClick,
  right,
  chevron = false,
  danger = false,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  onClick?: () => void;
  right?: ReactNode;
  chevron?: boolean;
  danger?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className={cn("glass-row", onClick && "cursor-pointer")}>
      {Icon && (
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
            danger ? "bg-destructive/15 text-destructive" : "bg-primary/12 text-primary",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-medium", danger && "text-destructive")}>{title}</span>
        {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
      </span>
      {right}
      {chevron && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </Comp>
  );
}

/* Animated glass toggle switch with label */
export function GlassToggle({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="glass-row">
      {icon && (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          {(() => {
            const Icon = icon;
            return <Icon className="h-4 w-4" />;
          })()}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 press",
          checked
            ? "border-primary/50 bg-primary/80 shadow-glow"
            : "border-glass-border bg-muted/60",
          disabled && "opacity-50",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={cn(
            "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-md",
            checked ? "right-1" : "left-1",
          )}
        />
      </button>
    </div>
  );
}

/* Liquid glass statistic card */
export function GlassStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="glass lift rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold leading-tight">{value}</p>
          {hint && <p className="truncate text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

/* Segmented control (used for Appearance picker) */
export function GlassSegmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="glass-soft flex rounded-2xl p-1" role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors press sm:text-sm",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="segmented-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-primary shadow-glow"
              />
            )}
            {Icon && <Icon className="relative z-10 h-4 w-4" />}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
