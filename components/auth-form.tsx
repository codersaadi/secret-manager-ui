"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authenticate, initVault, checkHealth } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
const authSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [vaultExists, setVaultExists] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      password: "",
    },
  })

  // Check if vault exists
  useEffect(() => {
    const checkVaultStatus = async () => {
      try {
        const health = await checkHealth()
        setVaultExists(health.vaultExists)
      } catch (error) {
        toast(
         "Failed to check vault status",
        )
      } finally {
        setChecking(false)
      }
    }

    checkVaultStatus()
  }, []) // Empty dependency array means this runs once on mount

  async function onSubmit(values: z.infer<typeof authSchema>) {
    setLoading(true)
    try {
      if (vaultExists) {
        // Login to existing vault
        const data = await authenticate(values.password)
        login(data.token, data.expiry)
        router.push("/dashboard")
      } else {
        // Create new vault
        const data = await initVault(values.password)
        login(data.token, data.expiry)
        router.push("/dashboard")
      }
    } catch (error) {
      toast(vaultExists ? "Invalid password" : "Failed to create vault")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Tabs defaultValue={vaultExists ? "unlock" : "create"} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="unlock" disabled={!vaultExists}>
          Unlock Vault
        </TabsTrigger>
        <TabsTrigger value="create" disabled={!!vaultExists}>
          Create Vault
        </TabsTrigger>
      </TabsList>
      <TabsContent value="unlock">
        <div className="space-y-4 p-4 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Master Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your master password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock Vault"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="create">
        <div className="space-y-4 p-4 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Master Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a strong master password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Vault"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-xs text-muted-foreground text-center">
            Your master password is used to encrypt your vault. Make sure it's strong and memorable. It cannot be
            recovered if lost.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

