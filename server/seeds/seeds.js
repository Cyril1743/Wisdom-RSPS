const sequelize = require('../config/connection')
const {ForumCatagories, Users, Posts, Comments, StoreCatagories, Products} = require("../models")

const forumCatagoriesData = require("./forumCatagories.json");
const userData = require('./users.json')
const postData = require('./posts.json');
const commentData = require("./comments.json")
const storeCatagoriesData = require("./storeCatagories.json")
const productsData = require("./products.json")

const seedDatabase = async () => {
    try {
    await sequelize.sync({force: true});

    await ForumCatagories.bulkCreate( forumCatagoriesData, {
        individualHooks: true
    })

    await Users.bulkCreate(userData, {
        individualHooks: true
    })

    await Posts.bulkCreate(postData, {
        individualHooks: true
    })
    
    await Comments.bulkCreate(commentData, {
        individualHooks: true
    })

    await StoreCatagories.bulkCreate(storeCatagoriesData, {
        individualHooks: true
    })

    await Products.bulkCreate(productsData)
    
    process.exit(0)
} catch (e) {
    console.log(e)
}
}

seedDatabase();