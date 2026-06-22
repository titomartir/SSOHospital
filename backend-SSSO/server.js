import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import departamentoRoutes from './src/routes/departamentoRoutes.js'
import riesgoRoutes from './src/routes/riesgoRoutes.js'
import matrizRoutes from './src/routes/matrizRoutes.js'
import planificacionRoutes from './src/routes/planificacionRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas de la API
app.use('/api/departamentos', departamentoRoutes)
app.use('/api/riesgos', riesgoRoutes)
app.use('/api/matriz', matrizRoutes)
app.use('/api/planificacion', planificacionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor SSO funcionando' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
})