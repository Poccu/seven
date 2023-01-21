import { Box, styled } from '@mui/material'
import { FC } from 'react'

type Props = {
  children: any
}

const ThemeBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderRadius: '10px',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
}))

const BorderBox: FC<Props> = ({ children }) => {
  return <ThemeBox>{children}</ThemeBox>
}

export default BorderBox
