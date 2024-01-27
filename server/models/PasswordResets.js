const { DataTypes, Model, UUIDV4 } = require('sequelize')
const { v4 } = require('uuid')
const sequelize = require('../config/connection')

class PasswordResets extends Model { }

PasswordResets.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: v4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        modelName: "passwordResets"
    }
)

module.exports = PasswordResets