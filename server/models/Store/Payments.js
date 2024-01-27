const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

class Payments extends Model { };

Payments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_name: {
            type: DataTypes.STRING
        },
        item_value: {
            type: DataTypes.INTEGER
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        value: {
            type: DataTypes.INTEGER
        },
        currency: {
            type: DataTypes.STRING
        },
        buyer: {
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: "id"
            }
        },
        receiver: {
            type: DataTypes.STRING,
            defaultValue: 'wisdomrsps@yahoo.com'
        },
        player_name: {
            type: DataTypes.STRING
        },
        claimed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        tableName: 'payments',
        timestamps: true
    }
)

module.exports = Payments