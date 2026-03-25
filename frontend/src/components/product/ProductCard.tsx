import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Star, Package } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  store: {
    id: string
    name: string
    slug: string
  }
  isWholesale?: boolean
  minWholesaleQty?: number
  wholesalePrice?: number
  isPromotion?: boolean
  sizes?: string[]
  badge?: string
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className={cn("group relative bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300", className)}>
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl aspect-[3/4] bg-muted">
        <Link to={`/produto/${product.slug}`}>
          <img
            src={product.images[currentImage] || "https://placehold.co/300x400/F3F4F6/9CA3AF?text=Sem+Foto"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="accent">-{discount}%</Badge>
          )}
          {product.isWholesale && (
            <Badge variant="wholesale">Atacado</Badge>
          )}
          {product.badge && (
            <Badge variant="success">{product.badge}</Badge>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md",
            isFavorited
              ? "bg-accent text-white"
              : "bg-white/90 text-muted-foreground hover:bg-white hover:text-accent"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
        </button>

        {/* Image thumbnails on hover */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onMouseEnter={() => setCurrentImage(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  currentImage === i ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-sm font-medium py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer hover:bg-primary-600">
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Adicionar ao Carrinho
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <Link to={`/loja/${product.store.slug}`} className="text-xs text-muted-foreground hover:text-accent transition-colors">
          {product.store.name}
        </Link>
        <Link to={`/produto/${product.slug}`}>
          <h3 className="text-sm font-medium text-[#1A1A1A] mt-0.5 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
          <p className="text-base font-bold text-primary">
            {formatCurrency(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">
            ou 3x de {formatCurrency(product.price / 3)} sem juros
          </p>
        </div>

        {/* Wholesale info */}
        {product.isWholesale && product.wholesalePrice && product.minWholesaleQty && (
          <div className="mt-2 bg-primary/5 rounded-lg p-2">
            <div className="flex items-center gap-1 text-xs text-primary">
              <Package className="h-3 w-3" />
              <span className="font-medium">Atacado: {formatCurrency(product.wholesalePrice)} ({product.minWholesaleQty}+ peças)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
