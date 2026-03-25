import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Truck, Shield, CreditCard, Headphones, TrendingUp, Zap } from "lucide-react"
import { ProductCard, type Product } from "@/components/product/ProductCard"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

const mockProducts: Product[] = [
  {
    id: "1", slug: "calca-jeans-masculina-slim",
    name: "Calça Jeans Masculina Slim Fit Premium",
    price: 89.90, originalPrice: 149.90,
    images: ["https://placehold.co/300x400/E8E9F0/1B1F3B?text=Jeans+Slim"],
    rating: 4.8, reviewCount: 234,
    store: { id: "s1", name: "Jeans Brasil", slug: "jeans-brasil" },
    isWholesale: true, wholesalePrice: 59.90, minWholesaleQty: 12,
    isPromotion: true,
  },
  {
    id: "2", slug: "vestido-floral-feminino",
    name: "Vestido Floral Midi Feminino Elegante",
    price: 129.90,
    images: ["https://placehold.co/300x400/FFD9CC/FF6B35?text=Vestido+Floral"],
    rating: 4.9, reviewCount: 567,
    store: { id: "s2", name: "Moda Feminina SP", slug: "moda-feminina-sp" },
    badge: "Mais Vendido",
  },
  {
    id: "3", slug: "camisa-social-masculina-branca",
    name: "Camisa Social Masculina Manga Longa",
    price: 79.90, originalPrice: 110.00,
    images: ["https://placehold.co/300x400/F3F4F6/6B7280?text=Camisa+Social"],
    rating: 4.7, reviewCount: 189,
    store: { id: "s3", name: "Elegância Store", slug: "elegancia-store" },
    isWholesale: true, wholesalePrice: 52.00, minWholesaleQty: 6,
  },
  {
    id: "4", slug: "conjunto-feminino-casual",
    name: "Conjunto Feminino Calça e Blusa Casual",
    price: 159.90,
    images: ["https://placehold.co/300x400/C5C7DC/1B1F3B?text=Conjunto"],
    rating: 4.6, reviewCount: 312,
    store: { id: "s4", name: "Fashion Box 42", slug: "fashion-box-42" },
    badge: "Novo",
  },
  {
    id: "5", slug: "bermuda-masculina-sarja",
    name: "Bermuda Masculina Sarja Casual",
    price: 59.90, originalPrice: 89.90,
    images: ["https://placehold.co/300x400/E8E9F0/1B1F3B?text=Bermuda"],
    rating: 4.5, reviewCount: 98,
    store: { id: "s5", name: "Casual Men", slug: "casual-men" },
  },
  {
    id: "6", slug: "blusa-feminina-cropped",
    name: "Blusa Feminina Cropped Estampada",
    price: 39.90,
    images: ["https://placehold.co/300x400/FFD9CC/FF6B35?text=Cropped"],
    rating: 4.4, reviewCount: 445,
    store: { id: "s6", name: "Trends Girls", slug: "trends-girls" },
  },
  {
    id: "7", slug: "terno-masculino-slim",
    name: "Terno Masculino Slim 2 Peças",
    price: 399.90, originalPrice: 599.90,
    images: ["https://placehold.co/300x400/1B1F3B/FFFFFF?text=Terno"],
    rating: 4.9, reviewCount: 78,
    store: { id: "s7", name: "Executivo Modas", slug: "executivo-modas" },
    isWholesale: true, wholesalePrice: 280.00, minWholesaleQty: 4,
    badge: "Premium",
  },
  {
    id: "8", slug: "saia-jeans-midi",
    name: "Saia Jeans Midi Feminina",
    price: 89.90,
    images: ["https://placehold.co/300x400/E8E9F0/1B1F3B?text=Saia+Jeans"],
    rating: 4.7, reviewCount: 203,
    store: { id: "s8", name: "Denim Girls", slug: "denim-girls" },
  },
]

