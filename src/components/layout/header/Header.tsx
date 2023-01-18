import { AppBar, Box, Container, IconButton, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { Theme } from '../../../types'

const Header = ({ light, setLight }: Theme) => {
  return (
    <header>
      <Box sx={{ mb: 8 }}>
        <AppBar
          position="fixed"
          color="primary"
          elevation={0}
          sx={{ boxShadow: 3 }}
        >
          <Container>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Link to="/">
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ height: '60px', ml: 1 }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
                    alt="Seven"
                    height="50px"
                    width="50px"
                    draggable={false}
                  />
                </Box>
              </Link>
              <Box sx={{ mr: 1 }}>
                {!light ? (
                  <IconButton
                    onClick={() => setLight(true)}
                    color="inherit"
                    size="large"
                    title="Change Theme to Light Mode"
                    sx={{ width: '50px ', height: '50px' }}
                  >
                    <DarkModeOutlined fontSize="inherit" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => setLight(false)}
                    color="inherit"
                    size="large"
                    title="Change Theme to Dark Mode"
                    sx={{ width: '50px ', height: '50px' }}
                  >
                    <LightModeOutlined fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Container>
        </AppBar>
      </Box>
    </header>
  )
}

export default Header
