import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

interface CostItem {
  id: string
  category: string
  name: string
  unit: string
  amount: string
  currency: string
  active: boolean
}

const initialCosts: CostItem[] = []

const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Flete: { icon: <Ship className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600' },
  Seguro: { icon: <Shield className="w-4 h-4" />, color: 'bg-purple-50 text-purple-600' },
  Arancel: { icon: <Percent className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600' },
  Comisión: { icon: <Users className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
  Empaque: { icon: <DollarSign className="w-4 h-4" />, color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]' },
}

const categories = Object.keys(categoryConfig)
const currencies = ['USD', 'EUR', 'COP']

type CostForm = Omit<CostItem, 'id'>

const emptyForm: CostForm = {
  category: 'Flete',
  name: '',
  unit: '',
  amount: '',
  currency: 'USD',
  active: true,
}

export default function Costos() {
  const [costs, setCosts] = useState<CostItem[]>(initialCosts)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CostForm>(emptyForm)

  const filtered = costs.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEdit = (c: CostItem) => {
    setEditingId(c.id)
    setForm({
      category: c.category,
      name: c.name,
      unit: c.unit,
      amount: c.amount,
      currency: c.currency,
      active: c.active,
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = () => {
    const parsed: CostForm = {
      ...form,
      name: form.name.trim(),
      unit: form.unit.trim(),
      amount: form.amount.trim(),
    }
    if (editingId) {
      setCosts((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...parsed } : c)))
    } else {
      setCosts((prev) => [...prev, { id: crypto.randomUUID(), ...parsed }])
    }
    closeDialog()
  }

  const handleDelete = (id: string) => {
    setCosts((prev) => prev.filter((c) => c.id !== id))
  }

  const isValid = form.name.trim() !== '' && form.amount.trim() !== ''

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Parámetros de costos: fletes, seguros, aranceles y comisiones
          </p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={openNew}>
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
          const count = costs.filter((c) => c.category === cat).length
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
                    <TableCell className="text-sm text-gray-500">{c.unit || '—'}</TableCell>
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
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No hay costos registrados</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Agrega fletes, seguros, aranceles o comisiones
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar costo' : 'Nuevo costo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cost-name">Nombre</Label>
              <Input
                id="cost-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre del costo"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cost-category">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger id="cost-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cost-unit">Unidad</Label>
                <Input
                  id="cost-unit"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  placeholder="Ej: contenedor"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost-amount">Monto</Label>
                <Input
                  id="cost-amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Ej: 3200 o 1.2%"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cost-currency">Moneda</Label>
              <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger id="cost-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                      {cur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={handleSave} disabled={!isValid}>
              {editingId ? 'Guardar cambios' : 'Crear costo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
