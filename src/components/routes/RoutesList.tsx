import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Box } from '@mui/material'

import { useAppSelector } from '@hooks/redux'

import { Auth } from '@pages/auth/Auth'
import { NotFound } from '@pages/notfound/NotFound'
import { Profile } from '@pages/profile/Profile'
import { Layout } from '@layout/Layout'
import { routes } from './routes'

export const RoutesList: FC = () => {
  const { isAuth, uid } = useAppSelector((state) => state.user)

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
          {routes.map((route, index) => (
            <Route
              path={route.path}
              element={
                <Layout>
                  {route.auth && isAuth ? <route.component /> : <Auth />}
                </Layout>
              }
              key={`route${index}`}
            />
          ))}
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
