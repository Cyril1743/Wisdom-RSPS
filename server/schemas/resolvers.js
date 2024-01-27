//Consts for setting up database interactions
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { Comments, ForumCatagories, Payments, Posts, Products, StoreCatagories, Users, PasswordResets } = require("../models");
const { signToken } = require("../utils/auth");
const { Sequelize, Op } = require('sequelize');
const moment = require("moment");
const { passwordResetRequest, passwordResetResponse, signUpResponse } = require('../utils/mailer');

const resolvers = {
    Query: {
        users: async () => {
            return Users.findAll();
        },
        userByEmail: async (parent, { email }) => {
            //Try to find a user by the email to prevent duplicate accounts
            const user = await Users.findOne({
                where: {
                    email: email
                }
            })
            //If the user is found, then return the plain data
            if (user) {
                const plainuser = user.get({ plain: true })
                return plainuser
            } else {
                return user
            }
        },
        userByUsername: async (parent, { username }) => {
            //Try to see if the username is already taken
            const user = await Users.findOne({
                where: {
                    username: username
                }
            })
            //If the username is found, then return the plain data
            if (user) {
                const plainuser = user.get({ plain: true })
                return plainuser
            } else {
                return user
            }
        },
        forumCatagories: async () => {
            return ForumCatagories.findAll({
                include: [{
                    model: Posts,
                    include: [
                        {
                            model: Users,
                            attributes: ["username"]
                        }
                    ],
                    limit: 10
                }]
            })
        },
        forumCatagory: async (parent, { id, limit = 50, offset = 0 }) => {
            const forumCatagory = await ForumCatagories.findByPk(id, {
                include: {
                    model: Posts,
                    include: [{
                        model: Users,
                        attributes: ['username']
                    }],
                    limit: limit,
                    offset: offset,
                    order: [['createdAt', 'DESC']]
                }
            })
            const plainForumCatagory = forumCatagory.get({plain: true})

            return plainForumCatagory
        },
        post: async (parent, { postId }) => {
            return Posts.findByPk(postId, {
                include: [{ model: Users }, { model: Comments, include: [{ model: Users }] }]
            })
        },
        storeCatagories: async () => {
            return await StoreCatagories.findAll({
                include: { model: Products }
            })
        },
        storeCatagory: async (parent, { catagoryId }) => {
            const catagory = await StoreCatagories.findByPk(catagoryId, {
                include: { model: Products }
            })
            return catagory.get({ plain: true })
        },
        payments: async () => {
            const startOfMonth = moment().startOf('month').toDate()
            const endOfMonth = moment().endOf('month').toDate()

            return await Payments.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: startOfMonth,
                        [Op.lte]: endOfMonth
                    }
                },
                include: {
                    model: Users,
                    attributes: ['email']
                }
            })
        },
        passwordReset: async (parent, { id }) => {
            const passwordReset = await PasswordResets.findByPk(id, {
                include: { model: Users }
            })
            const plainPasswordReset = passwordReset.get({ plain: true })

            const now = moment();
            const createdAt = moment(plainPasswordReset.createdAt)

            if (now.diff(createdAt, 'hour') > 1) {
                await PasswordResets.destroy({ where: { id: id } })
                throw new Error("Reset Expired")
            }

            return plainPasswordReset
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password, allowContact }) => {
            const existingUser = await Users.findOne({
                where: {
                    email: email
                }
            })
            if (existingUser) {
                throw new UserInputError("User already exists with email")
            }
            const user = await Users.create({ username, email, password, allowContact })
            const plainUser = user.get({ plain: true })
            const token = signToken({ email: email, username: username, id: plainUser.id, isForumAdmin: plainUser.isForumAdmin })
            signUpResponse(email)
            return { token: token, user: plainUser }
        },
        login: async (parent, { email, password }) => {
            const user = await Users.findOne({
                where: {
                    email: email
                }
            })
            if (!user) {
                throw new AuthenticationError('No user found with email')
            }
            const plainUser = user.get({ plain: true })
            if (!user.checkPassword(password)) {
                throw new AuthenticationError('Incorrect password')
            }

            const token = signToken({ email: email, username: plainUser.username, id: plainUser.id, isForumAdmin: plainUser.isForumAdmin });

            return { token: token, user: plainUser }
        },
        addPost: async (parent, { title, text, image, catagory }, context) => {
            const Fcatagory = await ForumCatagories.findOne({
                where: {
                    title: catagory
                }
            })
            const Fcatagoryplain = Fcatagory.get({ plain: true })
            if (image) {
                const newPost = await Posts.create({
                    title,
                    text,
                    image,
                    user: context.user.id,
                    catagory: Fcatagoryplain.id
                })
                return newPost.get({ plain: true })
            } else {
                const newPost = await Posts.create({
                    title,
                    text,
                    user: context.user.id,
                    catagory: Fcatagoryplain.id
                })
                return newPost.get({ plain: true })
            }
        },
        pinPost: async (parent, { postId }) => {
            const updatedPost = await Posts.update({ pinned: true }, {
                where: {
                    id: postId
                }
            })
            return updatedPost
        },
        unpinPost: async (parent, { postId }) => {
            const updatedPost = await Posts.update({ pinned: false }, {
                where: {
                    id: postId
                }
            })
            return updatedPost
        },
        addComment: async (parent, { postId, text, image }, context) => {
            if (image) {
                const newComment = Comments.create({
                    text,
                    image,
                    user: context.user.id,
                    postId
                })
                return newComment
            } else {
                const newComment = Comments.create({
                    text,
                    user: context.user.id,
                    postId
                })
            }
        },
        addPayment: async (parent, { item_name, item_price, quantity, currency }, context) => {
            const newPayment = await Payments.create({
                item_name,
                item_price,
                quantity,
                value: item_price * quantity,
                currency,
                buyer: context.user.email,
                player_name: context.user.username
            })
            return newPayment
        },
        addPasswordReset: async (parent, { email }) => {
            const user = await Users.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                throw new UserInputError("No user with email.")
            }

            const plainUser = user.get({ plain: true })
            const passwordReset = await PasswordResets.findOne({
                where: {
                    userId: plainUser.id,
                    used: false
                }
            })

            if (passwordReset) {
                throw new UserInputError("Password reset already exists!")
            }

            const newReset = await PasswordResets.create({
                userId: plainUser.id
            })

            const newResetPlain = newReset.get({ plain: true })

            passwordResetRequest(email, newResetPlain.id)

            return newResetPlain

        },
        updatePasswordReset: async (parent, { id, newPassword }) => {
            console.log(id)
            await PasswordResets.update({
                used: true
            }, {
                where: {
                    id: id
                },
            }).then(async () => {
                const passwordReset = await PasswordResets.findByPk(id, {
                    include: { model: Users }
                })
                const plainPasswordReset = passwordReset.get({ plain: true })
                console.log(plainPasswordReset)

                await Users.update({ password: newPassword }, {
                    where: {
                        id: plainPasswordReset.userId
                    }
                })

                const user = await Users.findByPk(plainPasswordReset.userId)
                const plainUser = user.get({ plain: true })

                passwordResetResponse(plainUser.email)
            })
        }
    }
}

module.exports = resolvers;