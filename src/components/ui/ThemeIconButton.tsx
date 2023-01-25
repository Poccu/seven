import { IconButton, styled } from '@mui/material'

export const ThemeIconButton = styled(IconButton)(({ theme }) => ({
  width: '35px ',
  height: '35px',
  backgroundColor: theme.palette.primary.main,
  border: '3px solid',
  borderColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}))

export const ThemeLikeIconButton = styled(IconButton)(({ theme }) => ({
  width: '30px ',
  height: '30px',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}))
