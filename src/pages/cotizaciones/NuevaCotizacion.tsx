import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Package,
  MapPin,
  Scale,
  Ship,
  DollarSign,
  Percent,
  ChevronRight,
  Save,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react'

const mockClients = [
  { id: '1', name: 'EuroHass B.V.', country: 'Países Bajos' },
  { id: '2', name: 'FreshConnect GmbH', country: 'Alemania' },
  { id: '3', name: 'MedFruit Iberia', country: 'España' },
  { id: '4', name: 'AlpFruit AG', country: 'Suiza' },
  { id: '5', name: 'Nordic Produce AS', country: 'Noruega' },
]

const mockProducts = ['Aguacate Hass', 'Aguacate Hass Organic', 'Aguacate Hass Premium']
const mockCalibers = ['20', '22', '24', '26', '28', '30', '32', '36', '40']
const mockDestinations = [
  'Róterdam, Países Bajos',
  'Hamburgo, Alemania',
  'Algeciras, España',
  'Basilea, Suiza',
  'Oslo, Noruega',
  'Gante, Bélgica',
  'Le Havre, Francia',
]
const mockRoutes = [
  'Buenaventura → Róterdam (40 dias)',
  'Cartagena → Hamburgo (35 dias)',
  'Buenaventura → Algeciras (38 dias)',
  'Cartagena → Basilea (42 dias)',
]
const mockCurrencies = ['USD', 'EUR', 'COP']

interface ContainerRow {
  id: string
  pallets: string
  boxes: string
  netWeight: string
  grossWeight: string
}

