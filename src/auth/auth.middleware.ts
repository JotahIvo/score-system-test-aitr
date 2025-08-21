import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      ;(req as any).user = decoded // Anexa o payload do utilizador ao pedido
      next()
    } catch (error) {
      res.status(401).send({ error: 'Invalid token' })
    }
  } else {
    res.status(401).send({ error: 'No token provided' })
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (user && roles.includes(user.role)) {
      next()
    } else {
      res.status(403).send({ error: 'Forbidden' })
    }
  }
}
