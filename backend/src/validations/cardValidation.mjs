import { body, param, query } from "express-validator"
import { handleValidationErrors } from "../utils/response.mjs"

const createCardValidation = [
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
    .isLength({ max: 2000 })
    .withMessage("description must not exceed 2000 characters")
    .trim(),

  body("position")
    .optional()
    .isInt({ min: 0 })
    .withMessage("position must be a non-negative integer"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("dueDate must be a valid date (ISO 8601 format)"),

  body("listId")
    .notEmpty()
    .withMessage("listId is required")
    .isInt({ min: 1 })
    .withMessage("listId must be a valid integer"),

  handleValidationErrors
]

const updateCardValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid card ID"),

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
    .isLength({ max: 2000 })
    .withMessage("description must not exceed 2000 characters")
    .trim(),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("dueDate must be a valid date (ISO 8601 format)"),

  handleValidationErrors
]

const moveCardValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid card ID"),

  body("listId")
    .notEmpty()
    .withMessage("listId is required")
    .isInt({ min: 1 })
    .withMessage("listId must be a valid integer"),

  body("position")
    .notEmpty()
    .withMessage("position is required")
    .isInt({ min: 0 })
    .withMessage("position must be a non-negative integer"),

  handleValidationErrors
]

const getCardsValidation = [
  query("listId")
    .notEmpty()
    .withMessage("listId query parameter is required")
    .isInt({ min: 1 })
    .withMessage("listId must be a valid integer"),

  handleValidationErrors
]

const cardIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid card ID"),

  handleValidationErrors
]

export {
  createCardValidation,
  updateCardValidation,
  moveCardValidation,
  getCardsValidation,
  cardIdValidation
}
