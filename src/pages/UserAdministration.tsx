import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import type { ManagedUser, RoleInfo, RoleName } from '@/types/auth'

const SUPABASE_PROJECT_ID = 'xudfyebrdskuyqmcnops'
const MANAGE_USERS_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/manage-users`

const roleLabels: Record<RoleName, string> = {
  gerencial: 'Gerencia',
  pricing: 'Pricing',
  comercial: 'Comercial',
  logistica: 'Logística',
}

const roleBadgeClass: Record<RoleName, string> = {
  gerencial: 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20',
  pricing: 'bg-blue-50 text-blue-700 border-blue-200',
  comercial: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  logistica: 'bg-purple-50 text-purple-700 border-purple-200',
}

interface CreateUserForm {
  username: string
  full_name: string
  role_name: RoleName | ''
  password: string
  confirm_password: string
}

const initialForm: CreateUserForm = {
  username: '',
  full_name: '',
  role_name: '',
  password: '',
  confirm_password: '',
}

export default function UserAdministration() {
  const { session } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<ManagedUser[]>([])
  const [roles, setRoles] = useState<RoleInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<ManagedUser | null>(null)
  const [resetPasswordUser, setResetPasswordUser] = useState<ManagedUser | null>(null)
  const [form, setForm] = useState<CreateUserForm>(initialForm)
  const [editForm, setEditForm] = useState<{ full_name: string; role_name: RoleName; active: boolean }>({
    full_name: '', role_name: 'comercial', active: true,
  })
  const [resetForm, setResetForm] = useState({ new_password: '', confirm_password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const callApi = useCallback(async (action: string, method: 'GET' | 'POST', body?: object) => {
    if (!session?.access_token) throw new Error('Sin sesión')
    const url = `${MANAGE_USERS_URL}?action=${action}`
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Error en la operación')
    }
    return data
  }, [session])

  const fetchUsers = useCallback(async () => {
    try {
      const data = await callApi('list_users', 'GET')
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    }
  }, [callApi])

  const fetchRoles = useCallback(async () => {
    try {
      const data = await callApi('list_roles', 'GET')
      setRoles(data.roles || [])
    } catch {
      // non-critical
    }
  }, [callApi])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    Promise.all([fetchUsers(), fetchRoles()]).finally(() => setLoading(false))
  }, [session, fetchUsers, fetchRoles])

  // --- CREATE USER ---
  const openCreate = () => {
    setForm(initialForm)
    setFormError(null)
    setCreateOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!form.username || !form.full_name || !form.role_name || !form.password) {
      setFormError('Todos los campos son requeridos')
      return
    }
    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(form.username)) {
      setFormError('Username inválido (3-30 caracteres, alfanumérico, _, ., -)')
      return
    }
    if (form.password.length < 8) {
      setFormError('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    if (form.password !== form.confirm_password) {
      setFormError('Las contraseñas no coinciden')
      return
    }

    setSubmitting(true)
    try {
      await callApi('create_user', 'POST', {
        username: form.username,
        full_name: form.full_name,
        role_name: form.role_name,
        password: form.password,
      })
      toast({ title: 'Usuario creado', description: `${form.username} ha sido creado.` })
      setCreateOpen(false)
      setForm(initialForm)
      fetchUsers()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al crear usuario')
    } finally {
      setSubmitting(false)
    }
  }

  // --- EDIT USER ---
  const openEdit = (u: ManagedUser) => {
    setEditUser(u)
    setEditForm({
      full_name: u.full_name,
      role_name: (u.role?.name as RoleName) ?? 'comercial',
      active: u.active,
    })
    setFormError(null)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setFormError(null)
    setSubmitting(true)
    try {
      await callApi('update_user', 'POST', {
        user_id: editUser.id,
        full_name: editForm.full_name,
        role_name: editForm.role_name,
        active: editForm.active,
      })
      toast({ title: 'Usuario actualizado', description: editUser.username })
      setEditUser(null)
      fetchUsers()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al actualizar')
    } finally {
      setSubmitting(false)
    }
  }

  // --- RESET PASSWORD ---
  const openReset = (u: ManagedUser) => {
    setResetPasswordUser(u)
    setResetForm({ new_password: '', confirm_password: '' })
    setFormError(null)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetPasswordUser) return
    setFormError(null)

    if (resetForm.new_password.length < 8) {
      setFormError('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    if (resetForm.new_password !== resetForm.confirm_password) {
      setFormError('Las contraseñas no coinciden')
      return
    }

    setSubmitting(true)
    try {
      await callApi('reset_password', 'POST', {
        user_id: resetPasswordUser.id,
        new_password: resetForm.new_password,
      })
      toast({ title: 'Contraseña restablecida', description: resetPasswordUser.username })
      setResetPasswordUser(null)
      setResetForm({ new_password: '', confirm_password: '' })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al restablecer contraseña')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestione los usuarios del sistema. Solo Gerencia tiene acceso.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#2D6A4F] hover:bg-[#1B4332]">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Activos</p>
            <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Inactivos</p>
            <p className="text-2xl font-bold text-gray-400">{users.filter(u => !u.active).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Roles</p>
            <p className="text-2xl font-bold">{new Set(users.map(u => u.role?.name)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del sistema</CardTitle>
          <CardDescription>
            {loading ? 'Cargando...' : `${users.length} usuario(s) registrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No hay usuarios registrados.</div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Usuario</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Nombre</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Rol</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Estado</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Último acceso</th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">Creado</th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-900">{u.username}</td>
                      <td className="px-6 py-3 text-gray-900">{u.full_name}</td>
                      <td className="px-6 py-3">
                        {u.role && (
                          <Badge variant="outline" className={roleBadgeClass[u.role.name as RoleName]}>
                            {roleLabels[u.role.name as RoleName]}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {u.active ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Activo</Badge>
                        ) : (
                          <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200">Inactivo</Badge>
                        )}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {u.last_login_at
                          ? new Date(u.last_login_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
                          : 'Nunca'}
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        {new Date(u.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openReset(u)}>
                            Contraseña
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
            <DialogDescription>
              Defina las credenciales y el rol del nuevo usuario. La contraseña debe tener al menos 8 caracteres.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="cu-username">Usuario</Label>
              <Input
                id="cu-username"
                value={form.username}
                onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="ejemplo.juan"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <div>
              <Label htmlFor="cu-fullname">Nombre completo</Label>
              <Input
                id="cu-fullname"
                value={form.full_name}
                onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="cu-role">Rol</Label>
              <Select value={form.role_name} onValueChange={(v) => setForm(f => ({ ...f, role_name: v as RoleName }))}>
                <SelectTrigger id="cu-role">
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.id} value={r.name}>{roleLabels[r.name]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cu-password">Contraseña inicial</Label>
              <Input
                id="cu-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="cu-confirm">Confirmar contraseña</Label>
              <Input
                id="cu-confirm"
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm(f => ({ ...f, confirm_password: e.target.value }))}
                placeholder="Repita la contraseña"
                autoComplete="new-password"
              />
            </div>
            {formError && (
              <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting} className="bg-[#2D6A4F] hover:bg-[#1B4332]">
                {submitting ? 'Creando...' : 'Crear usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modifique los datos del usuario. <strong>{editUser?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Usuario</Label>
              <Input value={editUser?.username ?? ''} disabled className="font-mono text-xs bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">El nombre de usuario no puede modificarse.</p>
            </div>
            <div>
              <Label htmlFor="ed-fullname">Nombre completo</Label>
              <Input
                id="ed-fullname"
                value={editForm.full_name}
                onChange={(e) => setEditForm(f => ({ ...f, full_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ed-role">Rol</Label>
              <Select
                value={editForm.role_name}
                onValueChange={(v) => setEditForm(f => ({ ...f, role_name: v as RoleName }))}
              >
                <SelectTrigger id="ed-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.id} value={r.name}>{roleLabels[r.name]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                id="ed-active"
                type="checkbox"
                checked={editForm.active}
                onChange={(e) => setEditForm(f => ({ ...f, active: e.target.checked }))}
                className="w-4 h-4 text-[#2D6A4F] focus:ring-[#2D6A4F] rounded"
              />
              <Label htmlFor="ed-active" className="cursor-pointer">Usuario activo</Label>
            </div>
            {formError && (
              <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button>
              <Button type="submit" disabled={submitting} className="bg-[#2D6A4F] hover:bg-[#1B4332]">
                {submitting ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restablecer contraseña</DialogTitle>
            <DialogDescription>
              Establezca una nueva contraseña para <strong>{resetPasswordUser?.username}</strong>.
              La contraseña se almacena de forma segura mediante Supabase Auth.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="rp-new">Nueva contraseña</Label>
              <Input
                id="rp-new"
                type="password"
                value={resetForm.new_password}
                onChange={(e) => setResetForm(f => ({ ...f, new_password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="rp-confirm">Confirmar contraseña</Label>
              <Input
                id="rp-confirm"
                type="password"
                value={resetForm.confirm_password}
                onChange={(e) => setResetForm(f => ({ ...f, confirm_password: e.target.value }))}
                autoComplete="new-password"
              />
            </div>
            {formError && (
              <Alert variant="destructive"><AlertDescription>{formError}</AlertDescription></Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetPasswordUser(null)}>Cancelar</Button>
              <Button type="submit" disabled={submitting} className="bg-[#2D6A4F] hover:bg-[#1B4332]">
                {submitting ? 'Restableciendo...' : 'Restablecer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
