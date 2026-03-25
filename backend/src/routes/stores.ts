import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { authenticate, requireRole } from '../middleware/auth'

export const storesRouter = Router()

// GET /api/stores
storesRouter.get('/', async (req, res, next) => {
  try {
    const { page = '1', limit = '20', q } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where: any = { status: 'active' }
    if (q) where.name = { contains: q, mode: 'insensitive' }

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true, name: true, slug: true, logoUrl: true,
          rating: true, totalSales: true, boxNumber: true,
          _count: { select: { products: true } },
        },
        orderBy: { totalSales: 'desc' },
      }),
      prisma.store.count({ where }),
    ])

    res.json({ data: stores, meta: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) {
    next(err)
  }
})

// GET /api/stores/:slug
storesRouter.get('/:slug', async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { status: 'active' },
          take: 24,
          orderBy: { salesCount: 'desc' },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
        _count: { select: { products: true } },
      },
    })
    if (!store) throw new AppError('Loja não encontrada.', 404)
    res.json(store)
  } catch (err) {
    next(err)
  }
})

// POST /api/stores — cadastrar loja
storesRouter.post('/', authenticate, async (req, res, next) => {
  try {
    const existing = await prisma.store.findUnique({ where: { ownerId: req.user!.userId } })
    if (existing) throw new AppError('Você já possui uma loja cadastrada.', 409)

    const schema = z.object({
      name: z.string().min(3).max(150),
      description: z.string().optional(),
      phone: z.string().optional(),
      whatsapp: z.string().optional(),
      boxNumber: z.string().optional(),
      cnpj: z.string().optional(),
    })

    const data = schema.parse(req.body)
    const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    const [store] = await prisma.$transaction([
      prisma.store.create({
        data: { ...data, slug, ownerId: req.user!.userId },
      }),
      prisma.user.update({
        where: { id: req.user!.userId },
        data: { role: 'seller' },
      }),
    ])

    res.status(201).json(store)
  } catch (err) {
    next(err)
  }
})

// GET /api/stores/me/dashboard — painel do lojista
storesRouter.get('/me/dashboard', authenticate, requireRole('seller'), async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user!.userId },
      include: {
        _count: { select: { products: true } },
      },
    })
    if (!store) throw new AppError('Loja não encontrada.', 404)

    const [pendingOrders, recentTransactions] = await Promise.all([
      prisma.orderStore.count({
        where: { storeId: store.id, status: { in: ['payment_confirmed', 'preparing'] } },
      }),
      prisma.storeTransaction.findMany({
        where: { storeId: store.id },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const balancePending = await prisma.storeTransaction.aggregate({
      where: { storeId: store.id, status: 'pending' },
      _sum: { netAmount: true },
    })
    const balanceAvailable = await prisma.storeTransaction.aggregate({
      where: { storeId: store.id, status: 'available' },
      _sum: { netAmount: true },
    })

    res.json({
      store,
      stats: {
        totalProducts: store._count.products,
        pendingOrders,
        balancePending: balancePending._sum.netAmount || 0,
        balanceAvailable: balanceAvailable._sum.netAmount || 0,
      },
      recentTransactions,
    })
  } catch (err) {
    next(err)
  }
})
