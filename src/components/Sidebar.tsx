import { techniciens } from "../lib/data"
import { useStore } from "../lib/store"
import {
  BuildingIcon,
  CalendarIcon,
  DashboardIcon,
  RefreshIcon,
  WrenchIcon,
} from "./icons"
import { cx } from "./ui"

export type Tab = "dashboard" | "planning" | "interventions" | "clients"

const NAV: {
  id: Tab
  label: string
  icon: typeof DashboardIcon
}[] = [
  { id: "dashboard", label: "Tableau de bord", icon: DashboardIcon },
  { id: "planning", label: "Planification", icon: CalendarIcon },
  { id: "interventions", label: "Interventions", icon: WrenchIcon },
  { id: "clients", label: "Clients & Parcs", icon: BuildingIcon },
]

export default function Sidebar({
  tab,
  onTabChange,
}: {
  tab: Tab
  onTabChange: (next: Tab) => void
}) {
  const { interventions } = useStore()
  const badges: Partial<Record<Tab, number>> = { interventions: interventions.length }

  return (
    <nav
      aria-label="Navigation principale"
      className="flex w-[68px] shrink-0 flex-col border-r border-line bg-surface/80 py-4 lg:w-60"
    >
      <p className="eyebrow mb-2 hidden px-5 lg:block">Pilotage</p>

      <ul className="flex flex-col gap-0.5 px-3">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = tab === item.id
          const badge = badges[item.id]
          return (
            <li key={item.id}>
              <button
                type="button"
                title={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => onTabChange(item.id)}
                className={cx(
                  "group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[0.8125rem] font-medium transition-colors duration-150",
                  active
                    ? "bg-brand/12 text-brand-bright ring-1 ring-brand/25 ring-inset"
                    : "text-ink-muted hover:bg-white/[0.04] hover:text-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1/2 -left-3 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand transition-opacity duration-200",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon size={17} className="shrink-0" />
                <span className="hidden truncate lg:block">{item.label}</span>
                {badge !== undefined ? (
                  <span
                    className={cx(
                      "num ml-auto hidden rounded-md px-1.5 py-0.5 font-mono text-[0.625rem] lg:block",
                      active
                        ? "bg-brand/15 text-brand-bright"
                        : "bg-white/[0.05] text-ink-faint",
                    )}
                  >
                    {badge}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Équipe terrain */}
      <div className="mt-auto hidden px-3 lg:block">
        <div className="rounded-xl border border-line bg-sunken/60 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="eyebrow">Techniciens</p>
            <span className="num font-mono text-[0.625rem] text-ink-faint">
              4 actifs
            </span>
          </div>
          <ul className="space-y-2">
            {techniciens.map((tech) => (
              <li key={tech.name} className="flex items-center gap-2">
                <span
                  className={cx(
                    "size-1.5 shrink-0 rounded-full",
                    tech.status === "terrain" ? "bg-ok live-dot" : "bg-warn",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
                  {tech.name}
                </span>
                <span
                  className="num shrink-0 font-mono text-[0.625rem] text-ink-faint"
                  title="En cours / clôturées"
                >
                  {tech.active}/{tech.done}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-3 flex items-center gap-1.5 px-1 font-mono text-[0.625rem] text-ink-faint">
          <RefreshIcon size={11} />
          Synchronisé il y a 2 min
        </p>
      </div>
    </nav>
  )
}
