import { FC } from 'react'
import { Container, Typography, Box } from '@mui/material'
import Socials from './Socials'

const Footer: FC = () => {
  return (
    <footer>
      <Box sx={{ pb: 4 }}>
        <Container maxWidth="sm">
          <Socials />
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
