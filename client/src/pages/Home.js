//Import nessicary components
import React, { useState } from "react";
import { AspectRatio, Box, Grid, GridItem, Image, VStack } from "@chakra-ui/react";

//Imports for the images and videos
import backgroundVideo from '../assets/HomePageImgs/BackgroundVideo.mp4'
import backgroundImage from '../assets/HomePageImgs/EventImgs/Background.jpg'
import logo from "../assets/HomePageImgs/WisdomLogoTextOnly.png"
import EventSides from "../assets/HomePageImgs/EventImgs/EventSides.png"
import BattlePassImg from "../assets/HomePageImgs/EventImgs/BattlePassImg.jpg"
import BossingImg from "../assets/HomePageImgs/EventImgs/BossingImg.jpg"
import CoXImg from "../assets/HomePageImgs/EventImgs/CoXImg.jpg"
import GulagImg from "../assets/HomePageImgs/EventImgs/GulagImg.jpg"
import ToBImg from "../assets/HomePageImgs/EventImgs/ToBImg.jpg"

//Imports for the controls for the carousel
import LeftSwapIcon from "../assets/HomePageImgs/EventImgs/LeftSwapIcon.png"
import RightSwapIcon from "../assets/HomePageImgs/EventImgs/RightSwapIcon.png"

//Imports for the news and updates
import LatestUpdates from "../assets/HomePageImgs/NewsAndUpdateImages/UpdateImages/LatestUpdates.png"
import LatestNews from '../assets/HomePageImgs/NewsAndUpdateImages/NewsImages/LatestNews.png'
import Button1 from '../assets/HomePageImgs/NewsAndUpdateImages/Button1.png'
import Button2 from '../assets/HomePageImgs/NewsAndUpdateImages/Button2.png'
import Button3 from '../assets/HomePageImgs/NewsAndUpdateImages/Button3.png'
import Button4 from '../assets/HomePageImgs/NewsAndUpdateImages/Button4.png'
import Button5 from '../assets/HomePageImgs/NewsAndUpdateImages/Button5.png'
import Button6 from '../assets/HomePageImgs/NewsAndUpdateImages/Button6.png'


export default function Home() {

    //Functionality for the carousel
    const [currentCarouselIndex, setCurrentIndex] = useState(0)
    const imagesForSlides = [CoXImg, ToBImg, BattlePassImg, GulagImg, BossingImg]
    const SlideTitles = ['Chambers of Xeric', 'Theatre of Blood', 'BattlePass', 'Gulag', 'Bossing']
    const SlideDescriptions =
        ['You asked, and we made it happen! Chamberes of Xeric is available to play! Go in solo or with friends! Use the Magic Book or type ::raids to get started',
            'We listened to your requests for more content, and we took your suggestions about adding Theatre of Blood. So without further-a-do, Theatre of Blood is now available to play! Go to the Magic Book, then Minigames, then Theatre of Blood to get started',
            'Introducing BattlePass! Costing only $10 to start! Fight your way through monsters to earn BattlePass XP or go skilling to unlock and earn powerful rewards. Teleport to Home and talk to the BattlePass Fairy to get started!',
            "Gulag is a PVP event which takes place every hour. Teleport to Home and go to the red portal to get started. Items are given to you at the start of the event.",
            'Bossing is a great way tp power up your character or make money! If you need help with a boss, ask a friend or someone in game and fight together!'
        ]
    const goToPrevious = () => {
        const isFirstItem = currentCarouselIndex === 0;
        const newIndex = isFirstItem ? imagesForSlides.length - 1 : currentCarouselIndex - 1;
        setCurrentIndex(newIndex)
    }

    const goToNext = () => {
        const isLastItem = currentCarouselIndex === imagesForSlides.length - 1;
        const newIndex = isLastItem ? 0 : currentCarouselIndex + 1
        setCurrentIndex(newIndex)
    }

    //Functionality for the news and updates
    return (
        <div>
            <Box>
                <AspectRatio pos={'relative'} height="100vh" width={'100%'}>
                    <Box>
                        <video autoPlay loop muted style={{
                            position: 'absolute',
                            width: '100%',
                            left: '0',
                            top: '0',
                            objectFit: 'cover',
                            height: "100%",
                            zIndex: -1
                        }}>

                            <source src={backgroundVideo} type="video/mp4" />
                        </video>
                        <img src={logo} style={{
                            maxWidth: '100%',
                            display: "inline-block",
                            verticalAlign: 'middle'
                        }} alt="Wisdom Logo" />
                    </Box>
                </AspectRatio>
            </Box>
            <Box bgImage={backgroundImage}>
                <Box className="slides-container" display='flex' justifyContent='center' alignItems="center">
                    <button className="slidesButton" onClick={goToPrevious}>
                        <img className="leftSwipeIcon" src={LeftSwapIcon} alt="Left Swipe Icon" />
                    </button>
                    <Image className="slides-item-container" src={EventSides} bgImage={imagesForSlides[currentCarouselIndex]} bgSize='auto' bgRepeat="no-repeat" maxW="100%" bgPos="center" pos="relative" style={{ backgroundPositionY: '140px, 140px' }} />
                    <Box className="slides-caption" display={{ base: 'none', md: 'block' }}>
                        <h3 className="slides-title">{SlideTitles[currentCarouselIndex]}</h3>
                        <p>{SlideDescriptions[currentCarouselIndex]}</p>
                    </Box>
                    <button className="rightSwipeIcon" onClick={goToNext}>
                        <img src={RightSwapIcon} alt="Right Swipe Icon" />
                    </button>
                </Box>
                <Grid templateColumns='100px repeat(2, 1fr) 100px' gap={2}>
                    <GridItem w='100%'>

                        <Image src={Button1} alt="Go to first news" cursor="pointer" />
                        <Image src={Button2} alt="Go to second news" cursor="pointer" />
                        <Image src={Button3} alt="Go to third news" cursor="pointer" />
                        <Image src={Button4} alt="Go to fourth news" cursor="pointer" />
                        <Image src={Button5} alt="Go to fifth news" cursor="pointer" />
                        <Image src={Button6} alt="Go to sixth news" cursor="pointer" />

                    </GridItem>
                    <GridItem bgImage={LatestNews} bgPos={'bottom'} bgRepeat={"no-repeat"} h="50vh" w={"100%"}></GridItem>
                    <GridItem bgImage={LatestUpdates} bgPos={"bottom"} bgRepeat={"no-repeat"} h={"50vh"} w={"100%"}></GridItem>
                    <GridItem w={'100%'}>
                        <VStack>
                            <Image src={Button1} alt="Go to first news" cursor="pointer" />
                            <Image src={Button2} alt="Go to second news" cursor="pointer" />
                            <Image src={Button3} alt="Go to third news" cursor="pointer" />
                            <Image src={Button4} alt="Go to fourth news" cursor="pointer" />
                            <Image src={Button5} alt="Go to fifth news" cursor="pointer" />
                            <Image src={Button6} alt="Go to sixth news" cursor="pointer" />
                        </VStack>
                    </GridItem>
                </Grid>
            </Box>
        </div>
    )
}