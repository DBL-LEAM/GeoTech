import { useMemo, useState } from "react"
import {
  ArrowLeftIcon,
  BuildingIcon,
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  PhoneIcon,
  WrenchIcon,
} from "../components/icons"
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  cx,
  EmptyState,
  PriorityBadge,
  StatusBadge,
} from "../components/ui"
import { buildValidator, FormActions, minLength, TextAreaField, useForm } from "../components/form"
import { techniciens } from "../lib/data"
import type { Intervention, Status } from "../lib/data"
import { priorityTone, statusTone, typeTone } from "../lib/status"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"

type ReportValues = { report: string }

const validateReport = buildValidator<ReportValues>({
  report: [minLength(20, "Le compte-rendu doit faire au moins 20 caractères.")],
})

function timeline(intervention: Intervention) {
  const events: { label: string; detail: string; done: boolean }[] = [
    {
      label: "Fiche créée",
      detail: `Planifiée le ${intervention.date.split("-").reverse().join("/")} à ${intervention.time}`,
      done: true,
    },
    {
      label: "Technicien assigné",
      detail: `${intervention.tech} — ${intervention.type.toLowerCase()}, durée estimée ${intervention.duration}`,
      done: Boolean(intervention.tech),
    },
    {
      label: "Prise en charge sur site",
      detail:
        intervention.status === "En attente"
          ? "En attente de l'arrivée du technicien"
          : `Arrivée confirmée par ${intervention.tech}`,
      done: intervention.status !== "En attente",
    },
    {
      label: "Clôture et compte-rendu",
      detail:
        intervention.status === "Clôturée"
          ? "Rapport transmis au responsable de planification"
          : "Rapport non transmis",
      done: intervention.status === "Clôturée",
    },
  ]
  return events
}

