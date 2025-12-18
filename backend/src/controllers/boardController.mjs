import { Board, List, Card } from "../models/index.mjs"
import { successResponse, errorResponse, HTTP_STATUS } from "../utils/response.mjs"

const getAllBoards = async (req, res) => {
  try {
    const boards = await Board.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "DESC"]]
    })

    return successResponse(res, boards, "Boards retrieved successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      ...req.body,
      ownerId: req.user.id
    })

    return successResponse(res, board, "Board created successfully", HTTP_STATUS.CREATED)
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      },
      include: [
        {
          model: List,
          as: "lists",
          include: [
            {
              model: Card,
              as: "cards",
              order: [["position", "ASC"]]
            }
          ],
          order: [["position", "ASC"]]
        }
      ]
    })

    if (!board) {
      return errorResponse(res, "Board not found", HTTP_STATUS.NOT_FOUND)
    }

    return successResponse(res, board, "Board retrieved successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const updateBoard = async (req, res) => {
  try {
    const [updated] = await Board.update(req.body, {
      where: {
        id: req.params.id,
        ownerId: req.user.id
      }
    })

    if (!updated) {
      return errorResponse(res, "Board not found", HTTP_STATUS.NOT_FOUND)
    }

    const board = await Board.findByPk(req.params.id)
    return successResponse(res, board, "Board updated successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

const deleteBoard = async (req, res) => {
  try {
    const deleted = await Board.destroy({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      }
    })

    if (!deleted) {
      return errorResponse(res, "Board not found", HTTP_STATUS.NOT_FOUND)
    }

    return successResponse(res, null, "Board deleted successfully")
  } catch (error) {
    return errorResponse(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}

export { getAllBoards, createBoard, getBoardById, updateBoard, deleteBoard }
