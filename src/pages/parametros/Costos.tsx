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
  Trash2,
  DollarSign,
  Ship,
  Shield,
  Users,
  Percent,
} from 'lucide-react'
import { useState } from 'react'

interface CostItem {
  id: string
  category: string
  name: string
  unit: string
  amount: string
  currency: string
  active: boolean
}

const mockCosts: CostItem[] = [
  { id: '1', category: 'Flete', name: 'Flete marítimo 40\' HC', unit: 'contenedor', amount: '$3,200', currency: 'USD', active: true },
  { id: '2', category: 'Flete', name: 'Flete marítimo 20\' STD', unit: 'contenedor', amount: '$2,200', currency: 'USD', active: true },
  { id: '3', category: 'Seguro', name: 'Seguro marítimo (all-risks)', unit: '% del valor', amount: '1.2%', currency: 'USD', active: true },
  { id: '4', category: 'Arancel', name: 'Arancel importación UE', unit: '% FOB', amount: '0%', currency: 'EUR', active: true },
  { id: '5', category: 'Arancel', name: 'IVA importación NL', unit: '% CIF', amount: '9%', currency: 'EUR', active: true },
  { id: '6', category: 'Arancel', name: 'IVA importación DE', unit: '% CIF', amount: '7%', currency: 'EUR', active: true },
  { id: '7', category: 'Arancel', name: 'IVA importación ES', unit: '% CIF', amount: '4%', currency: 'EUR', active: true },
  { id: '8', category: 'Comisión', name: 'Agente aduanero', unit: 'flat fee', amount: '$180', currency: 'USD', active: true },
  { id: '9', category: 'Comisión', name: 'Agente comercial', unit: '% FOB', amount: '2%', currency: 'USD', active: true },
  { id: '10', category: 'Empaque', name: 'Caja cartón 4kg export', unit: 'unidad', amount: '$0.85', currency: 'USD', active: true },
  { id: '11', category: 'Empaque', name: 'Sticker exportador', unit: 'unidad', amount: '$0.08', currency: 'USD', active: true },
  { id: '12', category: 'Empaque', name: 'Pallet de madera', unit: 'unidad', amount: '$12.00', currency: 'USD', active: true },
]

const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Flete: { icon: <Ship className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
  Seguro: { icon: <Shield className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
  Arancel: { icon: <Percent className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600' },
  Comisión: { icon: <Users className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
  Empaque: { icon: <DollarSign className="w-4 h-4" />, color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]' },
}

const categories = Object.keys(categoryConfig)

export default function Costos() {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filtered = mockCosts.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Parámetros de costos: fletes, seguros, aranceles y comisiones</p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuevo costo
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const count = mockCosts.filter((c) => c.category === cat).length
          const cfg = categoryConfig[cat]
          return (
            <div key={cat} className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{count}</p>
                <p className="text-xs text-gray-400">{cat}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Concepto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="group">
                    <TableCell className="font-medium text-gray-900">{c.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${categoryConfig[c.category]?.color} border-0`}>
                        {categoryConfig[c.category]?.icon}
                        <span className="ml-1">{c.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{c.unit}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-gray-900">{c.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-mono">
                        {c.currency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activo
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Inactivo</span>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo costo</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input placeholder="Nombre del costo" />
            </div>
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Input placeholder="Categoría" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Unidad</Label>
                <Input placeholder="Ej: contenedor" />
              </div>
              <div className="space-y-1.5">
                <Label>Monto</Label>
                <Input placeholder="Ej: $3,200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Moneda</Label>
              <Input placeholder="USD / EUR / COP" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(false)}>Crear costo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
