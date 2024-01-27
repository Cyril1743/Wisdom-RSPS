import { useQuery, useMutation } from '@apollo/client'
import { Box, Container, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, Button, ModalFooter, InputRightElement, InputGroup } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CHECKRESET } from '../utils/queries'
import { ADDRESETREQUEST, UPDATEPASSWORDRESET } from '../utils/mutations'


export default function PasswordReset() {
    //Get the request id from the url if it is there
    const { passwordResetId } = useParams()
    const navigate = useNavigate()

    //States to handle the form data
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')
    const [newPasswordShow, setNewPasswordShow] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [modalUrl, setModalUrl] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    //Consts for the queries and mutations
    const { data, loading } = useQuery(CHECKRESET, {
        variables: { id: passwordResetId },
        skip: !passwordResetId
    })

    const [addResetRequest] = useMutation(ADDRESETREQUEST)
    const [updatePasswordReset] = useMutation(UPDATEPASSWORDRESET)

    //Functions for the functionality of the request form
    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        setEmailError('')
    }
    const handleEmailBlur = (e) => {
        if (e.target.value === "" || !/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(e.target.value)) {
            setEmailError("Invalid email")
        }
    }
    const handleRequestFormSubmit = async (e) => {
        e.preventDefault()
        try {
            await addResetRequest({
                variables: { email: email }
            })
            setModalMessage('If there is an email associated with this account, then a password reset will be sent to the email. Make sure to check spam folders for the email. The request will expire in 1 hour.')
            onOpen()
        } catch (e) {
            if (e.message.includes('No user with email')) {
                setEmailError('No user with email')
            } else {
                setEmailError('Password reset already exists')
            }
        }
    }

    //Functions for the functionality of the reset form
    const handlePasswordChange = (e) => {
        setNewPasswordError("")
        setNewPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPasswordError('')
        setConfirmPassword(e.target.value)
    }

    const handlePasswordBlur = (e) => {
        if (e.target.value === "" || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=.])[A-Za-z\d@$!%*?&#^()_\-+=.]{8,16}$/.test(e.target.value)) {
            setNewPasswordError("Invalid Password")
        }
    }

    const handleConfirmPasswordBlur = (e) => {
        if (confirmPassword !== newPassword) {
            setConfirmPasswordError("Password do not match")
        }
    }


    const handleNewPasswordFormSubmit = async (e) => {
        e.preventDefault()
        if (data.passwordReset.used) {
            setModalMessage("Password reset already used. Please try again")
            setModalUrl('/passwordreset')
            onOpen()
        }
        try {
            if (newPassword && !newPasswordError){
            await updatePasswordReset({
                variables: { id: passwordResetId, newPassword: newPassword }
            })
            setModalMessage('Password updated')
            setModalUrl('/login')
            onOpen()
        }
        } catch (e) {
            alert(e)
        }

    }
    useEffect(() => {
        if (!loading) {
            if (passwordResetId && !data) {
                setModalMessage("Invalid reset token, please try again")
                setModalUrl("/passwordreset")
                onOpen()
            }
        }
    }, [data, onOpen, passwordResetId, loading])

    if (passwordResetId && data) {
        return (
            <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={6} h='100Vh'>
                <Text fontSize="6xl" textAlign='center' color='white'>Password Reset</Text>
                <Text fontSize="1xl" textAlign='center' color='white'>Reset your password with the form below</Text>
                <Container boxShadow='dark-lg' borderRadius="6px" >
                    <form onSubmit={handleNewPasswordFormSubmit}>
                        <FormControl isInvalid={newPasswordError} isRequired aria-required>
                            <FormLabel id='newPassword' htmlFor='newPassword' color="white">New Password:</FormLabel>
                            <InputGroup>
                                <Input
                                    id='newPassword'
                                    autoComplete='new-password'
                                    focusBorderColor="#8c34eb"
                                    boxShadow='dark-lg'
                                    boxSizing="border-box"
                                    width="100%"
                                    padding="12px 20px"
                                    m="8px 0"
                                    border="2px solid #8c34eb"
                                    color="white"
                                    type={newPasswordShow ? 'text' : 'password'}
                                    value={newPassword}
                                    placeholder='New Password'
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                />
                                <InputRightElement w='4.5 rem' m="8px 0">
                                    <Button tabIndex='-1' h='1.75 rem' size="sm" colorScheme="purple" onMouseEnter={() => setNewPasswordShow(!newPasswordShow)} onMouseLeave={() => setNewPasswordShow(!newPasswordShow)} >{newPasswordShow ? 'Hide' : 'Show'}</Button>
                                </InputRightElement>
                            </InputGroup>
                            {newPasswordError ? (
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
                            <FormLabel id='confirmNewPassword' htmlFor='confirmNewPassword' color="white">Confirm Password:</FormLabel>
                            <InputGroup>
                                <Input
                                    id='confirmNewPassword'
                                    autoComplete='true'
                                    focusBorderColor="#8c34eb"
                                    boxShadow='dark-lg'
                                    boxSizing="border-box"
                                    width="100%"
                                    padding="12px 20px"
                                    m="8px 0"
                                    border="2px solid #8c34eb"
                                    color="white"
                                    type={confirmPasswordShow ? 'text' : 'password'}
                                    value={confirmPassword}
                                    placeholder='New Password'
                                    onChange={handleConfirmPasswordChange}
                                    onBlur={handleConfirmPasswordBlur}
                                />
                                <InputRightElement w='4.5 rem' m="8px 0">
                                    <Button tabIndex='-1' h='1.75 rem' size="sm" colorScheme="purple" onMouseEnter={() => setConfirmPasswordShow(!confirmPasswordShow)} onMouseLeave={() => setConfirmPasswordShow(!confirmPasswordShow)} >{confirmPasswordShow ? 'Hide' : 'Show'}</Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        {confirmPasswordError && (
                            <FormErrorMessage>
                                {confirmPasswordError}
                            </FormErrorMessage>
                        )}
                        <FormControl>
                            <Button type="submit" colorScheme="purple" onClick={handleNewPasswordFormSubmit} m='4' shadow='md' _hover={{
                                bg: 'purple.800',
                                transform: 'scale(1.05)'
                            }}> Reset Password
                            </Button>
                        </FormControl>
                    </form>
                </Container>
                <Modal isOpen={isOpen} onClose={() => {
                    onClose()
                    if (modalUrl) {
                        navigate(modalUrl)
                        setModalUrl('')
                    }
                }}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Password Reset</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {modalMessage}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={() => {
                                onClose()
                                if (modalUrl) {
                                    navigate(modalUrl)

                                    setModalUrl('')

                                }
                            }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        )
    } else {
        return (
            <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={6} h='100Vh'>
                <Text fontSize="6xl" textAlign='center' color='white'>Password Reset</Text>
                <Text fontSize="1xl" textAlign='center' color='white'>Reset your password with the form below</Text>
                <Container boxShadow='dark-lg' borderRadius="6px" >
                    <form onSubmit={handleRequestFormSubmit}>
                        <FormControl isInvalid={emailError} isRequired aria-required>
                            <FormLabel id='emailLabel' htmlFor='email' color='white'>Email:</FormLabel>
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
                            {emailError ? (
                                <FormErrorMessage>
                                    {emailError}
                                </FormErrorMessage>
                            ) : (
                                <FormHelperText>
                                    Use the email you signed up with
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl>
                            <Button type='button' colorScheme='green' onClick={handleRequestFormSubmit} m='4' shadow='md' _hover={{
                                bg: 'teal.600',
                                transform: 'scale(1.05)'
                            }}>Submit</Button>
                            <Button type='button' colorScheme='purple' onClick={() => window.location.href = "/login"} m='4' shadow='md' _hover={{
                                bg: "purple.800",
                                transform: 'scale(1.05)'
                            }}>Back to Login</Button>
                        </FormControl>
                    </form>
                </Container>
                <Modal isOpen={isOpen} onClose={() => {
                    onClose()
                    if (modalUrl) {
                        navigate(modalUrl)
                        setModalUrl('')
                    }
                }}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Password Reset</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {modalMessage}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={() => {
                                onClose()
                                if (modalUrl) {
                                    navigate(modalUrl)

                                    setModalUrl('')

                                }
                            }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        )
    }
}