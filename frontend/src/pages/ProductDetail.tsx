import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Heart, ShoppingCart, Share2, Star, Package, Truck,
  Shield, ChevronRight, Minus, Plus, MessageCircle, Store
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

const mockProduct = {
  id: '1', slug: 'calca-jeans-masculina-slim',
  name: 'Calça Jeans Masculina Slim Fit Premium',
  description: 'Calça jeans masculina com modelagem slim fit que valoriza o corpo sem apertar. Confeccionada em jeans premium com elastano para maior conforto e mobilidade. Ideal para o dia a dia, passeios e ocasiões casuais. Disponível em várias lavagens e tamanhos.\n\n**Composição:** 97% algodão + 3% elastano\n**Lavagem:** Pode ser lavada à máquina\n**Origem:** Fabricação nacional',
  price: 89.90, originalPrice: 149.90,
  isWholesaleAvailable: true, wholesalePrice: 59.90, wholesaleMinQty: 12,
  rating: 4.8, reviewCount: 234, salesCount: 1893,
  images: [
    'https://placehold.co/600x800/E8E9F0/1B1F3B?text=Jeans+Frente',
    'https://placehold.co/600x800/C5C7DC/1B1F3B?text=Jeans+Costas',
    'https://placehold.co/600x800/9EA2C3/FFFFFF?text=Detalhe+1',
    'https://placehold.co/600x800/777CAA/FFFFFF?text=Detalhe+2',
  ],
  sizes: ['36', '38', '40', '42', '44', '46', '48'],
  colors: [
    { name: 'Azul Escuro', hex: '#1B1F3B' },
    { name: 'Azul Médio', hex: '#4A90D9' },
    { name: 'Preto', hex: '#1A1A1A' },
  ],
  store: { id: 's1', name: 'Jeans Brasil', slug: 'jeans-brasil', logoUrl: null, rating: 4.9, totalSales: 12847 },
  reviews: [
    { id: 'r1', buyer: { name: 'Carlos S.' }, rating: 5, title: 'Excelente qualidade!', comment: 'Comprei 2 calças e ficaram perfeitas. Caimento ótimo e o tecido é resistente.', createdAt: '2025-03-10' },
    { id: 'r2', buyer: { name: 'João M.' }, rating: 4, title: 'Boa calça', comment: 'Muito boa, só achei que o tamanho ficou um pouco grande. Recomendo pedir um número menor.', createdAt: '2025-02-28' },
    { id: 'r3', buyer: { name: 'Pedro R.' }, rating: 5, title: 'Comprei no atacado', comment: 'Comprei 12 unidades para revenda. Qualidade excelente e entrega rápida!', createdAt: '2025-02-15' },
  ],
}

