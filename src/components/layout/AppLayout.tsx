import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  History,
  TrendingUp,
  DollarSign,
  Package,
  CircleGauge,
  Route,
  ArrowLeftRight,
  Percent,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    title: 'Inicio',
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Cotizaciones',
    items: [
      {
        label: 'Nueva cotización',
        href: '/cotizaciones/nueva',
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: 'Historial de cotizaciones',
        href: '/cotizaciones',
        icon: <History className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Análisis',
    items: [
      {
        label: 'Rentabilidad',
        href: '/analisis/rentabilidad',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        label: 'Análisis de costos',
        href: '/analisis/costos',
        icon: <DollarSign className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Parámetros',
    items: [
      {
        label: 'Productos',
        href: '/parametros/productos',
        icon: <Package className="w-4 h-4" />,
      },
      {
        label: 'Calibres',
        href: '/parametros/calibres',
        icon: <CircleGauge className="w-4 h-4" />,
      },
      {
        label: 'Rutas logísticas',
        href: '/parametros/rutas',
        icon: <Route className="w-4 h-4" />,
      },
      {
        label: 'Tasas de cambio',
        href: '/parametros/tasas',
        icon: <ArrowLeftRight className="w-4 h-4" />,
      },
      {
        label: 'Costos',
        href: '/parametros/costos',
        icon: <DollarSign className="w-4 h-4" />,
      },
      {
        label: 'Márgenes',
        href: '/parametros/margenes',
        icon: <Percent className="w-4 h-4" />,
      },
    ],
  },
  {
    title: 'Administración',
    items: [
      {
        label: 'Usuarios',
        href: '/usuarios',
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: 'Configuración',
        href: '/configuracion',
        icon: <Settings className="w-4 h-4" />,
      },
    ],
  },
]

function SidebarNav() {
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navigationGroups.forEach((group) => {
      const hasActive = group.items.some(
        (item) => item.href === '/' ? location.pathname === '/' : location.pathname.startsWith(item.href)
      )
      initial[group.title] = hasActive || group.title === 'Inicio'
    })
    return initial
  })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2D6A4F] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#D4A017]" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-[#1B4332]">ColCom</span>
            <span className="font-bold text-[#D4A017]">Trade</span>
          </div>
        </Link>
      </div>

      <div className="px-3">
        <Separator className="bg-gray-200" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navigationGroups.map((group) => {
          const isOpen = openGroups[group.title] ?? true
          return (
            <div key={group.title} className="mb-4">
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                <span>{group.title}</span>
                {isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
              {isOpen && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = item.href === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.href)

                    if (item.disabled) {
                      return (
                        <div
                          key={item.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                            Pronto
                          </span>
                        </div>
                      )
                    }

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#2D6A4F] text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Colombiana de Commodities SAS
          </p>
        </div>
      </div>
    </div>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() ?? '??'

  const roleBadge: Record<string, string> = {
    gerencial: 'bg-[#D4A017]/10 text-[#D4A017]',
    pricing: 'bg-blue-50 text-blue-600',
    comercial: 'bg-emerald-50 text-emerald-600',
    logistica: 'bg-purple-50 text-purple-600',
  }
  const roleLabel: Record<string, string> = {
    gerencial: 'Gerencia',
    pricing: 'Pricing',
    comercial: 'Comercial',
    logistica: 'Logística',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40">
        <SidebarNav />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D4A017]" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-sm text-[#1B4332]">ColCom</span>
                <span className="font-bold text-sm text-[#D4A017]">Trade</span>
              </div>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 md:pl-60 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <button
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 md:flex-none" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-10 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#2D6A4F] text-white text-xs font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.full_name ?? 'Usuario desarrollo'}
                  </span>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    roleBadge[user?.role?.name ?? ''] ?? 'bg-gray-100 text-gray-600'
                  )}>
                    {roleLabel[user?.role?.name ?? ''] ?? user?.role?.name ?? 'Desarrollo'}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username ?? 'dev_user'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.full_name ?? 'Modo desarrollo'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
