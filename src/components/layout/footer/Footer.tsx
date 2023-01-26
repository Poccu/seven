import { FC } from 'react'
import { Container } from '@mui/material'
import Socials from './Socials'

const Footer: FC = () => {
  return (
    <footer>
      <Container maxWidth="sm" sx={{ pb: 4 }}>
        <Socials />
      </Container>
    </footer>
  )
}

export default Footer
