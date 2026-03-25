import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

export const usersRouter = Router()

// GET /api/users/me/addresses
usersRouter.get('/me/addresses', authenticate, async (req, res, next) => {
  try {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: req.user!.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
    res.json(addresses)
  } catch (err) {
    next(err)
  }
})

// POST /api/users/me/addresses
usersRouter.post('/me/addresses', authenticate, async (req, res, next) => {
  try {
    const schema = z.object({
      label: z.string().optional(),
      recipientName: z.string().min(3),
      zipCode: z.string().length(9),
      street: z.string().min(3),
      number: z.string(),
      complement: z.string().optional(),
      neighborhood: z.string().min(2),
      city: z.string().min(2),
      state: z.string().length(2),
      isDefault: z.boolean().default(false),
    })

    const data = schema.parse(req.body)

    if (data.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: req.user!.userId },
        data: { isDefault: false },
      })
    }

    const address = await prisma.userAddress.create({
      data: { userId: req.user!.userId, ...data },
    })
    res.status(201).json(address)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/me/addresses/:id
usersRouter.delete('/me/addresses/:id', authenticate, async (req, res, next) => {
  try {
    const address = await prisma.userAddress.findUnique({ where: { id: req.params.id } })
    if (!address || address.userId !== req.user!.userId) {
      throw new AppError('Endereço não encontrado.', 404)
    }
    await prisma.userAddress.delete({ where: { id: req.params.id } })
    res.json({ message: 'Endereço removido.' })
  } catch (err) {
    next(err)
  }
})

// GET /api/users/me/wishlist
usersRouter.get('/me/wishlist', authenticate, async (req, res, next) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            store: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(items.map(i => i.product))
  } catch (err) {
    next(err)
  }
})

// POST /api/users/me/wishlist/:productId
usersRouter.post('/me/wishlist/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: req.user!.userId, productId: req.params.productId } },
      create: { userId: req.user!.userId, productId: req.params.productId },
      update: {},
    })
    res.json({ message: 'Adicionado aos favoritos.' })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/me/wishlist/:productId
usersRouter.delete('/me/wishlist/:productId', authenticate, async (req, res, next) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.user!.userId, productId: req.params.productId },
    })
    res.json({ message: 'Removido dos favoritos.' })
  } catch (err) {
    next(err)
  }
})
