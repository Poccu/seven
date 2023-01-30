import { FC } from 'react'
import { Box } from '@mui/material'
import FriendList from './FriendList'
import Menu from './menu/Menu'

const Sidebar: FC = () => {
  return (
    <Box sx={{ position: 'fixed', width: '280px' }}>
      <Menu />
      <FriendList />
    </Box>
  )
}

export default Sidebar
