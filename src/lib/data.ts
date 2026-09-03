/**
 * Jeu de données de démonstration.
 * Les valeurs reprennent la maquette d'origine, enrichies des champs
 * nécessaires aux écrans de création / édition.
 */

export type Status = "En attente" | "En cours" | "Clôturée"
export type Priority = "critique" | "haute" | "normale"
export type InterventionType = "Dépannage" | "Maintenance" | "Installation"
export type EquipmentStatus = "En service" | "Maintenance" | "En panne"

export type Intervention = {
  id: string
  clientId: string
  client: string
  equipmentId: string | null
  equipment: string
  tech: string
  status: Status
  date: string
  time: string
  duration: string
  type: InterventionType
  priority: Priority
  desc: string
  report: string | null
}

export type Client = {
  id: string
  name: string
  type: string
  city: string
  address: string
  contact: string
  email: string
  phone: string
  notes: string
  lastInt: string
}

export type Equipment = {
  id: string
  clientId: string
  name: string
  model: string
  serial: string
  status: EquipmentStatus
  installedAt: string
  lastMaintenance: string
}

export type Technicien = {
  name: string
  active: number
  done: number
  status: "terrain" | "transit"
  sector: string
}

export type FieldIntervention = {
  id: string
  client: string
  address: string
  equipment: string
  status: Status
  time: string
  desc: string
  priority: Priority
  contact: string
}

export const SECTORS = [
  "Hôtellerie",
  "Collectivité",
  "Industrie",
  "Transport",
  "Santé",
  "Résidentiel",
] as const

export const INTERVENTION_TYPES: InterventionType[] = [
  "Dépannage",
  "Maintenance",
  "Installation",
]

export const PRIORITIES: Priority[] = ["normale", "haute", "critique"]

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "En service",
  "Maintenance",
  "En panne",
]

export const DURATIONS = ["45 min", "1 h 30", "3 h", "Journée complète"]

export const techniciens: Technicien[] = [
  { name: "A. Moreau", active: 2, done: 1, status: "terrain", sector: "Lyon Centre" },
  { name: "C. Dubois", active: 1, done: 1, status: "terrain", sector: "Lyon Est" },
  { name: "M. Petit", active: 1, done: 0, status: "transit", sector: "Nord Isère" },
  { name: "L. Bernard", active: 1, done: 0, status: "terrain", sector: "Aéroport" },
]

