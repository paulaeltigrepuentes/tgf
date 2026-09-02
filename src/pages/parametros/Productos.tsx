import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Package,
  Check,
  X,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  category: string
  unit: string
  active: boolean
  createdAt: string
}

const mockProducts: Product[] = [
  { id: '1', name: 'Aguacate Hass', description: 'Aguacate Hass convencional de exportación', category: 'Fruta fresca', unit: 'caja 4kg', active: true, createdAt: '2025-01-10' },
  { id: '2', name: 'Aguacate Hass Premium', description: 'Aguacate Hass de primera calidad, calibre 16-20', category: 'Fruta fresca', unit: 'caja 4kg', active: true, createdAt: '2025-01-10' },
  { id: '3', name: 'Aguacate Hass Organic', description: 'Aguacate Hass orgánico certificado USDA', category: 'Orgánico', unit: 'caja 4kg', active: true, createdAt: '2025-02-05' },
  { id: '4', name: 'Aguacate Hass Fair Trade', description: 'Aguacate Hass con certificación Fair Trade', category: 'Certificado', unit: 'caja 4kg', active: true, createdAt: '2025-03-15' },
  { id: '5', name: 'Caja cartón 4kg', description: 'Caja de cartón corrugado para exportación', category: 'Empaque', unit: 'unidad', active: true, createdAt: '2025-01-10' },
  { id: '6', name: 'Sticker exportador', description: 'Sticker con marca ColCom para cajas', category: 'Empaque', unit: 'unidad', active: true, createdAt: '2025-01-10' },
]

const categories = ['Fruta fresca', 'Orgánico', 'Certificado', 'Empaque']

export default function Productos() {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [form, setForm] = useState({ name: '', description: '', category: 'Fruta fresca', unit: '' })

  const filtered = mockProducts.filter((p) =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    setIsDialogOpen(false)
    setEditing(null)
    setForm({ name: '', description: '', category: 'Fruta fresca', unit: '' })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Catálogo de productos y servicios para exportación</p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
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
                  <TableHead>Producto</TableHead>
                  <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-[#2D6A4F]" />
                        </div>
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500 max-w-[200px]">{p.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{p.unit}</TableCell>
                    <TableCell>
                      {p.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-400">{p.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(p); setIsDialogOpen(true) }}>
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

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditing(null); setForm({ name: '', description: '', category: 'Fruta fresca', unit: '' }) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del producto" />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción breve" />
            </div>
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Categoría" />
            </div>
            <div className="space-y-1.5">
              <Label>Unidad</Label>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Ej: caja 4kg" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={handleSave}>
              {editing ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
