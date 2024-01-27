import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button, Image, Icon, IconButton, Img} from "@chakra-ui/react"
import navBackgroundImg from "../assets/NavImgs/HeaderBar.png"
import DiscordIconClicked from "../assets/NavImgs/DiscordIconClicked.png"
import DiscordIconDefault from "../assets/NavImgs/DiscordIconDefault.png"
import DownloadButtonClicked from "../assets/NavImgs/DownloadButtonClicked.png"
import DownloadButtonDefault from "../assets/NavImgs/DownloadButtonDefault.png"
import ForumIconClicked from "../assets/NavImgs/ForumIconClicked.png"
import ForumIconDefault from "../assets/NavImgs/ForumIconDefault.png"
import OnlineText from "../assets/NavImgs/OnlineText.png"
import Auth from "../utils/auth"

export default function NavBar() {
    const logout = (event) => {
        event.preventDefault()
        Auth.logout();
    }

    return (
        <Box bgImage={navBackgroundImg} backgroundSize='105%' backgroundPosition='top center' display="block" pos="relative" bgRepeat='no-repeat' zIndex='1000' bgColor='#11ffee00'>
            <Box bgImage={OnlineText} backgroundSize='auto' display="block" height="5vh" bgRepeat="no-repeat" bgPos='center' pos='relative' boxSizing='border-box'></Box>
            <Box display={{ base: 'none', md: 'flex'}}>
                {Auth.loggedIn() ? (
                    <>
                    <Img id='navLink' as={Link} to="/forum" bgImage={ForumIconDefault} bgSize="contain" height="186px">
                    </Img>
                    </>
                ) : (
                    <>
                    <IconButton id='navLink' as={Link} to="/forum" bgImage={ForumIconDefault} bgSize="cover" variant='' bgRepeat='no-repeat' bgPos="center" height='5vh'/>
                    </>
                )}
            </Box>
        </Box>
    )
}