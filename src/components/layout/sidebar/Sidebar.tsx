import { FC } from 'react'
import { Box } from '@mui/material'
import FriendList from './FriendList'
import Menu from './menu/Menu'

const Sidebar: FC = () => {
  return (
    <Box sx={{ position: 'sticky', top: '80px', mr: -2 }}>
      <Menu />
      <FriendList />
    </Box>
  )
}

export default Sidebar
