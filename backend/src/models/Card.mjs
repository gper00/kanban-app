import { DataTypes } from "sequelize"

export default (sequelize) => {
  const Card = sequelize.define(
    "Card",
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
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      listId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Lists",
          key: "id"
        }
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id"
        }
      }
    },
    {
      tableName: "cards",
      timestamps: true,
      underscored: true
    }
  )

  Card.associate = (models) => {
    Card.belongsTo(models.List, { foreignKey: "listId", as: "list" })
    Card.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" })
  }

  return Card
}
