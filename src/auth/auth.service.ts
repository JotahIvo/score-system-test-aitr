import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY'

export class AuthService {
  async register(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || 'student',
      },
    })
  }

  async login(data: any): Promise<string | null> {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (user && (await bcrypt.compare(data.password, user.password))) {
      return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '8h',
      })
    }
    return null
  }
}
