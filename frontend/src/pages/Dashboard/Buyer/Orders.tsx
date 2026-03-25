import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, Truck, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockOrders = [
  { id: 'ORD-001', createdAt: '2025-03-20', status: 'delivered', total: 269.80, paymentMethod: 'pix', stores: [{ name: 'Jeans Brasil', items: [{ name: 'Calça Jeans Slim', qty: 2, price: 89.90, image: 'https://placehold.co/60x80/E8E9F0/1B1F3B?text=Jeans' }] }] },
  { id: 'ORD-002', createdAt: '2025-03-22', status: 'shipped', total: 129.90, paymentMethod: 'credit_card', stores: [{ name: 'Moda Feminina SP', items: [{ name: 'Vestido Floral Midi', qty: 1, price: 129.90, image: 'https://placehold.co/60x80/FFD9CC/FF6B35?text=Vestido' }] }] },
  { id: 'ORD-003', createdAt: '2025-03-24', status: 'pending_payment', total: 399.90, paymentMethod: 'pix', stores: [{ name: 'Executivo Modas', items: [{ name: 'Terno Masculino Slim', qty: 1, price: 399.90, image: 'https://placehold.co/60x80/1B1F3B/FFFFFF?text=Terno' }] }] },
]

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'accent' | 'outline' | 'wholesale'; icon: React.ElementType }> = {
  pending_payment: { label: 'Aguardando Pagamento', variant: 'warning', icon: Clock },
  payment_confirmed: { label: 'Pagamento Confirmado', variant: 'success', icon: Check },
  preparing: { label: 'Preparando', variant: 'secondary', icon: Package },
  shipped: { label: 'Em Trânsito', variant: 'default', icon: Truck },
  delivered: { label: 'Entregue', variant: 'success', icon: Check },
  cancelled: { label: 'Cancelado', variant: 'error', icon: X },
}

export function BuyerOrders() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Meus Pedidos</h2>
      {mockOrders.map((order) => {
        const status = statusConfig[order.status]
        const StatusIcon = status.icon
        return (
          <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary">{order.id}</span>
                <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
              </div>
              <Badge variant={status.variant} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            {order.stores.map((store) => (
              <div key={store.name} className="p-4">
                <p className="text-xs font-semibold text-muted-foreground mb-3">{store.name}</p>
                {store.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 mb-2">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {item.qty} · {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
              <Link to={`/minha-conta/pedidos/${order.id}`} className="flex items-center gap-1 text-sm text-accent hover:underline">
                Detalhes <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
