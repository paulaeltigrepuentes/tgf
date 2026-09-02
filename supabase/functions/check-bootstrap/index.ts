// check-bootstrap: returns { needsBootstrap: boolean }
// Used by the frontend to determine whether to show the Bootstrap screen or the Login screen.
// Uses service_role to count users — bypasses RLS so it works for unauthenticated visitors.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { count, error } = await supabaseAdmin
      .from('users')
      .select('id', { count: 'exact', head: true })

    if (error) {
      return new Response(JSON.stringify({ needsBootstrap: false, error: 'count_failed' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ needsBootstrap: (count ?? 0) === 0 }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch {
    return new Response(JSON.stringify({ needsBootstrap: false, error: 'internal' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
