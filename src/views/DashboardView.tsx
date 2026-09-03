import { useMemo, useState } from "react"
import InterventionTable from "../components/InterventionTable"
import {
  AlertIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  PlusIcon,
  WrenchIcon,
} from "../components/icons"
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  cx,
  FilterChips,
  Meter,
  PageHeader,
} from "../components/ui"
import { techniciens, typeBreakdown } from "../lib/data"
import type { Status } from "../lib/data"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"

const FILTERS = ["Toutes", "En cours", "En attente", "Clôturée"] as const
type Filter = (typeof FILTERS)[number]

export default function DashboardView() {
  const { interventions } = useStore()
  const { navigate } = useRouter()
  const [filter, setFilter] = useState<Filter>("Toutes")

  const counts = useMemo(() => {
    const base: Partial<Record<Filter, number>> = { Toutes: interventions.length }
    for (const status of ["En cours", "En attente", "Clôturée"] as Status[]) {
      base[status] = interventions.filter(item => item.status === status).length
    }
    return base
  }, [interventions])

  const total = interventions.length
  const running = counts["En cours"] ?? 0
  const closed = counts["Clôturée"] ?? 0
  const waiting = counts["En attente"] ?? 0
  const critical = interventions.filter(
    item => item.priority === "critique" && item.status !== "Clôturée",
  ).length

  const stats = [
    {
      label: "Interventions du jour",
      value: total,
      delta: "+2 vs hier",
      trend: "up" as const,
      icon: WrenchIcon,
      tone: "var(--color-info)",
      className: "text-info",
      ratio: 100,
    },
    {
      label: "En cours",
      value: running,
      delta: `${new Set(interventions.filter(item => item.status === "En cours").map(item => item.tech)).size} technicien(s) actif(s)`,
      trend: "flat" as const,
      icon: BoltIcon,
      tone: "var(--color-info)",
      className: "text-info",
      ratio: total ? (running / total) * 100 : 0,
    },
    {
      label: "Clôturées",
      value: closed,
      delta: `${total ? Math.round((closed / total) * 100) : 0} % de taux de clôture`,
      trend: "up" as const,
      icon: CheckIcon,
      tone: "var(--color-ok)",
      className: "text-ok",
      ratio: total ? (closed / total) * 100 : 0,
    },
    {
      label: "En attente",
      value: waiting,
      delta: critical > 0 ? `${critical} critique non affectée` : "Aucune priorité critique",
      trend: "down" as const,
      icon: ClockIcon,
      tone: "var(--color-warn)",
      className: "text-warn",
      ratio: total ? (waiting / total) * 100 : 0,
    },
  ]

  const rows = useMemo(
    () => (filter === "Toutes" ? interventions : interventions.filter(item => item.status === filter)),
    [filter, interventions],
  )

  const breakdown = typeBreakdown.map(item => ({
    ...item,
    count: interventions.filter(entry => entry.type === item.type).length,
  }))

  const alert = interventions.find(
    item => item.priority === "critique" && item.status !== "Clôturée",
  )

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Jeudi 3 septembre 2026"
        title="Tableau de bord"
        description={`Région Auvergne-Rhône-Alpes — ${techniciens.length} techniciens mobilisés sur ${total} interventions planifiées.`}
        actions={
          <>
            <Button icon={<DownloadIcon size={14} />} className="hidden sm:inline-flex">
              Exporter
            </Button>
            <Button
              variant="primary"
              icon={<PlusIcon size={15} />}
              onClick={() => navigate({ tab: "planning" })}
            >
              Nouvelle intervention
            </Button>
          </>
        }
      />

      {/* Indicateurs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="card-hover p-4">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-ink-soft">{stat.label}</p>
                <span className={cx("rounded-md border border-line bg-sunken p-1.5", stat.className)}>
                  <Icon size={14} />
                </span>
              </div>
              <p className={cx("num mt-3 text-[2rem] leading-none font-bold tracking-tight", stat.className)}>
                {stat.value}
              </p>
              <Meter value={stat.ratio} tone={stat.tone} className="mt-3" height={3} />
              <p className="mt-2 flex items-center gap-1 font-mono text-[0.625rem] text-ink-muted">
                <span
                  className={cx(
                    stat.trend === "up" && "text-ok",
                    stat.trend === "down" && "text-warn",
                    stat.trend === "flat" && "text-ink-faint",
                  )}
                >
                  {stat.trend === "up" ? "▲" : stat.trend === "down" ? "▼" : "■"}
                </span>
                {stat.delta}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Tableau des interventions */}
      <Card className="overflow-hidden">
        <CardHeader
          title="Interventions du jour"
          description={`${rows.length} fiche${rows.length > 1 ? "s" : ""} affichée${rows.length > 1 ? "s" : ""} sur ${total}`}
          actions={
            <FilterChips
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              counts={counts}
              label="Filtrer par statut"
            />
          }
        />
        <InterventionTable
          rows={rows}
          onSelect={item => navigate({ tab: "interventions", params: [item.id] })}
        />
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Disponibilité techniciens */}
        <Card>
          <CardHeader
            title="Disponibilité techniciens"
            description="Avancement de la tournée en temps réel"
            actions={<Badge className="border-ok/25 bg-ok/10 text-ok">{techniciens.length} en service</Badge>}
          />
          <ul className="divide-y divide-line/70">
            {techniciens.map(tech => {
              const assigned = interventions.filter(item => item.tech === tech.name)
              const done = assigned.filter(item => item.status === "Clôturée").length
              const ratio = assigned.length > 0 ? (done / assigned.length) * 100 : 0
              return (
                <li key={tech.name} className="flex items-center gap-3 px-4 py-3">
                  <Avatar name={tech.name} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="truncate text-xs font-semibold">
                        {tech.name}
                        <span className="ml-2 font-normal text-ink-faint">{tech.sector}</span>
                      </span>
                      <span className="num shrink-0 font-mono text-[0.625rem] text-ink-muted">
                        {done}/{assigned.length} clôturées
                      </span>
                    </div>
                    <Meter value={ratio} height={3} />
                  </div>
                  <Badge
                    className={cx(
                      "font-mono text-[0.625rem] uppercase",
                      tech.status === "terrain"
                        ? "border-ok/25 bg-ok/10 text-ok"
                        : "border-warn/25 bg-warn/10 text-warn",
                    )}
                  >
                    {tech.status}
                  </Badge>
                </li>
              )
            })}
          </ul>
        </Card>

        {/* Répartition + alertes */}
        <Card>
          <CardHeader title="Répartition par type" description={`Volume du jour — ${total} interventions`} />
          <div className="space-y-3 px-4 py-4">
            {breakdown.map(item => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-ink-soft">{item.type}</span>
                <Meter value={total ? (item.count / total) * 100 : 0} tone={item.token} height={6} />
                <span className="num w-10 shrink-0 text-right font-mono text-[0.6875rem] text-ink-muted">
                  {item.count}
                  <span className="text-ink-faint">/{total}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-4 py-4">
            <p className="eyebrow mb-2.5">Alertes</p>
            {alert ? (
              <div className="flex items-start gap-2.5 rounded-lg border border-danger/25 bg-danger/[0.07] p-3">
                <span className="mt-0.5 shrink-0 text-danger">
                  <AlertIcon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed text-ink-soft">
                    <span className="font-semibold text-ink">{alert.client}</span> — {alert.id} en priorité
                    critique, prise en charge à surveiller.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate({ tab: "interventions", params: [alert.id] })}
                    >
                      Voir la fiche
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate({ tab: "interventions", params: [alert.id] })}
                    >
                      Réaffecter
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-line bg-sunken p-3 text-xs text-ink-muted">
                Aucune alerte active — toutes les priorités critiques sont traitées.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
