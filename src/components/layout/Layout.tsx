import { FC, ReactElement } from 'react'

import { Container } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import { Analytics } from '@vercel/analytics/react'

import { useAppSelector } from '@hooks/redux'
import { ScrollToTop } from '@layout/ScrollToTop'

import { Sidebar } from './sidebar/Sidebar'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'

type Props = {
  children: ReactElement
}

export const Layout: FC<Props> = ({ children }) => {
  const { isAuth } = useAppSelector((state) => state.user)

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Container maxWidth="lg" sx={{ mt: 10, mb: 2 }}>
          <Grid2 container spacing={4}>
            {isAuth && (
              <Grid2 md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Sidebar />
              </Grid2>
            )}
            <Grid2 xs={12} md={isAuth ? 9 : 12}>
              {children}
            </Grid2>
          </Grid2>
        </Container>
      </main>
      <Footer />
      <Analytics debug={false} />
    </>
  )
}
