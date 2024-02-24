const { Model, DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../../config/connection")

class Comments extends Model { }

Comments.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: "posts",
            key: "id"
        }
    }
}, {
    sequelize,
    freezeTableName: true,
    modelName: "comments",
    timestamps: true,
    underscored: true
})

module.exports = Comments;