export default function InterventionDetailView({ id }: { id: string }) {
  const { interventionById, clientById, updateIntervention, notify } = useStore()
  const { navigate } = useRouter()
  const [closing, setClosing] = useState(false)

  const intervention = interventionById(id)
  const client = intervention ? clientById(intervention.clientId) : undefined

  const form = useForm<ReportValues>({
    initial: { report: "" },
    validate: validateReport,
    onSubmit: values => {
      updateIntervention(id, { status: "Clôturée", report: values.report })
      setClosing(false)
      form.reset()
      notify(`${id} clôturée — rapport enregistré`)
    },
  })

  const events = useMemo(() => (intervention ? timeline(intervention) : []), [intervention])

  if (!intervention) {
    return (
      <Card>
        <EmptyState
          icon={<WrenchIcon size={18} />}
          title="Intervention introuvable"
          description="Cette fiche n'existe plus ou la référence est incorrecte."
        />
        <div className="flex justify-center pb-6">
          <Button onClick={() => navigate({ tab: "interventions" })}>Retour au registre</Button>
        </div>
      </Card>
    )
  }

  function changeStatus(status: Status) {
    updateIntervention(id, { status })
    notify(`${id} — statut mis à jour : ${status}`, "info")
  }

  const facts = [
    { label: "Type", value: <Badge className={typeTone[intervention.type]}>{intervention.type}</Badge> },
    { label: "Priorité", value: <PriorityBadge priority={intervention.priority} /> },
    { label: "Créneau", value: <span className="num font-mono text-xs">{intervention.time}</span> },
    { label: "Durée estimée", value: <span className="num font-mono text-xs">{intervention.duration}</span> },
    {
      label: "Date",
      value: (
        <span className="num font-mono text-xs">{intervention.date.split("-").reverse().join("/")}</span>
      ),
    },
    { label: "Équipement", value: <span className="text-xs">{intervention.equipment}</span> },
  ]

  return (
    <div className="animate-rise space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate({ tab: "interventions" })}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeftIcon size={13} />
          Retour au registre
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="num font-mono text-lg font-bold tracking-tight text-brand">
                {intervention.id}
              </h1>
              <StatusBadge status={intervention.status} live />
            </div>
            <p className="mt-1 text-[0.9375rem] font-semibold">{intervention.client}</p>
            {client ? (
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={12} />
                  {client.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon size={12} />
                  {client.contact} · {client.phone}
                </span>
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {intervention.status === "En attente" ? (
              <Button variant="primary" icon={<MapPinIcon size={14} />} onClick={() => changeStatus("En cours")}>
                Prendre en charge
              </Button>
            ) : null}
            {intervention.status === "En cours" ? (
              <Button
                variant="primary"
                icon={<FileTextIcon size={14} />}
                onClick={() => setClosing(value => !value)}
              >
                {closing ? "Annuler la clôture" : "Clôturer la fiche"}
              </Button>
            ) : null}
            {intervention.status === "Clôturée" ? (
              <Button icon={<ClockIcon size={14} />} onClick={() => changeStatus("En cours")}>
                Rouvrir la fiche
              </Button>
            ) : null}
            {client ? (
              <Button
                icon={<BuildingIcon size={14} />}
                onClick={() => navigate({ tab: "clients", params: [client.id, "equipements"] })}
              >
                Parc client
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader title="Description de la demande" description={`Signalée par ${intervention.client}`} />
            <p className="px-4 py-4 text-[0.8125rem] leading-relaxed text-ink-soft">{intervention.desc}</p>
          </Card>

          {intervention.status === "Clôturée" && intervention.report ? (
            <Card>
              <CardHeader
                title="Compte-rendu d'intervention"
                description={`Rédigé par ${intervention.tech}`}
                actions={
                  <Badge className="border-ok/25 bg-ok/10 text-ok">
                    <CheckIcon size={11} />
                    Validé
                  </Badge>
                }
              />
              <p className="px-4 py-4 text-[0.8125rem] leading-relaxed text-ink-soft">
                {intervention.report}
              </p>
            </Card>
          ) : null}

          {closing && intervention.status === "En cours" ? (
            <Card>
              <CardHeader
                title="Clôturer l'intervention"
                description="Le compte-rendu est transmis au client et archivé avec la fiche."
              />
              <form onSubmit={form.handleSubmit} noValidate className="space-y-5 p-4 sm:p-5">
                <TextAreaField
                  label="Compte-rendu"
                  required
                  rows={6}
                  placeholder="Travaux effectués, pièces remplacées, tests réalisés, recommandations…"
                  {...form.field("report")}
                />
                <FormActions note="La clôture verrouille la fiche">
                  <Button type="submit" variant="success">
                    Enregistrer et clôturer
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setClosing(false)}>
                    Annuler
                  </Button>
                </FormActions>
              </form>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="Historique" description="Cycle de vie de la fiche" />
            <ol className="relative space-y-4 px-4 py-4">
              <span aria-hidden="true" className="absolute top-6 bottom-6 left-[1.31rem] w-px bg-line" />
              {events.map(event => (
                <li key={event.label} className="relative flex items-start gap-3">
                  <span
                    className={cx(
                      "relative z-10 mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ring-4 ring-surface",
                      event.done ? "bg-ok/20 text-ok" : "bg-elevated text-ink-faint",
                    )}
                  >
                    {event.done ? <CheckIcon size={10} /> : <span className="size-1 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0">
                    <p className={cx("text-xs font-semibold", event.done ? "text-ink" : "text-ink-muted")}>
                      {event.label}
                    </p>
                    <p className="mt-0.5 text-[0.6875rem] text-ink-muted">{event.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Fiche technique" />
            <dl className="divide-y divide-line/70">
              {facts.map(fact => (
                <div key={fact.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <dt className="text-xs text-ink-muted">{fact.label}</dt>
                  <dd className="text-right">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader title="Technicien assigné" />
            <div className="flex items-center gap-3 px-4 py-4">
              <Avatar name={intervention.tech} size={38} accent />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{intervention.tech}</p>
                <p className="text-[0.6875rem] text-ink-muted">
                  {techniciens.find(tech => tech.name === intervention.tech)?.sector ?? "Secteur non défini"}
                </p>
              </div>
            </div>
            <div className="border-t border-line px-4 py-3">
              <label htmlFor="reassign" className="label mb-1.5">
                Réaffecter
              </label>
              <select
                id="reassign"
                value={intervention.tech}
                onChange={event => {
                  updateIntervention(id, { tech: event.target.value })
                  notify(`${id} réaffectée à ${event.target.value}`, "info")
                }}
                className="field h-9"
              >
                {techniciens.map(tech => (
                  <option key={tech.name}>{tech.name}</option>
                ))}
              </select>
            </div>
          </Card>

          <Card className={cx("p-4", priorityTone[intervention.priority])}>
            <p className="font-mono text-[0.625rem] tracking-[0.12em] uppercase">
              Priorité {intervention.priority}
            </p>
            <p className="mt-1.5 text-[0.6875rem] leading-relaxed opacity-80">
              {intervention.priority === "critique"
                ? "Prise en charge attendue sous 2 h, escalade automatique au responsable au-delà."
                : intervention.priority === "haute"
                  ? "Prise en charge attendue dans la journée."
                  : "Traitement au fil du planning, sans engagement de délai contractuel."}
            </p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.625rem] opacity-70">
              <span className={cx("size-1.5 rounded-full", statusTone[intervention.status].dot)} />
              Statut courant : {intervention.status}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
