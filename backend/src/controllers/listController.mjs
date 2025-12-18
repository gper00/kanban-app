import { List, Board } from "../models/index.mjs"
import { Op } from "sequelize"
import { successResponse, errorResponse, HTTP_STATUS } from "../utils/response.mjs"

const getAllLists = async (req, res) => {
  try {
    const { boardId } = req.query

    const board = await Board.findOne({
      where: { id: boardId, ownerId: req.user.id }
    })

    if (!board) {
      return errorResponse(res, "Board not found", HTTP_STATUS.NOT_FOUND)
    }

    const lists = await List.findAll({
      where: { boardId },
      order: [["position", "ASC"]]
    })

    return successResponse(res, lists, "Lists retrieved successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const createList = async (req, res) => {
  try {
    const { boardId, title, description, position } = req.body

    const board = await Board.findOne({
      where: { id: boardId, ownerId: req.user.id }
    })

    if (!board) {
      return errorResponse(res, "Board not found", HTTP_STATUS.NOT_FOUND)
    }

    let listPosition = position
    if (listPosition === undefined) {
      const maxPosition = await List.max("position", { where: { boardId } })
      listPosition = (maxPosition || 0) + 1
    }

    const list = await List.create({
      title,
      description,
      position: listPosition,
      boardId
    })

    return successResponse(res, list, "List created successfully", HTTP_STATUS.CREATED)
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const updateList = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, isArchived } = req.body

    const list = await List.findByPk(id, {
      include: [{ model: Board, as: "board" }]
    })

    if (!list) {
      return errorResponse(res, "List not found", HTTP_STATUS.NOT_FOUND)
    }

    if (list.board.ownerId !== req.user.id) {
      return errorResponse(res, "You don't have permission to update this list", HTTP_STATUS.FORBIDDEN)
    }

    await list.update({ title, description, isArchived })

    return successResponse(res, list, "List updated successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const deleteList = async (req, res) => {
  try {
    const { id } = req.params

    const list = await List.findByPk(id, {
      include: [{ model: Board, as: "board" }]
    })

    if (!list) {
      return errorResponse(res, "List not found", HTTP_STATUS.NOT_FOUND)
    }

    if (list.board.ownerId !== req.user.id) {
      return errorResponse(res, "You don't have permission to delete this list", HTTP_STATUS.FORBIDDEN)
    }

    await list.destroy()

    return successResponse(res, null, "List deleted successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const moveList = async (req, res) => {
  try {
    const { id } = req.params
    const { position } = req.body

    const list = await List.findByPk(id, {
      include: [{ model: Board, as: "board" }]
    })

    if (!list) {
      return errorResponse(res, "List not found", HTTP_STATUS.NOT_FOUND)
    }

    if (list.board.ownerId !== req.user.id) {
      return errorResponse(res, "You don't have permission to move this list", HTTP_STATUS.FORBIDDEN)
    }

    const oldPosition = list.position
    const newPosition = position

    if (oldPosition === newPosition) {
      return successResponse(res, list, "List position unchanged")
    }

    if (newPosition > oldPosition) {
      await List.update(
        { position: List.sequelize.literal("position - 1") },
        {
          where: {
            boardId: list.boardId,
            position: { [Op.gt]: oldPosition, [Op.lte]: newPosition }
          }
        }
      )
    } else {
      await List.update(
        { position: List.sequelize.literal("position + 1") },
        {
          where: {
            boardId: list.boardId,
            position: { [Op.gte]: newPosition, [Op.lt]: oldPosition }
          }
        }
      )
    }

    await list.update({ position: newPosition })

    const updatedLists = await List.findAll({
      where: { boardId: list.boardId },
      order: [["position", "ASC"]]
    })

    return successResponse(res, updatedLists, "List moved successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

export { getAllLists, createList, updateList, deleteList, moveList }
