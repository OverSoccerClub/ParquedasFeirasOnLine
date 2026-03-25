import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, DollarSign, Settings, Plus, Store, TrendingUp, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn, formatCurrency } from '@/lib/utils'

const navItems = [
  { label: 'Visão Geral', href: '/painel-lojista', icon: LayoutDashboard },
  { label: 'Meus Produtos', href: '/painel-lojista/produtos', icon: Package },
  { label: 'Pedidos', href: '/painel-lojista/pedidos', icon: ShoppingBag },
  { label: 'Financeiro', href: '/painel-lojista/financeiro', icon: DollarSign },
  { label: 'Minha Loja', href: '/painel-lojista/loja', icon: Store },
  { label: 'Configurações', href: '/painel-lojista/configuracoes', icon: Settings },
]

const stats = [
  { label: 'Pedidos Novos', value: '12', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Faturamento Mês', value: formatCurrency(8450.00), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Saldo Disponível', value: formatCurrency(3200.00), icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Produtos Ativos', value: '47', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
]

function SellerOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Visão Geral</h2>
        <Link to="/painel-lojista/produtos/novo">
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors">
            <Plus className="h-4 w-4" /> Novo Produto
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.bg)}>
              <s.icon className={cn('h-5 w-5', s.color)} />
            </div>
            <p className="text-xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold mb-4">Últimos Pedidos</h3>
        <div className="space-y-3">
          {[
            { id: '#1042', product: 'Calça Jeans Slim (x3)', buyer: 'Carlos S.', value: 269.70, status: 'Novo' },
            { id: '#1041', product: 'Camisa Social (x2)', buyer: 'João M.', value: 159.80, status: 'Enviado' },
            { id: '#1040', product: 'Bermuda Masculina (x5)', buyer: 'Pedro R.', value: 299.50, status: 'Entregue' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-primary">{order.id}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium',
                    order.status === 'Novo' ? 'bg-accent/10 text-accent' :
                    order.status === 'Enviado' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  )}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{order.product} · {order.buyer}</p>
              </div>
              <p className="font-bold text-sm text-primary">{formatCurrency(order.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SellerDashboard() {
  const { user } = useAuthStore()
  const location = useLocation()
  const isRoot = location.pathname === '/painel-lojista'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-border p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.store?.name || 'Minha Loja'}</p>
                <p className="text-xs text-emerald-600">● Ativa</p>
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

        <main className="flex-1 min-w-0">
          {isRoot ? <SellerOverview /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}
