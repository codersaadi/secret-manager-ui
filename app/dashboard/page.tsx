import { DashboardHeader } from "@/components/dashboard-header"
import { SecretsList } from "@/components/secret-list"
import { VaultStats } from "@/components/vault-status"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
          <div className="space-y-6">
            <SecretsList />
          </div>
          <div className="space-y-6">
            <VaultStats />
          </div>
        </div>
      </main>
    </div>
  )
}

