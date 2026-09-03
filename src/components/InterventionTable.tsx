import type { Intervention } from "../lib/data"

import { typeTone } from "../lib/status"

import { ChevronRightIcon, SearchIcon } from "./icons"

import { Avatar, Badge, cx, EmptyState, PriorityBadge, StatusBadge } from "./ui"

const HEAD_CLASS =
  "sticky top-0 z-10 bg-elevated/95 px-4 py-2.5 text-left font-mono text-[0.625rem] font-medium tracking-[0.09em] whitespace-nowrap text-ink-muted uppercase backdrop-blur"

export default function InterventionTable({
  rows,

  showDate = false,

  showActions = false,

  onSelect,
}: {
  rows: Intervention[]

  showDate?: boolean

  showActions?: boolean

  onSelect?: (intervention: Intervention) => void
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<SearchIcon size={18} />}
        title="Aucune intervention"
        description="Aucune fiche ne correspond aux filtres sélectionnés. Ajustez la recherche ou le statut."
      />
    )
  }

  return (
    <div className="scroll-slim overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={HEAD_CLASS}>
              Réf.
            </th>
            <th scope="col" className={HEAD_CLASS}>
              {showDate ? "Date" : "Heure"}
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Client
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Équipement
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Type
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Technicien
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Priorité
            </th>
            <th scope="col" className={HEAD_CLASS}>
              Statut
            </th>
            {showActions ? (
              <th scope="col" className={cx(HEAD_CLASS, "text-right")}>
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={0}
              onClick={() => onSelect?.(row)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSelect?.(row)
              }}
              className="group cursor-pointer border-b border-line/70 transition-colors last:border-b-0 hover:bg-white/[0.025] focus-visible:bg-white/[0.03]"
            >
              <th
                scope="row"
                className="num px-4 py-3 font-mono text-xs font-medium whitespace-nowrap text-brand"
              >
                {row.id}
              </th>
              <td className="num px-4 py-3 font-mono text-xs whitespace-nowrap text-ink-muted">
                {showDate ? `03/09 · ${row.time}` : row.time}
              </td>
              <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap text-ink">
                {row.client}
              </td>
              <td className="max-w-[15rem] truncate px-4 py-3 text-xs text-ink-muted">
                {row.equipment}
              </td>
              <td className="px-4 py-3">
                <Badge className={cx("text-[0.625rem]", typeTone[row.type])}>
                  {row.type}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-2 text-xs whitespace-nowrap text-ink-soft">
                  <Avatar name={row.tech} size={22} />
                  {row.tech}
                </span>
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={row.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} live />
              </td>
              {showActions ? (
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[0.6875rem] text-ink-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Ouvrir
                    <ChevronRightIcon size={12} />
                  </span>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
