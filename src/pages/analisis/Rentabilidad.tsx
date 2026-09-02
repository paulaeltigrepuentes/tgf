import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  BarChart3,
  DollarSign,
  Percent,
} from 'lucide-react'

interface ProfitabilityRow {
  quote: string
  client: string
  destination: string
  fobValue: string
  cifValue: string
  cost: string
  margin: string
  marginPct: string
  trend: 'up' | 'down'
}

const mockData: ProfitabilityRow[] = [
  { quote: 'COT-2025-024', client: 'EuroHass B.V.', destination: 'Róterdam, NL', fobValue: '$162,200', cifValue: '$186,400', cost: '$157,860', margin: '$28,540', marginPct: '15.3', trend: 'up' },
  { quote: 'COT-2025-023', client: 'FreshConnect GmbH', destination: 'Hamburgo, DE', fobValue: '$124,600', cifValue: '$142,800', cost: '$124,280', margin: '$18,520', marginPct: '13.0', trend: 'down' },
  { quote: 'COT-2025-022', client: 'MedFruit Iberia', destination: 'Algeciras, ES', fobValue: '$85,400', cifValue: '$98,200', cost: '$86,490', margin: '$11,710', marginPct: '11.9', trend: 'down' },
  { quote: 'COT-2025-019', client: 'EuroHass B.V.', destination: 'Róterdam, NL', fobValue: '$142,500', cifValue: '$163,500', cost: '$141,180', margin: '$22,320', marginPct: '13.7', trend: 'up' },
  { quote: 'COT-2025-018', client: 'FreshConnect GmbH', destination: 'Hamburgo, DE', fobValue: '$172,400', cifValue: '$198,200', cost: '$171,430', margin: '$26,770', marginPct: '13.5', trend: 'up' },
  { quote: 'COT-2025-016', client: 'AlpFruit AG', destination: 'Basilea, CH', fobValue: '$213,800', cifValue: '$245,800', cost: '$210,580', margin: '$35,220', marginPct: '14.3', trend: 'up' },
]

const summaryCards = [
  { label: 'Margen promedio ponderado', value: '14.1%', trend: 'up', change: '+0.8pp vs mes anterior', icon: <Percent className="w-5 h-5" />, color: 'bg-[#2D6A4F]/10 text-[#2D6A4F]' },
  { label: 'Ganancia total mes', value: '$143,080', trend: 'up', change: '+18.3% vs mes anterior', icon: <DollarSign className="w-5 h-5" />, color: 'bg-[#D4A017]/10 text-[#D4A017]' },
  { label: 'Cotizaciones rentables', value: '5 / 6', trend: 'up', change: '83.3% del total', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Margen más bajo', value: '11.9%', trend: 'down', change: 'COT-2025-022 · ES', icon: <TrendingDown className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
]

export default function Rentabilidad() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Rentabilidad</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Evaluación de márgenes y rentabilidad por cotización
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Calendar className="w-4 h-4" />
            Últimos 30 días
          </Button>
          <Button variant="outline" className="gap-1.5">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label} className="border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.color)}>
                  {card.icon}
                </div>
                <span className={cn(
                  'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                  card.trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                )}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.trend === 'up' ? '+' : ''}{card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main table */}
        <div className="xl:col-span-2">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Rentabilidad por cotización
              </CardTitle>
              <CardDescription className="text-xs">
                Margen FOB/CIF vs costo total para cada cotización
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Cotización', 'Cliente', 'Destino', 'Valor FOB', 'Valor CIF', 'Costo total', 'Margen', 'Margen %'].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockData.map((row) => (
                      <tr key={row.quote} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-[#2D6A4F]">{row.quote}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.client}</td>
                        <td className="px-4 py-3 text-gray-500">{row.destination}</td>
                        <td className="px-4 py-3 font-mono text-gray-700">{row.fobValue}</td>
                        <td className="px-4 py-3 font-mono font-medium text-gray-900">{row.cifValue}</td>
                        <td className="px-4 py-3 font-mono text-gray-500">{row.cost}</td>
                        <td className="px-4 py-3 font-mono font-semibold text-gray-900">{row.margin}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                              <div
                                className={cn('h-1.5 rounded-full', parseFloat(row.marginPct) >= 14 ? 'bg-emerald-500' : 'bg-amber-500')}
                                style={{ width: `${Math.min(parseFloat(row.marginPct) * 5, 100)}%` }}
                              />
                            </div>
                            <span className={cn(
                              'text-xs font-bold',
                              parseFloat(row.marginPct) >= 14 ? 'text-emerald-600' : 'text-amber-600'
                            )}>
                              {row.marginPct}%
                            </span>
                            {row.trend === 'up' ? (
                              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Análisis por destino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { dest: 'Países Bajos (Róterdam)', margin: '15.3%', count: 3, color: 'bg-emerald-500' },
                { dest: 'Alemania (Hamburgo)', margin: '13.2%', count: 2, color: 'bg-blue-500' },
                { dest: 'España (Algeciras)', margin: '11.9%', count: 1, color: 'bg-amber-500' },
                { dest: 'Suiza (Basilea)', margin: '14.3%', count: 1, color: 'bg-purple-500' },
              ].map((d) => (
                <div key={d.dest} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2 h-8 rounded-full', d.color)} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{d.dest}</p>
                      <p className="text-xs text-gray-400">{d.count} cotización{d.count > 1 ? 'es' : ''}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{d.margin}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Rango de fechas</Label>
                <Input type="date" defaultValue="2025-07-01" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Margen mínimo (%)</Label>
                <Input type="number" placeholder="Ej: 10" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Cliente</Label>
                <Input placeholder="Todos los clientes" className="text-sm" />
              </div>
              <Button className="w-full bg-[#2D6A4F] hover:bg-[#1B4332]">Aplicar filtros</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
