import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  slug: string
  image: string
  storeName: string
  storeSlug: string
  storeId: string
  size?: string
  color?: string
  price: number
  quantity: number
  isWholesale: boolean
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  sessionId: string
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: number
  totalItems: number
  itemsByStore: Record<string, CartItem[]>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      sessionId: crypto.randomUUID(),

      addItem: (item) => {
        const items = get().items
        const existing = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId && i.isWholesale === item.isWholesale
        )
        if (existing) {
          set({ items: items.map((i) => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i) })
        } else {
          set({ items: [...items, { ...item, id: crypto.randomUUID() }], isOpen: true })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) })
        } else {
          set({ items: get().items.map((i) => i.id === id ? { ...i, quantity: qty } : i) })
        }
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      get total() { return get().items.reduce((s, i) => s + i.price * i.quantity, 0) },
      get totalItems() { return get().items.reduce((s, i) => s + i.quantity, 0) },
      get itemsByStore() {
        return get().items.reduce((acc, item) => {
          if (!acc[item.storeId]) acc[item.storeId] = []
          acc[item.storeId].push(item)
          return acc
        }, {} as Record<string, CartItem[]>)
      },
    }),
    { name: 'parque-cart', partialize: (s) => ({ items: s.items, sessionId: s.sessionId }) }
  )
)
