import { FC } from 'react'
import { Box } from '@mui/material'
import { Menu } from './menu/Menu'

export const Sidebar: FC = () => {
  return (
    <Box sx={{ position: 'sticky', top: '80px', mr: -2 }}>
      <Menu />
    </Box>
  )
}
