import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { Button } from './Button'
import { formatCurrency } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, total, totalItems } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg text-primary">Carrinho</h2>
            {totalItems > 0 && (
              <span className="bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground font-medium">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground mt-1">Adicione produtos para continuar</p>
              <Button className="mt-4" onClick={toggleCart} variant="outline">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-muted/50 rounded-xl p-3">
                <img
                  src={item.image || 'https://placehold.co/80x100/F3F4F6/9CA3AF?text=Foto'}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.storeName}</p>
                  <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2">{item.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.size && `Tam: ${item.size}`}
                      {item.size && item.color && ' · '}
                      {item.color && `Cor: ${item.color}`}
                    </p>
                  )}
                  <p className="text-sm font-bold text-primary mt-1">{formatCurrency(item.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-border rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted transition-colors rounded-l-lg"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted transition-colors rounded-r-lg"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
              <span className="font-bold text-lg text-primary">{formatCurrency(total)}</span>
            </div>
            <Link to="/checkout" onClick={toggleCart}>
              <Button className="w-full" size="lg" variant="accent">
                Finalizar Compra <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/carrinho" onClick={toggleCart}>
              <Button className="w-full" variant="outline">
                Ver Carrinho Completo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
