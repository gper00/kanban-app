import { body } from 'express-validator'
import { handleValidationErrors } from '../utils/response.mjs'

const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 2 })
    .withMessage('name must be at least 2 characters')
    .isLength({ max: 100 })
    .withMessage('name must not exceed 100 characters')
    .trim(),
  
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters')
    .isLength({ max: 255 })
    .withMessage('password must not exceed 255 characters'),
  
  handleValidationErrors
]

const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  
  handleValidationErrors
]

export { registerValidation, loginValidation }