export const clients: Client[] = [
  {
    id: "mercure-lyon",
    name: "Hôtel Mercure Lyon",
    type: "Hôtellerie",
    city: "Lyon 2e",
    address: "12 Rue de la République, 69002 Lyon",
    contact: "M. Girard",
    email: "technique@mercure-lyon.fr",
    phone: "04 72 00 12 45",
    notes: "Accès parking niveau -1, badge à retirer à la réception.",
    lastInt: "Aujourd'hui",
  },
  {
    id: "villeurbanne",
    name: "Mairie de Villeurbanne",
    type: "Collectivité",
    city: "Villeurbanne",
    address: "Place Lazare Goujon, 69100 Villeurbanne",
    contact: "Mme Leroy",
    email: "services.techniques@villeurbanne.fr",
    phone: "04 78 03 67 00",
    notes: "Interventions autorisées uniquement en semaine, 8h–17h.",
    lastInt: "28/08/2026",
  },
  {
    id: "renault-flins",
    name: "Usine Renault Flins",
    type: "Industrie",
    city: "Flins",
    address: "Route de Bouafle, 78410 Aubergenville",
    contact: "Ing. Simon",
    email: "maintenance@renault-flins.fr",
    phone: "01 30 90 40 00",
    notes: "Habilitation électrique B2V obligatoire, EPI complets.",
    lastInt: "Aujourd'hui",
  },
  {
    id: "st-exupery",
    name: "Aéroport St-Exupéry",
    type: "Transport",
    city: "Colombier-Saugnieu",
    address: "Terminal 2, 69125 Colombier-Saugnieu",
    contact: "M. Blanc",
    email: "exploitation@lyonaeroports.fr",
    phone: "08 26 80 08 26",
    notes: "Badge zone réservée nécessaire, délai de 48 h.",
    lastInt: "Aujourd'hui",
  },
  {
    id: "chu-grenoble",
    name: "CHU Grenoble",
    type: "Santé",
    city: "Grenoble",
    address: "Boulevard de la Chantourne, 38700 La Tronche",
    contact: "Dir. Tech.",
    email: "technique@chu-grenoble.fr",
    phone: "04 76 76 75 75",
    notes: "Zones sensibles : prévenir la GTB avant toute coupure.",
    lastInt: "Aujourd'hui",
  },
  {
    id: "ibis-centre",
    name: "Hôtel Ibis Centre",
    type: "Hôtellerie",
    city: "Lyon 3e",
    address: "78 Rue de Bonnel, 69003 Lyon",
    contact: "M. Perrin",
    email: "reception@ibis-centre.fr",
    phone: "04 78 62 28 00",
    notes: "Contrat de maintenance annuel — 2 visites préventives.",
    lastInt: "Aujourd'hui",
  },
  {
    id: "les-pins",
    name: "Résidence Les Pins",
    type: "Résidentiel",
    city: "Lyon 8e",
    address: "8 Allée des Cèdres, 69008 Lyon",
    contact: "Syndic Foncia",
    email: "lyon@foncia.fr",
    phone: "04 78 55 09 21",
    notes: "Clé du local technique chez le gardien.",
    lastInt: "15/08/2026",
  },
]

/* ------------------------------------------------------------------ *
 * Parcs d'équipements
 * Les premières références sont nommées explicitement (elles sont
 * citées par les interventions), le reste du parc est complété par
 * famille pour atteindre la taille contractuelle.
 * ------------------------------------------------------------------ */

const PARK_SEED: Record<string, string[]> = {
  "mercure-lyon": ["Borne EVSE Type2 #1", "Borne EVSE Type2 #3", "Borne EVSE Type2 #5"],
  villeurbanne: ["Automate paiement P12"],
  "renault-flins": ["Capteur IoT Temp. Zone B"],
  "st-exupery": ["Automate paiement T2-A"],
  "chu-grenoble": ["Capteur IoT Humidité Salle 4"],
  "ibis-centre": ["Borne EVSE Type2 #1"],
  "les-pins": ["Borne AC 7kW #2"],
}

const PARK_SIZE: Record<string, number> = {
  "mercure-lyon": 4,
  villeurbanne: 7,
  "renault-flins": 23,
  "st-exupery": 12,
  "chu-grenoble": 8,
  "ibis-centre": 3,
  "les-pins": 3,
}

const FAMILIES: Record<string, { name: string; model: string }[]> = {
  Hôtellerie: [
    { name: "Borne EVSE Type2", model: "Schneider EVlink Pro AC 22 kW" },
    { name: "Borne AC 7kW", model: "Legrand Green'up Premium" },
  ],
  Collectivité: [
    { name: "Automate paiement P", model: "Parkeon Strada Evolution" },
    { name: "Borne EVSE Type2", model: "Schneider EVlink Pro AC 22 kW" },
  ],
  Industrie: [
    { name: "Capteur IoT Temp. Zone", model: "Siemens SIMATIC IOT2050" },
    { name: "Borne DC 50kW", model: "ABB Terra 54 HV" },
    { name: "Automate paiement P", model: "Parkeon Strada Evolution" },
  ],
  Transport: [
    { name: "Automate paiement T", model: "Parkeon Strada Evolution" },
    { name: "Borne EVSE Type2", model: "Schneider EVlink Pro AC 22 kW" },
  ],
  Santé: [
    { name: "Capteur IoT Humidité Salle", model: "Siemens SIMATIC IOT2050" },
    { name: "Borne AC 7kW", model: "Legrand Green'up Premium" },
  ],
  Résidentiel: [{ name: "Borne AC 7kW", model: "Legrand Green'up Premium" }],
}

