import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Theme } from '../../types'
import { Layout } from '../layout/Layout'
import { Auth } from '../pages/auth/Auth'
import { NotFound } from '../pages/notfound/NotFound'
import { Profile } from '../pages/profile/Profile'
import { useAuth } from '../providers/useAuth'
import { routes } from './routes'

export const RoutesList = ({ light, setLight }: Theme) => {
  const { cur } = useAuth()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        margin: 0,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <Router>
        <Routes>
          {routes.map((route, index) => {
            return (
              <Route
                path={route.path}
                element={
                  <Layout light={light} setLight={setLight}>
                    {route.auth && !cur ? <Auth /> : <route.component />}
                  </Layout>
                }
                key={`route${index}`}
              />
            )
          })}
          <Route
            path={`/profile/${cur?.uid}`}
            element={
              <Layout light={light} setLight={setLight}>
                <Profile />
              </Layout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Box>
  )
}
