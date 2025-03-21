"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addSecret, generatePassword } from "@/lib/api"
import type { SecretEntry } from "@/lib/types"
import { Loader2, RefreshCw, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const secretSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
})

type SecretFormValues = z.infer<typeof secretSchema>

interface AddSecretDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (secret: SecretEntry) => void
}

export function AddSecretDialog({ open, onOpenChange, onAdd }: AddSecretDialogProps) {
  const [loading, setLoading] = useState(false)
  const [generatingPassword, setGeneratingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SecretFormValues>({
    resolver: zodResolver(secretSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      notes: "",
    },
  })

  const handleGeneratePassword = async () => {
    setGeneratingPassword(true)
    try {
      const data = await generatePassword()
      form.setValue("password", data.password)
    } catch (error) {
      toast(
      "Failed to generate password",
      )
    } finally {
      setGeneratingPassword(false)
    }
  }

  const onSubmit = async (values: SecretFormValues) => {
    setLoading(true)
    try {
      const newSecret = await addSecret(values)
      onAdd(newSecret)
      toast(
"Secret added successfully",
      )
      form.reset()
    } catch (error) {
      toast(
  "Failed to add secret",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Secret</DialogTitle>
          <DialogDescription>Add a new password or secure note to your vault</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gmail Account" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input placeholder="e.g., user@example.com" {...field} />
                  </FormControl>
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
                        <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...field} />
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
                  <FormControl>
                    <Input placeholder="e.g., https://example.com" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Add any additional notes here" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Secret"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

