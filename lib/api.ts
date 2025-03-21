import type { SecretEntry, Config } from "@/lib/types"

const API_BASE_URL = "http://localhost:3200/api"

// Helper function to get the auth token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Helper function for API requests
async function apiRequest<T>(endpoint: string, method = "GET", data?: unknown): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "API request failed")
  }

  const responseData = await response.json()

  if (!responseData.success) {
    throw new Error(responseData.message || "API request failed")
  }

  return responseData.data
}

// Auth API
export const checkHealth = async (): Promise<{ vaultExists: boolean; version: string; status: string }> => {
  return apiRequest("/health")
}

export const authenticate = async (password: string): Promise<{ token: string; expiry: Date; timeout_min: number }> => {
  const data = await apiRequest<{ token: string; expiry: string; timeout_min: number }>("/auth", "POST", { password })
  return {
    ...data,
    expiry: new Date(data.expiry),
  }
}

export const initVault = async (password: string): Promise<{ token: string; expiry: Date; timeout_min: number }> => {
  const data = await apiRequest<{ token: string; expiry: string; timeout_min: number }>("/init", "POST", { password })
  return {
    ...data,
    expiry: new Date(data.expiry),
  }
}

export const logout = async (): Promise<void> => {
  await apiRequest("/logout", "POST")
}

// Secrets API
export const getSecrets = async (hidePasswords = false): Promise<SecretEntry[]> => {
  return apiRequest(`/secrets?hidePasswords=${hidePasswords}`)
}

export const getSecret = async (id: string): Promise<SecretEntry> => {
  return apiRequest(`/secrets/${id}`)
}

export const addSecret = async (secret: Partial<SecretEntry>): Promise<SecretEntry> => {
  return apiRequest("/secrets", "POST", secret)
}

export const updateSecret = async (id: string, secret: Partial<SecretEntry>): Promise<SecretEntry> => {
  return apiRequest(`/secrets/${id}`, "PUT", secret)
}

export const deleteSecret = async (id: string): Promise<void> => {
  await apiRequest(`/secrets/${id}`, "DELETE")
}

// Password Generator API
export const generatePassword = async (
  length = 16,
  upper = true,
  lower = true,
  digits = true,
  special = true,
): Promise<{ password: string; length: number }> => {
  const params = new URLSearchParams({
    length: length.toString(),
    upper: upper.toString(),
    lower: lower.toString(),
    digits: digits.toString(),
    special: special.toString(),
  })
  return apiRequest(`/generate-password?${params.toString()}`)
}

// Vault Management API
export const getVaultHealth = async (): Promise<{
  total_entries: number
  issues: string[]
  warnings: string[]
  status: "empty" | "good" | "warning" | "critical"
}> => {
  return apiRequest("/vault/health")
}

export const backupVault = async (): Promise<{
  backup_file: string
  backup_time: string
  backup_path: string
}> => {
  return apiRequest("/vault/backup", "POST")
}

export const restoreVault = async (
  backup_file: string,
): Promise<{
  backup_file: string
  restore_time: string
}> => {
  return apiRequest("/vault/restore", "POST", { backup_file })
}

export const changePassword = async (current_password: string, new_password: string): Promise<void> => {
  await apiRequest("/vault/change-password", "POST", {
    current_password,
    new_password,
  })
}

// Config API
export const getConfig = async (): Promise<Config> => {
  return apiRequest("/admin/config")
}

export const updateConfig = async (config: Partial<Config>): Promise<Config> => {
  return apiRequest("/admin/config", "PUT", config)
}

