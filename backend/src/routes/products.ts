import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { authenticate, requireRole } from '../middleware/auth'

export const productsRouter = Router()

// GET /api/products — listagem com filtros e paginação
productsRouter.get('/', async (req, res, next) => {
  try {
    const {
      q, categoria, storeId, minPrice, maxPrice,
      atacado, page = '1', limit = '24', order = 'recent',
    } = req.query as Record<string, string>

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = { status: 'active' }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ]
    }
    if (categoria) {
      where.category = { slug: categoria }
    }
    if (storeId) where.storeId = storeId
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
    if (atacado === 'true') where.isWholesaleAvailable = true

    const orderBy: any =
      order === 'price_asc' ? { price: 'asc' }
      : order === 'price_desc' ? { price: 'desc' }
      : order === 'rating' ? { rating: 'desc' }
      : order === 'sales' ? { salesCount: 'desc' }
      : { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          store: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      data: products,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:slug
productsRouter.get('/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        store: {
          select: {
            id: true, name: true, slug: true, logoUrl: true,
            rating: true, totalSales: true, whatsapp: true,
          },
        },
        category: true,
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { buyer: { select: { name: true, avatarUrl: true } } },
        },
      },
    })
    if (!product) throw new AppError('Produto não encontrado.', 404)

    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    })

    res.json(product)
  } catch (err) {
    next(err)
  }
})

// POST /api/products — criar produto (lojista)
productsRouter.post('/', authenticate, requireRole('seller', 'admin'), async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({ where: { ownerId: req.user!.userId } })
    if (!store) throw new AppError('Loja não encontrada.', 404)
    if (store.status !== 'active') throw new AppError('Sua loja precisa estar ativa para cadastrar produtos.', 403)

    const schema = z.object({
      name: z.string().min(3).max(300),
      description: z.string().optional(),
      categoryId: z.number().optional(),
      price: z.number().positive(),
      originalPrice: z.number().positive().optional(),
      isWholesaleAvailable: z.boolean().default(false),
      wholesalePrice: z.number().positive().optional(),
      wholesaleMinQty: z.number().int().positive().optional(),
      stockQty: z.number().int().min(0).default(0),
      tags: z.array(z.string()).optional(),
      variants: z.array(z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        colorHex: z.string().optional(),
        sku: z.string().optional(),
        stockQty: z.number().int().min(0).default(0),
        priceModifier: z.number().default(0),
      })).optional(),
    })

    const data = schema.parse(req.body)

    const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name: data.name,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        isWholesaleAvailable: data.isWholesaleAvailable,
        wholesalePrice: data.wholesalePrice,
        wholesaleMinQty: data.wholesaleMinQty,
        stockQty: data.stockQty,
        tags: data.tags || [],
        status: 'pending_review',
        variants: data.variants ? { create: data.variants } : undefined,
      },
      include: { variants: true, images: true },
    })

    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
})

// PUT /api/products/:id — atualizar produto
productsRouter.put('/:id', authenticate, requireRole('seller', 'admin'), async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } })
    if (!product) throw new AppError('Produto não encontrado.', 404)

    const store = await prisma.store.findUnique({ where: { ownerId: req.user!.userId } })
    if (req.user!.role !== 'admin' && product.storeId !== store?.id) {
      throw new AppError('Sem permissão para editar este produto.', 403)
    }

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/products/:id
productsRouter.delete('/:id', authenticate, requireRole('seller', 'admin'), async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { status: 'inactive' },
    })
    res.json({ message: 'Produto desativado com sucesso.' })
  } catch (err) {
    next(err)
  }
})
