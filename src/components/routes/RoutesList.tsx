import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../layout/Layout'
import Auth from '../pages/auth/Auth'
import NotFound from '../pages/notfound/NotFound'
import { useAuth } from '../providers/useAuth'
import { routes } from './routes'

type Props = {}

const RoutesList = (props: Props) => {
  const { user } = useAuth()

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
                    {route.auth && !user ? <Auth /> : <route.component />}
                  </Layout>
                }
                key={index}
              />
            )
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Box>
  )
}

export default RoutesList
