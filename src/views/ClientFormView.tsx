import { ArrowLeftIcon, BuildingIcon } from "../components/icons"
import { Button, Card, CardHeader, EmptyState, PageHeader } from "../components/ui"
import {
  buildValidator,
  email,
  FormActions,
  FormGrid,
  FormSection,
  phone,
  required,
  SelectField,
  TextAreaField,
  TextField,
  useForm,
} from "../components/form"
import { SECTORS } from "../lib/data"
import { useRouter } from "../lib/router"
import { useStore } from "../lib/store"
import type { ClientDraft } from "../lib/store"

const validate = buildValidator<ClientDraft>({
  name: [required("La raison sociale est obligatoire.")],
  type: [required("Sélectionnez un secteur.")],
  city: [required("Indiquez la ville.")],
  address: [required("Indiquez l'adresse d'intervention.")],
  contact: [required("Indiquez le contact sur site.")],
  email: [email()],
  phone: [phone()],
})

const EMPTY: ClientDraft = {
  name: "",
  type: "Hôtellerie",
  city: "",
  address: "",
  contact: "",
  email: "",
  phone: "",
  notes: "",
}

export default function ClientFormView({ clientId }: { clientId?: string }) {
  const { clientById, createClient, updateClient, notify } = useStore()
  const { navigate } = useRouter()

  const existing = clientId ? clientById(clientId) : undefined
  const isEdit = Boolean(clientId)

  const form = useForm<ClientDraft>({
    initial: existing
      ? {
          name: existing.name,
          type: existing.type,
          city: existing.city,
          address: existing.address,
          contact: existing.contact,
          email: existing.email,
          phone: existing.phone,
          notes: existing.notes,
        }
      : EMPTY,
    validate,
    onSubmit: values => {
      if (existing) {
        updateClient(existing.id, values)
        notify(`Fiche client « ${values.name} » mise à jour`)
        navigate({ tab: "clients", params: [existing.id, "equipements"] })
        return
      }
      const created = createClient(values)
      notify(`Client « ${created.name} » créé — ajoutez son parc d'équipements`)
      navigate({ tab: "clients", params: [created.id, "equipements"] })
    },
  })

  if (isEdit && !existing) {
    return (
      <Card>
        <EmptyState
          icon={<BuildingIcon size={18} />}
          title="Client introuvable"
          description="Cette fiche client n'existe plus ou l'identifiant est incorrect."
        />
        <div className="flex justify-center pb-6">
          <Button onClick={() => navigate({ tab: "clients" })}>Retour à la liste</Button>
        </div>
      </Card>
    )
  }

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
          eyebrow={isEdit ? "Édition" : "Création"}
          title={isEdit ? `Modifier ${existing?.name}` : "Nouveau client"}
          description={
            isEdit
              ? "Mettre à jour les coordonnées et les consignes d'accès du compte."
              : "Renseigner les informations du compte avant de constituer son parc d'équipements."
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Fiche client"
            description="Les champs marqués d'une étoile sont obligatoires."
          />
          <form onSubmit={form.handleSubmit} noValidate className="space-y-5 p-4 sm:p-5">
            <FormSection title="Identité">
              <FormGrid>
                <TextField
                  label="Raison sociale"
                  required
                  placeholder="Ex. Hôtel Mercure Lyon"
                  {...form.field("name")}
                />
                <SelectField label="Secteur d'activité" required options={SECTORS} {...form.field("type")} />
              </FormGrid>
            </FormSection>

            <FormSection title="Site d'intervention">
              <FormGrid>
                <TextField label="Ville" required placeholder="Ex. Lyon 2e" {...form.field("city")} />
                <TextField
                  label="Adresse complète"
                  required
                  placeholder="12 Rue de la République, 69002 Lyon"
                  {...form.field("address")}
                />
              </FormGrid>
            </FormSection>

            <FormSection title="Contact">
              <FormGrid columns={3}>
                <TextField
                  label="Interlocuteur"
                  required
                  placeholder="Ex. M. Girard"
                  {...form.field("contact")}
                />
                <TextField
                  label="E-mail"
                  type="email"
                  placeholder="technique@client.fr"
                  {...form.field("email")}
                />
                <TextField
                  label="Téléphone"
                  type="tel"
                  placeholder="04 72 00 12 45"
                  {...form.field("phone")}
                />
              </FormGrid>
            </FormSection>

            <FormSection title="Consignes d'accès">
              <TextAreaField
                label="Notes internes"
                rows={3}
                placeholder="Badge, horaires autorisés, habilitations requises…"
                {...form.field("notes")}
              />
            </FormSection>

            <FormActions note={isEdit ? "Modification tracée dans le journal" : "Le parc pourra être saisi ensuite"}>
              <Button type="submit" variant="primary">
                {isEdit ? "Enregistrer les modifications" : "Créer le client"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate({ tab: "clients" })}>
                Annuler
              </Button>
            </FormActions>
          </form>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Aperçu" description="Rendu de la fiche dans le référentiel" />
          <div className="space-y-3 p-4">
            <div>
              <p className="text-[0.8125rem] font-semibold">
                {form.values.name || "Raison sociale du client"}
              </p>
              <p className="mt-0.5 text-[0.6875rem] text-ink-muted">
                {form.values.type} · {form.values.city || "Ville"}
              </p>
            </div>
            <dl className="space-y-1.5 border-t border-line pt-3 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Adresse</dt>
                <dd className="truncate text-right text-ink-soft">{form.values.address || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Contact</dt>
                <dd className="truncate text-right text-ink-soft">{form.values.contact || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">E-mail</dt>
                <dd className="truncate text-right text-ink-soft">{form.values.email || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Téléphone</dt>
                <dd className="num truncate text-right font-mono text-ink-soft">
                  {form.values.phone || "—"}
                </dd>
              </div>
            </dl>
            {form.values.notes ? (
              <p className="rounded-lg border border-line bg-sunken p-3 text-[0.6875rem] leading-relaxed text-ink-muted">
                {form.values.notes}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
