import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/contexts/AuthContext"
import { AppLayout } from "@/components/layout/AppLayout"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import NuevaCotizacion from "@/pages/cotizaciones/NuevaCotizacion"
import HistorialCotizaciones from "@/pages/cotizaciones/Historial"
import Rentabilidad from "@/pages/analisis/Rentabilidad"
import AnalisisCostos from "@/pages/analisis/AnalisisCostos"
import Productos from "@/pages/parametros/Productos"
import Calibres from "@/pages/parametros/Calibres"
import Rutas from "@/pages/parametros/Rutas"
import Tasas from "@/pages/parametros/Tasas"
import Costos from "@/pages/parametros/Costos"
import Margenes from "@/pages/parametros/Margenes"
import Configuracion from "@/pages/Configuracion"

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

              {/* Main app — all routes use AppLayout */}
              <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />

              {/* Cotizaciones */}
              <Route path="/cotizaciones" element={<AppLayout><HistorialCotizaciones /></AppLayout>} />
              <Route path="/cotizaciones/nueva" element={<AppLayout><NuevaCotizacion /></AppLayout>} />

              {/* Análisis */}
              <Route path="/analisis/rentabilidad" element={<AppLayout><Rentabilidad /></AppLayout>} />
              <Route path="/analisis/costos" element={<AppLayout><AnalisisCostos /></AppLayout>} />

              {/* Parámetros */}
              <Route path="/parametros/productos" element={<AppLayout><Productos /></AppLayout>} />
              <Route path="/parametros/calibres" element={<AppLayout><Calibres /></AppLayout>} />
              <Route path="/parametros/rutas" element={<AppLayout><Rutas /></AppLayout>} />
              <Route path="/parametros/tasas" element={<AppLayout><Tasas /></AppLayout>} />
              <Route path="/parametros/costos" element={<AppLayout><Costos /></AppLayout>} />
              <Route path="/parametros/margenes" element={<AppLayout><Margenes /></AppLayout>} />

              {/* Administración */}
              <Route path="/usuarios" element={<AppLayout><Configuracion /></AppLayout>} />
              <Route path="/configuracion" element={<AppLayout><Configuracion /></AppLayout>} />

              {/* Legacy route */}
              <Route path="/users" element={<AppLayout><Configuracion /></AppLayout>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
