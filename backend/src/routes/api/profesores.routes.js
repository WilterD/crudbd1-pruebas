import { Router } from 'express'
import {
  getProfesores,
  getProfesorById,
  addProfesor,
  deleteProfesor,
  updateProfesor
} from '../../controllers/profesores.controller'

const router = Router()

router.get('/', getProfesores)
router.get('/:id', getProfesorById)
router.post('/', addProfesor)
router.put('/:id', updateProfesor)
router.delete('/:id', deleteProfesor)

export default router
