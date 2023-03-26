import { alpha, Button, styled } from '@mui/material'

export const ThemeButton = styled(Button)(({ theme }) => ({
  fontSize: 22,
  color: theme.palette.primary.main,
  borderRadius: 30,
  height: 58,
  padding: '0 24px',
  border: '2px solid',
  borderColor: alpha(theme.palette.primary.main, 1),
  '&:hover': {
    border: '2px solid',
    borderColor: alpha(theme.palette.primary.main, 0),
    backgroundColor: alpha(theme.palette.primary.main, 1),
    color: theme.palette.background.paper,
  },
}))

export const ThemeSmallButton = styled(Button)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.primary.main,
  borderRadius: 30,
  height: 32,
  padding: '0 24px',
  border: '2px solid',
  borderColor: alpha(theme.palette.primary.main, 1),
  '&:hover': {
    border: '2px solid',
    borderColor: alpha(theme.palette.primary.main, 0),
    backgroundColor: alpha(theme.palette.primary.main, 1),
    color: theme.palette.background.paper,
  },
}))
