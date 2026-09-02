import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Route,
  Clock,
  Ship,
} from 'lucide-react'

const mockRoutes = [
  { id: '1', origin: 'Buenaventura', destination: 'Róterdam, NL', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 40, freightCost: '$3,200', insuranceRate: '1.2%', active: true },
  { id: '2', origin: 'Cartagena', destination: 'Hamburgo, DE', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 35, freightCost: '$3,050', insuranceRate: '1.2%', active: true },
  { id: '3', origin: 'Buenaventura', destination: 'Algeciras, ES', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 38, freightCost: '$2,980', insuranceRate: '1.2%', active: true },
  { id: '4', origin: 'Cartagena', destination: 'Basilea, CH', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 42, freightCost: '$3,400', insuranceRate: '1.2%', active: true },
  { id: '5', origin: 'Buenaventura', destination: 'Oslo, NO', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 44, freightCost: '$3,600', insuranceRate: '1.2%', active: true },
  { id: '6', origin: 'Cartagena', destination: 'Gante, BE', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 36, freightCost: '$3,100', insuranceRate: '1.2%', active: true },
  { id: '7', origin: 'Buenaventura', destination: 'Le Havre, FR', via: 'Canal de Panamá', containerType: '40\' HC', transitDays: 39, freightCost: '$3,150', insuranceRate: '1.2%', active: true },
  { id: '8', origin: 'Cartagena', destination: 'Valencia, ES', via: 'Canal de Panamá', containerType: '20\' STD', transitDays: 33, freightCost: '$2,200', insuranceRate: '1.2%', active: false },
]

export default function Rutas() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rutas logísticas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Rutas de envío marítimo desde Colombia hacia Europa</p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]">
          <Plus className="w-4 h-4" />
          Nueva ruta
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar ruta..."
              className="pl-9 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Ruta</TableHead>
                  <TableHead className="hidden lg:table-cell">Trayecto</TableHead>
                  <TableHead className="hidden lg:table-cell">Tipo contenedor</TableHead>
                  <TableHead>Tránsito (días)</TableHead>
                  <TableHead className="text-right">Flete (USD)</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Seguro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRoutes.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                          <Route className="w-4 h-4 text-[#2D6A4F]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{r.origin} → {r.destination.split(',')[0]}</p>
                          <p className="text-xs text-gray-400">{r.destination}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Ship className="w-3 h-3 text-gray-400" />
                        {r.via}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-600">{r.containerType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="font-mono text-sm">{r.transitDays} días</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-gray-900">{r.freightCost}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell font-mono text-sm text-gray-500">{r.insuranceRate}</TableCell>
                    <TableCell>
                      {r.active ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
