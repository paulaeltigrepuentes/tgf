import { useState } from 'react'
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
  CircleGauge,
} from 'lucide-react'

interface Caliber {
  id: string
  code: string
  fruitsPerBox: string
  boxWeight: string
  priceRange: string
  active: boolean
  notes: string
}

const mockCalibers: Caliber[] = [
  { id: '1', code: '16', fruitsPerBox: '16', boxWeight: '4kg', priceRange: '$9.80 - $10.50', active: true, notes: 'Premium, mayor precio' },
  { id: '2', code: '18', fruitsPerBox: '18', boxWeight: '4kg', priceRange: '$9.20 - $9.80', active: true, notes: 'Alta calidad' },
  { id: '3', code: '20', fruitsPerBox: '20', boxWeight: '4kg', priceRange: '$8.70 - $9.20', active: true, notes: 'Calidad exportable estándar' },
  { id: '4', code: '22', fruitsPerBox: '22', boxWeight: '4kg', priceRange: '$8.20 - $8.70', active: true, notes: 'Calidad exportable estándar' },
  { id: '5', code: '24', fruitsPerBox: '24', boxWeight: '4kg', priceRange: '$7.80 - $8.20', active: true, notes: 'Calibre medio' },
  { id: '6', code: '26', fruitsPerBox: '26', boxWeight: '4kg', priceRange: '$7.40 - $7.80', active: true, notes: 'Calibre medio-bajo' },
  { id: '7', code: '28', fruitsPerBox: '28', boxWeight: '4kg', priceRange: '$7.00 - $7.40', active: true, notes: 'Calibre bajo' },
  { id: '8', code: '30', fruitsPerBox: '30', boxWeight: '4kg', priceRange: '$6.60 - $7.00', active: true, notes: 'Calibre bajo' },
  { id: '9', code: '32', fruitsPerBox: '32', boxWeight: '4kg', priceRange: '$6.20 - $6.60', active: true, notes: 'Procesamiento' },
  { id: '10', code: '36', fruitsPerBox: '36', boxWeight: '4kg', priceRange: '$5.80 - $6.20', active: false, notes: 'Mayormente procesamiento' },
]

export default function Calibres() {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Caliber | null>(null)
  const [form, setForm] = useState<Omit<Caliber, 'id'>>({ code: '', fruitsPerBox: '', boxWeight: '4kg', priceRange: '', active: true, notes: '' })

  const filtered = mockCalibers.filter((c) =>
    !search || c.code.includes(search) || c.notes.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    setIsDialogOpen(false)
    setEditing(null)
    setForm({ code: '', fruitsPerBox: '', boxWeight: '4kg', priceRange: '', active: true, notes: '' })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calibres</h1>
          <p className="text-sm text-gray-500 mt-0.5">Definición de calibres de aguacate (frutas por caja de 4kg)</p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuevo calibre
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar calibre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <TableHead>Código</TableHead>
                  <TableHead>Frutas/caja</TableHead>
                  <TableHead>Peso caja</TableHead>
                  <TableHead className="hidden lg:table-cell">Rango precio (USD)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Notas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#2D6A4F]">{c.code}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Cal. {c.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-gray-700">{c.fruitsPerBox}</TableCell>
                    <TableCell className="text-gray-600">{c.boxWeight}</TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-sm text-gray-600">{c.priceRange}</TableCell>
                    <TableCell>
                      {c.active ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Activo</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-500">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-400">{c.notes}</TableCell>
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

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditing(null); setForm({ code: '', fruitsPerBox: '', boxWeight: '4kg', priceRange: '', active: true, notes: '' }) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar calibre' : 'Nuevo calibre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Código</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ej: 24" />
              </div>
              <div className="space-y-1.5">
                <Label>Frutas por caja</Label>
                <Input value={form.fruitsPerBox} onChange={(e) => setForm({ ...form, fruitsPerBox: e.target.value })} placeholder="Ej: 24" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Peso de caja</Label>
              <Input value={form.boxWeight} onChange={(e) => setForm({ ...form, boxWeight: e.target.value })} placeholder="Ej: 4kg" />
            </div>
            <div className="space-y-1.5">
              <Label>Rango de precio (USD)</Label>
              <Input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} placeholder="Ej: $7.80 - $8.20" />
            </div>
            <div className="space-y-1.5">
              <Label>Notas</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={handleSave}>
              {editing ? 'Guardar cambios' : 'Crear calibre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
