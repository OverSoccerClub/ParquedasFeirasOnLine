import { Link } from "react-router-dom"
import { Store, Globe, Share2, Rss, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">Parque das</p>
                <p className="font-bold text-lg leading-tight text-accent -mt-1">Feiras</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              O maior shopping de moda do Brasil agora online. Atacado e varejo direto para você.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <Rss className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {["Masculino", "Feminino", "Jeans", "Camisas", "Vestidos", "Atacado", "Promoções"].map((item) => (
                <li key={item}>
                  <Link to={`/produtos?categoria=${item.toLowerCase()}`} className="hover:text-accent transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                { label: "Central de Ajuda", href: "/ajuda" },
                { label: "Rastrear Pedido", href: "/rastreio" },
                { label: "Trocas e Devoluções", href: "/trocas" },
                { label: "Formas de Pagamento", href: "/pagamento" },
                { label: "Política de Privacidade", href: "/privacidade" },
                { label: "Termos de Uso", href: "/termos" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Lojistas</h4>
            <ul className="space-y-2 text-sm text-white/70 mb-6">
              {[
                { label: "Seja um Lojista", href: "/seja-lojista" },
                { label: "Painel do Lojista", href: "/painel-lojista" },
                { label: "Como Funciona", href: "/como-funciona" },
                { label: "Taxas e Comissões", href: "/taxas" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-accent" />
                <span>(11) 0000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span>contato@parquedasfeiras.com.br</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent mt-0.5" />
                <span>Parque das Feiras Shopping, Brasil</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2025 Parque das Feiras. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <img src="/pix-logo.svg" alt="Pix" className="h-5 opacity-70" />
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Elo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
