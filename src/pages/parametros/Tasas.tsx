import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  ArrowLeftRight,
  Plus,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react'

const mockRates = [
  { id: '1', pair: 'USD/COP', rate: '$4,285.00', type: 'TRM', date: '2025-07-15', trend: 'up', change: '+0.3%', source: 'Banco de la República' },
  { id: '2', pair: 'EUR/COP', rate: '$4,648.50', type: 'Referencia', date: '2025-07-15', trend: 'down', change: '−0.1%', source: 'Banco de la República' },
  { id: '3', pair: 'EUR/USD', rate: '$1.0847', type: 'Referencia', date: '2025-07-15', trend: 'up', change: '+0.2%', source: 'BCE' },
  { id: '4', pair: 'USD/COP', rate: '$4,310.00', type: 'Compra', date: '2025-07-14', trend: 'down', change: '−0.2%', source: 'Bancolombia' },
  { id: '5', pair: 'USD/COP', rate: '$4,350.00', type: 'Venta', date: '2025-07-14', trend: 'up', change: '+0.2%', source: 'Bancolombia' },
]

export default function Tasas() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasas de cambio</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tasas de cambio USD, EUR y COP actualizadas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <RefreshCw className="w-4 h-4" />
            Actualizar tasas
          </Button>
          <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]">
            <Plus className="w-4 h-4" />
            Nueva tasa
          </Button>
        </div>
      </div>

      {/* Current rates highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { pair: 'USD/COP', rate: '$4,285', label: 'TRM hoy', trend: 'up', change: '+0.3%' },
          { pair: 'EUR/COP', rate: '$4,649', label: 'Referencia', trend: 'down', change: '−0.1%' },
          { pair: 'EUR/USD', rate: '$1.0847', label: 'BCE', trend: 'up', change: '+0.2%' },
        ].map((r) => (
          <Card key={r.pair} className="border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">{r.pair}</span>
                <span className={r.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}>
                  {r.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{r.rate}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">{r.label}</span>
                <span className={`text-xs font-medium ${r.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {r.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900">Histórico de tasas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Par</TableHead>
                  <TableHead>Tasa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Variación</TableHead>
                  <TableHead className="hidden lg:table-cell">Fuente</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRates.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-mono font-semibold text-gray-900">{r.pair}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-gray-900">{r.rate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                        {r.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{r.date}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${r.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {r.change}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-400">{r.source}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <RefreshCw className="w-4 h-4" />
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
