import type { InterventionType, Priority, Status } from "./data"

type Tone = {
  /** Pastille + bordure + fond de badge */
  badge: string
  /** Couleur de la pastille */
  dot: string
  /** Couleur pleine (barres, accents) */
  solid: string
}

export const statusTone: Record<Status, Tone> = {
  "En attente": {
    badge: "text-warn border-warn/25 bg-warn/10",
    dot: "bg-warn",
    solid: "var(--color-warn)",
  },
  "En cours": {
    badge: "text-info border-info/25 bg-info/10",
    dot: "bg-info",
    solid: "var(--color-info)",
  },
  Clôturée: {
    badge: "text-ok border-ok/25 bg-ok/10",
    dot: "bg-ok",
    solid: "var(--color-ok)",
  },
}

export const priorityTone: Record<Priority, string> = {
  critique: "text-danger border-danger/30 bg-danger/10",
  haute: "text-brand-bright border-brand/30 bg-brand/10",
  normale: "text-ink-muted border-line-strong bg-white/[0.03]",
}

export const typeTone: Record<InterventionType, string> = {
  Dépannage: "text-danger/90 bg-danger/8 border-danger/20",
  Maintenance: "text-brand-bright/90 bg-brand/8 border-brand/20",
  Installation: "text-info/90 bg-info/8 border-info/20",
}

export const STATUS_ORDER: Status[] = ["En attente", "En cours", "Clôturée"]

/** Étape courante dans le cycle de vie d'une intervention (0-indexé). */
export function statusStep(status: Status): number {
  return STATUS_ORDER.indexOf(status)
}

export function initials(name: string): string {
  return name
    .replace(/[^\p{L}\s.-]/gu, "")
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
