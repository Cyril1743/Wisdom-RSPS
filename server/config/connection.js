const Sequelize = require('sequelize');
require('dotenv').config()

let sequelize;

// if (process.env.NODE_ENV === 'production') {
//     sequelize = new Sequelize(
//         process.env.DB_WEBSITE_NAME,
//         process.env.DB_WEBSITE_USER,
//         process.env.DB_WEBSITE_PW,
//         {
//             host: 'srv549.hstgr.io',
//             dialect: "mysql",
//             port: 3306
//         }
//     )
// } else {
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL)
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PW,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    )
}

module.exports = sequelize;