const categories = [
  { label: "Masculino", icon: "👔", color: "bg-primary/10 text-primary", href: "/produtos?categoria=masculino" },
  { label: "Feminino", icon: "👗", color: "bg-accent/10 text-accent", href: "/produtos?categoria=feminino" },
  { label: "Jeans", icon: "👖", color: "bg-blue-100 text-blue-600", href: "/produtos?categoria=jeans" },
  { label: "Camisas", icon: "👕", color: "bg-emerald-100 text-emerald-600", href: "/produtos?categoria=camisas" },
  { label: "Vestidos", icon: "👘", color: "bg-pink-100 text-pink-600", href: "/produtos?categoria=vestidos" },
  { label: "Calças", icon: "👖", color: "bg-purple-100 text-purple-600", href: "/produtos?categoria=calcas" },
  { label: "Atacado", icon: "📦", color: "bg-amber-100 text-amber-600", href: "/atacado" },
  { label: "Promoções", icon: "🔥", color: "bg-red-100 text-red-600", href: "/promocoes" },
]

const bannerSlides = [
  {
    id: 1,
    title: "Moda Masculina",
    subtitle: "Coleção Inverno 2025",
    description: "As melhores peças masculinas com preços de atacado e varejo",
    cta: "Ver Coleção",
    href: "/produtos?categoria=masculino",
    gradient: "from-primary to-primary-700",
    accent: "bg-accent",
  },
  {
    id: 2,
    title: "Moda Feminina",
    subtitle: "Tendências da Estação",
    description: "+4.000 lojas com as últimas tendências da moda feminina",
    cta: "Explorar",
    href: "/produtos?categoria=feminino",
    gradient: "from-accent to-accent-700",
    accent: "bg-primary",
  },
  {
    id: 3,
    title: "Atacado",
    subtitle: "Preços Especiais",
    description: "Compre no atacado direto dos lojistas do Parque das Feiras",
    cta: "Comprar Atacado",
    href: "/atacado",
    gradient: "from-emerald-700 to-emerald-900",
    accent: "bg-amber-500",
  },
]

const benefits = [
  { icon: Truck, title: "Frete para todo Brasil", desc: "Enviamos para qualquer cidade" },
  { icon: Shield, title: "Compra Protegida", desc: "Garantia em todas as compras" },
  { icon: CreditCard, title: "Pix e Cartão", desc: "Parcele em até 12x" },
  { icon: Headphones, title: "Suporte 7 dias", desc: "Atendimento especializado" },
]

export function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeTab, setActiveTab] = useState<"destaque" | "novidades" | "atacado">("destaque")

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-br ${bannerSlides[activeSlide].gradient} text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="max-w-2xl">
              <Badge className={`${bannerSlides[activeSlide].accent} text-white mb-4`}>
                {bannerSlides[activeSlide].subtitle}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {bannerSlides[activeSlide].title}
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                {bannerSlides[activeSlide].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={bannerSlides[activeSlide].href}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    {bannerSlides[activeSlide].cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/lojas">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Ver Lojas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === i ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <b.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1A1A1A]">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Comprar por Categoria</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="group flex flex-col items-center gap-2"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${cat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-center text-[#1A1A1A] group-hover:text-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-muted p-1 rounded-xl">
            {(["destaque", "novidades", "atacado"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-[#1A1A1A]"
                }`}
              >
                {tab === "destaque" && "⭐ Destaques"}
                {tab === "novidades" && "🆕 Novidades"}
                {tab === "atacado" && "📦 Atacado"}
              </button>
            ))}
          </div>
          <Link to="/produtos" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-primary to-primary-700 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-accent font-semibold text-sm">Para Lojistas e Revendedores</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Compre no Atacado</h2>
              <p className="text-white/70 max-w-md">
                Acesse preços especiais para compras em quantidade. Mais de 4.000 lojas com opção de venda no atacado.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/atacado">
                <Button size="lg" className="bg-accent hover:bg-accent-600 text-white">
                  Ver Produtos no Atacado
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/seja-lojista">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Seja um Lojista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "+4.000", label: "Lojas Parceiras" },
              { value: "+50.000", label: "Produtos Cadastrados" },
              { value: "+200.000", label: "Clientes Satisfeitos" },
              { value: "Todo", label: "o Brasil Atendido" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Lojista */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
            Você é Lojista do Parque das Feiras?
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Cadastre sua loja e comece a vender para todo o Brasil. Sem mensalidade, apenas comissão por venda.
          </p>
          <Link to="/seja-lojista">
            <Button size="lg" variant="accent">
              Cadastrar Minha Loja Grátis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
