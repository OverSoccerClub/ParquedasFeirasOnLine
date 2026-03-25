import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'

export const cartRouter = Router()

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) throw new AppError('Identificação do carrinho necessária.', 400)
  const where = userId ? { userId } : { sessionId }
  const existing = await prisma.cart.findFirst({ where })
  if (existing) return existing
  return prisma.cart.create({ data: userId ? { userId } : { sessionId } })
}

// GET /api/cart
cartRouter.get('/', async (req, res, next) => {
  try {
    const userId = (req as any).user?.userId
    const sessionId = req.headers['x-session-id'] as string

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                store: { select: { id: true, name: true, slug: true } },
              },
            },
            variant: true,
          },
        },
      },
    })

    if (!cart) return res.json({ items: [], total: 0 })

    const total = cart.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
    res.json({ ...cart, total })
  } catch (err) {
    next(err)
  }
})

// POST /api/cart/items
cartRouter.post('/items', async (req, res, next) => {
  try {
    const schema = z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid().optional(),
      quantity: z.number().int().positive(),
      isWholesale: z.boolean().default(false),
    })

    const data = schema.parse(req.body)
    const userId = (req as any).user?.userId
    const sessionId = req.headers['x-session-id'] as string

    const product = await prisma.product.findUnique({ where: { id: data.productId } })
    if (!product || product.status !== 'active') throw new AppError('Produto indisponível.', 404)

    const unitPrice = data.isWholesale && product.wholesalePrice
      ? product.wholesalePrice
      : product.price

    const cart = await getOrCreateCart(userId, sessionId)

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: data.productId, variantId: data.variantId ?? null },
    })

    let item
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity },
      })
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, ...data, unitPrice },
      })
    }

    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
})

// PUT /api/cart/items/:id
cartRouter.put('/items/:id', async (req, res, next) => {
  try {
    const { quantity } = z.object({ quantity: z.number().int().min(0) }).parse(req.body)

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: req.params.id } })
      return res.json({ message: 'Item removido.' })
    }

    const item = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity },
    })
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/cart/items/:id
cartRouter.delete('/items/:id', async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.id } })
    res.json({ message: 'Item removido.' })
  } catch (err) {
    next(err)
  }
})
