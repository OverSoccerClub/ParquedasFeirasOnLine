import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new AppError('Token não fornecido.', 401, 'UNAUTHORIZED')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
    req.user = payload
    next()
  } catch {
    throw new AppError('Token inválido ou expirado.', 401, 'UNAUTHORIZED')
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError('Não autenticado.', 401, 'UNAUTHORIZED')
    if (!roles.includes(req.user.role)) {
      throw new AppError('Acesso negado.', 403, 'FORBIDDEN')
    }
    next()
  }
}
