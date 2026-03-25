import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'buyer' as 'buyer' | 'seller' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate(form.role === 'seller' ? '/seja-lojista' : '/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Store className="h-6 w-6 text-white" />
          </div>
          <p className="font-bold text-xl text-primary">Parque das Feiras</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8">
          <h2 className="text-2xl font-bold text-primary mb-1 text-center">Criar sua conta</h2>
          <p className="text-muted-foreground text-center mb-6">Cadastre-se e comece a comprar agora</p>

          {/* Tipo de conta */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'buyer' })}
              className={cn('p-4 rounded-xl border-2 text-center transition-all', form.role === 'buyer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}
            >
              <ShoppingBag className={cn('h-6 w-6 mx-auto mb-2', form.role === 'buyer' ? 'text-primary' : 'text-muted-foreground')} />
              <p className="font-semibold text-sm">Comprador</p>
              <p className="text-xs text-muted-foreground">Quero comprar</p>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'seller' })}
              className={cn('p-4 rounded-xl border-2 text-center transition-all', form.role === 'seller' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}
            >
              <Store className={cn('h-6 w-6 mx-auto mb-2', form.role === 'seller' ? 'text-primary' : 'text-muted-foreground')} />
              <p className="font-semibold text-sm">Lojista</p>
              <p className="text-xs text-muted-foreground">Quero vender</p>
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome completo" placeholder="Seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Telefone / WhatsApp" placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-primary">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Ao cadastrar, você concorda com os <Link to="/termos" className="text-accent hover:underline">Termos de Uso</Link> e <Link to="/privacidade" className="text-accent hover:underline">Política de Privacidade</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem conta? <Link to="/login" className="text-accent font-medium hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
