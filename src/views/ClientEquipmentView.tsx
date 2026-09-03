import { useState } from "react"
import {
  ArrowLeftIcon,
  BuildingIcon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  WrenchIcon,
} from "../components/icons"
import {
  Badge,
  Button,
  Card,
  CardHeader,
  cx,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "../components/ui"
import {
  buildValidator,
  FormActions,
  FormGrid,
  FormSection,
  required,
  SelectField,
  TextField,
  useForm,
} from "../components/form"
import { EQUIPMENT_STATUSES } from "../lib/data"
import type { EquipmentStatus } from "../lib/data"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"
import type { EquipmentDraft } from "../lib/store"

const EQUIPMENT_TONE: Record<EquipmentStatus, string> = {
  "En service": "border-ok/25 bg-ok/10 text-ok",
  Maintenance: "border-warn/25 bg-warn/10 text-warn",
  "En panne": "border-danger/25 bg-danger/10 text-danger",
}

const dateFr = (message = "Format attendu : JJ/MM/AAAA") =>
  (value: string) => (!value.trim() || /^\d{2}\/\d{2}\/\d{4}$/.test(value) ? undefined : message)

const validate = buildValidator<EquipmentDraft>({
  name: [required("La désignation est obligatoire.")],
  model: [required("Indiquez le modèle installé.")],
  serial: [required("Le numéro de série est obligatoire.")],
  installedAt: [dateFr()],
  lastMaintenance: [dateFr()],
})

const EMPTY: EquipmentDraft = {
  name: "",
  model: "",
  serial: "",
  status: "En service",
  installedAt: "",
  lastMaintenance: "",
}

function EquipmentForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  title: string
  initial: EquipmentDraft
  submitLabel: string
  onSubmit: (values: EquipmentDraft) => void
  onCancel: () => void
}) {
  const form = useForm<EquipmentDraft>({ initial, validate, onSubmit })

  return (
    <Card>
      <CardHeader title={title} description="Référence technique rattachée au parc du client." />
      <form onSubmit={form.handleSubmit} noValidate className="space-y-5 p-4 sm:p-5">
        <FormSection title="Identification">
          <FormGrid columns={3}>
            <TextField
              label="Désignation"
              required
              placeholder="Ex. Borne EVSE Type2 #4"
              {...form.field("name")}
            />
            <TextField
              label="Modèle"
              required
              placeholder="Ex. Schneider EVlink Pro AC 22 kW"
              {...form.field("model")}
            />
            <TextField label="N° de série" required placeholder="SN-XXX-0000" {...form.field("serial")} />
          </FormGrid>
        </FormSection>

        <FormSection title="Suivi">
          <FormGrid columns={3}>
            <SelectField
              label="État"
              options={EQUIPMENT_STATUSES}
              {...form.field("status")}
            />
            <TextField label="Installé le" placeholder="JJ/MM/AAAA" {...form.field("installedAt")} />
            <TextField
              label="Dernière maintenance"
              placeholder="JJ/MM/AAAA"
              {...form.field("lastMaintenance")}
            />
          </FormGrid>
        </FormSection>

        <FormActions>
          <Button type="submit" variant="primary">
            {submitLabel}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        </FormActions>
      </form>
    </Card>
  )
}

