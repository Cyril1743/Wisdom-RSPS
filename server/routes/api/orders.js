require("dotenv").config()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const {Products} = require("../../models")
const orders = require('express').Router()

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env
const base = "https://api-m.sandbox.paypal.com"

const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS")
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
        ).toString("base64")
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`
            }
        })

        const data = await response.json()
        return data.access_token;
    } catch (error) {
        console.log("Failed to get Access Token", error)
    }
}

const fetchProducts = async (cart) => {
    const productNames = Object.keys(cart).filter(key => key !== "User")
    const products = []
    console.log(cart)

    for (const name of productNames) {
        const product = await Products.findOne({
            where: {
                name : name
            }
        })
        const plainProduct = product.get({plain: true})
        products.push({
            name: plainProduct.name,
            price: plainProduct.price,
            discount: product.discount,
            quantity: cart[name]
        })
    }
    console.log(products)
    return products
}

const calculateGrandTotal = (products) => {
    return products.reduce((total, {price, discount, quantity}) => {
        const finalPrice = discount ? discount : price
        return total += (finalPrice * quantity)
    }, 0)
}

const createOrder = async (cart) => {
    console.log ("shopping cart information passed from the frontend createOrder() callback:",
    cart)
    const products = await fetchProducts(cart)
    const grandTotal = calculateGrandTotal(products)

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units : [
            {
                amount: {
                    currency_code: "USD",
                    value: grandTotal.toString()
                }
            }
        ]
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload)
    })

    return handleResponse(response)
}

const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
        }
    })

    return handleResponse(response)
}

async function handleResponse(response) {
    try {
        const jsonResponse = await response.json()
        return {
            jsonResponse,
            httpStatusCode: response.status
        }
    } catch (error) {
        const errorMessage = await response.text()
        throw new Error(errorMessage)
    }
}

orders.post("/", async (req, res) => {
    try {
        const {cart} = req.body.cart
        console.log("This is the cart", cart.cart)
        if (!cart){
            return res.status(406).json({error: "Cart is empty"})
        }
        const {jsonResponse, httpStatusCode} = await createOrder(cart)
        res.status(httpStatusCode).json(jsonResponse)
    } catch (error) {
        console.error("Failed to create order:", error)
        res.status(500).json({ error: "Failed to create order"})
    }
})

orders.post("/orders/:orderID/capture", async (req, res) => {
try {
    const {orderID} = req.params;
    const {jsonResponse, httpStatusCode} = await captureOrder(orderID)
    res.status(httpStatusCode).json(jsonResponse)
} catch (error) {
    console.error("Failed to create order:", error)
    res.status(500).json({error: "Failed to capture order."})
}
})

module.exports = orders