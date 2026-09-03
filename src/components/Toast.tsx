import { useEffect } from "react"
import { CheckIcon } from "./icons"
import { cx } from "./ui"
import { useStore } from "../lib/store"

/** Notification transitoire déclenchée par les actions du store. */
export default function Toast() {
  const { notice, dismissNotice } = useStore()

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(dismissNotice, 4200)
    return () => window.clearTimeout(timer)
  }, [notice, dismissNotice])

  if (!notice) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-rise pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div
        className={cx(
          "pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-2.5 shadow-raised backdrop-blur",
          notice.tone === "ok"
            ? "border-ok/30 bg-ok/12 text-ok"
            : "border-line-strong bg-elevated/95 text-ink",
        )}
      >
        <CheckIcon size={14} />
        <p className="text-xs font-medium">{notice.message}</p>
        <button
          type="button"
          onClick={dismissNotice}
          className="ml-2 text-[0.6875rem] opacity-60 transition-opacity hover:opacity-100"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
