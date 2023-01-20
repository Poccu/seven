import { Avatar, styled } from '@mui/material'

export const ThemeAvatar = styled(Avatar)(({ theme }) => ({
  width: '46px',
  height: '46px',
  border: '2px solid',
  color: theme.palette.secondary.main,
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.action.disabled,
}))
