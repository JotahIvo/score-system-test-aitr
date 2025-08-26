import express, { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

const router = express.Router()
const authService = new AuthService()

// Rota: POST /auth/register
router.post('/register', async (req: Request, res: Response) => {
  const registerDto = plainToInstance(RegisterDto, req.body)
  const errors = await validate(registerDto)

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  try {
    const user = await authService.register(registerDto)
    // Nunca retorne a senha na resposta da API
    const { password, ...result } = user
    res.status(201).json(result)
  } catch (error: any) {
    // Tratamento de erro para e-mail duplicado
    if (error.code === 'P2002') {
      // Código de erro do Prisma para violação de constraint única
      return res.status(409).json({ error: 'Email already exists.' })
    }
    res.status(500).json({ error: 'Registration failed.' })
  }
})

// Rota: POST /auth/login
router.post('/login', async (req: Request, res: Response) => {
  const loginDto = plainToInstance(LoginDto, req.body)
  const errors = await validate(loginDto)

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  try {
    const token = await authService.login(loginDto)
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    res.json({ accessToken: token })
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' })
  }
})

export default router
