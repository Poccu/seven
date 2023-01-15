import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from '../layout/footer/Footer'
import Layout from '../layout/Layout'
import NotFound from '../pages/notfound/NotFound'
import { routes } from './routes'

type Props = {}

const RoutesList = (props: Props) => {
  const isAuth = true
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
            if (route.auth && !isAuth) {
              return false
            }

            return (
              <Route
                path={route.path}
                element={
                  <Layout>
                    <route.component />
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
