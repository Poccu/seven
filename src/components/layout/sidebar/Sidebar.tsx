import { Box } from '@mui/material'
import UserItems from './UserItems'
import Menu from './menu/Menu'
import BorderBox from '../../ui/BorderBox'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <Box sx={{ position: 'fixed', width: '280px' }}>
      <Box sx={{ mb: 2 }}>
        <BorderBox>
          <UserItems />
        </BorderBox>
      </Box>
      <Menu />
    </Box>
  )
}

export default Sidebar
