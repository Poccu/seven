import { FC } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material'

import { useAppSelector } from '@hooks/redux'

import { RoutesList } from './components/routes/RoutesList'
import { themeDark, themeLight } from './components/theme/themes'
import './App.css'

export const App: FC = () => {
  const { theme } = useAppSelector((state) => state.global)

  return (
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
      <CssBaseline />
      <RoutesList />
    </ThemeProvider>
  )
}