const MODELS: Record<string, string> = {
  "Borne EVSE": "Schneider EVlink Pro AC 22 kW",
  "Borne AC": "Legrand Green'up Premium",
  "Borne DC": "ABB Terra 54 HV",
  "Automate paiement": "Parkeon Strada Evolution",
  "Capteur IoT": "Siemens SIMATIC IOT2050",
}

function modelFor(name: string): string {
  const match = Object.keys(MODELS).find(prefix => name.startsWith(prefix))
  return match ? MODELS[match] : "Modèle générique"
}

/** Statut déterministe : la démo reste identique à chaque rechargement. */
function statusFor(index: number): EquipmentStatus {
  if (index % 11 === 5) return "En panne"
  if (index % 7 === 3) return "Maintenance"
  return "En service"
}

function pad(value: number, size: number): string {
  return String(value).padStart(size, "0")
}

function buildPark(): Equipment[] {
  const park: Equipment[] = []
  let counter = 1

  for (const client of clients) {
    const seeds = PARK_SEED[client.id] ?? []
    const size = PARK_SIZE[client.id] ?? seeds.length
    const families = FAMILIES[client.type] ?? FAMILIES.Résidentiel
    const names = [...seeds]

    let familyIndex = 0
    let suffix = 1
    while (names.length < size) {
      const family = families[familyIndex % families.length]
      const candidate = `${family.name} #${suffix}`
      if (!names.includes(candidate)) names.push(candidate)
      familyIndex += 1
      if (familyIndex % families.length === 0) suffix += 1
    }

    names.forEach((name, index) => {
      park.push({
        id: `EQ-${pad(counter, 4)}`,
        clientId: client.id,
        name,
        model: modelFor(name),
        serial: `SN-${client.id.slice(0, 3).toUpperCase()}-${pad(1000 + counter, 4)}`,
        status: statusFor(counter),
        installedAt: `${pad((counter % 27) + 1, 2)}/${pad((counter % 12) + 1, 2)}/202${3 + (counter % 3)}`,
        lastMaintenance: `${pad((counter % 27) + 1, 2)}/0${1 + (counter % 8)}/2026`,
      })
      counter += 1
    })
  }

  return park
}

export const equipmentCatalogue: Equipment[] = buildPark()

function equipmentIdFor(clientId: string, name: string): string | null {
  const found = equipmentCatalogue.find(
    item => item.clientId === clientId && item.name === name,
  )
  return found ? found.id : null
}

