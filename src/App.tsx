import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"
import Login from "@/pages/Login"
import Index from "@/pages/Index"
import UserAdministration from "@/pages/UserAdministration"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />

              {/* TEMP: ruta raíz renderiza Index sin auth, solo para esta etapa de desarrollo */}
              <Route
                path="/"
                element={
                  <AppLayout>
                    <Index />
                  </AppLayout>
                }
              />

              {/* User Administration — only gerencial */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <UserAdministration />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Placeholder routes */}
              <Route
                path="/quotes"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ComingSoon title="Cotizaciones" description="Gestión completa de cotizaciones de exportación" />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ComingSoon title="Clientes" description="Gestión de clientes europeos importadores de aguacate" />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parameters"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ComingSoon title="Parámetros" description="Configuración de productos, calibres, tasas y fletes" />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ComingSoon title="Configuración" description="Configuración general del sistema" />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2D6A4F]">404</h1>
        <p className="text-xl text-gray-600 mt-2">Página no encontrada</p>
        <a href="/" className="text-[#2D6A4F] hover:underline mt-4 inline-block">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#2D6A4F]/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A017]/10 text-[#D4A017] rounded-lg text-sm font-medium">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Disponible en próximas fases
        </div>
      </div>
    </div>
  )
}

export default App
