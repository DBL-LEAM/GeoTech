import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import {
  clients as seedClients,
  equipmentCatalogue,
  interventions as seedInterventions,
  myInterventions,
} from "./data"
import type {
  Client,
  Equipment,
  EquipmentStatus,
  Intervention,
  InterventionType,
  Priority,
  Status,
} from "./data"

/* ------------------------------------------------------------------ *
 * Entrées de création
 * ------------------------------------------------------------------ */

export type InterventionDraft = {
  clientId: string
  equipmentId: string
  type: InterventionType
  tech: string
  priority: Priority
  duration: string
  date: string
  time: string
  desc: string
}

export type ClientDraft = {
  name: string
  type: string
  city: string
  address: string
  contact: string
  email: string
  phone: string
  notes: string
}

export type EquipmentDraft = {
  name: string
  model: string
  serial: string
  status: EquipmentStatus
  installedAt: string
  lastMaintenance: string
}

export type Notice = {
  tone: "ok" | "info"
  message: string
}

type Store = {
  interventions: Intervention[]
  clients: Client[]
  equipment: Equipment[]
  fieldStatuses: Record<string, Status>
  notice: Notice | null

  clientById: (id: string) => Client | undefined
  interventionById: (id: string) => Intervention | undefined
  equipmentById: (id: string) => Equipment | undefined
  equipmentFor: (clientId: string) => Equipment[]
  interventionsFor: (clientId: string) => Intervention[]

  createIntervention: (draft: InterventionDraft) => Intervention
  updateIntervention: (id: string, patch: Partial<Intervention>) => void
  createClient: (draft: ClientDraft) => Client
  updateClient: (id: string, patch: ClientDraft) => void
  createEquipment: (clientId: string, draft: EquipmentDraft) => Equipment
  updateEquipment: (id: string, patch: EquipmentDraft) => void
  removeEquipment: (id: string) => void
  setFieldStatus: (id: string, status: Status) => void

  notify: (message: string, tone?: Notice["tone"]) => void
  dismissNotice: () => void
}

const StoreContext = createContext<Store | null>(null)

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function nextId(existing: string[], prefix: string, size: number): string {
  const highest = existing.reduce((max, value) => {
    const parsed = Number.parseInt(value.replace(`${prefix}-`, ""), 10)
    return Number.isNaN(parsed) ? max : Math.max(max, parsed)
  }, 0)
  return `${prefix}-${String(highest + 1).padStart(size, "0")}`
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function uniqueSlug(base: string, taken: string[]): string {
  const slug = base || "client"
  if (!taken.includes(slug)) return slug
  let index = 2
  while (taken.includes(`${slug}-${index}`)) index += 1
  return `${slug}-${index}`
}

/* ------------------------------------------------------------------ *
 * Provider
 * ------------------------------------------------------------------ */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [interventions, setInterventions] = useState<Intervention[]>(seedInterventions)
  const [clients, setClients] = useState<Client[]>(seedClients)
  const [equipment, setEquipment] = useState<Equipment[]>(equipmentCatalogue)
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, Status>>({
    "INT-2841": "En cours",
    "INT-2847": "En attente",
    "INT-2849": "En attente",
  })
  const [notice, setNotice] = useState<Notice | null>(null)

  const notify = useCallback((message: string, tone: Notice["tone"] = "ok") => {
    setNotice({ tone, message })
  }, [])

  const dismissNotice = useCallback(() => setNotice(null), [])

  const createIntervention = useCallback(
    (draft: InterventionDraft) => {
      const client = clients.find(item => item.id === draft.clientId)
      const gear = equipment.find(item => item.id === draft.equipmentId)
      /* Les fiches du technicien mobile réservent aussi des références. */
      const id = nextId(
        [...interventions.map(item => item.id), ...myInterventions.map(item => item.id)],
        "INT",
        4,
      )
      const created: Intervention = {
        id,
        clientId: draft.clientId,
        client: client ? client.name : "Client inconnu",
        equipmentId: draft.equipmentId || null,
        equipment: gear ? gear.name : "Équipement non précisé",
        tech: draft.tech,
        status: "En attente",
        date: draft.date,
        time: draft.time,
        duration: draft.duration,
        type: draft.type,
        priority: draft.priority,
        desc: draft.desc,
        report: null,
      }

      setInterventions(prev => [created, ...prev])
      setClients(prev =>
        prev.map(item =>
          item.id === draft.clientId ? { ...item, lastInt: "Aujourd'hui" } : item,
        ),
      )
      return created
    },
    [clients, equipment, interventions],
  )

  const updateIntervention = useCallback((id: string, patch: Partial<Intervention>) => {
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, ...patch } : item)),
    )
  }, [])

  const createClient = useCallback(
    (draft: ClientDraft) => {
      const created: Client = {
        ...draft,
        id: uniqueSlug(
          slugify(draft.name),
          clients.map(item => item.id),
        ),
        lastInt: "Jamais",
      }
      setClients(prev => [...prev, created])
      return created
    },
    [clients],
  )

  const updateClient = useCallback((id: string, patch: ClientDraft) => {
    setClients(prev => prev.map(item => (item.id === id ? { ...item, ...patch } : item)))
    setInterventions(prev =>
      prev.map(item => (item.clientId === id ? { ...item, client: patch.name } : item)),
    )
  }, [])

  const createEquipment = useCallback(
    (clientId: string, draft: EquipmentDraft) => {
      const created: Equipment = {
        ...draft,
        id: nextId(
          equipment.map(item => item.id),
          "EQ",
          4,
        ),
        clientId,
      }
      setEquipment(prev => [...prev, created])
      return created
    },
    [equipment],
  )

  const updateEquipment = useCallback((id: string, patch: EquipmentDraft) => {
    setEquipment(prev => prev.map(item => (item.id === id ? { ...item, ...patch } : item)))
    setInterventions(prev =>
      prev.map(item => (item.equipmentId === id ? { ...item, equipment: patch.name } : item)),
    )
  }, [])

  const removeEquipment = useCallback((id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id))
  }, [])

  const setFieldStatus = useCallback((id: string, status: Status) => {
    setFieldStatuses(prev => ({ ...prev, [id]: status }))
    setInterventions(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item)),
    )
  }, [])

  const value = useMemo<Store>(
    () => ({
      interventions,
      clients,
      equipment,
      fieldStatuses,
      notice,
      clientById: id => clients.find(item => item.id === id),
      interventionById: id => interventions.find(item => item.id === id),
      equipmentById: id => equipment.find(item => item.id === id),
      equipmentFor: clientId => equipment.filter(item => item.clientId === clientId),
      interventionsFor: clientId => interventions.filter(item => item.clientId === clientId),
      createIntervention,
      updateIntervention,
      createClient,
      updateClient,
      createEquipment,
      updateEquipment,
      removeEquipment,
      setFieldStatus,
      notify,
      dismissNotice,
    }),
    [
      interventions,
      clients,
      equipment,
      fieldStatuses,
      notice,
      createIntervention,
      updateIntervention,
      createClient,
      updateClient,
      createEquipment,
      updateEquipment,
      removeEquipment,
      setFieldStatus,
      notify,
      dismissNotice,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error("useStore doit être utilisé dans un StoreProvider")
  return store
}
