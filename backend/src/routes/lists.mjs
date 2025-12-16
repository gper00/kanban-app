import express from "express"
import { authenticateToken } from "../middleware/auth.mjs"
import {
  createListValidation,
  updateListValidation,
  moveListValidation,
  getListsValidation,
  listIdValidation
} from "../validations/listValidation.mjs"
import {
  getAllLists,
  createList,
  updateList,
  deleteList,
  moveList
} from "../controllers/listController.mjs"

const router = express.Router()

router.use(authenticateToken)

router.get("/", ...getListsValidation, getAllLists)
router.post("/", ...createListValidation, createList)
router.put("/:id", ...updateListValidation, updateList)
router.delete("/:id", ...listIdValidation, deleteList)
router.put("/:id/move", ...moveListValidation, moveList)

export default router
