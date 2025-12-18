import jwt from "jsonwebtoken"
import { User } from "../models/index.mjs"
import { successResponse, errorResponse, HTTP_STATUS } from "../utils/response.mjs"

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return errorResponse(res, "Email already registered", HTTP_STATUS.BAD_REQUEST)
    }

    const user = await User.create({ email, password, name })
    const token = generateToken(user.id)

    return successResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    }, "Registration successful", HTTP_STATUS.CREATED)
  } catch (error) {
    console.error("Register error:", error)
    return errorResponse(res, "Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Invalid credentials", HTTP_STATUS.UNAUTHORIZED)
    }

    const token = generateToken(user.id)

    return successResponse(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    }, "Login successful")
  } catch (error) {
    console.error("Login error:", error)
    return errorResponse(res, "Internal server error", HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

export { register, login }
