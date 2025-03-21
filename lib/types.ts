export interface SecretEntry {
    id: string
    title: string
    username: string
    password: string
    url?: string
    notes?: string
    created_at: string
    modified_at: string
    last_accessed: string
  }
  
  export interface Config {
    timeout: number
    key_derivation: string
    api_port: number
    enable_tls: boolean
    cert_file?: string
    key_file?: string

    //self added
    version : string
  }
  
  