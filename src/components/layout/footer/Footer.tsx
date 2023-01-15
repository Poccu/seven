import { Container, Typography, Box } from '@mui/material'
import Socials from './Socials'

type Props = {}

const Footer = (props: Props) => {
  let currentYear = new Date().getFullYear()

  return (
    <footer>
      <Box
        sx={{
          py: 3,
          // px: 2,
          // mt: 'auto',
          // backgroundColor: (theme) =>
          //   theme.palette.mode === 'light'
          //     ? theme.palette.grey[200]
          //     : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', marginTop: 'calc(2% + 10px)' }}>
            <Box sx={{ mb: 3 }}>
              <Socials />
            </Box>
            <Typography>© ℜossi, 2021 - {currentYear}</Typography>
          </Box>
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
