import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PhaseInfo {
  number: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  items: string[];
}

const phases: PhaseInfo[] = [
  {
    number: '01',
    title: 'Fundación técnica y modelo de datos',
    status: 'in-progress',
    description: 'Configuración de base de datos, autenticación con roles, estructura de navegación y modelo de datos relacional.',
    items: [
      'Esquema de base de datos relacional (Supabase/Postgres)',
      'Autenticación con tres roles: gerencial, pricing, comercial',
      'Políticas de seguridad a nivel de fila (RLS)',
      'Modelo de datos para cotizaciones, clientes, parámetros y tasas',
      'Layout de navegación principal y sistema de diseño corporativo',
    ],
  },
  {
    number: '02',
    title: 'Gestión de parámetros y configuración',
    status: 'pending',
    description: 'Módulo para administrar productos, calibres, empaques, tasas de cambio, fletes, seguros y parámetros de costeo.',
    items: [
      'CRUD de productos y calibres',
      'Configuración de empaques',
      'Gestión de tasas de cambio con spread',
      'Tarifas de flete y seguro por ruta',
      'Parámetros de costeo y márgenes',
    ],
  },
  {
    number: '03',
    title: 'Gestión de clientes',
    status: 'pending',
    description: 'Módulo de clientes europeos con datos completos, incoterm por defecto y trazabilidad.',
    items: [
      'Registro y edición de clientes',
      'Gestión de contactos y términos de pago',
      'Historial de cotizaciones por cliente',
    ],
  },
  {
    number: '04',
    title: 'Cotizador visual y análisis de rentabilidad',
    status: 'pending',
    description: 'Cotizador paso a paso con cálculo de costos, márgenes por calibre, totales FOB/CIF y análisis de rentabilidad.',
    items: [
      'Formulario de cotización estructurado',
      'Cálculo automático de costos por calibre',
      'Comparación FOB vs CIF',
      'Visualización de márgenes ponderados',
      'Versionamiento de cotizaciones',
    ],
  },
  {
    number: '05',
    title: 'Aprobaciones, PDF y reportes',
    status: 'pending',
    description: 'Flujo de aprobación, generación de PDF profesional y reportes operativos.',
    items: [
      'Flujo de aprobación por gerencia',
      'Generación de PDF con marca corporativa',
      'Reportes de rentabilidad y desempeño',
    ],
  },
];

interface EntityInfo {
  name: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  group: 'core' | 'operational' | 'parameter';
}

const entities: EntityInfo[] = [
  {
    name: 'users',
    description: 'Usuarios del sistema con rol asignado',
    color: 'bg-brand-100 text-brand-800',
    icon: '👤',
    group: 'core',
  },
  {
    name: 'roles',
    description: 'Roles: gerencial, pricing, comercial',
    color: 'bg-brand-100 text-brand-800',
    icon: '🔐',
    group: 'core',
  },
  {
    name: 'products',
    description: 'Catálogo de productos (Aguacate Hass)',
    color: 'bg-brand-100 text-brand-800',
    icon: '🥑',
    group: 'parameter',
  },
  {
    name: 'calibers',
    description: 'Calibres de aguacate (12, 14, 16, 18, 20, 24, 26, 28, 30, 32, 36, 40)',
    color: 'bg-brand-100 text-brand-800',
    icon: '📏',
    group: 'parameter',
  },
  {
    name: 'caliber_prices',
    description: 'Histórico de precios de compra por calibre',
    color: 'bg-gold-100 text-gold-800',
    icon: '💰',
    group: 'parameter',
  },
  {
    name: 'packaging_types',
    description: 'Tipos de empaque (caja de 4kg, 10kg, etc.)',
    color: 'bg-brand-100 text-brand-800',
    icon: '📦',
    group: 'parameter',
  },
  {
    name: 'exchange_rates',
    description: 'Tasas de cambio USD/COP, EUR/COP, EUR/USD',
    color: 'bg-gold-100 text-gold-800',
    icon: '💱',
    group: 'parameter',
  },
  {
    name: 'freight_rates',
    description: 'Tarifas de flete marítimo por ruta',
    color: 'bg-gold-100 text-gold-800',
    icon: '🚢',
    group: 'parameter',
  },
  {
    name: 'insurance_rates',
    description: 'Tarifas de seguro por contenedor',
    color: 'bg-gold-100 text-gold-800',
    icon: '🛡️',
    group: 'parameter',
  },
  {
    name: 'pricing_parameters',
    description: 'Parámetros adicionales de costeo (aranceles, comisiones)',
    color: 'bg-gold-100 text-gold-800',
    icon: '⚙️',
    group: 'parameter',
  },
  {
    name: 'customers',
    description: 'Clientes europeos (importadores)',
    color: 'bg-brand-100 text-brand-800',
    icon: '🏢',
    group: 'operational',
  },
  {
    name: 'quotes',
    description: 'Cotizaciones con versionamiento',
    color: 'bg-brand-100 text-brand-800',
    icon: '📄',
    group: 'operational',
  },
  {
    name: 'quote_items',
    description: 'Detalle por calibre dentro de cotización',
    color: 'bg-brand-100 text-brand-800',
    icon: '📋',
    group: 'operational',
  },
  {
    name: 'containers',
    description: 'Detalle de contenedores (peso, cajas, palés)',
    color: 'bg-brand-100 text-brand-800',
    icon: '📦',
    group: 'operational',
  },
  {
    name: 'national_sales',
    description: 'Ventas nacionales de fruta no exportada',
    color: 'bg-brand-100 text-brand-800',
    icon: '🏪',
    group: 'operational',
  },
  {
    name: 'approvals',
    description: 'Flujo de aprobación de cotizaciones',
    color: 'bg-gold-100 text-gold-800',
    icon: '✅',
    group: 'operational',
  },
  {
    name: 'quote_versions',
    description: 'Snapshots de versiones anteriores',
    color: 'bg-brand-100 text-brand-800',
    icon: '🕐',
    group: 'operational',
  },
  {
    name: 'pdf_documents',
    description: 'PDFs generados por cotización',
    color: 'bg-brand-100 text-brand-800',
    icon: '📑',
    group: 'operational',
  },
  {
    name: 'audit_logs',
    description: 'Trazabilidad de cambios (auditoría)',
    color: 'bg-gray-100 text-gray-700',
    icon: '📊',
    group: 'core',
  },
  {
    name: 'general_settings',
    description: 'Configuración general del sistema (JSON)',
    color: 'bg-gray-100 text-gray-700',
    icon: '🔧',
    group: 'core',
  },
];

