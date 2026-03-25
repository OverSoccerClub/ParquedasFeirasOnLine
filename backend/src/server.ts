import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { authRouter } from './routes/auth'
import { productsRouter } from './routes/products'
import { storesRouter } from './routes/stores'
import { ordersRouter } from './routes/orders'
import { cartRouter } from './routes/cart'
import { categoriesRouter } from './routes/categories'
import { usersRouter } from './routes/users'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ---- Segurança ----
app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}))

// ---- Rate limiting ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
})
app.use('/api/', limiter)

// ---- Middleware ----
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ---- Health check ----
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Parque das Feiras API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// ---- Rotas ----
app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/stores', storesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/cart', cartRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/users', usersRouter)

// ---- Erros ----
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Parque das Feiras API rodando na porta ${PORT}`)
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   Health: http://localhost:${PORT}/health`)
})

export default app
