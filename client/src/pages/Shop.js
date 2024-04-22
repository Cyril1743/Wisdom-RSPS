import { Box, Button, Container, HStack, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, StackItem, Text, VStack, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { DeleteIcon } from "@chakra-ui/icons"

import StoreBanner from "../assets/StoreImgs/StoreBanner.jpg"
import StoreBackground from "../assets/StoreImgs/StoreBackground.jpg"
import ProductBox from "../assets/StoreImgs/ProductBox.png"
import LoginBox from "../assets/StoreImgs/LoginBox.png"
import AddToCartButton from "../assets/StoreImgs/AddToCart.png"
import AddToCartActiveButton from "../assets/StoreImgs/AddToCartActive.png"
import { useQuery } from '@apollo/client'
import { CHECKSTORECATAGORIES } from '../utils/queries'
import Auth from '../utils/auth'
import { useParams } from 'react-router-dom'


export default function Shop() {
    const initialOptions = {
        "client-id": "ASiQPeijZA7vpUcxoMazi8-eAx4w0WSKnqje4-h8tDNB3_YXne1sPuzTWf8j3LQK7eClQKFbkTgJI0_9",
        "enable-funding": "venmo,card",
        "data-sdk-intergration-source": "intergrationbuilder_sc",
    }

    const {state} = useParams()

    

    const { data, loading } = useQuery(CHECKSTORECATAGORIES)

    const [cart, setCart] = useState({})
    const [quantity, setQuantities] = useState({})
    const [pageState, setPageState] = useState("products")

    if (state === "thankyou" && pageState !== "thankyou"){
        setPageState("thankyou")
    }

    useEffect(() => {
        if (Object.keys(cart).length < 2 && Auth.loggedIn() && Object.keys(cart).length !== 0) {
            setCart({})
        }
    }, [cart])

    if (loading) {
        return <Spinner />
    }

    const handleQuantityChange = (productName, value) => {
        setQuantities(prev => ({ ...prev, [productName]: value }))
    }

    const AddToCart = (productName) => {
        if (Object.keys(cart).length === 0 && Auth.loggedIn()) {
            setCart({ User: Auth.getUsername() })
        }
        if (quantity[productName] > 0) {
            setCart(prev => ({ ...prev, [productName]: quantity[productName] }))
            setQuantities(prev => ({ ...prev, [productName]: 0 }))
        }
    }

    const RemoveFromCart = (productName) => {
        const { [productName]: value, ...newCart } = cart
        if (Object.keys(cart).length < 2 && Auth.loggedIn()) {
            return setCart({})
        } else {
            setCart(newCart)
        }

    }

    const flattenProducts = () => {
        return data.storeCatagories.reduce((acc, category) => [...acc, ...category.products], [])
    }

    const CalculateGrandTotal = (products) => {
        let total = 0;

        Object.entries(cart).forEach(([productName, quantity]) => {
            const product = products.find(p => p.name === productName)
            if (product) {
                const pricePerItem = product.discount !== null ? product.discount : product.price

                total += pricePerItem * quantity
            }
        })
        return total
    }

    const handleLogout = () => {
        Auth.logout()
        window.location.reload()
    }

    function Products() {
        return (
            <>
                <HStack flexDir="row-reverse">
                    {data.storeCatagories[0].products.map((product, index) => {
                        return (
                            <Box key={index} bgImage={ProductBox} boxShadow="xl" borderRadius="md" textAlign="center" bgSize="cover" >
                                <VStack spacing="auto">
                                    <StackItem>
                                        <HStack mt={1}>
                                            <Image src={`/StoreImgs/${product.image_url}.png`} />
                                            <Text color="white" m={0}>{product.name}</Text>
                                        </HStack>
                                    </StackItem>
                                    <StackItem>
                                        <HStack>
                                            {product.discount && (
                                                <Text color="red" as="s">${product.price.toFixed(2)}</Text>
                                            )}
                                            <Text color="#43ac6a" m={0}>${product.discount || product.price}</Text>
                                        </HStack>
                                    </StackItem>
                                    <StackItem>
                                        <NumberInput color="white" min={0} max={100} defaultValue={0} value={quantity[product.name] || 0} onChange={(_, valueAsNumber) => handleQuantityChange(product.name, valueAsNumber)}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper color="white" />
                                                <NumberDecrementStepper color="white" />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </StackItem>
                                    {cart[product.name] > 0 && (
                                        <StackItem>
                                            <HStack>
                                                <IconButton size="xs" aria-label='Remove from cart' colorScheme='red' icon={<DeleteIcon />} onClick={() => RemoveFromCart(product.name)}></IconButton>
                                                <Text m={0} color="white">{cart[product.name]} in your cart</Text>
                                            </HStack>
                                            <HStack spacing={2}>
                                                <Text color="white">Total: </Text>
                                                <Text color="#43ac6a">${cart[product.name] * product?.discount || product.price}</Text>
                                            </HStack>
                                        </StackItem>
                                    )}
                                    <StackItem>
                                        <Button color={"transparent"} h="31px" w="229px" bgImg={AddToCartButton} bgSize="contain" bgRepeat="no-repeat" onClick={() => AddToCart(product.name)} _hover={{
                                            bgImage: AddToCartActiveButton
                                        }}>Add To Cart</Button>
                                    </StackItem>
                                </VStack>
                            </Box>
                        )
                    }
                    )}
                </HStack>
                {Object.keys(cart).length > 0 && (
                    <>
                        <Text fontSize="3xl" color="white">Grand total: ${CalculateGrandTotal(flattenProducts())}</Text>
                        <Button type='button' colorScheme='green' onClick={() => setPageState("checkout")} m="4" shadow="md" _hover={{
                            bg: "teal.600",
                            transform: "scale(1.05)"

                        }} >Checkout</Button>
                    </>
                )}

            </>
        )
    }

    function Checkout() {
        return (
            <Container w="100%">
                <Text fontSize="3xl" color="white">Your total is: ${CalculateGrandTotal(flattenProducts())}</Text>
                <PayPalButtons
                    style={{
                        shape: "pill",
                        layout: "vertical"
                    }}
                    createOrder={async () => {
                        try {
                            const response = await fetch("/api/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    cart: {
                                        user: Auth.getUsername(),
                                        cart: cart
                                    }
                                })
                            });

                            const orderData = await response.json();

                            if (orderData.id) {
                                return orderData.id;
                            } else {
                                const errorDetail = orderData?.details?.[0];
                                const errorMessage = errorDetail ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})` : JSON.stringify(orderData)

                                throw new Error(errorMessage)
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                    }
                    onApprove={async (data, actions) => {
                        try {
                            const response = await fetch(
                                `/api/orders/${data.orderID}/capture`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            );

                            const orderData = await response.json()

                            const errorDetail = orderData?.details?.[0];

                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                return actions.restart()
                            } else if (errorDetail) {
                                throw new Error(
                                    `${errorDetail.description} (${orderData.debug_id})`
                                )
                            } else {
                                const transaction = orderData.purchase_units[0].payments.captures[0]
                                actions.redirect("/store/thankyou")
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }} />
            </Container>
        )
    }

    function ThankYou() {
        return (
            <>
            <Text fontSize="5xl" color="white">Thank you for your purchase!</Text>
            <Text fontSize="3xl" color="white">Don't forget to claim them in game. You may now close this page.</Text>
            </>
        )
    }

    function renderContent(pageState) {
        switch (pageState) {
            case 'products':
                return <Products />
            case 'checkout':
                return <Checkout />
            case 'thankyou':
                return <ThankYou />
            default:
                return <Products />
        }
    }
    return (
        <PayPalScriptProvider options={initialOptions}>
            <Box bgImage={StoreBanner} pt="70px" pb="300px" bgSize="100% 100%" bgRepeat="no-repeat"></Box>
            <Container bgImage={StoreBackground} minH="100vh" minW="100%" pt="10%" bgSize="100% 100%">
                <HStack justify={pageState === "products" ? "space-between" : ''} overflow="auto">
                    <StackItem>
                        <Container>
                            <Box bgImage={LoginBox} w="30vw" h="90vh" bgSize="100% 100%" bgRepeat="no-repeat">
                                <Container>
                                    {Auth.loggedIn() ? (
                                        <>
                                            <Text pt="10" pl="5" fontSize={{ base: "5xl", sm: '1xl', md: '4xl' }} color="white">Logged in as {Auth.getUsername()}</Text>
                                            <Button type="button" colorScheme="red" onClick={handleLogout}> Logout</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Text pt="10" pl="5" fontSize="3xl" color="white">You are not logged in!</Text>
                                            <HStack>
                                                <StackItem>
                                                    <Button type="button" colorScheme="purple" onClick={() => window.location.href = '/signup'} m={4} shadow="md" _hover={{
                                                        bg: "purple.800",
                                                        transform: "scale(1.05)"
                                                    }}>Sign Up</Button>
                                                </StackItem>
                                                <StackItem>
                                                    <Button type="button" colorScheme="green" onClick={() => window.location.href = "/login"} m={4} shadow="md" _hover={{
                                                        bg: 'teal.600',
                                                        transform: 'scale(1.05)'
                                                    }}>Login in</Button>
                                                </StackItem>
                                            </HStack>
                                        </>
                                    )}

                                </Container>
                            </Box>
                        </Container>
                    </StackItem>
                    <StackItem flex={1}>
                        <Container w="100%">
                            {renderContent(pageState)}
                        </Container>
                    </StackItem>
                </HStack>
            </Container>
        </PayPalScriptProvider>
    )
}