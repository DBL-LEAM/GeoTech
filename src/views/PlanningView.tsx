import { useMemo } from "react"
import { ShieldIcon } from "../components/icons"
import { Button, Card, CardHeader, cx, PageHeader, StatusBadge } from "../components/ui"
import {
  buildValidator,
  FormActions,
  FormGrid,
  FormSection,
  minLength,
  required,
  SelectField,
  TextAreaField,
  TextField,
  useForm,
} from "../components/form"
import { DURATIONS, INTERVENTION_TYPES, PRIORITIES, techniciens } from "../lib/data"
import type { InterventionType, Priority } from "../lib/data"
import { statusTone } from "../lib/status"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"

type PlanningValues = {
  clientId: string
  equipmentId: string
  type: string
  tech: string
  priority: string
  duration: string
  date: string
  time: string
  desc: string
}

const validate = buildValidator<PlanningValues>({
  clientId: [required("Sélectionnez le client concerné.")],
  equipmentId: [required("Sélectionnez l'équipement à traiter.")],
  tech: [required("Assignez un technicien disponible.")],
  desc: [minLength(10, "Décrivez la panne ou les travaux (10 caractères minimum).")],
})

export default function PlanningView({ prefill }: { prefill: string[] }) {
  const { clients, equipment, interventions, createIntervention, notify } = useStore()
  const { navigate } = useRouter()

  const [prefilledClient = "", prefilledEquipment = ""] = prefill

  const initial = useMemo<PlanningValues>(
    () => ({
      clientId: prefilledClient,
      equipmentId: prefilledEquipment,
      type: "Dépannage",
      tech: "",
      priority: "normale",
      duration: "1 h 30",
      date: "2026-09-03",
      time: "10:00",
      desc: "",
    }),
    [prefilledClient, prefilledEquipment],
  )

  const form = useForm<PlanningValues>({
    initial,
    validate,
    onSubmit: values => {
      const created = createIntervention({
        clientId: values.clientId,
        equipmentId: values.equipmentId,
        type: values.type as InterventionType,
        tech: values.tech,
        priority: values.priority as Priority,
        duration: values.duration,
        date: values.date,
        time: values.time,
        desc: values.desc,
      })
      notify(`Intervention ${created.id} créée et assignée à ${created.tech}`)
      navigate({ tab: "interventions", params: [created.id] })
    },
  })

  const clientOptions = clients.map(client => ({ value: client.id, label: client.name }))
  const parkOptions = equipment
    .filter(item => item.clientId === form.values.clientId)
    .map(item => ({ value: item.id, label: `${item.name} — ${item.model}` }))

  const dayPlanning = interventions
    .filter(item => item.status !== "Clôturée")
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))

  const clientField = form.field("clientId")

  return (
    <div className="animate-rise space-y-6">
      <PageHeader
        eyebrow="Ordonnancement"
        title="Planification"
        description="Créer une fiche d'intervention et l'affecter à un technicien du secteur."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Nouvelle intervention"
            description="Les champs marqués d'une étoile conditionnent l'affectation."
          />

          <form onSubmit={form.handleSubmit} noValidate className="space-y-5 p-4 sm:p-5">
            <FormSection title="Contexte client">
              <FormGrid>
                <SelectField
                  label="Client"
                  required
                  placeholder="Sélectionner un client…"
                  options={clientOptions}
                  {...clientField}
                  onChange={event => {
                    clientField.onChange(event)
                    /* Le parc dépend du client : on réinitialise l'équipement. */
                    form.setValue("equipmentId", "")
                  }}
                />
                <SelectField
                  label="Équipement"
                  required
                  hint={form.values.clientId ? `${parkOptions.length} au parc` : "choisir un client"}
                  placeholder={
                    form.values.clientId
                      ? "Sélectionner un équipement…"
                      : "Sélectionnez d'abord un client"
                  }
                  options={parkOptions}
                  {...form.field("equipmentId")}
                />
              </FormGrid>
            </FormSection>

            <FormSection title="Affectation">
              <FormGrid>
                <SelectField
                  label="Type d'intervention"
                  options={INTERVENTION_TYPES}
                  {...form.field("type")}
                />
                <SelectField
                  label="Technicien"
                  required
                  placeholder="Assigner…"
                  options={techniciens.map(tech => ({
                    value: tech.name,
                    label: `${tech.name} — ${tech.active + tech.done} int. · ${tech.sector}`,
                  }))}
                  {...form.field("tech")}
                />
                <SelectField
                  label="Priorité"
                  options={PRIORITIES.map(value => ({
                    value,
                    label: value.charAt(0).toUpperCase() + value.slice(1),
                  }))}
                  {...form.field("priority")}
                />
                <SelectField label="Durée estimée" options={DURATIONS} {...form.field("duration")} />
                <TextField label="Date" type="date" {...form.field("date")} />
                <TextField label="Créneau" type="time" {...form.field("time")} />
              </FormGrid>
            </FormSection>

            <FormSection title="Diagnostic">
              <TextAreaField
                label="Description / panne constatée"
                required
                placeholder="Décrire la panne ou les travaux à effectuer…"
                {...form.field("desc")}
              />
            </FormSection>

            <FormActions note="Notification push envoyée au technicien à la validation">
              <Button type="submit" variant="primary">
                Créer l'intervention
              </Button>
              <Button type="button" variant="ghost" onClick={() => form.reset()}>
                Réinitialiser
              </Button>
            </FormActions>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Planning du jour" description={`${dayPlanning.length} créneaux ouverts`} />
            <ol className="relative px-4 py-3">
              <span aria-hidden="true" className="absolute top-5 bottom-5 left-[3.35rem] w-px bg-line" />
              {dayPlanning.map(item => (
                <li key={item.id} className="relative flex items-start gap-3 py-2.5">
                  <span className="num w-9 shrink-0 pt-0.5 text-right font-mono text-[0.6875rem] text-ink-muted">
                    {item.time}
                  </span>
                  <span
                    className={cx(
                      "relative z-10 mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-surface",
                      statusTone[item.status].dot,
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => navigate({ tab: "interventions", params: [item.id] })}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-xs font-semibold hover:text-brand-bright">{item.client}</p>
                    <p className="truncate text-[0.6875rem] text-ink-muted">
                      {item.tech} · {item.type}
                    </p>
                  </button>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ol>
          </Card>

          <Card className="border-brand/20 bg-brand/[0.05]">
            <div className="p-4">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-brand-bright uppercase">
                <ShieldIcon size={13} />
                Note juridique
              </p>
              <p className="text-[0.6875rem] leading-relaxed text-ink-muted">
                Le suivi temps réel des techniciens nécessite l'information et la consultation préalable du
                CSE. Toute mise en œuvre doit respecter les articles L. 2312-8 et L. 1222-3 du Code du travail.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
