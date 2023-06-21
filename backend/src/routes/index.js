import express from 'express'

import profesoresRouter from './api/profesores.routes'
import escuelasRouter from './api/escuelas.routes'
import estudiantesRouter from './api/estudiantes.routes'

const router = express.Router()

router.use('/profesores', profesoresRouter)
router.use('/escuelas', escuelasRouter)
router.use('/estudiantes', estudiantesRouter)

export default router
