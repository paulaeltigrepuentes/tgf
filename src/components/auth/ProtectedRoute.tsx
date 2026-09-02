import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Si se requiere un rol específico, especifícalo aquí. Si no se especifica, solo requiere sesión activa. */
  requiredRole?: 'gerencial' | 'pricing' | 'comercial' | 'logistica'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { session, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return <Navigate to="/login" replace />
  }

  // Verificar si el usuario está activo
  if (!user.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Usuario desactivado</h2>
          <p className="text-gray-500 mb-6">
            Su cuenta está desactivada. Contacte a Gerencia para reactivarla.
          </p>
          <a href="/login" className="text-[#2D6A4F] hover:underline">
            Cerrar sesión
          </a>
        </div>
      </div>
    )
  }

  // Verificar rol requerido si se especificó
  if (requiredRole && user.role?.name !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
