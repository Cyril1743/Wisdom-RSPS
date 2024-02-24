import React from "react";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Container, Spinner, StackDivider, Text, VStack } from '@chakra-ui/react'
import { StarIcon } from "@chakra-ui/icons"
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { CHECKFORUMCATAGORIES } from "../utils/queries";
import Auth from "../utils/auth";
import { PINPOST, UNPINPOST } from "../utils/mutations";

export default function Forums() {
    const navigate = useNavigate()
    const { data, loading } = useQuery(CHECKFORUMCATAGORIES)
    const [pinPost] = useMutation(PINPOST)
    const [unpinPost] = useMutation(UNPINPOST)

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

    const starIconPinProps = Auth.isForumAdmin() && {
        _hover: { color: "yellow.400" },
        cursor: "pointer"
    }

    const starIconUnpinProps = Auth.isForumAdmin() && {
        _hover: { color: "gray.800" },
        cursor: "pointer"
    }

    const handlePinPost = async (postId) => {
        try {
            Auth.isForumAdmin() &&
                await pinPost({
                    variables: { postId: postId }
                }).then(() => window.location.reload())
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleUnpinPost = async (postId) => {
        try {
            Auth.isForumAdmin() &&
                await unpinPost({
                    variables: { postId: postId }
                }).then(() => window.location.reload())
        } catch (e) {
            console.log(e)
        }
    }


    if (loading) {
        return <Spinner />
    }
    const sortedPosts = data.forumCatagories.map(catagory => {
        const sortedPosts = [...catagory.posts].sort((a, b) => {
            return b.pinned - a.pinned
        })
        return {
            ...catagory,
            posts: sortedPosts
        }
    })

    return (
        <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={10} minH="100vh">
            <Text fontSize="6xl" textAlign='center' color='white'>Wisdom Forums</Text>
            <Container>
                <Accordion allowToggle color="white">
                    {sortedPosts.map(catagory => {
                        return (
                            <AccordionItem key={catagory.id}>
                                <h2>
                                    <AccordionButton _expanded={{ bg: "purple.200", color: "black" }}>
                                        <Box as="span" flex="1" textAlign="center">
                                            {catagory.title}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb="4">
                                    <VStack spacing="2" divider={<StackDivider borderColor="gray.200" />}>
                                        {catagory.posts.map(post => {
                                            return (
                                                <Container key={post.id}>
                                                    {post.pinned ? <StarIcon {...starIconUnpinProps} onClick={() => handleUnpinPost(post.id)} /> : <StarIcon color="gray.800"  {...starIconPinProps} onClick={() => handlePinPost(post.id)} />}
                                                    <Text fontWeight="bold">{post.title}</Text>
                                                    <Text noOfLines='1'>
                                                        {post.text.substring(0, 50).trim()}{post.text.length > 50 ? "..." : ""}
                                                    </Text>
                                                    <Text fontSize="sm">Posted By: {post.user.username} at {formatDate(post.createdAt)}</Text>
                                                    <Button type="button" colorScheme="purple" m={4} onClick={() => navigate(`/forum/${catagory.id}/post/${post.id}`)} _hover={{
                                                        bg: 'purple.800',
                                                        transform: "scale(1.05)"
                                                    }}>View Post</Button>
                                                </Container>
                                            )
                                        })}
                                    </VStack>
                                    <Button type="button" colorScheme="green" m={4} onClick={() => navigate(`/forum/${catagory.id}`)} _hover={{
                                        bg: "teal.600",
                                        transform: "scale(1.05)"
                                    }}>{`See all posts in ${catagory.title}`}</Button>
                                </AccordionPanel>
                            </AccordionItem>)
                    })}
                </Accordion>
            </Container>
        </Box>
    )
}