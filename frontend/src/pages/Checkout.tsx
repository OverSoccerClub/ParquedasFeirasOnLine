import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, CreditCard, Smartphone, ChevronRight, Lock, Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, cn } from '@/lib/utils'

type Step = 'address' | 'payment' | 'confirmation'

const mockAddress = {
  recipientName: 'João Silva',
  street: 'Rua das Flores', number: '123', complement: 'Apto 45',
  neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01310-100',
}

export function Checkout() {
  const [step, setStep] = useState<Step>('address')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix')
  const [pixCopied, setPixCopied] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const { items, total, clearCart } = useCartStore()

  const pixCode = '00020126360014BR.GOV.BCB.PIX0114+55119999999990209Parque das Feiras5204000053039865802BR5920Parque das Feiras6009SAO PAULO62070503***6304ABCD'

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode)
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 3000)
  }

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
    clearCart()
    setStep('confirmation')
  }

  const steps = [
    { id: 'address', label: 'Endereço' },
    { id: 'payment', label: 'Pagamento' },
    { id: 'confirmation', label: 'Confirmação' },
  ]

  if (orderPlaced && step === 'confirmation') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Pedido Realizado!</h1>
        <p className="text-muted-foreground mb-2">Seu pedido foi recebido com sucesso.</p>
        {paymentMethod === 'pix' && (
          <div className="bg-muted rounded-xl p-5 mt-6 text-left">
            <p className="font-semibold text-sm mb-3">Aguardando pagamento via Pix</p>
            <div className="bg-white rounded-lg p-3 border border-border mb-3">
              <p className="text-xs text-muted-foreground break-all font-mono">{pixCode}</p>
            </div>
            <Button onClick={handleCopyPix} variant="outline" className="w-full" size="sm">
              <Copy className="h-4 w-4" />
              {pixCopied ? 'Copiado!' : 'Copiar Código Pix'}
            </Button>
          </div>
        )}
        <div className="flex gap-3 mt-8">
          <Link to="/minha-conta/pedidos" className="flex-1">
            <Button variant="default" className="w-full">Ver Meus Pedidos</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">Voltar ao Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-accent" /> Checkout Seguro
      </h1>

      {/* Steps */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step === s.id ? 'bg-primary text-white' : steps.indexOf(steps.find(x => x.id === step)!) > i ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
            )}>
              {steps.indexOf(steps.find(x => x.id === step)!) > i ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn('ml-2 text-sm font-medium hidden sm:block', step === s.id ? 'text-primary' : 'text-muted-foreground')}>
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="flex-1 h-0.5 bg-border mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step: Endereço */}
          {step === 'address' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> Endereço de Entrega
              </h2>
              <div className="border border-primary/20 bg-primary/5 rounded-xl p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{mockAddress.recipientName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mockAddress.street}, {mockAddress.number}{mockAddress.complement && ` - ${mockAddress.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mockAddress.neighborhood}, {mockAddress.city} - {mockAddress.state}
                    </p>
                    <p className="text-sm text-muted-foreground">CEP: {mockAddress.zipCode}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <button className="text-sm text-accent hover:underline">+ Usar outro endereço</button>
              <Button onClick={() => setStep('payment')} variant="accent" size="lg" className="w-full mt-6">
                Continuar para Pagamento <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step: Pagamento */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" /> Forma de Pagamento
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={cn('p-4 rounded-xl border-2 text-left transition-all', paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}
                >
                  <Smartphone className="h-6 w-6 text-primary mb-2" />
                  <p className="font-semibold text-sm">Pix</p>
                  <p className="text-xs text-muted-foreground">Pagamento instantâneo</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">5% de desconto</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('credit_card')}
                  className={cn('p-4 rounded-xl border-2 text-left transition-all', paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}
                >
                  <CreditCard className="h-6 w-6 text-primary mb-2" />
                  <p className="font-semibold text-sm">Cartão de Crédito</p>
                  <p className="text-xs text-muted-foreground">Em até 12x</p>
                </button>
              </div>

              {paymentMethod === 'pix' && (
                <div className="bg-muted/50 rounded-xl p-5 text-center mb-4">
                  <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 border border-border">
                    <p className="text-xs text-muted-foreground">QR Code Pix</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Escaneie o QR code ou copie o código abaixo</p>
                  <div className="bg-white rounded-lg p-3 border border-border text-left mb-3">
                    <p className="text-xs text-muted-foreground font-mono break-all">{pixCode.slice(0, 60)}...</p>
                  </div>
                  <Button onClick={handleCopyPix} variant="outline" size="sm" className="w-full">
                    <Copy className="h-4 w-4" />
                    {pixCopied ? 'Copiado!' : 'Copiar Código Pix'}
                  </Button>
                </div>
              )}

              {paymentMethod === 'credit_card' && (
                <div className="space-y-4 mb-4">
                  <Input label="Número do Cartão" placeholder="0000 0000 0000 0000" />
                  <Input label="Nome no Cartão" placeholder="Como está no cartão" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Validade" placeholder="MM/AA" />
                    <Input label="CVV" placeholder="123" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parcelas</label>
                    <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white">
                      {[1,2,3,6,12].map((n) => (
                        <option key={n} value={n}>
                          {n}x de {formatCurrency(total / n)} {n <= 3 ? 'sem juros' : 'com juros'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <Button onClick={handlePlaceOrder} variant="accent" size="lg" className="w-full">
                <Lock className="h-4 w-4" /> Confirmar Pedido · {formatCurrency(total)}
              </Button>
            </div>
          )}
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-2xl border border-border p-5 h-fit sticky top-24">
          <h2 className="font-bold mb-4">Resumo</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-2 text-sm">
                <img src={item.image || 'https://placehold.co/40x50/F3F4F6/9CA3AF?text=+'} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                  <p className="text-xs font-bold text-primary">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span className="text-emerald-600">Grátis</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
              <span>Total</span><span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