export default function ClientEquipmentView({ clientId }: { clientId: string }) {
  const {
    clientById,
    equipmentFor,
    interventionsFor,
    createEquipment,
    updateEquipment,
    removeEquipment,
    notify,
  } = useStore()
  const { navigate } = useRouter()

  const [mode, setMode] = useState<"idle" | "create" | string>("idle")
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const client = clientById(clientId)

  if (!client) {
    return (
      <Card>
        <EmptyState
          icon={<BuildingIcon size={18} />}
          title="Client introuvable"
          description="Ce compte n'existe plus ou l'identifiant est incorrect."
        />
        <div className="flex justify-center pb-6">
          <Button onClick={() => navigate({ tab: "clients" })}>Retour à la liste</Button>
        </div>
      </Card>
    )
  }

  const park = equipmentFor(clientId)
  const linked = interventionsFor(clientId)
  const editing = park.find(item => item.id === mode)

  const counters = [
    { label: "Équipements", value: park.length, className: "text-ink" },
    {
      label: "En service",
      value: park.filter(item => item.status === "En service").length,
      className: "text-ok",
    },
    {
      label: "En maintenance",
      value: park.filter(item => item.status === "Maintenance").length,
      className: "text-warn",
    },
    {
      label: "En panne",
      value: park.filter(item => item.status === "En panne").length,
      className: "text-danger",
    },
  ]

  return (
    <div className="animate-rise space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate({ tab: "clients" })}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeftIcon size={13} />
          Retour aux clients
        </button>

        <PageHeader
          eyebrow={`${client.type} · ${client.city}`}
          title={client.name}
          description={client.address}
          actions={
            <>
              <Button onClick={() => navigate({ tab: "clients", params: [clientId, "modifier"] })}>
                Modifier la fiche
              </Button>
              <Button
                icon={<WrenchIcon size={14} />}
                onClick={() => navigate({ tab: "planning", params: [clientId] })}
              >
                Planifier
              </Button>
              <Button variant="primary" icon={<PlusIcon size={15} />} onClick={() => setMode("create")}>
                Ajouter un équipement
              </Button>
            </>
          }
        />

        <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <PhoneIcon size={12} />
            {client.contact} · {client.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MailIcon size={12} />
            {client.email}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {counters.map(counter => (
          <Card key={counter.label} className="p-4">
            <p className="text-xs font-medium text-ink-soft">{counter.label}</p>
            <p className={cx("num mt-2 text-2xl leading-none font-bold", counter.className)}>
              {counter.value}
            </p>
          </Card>
        ))}
      </div>

      {mode === "create" ? (
        <EquipmentForm
          key="create"
          title="Nouvel équipement"
          initial={EMPTY}
          submitLabel="Ajouter au parc"
          onCancel={() => setMode("idle")}
          onSubmit={values => {
            const created = createEquipment(clientId, values)
            notify(`${created.name} ajouté au parc de ${client.name}`)
            setMode("idle")
          }}
        />
      ) : null}

      {editing ? (
        <EquipmentForm
          key={editing.id}
          title={`Modifier ${editing.name}`}
          submitLabel="Enregistrer"
          initial={{
            name: editing.name,
            model: editing.model,
            serial: editing.serial,
            status: editing.status,
            installedAt: editing.installedAt,
            lastMaintenance: editing.lastMaintenance,
          }}
          onCancel={() => setMode("idle")}
          onSubmit={values => {
            updateEquipment(editing.id, values)
            notify(`${values.name} mis à jour`)
            setMode("idle")
          }}
        />
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader
          title="Parc équipements"
          description={`${park.length} référence${park.length > 1 ? "s" : ""} sous contrat`}
        />

        {park.length === 0 ? (
          <EmptyState
            icon={<WrenchIcon size={18} />}
            title="Parc vide"
            description="Aucun équipement n'est encore rattaché à ce client. Ajoutez une première référence."
          />
        ) : (
          <div className="scroll-slim overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {["Réf.", "Désignation", "Modèle", "N° série", "État", "Installé le", "Dern. maint.", "Actions"].map(
                    head => (
                      <th
                        key={head}
                        scope="col"
                        className="bg-elevated/95 px-4 py-2.5 text-left font-mono text-[0.625rem] font-medium tracking-[0.09em] whitespace-nowrap text-ink-muted uppercase"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {park.map(item => (
                  <tr
                    key={item.id}
                    className="border-b border-line/70 transition-colors last:border-b-0 hover:bg-white/[0.025]"
                  >
                    <th scope="row" className="num px-4 py-3 font-mono text-xs font-medium whitespace-nowrap text-brand">
                      {item.id}
                    </th>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-ink-muted">{item.model}</td>
                    <td className="num px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-muted">
                      {item.serial}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={EQUIPMENT_TONE[item.status]}>{item.status}</Badge>
                    </td>
                    <td className="num px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-muted">
                      {item.installedAt}
                    </td>
                    <td className="num px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-muted">
                      {item.lastMaintenance}
                    </td>
                    <td className="px-4 py-3">
                      {pendingDelete === item.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[0.6875rem] text-ink-muted">Confirmer ?</span>
                          <Button
                            size="sm"
                            className="border-danger/40 text-danger"
                            onClick={() => {
                              removeEquipment(item.id)
                              setPendingDelete(null)
                              notify(`${item.name} retiré du parc`, "info")
                            }}
                          >
                            Supprimer
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setPendingDelete(null)}>
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button size="sm" variant="ghost" onClick={() => setMode(item.id)}>
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate({ tab: "planning", params: [clientId, item.id] })}
                          >
                            Planifier
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setPendingDelete(item.id)}>
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Interventions rattachées"
          description={`${linked.length} fiche${linked.length > 1 ? "s" : ""} sur ce compte`}
        />
        {linked.length === 0 ? (
          <EmptyState
            icon={<WrenchIcon size={18} />}
            title="Aucune intervention"
            description="Aucune fiche n'a encore été planifiée pour ce client."
          />
        ) : (
          <ul className="divide-y divide-line/70">
            {linked.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate({ tab: "interventions", params: [item.id] })}
                  className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.025]"
                >
                  <span className="num w-20 shrink-0 font-mono text-xs font-medium text-brand">{item.id}</span>
                  <span className="num w-12 shrink-0 font-mono text-[0.6875rem] text-ink-muted">
                    {item.time}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs">{item.equipment}</span>
                  <span className="hidden text-xs text-ink-muted sm:block">{item.tech}</span>
                  <StatusBadge status={item.status} />
                  <ChevronRightIcon
                    size={14}
                    className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
