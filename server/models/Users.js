const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require('bcrypt')

class Users extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
};

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 32],
                    msg: "Password must be between 8 and 32 characters"
                }
            }
        },
        isForumAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isStoreAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        allowContact: {
            type: DataTypes.BOOLEAN
        }
    }, {
    hooks: {
        beforeCreate: async (newuserdata) => {
            newuserdata.password = await bcrypt.hash(newuserdata.password, 10)
            return newuserdata
        },
        beforeUpdate: async (newuserdata) => {
            newuserdata.password = await bcrypt.hash(newuserdata.password, 10)
            return newuserdata
        }
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "users",
    timestamps: true
}
)

module.exports = Users