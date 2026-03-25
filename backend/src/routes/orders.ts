import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { authenticate, requireRole } from '../middleware/auth'

export const ordersRouter = Router()

// POST /api/orders — criar pedido a partir do carrinho
ordersRouter.post('/', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({
      cartId: z.string().uuid(),
      addressId: z.string().uuid(),
      paymentMethod: z.enum(['pix', 'credit_card', 'debit_card']),
      buyerNotes: z.string().optional(),
    })
    const data = schema.parse(req.body)

    const cart = await prisma.cart.findUnique({
      where: { id: data.cartId },
      include: {
        items: {
          include: {
            product: { include: { store: true } },
            variant: true,
          },
        },
      },
    })
    if (!cart || cart.items.length === 0) throw new AppError('Carrinho vazio.', 400)

    const address = await prisma.userAddress.findUnique({ where: { id: data.addressId } })
    if (!address || address.userId !== req.user!.userId) {
      throw new AppError('Endereço inválido.', 400)
    }

    // Agrupar itens por loja
    const itemsByStore = cart.items.reduce((acc, item) => {
      const storeId = item.product.storeId
      if (!acc[storeId]) acc[storeId] = []
      acc[storeId].push(item)
      return acc
    }, {} as Record<string, typeof cart.items>)

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
    const shippingTotal = 0 // calculado por loja futuramente
    const total = subtotal + shippingTotal

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId: req.user!.userId,
          shippingAddress: address as any,
          subtotal,
          shippingTotal,
          total,
          paymentMethod: data.paymentMethod,
          buyerNotes: data.buyerNotes,
        },
      })

      for (const [storeId, items] of Object.entries(itemsByStore)) {
        const store = items[0].product.store
        const storeSubtotal = items.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0)
        const commissionAmount = storeSubtotal * (Number(store.commissionRate) / 100)
        const sellerAmount = storeSubtotal - commissionAmount

        const orderStore = await tx.orderStore.create({
          data: {
            orderId: newOrder.id,
            storeId,
            subtotal: storeSubtotal,
            total: storeSubtotal,
            commissionAmount,
            sellerAmount,
          },
        })

        for (const item of items) {
          await tx.orderItem.create({
            data: {
              orderStoreId: orderStore.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: Number(item.unitPrice) * item.quantity,
              isWholesale: item.isWholesale,
              productSnapshot: {
                name: item.product.name,
                slug: item.product.slug,
                image: null,
              },
            },
          })

          await tx.product.update({
            where: { id: item.productId },
            data: { stockQty: { decrement: item.quantity } },
          })
        }
      }

      // Limpa o carrinho
      await tx.cartItem.deleteMany({ where: { cartId: data.cartId } })

      return newOrder
    })

    res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders — pedidos do comprador
ordersRouter.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = '1', limit = '10' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { buyerId: req.user!.userId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          orderStores: {
            include: {
              store: { select: { name: true, slug: true, logoUrl: true } },
              items: {
                take: 1,
                include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { buyerId: req.user!.userId } }),
    ])

    res.json({ data: orders, meta: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id
ordersRouter.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        orderStores: {
          include: {
            store: { select: { id: true, name: true, slug: true, logoUrl: true, whatsapp: true } },
            items: {
              include: {
                product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
                variant: true,
              },
            },
          },
        },
      },
    })
    if (!order) throw new AppError('Pedido não encontrado.', 404)
    if (order.buyerId !== req.user!.userId && req.user!.role !== 'admin') {
      throw new AppError('Sem permissão.', 403)
    }
    res.json(order)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/seller/list — pedidos recebidos pelo lojista
ordersRouter.get('/seller/list', authenticate, requireRole('seller'), async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({ where: { ownerId: req.user!.userId } })
    if (!store) throw new AppError('Loja não encontrada.', 404)

    const { status, page = '1', limit = '20' } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where: any = { storeId: store.id }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.orderStore.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          order: { select: { id: true, createdAt: true, paymentStatus: true, shippingAddress: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.orderStore.count({ where }),
    ])

    res.json({ data: orders, meta: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/orders/seller/:orderStoreId/status — lojista atualiza status
ordersRouter.patch('/seller/:orderStoreId/status', authenticate, requireRole('seller', 'admin'), async (req, res, next) => {
  try {
    const { status, trackingCode } = req.body
    const updated = await prisma.orderStore.update({
      where: { id: req.params.orderStoreId },
      data: {
        status,
        trackingCode,
        shippedAt: status === 'shipped' ? new Date() : undefined,
        deliveredAt: status === 'delivered' ? new Date() : undefined,
      },
    })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})
