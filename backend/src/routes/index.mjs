import express from "express"
import authRoutes from "./auth.mjs"
import boardRoutes from "./boards.mjs"
import listRoutes from "./lists.mjs"
import cardRoutes from "./cards.mjs"

const router = express.Router()

router.use("/api/auth", authRoutes)
router.use("/api/boards", boardRoutes)
router.use("/api/lists", listRoutes)
router.use("/api/cards", cardRoutes)

export default router
