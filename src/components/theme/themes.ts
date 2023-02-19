import { createTheme, responsiveFontSizes } from '@mui/material'
import { grey } from '@mui/material/colors'

export let themeLight = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#b59261',
    },
    secondary: {
      main: grey[500],
    },
    background: {
      default: '#e9e9e9',
      paper: grey[50],
    },
    text: {
      primary: '#000000',
      secondary: grey[600],
    },
    warning: {
      main: '#000000',
      light: '#000000',
      dark: '#000000',
    },
    action: {
      active: '#cecece',
      activatedOpacity: 0.1,
      hover: grey[200],
      hoverOpacity: 0.1,
      focus: grey[200],
      focusOpacity: 0.1,
      selected: grey[300],
      selectedOpacity: 0.1,
      disabled: grey[100],
    },
    divider: grey[300],
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '0.9rem',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#333333',
            minHeight: 24,
            border: '3px solid #e9e9e9',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor: grey[600],
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor: grey[600],
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: grey[600],
            },
        },
      },
    },
  },
})
themeLight = responsiveFontSizes(themeLight)

export let themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b59261',
    },
    secondary: {
      main: grey[700],
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: grey[50],
      secondary: grey[500],
    },
    action: {
      active: '#313131',
      activatedOpacity: 0.1,
      hover: grey[900],
      hoverOpacity: 0.1,
      focus: grey[900],
      focusOpacity: 0.1,
      selected: grey[800],
      selectedOpacity: 0.1,
      disabled: '#1c1c1c',
    },
    divider: grey[900],
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '0.9rem',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#cccccc',
            minHeight: 24,
            border: '3px solid #121212',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor: grey[600],
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor: grey[600],
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: grey[600],
            },
        },
      },
    },
  },
})
themeDark = responsiveFontSizes(themeDark)
