import { FC, useEffect, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { RoutesList } from './components/routes/RoutesList'
import { themeDark, themeLight } from './components/theme/themes'
import './App.css'

export const App: FC = () => {
  const [light, setLight] = useState(true) // set light/dark theme

  // localStorage
  useEffect(() => {
    let value = localStorage.getItem('light')
    if (value !== null) {
      setLight(JSON.parse(value) === true)
    }
  }, [])

  useEffect(() => {
    if (light !== null) {
      localStorage.setItem('light', JSON.stringify(light))
    }
  }, [light])

  return (
    <ThemeProvider theme={light ? themeLight : themeDark}>
      <CssBaseline />
      <RoutesList light={light} setLight={setLight} />
    </ThemeProvider>
  )
}
