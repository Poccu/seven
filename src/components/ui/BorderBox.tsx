import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'

type Props = {
  children: any
}

const BorderBox = ({ children }: Props) => {
  return (
    <Box
      sx={{
        border: 2,
        borderRadius: 2,
        boxShadow: 7,
        borderColor: grey[900],
        backgroundColor: '#151515',
      }}
    >
      {children}
    </Box>
  )
}

export default BorderBox