export default function NuevaCotizacion() {
  const [currency, setCurrency] = useState('USD')

  const [containers, setContainers] = useState<ContainerRow[]>([
    { id: '1', pallets: '20', boxes: '1,800', netWeight: '7,200', grossWeight: '7,920' },
  ])

  const addContainer = () => {
    setContainers((prev) => [
      ...prev,
      { id: Date.now().toString(), pallets: '20', boxes: '1,800', netWeight: '7,200', grossWeight: '7,920' },
    ])
  }

  const removeContainer = (id: string) => {
    if (containers.length > 1) setContainers((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Cotización</h1>
          <p className="text-sm text-gray-500 mt-0.5">Crear una nueva cotización de exportación</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Eye className="w-4 h-4" />
            Vista previa
          </Button>
          <Button className="gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332]">
            <Save className="w-4 h-4" />
            Guardar borrador
          </Button>
          <Button className="gap-1.5 bg-[#D4A017] hover:bg-[#B8900F] text-white">
            <ChevronRight className="w-4 h-4" />
            Calcular y ver resumen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="xl:col-span-2 space-y-5">
          {/* General info */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <div>
                  <CardTitle className="text-base">Información general</CardTitle>
                  <CardDescription className="text-xs">Datos básicos de la cotización</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="number">Número de cotización</Label>
                  <Input id="number" value="COT-2025-025" readOnly className="bg-gray-50 font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" type="date" defaultValue="2025-07-15" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cliente</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} · {c.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="incoterm">Incoterm</Label>
                  <Select defaultValue="fob">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fob">FOB · Free On Board</SelectItem>
                      <SelectItem value="cif">CIF · Cost, Insurance & Freight</SelectItem>
                      <SelectItem value="dap">DAP · Delivered At Place</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4A017]/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#D4A017]" />
                </div>
                <div>
                  <CardTitle className="text-base">Producto y especificaciones</CardTitle>
                  <CardDescription className="text-xs">Definir producto, calibre y cantidad</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Producto</Label>
                  <Select defaultValue="0">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((p, i) => (
                        <SelectItem key={i} value={i.toString()}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Calibre principal</Label>
                  <Select defaultValue="22">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCalibers.map((c) => (
                        <SelectItem key={c} value={c}>{c} (frutas/caja 4kg)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="boxes">Cajas totales</Label>
                  <Input id="boxes" type="number" placeholder="Ej: 1800" defaultValue="1800" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="netWeight">Peso neto (kg)</Label>
                  <Input id="netWeight" type="number" placeholder="Ej: 7200" defaultValue="7200" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="grossWeight">Peso bruto (kg)</Label>
                  <Input id="grossWeight" type="number" placeholder="Ej: 7920" defaultValue="7920" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logistics */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Ship className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Logística y destino</CardTitle>
                  <CardDescription className="text-xs">Puerto de destino y ruta de envío</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Mercado destino</Label>
                  <Select defaultValue="0">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDestinations.map((d, i) => (
                        <SelectItem key={i} value={i.toString()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Ruta logística</Label>
                  <Select defaultValue="0">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoutes.map((r, i) => (
                        <SelectItem key={i} value={i.toString()}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="portEta">ETA estimada (días)</Label>
                  <Input id="portEta" type="number" placeholder="Ej: 40" defaultValue="40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="containerType">Tipo de contenedor</Label>
                  <Select defaultValue="40hq">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40hq">40' High Cube (26 pallets)</SelectItem>
                      <SelectItem value="20">20' Standard (20 pallets)</SelectItem>
                      <SelectItem value="40">40' Standard (22 pallets)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Containers */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Contenedores</CardTitle>
                    <CardDescription className="text-xs">Detalle de contenedores y carga</CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={addContainer}>
                  <Plus className="w-3.5 h-3.5" />
                  Agregar contenedor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {containers.map((container, idx) => (
                  <div key={container.id} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Contenedor {idx + 1}</Label>
                      <Input value={`CTR-${(1000 + idx + 1).toString()}`} readOnly className="bg-white font-mono text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Palés</Label>
                      <Input
                        type="number"
                        value={container.pallets}
                        onChange={(e) => {
                          const updated = [...containers]
                          updated[idx].pallets = e.target.value
                          setContainers(updated)
                        }}
                        className="bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Cajas</Label>
                      <Input
                        type="number"
                        value={container.boxes}
                        onChange={(e) => {
                          const updated = [...containers]
                          updated[idx].boxes = e.target.value
                          setContainers(updated)
                        }}
                        className="bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Peso neto (kg)</Label>
                      <Input
                        type="number"
                        value={container.netWeight}
                        onChange={(e) => {
                          const updated = [...containers]
                          updated[idx].netWeight = e.target.value
                          setContainers(updated)
                        }}
                        className="bg-white text-sm"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs text-gray-500">Peso bruto (kg)</Label>
                        <Input
                          type="number"
                          value={container.grossWeight}
                          onChange={(e) => {
                            const updated = [...containers]
                            updated[idx].grossWeight = e.target.value
                            setContainers(updated)
                          }}
                          className="bg-white text-sm"
                        />
                      </div>
                      {containers.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          onClick={() => removeContainer(container.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar - financial summary preview */}
        <div className="space-y-5">
          <Card className="border-gray-200 sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2D6A4F]/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-[#2D6A4F]" />
                </div>
                <CardTitle className="text-base">Resumen financiero</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Moneda de cotización</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCurrencies.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {[
                { label: 'Tasa de cambio (USD/COP)', value: '$4,285.00', editable: true },
                { label: 'Precio FOB unitario (USD)', value: '$8.50 / caja', editable: true },
                { label: 'Total cajas', value: '1,800' },
                { label: 'Valor FOB total', value: '$15,300 USD', highlight: true },
              ].map((item) => (
                <div key={item.label} className={item.highlight ? 'pt-2 border-t border-gray-200' : ''}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${item.highlight ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-mono ${item.highlight ? 'font-bold text-[#2D6A4F]' : 'text-gray-700'}`}>
                      {item.value}
                    </span>
                  </div>
                  {item.editable && (
                    <Input type="number" placeholder="Ingresar" className="mt-1 h-8 text-sm" />
                  )}
                </div>
              ))}

              <Separator />

              {[
                { label: 'Flete marítimo', value: '$3,200 USD' },
                { label: 'Seguro', value: '$450 USD' },
                { label: 'Arancel destino', value: '$0 (acuerdo)' },
                { label: 'Comisiones', value: '$280 USD' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-mono text-gray-700">{item.value}</span>
                </div>
              ))}

              <Separator />

              <div className="bg-[#2D6A4F]/5 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Valor CIF total</span>
                  <span className="text-base font-bold font-mono text-[#2D6A4F]">$19,230 USD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Margen estimado</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    <Percent className="w-3 h-3 mr-0.5" />
                    14.5%
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Los cálculos se mostrarán al hacer clic en "Calcular y ver resumen"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
