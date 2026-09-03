import { BellIcon, LogoMark } from "./icons"
import { Avatar, cx } from "./ui"

export type View = "manager" | "mobile"

type ViewOption = {
  id: View
  label: string
  short: string
}

const VIEWS: ViewOption[] = [
  { id: "manager", label: "Manager", short: "Manager" },
  { id: "mobile", label: "Mobile Technicien", short: "Mobile" },
]

type Profile = {
  name: string
  role: string
}

const PROFILES: Record<View, Profile> = {
  manager: { name: "Sophie Martin", role: "Responsable planification" },
  mobile: { name: "Alexandre Moreau", role: "Technicien terrain" },
}

export default function TopBar({
  view,
  onViewChange,
}: {
  view: View
  onViewChange: (next: View) => void
}) {
  const profile = PROFILES[view]

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line bg-surface/95 px-4 backdrop-blur-sm sm:px-5">
      {/* Marque */}
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-bright to-brand text-white shadow-[0_6px_16px_-8px_rgba(249,115,22,0.9)]">
          <LogoMark size={17} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[0.8125rem] font-bold tracking-tight">
            GeoTech <span className="text-brand">Interventions</span>
          </p>
          <p className="hidden text-[0.625rem] tracking-wide text-ink-faint sm:block">
            Plateforme de pilotage terrain
          </p>
        </div>
      </div>

      {/* Sélecteur de vue */}
      <div
        role="tablist"
        aria-label="Basculer entre les interfaces"
        className="relative grid w-[188px] shrink-0 grid-cols-2 rounded-lg border border-line bg-sunken p-1 sm:w-[248px]"
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            view === "manager"
              ? "bg-brand shadow-[0_4px_12px_-6px_rgba(249,115,22,1)]"
              : "translate-x-full border border-line-strong bg-elevated",
          )}
        />
        {VIEWS.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onViewChange(item.id)}
              className={cx(
                "relative z-10 h-7 rounded-md px-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200",
                active
                  ? item.id === "manager"
                    ? "text-white"
                    : "text-ink"
                  : "text-ink-muted hover:text-ink-soft",
              )}
            >
              <span className="sm:hidden">{item.short}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Contexte session */}
      <div className="flex shrink-0 items-center gap-3">
        <p className="num hidden font-mono text-[0.6875rem] text-ink-muted lg:block">
          03/09/2026 — 09:42
        </p>
        <button
          type="button"
          aria-label="Notifications — 1 alerte non lue"
          className="relative flex size-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          <BellIcon size={15} />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger ring-2 ring-surface" />
        </button>
        <div className="flex items-center gap-2.5 border-l border-line pl-3">
          <div className="hidden text-right leading-tight md:block">
            <p className="text-xs font-semibold">{profile.name}</p>
            <p className="text-[0.625rem] text-ink-faint">{profile.role}</p>
          </div>
          <Avatar name={profile.name} size={30} accent={view === "mobile"} />
        </div>
      </div>
    </header>
  )
}
