import { useState } from "react"
import {
  ArrowLeftIcon,
  BatteryIcon,
  BellIcon,
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  PhoneIcon,
  SignalIcon,
  UserIcon,
} from "../components/icons"
import {
  Avatar,
  Badge,
  Button,
  cx,
  PriorityBadge,
  StatusBadge,
} from "../components/ui"
import { myInterventions } from "../lib/data"
import type { Status } from "../lib/data"
import { STATUS_ORDER, statusStep, statusTone } from "../lib/status"
import { useStore } from "../lib/store"

const CHECKLIST = [
  "Diagnostic réalisé",
  "Pièces remplacées",
  "Tests de charge validés",
  "Client informé",
]

export default function MobileView() {
  const { fieldStatuses: statuses, setFieldStatus: onStatusChange } = useStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [report, setReport] = useState("")
  const [checked, setChecked] = useState<string[]>([])

  const active = myInterventions.find((item) => item.id === selectedId)
  const statusOf = (id: string, fallback: Status) => statuses[id] ?? fallback

  const counters = [
    {
      value: myInterventions.length,
      label: "Assignées",
      className: "text-ink",
    },
    {
      value: myInterventions.filter(
        (item) => statusOf(item.id, item.status) === "En cours",
      ).length,
      label: "En cours",
      className: "text-info",
    },
    {
      value: myInterventions.filter(
        (item) => statusOf(item.id, item.status) === "Clôturée",
      ).length,
      label: "Clôturées",
      className: "text-ok",
    },
  ]

  function goBack() {
    setSelectedId(null)
    setReportOpen(false)
    setReport("")
    setChecked([])
  }

  function toggleCheck(item: string) {
    setChecked((prev) =>
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item],
    )
  }

  return (
    <div className="surface-grid flex flex-1 items-start justify-center overflow-y-auto px-4 py-8">
      <div className="flex w-full max-w-[26rem] flex-col items-center gap-4">
        {/* Châssis */}
        <div className="w-full rounded-[2.25rem] border border-white/[0.06] bg-[#05070b] p-2 shadow-phone">
          <div className="relative flex h-[41rem] flex-col overflow-hidden rounded-[1.85rem] bg-surface">
            {/* Barre d'état */}
            <div className="relative z-20 flex shrink-0 items-center justify-between bg-sunken px-5 py-2 text-ink-soft">
              <span className="num font-mono text-[0.6875rem] font-medium">
                09:42
              </span>
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#05070b]"
              />
              <span className="flex items-center gap-1.5 text-ink-muted">
                <SignalIcon size={12} />
                <span className="font-mono text-[0.625rem]">4G</span>
                <BatteryIcon size={14} />
              </span>
            </div>

            {!active ? (
              /* ------------------------------------------------ Planning */
              <div className="scroll-slim flex-1 overflow-y-auto">
                <header className="border-b border-line px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name="Alexandre Moreau" size={38} accent />
                    <div className="min-w-0">
                      <p className="eyebrow">Technicien</p>
                      <p className="truncate text-sm font-bold">
                        Alexandre Moreau
                      </p>
                      <p className="truncate text-[0.6875rem] text-ink-muted">
                        Secteur Lyon Centre & Périphérie
                      </p>
                    </div>
                  </div>
                </header>

                <div className="border-b border-line px-4 py-3">
                  <p className="eyebrow mb-2">Mon planning — jeu. 3 sept.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {counters.map((counter) => (
                      <div
                        key={counter.label}
                        className="rounded-lg border border-line bg-sunken px-2 py-2 text-center"
                      >
                        <p
                          className={cx(
                            "num text-lg leading-none font-bold",
                            counter.className,
                          )}
                        >
                          {counter.value}
                        </p>
                        <p className="mt-1 text-[0.625rem] text-ink-muted">
                          {counter.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="space-y-2.5 p-4">
                  {myInterventions.map((item) => {
                    const status = statusOf(item.id, item.status)
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className="group w-full rounded-xl border border-line bg-sunken p-3 text-left transition-colors duration-150 hover:border-brand/40"
                        >
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span className="num font-mono text-[0.6875rem] font-medium text-brand">
                              {item.id}
                            </span>
                            <span className="num flex items-center gap-1 font-mono text-[0.6875rem] text-ink-muted">
                              <ClockIcon size={11} />
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[0.8125rem] font-semibold">
                            {item.client}
                          </p>
                          <p className="mt-0.5 truncate text-[0.6875rem] text-ink-muted">
                            {item.equipment}
                          </p>
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <StatusBadge status={status} live />
                            <PriorityBadge priority={item.priority} />
                            <ChevronRightIcon
                              size={14}
                              className="ml-auto text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5"
                            />
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : (
              /* -------------------------------------------------- Détail */
              <div className="scroll-slim flex-1 overflow-y-auto">
                <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-surface/95 px-3 py-2.5 backdrop-blur">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex size-8 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                    aria-label="Retour au planning"
                  >
                    <ArrowLeftIcon size={15} />
                  </button>
                  <span className="num font-mono text-xs font-medium text-brand">
                    {active.id}
                  </span>
                  <span className="ml-auto">
                    <StatusBadge
                      status={statusOf(active.id, active.status)}
                      live
                    />
                  </span>
                </header>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-sm font-bold">{active.client}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-[0.6875rem] leading-relaxed text-ink-muted">
                      <MapPinIcon size={12} className="mt-px shrink-0" />
                      {active.address}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" icon={<MapPinIcon size={13} />} block>
                      Itinéraire
                    </Button>
                    <Button size="sm" icon={<PhoneIcon size={13} />} block>
                      Appeler
                    </Button>
                  </div>

                  {/* Cycle de vie */}
                  <ol className="flex items-center gap-1.5 rounded-xl border border-line bg-sunken p-3">
                    {STATUS_ORDER.map((step, index) => {
                      const current = statusStep(
                        statusOf(active.id, active.status),
                      )
                      const reached = index <= current
                      return (
                        <li
                          key={step}
                          className="flex flex-1 flex-col items-center gap-1.5"
                        >
                          <div className="flex w-full items-center gap-1.5">
                            <span
                              className={cx(
                                "size-2 shrink-0 rounded-full transition-colors duration-300",
                                reached
                                  ? statusTone[step].dot
                                  : "bg-line-strong",
                              )}
                            />
                            {index < STATUS_ORDER.length - 1 ? (
                              <span
                                className={cx(
                                  "h-px flex-1 transition-colors duration-300",
                                  index < current
                                    ? "bg-ok/60"
                                    : "bg-line-strong",
                                )}
                              />
                            ) : null}
                          </div>
                          <span
                            className={cx(
                              "w-full text-left text-[0.625rem]",
                              reached ? "text-ink-soft" : "text-ink-faint",
                            )}
                          >
                            {step}
                          </span>
                        </li>
                      )
                    })}
                  </ol>

                  <dl className="space-y-2">
                    <div className="rounded-xl border border-line bg-sunken p-3">
                      <dt className="eyebrow mb-1">Équipement</dt>
                      <dd className="text-[0.8125rem]">{active.equipment}</dd>
                    </div>
                    <div className="rounded-xl border border-line bg-sunken p-3">
                      <dt className="eyebrow mb-1">Description</dt>
                      <dd className="text-[0.8125rem] leading-relaxed">
                        {active.desc}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-line bg-sunken p-3">
                      <div>
                        <dt className="eyebrow mb-1">Contact sur site</dt>
                        <dd className="text-[0.6875rem] text-ink-soft">
                          {active.contact}
                        </dd>
                      </div>
                      <Badge className="num border-line-strong bg-white/[0.04] font-mono text-ink-muted">
                        {active.time}
                      </Badge>
                    </div>
                  </dl>

                  {/* Actions terrain */}
                  {statusOf(active.id, active.status) === "Clôturée" ? (
                    <div className="rounded-xl border border-ok/25 bg-ok/[0.07] p-3">
                      <p className="mb-1 flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.12em] text-ok uppercase">
                        <CheckIcon size={12} />
                        Rapport clôturé
                      </p>
                      <p className="text-[0.6875rem] leading-relaxed text-ink-muted">
                        Cette intervention est verrouillée. Le rapport ne peut
                        plus être modifié et a été transmis au responsable de
                        planification.
                      </p>
                    </div>
                  ) : statusOf(active.id, active.status) === "En attente" ? (
                    <Button
                      variant="primary"
                      size="lg"
                      block
                      icon={<MapPinIcon size={15} />}
                      onClick={() => onStatusChange(active.id, "En cours")}
                    >
                      Prendre en charge — arrivée sur site
                    </Button>
                  ) : !reportOpen ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      block
                      icon={<FileTextIcon size={15} />}
                      onClick={() => setReportOpen(true)}
                    >
                      Rédiger le rapport de fin de mission
                    </Button>
                  ) : (
                    <div className="space-y-3 rounded-xl border border-line bg-sunken p-3">
                      <p className="eyebrow">Compte-rendu d'intervention</p>

                      <ul className="space-y-1.5">
                        {CHECKLIST.map((item) => {
                          const isChecked = checked.includes(item)
                          return (
                            <li key={item}>
                              <button
                                type="button"
                                onClick={() => toggleCheck(item)}
                                aria-pressed={isChecked}
                                className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition-colors hover:bg-white/[0.03]"
                              >
                                <span
                                  className={cx(
                                    "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                                    isChecked
                                      ? "border-ok bg-ok text-sunken"
                                      : "border-line-strong text-transparent",
                                  )}
                                >
                                  <CheckIcon size={10} />
                                </span>
                                <span
                                  className={cx(
                                    "text-[0.6875rem]",
                                    isChecked ? "text-ink" : "text-ink-muted",
                                  )}
                                >
                                  {item}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>

                      <label htmlFor="report" className="sr-only">
                        Compte-rendu
                      </label>
                      <textarea
                        id="report"
                        rows={4}
                        value={report}
                        onChange={(event) => setReport(event.target.value)}
                        placeholder="Décrire les travaux effectués, pièces remplacées, tests réalisés…"
                        className="field resize-none text-[0.8125rem] leading-relaxed"
                      />

                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong py-2 text-[0.6875rem] text-ink-muted transition-colors hover:border-ink-faint hover:text-ink-soft"
                      >
                        <CameraIcon size={14} />
                        Ajouter une photo (0/3)
                      </button>

                      <Button
                        variant="success"
                        size="lg"
                        block
                        disabled={report.trim().length === 0}
                        onClick={() => {
                          if (!report.trim()) return
                          onStatusChange(active.id, "Clôturée")
                          setReportOpen(false)
                        }}
                      >
                        Clôturer l'intervention
                      </Button>
                      <p className="text-center font-mono text-[0.5625rem] text-ink-faint">
                        La clôture verrouille définitivement le rapport
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation basse */}
            <nav
              aria-label="Navigation mobile"
              className="flex shrink-0 items-center justify-around border-t border-line bg-sunken px-4 pt-2 pb-3"
            >
              {[
                { label: "Planning", icon: CalendarIcon, active: true },
                { label: "Alertes", icon: BellIcon, active: false },
                { label: "Profil", icon: UserIcon, active: false },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={cx(
                      "flex flex-col items-center gap-1 rounded-lg px-4 py-1 transition-colors",
                      item.active
                        ? "text-brand"
                        : "text-ink-faint hover:text-ink-muted",
                    )}
                  >
                    <Icon size={17} />
                    <span className="font-mono text-[0.5625rem] tracking-wide uppercase">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        <p className="text-center font-mono text-[0.625rem] text-ink-faint">
          Application terrain — mode hors-ligne pris en charge, synchronisation
          dès retour réseau
        </p>
      </div>
    </div>
  )
}
