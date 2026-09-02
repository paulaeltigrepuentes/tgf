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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify the caller's JWT to check their role
    const supabaseCaller = createClient(SUPABASE_URL, token)
    const { data: { user: callerAuth } } = await supabaseCaller.auth.getUser()

    if (!callerAuth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify caller has gerencial role
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: callerProfile } = await supabaseAdmin
      .from('users')
      .select('*, role:roles(*)')
      .eq('id', callerAuth.id)
      .single()

    if (!callerProfile || callerProfile.role?.name !== 'gerencial') {
      return new Response(JSON.stringify({ error: 'Acceso denegado. Solo Gerencia puede crear usuarios.' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { username, full_name, password, role_id } = await req.json()

    if (!username || !full_name || !password || !role_id) {
      return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify username uniqueness
    const { data: existing } = await supabaseAdmin
      .from('user_auth_credentials')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ error: 'El nombre de usuario ya existe' }), {
        status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate a unique internal email (technical, never used for login)
    const internalEmail = `${username}@colcom-trade.internal`
    const tempPassword = crypto.randomUUID() // random password for auth.users

    // Create auth.users entry
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      email_confirm: true,
      user_metadata: { full_name, username },
    })

    if (authError || !authUser.user) {
      console.error('[auth-create-user] Auth user creation error:', authError)
      return new Response(JSON.stringify({ error: 'Error al crear usuario en el sistema de autenticación' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userId = authUser.user.id

    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        full_name,
        email: null, // no email for login
        role_id,
        active: true,
      })

    if (profileError) {
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.error('[auth-create-user] Profile creation error:', profileError)
      return new Response(JSON.stringify({ error: 'Error al crear perfil de usuario' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Hash password using pgcrypto via RPC
    // First we need to set the password in user_auth_credentials
    // We'll use a direct SQL approach through the admin client
    const { error: credError } = await supabaseAdmin
      .from('user_auth_credentials')
      .insert({
        user_id: userId,
        username,
        password_hash: 'TEMP_HASH', // Will be updated below
      })

    if (credError) {
      console.error('[auth-create-user] Credentials insert error:', credError)
    }

    // Update password hash using pgcrypto
    const { error: hashError } = await supabaseAdmin.rpc('set_user_password', {
      p_user_id: userId,
      p_password: password,
    })

    if (hashError) {
      console.error('[auth-create-user] Hash error:', hashError)
    }

    console.log('[auth-create-user] User created by', callerAuth.id, ':', username)

    return new Response(
      JSON.stringify({
        user: {
          id: userId,
          username,
          full_name,
          role_id,
        },
        message: 'Usuario creado exitosamente',
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[auth-create-user] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
