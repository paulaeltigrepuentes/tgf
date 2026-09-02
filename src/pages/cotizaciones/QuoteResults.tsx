import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { TrendingUp, Package, Ship } from 'lucide-react'
import type { QuoteResult, Incoterm } from '@/lib/calculations'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

interface QuoteResultsProps {
  result: QuoteResult
  incoterm: Incoterm
}

function StatRow({
  label,
  value,
  strong = false,
  accent = false,
}: {
  label: string
  value: string
  strong?: boolean
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-sm ${strong ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span
        className={`font-mono tabular-nums ${
          accent ? 'text-base font-bold text-primary' : strong ? 'font-semibold text-foreground' : 'text-sm text-foreground'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function QuoteResults({ result, incoterm }: QuoteResultsProps) {
  const isCif = incoterm === 'CIF'
  const sale = isCif ? result.cifSale : result.fobSale
  const marginPositive = result.consolidatedMargin >= 0

  return (
    <div className="space-y-5">
      {/* Headline */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">Resumen consolidado · {incoterm}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatRow label={`Venta total ${incoterm} (EUR)`} value={formatCurrency(sale, 'EUR')} accent />
          <StatRow label="Utilidad total (EUR)" value={formatCurrency(result.profit, 'EUR')} strong />
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-foreground">Margen consolidado</span>
            <Badge
              className={
                marginPositive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }
            >
              {formatPercent(result.consolidatedMargin)}
            </Badge>
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            Margen calculado sobre totales (utilidad / venta), no como promedio de líneas.
          </p>
        </CardContent>
      </Card>

      {/* Quantities & fruit */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Cantidades y fruta</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatRow label="Cajas totales" value={formatNumber(result.boxes)} />
          <StatRow label="Kilos totales" value={`${formatNumber(result.kilos, 2)} kg`} />
          <StatRow label="Costo de fruta (COP)" value={formatCurrency(result.fruitCost, 'COP')} />
          <StatRow
            label="Precio compra promedio (COP/kg)"
            value={formatCurrency(result.averagePurchasePrice, 'COP')}
          />
        </CardContent>
      </Card>

      {/* Cost breakdown FOB / CIF */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Ship className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Costos FOB y CIF (COP)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatRow label="Costos operativos (base)" value={formatCurrency(result.operatingCostsBase, 'COP')} />
          <StatRow label="Imprevistos" value={formatCurrency(result.contingency, 'COP')} />
          <Separator />
          <StatRow label="Costo FOB total" value={formatCurrency(result.fobCost, 'COP')} strong />
          <StatRow label="Costo FOB por kg" value={formatCurrency(result.fobCostPerKg, 'COP')} />
          <Separator />
          <StatRow label="Flete marítimo (USD)" value={formatCurrency(result.freight, 'USD')} />
          <StatRow label="Seguro marítimo" value={formatNumber(result.insurance, 2)} />
          <StatRow label="Costo CIF total" value={formatCurrency(result.cifCost, 'COP')} strong />
          <StatRow label="Costo CIF por kg" value={formatCurrency(result.cifCostPerKg, 'COP')} />
        </CardContent>
      </Card>

      {/* Per-line detail */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detalle por calibre (EUR)</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Calibre</TableHead>
                  <TableHead className="text-right">Cajas</TableHead>
                  <TableHead className="text-right">Costo/kg</TableHead>
                  <TableHead className="text-right">Venta/caja</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.lines.map((line) => {
                  const costPerKg = isCif ? line.cifCostPerKgEUR : line.fobCostPerKgEUR
                  const salePerBox = isCif ? line.cifSalePricePerBoxEUR : line.fobSalePricePerBoxEUR
                  const subtotal = isCif ? line.cifSubtotalEUR : line.fobSubtotalEUR
                  const profit = isCif ? line.cifProfitEUR : line.fobProfitEUR
                  return (
                    <TableRow key={`${line.caliber}-${line.kgPerBox}`}>
                      <TableCell className="font-medium">{line.caliber}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatNumber(line.boxes)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrency(costPerKg, 'EUR')}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrency(salePerBox, 'EUR')}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrency(subtotal, 'EUR')}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-emerald-700">
                        {formatCurrency(profit, 'EUR')}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
