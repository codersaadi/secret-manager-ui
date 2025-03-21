"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getVaultHealth } from "@/lib/api"
import { AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface VaultHealth {
  total_entries: number
  issues: string[]
  warnings: string[]
  status: "empty" | "good" | "warning" | "critical"
}

export function VaultStats() {
  const [health, setHealth] = useState<VaultHealth | null>(null)
const [loading , setLoading] = useState(true)
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getVaultHealth()
        setHealth(data)
      } catch (_err) {
        toast("Failed to load vault health")
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [toast])

  const getStatusIcon = () => {
    if (!health) return null

    switch (health.status) {
      case "good":
        return <ShieldCheck className="h-6 w-6 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "critical":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    if (!health) return ""

    switch (health.status) {
      case "empty":
        return "No secrets stored"
      case "good":
        return "All secrets are secure"
      case "warning":
        return "Some improvements suggested"
      case "critical":
        return "Security issues detected"
      default:
        return ""
    }
  }

  const getStatusColor = () => {
    if (!health) return ""

    switch (health.status) {
      case "good":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vault Health</CardTitle>
        <CardDescription>Security status of your vault</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : health ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <div>
                <div className="font-medium">{getStatusText()}</div>
                <div className="text-sm text-muted-foreground">{health.total_entries} secrets stored</div>
              </div>
            </div>

            {health.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-500 dark:text-red-400">Issues</h4>
                <ul className="space-y-1 text-sm">
                  {health.issues.map((issue, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {health.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-amber-500 dark:text-amber-400">Warnings</h4>
                <ul className="space-y-1 text-sm">
                  {health.warnings.map((warning, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {health.status !== "empty" && health.issues.length === 0 && health.warnings.length === 0 && (
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">Your vault is secure</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">Unable to load vault health</div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/settings">Manage Settings</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

