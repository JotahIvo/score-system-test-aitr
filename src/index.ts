import express from 'express'
import authRouter from './auth/auth.controller' // Importação adicionada
import gradesRouter from './grades/grades.controller'

const app = express()
app.use(express.json())

app.use('/auth', authRouter) // Rota de autenticação ativada
app.use('/grades', gradesRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
