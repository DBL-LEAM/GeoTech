import { useMemo, useState } from "react"
import { BuildingIcon, MapPinIcon, PlusIcon, SearchIcon, WrenchIcon } from "../components/icons"
import { Badge, Button, Card, cx, EmptyState, PageHeader, SearchInput } from "../components/ui"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"

const SECTOR_TONE: Record<string, string> = {
  Hôtellerie: "border-brand/25 bg-brand/10 text-brand-bright",
  Collectivité: "border-info/25 bg-info/10 text-info",
  Industrie: "border-danger/25 bg-danger/10 text-danger",
  Transport: "border-ok/25 bg-ok/10 text-ok",
  Santé: "border-warn/25 bg-warn/10 text-warn",
  Résidentiel: "border-line-strong bg-white/[0.04] text-ink-muted",
}

export default function ClientsView() {
  const { clients, equipmentFor, interventionsFor } = useStore()
  const { navigate } = useRouter()
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return clients
    return clients.filter(client =>
      [client.name, client.type, client.contact, client.city].some(field =>
        field.toLowerCase().includes(needle),
      ),
    )
  }, [clients, query])

  const totalEquipment = clients.reduce(
    (sum, client) => sum + equipmentFor(client.id).length,
    0,
  )

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Référentiel"
        title="Clients & Parcs équipements"
        description={`${clients.length} comptes actifs — ${totalEquipment} équipements sous contrat.`}
        actions={
          <>
            <SearchInput
              id="search-clients"
              label="Rechercher un client"
              value={query}
              onChange={setQuery}
              placeholder="Client, secteur, contact…"
              icon={<SearchIcon size={14} />}
              className="hidden w-56 sm:block"
            />
            <Button
              variant="primary"
              icon={<PlusIcon size={15} />}
              onClick={() => navigate({ tab: "clients", params: ["nouveau"] })}
            >
              Nouveau client
            </Button>
          </>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BuildingIcon size={18} />}
            title="Aucun client trouvé"
            description="Aucun compte ne correspond à cette recherche. Vérifiez l'orthographe ou créez un nouveau client."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {rows.map(client => {
            const park = equipmentFor(client.id)
            const openInterventions = interventionsFor(client.id).filter(
              item => item.status !== "Clôturée",
            ).length
            return (
              <Card key={client.id} className="card-hover flex flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[0.8125rem] font-semibold tracking-tight">
                      {client.name}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-[0.6875rem] text-ink-faint">
                      <MapPinIcon size={11} />
                      {client.city}
                    </p>
                  </div>
                  <Badge className={cx("shrink-0", SECTOR_TONE[client.type] ?? SECTOR_TONE.Résidentiel)}>
                    {client.type}
                  </Badge>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-3">
                  <div>
                    <dt className="eyebrow">Parc</dt>
                    <dd className="num mt-1 text-sm font-bold">{park.length}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="eyebrow">Contact</dt>
                    <dd className="mt-1 truncate text-xs font-medium text-ink-soft">{client.contact}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="eyebrow">Dernière int.</dt>
                    <dd
                      className={cx(
                        "num mt-1 truncate font-mono text-[0.6875rem]",
                        client.lastInt === "Aujourd'hui" ? "text-ok" : "text-ink-soft",
                      )}
                    >
                      {client.lastInt}
                    </dd>
                  </div>
                </dl>

                {openInterventions > 0 ? (
                  <p className="mt-3 flex items-center gap-1.5 text-[0.6875rem] text-ink-muted">
                    <WrenchIcon size={11} className="text-brand" />
                    {openInterventions} intervention{openInterventions > 1 ? "s" : ""} en cours ou en attente
                  </p>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate({ tab: "clients", params: [client.id, "modifier"] })}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 border border-line"
                    onClick={() => navigate({ tab: "clients", params: [client.id, "equipements"] })}
                  >
                    Équipements
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
