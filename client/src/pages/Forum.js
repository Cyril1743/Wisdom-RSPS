import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardBody, Heading, Container, Spinner, Text, Flex, Spacer, FormControl, FormLabel, Input, Textarea, FormHelperText, Image } from "@chakra-ui/react";
import { CloseIcon, StarIcon } from "@chakra-ui/icons";
import { useMutation, useQuery } from "@apollo/client";
import { CHECKFORUMCATAGORY } from "../utils/queries";
import { useNavigate, useParams } from "react-router-dom";
import Auth from "../utils/auth"
import { PINPOST, UNPINPOST } from "../utils/mutations";
import { ImgurClient } from 'imgur'

export default function Forum() {
    const navigate = useNavigate()
    const { forumId } = useParams()
    const fileInputRef = useRef()

    const [currentPage, setCurrentPage] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [images, setImages] = useState([])
    const [filePreviews, setFilePreviews] = useState([])

    const clientSecret = fetch('/forum/clientId', {
        method: "POST"
    }).then((response) => response.json())
    const clientId = clientSecret.clientId

    const client = new ImgurClient({ clientId: clientId })

    const { loading, data } = useQuery(CHECKFORUMCATAGORY, {
        variables: { id: +forumId, offset: currentPage * 50 }
    })

    const [pinPost] = useMutation(PINPOST)

    const [unpinPost] = useMutation(UNPINPOST)

    useEffect(() => {
        if (!loading && data && data.forumCatagory.posts.length === 50) {
            setHasNextPage(false)
        }
    }, [loading, data, hasNextPage])

    useEffect(() => {
        const newFilePreviews = images.map(image => URL.createObjectURL(image))
        setFilePreviews(newFilePreviews)
        return () => {
            newFilePreviews.forEach(filePreview => URL.revokeObjectURL(filePreview))
        }
    }, [images])

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

    const sortedPosts = [...data.forumCatagory.posts].sort((a, b) => {
        return b.pinned - a.pinned
    })

    const starIconPinProps = Auth.isForumAdmin() && {
        _hover: { color: "yellow.400" },
        cursor: "pointer"
    }

    const starIconUnpinProps = Auth.isForumAdmin() && {
        _hover: { color: "gray.800" },
        cursor: "pointer"
    }

    const handleLogout = () => {
        Auth.logout()
        window.location.reload()
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

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const totalFiles = images.length + files.length
        if (totalFiles > 3) {
            return
        }
        const filteredFiles = files.filter(file => file.size <= 10000000)
        setImages(prevImages => [...prevImages, ...filteredFiles])

        const filePreviews = filteredFiles.map(file => URL.createObjectURL(file))
        setFilePreviews(filePreviews)
    }

    const handleImageDeletion = (imageP) => {
        const updatedImages = images.filter(image => image.name !== imageP.name)
        const updatedFilePreviews = filePreviews.filter((_, index) => images[index].name !== imageP.name)
        setImages(updatedImages)
        setFilePreviews(updatedFilePreviews)
    }

    const handleNewPost = async (e) => {
        e.preventDefault()
        if (images.length > 0) {

            for (const image of images) {
                const formData = new FormData()
                formData.append("image", image)
                try {
                    const response = await client.upload({
                        image: formData
                    })
                    const data = await response.json()
                    console.log(data)
                    await new Promise(resolve => setTimeout(resolve, 2000))

                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

    return (
        <Box bgGradient="linear(to-r, #24102c, #110914, #24102c)" p={6} minH='100Vh'>
            <Container textAlign="center">
                <Text fontSize="6xl" color='white'>{data.forumCatagory.title}</Text>
                <Card variant="outline" size="sm" bgColor="gray.800" direction="row" p="0">
                    <CardBody p="0">
                        {Auth.loggedIn() ?
                            <>
                                <Text color="white">{`Browsing as ${Auth.getUsername()}`}</Text>
                                <Button type="button" colorScheme="red" onClick={handleLogout}> Logout</Button>
                            </>
                            :
                            <>
                                <Button type="button" colorScheme="green" onClick={() => navigate("/login")} m={4} shadow="md"
                                    _hover={{
                                        bg: "teal.600",
                                        transform: "scale(1.05)"
                                    }}>Login</Button>
                                <Text color="white" m="0">or</Text>
                                <Button type="button" colorScheme="purple" onClick={() => navigate("/signup")} m={4} shadow="md" _hover={{
                                    bg: "purple.800",
                                    transform: "scale(1.05)"
                                }}>Sign Up</Button>
                            </>}
                    </CardBody>
                </Card>
                {sortedPosts.map(post => {
                    return (
                        <Container key={post.id} color="white" boxShadow="dark-lg" borderRadius="6px" marginTop="4" mb="4">
                            <Flex alignItems="center" justifyContent="space-evenly">{post.pinned ? <StarIcon {...starIconUnpinProps} onClick={() => handleUnpinPost(post.id)} /> : <StarIcon color="gray.800"  {...starIconPinProps} onClick={() => handlePinPost(post.id)} />}
                                <Heading>{post.title.trim()}</Heading>
                            </Flex>
                            <Text>{post.text.substring(0, 50).trim()}{post.text.length > 50 ? "..." : ""}</Text>
                            <Button type="button" colorScheme="orange" onClick={() => navigate(`/forum/${data.forumCatagory.id}/post/${post.id}`)}>View post</Button>
                        </Container>
                    )
                })}
                <Flex>
                    <Button type='button' isDisabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Prev</Button>
                    <Spacer />
                    <Text color="white"> Page {currentPage + 1}</Text>
                    <Spacer />
                    <Button type="button" isDisabled={hasNextPage}> Next</Button>
                </Flex>
                {Auth.loggedIn() &&
                    <>
                        <Text fontSize="5xl" color="white" marginTop="6">New post in {data.forumCatagory.title}</Text>
                        <form onSubmit={handleNewPost}>
                            <FormControl>
                                <FormLabel id="titleLabel" htmlFor="title" color="white">Title:</FormLabel>
                                <Input
                                    id="title"
                                    type="text"
                                    focusBorderColor="#8c34eb"
                                    boxShadow='dark-lg'
                                    boxSizing="border-box"
                                    border="2px solid #8c34eb"
                                    m="8px 0"
                                    width="100%"
                                    padding="12px 20px"
                                    color="white"
                                    value={title}
                                    onChange={handleTitleChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel id="textLabel" htmlFor="text" color="white">Text:</FormLabel>
                                <Textarea
                                    id="text"
                                    focusBorderColor="#8c34eb"
                                    boxShadow='dark-lg'
                                    boxSizing="border-box"
                                    border="2px solid #8c34eb"
                                    m="8px 0"
                                    width="100%"
                                    padding="12px 20px"
                                    color="white"
                                    value={text}
                                    maxLength="2000"
                                    onChange={handleTextChange}
                                    overflowY="hidden"
                                    resize="none"
                                    style={{ height: textAreaHeight }}
                                    onInput={onInput}
                                />
                                <FormHelperText color="white">
                                    {2000 - text.length} characters remaining
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel id="fileLabel" htmlFor="file" color="white">Files:</FormLabel>
                                <Flex>
                                    <Button type="button" onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click()
                                        }
                                    }}>Upload Files</Button>
                                    <Text display="inline" color="white" ml="4"> {images.length} {images.length === 1 ? "file" : "files"} selected</Text>
                                    <Input
                                        id="file"
                                        ref={fileInputRef}
                                        type="file"
                                        variant="unstyled"
                                        color="white"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        display="none"
                                    />
                                </Flex>
                                <FormHelperText>
                                    <Text>Max 3 Images</Text>
                                    <Text>10 MB max</Text>
                                    {images.length > 0 ? (
                                        images.map((image, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Text>{image.name}</Text>
                                                    <CloseIcon _hover={{
                                                        cursor: "pointer"
                                                    }} onClick={() => handleImageDeletion(image)} color="red"></CloseIcon>
                                                    <Image src={`${filePreviews[index]}`} alt="Preview"></Image>

                                                </React.Fragment>
                                            )
                                        })
                                    ) :
                                        ''}
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <Button type="submit" colorScheme="green" onClick={handleNewPost}>Post</Button>
                            </FormControl>
                        </form>
                    </>}
            </Container>
        </Box>
    )
}