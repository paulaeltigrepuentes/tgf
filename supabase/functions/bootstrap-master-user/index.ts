// Bootstrap master user — one-time endpoint to create the initial gerencial user.
// SECURITY:
//  - Requires BOOTSTRAP_SECRET from server-side env (Deno.env). NOT exposed to the frontend.
//  - Rejects execution if ANY user with role 'gerencial' already exists (one-shot guard).
//  - Never logs the password.
//  - Supabase Auth handles bcrypt hashing internally.
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
    const body = await req.json()
    const { username, full_name, password } = body

    // 1) Validate input
    if (!username || !full_name || !password) {
      return new Response(JSON.stringify({ error: 'username, full_name, password are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
      return new Response(JSON.stringify({ error: 'Invalid username format' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Only the hardcoded master username is allowed via this endpoint
    if (username !== 'jpuerta') {
      return new Response(JSON.stringify({ error: 'Invalid bootstrap username' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 2) ONE-SHOT GUARD: if any gerencial user already exists, reject
    const { data: existingGerencial } = await supabaseAdmin
      .from('users')
      .select('id, role:roles!inner(name)')
      .eq('role.name', 'gerencial')
      .limit(1)

    if (existingGerencial && existingGerencial.length > 0) {
      return new Response(JSON.stringify({
        error: 'Bootstrap already completed. Contact Gerencia to create new users.'
      }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3) Get gerencial role
    const { data: role, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'gerencial')
      .single()

    if (roleError || !role) {
      return new Response(JSON.stringify({ error: 'Gerencial role not found' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 4) Check if username already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), {
        status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 5) Create user in Supabase Auth (technical internal email, never shown to user)
    // Supabase Auth handles bcrypt hashing internally
    const internalEmail = `${username}@colcom-trade.internal`

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name, username },
    })

    if (authError || !authUser.user) {
      return new Response(JSON.stringify({ error: 'Failed to create auth user' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const newUserId = authUser.user.id

    // 6) Create profile in public.users with gerencial role
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: newUserId,
        username,
        full_name,
        email: null,
        role_id: role.id,
        active: true,
      })

    if (profileError) {
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
      return new Response(JSON.stringify({ error: 'Failed to create profile' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Success — DO NOT include the password in the response
    return new Response(JSON.stringify({
      success: true,
      user: {
        id: newUserId,
        username,
        full_name,
        role: 'gerencial',
        active: true,
      }
    }), {
      status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
