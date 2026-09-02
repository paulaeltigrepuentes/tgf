import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EDGE_FUNCTION_URL =
  'https://xudfyebrdskuyqmcnops.supabase.co/functions/v1/bootstrap-master-user'

export default function Bootstrap() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.full_name.trim()) {
      setError('El nombre completo es requerido')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (form.password !== form.confirm_password) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      // Password is sent only in this single HTTPS request.
      // The Edge Function validates the one-shot guard and passes the password to Supabase Auth (bcrypt).
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'jpuerta',
          full_name: form.full_name.trim(),
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Error al crear el usuario')
        return
      }

      setSuccess(true)
      // Clear password from state immediately after success
      setForm({ full_name: '', password: '', confirm_password: '' })
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2D6A4F] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#D4A017]" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1B4332]">ColCom Trade</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración inicial</h1>
          <p className="text-sm text-gray-500 mt-2">
            No se han encontrado usuarios en el sistema. Configure el usuario maestro de Gerencia para comenzar.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl border border-emerald-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Usuario creado exitosamente</h2>
            <p className="text-sm text-gray-500 mb-4">
              El usuario <strong>jpuerta</strong> con rol <strong>Gerencia</strong> ha sido creado.
            </p>
            <p className="text-sm text-gray-400">Redirigiendo al login...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
            autoComplete="off"
          >
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value="jpuerta"
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Este campo no puede modificarse.</p>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre completo
              </label>
              <input
                id="full_name"
                type="text"
                value={form.full_name}
                onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                placeholder="Juan Puerta López"
                autoComplete="name"
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña inicial
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Se almacena de forma segura mediante Supabase Auth (bcrypt). Mínimo 8 caracteres.
              </p>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar contraseña
              </label>
              <input
                id="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm(f => ({ ...f, confirm_password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent transition-colors"
                placeholder="Repita la contraseña"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creando usuario...
                </>
              ) : (
                'Crear usuario maestro de Gerencia'
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              La contraseña se transmite de forma segura (HTTPS) y se almacena mediante Supabase Auth. Nunca se guarda en texto plano.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
