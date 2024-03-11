import React, { useState, useCallback } from "react";
import { Box, Button, Container, Divider, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Spinner, Text, Textarea } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import { CHECKPOST } from "../utils/queries";
import { Link, useParams } from "react-router-dom";
import Auth from "../utils/auth";
import { NEWCOMMENT } from "../utils/mutations";

export default function Post() {

    const { postId } = useParams()
    const { data, loading, refetch } = useQuery(CHECKPOST, {
        variables: { postId: +postId }
    })
    const [newComment] = useMutation(NEWCOMMENT)

    const [text, setText] = useState('')
    const [textError, setTextError] = useState(false)

    const formatDate = (timestamp) => {
        const date = new Date(+timestamp)
        return date.toLocaleString("en-us", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    }

    const handleTextChange = (e) => {
        setTextError(false)
        setText(e.target.value)
    }

    const handleTextBlur = (e) => {
        if (e.target.value === "") {
            setTextError(true)
        }
    }

    const handleTextSubmit = async (e) => {
        e.preventDefault()
        if (text !== "") {
            setText("")
            try {
                await newComment({
                    variables: { postId: +postId, text: text }
                })
                refetch()
                window.scrollTo(0, 0)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const useTextareaAutosize = () => {
        const [textAreaHeight, setTextAreaHeight] = useState('auto')

        const onInput = useCallback((e) => {
            setTextAreaHeight('auto')
            setTextAreaHeight(`${e.target.scrollHeight}px`)
        }, [])

        return { textAreaHeight, onInput }
    }

    const { textAreaHeight, onInput } = useTextareaAutosize()

    if (loading) {
        return <Spinner />
    }

    return (
        <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={6} minH="100vh">
            <Text fontSize="6xl" textAlign="center" color="white">{data.post.title}</Text>
            <Text fontSize="3xl" textAlign="center" color="white">{data.post.text}</Text>
            <Text fontSize="1xl" textAlign="left" color="white">{data.post.user.username} on {formatDate(data.post.createdAt)}</Text>
            <Divider />
            {data.post.comments.length > 0 && (
                <Container>
                    <Text fontSize="5xl" textAlign="center" color="white">Comments:</Text>
                    {data.post.comments.map((comment, index) => {
                        return (
                            <Container key={index}>
                                <Text fontSize="2xl" color="white">{comment.text}</Text>
                                <Text fontSize="1xl" color="white">{comment.user.username} at {formatDate(comment.createdAt)}</Text>
                                <Divider />
                            </Container>)
                    })}
                </Container>
            )}

            {Auth.loggedIn() ?
                (
                    <Container>
                        <Text fontSize="5xl" textAlign="center" color="white">Post a Comment:</Text>
                        <form>
                            <FormControl isInvalid={textError} isRequired aria-required>
                                <FormLabel id="textLabel" htmlFor="text" color="white">Your comment:</FormLabel>
                                <Textarea
                                    id="text"
                                    focusBorderColor="#8c34eb"
                                    boxShadow='dark-lg'
                                    boxSizing="border-box"
                                    width="100%"
                                    padding="12px 20px"
                                    m="8px 0"
                                    border="2px solid #8c34eb"
                                    color="white"
                                    type="text"
                                    value={text}
                                    placeholder="Your thoughts here..."
                                    onChange={handleTextChange}
                                    onBlur={handleTextBlur}
                                    maxLength="2000"
                                    overflowY="hidden"
                                    resize="none"
                                    style={{ height: textAreaHeight }}
                                    onInput={onInput}
                                />
                                {textError ? (
                                    <FormErrorMessage>
                                        A comment is required.
                                    </FormErrorMessage>
                                ) : (
                                    <FormHelperText>
                                        Posting as {Auth.getUsername()}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl>
                                <Button type="button" colorScheme="purple" onClick={handleTextSubmit} m={4} shadow="md"
                                    _hover={{
                                        bg: "purple.800",
                                        transform: "scale(1.05)"
                                    }}>Submit</Button>
                            </FormControl>
                        </form>
                    </Container>
                )
                :
                (
                    <>
                        <Flex justify="space-evenly">
                            <Text textDecoration="underline" fontSize="5xl" color="#5E2BFF" as={Link} to={"/login"}>Log in</Text><Text fontSize="5xl" textAlign="center" color="white"> or </Text><Text fontSize="5xl" textAlign="right" textDecoration="underline" as={Link} to={"/signup"} color="#5E2BFF" >Sign Up</Text>
                        </Flex>
                        <Text textAlign="center" fontSize="4xl" color="white">to post comments</Text>
                    </>
                )

            }
        </Box>
    )
}