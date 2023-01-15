import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Link } from 'react-router-dom'

type Props = {}

const Header = (props: Props) => {
  return (
    <header>
      <Box sx={{ backgroundColor: grey[900] }}>
        <Link to="/">Header</Link>
      </Box>
    </header>
  )
}

export default Header
