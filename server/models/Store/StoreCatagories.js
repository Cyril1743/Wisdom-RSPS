const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection')

class StoreCatagories extends Model { };

StoreCatagories.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING
        }
    }, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "storeCatagories"
}
);

module.exports = StoreCatagories;