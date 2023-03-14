import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGlobalState } from '../../types'

const preferredLanguage = navigator.language.slice(0, 2) === 'ru' ? 'ru' : 'en'
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)')
  .matches
  ? 'light'
  : 'dark'

const initialState = {
  language: preferredLanguage,
  theme: preferredTheme,
  isLoggedIn: false,
} as IGlobalState

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLangRU(state) {
      state.language = 'ru'
    },
    setLangEN(state) {
      state.language = 'en'
    },
    setThemeLight(state) {
      state.theme = 'light'
    },
    setThemeDark(state) {
      state.theme = 'dark'
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload
    },
  },
})

export default globalSlice.reducer
