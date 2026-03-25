import { Link, Outlet, useLocation } from 'react-router-dom'
import { Package, Heart, MapPin, User, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Meus Pedidos', href: '/minha-conta/pedidos', icon: Package },
  { label: 'Favoritos', href: '/minha-conta/favoritos', icon: Heart },
  { label: 'Endereços', href: '/minha-conta/enderecos', icon: MapPin },
  { label: 'Meu Perfil', href: '/minha-conta/perfil', icon: User },
]

export function BuyerDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-border p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name || 'Minha Conta'}</p>
                <p className="text-xs text-muted-foreground">Comprador</p>
              </div>
            </div>
          </div>
          <nav className="bg-white rounded-2xl border border-border overflow-hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-border last:border-0',
                  location.pathname === item.href ? 'bg-primary/5 text-primary font-medium' : 'text-[#1A1A1A] hover:bg-muted'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
