import { Box, styled } from '@mui/material'
import { FC } from 'react'

type Props = {
  children: any
}

const ThemeBox = styled(Box)(({ theme }) => ({
  border: '2px solid',
  borderRadius: '10px',
  boxShadow: '0px 0px 5px 1px rgba(0, 0, 0, 0.1)',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
}))

const BorderBox: FC<Props> = ({ children }) => {
  return <ThemeBox>{children}</ThemeBox>
}

export default BorderBox
