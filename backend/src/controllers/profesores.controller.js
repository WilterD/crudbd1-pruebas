import { pool } from '../database'
import {
  paginatedItemsResponse,
  successItemsResponse,
  successResponse
} from '../utils/responses'
import StatusError from '../utils/status-error'
import { handleControllerError } from '../utils/handleControllerError'
import { validatePageAndSize } from '../utils/validatePageAndSize'

const STATUS_OK = 200
const STATUS_CREATED = 201
const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404

const DEFAULT_PAGE = 1
const DEFAULT_SIZE = 10

export const getProfesores = async (req, res) => {
  const { page = DEFAULT_PAGE, size = DEFAULT_SIZE } = req.query
  const validatedParams = validatePageAndSize(page, size)

  try {
    if (typeof validatedParams === 'string') {
      throw new StatusError(validatedParams, STATUS_BAD_REQUEST)
    }

    const [pageAsNumber, sizeAsNumber] = validatedParams

    let offset = (pageAsNumber - 1) * sizeAsNumber

    if (pageAsNumber < 1) {
      offset = 0
    }

    const isEmpty = await pool.query({ text: 'SELECT * FROM PROFESORES' })
    if (isEmpty.rowCount === 0) {
      throw new StatusError('La tabla está vacía', STATUS_NOT_FOUND)
    }
    const response = await pool.query({
      text: 'SELECT * FROM PROFESORES ORDER BY nombreP LIMIT $1 OFFSET $2',
      values: [sizeAsNumber, offset]
    })
    const pagination = {
      total: isEmpty.rowCount,
      currentPage: pageAsNumber,
      perPage: sizeAsNumber
    }
    return paginatedItemsResponse(res, STATUS_OK, response.rows, pagination)
  } catch (error) {
    return handleControllerError(error, res)
  }
}

export const getProfesorById = async (req, res) => {
  try {
    const response = await pool.query({
      text: 'SELECT * FROM PROFESORES WHERE CedulaProf = $1',
      values: [req.params.id]
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar el profesor de CI: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, response.rows[0])
  } catch (error) {
    return handleControllerError(error, res)
  }
}

const getProfesorDataFromRequestBody = (requestBody) => {
  const {
    CedulaProf,
    nombreP,
    DireccionP,
    TelefonoP,
    Categoria,
    Dedicacion,
    FechaIng,
    FechaEgr,
    StatusP
  } = requestBody

  const newProfesor = [
    CedulaProf,
    nombreP,
    DireccionP,
    TelefonoP,
    Categoria,
    Dedicacion,
    FechaIng,
    FechaEgr,
    StatusP
  ]

  return newProfesor
}

export const addProfesor = async (req, res) => {
  try {
    const newProfesor = getProfesorDataFromRequestBody(req.body)

    const insertar = await pool.query({
      text: 'INSERT INTO PROFESORES (CedulaProf,nombreP, DireccionP, TelefonoP, Categoria, Dedicacion, FechaIng, FechaEgr, StatusP) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING CedulaProf',
      values: newProfesor
    })
    const insertedId = insertar.rows[0].CedulaProf
    const response = await pool.query({
      text: 'SELECT * FROM PROFESORES WHERE CedulaProf = $1',
      values: [insertedId]
    })
    return successItemsResponse(res, STATUS_CREATED, response.rows[0])
  } catch (error) {
    return handleControllerError(error, res)
  }
}

export const updateProfesor = async (req, res) => {
  try {
    const updatedProfesor = getProfesorDataFromRequestBody(req.body)
    updatedProfesor.push(req.params.id)
    const response = await pool.query({
      text: 'UPDATE PROFESORES SET CedulaProf = $1, nombreP = $2, DireccionP = $3, TelefonoP = $4, Categoria = $5, Dedicacion = $6, FechaIng = %7, FechaEgr = $8, StatusP = $9 WHERE CedulaProf = $10',
      values: updatedProfesor
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar el profesor de CI: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, 'Profesor modificado exitosamente')
  } catch (error) {
    return handleControllerError(error, res)
  }
}

export const deleteProfesor = async (req, res) => {
  try {
    const response = await pool.query({
      text: 'DELETE FROM PROFESORES WHERE CedulaProf = $1',
      values: [req.params.id]
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar el profesor de CI: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, 'Profesor eliminado')
  } catch (error) {
    return handleControllerError(error, res)
  }
}
