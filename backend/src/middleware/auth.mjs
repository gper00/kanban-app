import jwt from "jsonwebtoken"
import { User } from "../models/index.mjs"
import { errorResponse, HTTP_STATUS } from "../utils/response.mjs"

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return errorResponse(res, "Authentication required", HTTP_STATUS.UNAUTHORIZED)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return errorResponse(res, "User not found", HTTP_STATUS.UNAUTHORIZED)
    }

    req.user = user
    next()
  } catch (error) {
    return errorResponse(res, "Invalid token", HTTP_STATUS.UNAUTHORIZED)
  }
}

export { authenticateToken }
