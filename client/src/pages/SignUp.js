import React, { useEffect, useState } from "react";
import { FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, InputGroup, InputRightElement, Box, Text, Container, Button, Checkbox } from "@chakra-ui/react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECKUSERNAME, CHECKEMAIL } from "../utils/queries";
import { ADDUSER } from "../utils/mutations";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    //States to store the data of the form
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [passwordShow, setPasswordShow] = useState(false)
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)
    const [allowContact, setAllowContact] = useState(true)

    const navigate = useNavigate()

    const [checkUsername] = useLazyQuery(CHECKUSERNAME, {
        onCompleted: (result) => {
            if (result.userByUsername) {
                setUsernameError("Username already in use")
            }
        }
    })
    const [checkEmail] = useLazyQuery(CHECKEMAIL, {
        onCompleted: (result) => {
            if (result.userByEmail) {
                setEmailError('Email already in use')
            }
        }
    })
    const [addUser] = useMutation(ADDUSER)

    //Functions to control the functionality of the form
    //UseEffect for checking email
    useEffect(() => {
        const handleEmailCheck = () => {
            if (email.length > 0 && /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(email)) {
                checkEmail({
                    variables: {email: email}
                })
            }
        }

        const timer = setTimeout(() => {
            handleEmailCheck()
        }, 1000)

        return () => clearTimeout(timer)
    }, [email, checkEmail])

    //UseEffect for checking the username
    useEffect(() => {
        const handleUsernameCheck = () => {
            if (username.length > 0) {
                checkUsername({
                    variables: {username: username}
                })
            }
        }

        const timer = setTimeout(() => {
            handleUsernameCheck()
        }, 1000)

        return () => clearTimeout(timer)
    }, [checkUsername, username])

    const handleEmailChange = (e) => {
        setEmailError('');
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPasswordError('');
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPasswordError(false)
        setConfirmPassword(e.target.value)
    }

    const handleUsernameChange = (e) => {
        setUsernameError('')
        setUsername(e.target.value)
    }

    const handleEmailBlur = (e) => {
        if (e.target.value === '' || !/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(e.target.value)) {
            return setEmailError("Invalid Email adress")
        }
    }

    const handlePasswordBlur = (e) => {
        if (e.target.value === '' || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=.])[A-Za-z\d@$!%*?&#^()_\-+=.]{8,16}$/.test(e.target.value)) {
            return setPasswordError(true)
        }
    }

    const handleConfirmPasswordBlur = (e) => {
        if (confirmPassword !== password) {
            setConfirmPasswordError(true)
        }
    }

    const handleUsernameBlur = (e) => {
        if (e.target.value === '' || !/^[a-zA-Z0-9_-]{3,15}$/.test(e.target.value)) {
            setUsernameError("Invalid Username")
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        if (username !== '' && email !== '' && password !== '') {
            try {
                const { data } = await addUser({
                    variables: { username: username, email: email, password: password, allowContact: allowContact }
                })
                Auth.login(data.addUser.token)
                navigate('/')
            } catch (e) {
                if(e.message.includes("User already exists with email")){
                    alert("Email already in use. Proceed to login")
                    window.location.href = '/login'
                }
            }
        }
    }


    return (
        <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={6} minH={{ base: '100%', sm: '100vh' }}>
            <Text fontSize="6xl" textAlign='center' color='white'>Welcome to Wisdom!</Text>
            <Container boxShadow='dark-lg' borderRadius="6px" >
                <form onSubmit={handleFormSubmit}>
                    <FormControl isInvalid={usernameError} isRequired aria-required>
                        <FormLabel id="usernameLabel" htmlFor="username" color="white">Username:</FormLabel>
                        <Input
                            id="username"
                            autoComplete="true"
                            focusBorderColor="#8c34eb"
                            boxShadow='dark-lg'
                            boxSizing="border-box"
                            width="100%"
                            padding="12px 20px"
                            m="8px 0"
                            border="2px solid #8c34eb"
                            color="white"
                            type="text"
                            value={username}
                            placeholder="Username"
                            onChange={handleUsernameChange}
                            onBlur={handleUsernameBlur}
                            maxLength={12}
                        />
                        {usernameError ? (
                            <FormErrorMessage>
                                {usernameError}
                            </FormErrorMessage>
                        ) : (<FormHelperText>
                            Pick a username between 3-15 charcters using letters, numbers, and only _ or -
                        </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl isInvalid={emailError} isRequired aria-required>
                        <FormLabel id="emailLabel" htmlFor="email" color="white">Email:</FormLabel>
                        <Input
                            id="email"
                            autoComplete="true"
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
                                {emailError}
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={passwordError} isRequired aria-required>
                        <FormLabel id="passwordLabel" htmlFor="password" color="white">Password:</FormLabel>
                        <InputGroup>
                            <Input
                                id="password"
                                autoComplete="new-password"
                                focusBorderColor="#8c34eb"
                                boxShadow='dark-lg'
                                boxSizing="border-box"
                                width="100%"
                                padding="12px 20px"
                                m="8px 0"
                                border="2px solid #8c34eb"
                                color="white"
                                type={passwordShow ? "text" : "password"}
                                value={password}
                                placeholder="Password"
                                onChange={handlePasswordChange}
                                onBlur={handlePasswordBlur}
                            />
                            <InputRightElement w='4.5 rem' m="8px 0">
                                <Button tabIndex='-1' h='1.75 rem' size="sm" colorScheme="purple" onMouseEnter={() => setPasswordShow(!passwordShow)} onMouseLeave={() => setPasswordShow(!passwordShow)} >{passwordShow ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                        {passwordError ? (
                            <FormErrorMessage>
                                Invalid password
                            </FormErrorMessage>
                        ) : (
                            <FormHelperText>
                                Pick a strong password 8-16 characters long containing at least one uppercase letter, one lowercase letter, one number, and at least one special character
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl isInvalid={confirmPasswordError} isRequired aria-required>
                        <FormLabel id="confirmPasswordLabel" htmlFor="confirmPassword" color="white">Confirm Password:</FormLabel>
                        <InputGroup>
                            <Input
                                id="confirmPassword"
                                autoComplete="true"
                                focusBorderColor="#8c34eb"
                                boxShadow='dark-lg'
                                boxSizing="border-box"
                                width="100%"
                                padding="12px 20px"
                                m="8px 0"
                                border="2px solid #8c34eb"
                                color="white"
                                type={confirmPasswordShow ? "text" : "password"}
                                value={confirmPassword}
                                placeholder="Confirm Password"
                                onChange={handleConfirmPasswordChange}
                                onBlur={handleConfirmPasswordBlur}
                            />
                            <InputRightElement w='4.5 rem' m="8px 0">
                                <Button tabIndex='-1' h='1.75 rem' size="sm" colorScheme="purple" onMouseEnter={() => setConfirmPasswordShow(!confirmPasswordShow)} onMouseLeave={() => setConfirmPasswordShow(!confirmPasswordShow)} >{confirmPasswordShow ? 'Hide' : 'Show'}</Button>
                            </InputRightElement>
                        </InputGroup>
                        {confirmPasswordError && (
                            <FormErrorMessage>
                                Passwords do not match
                            </FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl>
                        <Checkbox defaultChecked value={allowContact} color="white" m={4} onClick={() => setAllowContact(!allowContact)}>Agree to email</Checkbox>
                    </FormControl>
                    <FormControl>
                        <Button type="submit" colorScheme="purple" onClick={handleFormSubmit} m='4' shadow='md' _hover={{
                            bg: 'purple.800',
                            transform: 'scale(1.05)'
                        }}> Sign Up
                        </Button>
                        <Button type="button" colorScheme="green" onClick={() => window.location.href = "/login"} m={4} shadow="md" _hover={{
                            bg: 'teal.600',
                            transform: 'scale(1.05)'
                        }}>Login in</Button>
                    </FormControl>
                </form>
            </Container>
        </Box>
    )
}