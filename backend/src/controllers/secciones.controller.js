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

export const getSecciones = async (req, res) => {
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

    const isEmpty = await pool.query({ text: 'SELECT * FROM SECCIONES' })
    if (isEmpty.rowCount === 0) {
      throw new StatusError('La tabla está vacía', STATUS_NOT_FOUND)
    }
    const response = await pool.query({
      text: 'SELECT * FROM SECCIONES ORDER BY NRC LIMIT $1 OFFSET $2',
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

export const getSeccionById = async (req, res) => {
  try {
    const response = await pool.query({
      text: 'SELECT * FROM SECCIONES WHERE NRC = $1',
      values: [req.params.id]
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar la seccion de NRC: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, response.rows[0])
  } catch (error) {
    return handleControllerError(error, res)
  }
}

const getSeccionDataFromRequestBody = (requestBody) => {
  const { NRC, CodAsignatura, Lapso, CedulaProf } = requestBody

  const newProfesor = [NRC, CodAsignatura, Lapso, CedulaProf]

  return newProfesor
}

export const addSeccion = async (req, res) => {
  try {
    const newSeccion = getSeccionDataFromRequestBody(req.body)

    const insertar = await pool.query({
      text: 'INSERT INTO SECCIONES (NRC, CodAsignatura, Lapso, CedulaProf) VALUES ($1, $2, $3, $4) RETURNING NRC',
      values: newSeccion
    })
    const insertedId = insertar.rows[0].NRC
    const response = await pool.query({
      text: 'SELECT * FROM SECCIONES WHERE NRC = $1',
      values: [insertedId]
    })
    return successItemsResponse(res, STATUS_CREATED, response.rows[0])
  } catch (error) {
    return handleControllerError(error, res)
  }
}

export const updateSeccion = async (req, res) => {
  try {
    const updatedSeccion = getSeccionDataFromRequestBody(req.body)
    updatedSeccion.push(req.params.id)
    const response = await pool.query({
      text: 'UPDATE SECCIONES SET NRC = $1, CodAsignatura = $2, Lapso = $3, CedulaProf = $4 WHERE NRC = $5',
      values: updatedSeccion
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar la seccion de NRC: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, 'Seccion modificado exitosamente')
  } catch (error) {
    return handleControllerError(error, res)
  }
}

export const deleteSeccion = async (req, res) => {
  try {
    const response = await pool.query({
      text: 'DELETE FROM SECCIONES WHERE NRC = $1',
      values: [req.params.id]
    })
    if (response.rowCount === 0) {
      throw new StatusError(
        `No se pudo encontrar la seccion de NRC: ${req.params.id}`,
        STATUS_NOT_FOUND
      )
    }
    return successResponse(res, STATUS_OK, 'Seccion eliminado')
  } catch (error) {
    return handleControllerError(error, res)
  }
}
