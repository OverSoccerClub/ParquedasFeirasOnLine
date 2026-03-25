import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Store } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export function Cart() {
  const { items, removeItem, updateQty, total, totalItems, itemsByStore, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-30" />
        <h1 className="text-2xl font-bold text-primary mb-2">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-8">Explore nossos produtos e encontre o que você precisa</p>
        <Link to="/produtos">
          <Button size="lg" variant="accent">Explorar Produtos</Button>
        </Link>
      </div>
    )
  }

  const storeEntries = Object.entries(itemsByStore)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
        </h1>
        <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-red-500 transition-colors">
          Limpar carrinho
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Itens por loja */}
        <div className="lg:col-span-2 space-y-4">
          {storeEntries.map(([storeId, storeItems]) => (
            <div key={storeId} className="bg-white rounded-2xl border border-border overflow-hidden">
              {/* Header da loja */}
              <div className="flex items-center gap-2 px-5 py-3 bg-muted/50 border-b border-border">
                <Store className="h-4 w-4 text-primary" />
                <Link to={`/loja/${storeItems[0].storeSlug}`} className="font-semibold text-sm hover:text-accent transition-colors">
                  {storeItems[0].storeName}
                </Link>
              </div>

              {/* Itens */}
              <div className="divide-y divide-border">
                {storeItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4">
                    <img
                      src={item.image || 'https://placehold.co/80x100/F3F4F6/9CA3AF?text=Foto'}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/produto/${item.slug}`} className="font-medium text-sm hover:text-accent transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex gap-3 mt-1">
                        {item.size && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">Tam: {item.size}</span>}
                        {item.color && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{item.color}</span>}
                        {item.isWholesale && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">Atacado</span>}
                      </div>
                      <p className="font-bold text-primary mt-2">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div>
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2 py-1.5 hover:bg-muted transition-colors">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2 py-1.5 hover:bg-muted transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-right text-muted-foreground mt-1">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Resumo do Pedido</h2>
            <div className="space-y-3 text-sm">
              {storeEntries.map(([storeId, storeItems]) => {
                const subtotal = storeItems.reduce((s, i) => s + i.price * i.quantity, 0)
                return (
                  <div key={storeId} className="flex justify-between">
                    <span className="text-muted-foreground">{storeItems[0].storeName}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                )
              })}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-emerald-600 font-medium">A calcular</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block mt-5">
              <Button variant="accent" size="lg" className="w-full">
                Finalizar Compra <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/produtos" className="block mt-2">
              <Button variant="ghost" className="w-full text-sm">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
