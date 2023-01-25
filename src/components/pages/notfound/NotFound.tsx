import { FC } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ThemeButton } from '../../ui/ThemeButton'
import { BackgroundPaperBox } from '../../ui/ThemeBox'

const NotFound: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 16,
      }}
    >
      <BackgroundPaperBox
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          zIndex: -1,
        }}
      ></BackgroundPaperBox>
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h3" align="center">
          <b>Oops! Page not found 😞</b>
        </Typography>
        <br />
        <Box component={Link} to="/">
          <ThemeButton>
            <b>Home</b>
          </ThemeButton>
        </Box>
        <>
          <Box
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/404-bg.png`}
              alt="Not Found"
              height="100%"
              width="100%"
              draggable={false}
            />
          </Box>
          <Box
            sx={{ mt: 9, mb: 4, display: { md: 'none' } }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/404-bg.png`}
                alt="Not Found"
                height="85%"
                width="85%"
                draggable={false}
              />
            </Box>
          </Box>
        </>
      </Grid>
    </Box>
  )
}

export default NotFound
