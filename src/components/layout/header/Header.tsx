import { AppBar, Box, Container } from '@mui/material'
import { Link } from 'react-router-dom'

type Props = {}

const Header = (props: Props) => {
  return (
    <header>
      <Box sx={{ mb: 8 }}>
        <AppBar
          position="fixed"
          color="primary"
          elevation={0}
          sx={{ boxShadow: 7, display: { xs: 'none', md: 'block' } }}
        >
          <Container>
            <Box
              sx={{
                // flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Link to="/">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
                  alt="Seven"
                  height="60px"
                  width="60px"
                  draggable={false}
                />
              </Link>
            </Box>
          </Container>
        </AppBar>
      </Box>
    </header>
  )
}

export default Header
