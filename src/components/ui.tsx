import type { ButtonHTMLAttributes, ReactNode } from "react"
import type { Priority, Status } from "../lib/data"
import { initials, priorityTone, statusTone } from "../lib/status"

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ")
}

/* -------------------------------------------------------------- Button */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  block?: boolean
}

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_6px_16px_-8px_rgba(249,115,22,0.9)] hover:bg-brand-bright active:translate-y-px",
  secondary:
    "bg-elevated text-ink border border-line-strong hover:border-ink-faint hover:bg-elevated/80 active:translate-y-px",
  ghost: "text-ink-muted hover:text-ink hover:bg-white/[0.04]",
  success: "bg-ok text-sunken hover:brightness-110 active:translate-y-px",
}

const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-7 gap-1.5 px-2.5 text-xs",
  md: "h-9 gap-2 px-3.5 text-[0.8125rem]",
  lg: "h-11 gap-2 px-4 text-sm",
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  block,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-all duration-150",
        "disabled:pointer-events-none disabled:opacity-40",
        buttonVariants[variant],
        buttonSizes[size],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

/* ---------------------------------------------------------------- Card */

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return <section className={cx("card", className)}>{children}</section>
}

export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cx(
        "flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-[0.8125rem] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

/* --------------------------------------------------------------- Badge */

export function Badge({
  className,
  children,
  dot,
}: {
  className?: string
  children: ReactNode
  dot?: string
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.6875rem] leading-5 font-medium whitespace-nowrap",
        className,
      )}
    >
      {dot ? (
        <span className={cx("size-1.5 shrink-0 rounded-full", dot)} />
      ) : null}
      {children}
    </span>
  )
}

export function StatusBadge({
  status,
  live = false,
}: {
  status: Status
  live?: boolean
}) {
  const tone = statusTone[status]
  return (
    <Badge className={tone.badge}>
      <span
        className={cx(
          "size-1.5 shrink-0 rounded-full",
          tone.dot,
          live && status === "En cours" && "live-dot",
        )}
      />
      {status}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      className={cx(
        "font-mono text-[0.625rem] tracking-wide uppercase",
        priorityTone[priority],
      )}
    >
      {priority}
    </Badge>
  )
}

/* -------------------------------------------------------------- Avatar */

export function Avatar({
  name,
  size = 28,
  accent = false,
}: {
  name: string
  size?: number
  accent?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-semibold tracking-tight select-none",
        accent
          ? "border-brand/40 bg-brand/15 text-brand-bright"
          : "border-line-strong bg-elevated text-ink-soft",
      )}
    >
      {initials(name)}
    </span>
  )
}

/* --------------------------------------------------------------- Meter */

export function Meter({
  value,
  tone = "var(--color-ok)",
  className,
  height = 4,
}: {
  value: number
  tone?: string
  className?: string
  height?: number
}) {
  return (
    <div
      className={cx(
        "w-full overflow-hidden rounded-full bg-white/[0.06]",
        className,
      )}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: tone,
        }}
      />
    </div>
  )
}

/* ---------------------------------------------------------- PageHeader */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h1 className="text-[1.375rem] leading-tight font-bold tracking-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-[0.8125rem] text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

/* --------------------------------------------------------- FilterChips */

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  counts,
  label,
}: {
  options: readonly T[]
  value: T
  onChange: (next: T) => void
  counts?: Partial<Record<T, number>>
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-1"
    >
      {options.map((option) => {
        const active = option === value
        const count = counts?.[option]
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cx(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors duration-150",
              active
                ? "bg-elevated text-ink ring-1 ring-line-strong ring-inset"
                : "text-ink-muted hover:bg-white/[0.04] hover:text-ink-soft",
            )}
          >
            {option}
            {count !== undefined ? (
              <span
                className={cx(
                  "num font-mono text-[0.625rem]",
                  active ? "text-ink-muted" : "text-ink-faint",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------------------------------------- SearchInput */

export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  icon,
  className,
  id,
  label,
}: {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  icon: ReactNode
  className?: string
  id: string
  label: string
}) {
  return (
    <div className={cx("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-faint">
        {icon}
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field h-9 pl-8"
      />
    </div>
  )
}

/* ---------------------------------------------------------- EmptyState */

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <span className="mb-1 flex size-10 items-center justify-center rounded-full border border-line bg-elevated text-ink-faint">
        {icon}
      </span>
      <p className="text-[0.8125rem] font-semibold text-ink-soft">{title}</p>
      <p className="max-w-xs text-xs text-ink-muted">{description}</p>
    </div>
  )
}
