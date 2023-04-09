import { createSlice } from '@reduxjs/toolkit'

import { IGlobalState } from 'src/types/types'

const preferredLanguage = navigator.language.slice(0, 2) === 'ru' ? 'ru' : 'en'
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)')
  .matches
  ? 'light'
  : 'dark'

const initialState = {
  language: preferredLanguage,
  theme: preferredTheme,
  format: 'module',
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

    setFormatModule(state) {
      state.format = 'module'
    },

    setFormatList(state) {
      state.format = 'list'
    },
  },
})

export const {
  setLangRU,
  setLangEN,
  setThemeLight,
  setThemeDark,
  setFormatModule,
  setFormatList,
} = globalSlice.actions

export const globalReducer = globalSlice.reducer
