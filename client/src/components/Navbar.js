import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button, Image, Icon, IconButton, Img, Flex, useUnmountEffect } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom'
import navBackgroundImg from "../assets/NavImgs/HeaderBar.png"
import DiscordIconClicked from "../assets/NavImgs/DiscordIconClicked.png"
import DiscordIconDefault from "../assets/NavImgs/DiscordIconDefault.png"
import DownloadButtonClicked from "../assets/NavImgs/DownloadButtonClicked.png"
import DownloadButtonDefault from "../assets/NavImgs/DownloadButtonDefault.png"
import ForumIconClicked from "../assets/NavImgs/ForumIconClicked.png"
import ForumIconDefault from "../assets/NavImgs/ForumIconDefault.png"
import HiscoresButtonClicked from "../assets/NavImgs/HiscoresButtonClicked.png"
import HiscoresButtonDefault from "../assets/NavImgs/HiscoresButtonDefault.png"
import VoteButtonDefault from "../assets/NavImgs/VoteButtonDefault.png"
import OnlineText from "../assets/NavImgs/OnlineText.png"
import Auth from "../utils/auth"

export default function NavBar() {
    const navigate = useNavigate()

    const logout = (event) => {
        event.preventDefault()
        Auth.logout();
    }

    return (
        <Box bgImage={navBackgroundImg} backgroundSize="105%" backgroundPosition='top center' pos="relative" bgRepeat='no-repeat' zIndex='1000' bgColor='#11ffee00'>
            <Flex justify="center" pos="relative" zIndex="1001">
                <Image src={OnlineText} alt='IsOnline' maxH="5vh" mt="1"/>
            </Flex>
            <Flex justify="space-between" align="center" px="4" display={{ base: 'none', md: 'flex' }}>
                <Flex align="center">
                    <Image src={ForumIconDefault} alt='Forum' mr="2" boxSize="100px" onClick={() => navigate('/forum')} />
                </Flex>
                <Flex>
                    <Image src={HiscoresButtonDefault} alt='Highscores' mr="2" boxSize="50px" />
                    <Image src={VoteButtonDefault} alt='Vote' mr="2" boxSize="100px" />
                </Flex>
            </Flex>
        </Box>
    )
}