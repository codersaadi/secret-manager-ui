"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateSecret, deleteSecret, generatePassword } from "@/lib/api"
import type { SecretEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Loader2, RefreshCw, Eye, EyeOff, Copy, ExternalLink, Trash2 } from "lucide-react"
import { toast } from "sonner"

const secretSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
})

type SecretFormValues = z.infer<typeof secretSchema>

interface SecretDetailProps {
  secret: SecretEntry
}

export function SecretDetail({ secret }: SecretDetailProps) {
  const [loading, setLoading] = useState(false)
  const [generatingPassword, setGeneratingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<SecretFormValues>({
    resolver: zodResolver(secretSchema),
    defaultValues: {
      title: secret.title,
      username: secret.username,
      password: secret.password,
      url: secret.url || "",
      notes: secret.notes || "",
    },
  })

  const handleGeneratePassword = async () => {
    setGeneratingPassword(true)
    try {
      const data = await generatePassword()
      form.setValue("password", data.password)
    } catch (error) {
    //   toast({
    
    //     title: "Error",
    //     description: "Failed to generate password",
    //     variant: "destructive",
    //   })
    } finally {
      setGeneratingPassword(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    // toast({
    //   title: "Copied",
    //   description: `${label} copied to clipboard`,
    // })
  }

  const handleDelete = async () => {
    try {
      await deleteSecret(secret.id)
    //   toast({
      
    //     description: "Secret deleted successfully",
    //   })
      router.push("/dashboard")
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to delete secret",
    //     variant: "destructive",
    //   })
    }
  }

  const onSubmit = async (values: SecretFormValues) => {
    setLoading(true)
    try {
      await updateSecret(secret.id, values)
    //   toast({
    //     title: "Success",
    //     description: "Secret updated successfully",
    //   })
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update secret",
    //     variant: "destructive",
    //   })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{secret.title}</CardTitle>SecretDetail
        <CardDescription>
          Created {formatDate(secret.created_at)} • Last modified {formatDate(secret.modified_at)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username / Email</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(field.value || "", "Username")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(field.value || "", "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGeneratePassword}
                      disabled={generatingPassword}
                    >
                      {generatingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(field.value, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px] resize-none" {...field} />
                  </FormControl>
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
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Vault
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Secret
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this secret from your vault.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

