import { Router } from 'express'
import {
  getSecciones,
  getSeccionById,
  addSeccion,
  deleteSeccion,
  updateSeccion
} from '../../controllers/secciones.controller'

const router = Router()

router.get('/', getSecciones)
router.get('/:id', getSeccionById)
router.post('/', addSeccion)
router.put('/:id', updateSeccion)
router.delete('/:id', deleteSeccion)

export default router
