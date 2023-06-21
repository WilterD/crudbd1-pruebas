import { Router } from 'express'
import { getAsignaturas } from '../../controllers/asignaturas.controller'

const router = Router()

router.get('/', getAsignaturas)

export default router
