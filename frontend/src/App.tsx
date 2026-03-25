import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Products } from '@/pages/Products'
import { ProductDetail } from '@/pages/ProductDetail'
import { StorePage } from '@/pages/Store'
import { Cart } from '@/pages/Cart'
import { Checkout } from '@/pages/Checkout'
import { Login } from '@/pages/Auth/Login'
import { Register } from '@/pages/Auth/Register'
import { BuyerDashboard } from '@/pages/Dashboard/Buyer'
import { BuyerOrders } from '@/pages/Dashboard/Buyer/Orders'
import { SellerDashboard } from '@/pages/Dashboard/Seller'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth (sem layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        {/* Público (com layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="produtos" element={<Products />} />
          <Route path="atacado" element={<Products />} />
          <Route path="promocoes" element={<Products />} />
          <Route path="produto/:slug" element={<ProductDetail />} />
          <Route path="loja/:slug" element={<StorePage />} />
          <Route path="carrinho" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />

          {/* Dashboard Comprador */}
          <Route path="minha-conta" element={<BuyerDashboard />}>
            <Route path="pedidos" element={<BuyerOrders />} />
          </Route>

          {/* Dashboard Lojista */}
          <Route path="painel-lojista" element={<SellerDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
