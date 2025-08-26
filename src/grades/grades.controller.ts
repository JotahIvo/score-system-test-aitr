import express from 'express'
import { authenticate, authorize } from '../auth/auth.middleware'
import { GradesService } from './grades.service'

const router = express.Router()
const gradesService = new GradesService()

// Todas as rotas são protegidas e requerem autenticação
router.use(authenticate)

router.post('/', authorize(['professor']), async (req, res) => {
  try {
    const grade = await gradesService.create(req.body, (req as any).user.id)
    res.status(201).json(grade)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/:studentName', async (req, res) => {
  try {
    const grades = await gradesService.findByStudent(req.params.studentName)
    res.json(grades)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', authorize(['professor']), async (req, res) => {
  try {
    const updatedGrade = await gradesService.update(
      Number(req.params.id),
      req.body.grade,
    )
    res.json(updatedGrade)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', authorize(['professor']), async (req, res) => {
  try {
    await gradesService.delete(Number(req.params.id))
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
