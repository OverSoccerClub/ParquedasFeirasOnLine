import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Store,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { CartDrawer } from "@/components/ui/CartDrawer"
import { useAuthStore } from "@/store/authStore"

const categories = [
  { label: "Masculino", href: "/produtos?categoria=masculino" },
  { label: "Feminino", href: "/produtos?categoria=feminino" },
  { label: "Jeans", href: "/produtos?categoria=jeans" },
  { label: "Camisas", href: "/produtos?categoria=camisas" },
  { label: "Vestidos", href: "/produtos?categoria=vestidos" },
  { label: "Calças", href: "/produtos?categoria=calcas" },
  { label: "Atacado", href: "/atacado" },
  { label: "Promoções", href: "/promocoes", accent: true },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { totalItems, toggleCart } = useCartStore()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/produtos?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span>Enviamos para todo o Brasil • Frete grátis acima de R$ 299</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/seja-lojista" className="hover:text-accent transition-colors">
              Seja um Lojista
            </Link>
            <span className="opacity-30">|</span>
            <Link to="/rastreio" className="hover:text-accent transition-colors">
              Rastrear Pedido
            </Link>
            <span className="opacity-30">|</span>
            <Link to="/atendimento" className="hover:text-accent transition-colors">
              Atendimento
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-primary font-bold text-base leading-tight">Parque das</p>
                <p className="text-accent font-bold text-base leading-tight -mt-1">Feiras</p>
              </div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Buscar roupas, lojas, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-border rounded-l-lg focus:outline-none focus:border-primary text-sm bg-white"
              />
              <button
                type="submit"
                className="px-5 bg-accent hover:bg-accent-600 text-white rounded-r-lg transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:block text-sm font-medium">Buscar</span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Favoritos */}
            <Link to="/favoritos">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Carrinho */}
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User */}
            <div className="relative group hidden sm:block">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-surface rounded-xl shadow-lg border border-border w-52 py-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/minha-conta/pedidos"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Meus Pedidos
                      </Link>
                      {user.role === 'seller' && (
                        <Link
                          to="/painel-lojista"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                        >
                          <Store className="h-4 w-4 text-muted-foreground" />
                          Painel do Lojista
                        </Link>
                      )}
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors text-red-500"
                      >
                        Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Entrar / Cadastrar
                      </Link>
                      <div className="border-t border-border my-1" />
                      <Link
                        to="/minha-conta/pedidos"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Meus Pedidos
                      </Link>
                      <Link
                        to="/painel-lojista"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-sm transition-colors"
                      >
                        <Store className="h-4 w-4 text-muted-foreground" />
                        Painel do Lojista
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="border-t border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link
                  to={cat.href}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-medium whitespace-nowrap hover:text-accent transition-colors",
                    cat.accent ? "text-accent font-semibold" : "text-[#1A1A1A]"
                  )}
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface py-4 px-4 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="flex">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 border-2 border-border rounded-l-lg focus:outline-none focus:border-primary text-sm"
              />
              <button
                type="submit"
                className="px-4 bg-accent text-white rounded-r-lg"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors text-center",
                  cat.accent && "bg-accent/10 text-accent hover:bg-accent hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <Link
              to="/login"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              <User className="h-4 w-4" /> Entrar / Cadastrar
            </Link>
            <Link
              to="/minha-conta/pedidos"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              <Package className="h-4 w-4" /> Meus Pedidos
            </Link>
            <Link
              to="/painel-lojista"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              <Store className="h-4 w-4" /> Painel do Lojista
            </Link>
          </div>
        </div>
      )}
      <CartDrawer />
    </header>
  )
}
