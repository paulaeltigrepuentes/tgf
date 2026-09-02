import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from 'lucide-react'

interface StatCard {
  title: string
  value: string
  subtitle: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ReactNode
  iconColor: string
}

const stats: StatCard[] = [
  {
    title: 'Cotizaciones este mes',
    value: '0',
    subtitle: '0 aprobadas · 0 pendientes · 0 borradores',
    icon: <FileText className="w-5 h-5" />,
    iconColor: 'bg-[#2D6A4F]/10 text-[#2D6A4F]',
  },
  {
    title: 'Valor total exportado',
    value: '$0',
    subtitle: 'Sin cotizaciones registradas',
    icon: <DollarSign className="w-5 h-5" />,
    iconColor: 'bg-[#D4A017]/10 text-[#D4A017]',
  },
  {
    title: 'Margen promedio',
    value: '—',
    subtitle: 'Margen ponderado FOB/CIF',
    icon: <TrendingUp className="w-5 h-5" />,
    iconColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Tasa de cambio',
    value: '—',
    subtitle: 'USD/COP · configúrala en Parámetros › Tasas',
    icon: <Activity className="w-5 h-5" />,
    iconColor: 'bg-blue-50 text-blue-600',
  },
]

interface RecentQuote {
  id: string
  number: string
  client: string
  destination: string
  value: string
  margin: string
  status: 'approved' | 'pending' | 'draft' | 'rejected'
  date: string
}

const recentQuotes: RecentQuote[] = []

const statusConfig: Record<RecentQuote['status'], { label: string; class: string }> = {
  approved: { label: 'Aprobada', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pending: { label: 'Pendiente', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  draft: { label: 'Borrador', class: 'bg-gray-50 text-gray-600 border-gray-200' },
  rejected: { label: 'Rechazada', class: 'bg-red-50 text-red-700 border-red-200' },
}

interface QuickAction {
  label: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

const quickActions: QuickAction[] = [
  {
    label: 'Nueva cotización',
    description: 'Crear una cotización de exportación',
    href: '/cotizaciones/nueva',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-[#2D6A4F]',
  },
  {
    label: 'Historial',
    description: 'Ver cotizaciones anteriores',
    href: '/cotizaciones',
    icon: <Clock className="w-5 h-5" />,
    color: 'bg-[#D4A017]',
  },
  {
    label: 'Análisis',
    description: 'Rentabilidad y costos',
    href: '/analisis/rentabilidad',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-emerald-600',
  },
]

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Resumen operativo · Colombiana de Commodities SAS
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.iconColor)}>
                  {stat.icon}
                </div>
                {stat.trend && (
                  <div className={cn(
                    'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                    stat.trend === 'up' && 'bg-emerald-50 text-emerald-700',
                    stat.trend === 'down' && 'bg-red-50 text-red-600',
                    stat.trend === 'neutral' && 'bg-gray-50 text-gray-500'
                  )}>
                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                    {stat.trendValue}
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent quotes */}
        <div className="xl:col-span-2">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Cotizaciones recientes
                </CardTitle>
                <a href="/cotizaciones" className="text-sm text-[#2D6A4F] hover:underline font-medium">
                  Ver todas →
                </a>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Número</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Destino</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Valor</th>
                      <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Margen</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentQuotes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center">
                          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">Aún no hay cotizaciones</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Crea tu primera cotización para ver el resumen aquí
                          </p>
                          <a
                            href="/cotizaciones/nueva"
                            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-lg bg-[#2D6A4F] text-white text-sm font-medium hover:bg-[#1B4332] transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Nueva cotización
                          </a>
                        </td>
                      </tr>
                    )}
                    {recentQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs font-semibold text-[#2D6A4F]">{q.number}</td>
                        <td className="px-5 py-3 font-medium text-gray-900">{q.client}</td>
                        <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{q.destination}</td>
                        <td className="px-5 py-3 text-right font-medium text-gray-900">{q.value}</td>
                        <td className="px-5 py-3 text-right font-medium text-gray-900">{q.margin}</td>
                        <td className="px-5 py-3">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', statusConfig[q.status].class)}>
                            {statusConfig[q.status].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Acciones rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#2D6A4F]/40 hover:shadow-sm transition-all group"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0', action.color)}>
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2D6A4F] transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-400">{action.description}</p>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          {/* System status */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Estado del sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Base de datos', status: 'online' },
                { label: 'API de tasas', status: 'online' },
                { label: 'Generación PDF', status: 'online' },
                { label: 'Última sincronización', status: 'info', value: 'Hace 5 min' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  {item.status === 'online' && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Operativo
                    </span>
                  )}
                  {item.status === 'info' && (
                    <span className="text-xs text-gray-400">{item.value}</span>
                  )}
                </div>
              ))}
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
