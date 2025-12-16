import { Card, List, Board } from "../models/index.mjs"
import { Op } from "sequelize"

const verifyListOwnership = async (listId, userId) => {
  const list = await List.findByPk(listId, {
    include: [{ model: Board, as: "board" }]
  })

  if (!list) {
    return { error: "List not found", status: 404 }
  }

  if (list.board.ownerId !== userId) {
    return { error: "You don't have permission to access this list", status: 403 }
  }

  return { list }
}

const getAllCards = async (req, res) => {
  try {
    const { listId } = req.query

    const verification = await verifyListOwnership(listId, req.user.id)
    if (verification.error) {
      return res.status(verification.status).json({
        success: false,
        message: verification.error
      })
    }

    const cards = await Card.findAll({
      where: { listId },
      order: [["position", "ASC"]]
    })

    res.json({
      success: true,
      data: cards
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getCardById = async (req, res) => {
  try {
    const { id } = req.params

    const card = await Card.findByPk(id, {
      include: [
        {
          model: List,
          as: "list",
          include: [{ model: Board, as: "board" }]
        }
      ]
    })

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    if (card.list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this card"
      })
    }

    res.json({
      success: true,
      data: card
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const createCard = async (req, res) => {
  try {
    const { listId, title, description, position, dueDate } = req.body

    const verification = await verifyListOwnership(listId, req.user.id)
    if (verification.error) {
      return res.status(verification.status).json({
        success: false,
        message: verification.error
      })
    }

    let cardPosition = position
    if (cardPosition === undefined) {
      const maxPosition = await Card.max("position", { where: { listId } })
      cardPosition = (maxPosition || 0) + 1
    }

    const card = await Card.create({
      title,
      description,
      position: cardPosition,
      dueDate,
      listId,
      createdBy: req.user.id
    })

    await List.increment("cardCount", { where: { id: listId } })

    res.status(201).json({
      success: true,
      data: card
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateCard = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, dueDate } = req.body

    const card = await Card.findByPk(id, {
      include: [
        {
          model: List,
          as: "list",
          include: [{ model: Board, as: "board" }]
        }
      ]
    })

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    if (card.list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this card"
      })
    }

    await card.update({ title, description, dueDate })

    res.json({
      success: true,
      data: card
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params

    const card = await Card.findByPk(id, {
      include: [
        {
          model: List,
          as: "list",
          include: [{ model: Board, as: "board" }]
        }
      ]
    })

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    if (card.list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this card"
      })
    }

    const listId = card.listId
    await card.destroy()

    await List.decrement("cardCount", { where: { id: listId } })

    res.json({
      success: true,
      message: "Card deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const moveCard = async (req, res) => {
  try {
    const { id } = req.params
    const { listId: targetListId, position: targetPosition } = req.body

    const card = await Card.findByPk(id, {
      include: [
        {
          model: List,
          as: "list",
          include: [{ model: Board, as: "board" }]
        }
      ]
    })

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    if (card.list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to move this card"
      })
    }

    const targetVerification = await verifyListOwnership(targetListId, req.user.id)
    if (targetVerification.error) {
      return res.status(targetVerification.status).json({
        success: false,
        message: targetVerification.error
      })
    }

    if (card.list.board.id !== targetVerification.list.board.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot move card to a list in a different board"
      })
    }

    const sourceListId = card.listId
    const sourcePosition = card.position
    const isSameList = sourceListId === targetListId

    if (isSameList) {
      if (sourcePosition === targetPosition) {
        return res.json({
          success: true,
          data: card
        })
      }

      if (targetPosition > sourcePosition) {
        await Card.update(
          { position: Card.sequelize.literal("position - 1") },
          {
            where: {
              listId: sourceListId,
              position: { [Op.gt]: sourcePosition, [Op.lte]: targetPosition }
            }
          }
        )
      } else {
        await Card.update(
          { position: Card.sequelize.literal("position + 1") },
          {
            where: {
              listId: sourceListId,
              position: { [Op.gte]: targetPosition, [Op.lt]: sourcePosition }
            }
          }
        )
      }
    } else {
      await Card.update(
        { position: Card.sequelize.literal("position - 1") },
        {
          where: {
            listId: sourceListId,
            position: { [Op.gt]: sourcePosition }
          }
        }
      )

      await Card.update(
        { position: Card.sequelize.literal("position + 1") },
        {
          where: {
            listId: targetListId,
            position: { [Op.gte]: targetPosition }
          }
        }
      )

      await List.decrement("cardCount", { where: { id: sourceListId } })
      await List.increment("cardCount", { where: { id: targetListId } })
    }

    await card.update({ listId: targetListId, position: targetPosition })

    res.json({
      success: true,
      data: card
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params

    const card = await Card.findByPk(id, {
      include: [
        {
          model: List,
          as: "list",
          include: [{ model: Board, as: "board" }]
        }
      ]
    })

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      })
    }

    if (card.list.board.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this card"
      })
    }

    await card.update({ isCompleted: !card.isCompleted })

    res.json({
      success: true,
      data: card
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  toggleComplete
}
