import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Verify caller is gerencial
async function verifyGerencial(authHeader: string | null) {
  if (!authHeader) return { ok: false, error: 'Unauthorized', status: 401 }

  const token = authHeader.replace('Bearer ', '')
  const supabaseCaller = createClient(SUPABASE_URL, SUPABASE_ANON_KEY(), {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } }
  })

  const { data: { user: callerAuth }, error: userErr } = await supabaseCaller.auth.getUser()
  if (userErr || !callerAuth) return { ok: false, error: 'Unauthorized', status: 401 }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: callerProfile } = await supabaseAdmin
    .from('users')
    .select('*, role:roles(*)')
    .eq('id', callerAuth.id)
    .single()

  if (!callerProfile || callerProfile.role?.name !== 'gerencial') {
    return { ok: false, error: 'Acceso denegado. Solo Gerencia puede gestionar usuarios.', status: 403 }
  }

  return { ok: true, caller: callerProfile, supabaseAdmin }
}

function SUPABASE_ANON_KEY() {
  return Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || ''
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || url.pathname.split('/').pop()
    const authHeader = req.headers.get('Authorization')

    const verification = await verifyGerencial(authHeader)
    if (!verification.ok) {
      return new Response(
        JSON.stringify({ error: verification.error }),
        { status: verification.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { supabaseAdmin } = verification

    // ACTION: list_users
    if (action === 'list_users' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, username, full_name, role_id, active, created_at, last_login_at, role:roles(name, description)')
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(JSON.stringify({ error: 'Error al listar usuarios' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ users: data }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ACTION: list_roles
    if (action === 'list_roles' && req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('roles')
        .select('id, name, description')
        .order('name')

      if (error) {
        return new Response(JSON.stringify({ error: 'Error al listar roles' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ roles: data }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // All other actions need a body
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()

    // ACTION: create_user
    if (action === 'create_user') {
      const { username, full_name, role_name, password } = body

      if (!username || !full_name || !role_name || !password) {
        return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Verify username format
      if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(username)) {
        return new Response(JSON.stringify({ error: 'Username inválido (3-30 caracteres, alfanumérico, _, ., -)' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Get role
      const { data: role } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', role_name)
        .single()

      if (!role) {
        return new Response(JSON.stringify({ error: 'Rol inválido' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check username uniqueness
      const { data: existing } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

      if (existing) {
        return new Response(JSON.stringify({ error: 'El nombre de usuario ya existe' }), {
          status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Create in Supabase Auth (technical email, never shown to user)
      const internalEmail = `${username}@colcom-trade.internal`

      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: internalEmail,
        password: password,
        email_confirm: true,
        user_metadata: { full_name, username },
      })

      if (authError || !authUser.user) {
        return new Response(JSON.stringify({ error: 'Error al crear el usuario: ' + (authError?.message || 'desconocido') }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const newUserId = authUser.user.id

      // Create profile
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
        // Rollback auth user
        await supabaseAdmin.auth.admin.deleteUser(newUserId)
        return new Response(JSON.stringify({ error: 'Error al crear perfil: ' + profileError.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(
        JSON.stringify({ user: { id: newUserId, username, full_name, role_name }, message: 'Usuario creado' }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ACTION: update_user
    if (action === 'update_user') {
      const { user_id, full_name, role_name, active } = body

      if (!user_id) {
        return new Response(JSON.stringify({ error: 'user_id requerido' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const updates: Record<string, unknown> = {}
      if (full_name !== undefined) updates.full_name = full_name
      if (active !== undefined) updates.active = active
      if (role_name !== undefined) {
        const { data: role } = await supabaseAdmin
          .from('roles')
          .select('id')
          .eq('name', role_name)
          .single()
        if (!role) {
          return new Response(JSON.stringify({ error: 'Rol inválido' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        updates.role_id = role.id
      }

      const { error: updateErr } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', user_id)

      if (updateErr) {
        return new Response(JSON.stringify({ error: 'Error al actualizar: ' + updateErr.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ message: 'Usuario actualizado' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ACTION: reset_password
    if (action === 'reset_password') {
      const { user_id, new_password } = body

      if (!user_id || !new_password) {
        return new Response(JSON.stringify({ error: 'user_id y new_password requeridos' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (new_password.length < 6) {
        return new Response(JSON.stringify({ error: 'La contraseña debe tener mínimo 6 caracteres' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Supabase Auth handles the bcrypt hashing internally
      const { error: pwdErr } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        password: new_password,
      })

      if (pwdErr) {
        return new Response(JSON.stringify({ error: 'Error al restablecer contraseña: ' + pwdErr.message }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ message: 'Contraseña restablecida' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Acción no reconocida' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('[manage-users] Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
