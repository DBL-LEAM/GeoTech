import { useMemo, useState } from "react"
import InterventionTable from "../components/InterventionTable"
import { DownloadIcon, PlusIcon, SearchIcon } from "../components/icons"
import { Button, Card, CardHeader, FilterChips, PageHeader, SearchInput } from "../components/ui"
import type { InterventionType, Status } from "../lib/data"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"

const STATUS_FILTERS = ["Toutes", "En attente", "En cours", "Clôturée"] as const
const TYPE_FILTERS = ["Tous les types", "Dépannage", "Maintenance", "Installation"] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]
type TypeFilter = (typeof TYPE_FILTERS)[number]

export default function InterventionsView() {
  const { interventions } = useStore()
  const { navigate } = useRouter()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("Toutes")
  const [type, setType] = useState<TypeFilter>("Tous les types")

  const counts = useMemo(() => {
    const base: Partial<Record<StatusFilter, number>> = { Toutes: interventions.length }
    for (const value of ["En attente", "En cours", "Clôturée"] as Status[]) {
      base[value] = interventions.filter(item => item.status === value).length
    }
    return base
  }, [interventions])

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return interventions.filter(item => {
      if (status !== "Toutes" && item.status !== status) return false
      if (type !== "Tous les types" && item.type !== (type as InterventionType)) return false
      if (!needle) return true
      return [item.id, item.client, item.equipment, item.tech, item.type].some(field =>
        field.toLowerCase().includes(needle),
      )
    })
  }, [interventions, query, status, type])

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Registre"
        title="Interventions"
        description="Historique complet et suivi des fiches sur l'ensemble du parc."
        actions={
          <>
            <Button icon={<DownloadIcon size={14} />} className="hidden sm:inline-flex">
              Exporter CSV
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

      <Card className="overflow-hidden">
        <CardHeader
          title="Toutes les interventions"
          description={`${rows.length} résultat${rows.length > 1 ? "s" : ""} sur ${interventions.length} fiches`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                id="search-interventions"
                label="Rechercher une intervention"
                value={query}
                onChange={setQuery}
                placeholder="Réf., client, équipement…"
                icon={<SearchIcon size={14} />}
                className="w-full sm:w-56"
              />
              <label htmlFor="filter-type" className="sr-only">
                Filtrer par type
              </label>
              <select
                id="filter-type"
                value={type}
                onChange={event => setType(event.target.value as TypeFilter)}
                className="field h-9 w-full sm:w-44"
              >
                {TYPE_FILTERS.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          }
        />

        <div className="flex items-center justify-between gap-3 border-b border-line bg-sunken/40 px-4 py-2">
          <FilterChips
            options={STATUS_FILTERS}
            value={status}
            onChange={setStatus}
            counts={counts}
            label="Filtrer par statut"
          />
          <p className="num hidden font-mono text-[0.625rem] text-ink-faint sm:block">Mise à jour 09:42</p>
        </div>

        <InterventionTable
          rows={rows}
          showDate
          showActions
          onSelect={item => navigate({ tab: "interventions", params: [item.id] })}
        />

        <footer className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <p className="num font-mono text-[0.625rem] text-ink-faint">
            {rows.length} / {interventions.length} fiches
          </p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" disabled>
              Précédent
            </Button>
            <Button size="sm" variant="ghost" disabled>
              Suivant
            </Button>
          </div>
        </footer>
      </Card>
    </div>
  )
}
