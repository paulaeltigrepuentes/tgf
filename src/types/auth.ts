export type RoleName = 'gerencial' | 'pricing' | 'comercial' | 'logistica'

export interface AuthUser {
  id: string
  username: string
  full_name: string
  role: {
    id: string
    name: RoleName
    description: string | null
  } | null
  active: boolean
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
}

export interface LoginResponse {
  user: AuthUser
  session: AuthSession
}

export interface ManagedUser {
  id: string
  username: string
  full_name: string
  role_id: string
  active: boolean
  created_at: string
  last_login_at: string | null
  role: {
    name: RoleName
    description: string | null
  } | null
}

export interface RoleInfo {
  id: string
  name: RoleName
  description: string | null
}
