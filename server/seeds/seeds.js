const sequelize = require('../config/connection')
const {ForumCatagories, Users, Posts} = require("../models")

const forumCatagoriesData = require("./forumCatagories.json");
const userData = require('./users.json')
const postData = require('./posts.json');

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

    process.exit(0)
} catch (e) {
    console.log(e)
}
}

seedDatabase();