const groupLabels: Record<typeof entities[number]['group'], string> = {
  core: 'Núcleo y configuración',
  parameter: 'Parámetros operativos',
  operational: 'Entidades operativas',
};

export default function Index() {
  const currentPhase = phases.find((p) => p.status === 'in-progress')!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#D4A017] flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#1B4332]" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              ColCom<span className="text-gold-300">Trade</span>
            </span>
          </div>

          <Badge className="bg-[#D4A017]/20 text-[#D4A017] border-[#D4A017]/30 hover:bg-[#D4A017]/20 mb-4">
            Fase 1 · Fundación técnica
          </Badge>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4 max-w-3xl">
            Plataforma profesional de cotización y análisis financiero
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Sistema especializado para la cotización, estructuración y análisis de rentabilidad de exportaciones de aguacate Hass desde Colombia hacia Europa.
          </p>
          <p className="text-sm text-emerald-200 mt-4">
            Colombiana de Commodities SAS · Versión en construcción
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Current Phase Highlight */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Estado actual del proyecto</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <Card className="border-2 border-[#2D6A4F]/20 shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5 rounded">
                      {currentPhase.number}
                    </span>
                    <CardTitle className="text-xl text-brand-800">{currentPhase.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{currentPhase.description}</CardDescription>
                </div>
                <Badge className="bg-[#D4A017] text-white hover:bg-[#D4A017]/90">
                  En progreso
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentPhase.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-[#2D6A4F] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hoja de ruta</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <div className="space-y-4">
            {phases.map((phase, i) => (
              <Card
                key={phase.number}
                className={cn(
                  'transition-all',
                  phase.status === 'in-progress' && 'border-2 border-[#2D6A4F]/30 shadow-sm',
                  phase.status === 'pending' && 'opacity-75',
                )}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0',
                      phase.status === 'completed' && 'bg-[#2D6A4F] text-white',
                      phase.status === 'in-progress' && 'bg-[#D4A017] text-white',
                      phase.status === 'pending' && 'bg-gray-200 text-gray-500',
                    )}>
                      {phase.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <CardTitle className="text-base">{phase.title}</CardTitle>
                        {phase.status === 'completed' && (
                          <Badge variant="outline" className="border-[#2D6A4F] text-[#2D6A4F]">Completada</Badge>
                        )}
                        {phase.status === 'in-progress' && (
                          <Badge className="bg-[#D4A017] text-white hover:bg-[#D4A017]/90">En progreso</Badge>
                        )}
                        {phase.status === 'pending' && (
                          <Badge variant="secondary">Pendiente</Badge>
                        )}
                      </div>
                      <CardDescription>{phase.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Model */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Modelo de datos</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <p className="text-sm text-gray-600 mb-6 max-w-3xl">
            El modelo de datos relacional está compuesto por {entities.length} tablas organizadas en tres grupos:
            núcleo del sistema, parámetros operativos y entidades de negocio.
          </p>

          <div className="space-y-6">
            {(['core', 'parameter', 'operational'] as const).map((groupKey) => {
              const groupEntities = entities.filter((e) => e.group === groupKey);
              return (
                <div key={groupKey}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                    {groupLabels[groupKey]}
                    <span className="text-xs font-normal text-gray-400">
                      ({groupEntities.length} tablas)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupEntities.map((entity) => (
                      <div
                        key={entity.name}
                        className="group flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#2D6A4F]/40 hover:shadow-sm transition-all"
                      >
                        <span className="text-2xl flex-shrink-0">{entity.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs font-semibold text-gray-900 mb-0.5 truncate">
                            {entity.name}
                          </p>
                          <p className="text-xs text-gray-500 leading-snug">
                            {entity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech Foundation */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-300" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pila tecnológica</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <CardTitle className="text-base">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">React 19 + TypeScript, Vite, React Router, Tailwind CSS y shadcn/ui.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                </div>
                <CardTitle className="text-base">Base de datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">PostgreSQL con Row Level Security (RLS), Foreign Keys, Triggers y funciones.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <CardTitle className="text-base">Autenticación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Supabase Auth con tres roles (gerencial, pricing, comercial) y políticas de seguridad.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <footer className="text-center py-6">
          <p className="text-xs text-gray-400">
            ColCom Trade v0.1.0 · Fase 1 de 5 · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
