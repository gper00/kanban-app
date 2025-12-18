import { validationResult } from "express-validator"

export const successResponse = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const errorResponse = (res, message = "Error", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  }
  
  if (errors) {
    response.errors = errors
  }
  
  return res.status(statusCode).json(response)
}

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      "Validation failed",
      HTTP_STATUS.BAD_REQUEST,
      errors.array().map((error) => error.msg)
    )
  }
  next()
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}
