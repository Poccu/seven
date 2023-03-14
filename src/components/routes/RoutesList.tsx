import { FC } from 'react'
import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '../layout/Layout'
import { Auth } from '../pages/auth/Auth'
import { NotFound } from '../pages/notfound/NotFound'
import { Profile } from '../pages/profile/Profile'
import { routes } from './routes'
import { useAppSelector } from '../../hooks/redux'

export const RoutesList: FC = () => {
  const { isAuth, uid } = useAppSelector((state) => state.user)
  const { isLoggedIn } = useAppSelector((state) => state.global)

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
                  <Layout>
                    {route.auth && !isAuth && !isLoggedIn ? (
                      <Auth />
                    ) : (
                      <route.component />
                    )}
                  </Layout>
                }
                key={`route${index}`}
              />
            )
          })}
          <Route
            path={`/profile/${uid}`}
            element={
              <Layout>
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
