const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

class ForumCatagories extends Model { }

ForumCatagories.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING
    },
    catagoryDescription: {
        type: DataTypes.STRING
    }
},
    {
        sequelize,
        freezeTableName: true,
        modelName: "forumCatagories",
        underscored: true
    });

module.exports = ForumCatagories;