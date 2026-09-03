import Sidebar from "./components/Sidebar"
import type { Tab } from "./components/Sidebar"
import Toast from "./components/Toast"
import TopBar from "./components/TopBar"
import ClientEquipmentView from "./views/ClientEquipmentView"
import ClientFormView from "./views/ClientFormView"
import ClientsView from "./views/ClientsView"
import DashboardView from "./views/DashboardView"
import InterventionDetailView from "./views/InterventionDetailView"
import InterventionsView from "./views/InterventionsView"
import MobileView from "./views/MobileView"
import PlanningView from "./views/PlanningView"
import { RouterProvider, useRouter } from "./lib/router"
import { StoreProvider } from "./lib/store"

/** Aiguillage des sous-écrans d'un onglet manager. */
function ManagerScreen({ tab, params }: { tab: Tab; params: string[] }) {
  const [first, second] = params

  if (tab === "planning") return <PlanningView prefill={params} />

  if (tab === "interventions") {
    return first ? <InterventionDetailView id={first} /> : <InterventionsView />
  }

  if (tab === "clients") {
    if (first === "nouveau") return <ClientFormView />
    if (first && second === "modifier") return <ClientFormView clientId={first} />
    if (first) return <ClientEquipmentView clientId={first} />
    return <ClientsView />
  }

  return <DashboardView />
}

function Shell() {
  const { route, navigate } = useRouter()
  const { view, tab, params } = route

  return (
    <div className="surface-grid flex h-full flex-col bg-canvas text-ink">
      <TopBar view={view} onViewChange={next => navigate({ view: next, tab: "dashboard", params: [] })} />

      {view === "manager" ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar tab={tab} onTabChange={next => navigate({ tab: next, params: [] })} />
          <main className="scroll-slim flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">
              <ManagerScreen tab={tab} params={params} />
            </div>
          </main>
        </div>
      ) : (
        <MobileView />
      )}

      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <Shell />
      </RouterProvider>
    </StoreProvider>
  )
}
