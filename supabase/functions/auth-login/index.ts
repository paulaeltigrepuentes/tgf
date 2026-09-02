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
    const { username, password } = await req.json()

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Usuario y contraseña son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Step 1: Look up user by username
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*, role:roles(*)')
      .eq('username', username)
      .single()

    if (profileError || !userProfile) {
      // Deliberate delay to prevent username enumeration
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200))
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Verify active status
    if (!userProfile.active) {
      return new Response(
        JSON.stringify({ error: 'Usuario desactivado. Contacte a Gerencia.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = userProfile.id

    // Step 3: Verify password against Supabase Auth using signInWithPassword
    // We create a temporary client with the user's auth email
    const authEmail = `${username}@colcom-trade.internal`
    const tempClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })

    const { error: signInError } = await tempClient.auth.signInWithPassword({
      email: authEmail,
      password: password,
    })

    if (signInError) {
      console.log('[auth-login] Sign-in failed for username:', username)
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 4: Create session using admin API (gets real tokens)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession(userId)

    if (sessionError || !sessionData?.session) {
      console.error('[auth-login] Session creation error:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Error al crear sesión' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 5: Update last_login_at (non-critical, don't fail if this errors)
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId)

    return new Response(
      JSON.stringify({
        user: {
          id: userProfile.id,
          username: userProfile.username,
          full_name: userProfile.full_name,
          role: userProfile.role,
          active: userProfile.active,
        },
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_in: sessionData.session.expires_in,
          expires_at: sessionData.session.expires_at,
          token_type: sessionData.session.token_type,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[auth-login] Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
