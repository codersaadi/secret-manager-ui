"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getSecrets, deleteSecret } from "@/lib/api"
import type { SecretEntry } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Search, Plus, MoreVertical, Edit, Trash2, Copy, ExternalLink } from "lucide-react"
import { AddSecretDialog } from "@/components/add-secret-dialog"
import { toast } from "sonner"
export function SecretsList() {
  const [secrets, setSecrets] = useState<SecretEntry[]>([])
  const [filteredSecrets, setFilteredSecrets] = useState<SecretEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Check if we should show the add dialog based on URL param
  useEffect(() => {
    if (searchParams?.get("new") === "true") {
      setShowAddDialog(true)
    }
  }, [searchParams])

  // Fetch secrets
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const data = await getSecrets(true) // hidePasswords=true for list view
        setSecrets(data)
        setFilteredSecrets(data)
      } catch (error) {
        toast("Failed to load secrets",)
      } finally {
        setLoading(false)
      }
    }

    fetchSecrets()
  }, [toast])

  // Filter secrets based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSecrets(secrets)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = secrets.filter(
        (secret) =>
          secret.title.toLowerCase().includes(query) ||
          secret.username.toLowerCase().includes(query) ||
          (secret.url && secret.url.toLowerCase().includes(query)),
      )
      setFilteredSecrets(filtered)
    }
  }, [searchQuery, secrets])

  const handleAddSecret = (newSecret: SecretEntry) => {
    setSecrets((prev) => [newSecret, ...prev])
    setShowAddDialog(false)
    // Remove the URL parameter
    router.replace("/dashboard")
  }

  const handleDeleteSecret = async (id: string) => {
    try {
      await deleteSecret(id)
      setSecrets((prev) => prev.filter((secret) => secret.id !== id))
      toast("Secret deleted successfully")
    } catch (error) {
     toast("Failed to Delete Secret")
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast("Copied to clipboard Successfully ")
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Your Secrets</CardTitle>
            <CardDescription>Manage your passwords and secure notes</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Secret
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search secrets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredSecrets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-4">No secrets found. Add your first secret to get started.</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Secret
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="hidden md:table-cell">Last Modified</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSecrets.map((secret) => (
                    <TableRow key={secret.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/secret/${secret.id}`} className="hover:underline">
                          {secret.title}
                        </Link>
                      </TableCell>
                      <TableCell>{secret.username}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(secret.modified_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(secret.username, "Username")}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Username
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/secret/${secret.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {secret.url && (
                              <DropdownMenuItem onClick={() => window.open(secret.url, "_blank")}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open URL
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteSecret(secret.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSecretDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddSecret} />
    </>
  )
}

