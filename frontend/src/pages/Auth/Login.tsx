import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Banner lateral */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-gradient-to-br from-primary to-primary-700 p-12 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
            <Store className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-2xl leading-tight">Parque das</p>
            <p className="font-bold text-2xl leading-tight text-accent -mt-1">Feiras</p>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Bem-vindo de volta!</h1>
        <p className="text-white/70 text-lg">Acesse sua conta e aproveite as melhores ofertas de moda do Brasil.</p>
        <div className="mt-12 space-y-4">
          {['Mais de 4.000 lojas parceiras', 'Atacado e varejo para todo o Brasil', 'Compra 100% protegida'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight text-primary">Parque das Feiras</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-1">Entrar na sua conta</h2>
          <p className="text-muted-foreground mb-8">Bem-vindo! Insira seus dados para continuar.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-primary transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link to="/esqueci-senha" className="text-sm text-accent hover:underline">Esqueci minha senha</Link>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-accent font-medium hover:underline">Cadastre-se grátis</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            É lojista?{' '}
            <Link to="/seja-lojista" className="text-primary font-medium hover:underline">Cadastre sua loja</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
