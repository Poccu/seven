import { styled, Box } from '@mui/material'

export const BorderBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderRadius: '10px',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
}))

export const SettingsBox = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.action.disabled,
  // backgroundColor: theme.palette.background.paper,
}))
