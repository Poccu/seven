import { FC } from 'react'
import { Box } from '@mui/material'
import UserItems from './UserItems'
import Menu from './menu/Menu'

const Sidebar: FC = () => {
  return (
    <Box sx={{ position: 'fixed', width: '280px' }}>
      <UserItems />
      <Menu />
    </Box>
  )
}

export default Sidebar
