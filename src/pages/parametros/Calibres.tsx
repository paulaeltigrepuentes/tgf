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
import { Plus, Search, Edit, Trash2, CircleGauge } from 'lucide-react'

interface Caliber {
  id: string
  /** Gramaje: peso por fruta en gramos (ej: "227-274 g") */
  grammage: string
  /** Calibre: frutas por caja (ej: "24") */
  code: string
  /** Valor COP: precio de compra de la fruta en campo, por kilo (COP) */
  valueCop: number
  /** Kilos comprados */
  kilos: number
}

const initialCalibers: Caliber[] = []

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 2,
})

type CaliberForm = {
  grammage: string
  code: string
  valueCop: string
  kilos: string
}

const emptyForm: CaliberForm = { grammage: '', code: '', valueCop: '', kilos: '' }

export default function Calibres() {
  const [calibers, setCalibers] = useState<Caliber[]>(initialCalibers)
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CaliberForm>(emptyForm)

  const filtered = calibers.filter(
    (c) => !search || c.code.includes(search) || c.grammage.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEdit = (c: Caliber) => {
    setEditingId(c.id)
    setForm({
      grammage: c.grammage,
      code: c.code,
      valueCop: String(c.valueCop),
      kilos: String(c.kilos),
    })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = () => {
    const parsed: Omit<Caliber, 'id'> = {
      grammage: form.grammage.trim(),
      code: form.code.trim(),
      valueCop: Number(form.valueCop) || 0,
      kilos: Number(form.kilos) || 0,
    }
    if (editingId) {
      setCalibers((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...parsed } : c)))
    } else {
      setCalibers((prev) => [...prev, { id: crypto.randomUUID(), ...parsed }])
    }
    closeDialog()
  }

  const handleDelete = (id: string) => {
    setCalibers((prev) => prev.filter((c) => c.id !== id))
  }

  const isValid = form.code.trim() !== '' && Number(form.valueCop) > 0 && Number(form.kilos) > 0

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calibres</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Precio de compra de la fruta en campo (COP) por calibre
          </p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={openNew}>
          <Plus className="w-4 h-4" />
          Nuevo calibre
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por calibre o gramaje..."
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
                  <TableHead>Gramaje</TableHead>
                  <TableHead>Calibre</TableHead>
                  <TableHead className="text-right">Valor COP (por kg)</TableHead>
                  <TableHead className="text-right">Kilos</TableHead>
                  <TableHead className="text-right">Total (COP)</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="group">
                    <TableCell className="text-gray-600">{c.grammage || '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#2D6A4F]">{c.code}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Cal. {c.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-700">
                      {copFormatter.format(c.valueCop)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-gray-700">
                      {numberFormatter.format(c.kilos)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-gray-900">
                      {copFormatter.format(c.valueCop * c.kilos)}
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
                    <TableCell colSpan={6} className="text-center py-12">
                      <CircleGauge className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No hay calibres registrados</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Agrega un calibre con su precio de compra en campo
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
            <DialogTitle>{editingId ? 'Editar calibre' : 'Nuevo calibre'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cal-grammage">Gramaje</Label>
                <Input
                  id="cal-grammage"
                  value={form.grammage}
                  onChange={(e) => setForm({ ...form, grammage: e.target.value })}
                  placeholder="Ej: 227-274 g"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cal-code">Calibre</Label>
                <Input
                  id="cal-code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Ej: 24"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-value">Valor COP (por kg)</Label>
              <Input
                id="cal-value"
                type="number"
                inputMode="numeric"
                value={form.valueCop}
                onChange={(e) => setForm({ ...form, valueCop: e.target.value })}
                placeholder="Ej: 4500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-kilos">Kilos</Label>
              <Input
                id="cal-kilos"
                type="number"
                inputMode="decimal"
                value={form.kilos}
                onChange={(e) => setForm({ ...form, kilos: e.target.value })}
                placeholder="Ej: 18000"
              />
            </div>
            {Number(form.valueCop) > 0 && Number(form.kilos) > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-[#2D6A4F]/5 px-3 py-2">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-mono font-semibold text-[#2D6A4F]">
                  {copFormatter.format(Number(form.valueCop) * Number(form.kilos))}
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332]" onClick={handleSave} disabled={!isValid}>
              {editingId ? 'Guardar cambios' : 'Crear calibre'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
