import { FC } from 'react'
import { Container } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import Sidebar from './sidebar/Sidebar'
import Header from './header/Header'
import Footer from './footer/Footer'
import { useAuth } from '../providers/useAuth'

type Props = {
  children: any
  light: boolean
  setLight: React.Dispatch<React.SetStateAction<boolean>>
}

const Layout: FC<Props> = ({ children, light, setLight }) => {
  const { cur } = useAuth()

  return (
    <>
      <Header light={light} setLight={setLight} />
      <main>
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid2 container spacing={4}>
            <Grid2 md={cur && 3}>{cur && <Sidebar />}</Grid2>
            <Grid2 md={cur ? 9 : 12}>
              <>{children}</>
            </Grid2>
          </Grid2>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default Layout
