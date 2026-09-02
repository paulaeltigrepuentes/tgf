import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Edit,
  Percent,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { useState } from 'react'

interface MarginRule {
  id: string
  name: string
  minMargin: string
  maxMargin: string
  targetMargin: string
  description: string
  active: boolean
}

const mockMargins: MarginRule[] = [
  { id: '1', name: 'Margen mínimo general', minMargin: '10.0%', maxMargin: '-', targetMargin: '12.0%', description: 'Margen mínimo aceptable para cualquier cotización', active: true },
  { id: '2', name: 'Margen destino NL', minMargin: '12.0%', maxMargin: '-', targetMargin: '15.0%', description: 'Margen objetivo para Países Bajos (Róterdam)', active: true },
  { id: '3', name: 'Margen destino DE', minMargin: '11.0%', maxMargin: '-', targetMargin: '14.0%', description: 'Margen objetivo para Alemania (Hamburgo)', active: true },
  { id: '4', name: 'Margen destino ES', minMargin: '10.0%', maxMargin: '-', targetMargin: '13.0%', description: 'Margen objetivo para España (Algeciras)', active: true },
  { id: '5', name: 'Margen destino CH', minMargin: '13.0%', maxMargin: '-', targetMargin: '16.0%', description: 'Margen objetivo para Suiza (Basilea) - mayor distancia', active: true },
  { id: '6', name: 'Margen premium (Cal. 16-20)', minMargin: '14.0%', maxMargin: '-', targetMargin: '17.0%', description: 'Margen para calibres premium (mayor valor)', active: true },
  { id: '7', name: 'Margen orgánico certificado', minMargin: '15.0%', maxMargin: '-', targetMargin: '18.0%', description: 'Margen para productos orgánicos certificados', active: true },
  { id: '8', name: 'Margen máximo (alerta)', minMargin: '-', maxMargin: '20.0%', targetMargin: '-', description: 'Umbral máximo - revisar si el precio es muy alto', active: false },
]

export default function Margenes() {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = mockMargins.filter((m) =>
    !search ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Márgenes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reglas de márgenes de rentabilidad por destino y producto</p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nueva regla
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar regla de margen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Margen mínimo global', value: '10.0%', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> },
          { label: 'Margen objetivo promedio', value: '14.5%', color: 'text-[#2D6A4F]', icon: <Percent className="w-4 h-4" /> },
          { label: 'Margen máximo (alerta)', value: '20.0%', color: 'text-amber-600', icon: <AlertTriangle className="w-4 h-4" /> },
        ].map((item) => (
          <Card key={item.label} className="border-gray-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`${item.color}`}>{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Regla</TableHead>
                  <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                  <TableHead className="text-right">Mín. (%)</TableHead>
                  <TableHead className="text-right">Máx. (%)</TableHead>
                  <TableHead className="text-right">Objetivo (%)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#D4A017]/10 flex items-center justify-center flex-shrink-0">
                          <Percent className="w-4 h-4 text-[#D4A017]" />
                        </div>
                        <span className="font-medium text-gray-900">{m.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500 max-w-[200px]">{m.description}</TableCell>
                    <TableCell className="text-right">
                      {m.minMargin !== '-' ? (
                        <span className="font-mono font-semibold text-gray-900">{m.minMargin}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {m.maxMargin !== '-' ? (
                        <span className="font-mono font-semibold text-amber-600">{m.maxMargin}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono font-bold text-[#2D6A4F]">{m.targetMargin}</span>
                    </TableCell>
                    <TableCell>
                      {m.active ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activa
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-500">
                          Inactiva
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva regla de margen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre de la regla</Label>
              <Input placeholder="Ej: Margen destino ES" />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Input placeholder="Descripción de la regla" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Mínimo (%)</Label>
                <Input type="number" placeholder="Ej: 10.0" />
              </div>
              <div className="space-y-1.5">
                <Label>Máximo (%)</Label>
                <Input type="number" placeholder="—" />
              </div>
              <div className="space-y-1.5">
                <Label>Objetivo (%)</Label>
                <Input type="number" placeholder="Ej: 14.0" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(false)}>Crear regla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
