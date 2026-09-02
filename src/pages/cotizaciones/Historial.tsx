import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Copy,
  Download,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

interface Quote {
  id: string
  number: string
  date: string
  client: string
  destination: string
  product: string
  caliber: string
  value: string
  currency: string
  margin: string
  status: 'approved' | 'pending' | 'draft' | 'rejected'
  version: string
  createdBy: string
}

const mockQuotes: Quote[] = []

const statusConfig: Record<Quote['status'], { label: string; class: string; dot: string }> = {
  approved: { label: 'Aprobada', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  pending: { label: 'Pendiente', class: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  draft: { label: 'Borrador', class: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  rejected: { label: 'Rechazada', class: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
}

type SortField = 'number' | 'date' | 'client' | 'value' | 'margin' | 'status'
type SortDir = 'asc' | 'desc'

export default function HistorialCotizaciones() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#2D6A4F]" />
      : <ChevronDown className="w-3 h-3 text-[#2D6A4F]" />
  }

  const filtered = mockQuotes
    .filter((q) => {
      const matchSearch =
        !search ||
        q.number.toLowerCase().includes(search.toLowerCase()) ||
        q.client.toLowerCase().includes(search.toLowerCase()) ||
        q.destination.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || q.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortField === 'number') cmp = a.number.localeCompare(b.number)
      if (sortField === 'date') cmp = a.date.localeCompare(b.date)
      if (sortField === 'client') cmp = a.client.localeCompare(b.client)
      if (sortField === 'value') cmp = parseFloat(a.value) - parseFloat(b.value)
      if (sortField === 'margin') cmp = parseFloat(a.margin) - parseFloat(b.margin)
      if (sortField === 'status') cmp = a.status.localeCompare(b.status)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const totalValue = filtered.reduce((sum, q) => sum + parseFloat(q.value.replace(/,/g, '')), 0)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de cotizaciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} cotización{filtered.length !== 1 ? 'es' : ''} · Total: ${totalValue.toLocaleString('en')} USD
          </p>
        </div>
        <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]" asChild>
          <a href="/cotizaciones/nueva">
            <Plus className="w-4 h-4" />
            Nueva cotización
          </a>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, cliente o destino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5 cursor-pointer select-none" onClick={() => handleSort('number')}>
                    <div className="flex items-center gap-1">
                      Número <SortIcon field="number" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Fecha <SortIcon field="date" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('client')}>
                    <div className="flex items-center gap-1">
                      Cliente <SortIcon field="client" />
                    </div>
                  </TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead className="hidden lg:table-cell">Producto</TableHead>
                  <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort('value')}>
                    <div className="flex items-center justify-end gap-1">
                      Valor (USD) <SortIcon field="value" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort('margin')}>
                    <div className="flex items-center justify-end gap-1">
                      Margen <SortIcon field="margin" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">
                      Estado <SortIcon field="status" />
                    </div>
                  </TableHead>
                  <TableHead className="pr-5">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q.id} className="group">
                    <TableCell className="pl-5 font-mono text-sm font-semibold text-[#2D6A4F]">
                      {q.number}
                      <span className="ml-1 text-xs text-gray-400 font-normal">{q.version}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{q.date}</TableCell>
                    <TableCell className="font-medium text-gray-900">{q.client}</TableCell>
                    <TableCell className="text-sm text-gray-500">{q.destination}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                      <div>
                        <span>{q.product}</span>
                        <span className="ml-1 text-xs text-gray-400">Cal. {q.caliber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-gray-900">
                      ${parseFloat(q.value).toLocaleString('en')}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900">{q.margin}%</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[q.status].class}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[q.status].dot} mr-1.5`} />
                        {statusConfig[q.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8" title="Ver">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" title="Duplicar">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" title="Exportar PDF">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No se encontraron cotizaciones</p>
                      <p className="text-sm text-gray-400 mt-1">Ajusta los filtros o crea una nueva cotización</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
