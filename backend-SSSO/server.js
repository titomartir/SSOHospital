import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import departamentoRoutes from './src/routes/departamentoRoutes.js'
import subDireccionRoutes from './src/routes/subDireccionRoutes.js'
import servicioRoutes from './src/routes/servicioRoutes.js'
import catalogoEstructuraRoutes from './src/routes/catalogoEstructuraRoutes.js'
import puestoRoutes from './src/routes/puestoRoutes.js'
import funcionRoutes from './src/routes/funcionRoutes.js'
import catalogoPuestoFuncionRoutes from './src/routes/catalogoPuestoFuncionRoutes.js'
import catalogoRiesgoPeligroRoutes from './src/routes/catalogoRiesgoPeligroRoutes.js'
import peligroRoutes from './src/routes/peligroRoutes.js'
import riesgoRoutes from './src/routes/riesgoRoutes.js'
import matrizRoutes from './src/routes/matrizRoutes.js'
import planificacionRoutes from './src/routes/planificacionRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'
import medidaPreventivaRoutes from './src/routes/medidaPreventivaRoutes.js'
import accionRoutes from './src/routes/accionRoutes.js'
import recursoRoutes from './src/routes/recursoRoutes.js'
import responsableRoutes from './src/routes/responsableRoutes.js'
import catalogoRiesgoFisicoRoutes from './src/routes/catalogoRiesgoFisicoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas de la API
app.use('/api/departamentos', departamentoRoutes)
app.use('/api/sub-direcciones', subDireccionRoutes)
app.use('/api/servicios', servicioRoutes)
app.use('/api/catalogo-estructura', catalogoEstructuraRoutes)
app.use('/api/puestos', puestoRoutes)
app.use('/api/funciones', funcionRoutes)
app.use('/api/catalogo-puesto-funcion', catalogoPuestoFuncionRoutes)
app.use('/api/catalogo-riesgo-peligro', catalogoRiesgoPeligroRoutes)
app.use('/api/peligros', peligroRoutes)
app.use('/api/riesgos', riesgoRoutes)
app.use('/api/matriz', matrizRoutes)
app.use('/api/planificacion', planificacionRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/medidas-preventivas', medidaPreventivaRoutes)
app.use('/api/acciones', accionRoutes)
app.use('/api/recursos', recursoRoutes)
app.use('/api/responsables', responsableRoutes)
app.use('/api/catalogo-riesgo-fisico', catalogoRiesgoFisicoRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor SSO funcionando' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
})