import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AppError } from '../middleware/errorHandler'
import { authenticate } from '../middleware/auth'

export const authRouter = Router()

const registerSchema = z.object({
  name: z.string().min(3).max(150),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['buyer', 'seller']).default('buyer'),
  cpfCnpj: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' },
  )
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '30d' },
  )
  return { accessToken, refreshToken }
}

// POST /api/auth/register
authRouter.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new AppError('Email já cadastrado.', 409, 'EMAIL_TAKEN')

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role,
        cpfCnpj: data.cpfCnpj,
        status: 'active',
      },
      select: { id: true, name: true, email: true, role: true, status: true },
    })

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    res.status(201).json({ user, accessToken, refreshToken })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new AppError('Email ou senha inválidos.', 401, 'INVALID_CREDENTIALS')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new AppError('Email ou senha inválidos.', 401, 'INVALID_CREDENTIALS')

    if (user.status === 'suspended') {
      throw new AppError('Conta suspensa. Entre em contato com o suporte.', 403, 'SUSPENDED')
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new AppError('Refresh token não fornecido.', 401)

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token inválido ou expirado.', 401)
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any
    const { accessToken, refreshToken: newRefresh } = generateTokens(payload.userId, payload.role)

    await prisma.refreshToken.delete({ where: { token: refreshToken } })
    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        token: newRefresh,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    res.json({ accessToken, refreshToken: newRefresh })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/logout
authRouter.post('/logout', authenticate, async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ message: 'Logout realizado com sucesso.' })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, status: true, avatarUrl: true,
        cpfCnpj: true, createdAt: true,
        store: { select: { id: true, name: true, slug: true, status: true } },
      },
    })
    if (!user) throw new AppError('Usuário não encontrado.', 404)
    res.json(user)
  } catch (err) {
    next(err)
  }
})
