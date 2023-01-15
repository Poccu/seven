import { CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import Footer from './components/layout/footer/Footer'
import RoutesList from './components/routes/RoutesList'
import { themeDark, themeLight } from './components/theme/themes'

type Props = {}

const App = (props: Props) => {
  return (
    <>
      <ThemeProvider
        // theme={light ? themeLight : themeDark}
        theme={themeDark}
      >
        <CssBaseline />
        <RoutesList />
      </ThemeProvider>
    </>
  )
}

export default App
