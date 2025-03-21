"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateConfig } from "@/lib/api"
import type { Config } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const generalSettingsSchema = z.object({
  timeout: z.coerce
    .number()
    .int()
    .min(1, "Timeout must be at least 1 minute")
    .max(60, "Timeout must be at most 60 minutes"),
  api_port: z.coerce.number().int().min(1024, "Port must be at least 1024").max(65535, "Port must be at most 65535"),
})

interface SettingsGeneralProps {
  config: Config
  setConfig: (config: Config) => void
}

export function SettingsGeneral({ config, setConfig }: SettingsGeneralProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      timeout: config.timeout,
      api_port: config.api_port,
    },
  })

  const onSubmit = async (values: z.infer<typeof generalSettingsSchema>) => {
    setLoading(true)
    try {
      const updatedConfig = await updateConfig(values)
      setConfig({ ...config, ...updatedConfig })
      toast("Settings updated successfully")
    } catch (error) {
      toast("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage general application settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="timeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto-Logout Timeout (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Time of inactivity before automatic logout</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="api_port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Port</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Port for the API server (requires restart)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

