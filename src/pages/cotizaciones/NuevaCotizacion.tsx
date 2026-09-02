import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package, Scale, Ship, Coins, Percent, Plus, Trash2 } from 'lucide-react'
import {
  calculateQuoteTotals,
  CALIBER_TABLE,
  PACKAGING_TABLE,
  type CaliberLineInput,
  type Incoterm,
  type PackagingType,
  type QuoteInput,
} from '@/lib/calculations'
import { QuoteResults } from './QuoteResults'

// --- Editable line shape (strings for controlled inputs) ---
interface LineRow {
  id: string
  caliber: number
  packaging: PackagingType
  boxes: string
  purchasePrice: string
  margin: string // percent, e.g. "15"
}

const packagingByType = (type: PackagingType) =>
  PACKAGING_TABLE.find((p) => p.type === type) ?? PACKAGING_TABLE[0]

function makeLine(partial?: Partial<LineRow>): LineRow {
  return {
    id: crypto.randomUUID(),
    caliber: 22,
    packaging: '10kg',
    boxes: '1800',
    purchasePrice: '6500',
    margin: '15',
    ...partial,
  }
}

const num = (v: string) => {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

export default function NuevaCotizacion() {
  const [incoterm, setIncoterm] = useState<Incoterm>('FOB')

  // Exchange rates (always parameters, never hardcoded in the engine)
  const [usdCop, setUsdCop] = useState('4285')
  const [eurCop, setEurCop] = useState('4650')

  // Caliber lines
  const [lines, setLines] = useState<LineRow[]>([makeLine()])

  // Operating costs
  const [fleteTerrestrePorCarro, setFleteTerrestrePorCarro] = useState('4500000')
  const [numeroCarros, setNumeroCarros] = useState('1')
  const [maquilaPorKg, setMaquilaPorKg] = useState('350')
  const [transportePuerto, setTransportePuerto] = useState('2800000')
  const [gastosPuerto, setGastosPuerto] = useState('1500000')
  const [costoAdminPorKg1, setCostoAdminPorKg1] = useState('100')
  const [costoAdminPorKg2, setCostoAdminPorKg2] = useState('50')
  const [analisisResidualidad, setAnalisisResidualidad] = useState('450000')
  const [survey, setSurvey] = useState('600000')
  const [intermediacionFinanciera, setIntermediacionFinanciera] = useState('800000')
  const [gastosBancarios, setGastosBancarios] = useState('300000')
  const [arancel, setArancel] = useState('0')
  const [seguroFactura, setSeguroFactura] = useState('250000')
  const [porcentajeImprevistos, setPorcentajeImprevistos] = useState('5')

  // Freight & insurance
  const [fletePorContenedor, setFletePorContenedor] = useState('3200')
  const [numeroContenedores, setNumeroContenedores] = useState('1')
  const [seguroMaritimo, setSeguroMaritimo] = useState('450')

  const updateLine = (id: string, patch: Partial<LineRow>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  const addLine = () => setLines((prev) => [...prev, makeLine()])
  const removeLine = (id: string) =>
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev))

  // --- Build engine input and compute live ---
  const result = useMemo(() => {
    const engineLines: CaliberLineInput[] = lines.map((l) => {
      const pkg = packagingByType(l.packaging)
      return {
        caliber: l.caliber,
        boxes: num(l.boxes),
        kgPerBox: pkg.kgPerBox,
        purchasePricePerKgCOP: num(l.purchasePrice),
        marginPct: num(l.margin) / 100,
      }
    })

    const totalKilos = engineLines.reduce((s, l) => s + l.boxes * l.kgPerBox, 0)
    const totalCajas = engineLines.reduce((s, l) => s + l.boxes, 0)
    // Weighted packaging cost per box (mixed packaging support), matched by index
    const empaquePorCaja =
      totalCajas > 0
        ? lines.reduce((s, l) => s + packagingByType(l.packaging).costPerBoxCOP * num(l.boxes), 0) / totalCajas
        : 0

    const input: QuoteInput = {
      lines: engineLines,
      rates: { usdCop: num(usdCop), eurCop: num(eurCop) },
      operatingCosts: {
        fleteTerrestrePorCarro: num(fleteTerrestrePorCarro),
        numeroCarros: num(numeroCarros),
        maquilaPorKg: num(maquilaPorKg),
        kilosExportables: totalKilos,
        transportePuerto: num(transportePuerto),
        gastosPuerto: num(gastosPuerto),
        empaquePorCaja,
        costoAdminPorKg1: num(costoAdminPorKg1),
        costoAdminPorKg2: num(costoAdminPorKg2),
        analisisResidualidad: num(analisisResidualidad),
        survey: num(survey),
        intermediacionFinanciera: num(intermediacionFinanciera),
        gastosBancarios: num(gastosBancarios),
        arancel: num(arancel),
        seguroFactura: num(seguroFactura),
        porcentajeImprevistos: num(porcentajeImprevistos) / 100,
      },
      freight: {
        fletePorContenedor: num(fletePorContenedor),
        numeroContenedores: num(numeroContenedores),
      },
      insurance: { valor: num(seguroMaritimo), currency: 'USD' },
      nationalSale: { porcentajeDescuento: 0.1, porcentajeVenta: 0.1, kilosVendidos: 0 },
      incoterm,
      totalCajas,
      totalKilos,
    }

    return calculateQuoteTotals(input)
  }, [
    lines,
    usdCop,
    eurCop,
    fleteTerrestrePorCarro,
    numeroCarros,
    maquilaPorKg,
    transportePuerto,
    gastosPuerto,
    costoAdminPorKg1,
    costoAdminPorKg2,
    analisisResidualidad,
    survey,
    intermediacionFinanciera,
    gastosBancarios,
    arancel,
    seguroFactura,
    porcentajeImprevistos,
    fletePorContenedor,
    numeroContenedores,
    seguroMaritimo,
    incoterm,
  ])

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Cotización</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Cotización de exportación de aguacate Hass · cálculo en vivo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Incoterm</Label>
          <Select value={incoterm} onValueChange={(v) => setIncoterm(v as Incoterm)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FOB">FOB</SelectItem>
              <SelectItem value="CIF">CIF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Form column */}
        <div className="space-y-5 xl:col-span-2">
          {/* Exchange rates */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Coins className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Tasas de cambio</CardTitle>
                  <CardDescription className="text-xs">
                    Parámetros TRM — se aplican a todas las conversiones
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="usdCop">TRM USD/COP</Label>
                <Input id="usdCop" type="number" value={usdCop} onChange={(e) => setUsdCop(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eurCop">TRM EUR/COP</Label>
                <Input id="eurCop" type="number" value={eurCop} onChange={(e) => setEurCop(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Caliber lines */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Líneas por calibre</CardTitle>
                    <CardDescription className="text-xs">
                      Calibre, empaque, cajas, precio de compra y margen
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={addLine}>
                  <Plus className="h-3.5 w-3.5" />
                  Agregar línea
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lines.map((line, idx) => (
                <div
                  key={line.id}
                  className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-4 lg:grid-cols-6"
                >
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Calibre</Label>
                    <Select
                      value={String(line.caliber)}
                      onValueChange={(v) => updateLine(line.id, { caliber: Number(v) })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CALIBER_TABLE.map((c) => (
                          <SelectItem key={c.caliber} value={String(c.caliber)}>
                            {c.caliber} ({c.gramajeRange}g)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Empaque</Label>
                    <Select
                      value={line.packaging}
                      onValueChange={(v) => updateLine(line.id, { packaging: v as PackagingType })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PACKAGING_TABLE.map((p) => (
                          <SelectItem key={p.type} value={p.type}>
                            {p.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Cajas</Label>
                    <Input
                      type="number"
                      className="bg-background"
                      value={line.boxes}
                      onChange={(e) => updateLine(line.id, { boxes: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Compra COP/kg</Label>
                    <Input
                      type="number"
                      className="bg-background"
                      value={line.purchasePrice}
                      onChange={(e) => updateLine(line.id, { purchasePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Margen %</Label>
                    <Input
                      type="number"
                      className="bg-background"
                      value={line.margin}
                      onChange={(e) => updateLine(line.id, { margin: e.target.value })}
                    />
                  </div>
                  <div className="flex items-end">
                    {lines.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => removeLine(line.id)}
                        aria-label={`Eliminar línea ${idx + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Operating costs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--gold-500))]/10">
                  <Scale className="h-4 w-4 text-[hsl(var(--gold-600))]" />
                </div>
                <div>
                  <CardTitle className="text-base">Costos operativos (COP)</CardTitle>
                  <CardDescription className="text-xs">Componentes FOB antes de imprevistos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ['Flete terrestre / carro', fleteTerrestrePorCarro, setFleteTerrestrePorCarro],
                  ['N.º de carros', numeroCarros, setNumeroCarros],
                  ['Maquila COP/kg', maquilaPorKg, setMaquilaPorKg],
                  ['Transporte a puerto', transportePuerto, setTransportePuerto],
                  ['Gastos de puerto', gastosPuerto, setGastosPuerto],
                  ['Admin COP/kg (1)', costoAdminPorKg1, setCostoAdminPorKg1],
                  ['Admin COP/kg (2)', costoAdminPorKg2, setCostoAdminPorKg2],
                  ['Análisis residualidad', analisisResidualidad, setAnalisisResidualidad],
                  ['Survey', survey, setSurvey],
                  ['Intermediación fin.', intermediacionFinanciera, setIntermediacionFinanciera],
                  ['Gastos bancarios', gastosBancarios, setGastosBancarios],
                  ['Arancel', arancel, setArancel],
                  ['Seguro factura', seguroFactura, setSeguroFactura],
                ] as [string, string, (v: string) => void][]
              ).map(([label, value, setter]) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input type="number" value={value} onChange={(e) => setter(e.target.value)} />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Percent className="h-3 w-3" /> Imprevistos %
                </Label>
                <Input
                  type="number"
                  value={porcentajeImprevistos}
                  onChange={(e) => setPorcentajeImprevistos(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Freight & insurance */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <Ship className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Flete y seguro marítimo (CIF)</CardTitle>
                  <CardDescription className="text-xs">Valores en USD</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Flete / contenedor (USD)</Label>
                <Input
                  type="number"
                  value={fletePorContenedor}
                  onChange={(e) => setFletePorContenedor(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">N.º contenedores</Label>
                <Input
                  type="number"
                  value={numeroContenedores}
                  onChange={(e) => setNumeroContenedores(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Seguro marítimo (USD)</Label>
                <Input type="number" value={seguroMaritimo} onChange={(e) => setSeguroMaritimo(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results column */}
        <div className="xl:sticky xl:top-20 xl:h-fit">
          <QuoteResults result={result} incoterm={incoterm} />
        </div>
      </div>
    </div>
  )
}
