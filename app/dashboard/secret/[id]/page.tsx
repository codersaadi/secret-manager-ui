"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { SecretDetail } from "@/components/secret-detail"
import { getSecret } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import type { SecretEntry } from "@/lib/types"
import { toast } from "sonner"

export default function SecretPage() {
  const params = useParams()
  const router = useRouter()
  const [secret, setSecret] = useState<SecretEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const id = params.id as string
        const data = await getSecret(id)
        setSecret(data)
      } catch (error) {
        toast(
    "Failed to load secret details",
        )
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchSecret()
  }, [params.id, router, toast])

  return (
    <div className="flex min-h-screen flex-col ">
      <DashboardHeader />
      <main className="flex-1 container py-6 ">
        {loading ? (
          <div className="space-y-4 max-w-lg">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
            <div className="grid gap-4 mt-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          secret && <div className="">
          <SecretDetail secret={secret} />
          </div>
        )}
      </main>
    </div>
  )
}

