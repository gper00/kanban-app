import { body } from "express-validator"
import { handleValidationErrors } from "../utils/response.mjs"

const createBoardValidation = [
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

  body("backgroundColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage(
      "backgroundColor must be a valid 6-digit hex color (e.g., #0079bf)"
    )
    .isLength({ min: 7, max: 7 })
    .withMessage("backgroundColor must be exactly 7 characters"),

  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be true or false"),

  handleValidationErrors
]

const updateBoardValidation = [
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
    .isLength({ max: 1000 })
    .withMessage("description must not exceed 1000 characters")
    .isString()
    .withMessage("description must be a string")
    .trim(),

  body("backgroundColor")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage(
      "backgroundColor must be a valid 6-digit hex color (e.g., #0079bf)"
    )
    .isLength({ min: 7, max: 7 })
    .withMessage("backgroundColor must be exactly 7 characters"),

  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be true or false"),

  handleValidationErrors
]

export { createBoardValidation, updateBoardValidation }
