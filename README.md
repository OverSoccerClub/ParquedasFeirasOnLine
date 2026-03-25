# Parque das Feiras — Marketplace de Moda

Plataforma marketplace para o Parque das Feiras, o maior shopping de roupas do Brasil.

## Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-style components
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Banco**: PostgreSQL 16
- **Cache**: Redis
- **Pagamentos**: Mercado Pago (Pix + Cartão)

## Estrutura
```
├── frontend/    React app
├── backend/     API Node.js
├── database/    Schema SQL e migrations
└── docker-compose.yml
```

## Setup rápido

### 1. Banco de dados
```bash
docker-compose up -d
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend (em breve)
```bash
cd backend
npm install
npm run dev
```

## Perfis de usuário
- **Comprador** — Navega e compra (varejo e atacado)
- **Lojista** — Gerencia produtos e pedidos
- **Admin** — Gestão da plataforma

## Paleta de cores
- Primary: `#1B1F3B` (azul navy profundo)
- Accent: `#FF6B35` (laranja vibrante)
- Background: `#F8F9FA`
- Surface: `#FFFFFF`
