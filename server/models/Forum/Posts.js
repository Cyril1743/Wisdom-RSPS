const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class Posts extends Model { }

Posts.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    image: {
        type: DataTypes.JSON
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id"
        }
    },
    pinned: {
        type: DataTypes.BOOLEAN
    },
    catagory: {
        type: DataTypes.INTEGER,
        references: {
            model: "forumCatagories",
            key: "id"
        }
    },
    allowComments: {
        type: DataTypes.BOOLEAN
    }
}, 
{
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: "posts",
    underscored: true
})

module.exports = Posts;