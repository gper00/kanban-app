import { body, param, query } from "express-validator"
import { handleValidationErrors } from "../utils/response.mjs"

const createListValidation = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 character")
    .isLength({ max: 255 })
    .withMessage("title must not exceed 255 characters")
    .trim(),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 1000 })
    .withMessage("description must not exceed 1000 characters")
    .trim(),

  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("position must be a non-negative integer"),

  body("boardId")
    .notEmpty()
    .withMessage("boardId is required")
    .isInt({ min: 1 })
    .withMessage("boardId must be a valid integer"),

  handleValidationErrors
]

const updateListValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid list ID"),

  body("title")
    .optional()
    .notEmpty()
    .withMessage("title cannot be empty")
    .isLength({ min: 1 })
    .withMessage("title must be at least 1 character")
    .isLength({ max: 255 })
    .withMessage("title must not exceed 255 characters")
    .trim(),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 1000 })
    .withMessage("description must not exceed 1000 characters")
    .trim(),

  body("isArchived")
    .optional()
    .isBoolean()
    .withMessage("isArchived must be true or false"),

  handleValidationErrors
]

const moveListValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid list ID"),

  body("position")
    .notEmpty()
    .withMessage("position is required")
    .isInt({ min: 0 })
    .withMessage("position must be a non-negative integer"),

  handleValidationErrors
]

const getListsValidation = [
  query("boardId")
    .notEmpty()
    .withMessage("boardId query parameter is required")
    .isInt({ min: 1 })
    .withMessage("boardId must be a valid integer"),

  handleValidationErrors
]

const listIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid list ID"),

  handleValidationErrors
]

export {
  createListValidation,
  updateListValidation,
  moveListValidation,
  getListsValidation,
  listIdValidation
}