export function ProductDetail() {
  const { slug } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [isWholesale, setIsWholesale] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { addItem } = useCartStore()

  const price = isWholesale && mockProduct.isWholesaleAvailable
    ? mockProduct.wholesalePrice
    : mockProduct.price
  const discount = mockProduct.originalPrice
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Selecione um tamanho')
      return
    }
    addItem({
      productId: mockProduct.id,
      name: mockProduct.name,
      slug: mockProduct.slug,
      image: mockProduct.images[0],
      storeName: mockProduct.store.name,
      storeSlug: mockProduct.store.slug,
      storeId: mockProduct.store.id,
      size: selectedSize,
      color: selectedColor.name,
      price,
      quantity,
      isWholesale,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-accent">Início</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/produtos" className="hover:text-accent">Produtos</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#1A1A1A] line-clamp-1">{mockProduct.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Galeria */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden">
            <img
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <Badge variant="accent" className="absolute top-3 left-3">-{discount}%</Badge>
            )}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={cn(
                'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all',
                isFavorited ? 'bg-accent text-white' : 'bg-white text-muted-foreground hover:text-accent'
              )}
            >
              <Heart className={cn('h-5 w-5', isFavorited && 'fill-current')} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all',
                  selectedImage === i ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                )}
              >
                <img src={img} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Link to={`/loja/${mockProduct.store.slug}`} className="text-sm text-accent hover:underline font-medium">
              {mockProduct.store.name}
            </Link>
            <h1 className="text-2xl font-bold text-primary mt-1">{mockProduct.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn('h-4 w-4', s <= Math.round(mockProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                ))}
                <span className="text-sm font-medium ml-1">{mockProduct.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({mockProduct.reviewCount} avaliações)</span>
              <span className="text-sm text-muted-foreground">· {mockProduct.salesCount} vendidos</span>
            </div>
          </div>

          {/* Preço */}
          <div className="bg-muted/50 rounded-xl p-4">
            {mockProduct.isWholesaleAvailable && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setIsWholesale(false); setQuantity(1) }}
                  className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2',
                    !isWholesale ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground')}
                >Varejo</button>
                <button
                  onClick={() => { setIsWholesale(true); setQuantity(mockProduct.wholesaleMinQty) }}
                  className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all border-2',
                    isWholesale ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground')}
                >Atacado ({mockProduct.wholesaleMinQty}+ peças)</button>
              </div>
            )}
            {mockProduct.originalPrice && !isWholesale && (
              <p className="text-sm text-muted-foreground line-through">{formatCurrency(mockProduct.originalPrice)}</p>
            )}
            <p className="text-3xl font-bold text-primary">{formatCurrency(price)}</p>
            {!isWholesale && (
              <p className="text-sm text-muted-foreground mt-1">ou 3x de {formatCurrency(price / 3)} sem juros</p>
            )}
            {isWholesale && (
              <p className="text-xs text-primary mt-1">Mínimo de {mockProduct.wholesaleMinQty} peças por pedido</p>
            )}
          </div>

          {/* Cor */}
          <div>
            <p className="text-sm font-semibold mb-2">Cor: <span className="font-normal text-muted-foreground">{selectedColor.name}</span></p>
            <div className="flex gap-2">
              {mockProduct.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={cn('w-8 h-8 rounded-full border-2 transition-all', selectedColor.name === color.name ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300')}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          {/* Tamanho */}
          <div>
            <p className="text-sm font-semibold mb-2">Tamanho:</p>
            <div className="flex flex-wrap gap-2">
              {mockProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'w-12 h-10 rounded-lg border-2 text-sm font-medium transition-all',
                    selectedSize === size
                      ? 'border-primary bg-primary text-white'
                      : 'border-border hover:border-primary hover:text-primary bg-white'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-2 border-border rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(isWholesale ? mockProduct.wholesaleMinQty : 1, quantity - 1))}
                className="px-3 py-2.5 hover:bg-muted transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 font-semibold text-lg min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 hover:bg-muted transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Total: <span className="font-bold text-primary">{formatCurrency(price * quantity)}</span></p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button onClick={handleAddToCart} variant="accent" size="lg" className="flex-1">
              <ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, text: 'Frete para todo Brasil' },
              { icon: Shield, text: 'Compra protegida' },
              { icon: Package, text: 'Embalagem segura' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center p-3 bg-muted/50 rounded-xl">
                <Icon className="h-5 w-5 text-accent" />
                <span className="text-xs text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Loja */}
          <div className="border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{mockProduct.store.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-muted-foreground">{mockProduct.store.rating} · {mockProduct.store.totalSales.toLocaleString('pt-BR')} vendas</span>
                </div>
              </div>
            </div>
            <Link to={`/loja/${mockProduct.store.slug}`}>
              <Button variant="outline" size="sm">Ver Loja</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Descrição + Avaliações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-4">Descrição do Produto</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{mockProduct.description}</p>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Avaliações</h2>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={cn('h-4 w-4', s <= Math.round(mockProduct.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                  ))}
                </div>
                <span className="font-bold text-lg">{mockProduct.rating}</span>
                <span className="text-muted-foreground text-sm">({mockProduct.reviewCount})</span>
              </div>
            </div>
            <div className="space-y-4">
              {mockProduct.reviews.map((r) => (
                <div key={r.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{r.buyer.name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn('h-3.5 w-3.5', s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                      ))}
                    </div>
                  </div>
                  <p className="font-semibold text-sm mb-1">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-accent" /> Dúvidas?
            </h3>
            <p className="text-sm text-muted-foreground mb-3">Entre em contato com o lojista pelo WhatsApp</p>
            <Button variant="accent" className="w-full" size="sm">Chamar no WhatsApp</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
