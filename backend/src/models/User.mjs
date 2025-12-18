import { DataTypes } from "sequelize"
import bcrypt from "bcryptjs"

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6, 255]
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100]
        }
      }
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true
    }
  )

  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12)
  })

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 12)
    }
  })

  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
  }

  User.associate = (models) => {
    User.hasMany(models.Board, { foreignKey: "ownerId", as: "ownedBoards" })
    User.hasMany(models.Card, { foreignKey: "createdBy", as: "createdCards" })
  }

  return User
}
