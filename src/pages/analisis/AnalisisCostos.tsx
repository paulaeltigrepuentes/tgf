import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  BarChart3,
  DollarSign,
  Ship,
  Shield,
  Percent,
  Users,
  TrendingDown,
  Download,
} from 'lucide-react'

interface CostItem {
  category: string
  description: string
  unitCost: string
  totalCost: string
  currency: string
  notes: string
}

const mockCostItems: CostItem[] = [
  { category: 'Producto', description: 'Aguacate Hass Cal. 22', unitCost: '$7.80', totalCost: '$14,040', currency: 'USD', notes: 'Precio por caja de 4kg' },
  { category: 'Producto', description: 'Costo empaque (caja 4kg)', unitCost: '$0.85', totalCost: '$1,530', currency: 'USD', notes: 'Incluye sticker exportador' },
  { category: 'Flete', description: 'Flete marítimo Buenaventura → Róterdam', unitCost: '$3,200', totalCost: '$3,200', currency: 'USD', notes: 'Contenedor 40\' HC' },
  { category: 'Seguro', description: 'Seguro marítimo (1.2% valor)', unitCost: '$450', totalCost: '$450', currency: 'USD', notes: 'Cobertura all-risks' },
  { category: 'Arancel', description: 'Arancel importación UE (0%)', unitCost: '$0', totalCost: '$0', currency: 'USD', notes: 'Acuerdo comercial vigente' },
  { category: 'Impuestos', description: 'IVA importación NL (9%)', unitCost: '$16,776', totalCost: '$16,776', currency: 'EUR', notes: 'Calculado sobre valor CIF' },
  { category: 'Comisiones', description: 'Comisión agente aduanero', unitCost: '$180', totalCost: '$180', currency: 'USD', notes: 'Flat fee' },
  { category: 'Comisiones', description: 'Comisión agente comercial', unitCost: '$100', totalCost: '$100', currency: 'USD', notes: '2% sobre valor FOB' },
]

const costByCategory = [
  { category: 'Producto', total: '$15,570', pct: '54.7%', color: 'bg-[#2D6A4F]' },
  { category: 'Flete', total: '$3,200', pct: '11.2%', color: 'bg-[#D4A017]' },
  { category: 'Impuestos', total: '$16,776', pct: '23.3%', color: 'bg-blue-500' },
  { category: 'Seguro', total: '$450', pct: '1.6%', color: 'bg-purple-500' },
  { category: 'Comisiones', total: '$280', pct: '1.0%', color: 'bg-amber-500' },
  { category: 'Arancel', total: '$0', pct: '0%', color: 'bg-gray-300' },
]

export default function AnalisisCostos() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Costos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Desglose detallado de costos por cotización (referencia COT-2025-024)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="w-4 h-4" />
            Exportar análisis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cost breakdown table */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Desglose de costos por categoría
              </CardTitle>
              <CardDescription className="text-xs">
                Costos unitarios y totales para contenedor de referencia
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Categoría', 'Descripción', 'Costo unitario', 'Costo total', 'Moneda', 'Notas'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockCostItems.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{item.unitCost}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900">{item.totalCost}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.currency}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px]">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">Total costos</td>
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">$19,530</td>
                    <td colSpan={2} className="px-4 py-3 text-xs text-gray-400">USD + EUR</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* Unit costs comparison */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Comparativa de costos unitarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Costo por caja (USD)', col22: '$8.65', col24: '$8.20', col26: '$7.85' },
                  { label: 'Costo por kg (USD)', col22: '$2.16', col24: '$2.05', col26: '$1.96' },
                  { label: 'Costo contenedor (USD)', col22: '$15,570', col24: '$14,760', col26: '$14,130' },
                  { label: 'Flete/kg (USD)', col22: '$0.44', col24: '$0.44', col26: '$0.44' },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-4 gap-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{row.label}</span>
                    </div>
                    <div className="text-center p-2 bg-[#2D6A4F]/5 rounded-lg border border-[#2D6A4F]/20">
                      <p className="text-xs text-gray-400">Cal. 22</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">{row.col22}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400">Cal. 24</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">{row.col24}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400">Cal. 26</p>
                      <p className="text-sm font-mono font-semibold text-gray-900">{row.col26}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cost distribution */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Distribución de costos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {costByCategory.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{item.pct}</span>
                      <span className="text-sm font-mono font-semibold text-gray-900">{item.total}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all', item.color)}
                      style={{ width: item.pct === '0%' ? '4px' : item.pct }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick cost calculator */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Calculadora rápida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Número de cajas</Label>
                <Input type="number" placeholder="Ej: 1800" defaultValue="1800" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Precio caja (USD)</Label>
                <Input type="number" placeholder="Ej: 7.80" defaultValue="7.80" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Tasa de cambio (COP)</Label>
                <Input type="number" placeholder="Ej: 4285" defaultValue="4285" className="text-sm" />
              </div>
              <Separator />
              <div className="space-y-2">
                {[
                  { label: 'Costo producto', value: '$14,040 USD' },
                  { label: 'Costo total (estimado)', value: '$19,530 USD' },
                  { label: 'En COP', value: '$83.7M COP' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{r.label}</span>
                    <span className="text-sm font-mono font-semibold text-gray-900">{r.value}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-[#2D6A4F] hover:bg-[#1B4332]">Calcular</Button>
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
