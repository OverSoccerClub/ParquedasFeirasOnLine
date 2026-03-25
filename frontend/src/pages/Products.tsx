import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/utils'

// Mock data expandido para 16 produtos
const allProducts = [
  { id:'1', slug:'calca-jeans-masculina-slim', name:'Calça Jeans Masculina Slim Fit Premium', price:89.90, originalPrice:149.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Jeans+Slim'], rating:4.8, reviewCount:234, store:{id:'s1',name:'Jeans Brasil',slug:'jeans-brasil'}, isWholesale:true, wholesalePrice:59.90, minWholesaleQty:12, isPromotion:true },
  { id:'2', slug:'vestido-floral-feminino', name:'Vestido Floral Midi Feminino Elegante', price:129.90, images:['https://placehold.co/300x400/FFD9CC/FF6B35?text=Vestido'], rating:4.9, reviewCount:567, store:{id:'s2',name:'Moda Feminina SP',slug:'moda-feminina-sp'}, badge:'Mais Vendido' },
  { id:'3', slug:'camisa-social-masculina', name:'Camisa Social Masculina Manga Longa', price:79.90, originalPrice:110.00, images:['https://placehold.co/300x400/F3F4F6/6B7280?text=Camisa'], rating:4.7, reviewCount:189, store:{id:'s3',name:'Elegância Store',slug:'elegancia-store'}, isWholesale:true, wholesalePrice:52.00, minWholesaleQty:6 },
  { id:'4', slug:'conjunto-feminino-casual', name:'Conjunto Feminino Calça e Blusa Casual', price:159.90, images:['https://placehold.co/300x400/C5C7DC/1B1F3B?text=Conjunto'], rating:4.6, reviewCount:312, store:{id:'s4',name:'Fashion Box 42',slug:'fashion-box-42'}, badge:'Novo' },
  { id:'5', slug:'bermuda-masculina-sarja', name:'Bermuda Masculina Sarja Casual', price:59.90, originalPrice:89.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Bermuda'], rating:4.5, reviewCount:98, store:{id:'s5',name:'Casual Men',slug:'casual-men'} },
  { id:'6', slug:'blusa-feminina-cropped', name:'Blusa Feminina Cropped Estampada', price:39.90, images:['https://placehold.co/300x400/FFD9CC/FF6B35?text=Cropped'], rating:4.4, reviewCount:445, store:{id:'s6',name:'Trends Girls',slug:'trends-girls'} },
  { id:'7', slug:'terno-masculino-slim', name:'Terno Masculino Slim 2 Peças', price:399.90, originalPrice:599.90, images:['https://placehold.co/300x400/1B1F3B/FFFFFF?text=Terno'], rating:4.9, reviewCount:78, store:{id:'s7',name:'Executivo Modas',slug:'executivo-modas'}, isWholesale:true, wholesalePrice:280.00, minWholesaleQty:4, badge:'Premium' },
  { id:'8', slug:'saia-jeans-midi', name:'Saia Jeans Midi Feminina', price:89.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Saia'], rating:4.7, reviewCount:203, store:{id:'s8',name:'Denim Girls',slug:'denim-girls'} },
  { id:'9', slug:'polo-masculina-algodao', name:'Polo Masculina 100% Algodão', price:69.90, images:['https://placehold.co/300x400/C5C7DC/1B1F3B?text=Polo'], rating:4.5, reviewCount:156, store:{id:'s1',name:'Jeans Brasil',slug:'jeans-brasil'}, isWholesale:true, wholesalePrice:45.00, minWholesaleQty:12 },
  { id:'10', slug:'vestido-longo-festa', name:'Vestido Longo de Festa com Renda', price:249.90, originalPrice:350.00, images:['https://placehold.co/300x400/FFD9CC/FF6B35?text=Festa'], rating:4.8, reviewCount:92, store:{id:'s2',name:'Moda Feminina SP',slug:'moda-feminina-sp'}, badge:'Destaque' },
  { id:'11', slug:'jaqueta-jeans-masculina', name:'Jaqueta Jeans Masculina Clássica', price:149.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Jaqueta'], rating:4.6, reviewCount:134, store:{id:'s3',name:'Elegância Store',slug:'elegancia-store'} },
  { id:'12', slug:'top-feminino-fitness', name:'Top Feminino Fitness Estampado', price:49.90, images:['https://placehold.co/300x400/FFD9CC/FF6B35?text=Top'], rating:4.3, reviewCount:287, store:{id:'s6',name:'Trends Girls',slug:'trends-girls'}, isWholesale:true, wholesalePrice:32.00, minWholesaleQty:10 },
  { id:'13', slug:'calca-social-masculina', name:'Calça Social Masculina Slim', price:119.90, originalPrice:159.90, images:['https://placehold.co/300x400/1B1F3B/FFFFFF?text=Social'], rating:4.7, reviewCount:167, store:{id:'s7',name:'Executivo Modas',slug:'executivo-modas'} },
  { id:'14', slug:'blusa-manga-longa-feminina', name:'Blusa Manga Longa Feminina Listrada', price:79.90, images:['https://placehold.co/300x400/C5C7DC/1B1F3B?text=Blusa'], rating:4.5, reviewCount:211, store:{id:'s4',name:'Fashion Box 42',slug:'fashion-box-42'} },
  { id:'15', slug:'short-jeans-feminino', name:'Short Jeans Feminino Destroyed', price:69.90, originalPrice:99.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Short'], rating:4.4, reviewCount:323, store:{id:'s8',name:'Denim Girls',slug:'denim-girls'}, isWholesale:true, wholesalePrice:45.00, minWholesaleQty:8 },
  { id:'16', slug:'moletom-masculino-capuz', name:'Moletom Masculino com Capuz Premium', price:139.90, images:['https://placehold.co/300x400/1B1F3B/FFFFFF?text=Moletom'], rating:4.6, reviewCount:178, store:{id:'s5',name:'Casual Men',slug:'casual-men'} },
]

const categories = ['Todos', 'Masculino', 'Feminino', 'Jeans', 'Camisas', 'Vestidos', 'Calças', 'Atacado']
const sortOptions = [
  { value: 'recent', label: 'Mais Recentes' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'rating', label: 'Melhor Avaliação' },
  { value: 'sales', label: 'Mais Vendidos' },
]

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState('recent')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [onlyWholesale, setOnlyWholesale] = useState(false)

  const q = searchParams.get('q') || ''
  const categoria = searchParams.get('categoria') || 'Todos'

  const filtered = allProducts.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
    if (onlyWholesale && !p.isWholesale) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb + Título */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-accent">Início</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">Produtos</span>
          {q && <><span>/</span><span className="text-accent">"{q}"</span></>}
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            {q ? `Resultados para "${q}"` : 'Todos os Produtos'}
          </h1>
          <span className="text-sm text-muted-foreground">{filtered.length} produtos</span>
        </div>
      </div>

      {/* Filtros por categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              const p = new URLSearchParams(searchParams)
              cat === 'Todos' ? p.delete('categoria') : p.set('categoria', cat.toLowerCase())
              setSearchParams(p)
            }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              categoria === cat.toLowerCase() || (cat === 'Todos' && !searchParams.get('categoria'))
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filtros — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm mb-3">Faixa de Preço</h3>
            <div className="space-y-2">
              <input
                type="range" min="0" max="1000" step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 0</span>
                <span>R$ {priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm mb-3">Tipo de Venda</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWholesale}
                onChange={(e) => setOnlyWholesale(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm">Somente Atacado</span>
            </label>
          </div>
        </aside>

        {/* Grid produtos */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4" /> Filtros
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">Ordenar:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium text-[#1A1A1A]">Nenhum produto encontrado</p>
              <p className="text-muted-foreground mt-1">Tente outros termos ou remova os filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p as any} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
