import { DataTypes } from "sequelize"

export default (sequelize) => {
  const List = sequelize.define(
    "List",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      cardCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Boards",
          key: "id"
        }
      }
    },
    {
      tableName: "lists",
      timestamps: true,
      underscored: true
    }
  )

  List.associate = (models) => {
    List.belongsTo(models.Board, { foreignKey: "boardId", as: "board" })
    List.hasMany(models.Card, { foreignKey: "listId", as: "cards" })
  }

  return List
}
