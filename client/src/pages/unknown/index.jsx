import { Box, Typography } from '@mui/material'
import React from 'react'
import VideoCover from 'react-video-cover'
import BackgroundVideo from '../../assets/BackgroundVideo.mp4'
import logo from '../../assets/tealNoBG-cropped.png'
import '../../App.css'


const Unknown = () => {
	return (
		<Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        width='100vw'
        height='100vh'
        id='background'
      >
        <Box
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <VideoCover
            videoOptions={{
              src: BackgroundVideo,
              autoPlay: true,
              loop: true,
              muted: true,
            }}
          />
        </Box>
        <Box id='home-page-box' display='flex' flexDirection='column' justifyContent='center' alignItems='center' p={5}>
          <img src={logo} alt='med-chain-logo' style={{ height: 50 }} />
          <Box mt={2} mb={5}>
            <Typography variant='h4' color='white'>
              Own Your Health
            </Typography>
          </Box>
          <Typography variant='h4' color='white'>
              if you are a Patient ask your Doctor register yourself<br/><br/>
			  if you are a Doctor ask your Admin register yourself
            </Typography>
          <Box display='flex' alignItems='center' mt={2}>
            <Typography variant='h5' color='white'>
              powered by{' '}
            </Typography>
            <Box mx={1}>
              <img
                src='https://cdn.worldvectorlogo.com/logos/ethereum-1.svg'
                alt='Ethereum logo vector'
                style={{ height: 20 }}
              ></img>
            </Box>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png'
              alt='Ethereum logo vector'
              style={{ height: 20 }}
            ></img>
          </Box>
        </Box>
      </Box>
	)
}

export default Unknown;