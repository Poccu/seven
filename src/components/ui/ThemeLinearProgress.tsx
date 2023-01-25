import { alpha, LinearProgress, styled } from '@mui/material'

export const ThemeLinearProgress = styled(LinearProgress)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.35),
}))
