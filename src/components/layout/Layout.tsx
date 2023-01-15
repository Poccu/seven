import { Container } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import Sidebar from './sidebar/Sidebar'
import Header from './header/Header'
import Footer from './footer/Footer'

type Props = {
  children: any
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 md={3}>
            <Sidebar />
          </Grid2>
          <Grid2 md={9}>
            <>{children}</>
          </Grid2>
        </Grid2>
      </Container>
      <Footer />
    </>
  )
}

export default Layout
