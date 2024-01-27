const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Users {
    id: Int
    username: String!
    email: String!
    isForumAdmin: Boolean
    isStoreAdmin: Boolean
}
type ForumCatagories {
    id: Int
    title: String!
    catagoryDescription: String!
    posts: [Posts]
}
type Posts {
    id: Int
    title: String!
    text: String
    image: String
    user: Users
    pinned: Boolean
    catagory: ForumCatagories
    allowComments: Boolean
    createdAt: String
}
type Comments {
    id: Int
    text: String!
    image: String
    user: Users
    postid: Posts
    createdAt: String
}
type Payments {
    id: Int
    item_name: String
    item_value: Int
    quantity: Int
    value: Int
    currency: String
    buyer: Users
    player_name: String
    claimed: Boolean
}
type StoreCatagories {
    id: Int
    title: String
}
type Products {
    id: Int
    name: String!
    price: Int!
    discount: Int
    image_url: String
    catagory: StoreCatagories
}
type Auth {
    token: ID!
    user: Users!
}

type PasswordResets {
    id: String!
    user: Users
    used: Boolean
}

type Query {
    users: [Users]
    userByEmail(email: String!): Users
    userByUsername(username: String!): Users
    forumCatagories: [ForumCatagories]
    forumCatagory(id: Int!, offset: Int): ForumCatagories
    post(postId: Int!): Posts
    storeCatagories: [StoreCatagories]
    storeCatagory(catagoryId: Int!): StoreCatagories
    payments: Payments
    passwordReset(id: String!): PasswordResets
}
type Mutation {
    addUser(username: String!, email: String!, password: String!, allowContact: Boolean): Auth
    login(email: String!, password: String!): Auth
    addPost(title: String!, text: String!, image: String, catagory: String!): Posts
    pinPost(postId: Int!): Posts
    unpinPost(postId: Int!): Posts
    addComment(postId: Int!, text: String!, image: String): Comments
    addPayment(item_name: String!, item_price: Int!, quantity: Int!, currency: String!): Payments
    addPasswordReset(email: String!): PasswordResets
    updatePasswordReset(id: String!, newPassword: String!): PasswordResets
}
`
module.exports = typeDefs