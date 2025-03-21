"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { backupVault, restoreVault } from "@/lib/api"
import { Loader2, Download, Upload, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
const restoreSchema = z.object({
  backup_file: z.string().min(1, "Backup file name is required"),
})

export function SettingsBackup() {
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)

  const form = useForm<z.infer<typeof restoreSchema>>({
    resolver: zodResolver(restoreSchema),
    defaultValues: {
      backup_file: "",
    },
  })

  const handleBackup = async () => {
    setBackupLoading(true)
    try {
      const data = await backupVault()
      toast(`Backup created: ${data.backup_file}`)
    } catch (error) {
      toast( "Failed to create backup")
    } finally {
      setBackupLoading(false)
    }
  }

  const onRestore = async (values: z.infer<typeof restoreSchema>) => {
    setRestoreLoading(true)
    try {
      await restoreVault(values.backup_file)
      toast("Vault restored successfully. Please log in again.")
      // Force logout after restore
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_expiry")
      window.location.href = "/"
    } catch (error) {
      toast("Failed to restore vault")
    } finally {
      setRestoreLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup Vault</CardTitle>
          <CardDescription>Create a backup of your encrypted vault</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Backups are stored in the application's backup directory. The backup contains your encrypted vault data
              and can be used for recovery.
            </p>
            <Button onClick={handleBackup} disabled={backupLoading}>
              {backupLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restore Vault</CardTitle>
          <CardDescription>Restore your vault from a backup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Warning: Restoring will replace your current vault. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onRestore)} className="space-y-4">
              <FormField
                control={form.control}
                name="backup_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backup File Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., vault_backup_20230101_120000.json" {...field} />
                    </FormControl>
                    <FormDescription>Enter the name of the backup file to restore</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="outline" disabled={restoreLoading}>
                {restoreLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore Vault
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

