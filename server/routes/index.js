const router = require("express").Router()
const orders = require("./api/orders")

router.use("/orders", orders)

module.exports = router