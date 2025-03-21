"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsGeneral } from "@/components/settings-general"
import { SettingsSecurity } from "@/components/settings-security"
import { SettingsBackup } from "@/components/settings-backup"
import { getConfig } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideSettings, LucideShieldAlert, LucideArchive } from "lucide-react"
import type { Config } from "@/lib/types"
import { toast } from "sonner"

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig()
        setConfig({...data , version : "v2.0.0"})
      } catch (error) {
        toast(
           "Failed to load settings. Please try again.",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const tabItems = [
    { value: "general", label: "General", icon: <LucideSettings className="h-4 w-4 mr-2" /> },
    { value: "security", label: "Security", icon: <LucideShieldAlert className="h-4 w-4 mr-2" /> },
    { value: "backup", label: "Backup & Restore", icon: <LucideArchive className="h-4 w-4 mr-2" /> },
  ]

  return (
    <div className="flex min-h-screen flex-col ">
      <DashboardHeader />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground mt-1">Manage your vault settings and preferences</p>
            </div>
            <Badge variant="outline" className="bg-muted">
              {config?.version || "v2.0.0"}
            </Badge>
          </div>

          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-[180px]" />
                <Skeleton className="h-4 w-[250px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            config && (
              <Card className="">
                <CardHeader className="pb-4">
                  <CardTitle>Configuration Settings</CardTitle>
                  <CardDescription>Update your preferences and security options</CardDescription>
                </CardHeader>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 p-1 rounded-none border-b">
                    {tabItems.map((tab) => (
                      <TabsTrigger 
                        key={tab.value} 
                        value={tab.value}
                        className="flex items-center gap-1 "
                      >
                        {tab.icon}
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <CardContent className="pt-6">
                    <TabsContent value="general" className="mt-0">
                      <SettingsGeneral config={config} setConfig={setConfig} />
                    </TabsContent>
                    <TabsContent value="security" className="mt-0">
                      <SettingsSecurity config={config} setConfig={setConfig} />
                    </TabsContent>
                    <TabsContent value="backup" className="mt-0">
                      <SettingsBackup />
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            )
          )}
        </div>
      </main>
    </div>
  )
}