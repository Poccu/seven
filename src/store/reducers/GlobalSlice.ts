import { createSlice } from '@reduxjs/toolkit'

import { IGlobalState } from 'src/types'

const preferredLanguage = navigator.language.slice(0, 2) === 'ru' ? 'ru' : 'en'
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)')
  .matches
  ? 'light'
  : 'dark'

const initialState = {
  language: preferredLanguage,
  theme: preferredTheme,
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
  },
})

export const { setLangRU, setLangEN, setThemeLight, setThemeDark } =
  globalSlice.actions

export default globalSlice.reducer
