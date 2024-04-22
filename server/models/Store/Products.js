const { Model, DataTypes } = require('sequelize');
const sequelize = require("../../config/connection");

class Products extends Model { };

Products.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.INTEGER,
        },
        image_url: {
            type: DataTypes.STRING
        },
        catagory: {
            type: DataTypes.INTEGER,
            references: {
                model: 'storeCatagories',
                key: 'id'
            },
            allowNull: false
        }

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'products'
    }
)
module.exports = Products