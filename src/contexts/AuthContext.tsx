import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Session, type User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { AuthUser, LoginResponse } from '@/types/auth';

const EDGE_FUNCTION_URL = 'https://xudfyebrdskuyqmcnops.supabase.co/functions/v1/auth-login'

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isGerencial: boolean;
  isAdminOrPricing: boolean;
  roleName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Load session on mount
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        setSession(currentSession)
        // Fetch user profile
        const profile = await fetchUserProfile(currentSession.access_token)
        if (profile) setUser(profile)
      }
      setLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        const profile = await fetchUserProfile(newSession.access_token)
        if (profile) setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (accessToken: string): Promise<AuthUser | null> => {
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username: '__PROFILE_LOOKUP__', password: '__DUMMY__' }),
      })
      // We just need the user info from the session, not a full login
      // Use direct profile fetch instead
      return null // Will be fetched via Supabase query
    } catch {
      return null
    }
  }

  const signIn = async (username: string, password: string): Promise<{ error?: string }> => {
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data: LoginResponse & { error?: string } = await response.json()

      if (!response.ok || data.error) {
        return { error: data.error || 'Error al iniciar sesión' }
      }

      // Set the session in Supabase client
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })

      if (sessionError) {
        return { error: 'Error al establecer la sesión' }
      }

      setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
        token_type: 'bearer',
        user: {
          id: data.user.id,
          aud: '',
          role: '',
          email: '',
          email_confirmed_at: '',
          last_sign_in_at: '',
          app_metadata: {},
          user_metadata: { username: data.user.username, full_name: data.user.full_name },
          created_at: '',
          updated_at: '',
        } as SupabaseUser,
      })
      setUser(data.user)
      return {}
    } catch (err) {
      console.error('Login error:', err)
      return { error: 'Error de conexión. Intente nuevamente.' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
  }

  const roleName = user?.role?.name ?? null
  const isGerencial = roleName === 'gerencial'
  const isAdminOrPricing = roleName === 'gerencial' || roleName === 'pricing'

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signIn, signOut,
      isGerencial, isAdminOrPricing, roleName
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
