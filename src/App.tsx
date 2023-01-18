import { CssBaseline, ThemeProvider } from '@mui/material'
import { useEffect, useState } from 'react'
import './App.css'
import RoutesList from './components/routes/RoutesList'
import { themeDark, themeLight } from './components/theme/themes'

type Props = {}

const App = (props: Props) => {
  const [light, setLight] = useState(true) // set light/dark theme

  // localStorage
  // useEffect(() => {
  //   setLight(JSON.parse(localStorage.getItem('light')))
  // }, [])

  useEffect(() => {
    if (light !== null) {
      localStorage.setItem('light', JSON.stringify(light))
    }
  }, [light])

  return (
    <ThemeProvider theme={light ? themeLight : themeDark}>
      <CssBaseline />
      <RoutesList
      // light={light} setLight={setLight}
      />
    </ThemeProvider>
  )
}

export default App