export const interventions: Intervention[] = [
  {
    id: "INT-2841",
    clientId: "mercure-lyon",
    client: "Hôtel Mercure Lyon",
    equipmentId: equipmentIdFor("mercure-lyon", "Borne EVSE Type2 #3"),
    equipment: "Borne EVSE Type2 #3",
    tech: "A. Moreau",
    status: "En cours",
    date: "2026-09-03",
    time: "08:30",
    duration: "1 h 30",
    type: "Dépannage",
    priority: "haute",
    desc: "Borne hors service depuis 18h. Erreur E04 sur écran LCD.",
    report: null,
  },
  {
    id: "INT-2842",
    clientId: "villeurbanne",
    client: "Mairie de Villeurbanne",
    equipmentId: equipmentIdFor("villeurbanne", "Automate paiement P12"),
    equipment: "Automate paiement P12",
    tech: "C. Dubois",
    status: "En attente",
    date: "2026-09-03",
    time: "10:00",
    duration: "1 h 30",
    type: "Maintenance",
    priority: "normale",
    desc: "Contrôle semestriel de l'automate et test des paiements sans contact.",
    report: null,
  },
  {
    id: "INT-2843",
    clientId: "renault-flins",
    client: "Usine Renault Flins",
    equipmentId: equipmentIdFor("renault-flins", "Capteur IoT Temp. Zone B"),
    equipment: "Capteur IoT Temp. Zone B",
    tech: "M. Petit",
    status: "En attente",
    date: "2026-09-03",
    time: "11:30",
    duration: "3 h",
    type: "Installation",
    priority: "normale",
    desc: "Installation et calibration du capteur de température sur la zone B.",
    report: null,
  },
  {
    id: "INT-2844",
    clientId: "ibis-centre",
    client: "Hôtel Ibis Centre",
    equipmentId: equipmentIdFor("ibis-centre", "Borne EVSE Type2 #1"),
    equipment: "Borne EVSE Type2 #1",
    tech: "A. Moreau",
    status: "Clôturée",
    date: "2026-09-03",
    time: "07:00",
    duration: "45 min",
    type: "Maintenance",
    priority: "normale",
    desc: "Maintenance préventive annuelle et mise à jour firmware v2.4.1.",
    report:
      "Contrôle des serrages et test de charge 22 kW conforme. Firmware mis à jour en v2.4.1. Aucune anomalie relevée.",
  },
  {
    id: "INT-2845",
    clientId: "st-exupery",
    client: "Aéroport St-Exupéry",
    equipmentId: equipmentIdFor("st-exupery", "Automate paiement T2-A"),
    equipment: "Automate paiement T2-A",
    tech: "L. Bernard",
    status: "En cours",
    date: "2026-09-03",
    time: "09:15",
    duration: "3 h",
    type: "Dépannage",
    priority: "critique",
    desc: "Automate T2-A hors service — lecteur de carte bancaire non reconnu.",
    report: null,
  },
  {
    id: "INT-2846",
    clientId: "chu-grenoble",
    client: "CHU Grenoble",
    equipmentId: equipmentIdFor("chu-grenoble", "Capteur IoT Humidité Salle 4"),
    equipment: "Capteur IoT Humidité Salle 4",
    tech: "C. Dubois",
    status: "Clôturée",
    date: "2026-09-03",
    time: "06:45",
    duration: "45 min",
    type: "Dépannage",
    priority: "haute",
    desc: "Dérive des mesures d'humidité signalée par la GTB sur la salle 4.",
    report:
      "Sonde encrassée, nettoyage et recalibrage effectués. Écart ramené à 1,2 %. Remontée GTB vérifiée avec le service technique.",
  },
]

export const myInterventions: FieldIntervention[] = [
  {
    id: "INT-2841",
    client: "Hôtel Mercure Lyon",
    address: "12 Rue de la République, 69002 Lyon",
    equipment: "Borne EVSE Type2 #3",
    status: "En cours",
    time: "08:30",
    desc: "Borne hors service depuis 18h. Erreur E04 sur écran LCD.",
    priority: "haute",
    contact: "M. Girard — 04 72 00 12 45",
  },
  {
    id: "INT-2847",
    client: "Hôtel Mercure Lyon",
    address: "12 Rue de la République, 69002 Lyon",
    equipment: "Borne EVSE Type2 #5",
    status: "En attente",
    time: "13:00",
    desc: "Contrôle annuel + mise à jour firmware v2.4.1.",
    priority: "normale",
    contact: "M. Girard — 04 72 00 12 45",
  },
  {
    id: "INT-2849",
    client: "Résidence Les Pins",
    address: "8 Allée des Cèdres, 69008 Lyon",
    equipment: "Borne AC 7kW #2",
    status: "En attente",
    time: "15:30",
    desc: "Installation nouvelle borne client.",
    priority: "normale",
    contact: "Syndic Foncia — 04 78 55 09 21",
  },
]

export const typeBreakdown: { type: InterventionType; token: string }[] = [
  { type: "Dépannage", token: "var(--color-danger)" },
  { type: "Maintenance", token: "var(--color-brand)" },
  { type: "Installation", token: "var(--color-info)" },
]
