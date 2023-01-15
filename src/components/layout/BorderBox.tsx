import { Box } from '@mui/material'
import { blueGrey, grey } from '@mui/material/colors'

type Props = {
  children: any
}

const BorderBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        border: 2,
        borderRadius: 2,
        // borderColor: grey[300],
        borderColor: grey[900],
        backgroundColor: grey[900],
      }}
    >
      {children}
    </Box>
  )
}

export default BorderBox
