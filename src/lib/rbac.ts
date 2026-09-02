// RBAC helpers - solo consultan el rol del usuario autenticado
import { useAuth } from '@/contexts/AuthContext'

export function useRole() {
  const { roleName, isGerencial, isAdminOrPricing } = useAuth()
  return { roleName, isGerencial, isAdminOrPricing }
}

export function canAccessAdminPanel(roleName: string | null): boolean {
  return roleName === 'gerencial'
}

export function canManageUsers(roleName: string | null): boolean {
  return roleName === 'gerencial'
}

export function canManageParameters(roleName: string | null): boolean {
  return roleName === 'gerencial' || roleName === 'pricing'
}

export function canCreateQuotes(roleName: string | null): boolean {
  return roleName === 'gerencial' || roleName === 'pricing' || roleName === 'comercial'
}
