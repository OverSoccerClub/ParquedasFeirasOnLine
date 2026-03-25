-- ============================================================
-- PARQUE DAS FEIRAS - SCHEMA DO BANCO DE DADOS
-- PostgreSQL
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- para busca full-text

-- ============================================================
-- USUÁRIOS E AUTENTICAÇÃO
-- ============================================================

CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'buyer',
  status user_status NOT NULL DEFAULT 'pending_verification',
  avatar_url TEXT,
  cpf_cnpj VARCHAR(18) UNIQUE,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'Casa',
  recipient_name VARCHAR(150) NOT NULL,
  zip_code VARCHAR(9) NOT NULL,
  street VARCHAR(200) NOT NULL,
  number VARCHAR(20) NOT NULL,
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state CHAR(2) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LOJAS (LOJISTAS)
-- ============================================================

CREATE TYPE store_status AS ENUM ('pending', 'active', 'suspended', 'closed');

CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  box_number VARCHAR(20),
  status store_status NOT NULL DEFAULT 'pending',
  is_wholesale_enabled BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  commission_rate DECIMAL(4,2) DEFAULT 5.00,
  cnpj VARCHAR(18),
  bank_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUTOS
-- ============================================================

CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'sold_out', 'pending_review');

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  icon VARCHAR(50),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Masculino', 'masculino', '👔', 1),
  ('Feminino', 'feminino', '👗', 2),
  ('Jeans', 'jeans', '👖', 3),
  ('Camisas', 'camisas', '👕', 4),
  ('Vestidos', 'vestidos', '👘', 5),
  ('Calças', 'calcas', '👖', 6),
  ('Bermudas', 'bermudas', '🩳', 7),
  ('Blazers', 'blazers', '🥼', 8),
  ('Saias', 'saias', '👗', 9),
  ('Acessórios', 'acessorios', '👜', 10);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  category_id INTEGER REFERENCES categories(id),
  name VARCHAR(300) NOT NULL,
  slug VARCHAR(350) UNIQUE NOT NULL,
  description TEXT,
  status product_status NOT NULL DEFAULT 'draft',
  -- Preços
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  -- Atacado
  is_wholesale_available BOOLEAN DEFAULT false,
  wholesale_price DECIMAL(10,2),
  wholesale_min_qty INTEGER DEFAULT 12,
  -- Estoque geral
  stock_qty INTEGER NOT NULL DEFAULT 0,
  -- Métricas
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  -- Meta
  meta_title VARCHAR(200),
  meta_description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(200),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(20),
  color VARCHAR(50),
  color_hex VARCHAR(7),
  sku VARCHAR(100),
  stock_qty INTEGER NOT NULL DEFAULT 0,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CARRINHO
-- ============================================================

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  is_wholesale BOOLEAN DEFAULT false,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PEDIDOS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'pending_payment', 'payment_confirmed', 'preparing',
  'shipped', 'delivered', 'cancelled', 'refunded'
);

CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'debit_card', 'boleto');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'refunded', 'expired');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id),
  status order_status NOT NULL DEFAULT 'pending_payment',
  -- Endereço de entrega (snapshot)
  shipping_address JSONB NOT NULL,
  -- Totais
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  -- Pagamento
  payment_method payment_method,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_id VARCHAR(200),
  pix_qr_code TEXT,
  pix_expiration TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  -- Notas
  buyer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sub-pedidos por lojista
CREATE TABLE order_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  store_id UUID NOT NULL REFERENCES stores(id),
  status order_status NOT NULL DEFAULT 'pending_payment',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  seller_amount DECIMAL(10,2) NOT NULL,
  tracking_code VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_store_id UUID NOT NULL REFERENCES order_stores(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  is_wholesale BOOLEAN DEFAULT false,
  -- Snapshot do produto
  product_snapshot JSONB NOT NULL
);

-- ============================================================
-- AVALIAÇÕES
-- ============================================================

CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  order_item_id UUID REFERENCES order_items(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  comment TEXT,
  images TEXT[],
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FAVORITOS
-- ============================================================

CREATE TABLE wishlists (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- ============================================================
-- FINANCEIRO LOJISTAS
-- ============================================================

CREATE TYPE transaction_type AS ENUM ('sale', 'refund', 'withdrawal', 'fee', 'adjustment');
CREATE TYPE transaction_status AS ENUM ('pending', 'available', 'transferred', 'cancelled');

CREATE TABLE store_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id),
  order_store_id UUID REFERENCES order_stores(id),
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  description TEXT,
  available_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BANNERS E CONFIGURAÇÕES
-- ============================================================

CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  subtitle VARCHAR(200),
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_stores_store_id ON order_stores(store_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
