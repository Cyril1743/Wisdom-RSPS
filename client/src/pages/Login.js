import React, { useState } from "react";
import { FormControl, FormLabel, FormErrorMessage, Input, InputGroup, InputRightElement, Container, Button, Text, Box, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../utils/mutations";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    //States to store the data of the form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordShow, setPasswordShow] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    //Functions to control the functionality of the form
    const handleEmailChange = (e) => {
        setEmailError(false);
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPasswordError(false);
        setPassword(e.target.value);
    }

    const handleEmailBlur = (e) => {
        if (e.target.value === '' || !/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(e.target.value)) {
            return setEmailError(true)
        }
    }

    const handlePasswordBlur = (e) => {
        if (e.target.value === '') {
            return setPasswordError('Password is required')
        }
    }

    const [login] = useMutation(LOGIN);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (email !== '' && password !== '') {
            //Use the useMutation hook to validate the form data
            try {
                const { data } = await login({
                    variables: { email, password }
                });
                Auth.login(data.login.token)
                onOpen()
            } catch (error) {
                if (error.message.includes('Incorrect password')) {
                    setPasswordError("Incorrect password")
                } else {
                    alert(error)
                }
            }
            setEmail('');
            setPassword('');
        }
    }

    return (
        <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" h={'100vh'}>
            <Text fontSize='6xl' textAlign={'center'} color="white">Welcome Back to Wisdom!</Text>
            <Container boxShadow='dark-lg' borderRadius="6px">
                <form onSubmit={handleFormSubmit}>
                    <FormControl isInvalid={emailError} isRequired aria-required>
                        <FormLabel id="emailLabel" htmlFor="email" color="white">Email:</FormLabel>
                        <Input
                            id="email"
                            autoComplete="email"
                            focusBorderColor="#8c34eb"
                            boxShadow='dark-lg'
                            boxSizing="border-box"
                            width="100%"
                            padding="12px 20px"
                            m="8px 0"
                            border="2px solid #8c34eb"
                            color="white"
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                        />
                        {emailError && (
                            <FormErrorMessage>
                                Invalid email
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={passwordError} isRequired aria-required>
                        <FormLabel id="passwordLabel" htmlFor="password" color="white">Password:</FormLabel>
                        <InputGroup>
                            <Input
                                id="password"
                                autoComplete="current-password"
                                focusBorderColor="#8c34eb"
                                boxShadow='dark-lg'
                                boxSizing="border-box"
                                border="2px solid #8c34eb"
                                m="8px 0"
                                width="100%"
                                padding="12px 20px"
                                color="white"
                                type={passwordShow ? 'text' : 'password'}
                                value={password}
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                            />
                            <InputRightElement w={'4.5 rem'} m="8px 0">
                                <Button h={'1.75rem'} size='sm' colorScheme="purple" onMouseEnter={() => setPasswordShow(!passwordShow)} onMouseLeave={() => setPasswordShow(!passwordShow)} >{passwordShow ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                        {passwordError && (
                            <FormErrorMessage>
                                {passwordError}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl>
                        <Button type="button" colorScheme="green" onClick={handleFormSubmit} m={4} shadow="md"
                            _hover={{
                                bg: "teal.600",
                                transform: "scale(1.05)"
                            }}>Submit</Button>
                        <Button type="button" colorScheme="purple" onClick={() => window.location.href = '/signup'} m={4} shadow="md" _hover={{
                            bg: "purple.800",
                            transform: "scale(1.05)"
                        }}>Sign Up</Button>
                        <Button type="button" colorScheme="red" onClick={() => window.location.href = '/passwordreset'} m={4} shadow='md' _hover={{
                            bg: 'red.800',
                            transform: 'scale(1.05)'
                        }}>Forgot Password?</Button>
                    </FormControl>
                </form>
            </Container>
            <Modal isOpen={isOpen} onClose={() => {
                onClose()
                navigate("/")
            }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Password Reset</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Login Successful
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            onClose()
                            navigate("/")
                        }}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}