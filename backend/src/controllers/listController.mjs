import { List, Board } from "../models/index.mjs"
import { Op } from "sequelize"

const getAllLists = async (req, res) => {
  try {
    const { boardId } = req.query

    const board = await Board.findOne({
      where: { id: boardId, ownerId: req.user.id }
    })

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      })
    }

    const lists = await List.findAll({
      where: { boardId },
      order: [["position", "ASC"]]
    })

    res.json({
      success: true,
      data: lists
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const createList = async (req, res) => {
  try {
    const { boardId, title, description, position } = req.body

    const board = await Board.findOne({
      where: { id: boardId, ownerId: req.user.id }
    })

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found"
      })
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

    res.status(201).json({
      success: true,
      data: list
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
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
      return res.status(404).json({
        success: false,
        message: "List not found"
      })
    }

    if (list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this list"
      })
    }

    await list.update({ title, description, isArchived })

    res.json({
      success: true,
      data: list
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteList = async (req, res) => {
  try {
    const { id } = req.params

    const list = await List.findByPk(id, {
      include: [{ model: Board, as: "board" }]
    })

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      })
    }

    if (list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this list"
      })
    }

    await list.destroy()

    res.json({
      success: true,
      message: "List deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
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
      return res.status(404).json({
        success: false,
        message: "List not found"
      })
    }

    if (list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to move this list"
      })
    }

    const oldPosition = list.position
    const newPosition = position

    if (oldPosition === newPosition) {
      return res.json({
        success: true,
        data: list
      })
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

    res.json({
      success: true,
      data: updatedLists
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export { getAllLists, createList, updateList, deleteList, moveList }
