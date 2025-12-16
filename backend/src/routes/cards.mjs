import express from "express"
import { authenticateToken } from "../middleware/auth.mjs"
import {
  createCardValidation,
  updateCardValidation,
  moveCardValidation,
  getCardsValidation,
  cardIdValidation
} from "../validations/cardValidation.mjs"
import {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  toggleComplete
} from "../controllers/cardController.mjs"

const router = express.Router()

router.use(authenticateToken)

router.get("/", ...getCardsValidation, getAllCards)
router.post("/", ...createCardValidation, createCard)
router.get("/:id", ...cardIdValidation, getCardById)
router.put("/:id", ...updateCardValidation, updateCard)
router.delete("/:id", ...cardIdValidation, deleteCard)
router.put("/:id/move", ...moveCardValidation, moveCard)
router.put("/:id/complete", ...cardIdValidation, toggleComplete)

export default router
