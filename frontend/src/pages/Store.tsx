import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Phone, MessageCircle, Store as StoreIcon } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const mockStore = {
  id: 's1', name: 'Jeans Brasil', slug: 'jeans-brasil',
  description: 'Especialistas em jeans de alta qualidade. Trabalhamos com as melhores lavagens e modelagens do mercado. Atendemos varejo e atacado para todo o Brasil.',
  logoUrl: null, bannerUrl: null,
  phone: '(11) 99999-0001', whatsapp: '11999990001',
  boxNumber: 'Box 142, Corredor 7',
  rating: 4.9, totalSales: 12847,
  isWholesaleEnabled: true,
}

const mockStoreProducts = [
  { id:'1', slug:'calca-jeans-masculina-slim', name:'Calça Jeans Masculina Slim Fit', price:89.90, originalPrice:149.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Jeans+Slim'], rating:4.8, reviewCount:234, store:{id:'s1',name:'Jeans Brasil',slug:'jeans-brasil'}, isWholesale:true, wholesalePrice:59.90, minWholesaleQty:12 },
  { id:'9', slug:'polo-masculina-algodao', name:'Polo Masculina 100% Algodão', price:69.90, images:['https://placehold.co/300x400/C5C7DC/1B1F3B?text=Polo'], rating:4.5, reviewCount:156, store:{id:'s1',name:'Jeans Brasil',slug:'jeans-brasil'}, isWholesale:true, wholesalePrice:45.00, minWholesaleQty:12 },
  { id:'11', slug:'jaqueta-jeans-masculina', name:'Jaqueta Jeans Masculina Clássica', price:149.90, images:['https://placehold.co/300x400/E8E9F0/1B1F3B?text=Jaqueta'], rating:4.6, reviewCount:134, store:{id:'s1',name:'Jeans Brasil',slug:'jeans-brasil'} },
]

export function StorePage() {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState<'products' | 'about'>('products')

  return (
    <div>
      {/* Banner */}
      <div className="h-40 md:h-56 bg-gradient-to-br from-primary to-primary-700 relative">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-0">
        </div>
      </div>

      {/* Info da loja */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start gap-4 -mt-8 mb-6">
          <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0">
            <StoreIcon className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-primary">{mockStore.name}</h1>
              {mockStore.isWholesaleEnabled && <Badge variant="wholesale">Atacado</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{mockStore.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{mockStore.totalSales.toLocaleString('pt-BR')} vendas</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {mockStore.boxNumber}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <a href={`https://wa.me/${mockStore.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button variant="accent" size="sm">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit mb-6">
          {(['products', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-[#1A1A1A]'}`}
            >
              {tab === 'products' ? `Produtos (${mockStoreProducts.length})` : 'Sobre a Loja'}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
            {mockStoreProducts.map((p) => <ProductCard key={p.id} product={p as any} />)}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl pb-12">
            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sobre nós</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mockStore.description}</p>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{mockStore.boxNumber} — Parque das Feiras Shopping</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>{mockStore.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
