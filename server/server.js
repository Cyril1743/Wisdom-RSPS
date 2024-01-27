//Consts for the server imports
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const {rateLimit} = require('express-rate-limit')
require("dotenv").config()

//Consts for Apollo and connecting to the database
const { typeDefs, resolvers } = require("./schemas/index");
const db = require("./config/connection");

//Consts for the server
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});
const limiter = rateLimit({
    windowMs: 15*60*1000,
    limit: 100
})

//Disallowing the urlencoded makes queries forced into the request headers and allowing json lets us send json responses
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Use the rate limiter to prevent brute force attacks
app.use(limiter)
app.set('trust proxy', 2)

//If the environment is in production, then set the client build file as the static file
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../client/build")))
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
});

app.post('/forum/clientId', (req, res) => {
    res.send({clientId: process.env.IMGUR_CLIENT_ID})
})

const startApolloServer = async () => {
    await server.start();
    server.applyMiddleware({ app });

    db.sync().then(
        app.listen(PORT, () => {
            console.log(`App listening at http://localhost:${PORT}`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    )
}
startApolloServer();