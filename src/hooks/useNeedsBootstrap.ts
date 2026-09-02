import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

/**
 * Hook to determine if the system needs bootstrap (no users in public.users).
 * Checks on mount; if any user exists, bootstrap is not needed.
 */
export function useNeedsBootstrap() {
  const [needsBootstrap, setNeedsBootstrap] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      // Use a lightweight COUNT query — no RLS required for this check
      const { count, error } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })

      if (error) {
        // If we can't determine, assume no bootstrap needed (fallback to login)
        setNeedsBootstrap(false)
      } else {
        setNeedsBootstrap(count === 0)
      }
      setLoading(false)
    }

    check()
  }, [])

  return { needsBootstrap, loading }
}
