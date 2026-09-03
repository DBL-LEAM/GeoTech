import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { Tab } from "../components/Sidebar"
import type { View } from "../components/TopBar"

export type Route = {
  view: View
  tab: Tab
  /** Segments d'URL après l'onglet : identifiant, sous-écran… */
  params: string[]
}

export type Target = {
  view?: View
  tab?: Tab
  params?: string[]
}

const TABS: Tab[] = ["dashboard", "planning", "interventions", "clients"]

export const DEFAULT_ROUTE: Route = { view: "manager", tab: "dashboard", params: [] }

/** `#/manager/clients/mercure-lyon/equipements` → état de navigation. */
export function parseRoute(hash: string): Route {
  const segments = hash
    .replace(/^#\/?/, "")
    .split("/")
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean)

  if (segments[0] === "mobile") return { view: "mobile", tab: "dashboard", params: [] }

  const tab = TABS.find(candidate => candidate === segments[1])
  return {
    view: "manager",
    tab: tab ?? DEFAULT_ROUTE.tab,
    params: tab ? segments.slice(2) : [],
  }
}

export function formatRoute(route: Route): string {
  if (route.view === "mobile") return "#/mobile"
  const params = route.params.map(segment => encodeURIComponent(segment))
  return `#/manager/${[route.tab, ...params].join("/")}`
}

type Router = {
  route: Route
  navigate: (target: Target) => void
  back: () => void
}

const RouterContext = createContext<Router | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  /* L'URL initiale est normalisée sans créer d'entrée d'historique. */
  useEffect(() => {
    const canonical = formatRoute(parseRoute(window.location.hash))
    if (window.location.hash !== canonical) {
      window.history.replaceState(null, "", canonical)
    }
  }, [])

  const navigate = useCallback((target: Target) => {
    setRoute(current => {
      const next: Route = {
        view: target.view ?? current.view,
        tab: target.tab ?? current.tab,
        params: target.params ?? [],
      }
      const hash = formatRoute(next)
      if (window.location.hash !== hash) window.location.hash = hash
      return next
    })
  }, [])

  const back = useCallback(() => window.history.back(), [])

  const value = useMemo(() => ({ route, navigate, back }), [route, navigate, back])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): Router {
  const router = useContext(RouterContext)
  if (!router) throw new Error("useRouter doit être utilisé dans un RouterProvider")
  return router
}
