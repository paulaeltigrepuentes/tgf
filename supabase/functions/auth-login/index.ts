import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { username, password } = await req.json()
    console.log('[auth-login] Login attempt for username:', username)

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'Usuario y contraseña son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Service client for admin operations
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Step 1: Verify credentials using the database function
    const { data: userId, error: verifyError } = await supabaseAdmin.rpc(
      'verify_user_password',
      { p_username: username, p_password: password }
    )

    if (verifyError) {
      console.error('[auth-login] verify_user_password RPC error:', verifyError)
      return new Response(
        JSON.stringify({ error: 'Error interno al verificar credenciales' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!userId) {
      console.log('[auth-login] Invalid credentials for username:', username)
      return new Response(
        JSON.stringify({ error: 'Usuario o contraseña incorrectos' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 2: Get user profile and role
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*, role:roles(*)')
      .eq('id', userId)
      .single()

    if (profileError || !userProfile) {
      console.error('[auth-login] Profile lookup error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!userProfile.active) {
      return new Response(
        JSON.stringify({ error: 'Usuario desactivado. Contacte a Gerencia.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Step 3: Get the auth.users internal email (technical, never shown to users)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (authError || !authUser?.user?.email) {
      console.error('[auth-login] Auth user lookup error:', authError)
      return new Response(
        JSON.stringify({ error: 'Cuenta no configurada correctamente' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const internalEmail = authUser.user.email

    // Step 4: Create a real Supabase session using admin API
    // We use signInWithPassword internally by creating a public client
    // and calling it through our own logic, or we create a session directly
    // The cleanest approach: use admin.createSession with the user's ID
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession(userId)

    if (sessionError || !sessionData?.session) {
      console.error('[auth-login] Session creation error:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Error al crear sesión' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[auth-login] Login successful for user:', username)

    // Step 5: Return the session tokens and user profile
    return new Response(
      JSON.stringify({
        user: {
          id: userProfile.id,
          username: username,
          full_name: userProfile.full_name,
          email: userProfile.email,
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
        message: 'Login exitoso',
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
