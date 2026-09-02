import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Building2,
  Database,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
} from 'lucide-react'

export default function Configuracion() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500 mt-0.5">Parámetros generales del sistema ColCom Trade</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {/* Company info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <div>
                  <CardTitle className="text-base">Información de la empresa</CardTitle>
                  <CardDescription className="text-xs">Datos de Columbiana de Commodities SAS</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nombre de la empresa</Label>
                  <Input defaultValue="Colombiana de Commodities SAS" />
                </div>
                <div className="space-y-1.5">
                  <Label>NIT</Label>
                  <Input defaultValue="901.234.567-8" />
                </div>
                <div className="space-y-1.5">
                  <Label>Dirección</Label>
                  <Input defaultValue="Calle 100 #15-20, Bogotá, Colombia" />
                </div>
                <div className="space-y-1.5">
                  <Label>Teléfono</Label>
                  <Input defaultValue="+57 (1) 234 5678" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System settings */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Parámetros del sistema</CardTitle>
                  <CardDescription className="text-xs">Configuración operativa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Moneda por defecto</Label>
                  <Input defaultValue="USD" />
                </div>
                <div className="space-y-1.5">
                  <Label>Formato de fecha</Label>
                  <Input defaultValue="YYYY-MM-DD" />
                </div>
                <div className="space-y-1.5">
                  <Label>Decimales en precios</Label>
                  <Input type="number" defaultValue="2" />
                </div>
                <div className="space-y-1.5">
                  <Label>Formato numérico</Label>
                  <Input defaultValue="en-US (1,234.56)" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Seguridad y auditoría</CardTitle>
                  <CardDescription className="text-xs">Configuración de seguridad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Retener sesiones (minutos)</Label>
                  <Input type="number" defaultValue="480" />
                </div>
                <div className="space-y-1.5">
                  <Label>Registro de auditoría</Label>
                  <div className="pt-1.5">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Activo · Todos los eventos
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Estado del sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Versión', value: 'v0.2.0' },
                { label: 'Entorno', value: 'Desarrollo' },
                { label: 'Última actualización', value: '2025-07-15' },
                { label: 'Base de datos', value: 'Conectada', status: 'online' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Acciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <RefreshCw className="w-4 h-4" />
                Sincronizar tasas
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Database className="w-4 h-4" />
                Respaldar base de datos
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="w-4 h-4" />
                Notificaciones
              </Button>
              <Separator className="my-2" />
              <Button className="w-full gap-2 bg-[#2D6A4F] hover:bg-[#1B4332]">
                <Save className="w-4 h-4" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
