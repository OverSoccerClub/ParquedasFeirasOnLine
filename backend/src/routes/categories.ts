import { Router } from 'express'
import { prisma } from '../lib/prisma'

export const categoriesRouter = Router()

// GET /api/categories
categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } } },
      orderBy: { sortOrder: 'asc' },
    })
    res.json(categories)
  } catch (err) {
    next(err)
  }
})
