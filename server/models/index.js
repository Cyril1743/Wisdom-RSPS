//Import all the tables to set up associations
const Comments = require("./Forum/Comments");
const ForumCatagories = require("./Forum/ForumCatagories");
const Posts = require("./Forum/Posts");
const Payments = require("./Store/Payments");
const Products = require("./Store/Products");
const StoreCatagories = require("./Store/StoreCatagories");
const Users = require("./Users");
const PasswordResets = require('./PasswordResets')

Users.hasMany(Posts, {
    foreignKey: "userId"
})
Users.hasMany(Comments, {
    foreignKey: "userId"
})
Users.hasMany(Payments, {
    foreignKey: "buyer"
})
Users.hasMany(PasswordResets, {
    foreignKey: 'userId'
})
Comments.belongsTo(Posts, {
    foreignKey: "postid",
    onDelete: "CASCADE"
})
Comments.belongsTo(Users, {
    foreignKey: "userId",
    onDelete: "CASCADE"
})
ForumCatagories.hasMany(Posts, {
    foreignKey: "catagory"
})
Posts.belongsTo(ForumCatagories, {
    foreignKey: "catagory"
})
Posts.belongsTo(Users, {
    foreignKey: "userId"
})
Posts.hasMany(Comments, {
    foreignKey: "postid"
})
Payments.belongsTo(Users, {
    foreignKey: "buyer",
    onDelete: "CASCADE"
})
Products.belongsTo(StoreCatagories, {
    foreignKey: "catagory"
})
StoreCatagories.hasMany(Products, {
    foreignKey: "catagory"
})
PasswordResets.belongsTo(Users, {
    foreignKey: 'userId'
})

module.exports = { Comments, ForumCatagories, Posts, Payments, Products, StoreCatagories, Users, PasswordResets }